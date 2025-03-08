import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { Icon, Card, TouchableRipple, ActivityIndicator, SegmentedButtons, Badge } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../../config/BaseUrl";
import { AuthContext } from "../../../context/AuthContext";
import {
   primaryBlue,
   textDarkGray,
   textLightGray,
   white,
} from "../../../constants/Colors";
import moment from "moment";

const GatePasses = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const [gatePasses, setGatePasses] = useState([]);
   const [loading, setLoading] = useState(true);
   const [filterStatus, setFilterStatus] = useState("pending"); // Toggle between "pending" & "approved"
   const { userInfo } = useContext(AuthContext);

   // ✅ Fetch all gate passes from the API
   const fetchGatePasses = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         const response = await axios.get(`${baseUrl}gate-pass/admin`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         //console.log("✅ Fetched Gate Passes:", response.data);
         setGatePasses(response.data);
      } catch (error) {
         console.error("❌ Error fetching gate passes:", error.response?.data || error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchGatePasses();
   }, []);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchGatePasses();
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   }, []);

   // ✅ Filter gate passes based on status
   const filteredGatePasses = gatePasses.filter((pass) => pass.status === filterStatus);

   return (
      <View style={styles.container}>
         <View style={styles.contentContainer}>
            <Text style={styles.heading}>Gate Pass Requests</Text>

            {/* ✅ Toggle Button for Pending & Approved */}
            <SegmentedButtons
               value={filterStatus}
               onValueChange={setFilterStatus}
               buttons={[
                  { value: "pending", label: "Pending", icon: "clock-outline" },
                  { value: "approved", label: "Approved", icon: "check-circle-outline" },
               ]}
               style={styles.toggleButton}
            />

            {loading ? (
               <ActivityIndicator size="large" color={primaryBlue} style={{ marginTop: 20 }} />
            ) : (
               <FlatList
                  data={filteredGatePasses}
                  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                  renderItem={({ item }) => (
                     <TouchableRipple
                        onPress={() => navigation.navigate("AdminViewGatePass", { gate_pass: item })}
                        rippleColor="rgba(0, 0, 0, 0.1)"
                     >
                        <Card style={styles.card}>
                           <Card.Content>
                              <View style={styles.row}>
                                 <Icon
                                    source={item.status === "pending" ? "clock" : "check-circle"}
                                    color={item.status === "pending" ? "#FFB74D" : "#4CAF50"}
                                    size={30}
                                 />
                                 <View style={styles.cardContent}>
                                    <Text style={styles.title}>{item.name}</Text>

                                    <View style={styles.detailRow}>
                                       <Icon source="id-card" size={16} color={textDarkGray} />
                                       <Text style={styles.details}>{item.enrollment_no}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                       <Icon source="home-city" size={16} color={textDarkGray} />
                                       <Text style={styles.details}>{item.hostel_block} - Room {item.room_no}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                       <Icon source="calendar" size={16} color={textDarkGray} />
                                       <Text style={styles.details}>
                                          Departure: {moment(item.departure_date).format("DD MMM YYYY")}
                                       </Text>
                                    </View>

                                    {/* Status Badge */}
                                    <Badge style={[styles.statusBadge, getStatusStyle(item.status)]}>
                                       {item.status.toUpperCase()}
                                    </Badge>
                                 </View>
                              </View>
                           </Card.Content>
                        </Card>
                     </TouchableRipple>
                  )}
                  keyExtractor={(item) => item._id}
                  style={styles.listStyles}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                     <View>
                        <Text style={styles.emptyText}>No {filterStatus} gate pass requests!</Text>
                     </View>
                  }
               />
            )}
         </View>
      </View>
   );
};

// ✅ Function to get background color based on status
const getStatusStyle = (status) => {
   switch (status) {
      case "approved":
         return { backgroundColor: "#4CAF50" }; // Green
      case "pending":
         return { backgroundColor: "#FFC107" }; // Yellow
      case "rejected":
         return { backgroundColor: "#F44336" }; // Red
      default:
         return { backgroundColor: textLightGray };
   }
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      backgroundColor: white,
   },
   contentContainer: {
      flex: 1,
      width: "95%",
      marginTop: 10,
   },
   heading: {
      fontFamily: "fontBold",
      fontSize: 22,
      width: "100%",
      textAlign: "center",
      marginBottom: 10,
   },
   toggleButton: {
      width: "100%",
      marginBottom: 15,
   },
   listStyles: {
      width: "100%",
   },
   card: {
      marginVertical: 4,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: white,
      padding: 5,
      width: "100%",
   },
   row: {
      flexDirection: "row",
      alignItems: "center",
   },
   cardContent: {
      marginLeft: 15,
   },
   title: {
      fontFamily: "fontBold",
      fontSize: 18,
      color: textDarkGray,
   },
   detailRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 1,
   },
   details: {
      fontFamily: "fontRegular",
      fontSize: 14,
      color: textDarkGray,
      marginLeft: 5,
   },
   statusBadge: {
      paddingVertical: 6,
      height: 30,
      paddingHorizontal: 12,
      borderRadius: 10,
      fontSize: 14,
      fontWeight: "bold",
      color: white,
      alignSelf: "flex-start",
      marginTop: 5,
   },
   emptyText: {
      fontFamily: "fontBold",
      textAlign: "center",
      fontSize: 16,
      marginTop: 15,
   },
});

export default GatePasses;
