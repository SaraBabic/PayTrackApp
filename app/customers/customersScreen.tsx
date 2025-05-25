import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface Customer {
  _id: string;
  name: string;
  __v: number;
}

const screenHeight = Dimensions.get("window").height;

export default function CustomersScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/customers`);
          setCustomers(res.data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Došlo je do greške pri učitavanju podataka.");
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const newCustomer = () => {
    router.push(`/customers/addCustomer`);
  };

  const editCustomer = (customerId: string) => {
    router.push(`/customers/edit/${customerId}`);
  };

  const deleteCustomer = async (customerId: string) => {
    try {
      await axios.delete(`${API_URL}/api/customers/${customerId}`);
      setCustomers(customers.filter((c) => c._id !== customerId));
      Alert.alert("Success", "Customer deleted successfully.");
    } catch (error) {
      console.error("Error deleting customer:", error);
      Alert.alert("Error", "Failed to delete customer.");
    }
  };

  const confirmDeleteCustomer = (customerId: string, name: string) => {
    Alert.alert(
      "Delete Customer",
      `Are you sure you want to delete customer: "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => deleteCustomer(customerId),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Button title="← Back" variant="back" onPress={() => router.back()} />
      <Button title="Add Customer" onPress={newCustomer} />

      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>{item.name}</Text>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => editCustomer(item._id)}>
                <MaterialIcons name="edit" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmDeleteCustomer(item._id, item.name)}
              >
                <MaterialIcons name="delete" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
    minHeight: screenHeight,
  },
  item: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
  iconContainer: {
    flexDirection: "row",
    gap: 15,
  },
});
