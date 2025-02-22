import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Button from "@/components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";

interface RouteParams {
  incomeId: string;
}

interface Customer {
  _id: string;
  name: string;
}

interface Currency {
  _id: string;
  name: string;
  symbol: string;
}

interface Income {
  _id: string;
  amount: number;
  description: string;
  payment_date: string;
  customer_id: string;
  currency_id: string;
  status: string;
}

export default function EditIncome() {
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const navigation = useNavigation();

  const { incomeId } = route.params;

  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("pending");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "customer" | "currency" | "status"
  >("customer");

  const statusOptions = ["pending", "paid", "canceled"];

  useEffect(() => {
    fetchCustomers();
    fetchCurrencies();
    fetchIncome();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get<Customer[]>(
        "http://192.168.2.222:5002/api/customers"
      );
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get<Currency[]>(
        "http://192.168.2.222:5002/api/currencies"
      );
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const fetchIncome = async () => {
    try {
      const response = await axios.get<Income>(
        `http://192.168.2.222:5002/api/incomes/${incomeId}`
      );
      const data = response.data;
      setAmount(data.amount.toString());
      setDescription(data.description);
      setPaymentDate(new Date(data.payment_date));
      setSelectedCustomer(data.customer_id);
      setSelectedCurrency(data.currency_id);
      setStatus(data.status);
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  const handleUpdate = async () => {
    if (!amount || !selectedCustomer || !selectedCurrency) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const updatedIncome = {
      amount: parseFloat(amount),
      description,
      payment_date: paymentDate.toISOString(),
      customer_id: selectedCustomer,
      currency_id: selectedCurrency,
      status,
    };

    try {
      await axios.put(
        `http://192.168.2.222:5002/api/incomes/${incomeId}`,
        updatedIncome
      );
      Alert.alert("Success", "Income updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating income:", error);
      Alert.alert("Error", "Failed to update income");
    }
  };

  const openModal = (type: "customer" | "currency" | "status") => {
    setModalType(type);
    setModalVisible(true);
  };

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            <Text style={styles.label}>Amount:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Payment Date:</Text>
            <Button
              title="Select Date"
              onPress={() => setShowDatePicker(true)}
              variant="orange"
            />
            {showDatePicker && (
              <DateTimePicker
                value={paymentDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setPaymentDate(selectedDate);
                }}
              />
            )}

            {/* Customer Picker */}
            <Text style={styles.label}>Customer:</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => openModal("customer")}
            >
              <Text style={styles.pickerText}>
                {selectedCustomer
                  ? customers.find((c) => c._id === selectedCustomer)?.name
                  : "Select Customer"}
              </Text>
            </TouchableOpacity>

            {/* Currency Picker */}
            <Text style={styles.label}>Currency:</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => openModal("currency")}
            >
              <Text style={styles.pickerText}>
                {selectedCurrency
                  ? currencies.find((c) => c._id === selectedCurrency)?.name
                  : "Select Currency"}
              </Text>
            </TouchableOpacity>

            {/* Status Picker */}
            <Text style={styles.label}>Status:</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => openModal("status")}
            >
              <Text style={styles.pickerText}>{status}</Text>
            </TouchableOpacity>

            <Button title="Update Income" onPress={handleUpdate} />

            {/* Modal for selecting options */}
            <Modal
              visible={modalVisible}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalWrapper}>
                <View style={styles.modalContent}>
                  <FlatList
                    data={
                      modalType === "customer"
                        ? (customers as any)
                        : modalType === "currency"
                        ? (currencies as any)
                        : (statusOptions as any)
                    }
                    keyExtractor={(item, index) =>
                      modalType === "status" ? index.toString() : item._id
                    }
                    renderItem={({ item }) => {
                      const displayText =
                        modalType === "customer" || modalType === "currency"
                          ? item.name
                          : item;
                      return (
                        <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => {
                            if (modalType === "customer")
                              setSelectedCustomer(item._id);
                            else if (modalType === "currency")
                              setSelectedCurrency(item._id);
                            else setStatus(item);
                            setModalVisible(false);
                          }}
                        >
                          <Text style={styles.modalText}>{displayText}</Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    color: "#fff",
  },
  background: {
    height: 250,
    width: "100%",
    bottom: 0,
    left: 0,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginTop: 5,
    borderRadius: 5,
    color: "#fff",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 5,
    height: 50,
    justifyContent: "center",
    width: "100%",
  },
  pickerText: {
    fontSize: 16,
    color: "#fff",
    paddingLeft: 10,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#1D3D47",
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 18,
    color: "#fff",
  },
});
