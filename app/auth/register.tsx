import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/register`, {
        email,
        username,
        password,
      });
      Alert.alert("Success", "Account created!");
      router.replace("/auth/login");
    } catch (err: any) {
      console.log("error ::: ", err);
      Alert.alert(
        "Registration failed",
        err.response?.data?.message || "Unknown error"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Username:</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
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
      <Button title="Register" onPress={handleRegister} />
      <Text
        style={{ marginTop: 20, color: "#fff" }}
        onPress={() => router.push("/auth/login")}
      >
        Already have an account? Login
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
