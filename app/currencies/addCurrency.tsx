import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import Button from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";

export default function AddCurrency() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !symbol || !exchangeRate) {
      Alert.alert("Greška", "Sva polja su obavezna.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/currencies`, {
        name,
        symbol,
        exchange_rate: parseFloat(exchangeRate),
      });
      Alert.alert("Uspeh", "Valuta dodata uspešno.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Greška:", error);
      Alert.alert("Greška", "Dodavanje nije uspelo.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Button title="← Back" variant="back" onPress={() => router.back()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.label}>Naziv</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="npr. Euro"
            />

            <Text style={styles.label}>Simbol</Text>
            <TextInput
              style={styles.input}
              value={symbol}
              onChangeText={setSymbol}
              placeholder="npr. €"
            />

            <Text style={styles.label}>Kurs</Text>
            <TextInput
              style={styles.input}
              value={exchangeRate}
              onChangeText={setExchangeRate}
              placeholder="npr. 117.5"
              keyboardType="decimal-pad"
            />

            <Button title="Add currency" onPress={handleSubmit} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  inner: { flex: 1, justifyContent: "center" },
  label: { fontSize: 16, color: "#fff", marginBottom: 8 },
  input: {
    backgroundColor: "#1c1c1e",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    color: "#fff",
  },
});
