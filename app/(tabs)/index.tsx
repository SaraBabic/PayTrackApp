import {
  Image,
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { Collapsible } from "@/components/Collapsible";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface Customer {
  _id: string;
  name: string;
  __v: number;
}

interface Currencies {
  _id: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  __v: number;
}

interface Income {
  amount: number;
  customer_id: Customer;
  currency_id: Currencies;
  status: string;
  payment_date: string | null;
  description: string;
  _id: string;
  __v: number;
}

export default function HomeScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<Currencies[]>([]);

  const formatDate = (date: string | null) => {
    if (date) {
      const dateObj = new Date(date);
      const formattedDate = new Intl.DateTimeFormat("hr-HR").format(dateObj);
      return formattedDate;
    }
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const [incomesRes, currenciesRes] = await Promise.all([
            axios.get(`${API_URL}/api/incomes`),
            axios.get(`${API_URL}/api/currencies`),
          ]);

          setIncomes(incomesRes.data);
          setCurrencies(currenciesRes.data);
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

  const calculateTotalInEuros = () => {
    if (!incomes.length || !currencies.length) return 0;

    return incomes.reduce((total, income) => {
      const currency = currencies.find((c) => c._id === income.currency_id._id);
      if (!currency) return total;

      // Pretvaramo sve u EUR: amount / exchange_rate
      return total + income.amount / currency.exchange_rate;
    }, 0);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.whiteText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.whiteText}>{error}</Text>
      </View>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Total amount: € {calculateTotalInEuros().toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={incomes}
        keyExtractor={(item, index) => index.toString()}
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

              {item.description ? (
                <Collapsible title="Description">
                  <Text>{item.description}</Text>
                </Collapsible>
              ) : null}

              <View style={styles.iconContainer}>{statusIcon}</View>
              {item.payment_date ? (
                <Text style={styles.dateText}>
                  {formatDate(item.payment_date)}
                </Text>
              ) : null}
            </View>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  header: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  background: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  whiteText: {
    color: "#fff",
  },
  item: {
    position: "relative",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  amount: {
    fontSize: 26,
    fontWeight: 800,
  },
  customer: {
    fontSize: 16,
    fontWeight: 600,
  },
  dateText: {
    textAlign: "right",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
