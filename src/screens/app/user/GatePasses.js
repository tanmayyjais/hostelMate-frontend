import { useState, useCallback, useContext, useEffect } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import { Icon, Card, TouchableRipple, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "../../../config/BaseUrl"; // Ensure this is correctly set up
import { AuthContext } from "../../../context/AuthContext";
import {
   primaryBlue,
   textDarkGray,
   textLightGray,
   white,
   lightGray,
} from "../../../constants/Colors";

const GatePasses = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);
   const [gatePasses, setGatePasses] = useState([]);
   const [loading, setLoading] = useState(true);
   const { userInfo } = useContext(AuthContext);

   // ✅ Fetch User's Gate Passes from API
   const fetchGatePasses = async () => {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
         console.error("❌ Token is missing!");
         setLoading(false);
         return;
      }

      try {
         const response = await axios.get(`${baseUrl}gate-pass/`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         console.log("✅ Fetched Gate Passes:", response.data);
         setGatePasses(response.data);
      } catch (error) {
         console.error("❌ Error fetching gate passes:", error.response?.data || error.message);
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

   return (
      <View style={styles.container}>
         <View style={styles.contentContainer}>
            <Text style={styles.heading}>Gate Passes</Text>

            {loading ? (
               <ActivityIndicator size="large" color={primaryBlue} style={{ marginTop: 20 }} />
            ) : (
               <FlatList
                  data={gatePasses}
                  refreshControl={
                     <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  renderItem={({ item }) => {
                     return (
                        <TouchableRipple
                           onPress={() =>
                              navigation.navigate("UserViewGatePass", { gate_pass: item })
                           }
                           //borderless
                        >
                           <Card style={styles.card}>
                              <Card.Content>
                                 <View style={styles.row}>
                                    <Icon
                                       source={item.status === "pending" ? "clock" : "check-circle"}
                                       color={
                                          item.status === "pending"
                                             ? "#FFB74D" // Orange for pending
                                             : "#4CAF50" // Green for approved
                                       }
                                       size={28}
                                    />
                                    <View style={styles.cardContent}>
                                       <Text style={styles.title}>{item.name}</Text>
                                       <Text style={styles.details}>
                                          <Icon source="id-card" size={16} color={textDarkGray} />{" "}
                                          {item.enrollment_no}
                                       </Text>
                                       <Text style={styles.details}>
                                          <Icon source="home-city" size={16} color={textDarkGray} />{" "}
                                          {item.hostel_block} - Room {item.room_no}
                                       </Text>
                                       <Text style={styles.details}>
                                          <Icon source="calendar" size={16} color={textDarkGray} />{" "}
                                          Departure: {new Date(item.departure_date).toDateString()}
                                       </Text>
                                       <Text style={[styles.status, styles[item.status]]}>
                                          {item.status.toUpperCase()}
                                       </Text>
                                    </View>
                                 </View>
                              </Card.Content>
                           </Card>
                        </TouchableRipple>
                     );
                  }}
                  keyExtractor={(item) => item._id}
                  style={styles.listStyles}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={
                     <View>
                        <Text style={styles.emptyText}>There are no gate passes!</Text>
                     </View>
                  }
                  ListHeaderComponent={
                     <TouchableRipple
                        style={styles.requestButton}
                        onPress={() => navigation.navigate("UserRequestGatePass")}
                     >
                        <View style={styles.addAnnouncement}>
                           <Text style={styles.requestButtonText}>Request a Gate Pass</Text>
                           <Icon source="plus-box" color={primaryBlue} size={24} />
                        </View>
                     </TouchableRipple>
                  }
               />
            )}
         </View>
      </View>
   );
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
      marginTop: 15,
   },
   heading: {
      fontFamily: "fontBold",
      fontSize: 22,
      width: "100%",
      textAlign: "center",
      marginBottom: 10,
   },
   listStyles: {
      width: "100%",
   },
   card: {
      marginVertical: 8,
      borderRadius: 10,
      elevation: 3,
      backgroundColor: white,
      padding: 10,
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
   details: {
      fontFamily: "fontRegular",
      fontSize: 14,
      color: textDarkGray,
      marginVertical: 2,
   },
   status: {
      fontFamily: "fontBold",
      fontSize: 14,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      textAlign: "center",
      marginTop: 5,
      alignSelf: "flex-start",
   },
   pending: {
      backgroundColor: "#FFEB3B",
      color: "#795548",
   },
   approved: {
      backgroundColor: "#C8E6C9",
      color: "#2E7D32",
   },
   rejected: {
      backgroundColor: "#FFCDD2",
      color: "#D32F2F",
   },
   emptyText: {
      fontFamily: "fontBold",
      textAlign: "center",
      fontSize: 16,
      marginTop: 15,
   },
   requestButton: {
      //width: "100%",
      margin: 10,
      padding: 15,
      paddingHorizontal: 20,
      borderRadius: 8,
      borderColor: primaryBlue,
      borderWidth: 1,
   },
   addAnnouncement: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
   requestButtonText: {
      color: textDarkGray,
      fontFamily: "fontRegular",
      fontSize: 16,
   },
});

export default GatePasses;
