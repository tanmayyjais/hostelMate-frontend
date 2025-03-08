import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from "react-native";
import { Button, List } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Import Icons

const Complains = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const [complaints, setComplaints] = useState([]);
   const { userInfo } = useContext(AuthContext);

   const fetchComplaints = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");

         if (!token) {
            console.error("No token found, user might not be logged in!");
            alert("No token found, please login again!");
            return;
         }

         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

         const response = await axios.get(`${baseUrl}complaints/user`, {
            headers: {
               Authorization: formattedToken, 
            },
         });

         setComplaints(response.data);
      } catch (error) {
         console.error("Failed to fetch complaints", error.message);
      }
   };

   useEffect(() => {
      fetchComplaints();
   }, []);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchComplaints().finally(() => setRefreshing(false));
   }, []);

   // Function to get icon and color based on status
   const getStatusIcon = (status) => {
      const lowerStatus = status.toLowerCase().trim(); // Normalize status

      switch (lowerStatus) {
         case "pending":
            return { icon: "hourglass-top", color: "#FFA500" }; // Orange for pending
         case "accepted":
            return { icon: "check-circle", color: "#007bff" }; // Blue for accepted
         case "resolved":
            return { icon: "done-all", color: "#28a745" }; // Green for resolved
         default:
            return { icon: "help-outline", color: "#808080" }; // Grey for unknown
      }
   };

   return (
      <View style={styles.container}>
         {/* Header with Back Button and Title */}
         <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>All Complaints</Text>
         </View>

         <FlatList
            data={complaints}
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
                     onPress={() => navigation.navigate("UserViewComplain", { complain: item })}
                  />
               );
            }}
            ListEmptyComponent={
               <Text style={{ textAlign: "center", marginTop: 20 }}>No complaints found</Text>
            }
         />

         <Button mode="contained" onPress={() => navigation.navigate("UserAddNewComplain")} style={styles.addButton}>
            Add New Complaint
         </Button>
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
   addButton: {
      marginTop: 10,
      borderRadius: 8,
   },
});

export default Complains;
