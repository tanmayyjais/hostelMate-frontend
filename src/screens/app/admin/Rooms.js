import { useEffect, useState, useContext } from "react";
import { View, Text, RefreshControl, FlatList, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import { AuthContext } from "../../../context/AuthContext";
import { white, primaryBlue, lightGray } from "../../../constants/Colors";

const Rooms = ({ navigation }) => {
   const { userInfo } = useContext(AuthContext);
   const [pendingRequests, setPendingRequests] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

   // ✅ Fetch Pending Room Requests from Database
   const fetchPendingRequests = async () => {
      setLoading(true);
      try {
         const response = await axios.get(`${baseUrl}rooms/pending`);
         setPendingRequests(response.data.requests);
      } catch (error) {
         console.error("❌ Error fetching pending requests:", error);
         Alert.alert("Error", "Could not fetch pending room requests.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchPendingRequests();
   }, []);

   // ✅ Handle Approve Request
   const handleApprove = async (roomId) => {
      try {
         const response = await axios.post(`${baseUrl}rooms/approve`, { roomId });
         Alert.alert("✅ Success", response.data.message);
         fetchPendingRequests(); // Refresh list after update
      } catch (error) {
         console.error("❌ Approval failed:", error);
         Alert.alert("Error", error.response?.data?.message || "Approval failed.");
      }
   };

   // ✅ Handle Reject Request
   const handleReject = async (roomId) => {
      try {
         const response = await axios.post(`${baseUrl}rooms/reject`, { roomId });
         Alert.alert("🚫 Rejected", response.data.message);
         fetchPendingRequests(); // Refresh list after update
      } catch (error) {
         console.error("❌ Rejection failed:", error);
         Alert.alert("Error", error.response?.data?.message || "Rejection failed.");
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         {loading ? (
            <ActivityIndicator animating={true} size="large" color={primaryBlue} style={{ marginTop: 20 }} />
         ) : (
            <FlatList
               data={pendingRequests}
               keyExtractor={(item) => item._id}
               refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendingRequests} />}
               ListHeaderComponent={() => <Text style={styles.title}>Pending Room Requests</Text>}
               ListEmptyComponent={() => <Text style={styles.noRequests}>No pending room requests.</Text>}
               renderItem={({ item }) => (
                  <Card style={styles.card}>
                     <Card.Content>
                        <Text style={styles.roomText}>🏢 Hostel: {item.hostel_no}</Text>
                        <Text style={styles.roomText}>📍 Floor: {item.floor_no}</Text>
                        <Text style={styles.roomText}>🛏 Room: {item.room_no}</Text>
                        <Text style={styles.userText}>👤 Requested by: {item.allocated_to?.full_name || "Unknown"}</Text>
                     </Card.Content>
                     <Card.Actions>
                        <Button mode="contained" onPress={() => handleApprove(item._id)} buttonColor={primaryBlue}>
                           Approve
                        </Button>
                        <Button mode="outlined" onPress={() => handleReject(item._id)} textColor="red">
                           Reject
                        </Button>
                     </Card.Actions>
                  </Card>
               )}
            />
         )}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: white },
   title: { marginVertical: 10, fontSize: 20, fontFamily: "fontBold", textAlign: "center" },
   noRequests: { fontSize: 16, color: lightGray, marginTop: 20, textAlign: "center" },
   card: { marginVertical: 8, marginHorizontal: 16, padding: 10, backgroundColor: white, borderRadius: 10, elevation: 5 },
   roomText: { fontSize: 16, fontWeight: "bold" },
   userText: { fontSize: 14, color: primaryBlue, marginTop: 5 },
});

export default Rooms;
