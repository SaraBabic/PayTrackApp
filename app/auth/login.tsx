import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const { token, user } = res.data; // pretpostavimo da API vraća i korisnika
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));
      router.replace("/"); // idi na home
    } catch (err) {
      Alert.alert("Login failed", "Check your credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Text style={styles.label}>Password:</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
      <Text
        style={{ marginTop: 20, color: "#fff" }}
        onPress={() => router.push("/auth/register")}
      >
        Don't have an account? Register
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    color: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#fff",
  },
});
