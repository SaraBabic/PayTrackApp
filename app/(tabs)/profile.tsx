import { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { ThemedView } from "@/components/ThemedView";

type UserData = {
  email: string;
  username: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        // Pretpostavljam da imaš spremljene user podatke u AsyncStorage
        const userDataStr = await AsyncStorage.getItem("userData");
        if (userDataStr) {
          setUser(JSON.parse(userDataStr));
        } else {
          // Ako nema user data, možda fetch sa API? Ili redirect na login
          router.replace("/auth/login");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load user data");
      }
    }
    loadUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("userData");
    router.replace("/auth/login");
  };

  if (!user) {
    return (
      <ThemedView style={styles.container}>
        <Text>Loading profile...</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{user.username}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>

      <View style={styles.logoutButton}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: "#444",
  },
  logoutButton: {
    marginTop: 50,
    alignSelf: "center",
    width: "50%",
  },
});
