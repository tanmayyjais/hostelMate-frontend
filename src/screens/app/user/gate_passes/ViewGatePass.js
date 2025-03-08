import { useContext } from "react"; 
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Card, Avatar, Button } from "react-native-paper";
import {
   lightGray,
   primaryBlue,
   textDarkGray,
   textLightGray,
   white,
} from "../../../../constants/Colors";

import { AuthContext } from "../../../../context/AuthContext";
import moment from "moment";

const ViewGatePass = ({ navigation, route }) => {
   const { gate_pass } = route.params;
   const { userInfo } = useContext(AuthContext);

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

               <Card.Actions>
                  <Button
                     mode="contained"
                     buttonColor={primaryBlue}
                     style={styles.button}
                     onPress={() => navigation.goBack()}
                  >
                     Go Back
                  </Button>
               </Card.Actions>
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
      justifyContent: "center",
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
      width: "100%",
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
   rejectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: "#721C24",
   },
   rejectionMessage: {
      fontSize: 14,
      fontWeight: "500",
      color: "#721C24",
      marginTop: 5,
   },
});

export default ViewGatePass;
