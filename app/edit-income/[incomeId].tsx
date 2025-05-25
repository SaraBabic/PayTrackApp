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
import Button from "@/components/Button";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";

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
  customer_id: Customer;
  currency_id: Currency;
  status: string;
}

export default function EditIncome() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
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
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState<
    "customer" | "currency" | "status"
  >("customer");
  const router = useRouter();

  const statusOptions = ["pending", "paid", "canceled"];
  useEffect(() => {
    const loadData = async () => {
      try {
        const [customersResponse, currenciesResponse] = await Promise.all([
          axios.get<Customer[]>(`${API_URL}/api/customers`),
          axios.get<Currency[]>(`${API_URL}/api/currencies`),
        ]);
        setCustomers(customersResponse.data);
        setCurrencies(currenciesResponse.data);

        const incomeResponse = await axios.get<Income>(
          `${API_URL}/api/incomes/${incomeId}`
        );
        const data = incomeResponse.data;
        setAmount(data.amount.toString());
        setDescription(data.description);
        setPaymentDate(new Date(data.payment_date));
        setSelectedCustomer(data.customer_id._id);
        setSelectedCurrency(data.currency_id._id);
        setStatus(data.status);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      await axios.put(`${API_URL}/api/incomes/${incomeId}`, updatedIncome);
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

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>
          Loading...
        </Text>
      </ThemedView>
    );
  } else {
    return (
      <ThemedView style={styles.container}>
        <Button title="← Back" variant="back" onPress={() => router.back()} />
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
                    {modalType === "customer" && (
                      <FlatList
                        data={customers}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                          const isSelected = item._id === selectedCustomer;
                          return (
                            <TouchableOpacity
                              style={[
                                styles.modalItem,
                                isSelected && styles.selectedModalItem,
                              ]}
                              onPress={() => {
                                setSelectedCustomer(item._id);
                                setModalVisible(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.modalText,
                                  isSelected && styles.selectedModalText,
                                ]}
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}

                    {modalType === "currency" && (
                      <FlatList
                        data={currencies}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => {
                          const isSelected = item._id === selectedCurrency;
                          return (
                            <TouchableOpacity
                              style={[
                                styles.modalItem,
                                isSelected && styles.selectedModalItem,
                              ]}
                              onPress={() => {
                                setSelectedCurrency(item._id);
                                setModalVisible(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.modalText,
                                  isSelected && styles.selectedModalText,
                                ]}
                              >
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}

                    {modalType === "status" && (
                      <FlatList
                        data={statusOptions}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => {
                          const isSelected = item === status;
                          return (
                            <TouchableOpacity
                              style={[
                                styles.modalItem,
                                isSelected && styles.selectedModalItem,
                              ]}
                              onPress={() => {
                                setStatus(item);
                                setModalVisible(false);
                              }}
                            >
                              <Text
                                style={[
                                  styles.modalText,
                                  isSelected && styles.selectedModalText,
                                ]}
                              >
                                {item}
                              </Text>
                            </TouchableOpacity>
                          );
                        }}
                      />
                    )}
                  </View>
                </View>
              </Modal>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ThemedView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    paddingHorizontal: 30,
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
  selectedModalItem: {
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  selectedModalText: {
    color: "#fff",
    fontWeight: "bold",
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
