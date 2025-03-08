import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import { WebView } from "react-native-webview"; // ✅ Import WebView
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Button } from "react-native-paper";
import {
   darkGreen,
   darkRed,
   yellowDark,
   primaryBlue,
   white,
   lightGray,
} from "../../../../constants/Colors";

// ✅ Get full screen height dynamically for best fit
const { height, width } = Dimensions.get("window");

const ViewPaymentReceipt = ({ navigation, route }) => {
   const { payment_receipt } = route.params;
   const [showWebView, setShowWebView] = useState(false);
   const [loading, setLoading] = useState(true); // ✅ Loading State

   let fileUrl = payment_receipt.receipt; // ✅ Direct S3 URL

   // ✅ Use Google Drive Viewer to embed the PDF
   const googleDocsUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(fileUrl)}`;

   return (
      <ScrollView style={{ flex: 1, backgroundColor: white }}>
         <View style={styles.container}>
            {showWebView ? (
               <View style={styles.pdfContainer}>
                  {loading && (
                     <ActivityIndicator
                        size="large"
                        color={primaryBlue}
                        style={styles.loader}
                     />
                  )}
                  <WebView
                     source={{ uri: googleDocsUrl }} // ✅ View PDF inside WebView
                     style={styles.webView}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     scalesPageToFit={false} // ✅ Prevents WebView from auto-scaling incorrectly
                     onLoadEnd={() => setLoading(false)} // ✅ Hide loader when loaded
                     onError={(e) => console.error("❌ WebView Error:", e)}
                     originWhitelist={["*"]}
                     nestedScrollEnabled={true}
                  />
               </View>
            ) : (
               <>
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
                     onPress={() => setShowWebView(true)}
                     style={styles.button}
                  >
                     View Receipt PDF
                  </Button>
               </>
            )}
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
   },
   pdfContainer: {
      flex: 1,
      height: height * 0.85, // ✅ Takes up 90% of screen height
      width: width * 0.9, // ✅ Ensures PDF width fills screen properly
      borderRadius: 10,
      overflow: "hidden",
      backgroundColor: lightGray,
   },
   webView: {
      flex: 1,
      height: "100%",
      width: "100%",
   },
   loader: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -25,
      marginTop: -25,
      zIndex: 10,
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
