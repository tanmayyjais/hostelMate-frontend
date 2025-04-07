import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const StaffComplaints = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const [complaints, setComplaints] = useState([]);
   const { userInfo } = useContext(AuthContext);

   const fetchDepartmentComplaints = async () => {
      try {
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

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Department Complaints</Text>
         </View>

         <FlatList
            data={complaints}
            keyExtractor={(item) => item._id}
            refreshControl={
               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => {
               const { icon, color } = getStatusIcon(item.status);
               return (
                  <List.Item
                     title={item.title}
                     description={item.description}
                     left={() => <MaterialIcons name={icon} size={24} color={color} />}
                     onPress={() => navigation.navigate("StaffViewComplain", { complain: item })}
                  />
               );
            }}
            ListEmptyComponent={
               <Text style={{ textAlign: "center", marginTop: 20 }}>No complaints for your department.</Text>
            }
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 10,
      backgroundColor: "#fff",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      marginBottom: 10,
   },
   backButton: {
      position: "absolute",
      left: 10,
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
   },
});

export default StaffComplaints;
