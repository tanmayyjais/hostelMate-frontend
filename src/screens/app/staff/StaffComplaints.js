import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { List, Divider, ActivityIndicator } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const StaffComplaints = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const [loading, setLoading] = useState(true);
   const [complaints, setComplaints] = useState([]);
   const { userInfo } = useContext(AuthContext);

   const fetchDepartmentComplaints = async () => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem("userToken");

         if (!token) {
            alert("Session expired. Please login again.");
            return;
         }

         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
         const response = await axios.get(`${baseUrl}complaints/department`, {
            headers: { Authorization: formattedToken },
            params: { department: userInfo?.department }
         });

         setComplaints(response.data);
      } catch (error) {
         console.error("Failed to fetch department complaints", error.message);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchDepartmentComplaints();
   }, []);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchDepartmentComplaints().finally(() => setRefreshing(false));
   }, []);

   const getStatusIcon = (status) => {
      switch (status.toLowerCase()) {
         case "pending":
            return { icon: "hourglass-top", color: "#FFA500" };
         case "accepted":
            return { icon: "check-circle", color: "#007bff" };
         case "resolved":
            return { icon: "done-all", color: "#28a745" };
         default:
            return { icon: "help-outline", color: "#808080" };
      }
   };

   const renderItem = ({ item }) => {
      const { icon, color } = getStatusIcon(item.status);
      return (
         <>
            <TouchableOpacity
               activeOpacity={0.7}
               onPress={() => navigation.navigate("StaffViewComplain", { complain: item })}
            >
               <View style={styles.complaintCard}>
                  <View style={styles.complaintHeader}>
                     <MaterialIcons name={icon} size={24} color={color} style={styles.statusIcon} />
                     <View style={styles.complaintTitleContainer}>
                        <Text style={styles.complaintTitle} numberOfLines={1}>
                           {item.title}
                        </Text>
                        <Text style={styles.complaintDate}>
                           {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                     </View>
                     <MaterialIcons name="chevron-right" size={24} color="#888" />
                  </View>
                  <Text style={styles.complaintDescription} numberOfLines={2}>
                     {item.description}
                  </Text>
                  <View style={styles.statusIndicator}>
                     <Text style={[styles.statusText, { color }]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                     </Text>
                  </View>
               </View>
            </TouchableOpacity>
            <Divider />
         </>
      );
   };

   const renderEmptyComponent = () => {
      if (loading) {
         return (
            <View style={styles.emptyContainer}>
               <ActivityIndicator size="large" color="#007bff" />
               <Text style={styles.emptyText}>Loading complaints...</Text>
            </View>
         );
      }
      
      return (
         <View style={styles.emptyContainer}>
            <MaterialIcons name="inbox" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No complaints for your department</Text>
         </View>
      );
   };

   return (
      <SafeAreaView style={styles.safeArea}>
         <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
         
         <View style={styles.header}>
            <TouchableOpacity 
               style={styles.backButton} 
               onPress={() => navigation.goBack()}
               hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
               <Ionicons name="arrow-back" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Department Complaints</Text>
         </View>
         
         <FlatList
            data={complaints}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={styles.listContent}
            refreshControl={
               <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  colors={["#007bff"]} 
               />
            }
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: {
      flex: 1,
      backgroundColor: "#fff",
   },
   container: {
      flex: 1,
      backgroundColor: "#f9f9f9",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: "#ffffff",
      borderBottomWidth: 1,
      borderBottomColor: "#e0e0e0",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
   },
   backButton: {
      position: "absolute",
      left: 16,
      padding: 4,
   },
   headerTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#333333",
   },
   listContent: {
      flexGrow: 1,
      paddingBottom: 20,
   },
   complaintCard: {
      padding: 16,
      backgroundColor: "#ffffff",
   },
   complaintHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
   },
   statusIcon: {
      marginRight: 12,
   },
   complaintTitleContainer: {
      flex: 1,
   },
   complaintTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#333333",
   },
   complaintDate: {
      fontSize: 12,
      color: "#888888",
      marginTop: 2,
   },
   complaintDescription: {
      fontSize: 14,
      color: "#555555",
      marginBottom: 10,
      lineHeight: 20,
   },
   statusIndicator: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
   },
   statusText: {
      fontSize: 12,
      fontWeight: "500",
   },
   emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 60,
   },
   emptyText: {
      fontSize: 16,
      color: "#888888",
      marginTop: 12,
   },
});

export default StaffComplaints;