// // edit.tsx
// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   Button,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import axios from "axios";
// import { useRoute, useNavigation } from "@react-navigation/native";

// interface Customer {
//   _id: string;
//   name: string;
// }

// interface Currency {
//   _id: string;
//   name: string;
//   symbol: string;
// }

// interface Income {
//   amount: number;
//   description: string;
//   customer_id: string;
//   currency_id: string;
//   status: string;
//   payment_date: string;
//   _id: string;
// }

// export default function EditIncome() {
//   const route = useRoute();
//   const navigation = useNavigation();

//   // Extract income data passed through navigation
//   const { incomeId } = route.params;

//   const [income, setIncome] = useState<Income | null>(null);
//   const [amount, setAmount] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [status, setStatus] = useState<string>("");
//   const [paymentDate, setPaymentDate] = useState<Date | null>(null);

//   useEffect(() => {
//     // Fetch the existing income data
//     const fetchIncome = async () => {
//       try {
//         const response = await axios.get(
//           `http://192.168.2.222:5002/api/incomes/${incomeId}`
//         );
//         const fetchedIncome = response.data;

//         setIncome(fetchedIncome);
//         setAmount(fetchedIncome.amount.toString());
//         setDescription(fetchedIncome.description);
//         setStatus(fetchedIncome.status);
//         setPaymentDate(new Date(fetchedIncome.payment_date));
//       } catch (error) {
//         console.error("Error fetching income:", error);
//         Alert.alert("Error", "Failed to load income details.");
//       }
//     };

//     fetchIncome();
//   }, [incomeId]);

//   const handleSave = async () => {
//     if (!amount || !status || !paymentDate) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }

//     try {
//       const updatedIncome = {
//         amount: parseFloat(amount),
//         description,
//         status,
//         payment_date: paymentDate.toISOString(),
//         customer_id: income?.customer_id,
//         currency_id: income?.currency_id,
//       };

//       // Send PUT request to update the income
//       await axios.put(
//         `http://192.168.2.222:5002/api/incomes/${incomeId}`,
//         updatedIncome
//       );

//       Alert.alert("Success", "Income updated successfully!");
//       navigation.goBack(); // Go back after saving
//     } catch (error) {
//       console.error("Error updating income:", error);
//       Alert.alert("Error", "Failed to update income.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Amount</Text>
//       <TextInput
//         style={styles.input}
//         value={amount}
//         onChangeText={setAmount}
//         keyboardType="numeric"
//       />

//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         style={styles.input}
//         value={description}
//         onChangeText={setDescription}
//       />

//       <Text style={styles.label}>Status</Text>
//       <TextInput style={styles.input} value={status} onChangeText={setStatus} />

//       <Text style={styles.label}>Payment Date</Text>
//       <TextInput
//         style={styles.input}
//         value={paymentDate ? paymentDate.toLocaleDateString() : ""}
//         onChangeText={(dateStr) => setPaymentDate(new Date(dateStr))}
//       />

//       <TouchableOpacity style={styles.button} onPress={handleSave}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   label: {
//     fontSize: 18,
//     marginVertical: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 20,
//   },
//   button: {
//     backgroundColor: "#1D3D47",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//   },
// });
