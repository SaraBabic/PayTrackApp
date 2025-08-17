import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/login`,
        { username, password }
      );

      const { token, user } = res.data;

      // sačuvaj token i user
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      router.replace("/");
    } catch (err) {
      Alert.alert("Login failed", "Check username or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        placeholder="Email"
        value={username}
        onChangeText={setUsername}
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
