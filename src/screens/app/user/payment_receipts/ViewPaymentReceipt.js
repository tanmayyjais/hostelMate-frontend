import { View, Text, StyleSheet, Linking } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import { imageBaseUrl } from "../../../../config/BaseUrl";
import {
   darkGreen,
   darkRed,
   yellowDark,
   primaryBlue,
   white,
} from "../../../../constants/Colors";

const ViewPaymentReceipt = ({ navigation, route }) => {
   const { payment_receipt } = route.params;

   const openReceipt = () => {
      if (payment_receipt.receipt) {
         const fileUrl = `${imageBaseUrl}${payment_receipt.receipt}`;
         Linking.openURL(fileUrl);
      } else {
         alert("Receipt file is not available.");
      }
   };

   return (
      <ScrollView style={{ flex: 1, backgroundColor: white }}>
         <View style={styles.container}>
            <Text style={styles.title}>Receipt Details</Text>

            <View style={styles.detailContainer}>
               <Text style={styles.detailTitle}>Full Name</Text>
               <Text style={styles.detailValue}>{payment_receipt.name}</Text>
            </View>

            <View style={styles.detailContainer}>
               <Text style={styles.detailTitle}>Enrollment Number</Text>
               <Text style={styles.detailValue}>{payment_receipt.enrollment_number}</Text>
            </View>

            <View style={styles.detailContainer}>
               <Text style={styles.detailTitle}>Challan Number</Text>
               <Text style={styles.detailValue}>{payment_receipt.challan_number}</Text>
            </View>

            <View style={styles.detailContainer}>
               <Text style={styles.detailTitle}>Amount</Text>
               <Text style={styles.detailValue}>₹{payment_receipt.amount}</Text>
            </View>

            <View style={styles.detailContainer}>
               <Text style={styles.detailTitle}>Status</Text>
               <Text
                  style={[
                     styles.status,
                     {
                        color:
                           payment_receipt.status === "pending"
                              ? yellowDark
                              : payment_receipt.status === "accepted"
                              ? darkGreen
                              : darkRed,
                     },
                  ]}
               >
                  {payment_receipt.status.toUpperCase()}
               </Text>
            </View>

            <Button
               mode="contained"
               buttonColor={primaryBlue}
               onPress={openReceipt}
               style={styles.button}
            >
               View Receipt PDF
            </Button>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
   },
   title: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 20,
   },
   detailContainer: {
      marginBottom: 12,
   },
   detailTitle: {
      fontSize: 16,
      fontWeight: "bold",
   },
   detailValue: {
      fontSize: 14,
      paddingVertical: 5,
      borderBottomColor: primaryBlue,
      borderBottomWidth: 1,
   },
   status: {
      fontSize: 16,
      fontWeight: "bold",
      paddingVertical: 5,
   },
   button: {
      marginTop: 20,
      borderRadius: 8,
   },
});

export default ViewPaymentReceipt;
