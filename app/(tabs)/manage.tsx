import { Button, StyleSheet, Text, View } from "react-native";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";

export default function ManageScreen() {
  const router = useRouter();
  const createIncome = () => {
    router.push(`/createIncome`);
  };
  const listIncomes = () => {
    router.push(`/listIncomes`);
  };
  const listCustomers = () => {
    router.push(`/customers/customersScreen`);
  };
  const listCurrencies = () => {
    router.push(`/currencies/currencyScreen`);
  };
  return (
    <ThemedView style={styles.container}>
      <Text>manage</Text>
      <View>
        <Button title="create Income" onPress={createIncome} />
        <Button title="edit Incomes" onPress={listIncomes} />
        <Button title="customers" onPress={listCustomers} />
        <Button title="currencies" onPress={listCurrencies} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
  },
});
