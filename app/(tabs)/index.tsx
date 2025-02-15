import { Image, StyleSheet, View, Text, FlatList } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";

interface Customer {
  _id: string;
  name: string;
  __v: number;
}

interface Income {
  amount: number;
  customer_id: Customer;
  currency_id: object; // we need an interface for currency
  status: string;
  payment_date: string | null;
  description: string;
  _id: string;
  __v: number;
}

export default function HomeScreen() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: string | null) => {
    if (date) {
      const dateObj = new Date(date);
      const formattedDate = new Intl.DateTimeFormat("hr-HR").format(dateObj);
      return formattedDate;
    }
    return null;
  };

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await axios.get(
          "http://192.168.2.222:5002/api/incomes"
        );
        setIncomes(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Došlo je do greške pri učitavanju podataka.");
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

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
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}></ThemedView>
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
              <Text style={styles.amount}>Amount: {item.amount}</Text>
              <Text style={styles.amount}>
                Customer: {item.customer_id.name}
              </Text>
              {item.payment_date ? (
                <Text style={styles.amount}>
                  Payment Date: {formatDate(item.payment_date)}
                </Text>
              ) : null}
              {/* Prikazujemo ikonu */}
              <View style={styles.iconContainer}>{statusIcon}</View>
            </View>
          );
        }}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
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
    paddingRight: 40,
    marginBottom: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: "100%",
  },
  amount: {
    fontSize: 18,
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
