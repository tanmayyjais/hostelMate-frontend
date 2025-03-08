import { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
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
import { TouchableRipple, List, Avatar } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";

const PaymentReceipts = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const { userInfo } = useContext(AuthContext);
   const [paymentReceipts, setPaymentReceipts] = useState([]);
   const [loading, setLoading] = useState(true);

   /** 📥 Fetch Payment Receipts from Backend */
   const fetchPaymentReceipts = async () => {
      try {
          setLoading(true);
          const token = await AsyncStorage.getItem("userToken");
  
          if (!token) {
              alert("Authentication required. Please log in again.");
              return;
          }
  
          //console.log("🔍 Fetching Payment Receipts with Token:", token);
  
          const response = await axios.get(`${baseUrl}payment-receipts`, {
              headers: { Authorization: `Bearer ${token}` },
          });
  
          //console.log("✅ Received Payment Receipts:", response.data);
          setPaymentReceipts(response.data);
      } catch (error) {
          console.error("❌ Error fetching payment receipts:", error.response?.data || error);
      } finally {
          setLoading(false);
      }
  };
  

   /** 🔄 Refresh Payment Receipts */
   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchPaymentReceipts().then(() => setRefreshing(false));
   }, []);

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
                  onPress={() => navigation.navigate("AdminViewPaymentReceipt", { payment_receipt: item })}
               >
                  <View style={styles.row}>
                     <Avatar.Image
                        size={50}
                        source={require("../../../../assets/images/profile_pic.png")}
                     />
                     <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{item.category}</Text>
                        <Text style={styles.subText}>{item.name} • ₹{item.amount}</Text>
                     </View>
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
                  </View>
               </TouchableRipple>
            )}
            ListEmptyComponent={
               <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>There are no payment receipts!</Text>
               </View>
            }
         />
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
      marginBottom: 10,
   },
   receiptItem: {
      paddingVertical: 12,
      paddingHorizontal: 15,
      marginVertical: 6,
      backgroundColor: "#f9f9f9",
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
   subText: {
      fontSize: 14,
      color: textDarkGray,
      marginLeft: 10,
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
