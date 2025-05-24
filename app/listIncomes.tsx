import { Image, StyleSheet, View, Text, FlatList, Alert } from "react-native";
import axios from "axios";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import Button from "@/components/Button";

interface Income {
  amount: number;
  customer_id: { name: string };
  currency_id: { symbol: string };
  status: string;
  payment_date: string | null;
  description: string;
  _id: string;
}
type RootStackParamList = {
  EditIncome: { incomeId: string };
};

export default function ListIncomes() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const formatDate = (date: string | null) => {
    if (date) {
      const dateObj = new Date(date);
      const formattedDate = new Intl.DateTimeFormat("hr-HR").format(dateObj);
      return formattedDate;
    }
    return null;
  };

  const fetchIncomes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/incomes`);
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
      await axios.delete(`${API_URL}/api/incomes/${incomeId}`);
      setIncomes(incomes.filter((income) => income._id !== incomeId));
      Alert.alert("Success", "Income deleted successfully.");
    } catch (error) {
      console.error("Error deleting income:", error);
      Alert.alert("Error", "Failed to delete income.");
    }
  };

  const confirmDeleteIncome = (
    incomeId: string,
    amount: number,
    symbol: string
  ) => {
    Alert.alert(
      "Delete income",
      `Are you shure you want to delete income: ${amount} ${symbol}?`,
      [
        {
          text: "No, exit",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteIncome(incomeId),
          style: "destructive",
        },
      ]
    );
  };

  const editIncome = (incomeId: string) => {
    router.push(`/edit-income/${incomeId}`);
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
    <ThemedView style={styles.container}>
      <Button title="← Back" onPress={() => router.back()} />
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
              <Text style={styles.dateText}>
                {formatDate(item.payment_date)}
              </Text>

              <View style={styles.actionsContainer}>
                <MaterialIcons
                  name="edit"
                  size={28}
                  color="blue"
                  onPress={() => editIncome(item._id)}
                />
                <MaterialIcons
                  name="delete"
                  size={28}
                  color="red"
                  onPress={() =>
                    confirmDeleteIncome(
                      item._id,
                      item.amount,
                      item.currency_id.symbol
                    )
                  }
                />
              </View>
            </View>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 30,
  },
  background: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
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
