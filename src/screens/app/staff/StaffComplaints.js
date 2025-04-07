import React, { useState, useEffect, useContext, useCallback } from "react";
import {
   View,
   Text,
   FlatList,
   RefreshControl,
   StyleSheet,
   TouchableOpacity,
   SafeAreaView,
   StatusBar,
   Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

const StaffComplaints = ({ navigation }) => {
   const [complaints, setComplaints] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);
   const { userInfo } = useContext(AuthContext);
   const [openIndex, setOpenIndex] = useState(null);

   const statusOptions = [
      { label: "Pending", value: "pending" },
      { label: "Accepted", value: "accepted" },
      { label: "Resolved", value: "resolved" },
   ];

   const fetchDepartmentComplaints = async () => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem("userToken");
         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
         const response = await axios.get(`${baseUrl}complaints/department`, {
            headers: { Authorization: formattedToken },
         });
         setComplaints(response.data);
      } catch (err) {
         console.error("❌ Fetch Error:", err.message);
      } finally {
         setLoading(false);
      }
   };

   const updateStatus = async (id, newStatus) => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
         await axios.patch(`${baseUrl}complaints/${id}/status`, { status: newStatus }, {
            headers: { Authorization: formattedToken },
         });
         fetchDepartmentComplaints();
      } catch (error) {
         console.error("❌ Status Update Error:", error.message);
         Alert.alert("Error", "Failed to update complaint status.");
      }
   };

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchDepartmentComplaints().finally(() => setRefreshing(false));
   }, []);

   useEffect(() => {
      fetchDepartmentComplaints();
   }, []);

   const getStatusColor = (status) => {
      switch (status.toLowerCase()) {
         case "pending":
            return "#FFA500";
         case "accepted":
            return "#007bff";
         case "resolved":
            return "#28a745";
         default:
            return "#808080";
      }
   };

   const renderItem = ({ item, index }) => {
      const statusColor = getStatusColor(item.status);

      return (
         <View style={styles.card}>
            <View style={styles.headerRow}>
               <MaterialIcons name="report-problem" size={24} color={statusColor} />
               <View style={styles.titleContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.meta}>
                     By: {item.user?.full_name} ({item.user?.email})
                  </Text>
                  <Text style={styles.meta}>
                     {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
               </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>

            <View style={styles.actions}>
               <Text style={[styles.statusText, { color: statusColor }]}>
                  {item.status.toUpperCase()}
               </Text>

               <DropDownPicker
                  open={openIndex === index}
                  setOpen={(o) => setOpenIndex(o ? index : null)}
                  value={item.status}
                  items={statusOptions}
                  setValue={(cb) => {
                     const newValue = cb(item.status);
                     updateStatus(item._id, newValue);
                  }}
                  containerStyle={{ width: 150, zIndex: 9999 }}
                  style={{ borderColor: "#ccc" }}
                  dropDownContainerStyle={{ zIndex: 10000 }}
                  listMode="SCROLLVIEW"
               />
            </View>
         </View>
      );
   };

   return (
      <SafeAreaView style={styles.safeArea}>
         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
         <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Department Complaints</Text>
         </View>

         <FlatList
            data={complaints}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshControl={
               <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#007bff"]}
               />
            }
            contentContainerStyle={{ padding: 10, paddingBottom: 60 }}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: "#fff" },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      backgroundColor: "#ffffff",
      borderBottomColor: "#ddd",
      borderBottomWidth: 1,
   },
   backButton: {
      position: "absolute",
      left: 16,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
   },
   card: {
      backgroundColor: "#fff",
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      elevation: 2,
   },
   headerRow: {
      flexDirection: "row",
      alignItems: "flex-start",
   },
   titleContainer: {
      flex: 1,
      marginLeft: 12,
   },
   title: {
      fontSize: 16,
      fontWeight: "600",
   },
   meta: {
      fontSize: 12,
      color: "#777",
   },
   desc: {
      fontSize: 14,
      color: "#444",
      marginTop: 8,
   },
   actions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      alignItems: "center",
      zIndex: 1000,
   },
   statusText: {
      fontWeight: "600",
      fontSize: 13,
   },
});

export default StaffComplaints;
