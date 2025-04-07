import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

const ResolvedComplaints = () => {
   const [complaints, setComplaints] = useState([]);
   const [refreshing, setRefreshing] = useState(false);

   const fetchResolved = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
         const response = await axios.get(`${baseUrl}complaints/department`, {
            headers: { Authorization: formattedToken },
         });
         const filtered = response.data.filter((c) => c.status === "resolved");
         setComplaints(filtered);
      } catch (err) {
         console.error(err.message);
      }
   };

   useEffect(() => {
      fetchResolved();
   }, []);

   return (
      <FlatList
         data={complaints}
         keyExtractor={(item) => item._id}
         refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchResolved} />
         }
         contentContainerStyle={styles.container}
         renderItem={({ item }) => (
            <View style={styles.card}>
               <Text style={styles.title}>{item.title}</Text>
               <Text>{item.description}</Text>
            </View>
         )}
         ListEmptyComponent={
            <Text style={styles.emptyText}>No resolved complaints yet.</Text>
         }
      />
   );
};

const styles = StyleSheet.create({
   container: { padding: 16 },
   card: {
      padding: 12,
      backgroundColor: "#e6ffe6",
      borderRadius: 8,
      marginBottom: 12,
   },
   title: {
      fontWeight: "bold",
      fontSize: 16,
   },
   emptyText: {
      textAlign: "center",
      marginTop: 30,
      color: "#999",
   },
});

export default ResolvedComplaints;
