import { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
   darkGreen,
   darkRed,
   lightGray,
   primaryBlue,
   textDarkGray,
   white,
   yellowDark,
} from "../../../constants/Colors";
import { TouchableRipple, List, Icon } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";

const PaymentReceipts = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const { userInfo } = useContext(AuthContext);
   const [paymentReceipts, setPaymentReceipts] = useState([]);
   const [loading, setLoading] = useState(true);

   /** 📥 Fetch Receipts */
   const fetchPaymentReceipts = async () => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem("userToken");
         if (!token) {
            alert("Authentication required. Please log in again.");
            return;
         }
         const response = await axios.get(`${baseUrl}payment-receipts/user`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         setPaymentReceipts(response.data);
      } catch (error) {
         console.error("Error fetching payment receipts:", error);
      } finally {
         setLoading(false);
      }
   };

   /** 🔄 Refresh List */
   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchPaymentReceipts().then(() => setRefreshing(false));
   }, []);

   /** ❌ Delete Receipt */
   const deleteReceipt = async (receiptId) => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         if (!token) {
            alert("Authentication required. Please log in again.");
            return;
         }
         await axios.delete(`${baseUrl}payment-receipts/${receiptId}`, {
            headers: { Authorization: `Bearer ${token}` },
         });
         alert("Payment receipt deleted successfully!");
         fetchPaymentReceipts(); // Refresh the list
      } catch (error) {
         console.error("Error deleting payment receipt:", error);
         alert("Failed to delete receipt. Please try again.");
      }
   };

   /** 🛑 Confirm Delete */
   const confirmDelete = (receiptId) => {
      Alert.alert("Delete Receipt", "Are you sure you want to delete this receipt?", [
         { text: "Cancel", style: "cancel" },
         { text: "Delete", style: "destructive", onPress: () => deleteReceipt(receiptId) },
      ]);
   };

   useEffect(() => {
      fetchPaymentReceipts();
   }, []);

   return (
      <View style={styles.container}>
         <Text style={styles.header}>Payment Receipts</Text>
         <FlatList
            data={paymentReceipts}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            renderItem={({ item }) => (
               <TouchableRipple
                  style={styles.receiptItem}
                  onPress={() => navigation.navigate("UserViewPaymentReceipts", { payment_receipt: item })}
               >
                  <View style={styles.row}>
                     <List.Icon
                        color={
                           item.status === "pending"
                              ? yellowDark
                              : item.status === "accepted"
                              ? darkGreen
                              : darkRed
                        }
                        icon={
                           item.status === "pending" ? "clock" : item.status === "accepted" ? "check-bold" : "close-circle"
                        }
                     />
                     <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.category}</Text>
                        <Text style={styles.amount}>₹{item.amount}</Text>
                     </View>
                     <TouchableRipple onPress={() => confirmDelete(item._id)}>
                        <Icon source={"delete"} color={darkRed} size={24} />
                     </TouchableRipple>
                  </View>
               </TouchableRipple>
            )}
            ListEmptyComponent={
               <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>There are no payment receipts!</Text>
               </View>
            }
         />
         <TouchableRipple
            style={styles.addButton}
            onPress={() => navigation.navigate("UserAddPaymentReceipts")}
         >
            <View style={styles.addButtonContent}>
               <Text style={styles.addText}>Add Payment Receipt</Text>
               <Icon source={"plus-box"} color={primaryBlue} size={24} />
            </View>
         </TouchableRipple>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: white,
      paddingHorizontal: 20,
      paddingTop: 20,
   },
   header: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 15,
   },
   receiptItem: {
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginVertical: 6,
      backgroundColor: "#eef2ff",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 3,
   },
   row: {
      flexDirection: "row",
      alignItems: "center",
   },
   title: {
      fontSize: 16,
      fontWeight: "bold",
      color: textDarkGray,
      marginLeft: 10,
   },
   amount: {
      fontSize: 14,
      color: textDarkGray,
      marginLeft: 10,
   },
   addButton: {
      marginTop: 15,
      padding: 15,
      backgroundColor: "#eef2ff",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: primaryBlue,
      marginBottom: 20,
   },
   addButtonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
   },
   addText: {
      fontSize: 16,
      fontWeight: "bold",
      color: primaryBlue,
      marginRight: 5,
   },
   emptyContainer: {
      alignItems: "center",
      marginTop: 30,
   },
   emptyText: {
      fontSize: 16,
      fontWeight: "bold",
      color: textDarkGray,
   },
});

export default PaymentReceipts;
