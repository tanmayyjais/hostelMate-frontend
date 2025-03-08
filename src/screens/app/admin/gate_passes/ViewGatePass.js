import { useState } from "react";
import { View, Text, StyleSheet, Alert, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Avatar, Button, Dialog, Portal } from "react-native-paper";
import {
   lightGray,
   primaryBlue,
   textDarkGray,
   textLightGray,
   white,
} from "../../../../constants/Colors";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const ViewGatePass = ({ navigation, route }) => {
   const { gate_pass } = route.params;
   const [rejectionReason, setRejectionReason] = useState("");
   const [visible, setVisible] = useState(false); // Rejection dialog visibility

   // ✅ Approve Gate Pass Function
   const handleApprove = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         await axios.put(
            `${baseUrl}gate-pass/${gate_pass._id}`,
            { status: "approved", rejectionReason: "" }, // Remove rejection reason
            { headers: { Authorization: `Bearer ${token}` } }
         );
         Alert.alert("✅ Success", "Gate pass approved successfully.");
         navigation.goBack();
      } catch (error) {
         Alert.alert("❌ Error", "Failed to approve gate pass.");
         console.error("Error approving gate pass:", error);
      }
   };

   // ❌ Reject Gate Pass Function
   const handleReject = async () => {
      if (!rejectionReason.trim()) {
         Alert.alert("⚠️ Warning", "Please provide a reason for rejection.");
         return;
      }
      try {
         const token = await AsyncStorage.getItem("userToken");
         await axios.put(
            `${baseUrl}gate-pass/${gate_pass._id}`,
            { status: "rejected", rejectionReason },
            { headers: { Authorization: `Bearer ${token}` } }
         );
         Alert.alert("🚫 Rejected", "Gate pass rejected successfully.");
         navigation.goBack();
      } catch (error) {
         Alert.alert("❌ Error", "Failed to reject gate pass.");
         console.error("Error rejecting gate pass:", error);
      }
   };

   return (
      <ScrollView style={styles.scrollView}>
         <View style={styles.container}>
            <Card style={styles.card}>
               <Card.Title
                  title="Gate Pass"
                  titleStyle={styles.cardTitle}
                  left={(props) => <Avatar.Icon {...props} icon="card-account-details" color={white} style={styles.avatar} />}
               />

               <Card.Content>
                  {/* Name */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>Name:</Text>
                     <Text style={styles.detailValue}>{gate_pass.name}</Text>
                  </View>

                  {/* Enrollment Number */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>Enrollment No.:</Text>
                     <Text style={styles.detailValue}>{gate_pass.enrollment_no}</Text>
                  </View>

                  {/* ID Number */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>ID No.:</Text>
                     <Text style={styles.detailValue}>{gate_pass.id_number}</Text>
                  </View>

                  {/* Hostel Details */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>Hostel Block:</Text>
                     <Text style={styles.detailValue}>{gate_pass.hostel_block} - Room {gate_pass.room_no}</Text>
                  </View>

                  {/* Departure Details */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>Departure Date:</Text>
                     <Text style={styles.detailValue}>
                        {moment(gate_pass.departure_date).format("DD MMM YYYY")}
                     </Text>
                  </View>

                  {/* Baggage Details */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>Baggage:</Text>
                     <Text style={styles.detailValue}>{gate_pass.baggage_details}</Text>
                  </View>

                  {/* Laptop Details */}
                  <View style={styles.detailContainer}>
                     <Text style={styles.detailTitle}>Laptop:</Text>
                     <Text style={styles.detailValue}>
                        {gate_pass.laptop_details?.make
                           ? `${gate_pass.laptop_details.make} (Qty: ${gate_pass.laptop_details.quantity})`
                           : "No Laptop"}
                     </Text>
                  </View>

                  {/* Status */}
                  <View style={[styles.statusContainer, { backgroundColor: getStatusColor(gate_pass.status) }]}>
                     <Text style={styles.statusText}>{gate_pass.status.toUpperCase()}</Text>
                  </View>

                  {/* ✅ Show Rejection Reason If Rejected */}
                  {gate_pass.status === "rejected" && gate_pass.rejectionReason ? (
                     <View style={styles.rejectionContainer}>
                        <Text style={styles.rejectionTitle}>Rejection Reason:</Text>
                        <Text style={styles.rejectionMessage}>{gate_pass.rejectionReason}</Text>
                     </View>
                  ) : null}
               </Card.Content>

               {/* ✅ Show Buttons Only If Status is Pending */}
               {gate_pass.status === "pending" && (
                  <Card.Actions>
                     {/* ✅ Approve Button */}
                     <Button
                        mode="contained"
                        buttonColor="#4CAF50"
                        style={styles.button}
                        onPress={handleApprove}
                     >
                        Approve
                     </Button>

                     {/* ❌ Reject Button */}
                     <Button
                        mode="contained"
                        buttonColor="#F44336"
                        style={styles.button}
                        onPress={() => setVisible(true)} // Show reject dialog
                     >
                        Reject
                     </Button>
                  </Card.Actions>
               )}

               {/* Rejection Reason Dialog */}
               <Portal>
                  <Dialog visible={visible} onDismiss={() => setVisible(false)}>
                     <Dialog.Title>Reject Gate Pass</Dialog.Title>
                     <Dialog.Content>
                        <Text>Please provide a reason for rejection:</Text>
                        <TextInput
                           style={styles.input}
                           placeholder="Enter reason..."
                           value={rejectionReason}
                           onChangeText={setRejectionReason}
                        />
                     </Dialog.Content>
                     <Dialog.Actions>
                        <Button onPress={() => setVisible(false)}>Cancel</Button>
                        <Button onPress={handleReject}>Submit</Button>
                     </Dialog.Actions>
                  </Dialog>
               </Portal>
            </Card>
         </View>
      </ScrollView>
   );
};

// Function to get background color based on status
const getStatusColor = (status) => {
   switch (status) {
      case "approved":
         return "#4CAF50"; // Green
      case "pending":
         return "#FFC107"; // Yellow
      case "rejected":
         return "#F44336"; // Red
      default:
         return textLightGray;
   }
};

const styles = StyleSheet.create({
   scrollView: {
      flex: 1,
      backgroundColor: white,
   },
   container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
   },
   card: {
      width: "100%",
      borderRadius: 12,
      paddingVertical: 10,
      backgroundColor: white,
      elevation: 5, // Shadow effect
   },
   cardTitle: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 10,
      marginLeft: -50,
   },
   avatar: {
      backgroundColor: primaryBlue,
   },
   detailContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: lightGray,
   },
   detailTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: textDarkGray,
   },
   detailValue: {
      fontSize: 16,
      fontWeight: "500",
      color: primaryBlue,
   },
   statusContainer: {
      paddingVertical: 6,
      borderRadius: 6,
      alignItems: "center",
      marginTop: 12,
   },
   statusText: {
      fontSize: 18,
      fontWeight: "bold",
      color: white,
   },
   button: {
      width: "48%",
      marginHorizontal: "1%",
      marginTop: 10,
      borderRadius: 6,
   },
   rejectionContainer: {
      marginTop: 15,
      padding: 10,
      backgroundColor: "#F8D7DA",
      borderRadius: 8,
      borderWidth: 1,
      borderColor: "#F5C6CB",
   },
   input: {
      borderBottomWidth: 1,
      borderBottomColor: textDarkGray,
      marginTop: 5,
   },
});

export default ViewGatePass;
