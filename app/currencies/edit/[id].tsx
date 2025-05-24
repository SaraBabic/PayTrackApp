import React, { useEffect, useState } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import { ThemedView } from "@/components/ThemedView";

export default function EditCurrency() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/currencies/${id}`);
        const data = res.data;
        setName(data.name);
        setSymbol(data.symbol);
        setExchangeRate(data.exchange_rate.toString());
      } catch (error) {
        console.error("Greška:", error);
        Alert.alert("Greška", "Učitavanje valute nije uspelo.");
      }
    };

    if (id) {
      fetchCurrency();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.patch(`${API_URL}/api/currencies/${id}`, {
        name,
        symbol,
        exchange_rate: parseFloat(exchangeRate),
      });
      Alert.alert("Uspeh", "Valuta uspešno izmenjena.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Greška:", error);
      Alert.alert("Greška", "Izmena nije uspela.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Button title="← Back" onPress={() => router.back()} />
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
            />

            <Text style={styles.label}>Simbol</Text>
            <TextInput
              style={styles.input}
              value={symbol}
              onChangeText={setSymbol}
            />

            <Text style={styles.label}>Kurs</Text>
            <TextInput
              style={styles.input}
              value={exchangeRate}
              onChangeText={setExchangeRate}
              keyboardType="decimal-pad"
            />

            <Button title="Izmeni valutu" onPress={handleUpdate} />
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
