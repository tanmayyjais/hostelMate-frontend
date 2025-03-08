import React, { useState } from "react";
import { View, Text, StyleSheet, Linking } from "react-native";
import { Button, Card, Dialog, Portal } from "react-native-paper";
import { WebView } from "react-native-webview"; // ✅ WebView for PDF preview
import { imageBaseUrl, baseUrl } from "../../../../config/BaseUrl";
import {
   darkGreen,
   darkRed,
   yellowDark,
   primaryBlue,
   textDarkGray,
   white,
} from "../../../../constants/Colors";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewPaymentReceipt = ({ navigation, route }) => {
   const { payment_receipt } = route.params;
   const [loading, setLoading] = useState(false);
   const [visible, setVisible] = useState(false);
   const [pdfFailed, setPdfFailed] = useState(false);

   // ✅ API Calls to Accept or Decline Receipt
   const handleStatusUpdate = async (status) => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem("userToken");
         await axios.put(`${baseUrl}payment-receipts/${payment_receipt._id}`, { status }, {
            headers: { Authorization: `Bearer ${token}` },
         });
         alert(`Receipt ${status}!`);
         navigation.goBack();
      } catch (error) {
         console.error("❌ Error updating receipt status:", error);
         alert("Failed to update receipt status. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   // ✅ Construct PDF URL for WebView
   const pdfUrl = `${imageBaseUrl}${payment_receipt.receipt}`;
   const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`;

   return (
      <View style={styles.container}>
         <Card style={styles.card}>
            <Card.Title title="Receipt Details" titleStyle={styles.cardTitle} />
            <Card.Content>
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
                  <Text style={styles.detailTitle}>Category</Text>
                  <Text style={styles.detailValue}>{payment_receipt.category}</Text>
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
            </Card.Content>
         </Card>

         {/* ✅ Button to Open PDF Dialog */}
         <Button
            mode="contained"
            buttonColor={primaryBlue}
            onPress={() => setVisible(true)}
            style={styles.button}
         >
            View Receipt
         </Button>

         {/* ✅ Dialog with PDF Viewer */}
         <Portal>
            <Dialog visible={visible} onDismiss={() => setVisible(false)} style={styles.dialog}>
               <Dialog.Title>Receipt Preview</Dialog.Title>
               <Dialog.Content>
                  <View style={styles.pdfContainer}>
                     {!pdfFailed ? (
                        <WebView
                           source={{ uri: googleDocsUrl }}
                           style={styles.pdfView}
                           onError={() => {
                              setPdfFailed(true);
                              //console.log("⚠️ WebView PDF failed, opening in browser.");
                           }}
                        />
                     ) : (
                        <Text style={styles.errorText}>
                           ❌ Unable to preview PDF. Open in browser instead.
                        </Text>
                     )}
                  </View>
               </Dialog.Content>
               <Dialog.Actions>
                  {pdfFailed && (
                     <Button onPress={() => Linking.openURL(pdfUrl)}>Open in Browser</Button>
                  )}
                  <Button onPress={() => setVisible(false)}>Close</Button>
               </Dialog.Actions>
            </Dialog>
         </Portal>

         {/* ✅ Action Buttons */}
         {payment_receipt.status === "pending" && (
            <View style={styles.buttonContainer}>
               <Button
                  mode="contained"
                  buttonColor={darkGreen}
                  loading={loading}
                  onPress={() => handleStatusUpdate("accepted")}
                  style={styles.actionButton}
               >
                  Accept Receipt
               </Button>
               <Button
                  mode="contained"
                  buttonColor={darkRed}
                  loading={loading}
                  onPress={() => handleStatusUpdate("declined")}
                  style={styles.actionButton}
               >
                  Decline Receipt
               </Button>
            </View>
         )}
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: white,
   },
   card: {
      marginBottom: 15,
      borderRadius: 10,
      elevation: 4,
   },
   cardTitle: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
   },
   detailContainer: {
      marginVertical: 8,
   },
   detailTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: textDarkGray,
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
      marginTop: 10,
      borderRadius: 8,
   },
   buttonContainer: {
      marginTop: 20,
   },
   actionButton: {
      borderRadius: 6,
      marginVertical: 5,
   },
   dialog: {
      backgroundColor: white,
      borderRadius: 10,
      padding: 10,
   },
   pdfContainer: {
      height: 400,
      width: "100%",
   },
   pdfView: {
      flex: 1,
   },
   errorText: {
      fontSize: 16,
      textAlign: "center",
      color: "red",
      marginBottom: 20,
   },
});

export default ViewPaymentReceipt;
