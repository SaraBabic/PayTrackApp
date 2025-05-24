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

export default function AddCustomer() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Greška", "Unesite ime korisnika.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/customers`, { name });
      Alert.alert("Uspeh", "Korisnik dodat uspešno", [
        { text: "OK", onPress: () => router.back() },
      ]);
      setName("");
    } catch (error) {
      console.error("Greška prilikom dodavanja korisnika:", error);
      Alert.alert("Greška", "Neuspešno dodavanje korisnika.");
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
            <Text style={styles.label}>Customer name:</Text>
            <TextInput
              style={styles.input}
              placeholder="name"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />
            <Button title="Add customer" onPress={handleSubmit} />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  inner: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 8,
  },
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
