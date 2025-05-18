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
import { useNavigation } from "@react-navigation/native";
import { ThemedView } from "@/components/ThemedView";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "@/components/Button";

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
  amount: number;
  customer_id: Customer;
  currency_id: Currency;
  status: string;
  payment_date: string | null;
  description: string;
  _id: string;
  __v: number;
}

export default function CreateIncome() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const navigation = useNavigation();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "customer" | "currency" | "status"
  >("customer");
  const [status, setStatus] = useState<string>("pending");
  const statusOptions = ["pending", "paid", "canceled"];

  useEffect(() => {
    fetchCustomers();
    fetchCurrencies();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get<Customer[]>(`${API_URL}/api/customers`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const response = await axios.get<Currency[]>(`${API_URL}/api/currencies`);
      setCurrencies(response.data);
    } catch (error) {
      console.error("Error fetching currencies:", error);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !selectedCustomer || !selectedCurrency) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const newIncome = {
      amount: parseFloat(amount),
      description,
      payment_date: paymentDate.toISOString(),
      customer_id: selectedCustomer,
      currency_id: selectedCurrency,
      status,
    };

    try {
      await axios.post(`${API_URL}/api/incomes`, newIncome);
      Alert.alert("Success", "Income added successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home" as never),
        },
      ]);
      setAmount("");
      setDescription("");
      setSelectedCustomer(null);
      setSelectedCurrency(null);
    } catch (error) {
      console.error("Error adding income:", error);
      Alert.alert("Error", "Failed to add income");
    }
  };

  const openModal = (type: "customer" | "currency" | "status") => {
    setModalType(type);
    setModalVisible(true);
  };

  return (
    <ThemedView style={styles.container}>
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
              placeholder="Enter amount"
            />

            <Text style={styles.label}>Description:</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
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
                  if (event.type === "set" && selectedDate) {
                    setPaymentDate(selectedDate);
                  }
                  setShowDatePicker(false);
                }}
              />
            )}
            <Text style={styles.selectedDateText}>
              Selected Date: {paymentDate.toLocaleDateString()}
            </Text>

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
            <Text style={styles.label}>Status:</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              onPress={() => openModal("status")}
            >
              <Text style={styles.pickerText}>
                {status ? status : "Select Status"}
              </Text>
            </TouchableOpacity>

            <Button title="Add Income" onPress={handleSubmit} />

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
                        ? (customers as Array<Customer | Currency | string>)
                        : modalType === "currency"
                        ? (currencies as Array<Customer | Currency | string>)
                        : (statusOptions as Array<Customer | Currency | string>)
                    }
                    keyExtractor={(item, index) =>
                      modalType === "status"
                        ? index.toString()
                        : (item as Customer | Currency)._id
                    }
                    renderItem={({ item }) => {
                      const displayText =
                        modalType === "customer" || modalType === "currency"
                          ? (item as Customer | Currency).name
                          : (item as string); // Explicitly handling status as a string

                      return (
                        <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => {
                            if (modalType === "customer") {
                              setSelectedCustomer((item as Customer)._id);
                            } else if (modalType === "currency") {
                              setSelectedCurrency((item as Currency)._id);
                            } else {
                              setStatus(item as string);
                            }
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    color: "#fff",
  },
  selectedDateText: {
    fontSize: 16,
    marginTop: 5,
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
