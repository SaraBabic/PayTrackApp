import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import Button from "@/components/Button";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

interface Currency {
  _id: string;
  name: string;
  symbol: string;
  exchange_rate: number;
}

export default function CurrencyScreen() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const fetchCurrencies = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/currencies`);
          setCurrencies(res.data);
        } catch (err) {
          console.error("Error fetching currencies:", err);
          setError("Greška pri učitavanju valuta.");
        } finally {
          setLoading(false);
        }
      };

      fetchCurrencies();
    }, [])
  );

  const deleteCurrency = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/currencies/${id}`);
      setCurrencies((prev) => prev.filter((c) => c._id !== id));
      Alert.alert("Uspeh", "Valuta uspešno obrisana.");
    } catch (error) {
      console.error("Greška pri brisanju valute:", error);
      Alert.alert("Greška", "Brisanje nije uspelo.");
    }
  };

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      "Brisanje valute",
      `Da li sigurno želite da obrišete valutu "${name}"?`,
      [
        { text: "Otkaži", style: "cancel" },
        {
          text: "Obriši",
          onPress: () => deleteCurrency(id),
          style: "destructive",
        },
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Button title="← Back" onPress={() => router.back()} />
      <Button
        title="Add currency"
        onPress={() => router.push(`/currencies/addCurrency` as any)}
      />

      {loading ? (
        <Text>Učitavanje...</Text>
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={currencies}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View>
                <Text style={styles.text}>
                  {item.name} ({item.symbol})
                </Text>
                <Text>Exchange rate: {item.exchange_rate}</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/currencies/edit/${item._id}` as any)
                  }
                >
                  <MaterialIcons name="edit" size={24} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => confirmDelete(item._id, item.name)}
                >
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
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
