import React, { useEffect, useState, useContext } from "react";
import {
   View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl
} from "react-native";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

const PendingComplaints = () => {
   const [complaints, setComplaints] = useState([]);
   const [refreshing, setRefreshing] = useState(false);
   const { userInfo } = useContext(AuthContext);

   const fetchPending = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
         const res = await axios.get(`${baseUrl}complaints/department`, {
            headers: { Authorization: formattedToken },
         });

         const filtered = res.data.filter((c) => c.status === "pending");
         setComplaints(filtered);
      } catch (error) {
         console.log("Fetch error:", error.message);
      }
   };

   useEffect(() => { fetchPending(); }, []);
   const onRefresh = () => {
      setRefreshing(true);
      fetchPending().finally(() => setRefreshing(false));
   };

   const renderItem = ({ item }) => (
      <View style={styles.card}>
         <Text style={styles.title}>{item.title}</Text>
         <Text style={styles.meta}>By: {item.user?.full_name}</Text>
         <Text style={styles.desc}>{item.description}</Text>
         <Text style={styles.status}>Status: ⏳ Pending</Text>
      </View>
   );

   return (
      <SafeAreaView style={styles.safeArea}>
         <FlatList
            data={complaints}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            refreshControl={
               <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
               <Text style={styles.emptyText}>No pending complaints found.</Text>
            }
            contentContainerStyle={{ padding: 16 }}
         />
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   safeArea: { flex: 1, backgroundColor: "#fff" },
   card: {
      backgroundColor: "#f9f9f9",
      padding: 16,
      borderRadius: 10,
      marginBottom: 12,
   },
   title: { fontSize: 16, fontWeight: "bold" },
   meta: { fontSize: 12, color: "#555" },
   desc: { marginTop: 8, fontSize: 14 },
   status: { marginTop: 8, fontSize: 13, color: "#FFA500", fontWeight: "bold" },
   emptyText: { textAlign: "center", marginTop: 50, color: "#777" },
});

export default PendingComplaints;
