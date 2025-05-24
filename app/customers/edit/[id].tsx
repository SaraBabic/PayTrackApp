import React, { useState, useEffect } from "react";
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

export default function EditCustomer() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/customers/${id}`);
        setName(res.data.name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer:", error);
        Alert.alert("Greška", "Neuspešno učitavanje korisnika.");
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("Greška", "Unesite ime korisnika.");
      return;
    }

    try {
      await axios.put(`${API_URL}/api/customers/${id}`, { name });
      Alert.alert("Uspeh", "Korisnik uspešno ažuriran.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Greška prilikom ažuriranja:", error);
      Alert.alert("Greška", "Neuspešno ažuriranje korisnika.");
    }
  };

  if (loading) {
    return <Text style={{ padding: 20 }}>Učitavanje...</Text>;
  }

  return (
    <ThemedView style={styles.container}>
      <Button title="← Back" onPress={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.label}>Ime korisnika</Text>
            <TextInput
              style={styles.input}
              placeholder="Unesite ime"
              placeholderTextColor="#aaa"
              value={name}
              onChangeText={setName}
            />
            <Button title="Sačuvaj izmene" onPress={handleUpdate} />
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
