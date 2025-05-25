import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import Button from "@/components/Button";

const screenHeight = Dimensions.get("window").height;

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
      <View style={styles.header}>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff" }}>
          PayTrack
        </Text>
      </View>
      <View>
        <Button
          title="Create Income"
          onPress={createIncome}
          icon={
            <Image
              source={require("../../assets/images/hand.png")}
              style={{ width: 20, height: 20 }}
            />
          }
        />
        <Button
          title="Edit Incomes"
          onPress={listIncomes}
          icon={
            <Image
              source={require("../../assets/images/edit.png")}
              style={{ width: 20, height: 20 }}
            />
          }
        />
        <Button
          title="Customers"
          onPress={listCustomers}
          icon={
            <Image
              source={require("../../assets/images/team.png")}
              style={{ width: 20, height: 20 }}
            />
          }
        />
        <Button
          title="Currencies"
          onPress={listCurrencies}
          icon={
            <Image
              source={require("../../assets/images/exchange.png")}
              style={{ width: 20, height: 20 }}
            />
          }
        />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 30,
    minHeight: screenHeight,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 40,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#5E5D5C",
    borderRadius: 5,
    width: "100%",
  },
});
