import { Image, StyleSheet, View, Text, FlatList, Alert } from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedView } from "@/components/ThemedView";

interface Income {
  amount: number;
  customer_id: { name: string };
  currency_id: { symbol: string };
  status: string;
  payment_date: string | null;
  description: string;
  _id: string;
}

export default function listIncomes() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get("http://192.168.2.222:5002/api/incomes");
      setIncomes(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load incomes.");
      setLoading(false);
    }
  };

  const deleteIncome = async (incomeId: string) => {
    try {
      await axios.delete(`http://192.168.2.222:5002/api/incomes/${incomeId}`);
      setIncomes(incomes.filter((income) => income._id !== incomeId));
      Alert.alert("Success", "Income deleted successfully.");
    } catch (error) {
      console.error("Error deleting income:", error);
      Alert.alert("Error", "Failed to delete income.");
    }
  };

  const editIncome = (income: Income) => {
    // Navigate to the edit screen or show a modal for editing
    // Example: navigate("EditIncome", { income });
    Alert.alert("Edit Income", "You can now edit this income.");
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/money.jpeg")}
          style={styles.background}
        />
      }
    >
      <ThemedView>
        <FlatList
          data={incomes}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            let statusIcon;
            if (item.status === "paid") {
              statusIcon = (
                <MaterialIcons name="check-circle" size={28} color="green" />
              );
            } else if (item.status === "pending") {
              statusIcon = (
                <MaterialIcons name="pending" size={28} color="orange" />
              );
            } else if (item.status === "canceled") {
              statusIcon = (
                <FontAwesome6 name="sack-xmark" size={26} color="red" />
              );
            }

            return (
              <View style={styles.item}>
                <Text style={styles.amount}>
                  {item.amount} {item.currency_id.symbol}
                </Text>
                <Text style={styles.customer}>{item.customer_id.name}</Text>

                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}

                <View style={styles.iconContainer}>{statusIcon}</View>

                <Text style={styles.dateText}>{item.payment_date}</Text>

                {/* Edit and Delete Buttons */}
                <View style={styles.actionsContainer}>
                  <MaterialIcons
                    name="edit"
                    size={28}
                    color="blue"
                    onPress={() => editIncome(item)}
                  />
                  <MaterialIcons
                    name="delete"
                    size={28}
                    color="red"
                    onPress={() => deleteIncome(item._id)}
                  />
                </View>
              </View>
            );
          }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  background: {
    height: 250,
    width: "100%",
  },
  item: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
  },
  amount: {
    fontSize: 26,
    fontWeight: "bold",
  },
  customer: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    marginTop: 10,
  },
  dateText: {
    textAlign: "right",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
