import { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   black,
   lightGray,
   primaryBlue,
   white,
} from "../../../../constants/Colors";
import { Button, TextInput, TouchableRipple } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../../context/AuthContext";
import RNPickerSelect from "react-native-picker-select"; // ✅ Corrected dropdown import

const AddPaymentReceipt = ({ navigation }) => {
   const { userInfo } = useContext(AuthContext);
   const [selectedFile, setSelectedFile] = useState(null);

   const addPaymentReceiptSchema = Yup.object({
      category: Yup.string().required("Category is required!"),
      enrollmentNo: Yup.string().required("Enrollment number is required!"),
      idNumber: Yup.string()
         .matches(/^\d{5}$/, "ID Number must be 5 digits")
         .required("ID Number is required!"),
      challanNo: Yup.string().required("Challan number is required!"),
      amount: Yup.string().required("Amount is required!"),
      receipt: Yup.string(),
   });

   const handleUploadFile = async () => {
      try {
         const result = await DocumentPicker.getDocumentAsync({
            type: "application/pdf",
         });
   
         // ✅ Handle user cancel action
         if (result.canceled) {
            console.log("File selection was cancelled.");
            return;
         }
   
         // ✅ Ensure file selection is successful before setting state
         if (result.assets && result.assets.length > 0) {
            setSelectedFile(result.assets[0]); // Store only the selected file
            console.log("File selected:", result.assets[0].name);
         } else {
            console.log("No file selected.");
         }
      } catch (error) {
         console.error("Error selecting file:", error);
         alert("Failed to select file. Please try again.");
      }
   };
   
   

   const handleAddPaymentReceipt = async (values) => {
      try {
         console.log("📤 Preparing to submit form with values:", values);
   
         const token = await AsyncStorage.getItem("userToken");
         const storedUserInfo = await AsyncStorage.getItem("userInfo");
         const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
   
         console.log("🔍 Checking AsyncStorage - User Info:", parsedUserInfo);
   
         if (!token) {
            alert("Authentication required. Please log in again.");
            return;
         }
   
         // ✅ Fix: Use `_id` if available, otherwise use `id`
         const userId = parsedUserInfo?._id || parsedUserInfo?.id;
         if (!userId) {
            alert("User information is missing.");
            return;
         }
   
         if (!selectedFile) {
            alert("Please select a PDF file before submitting.");
            return;
         }
   
         const formData = new FormData();
         formData.append("name", userInfo.full_name);
         formData.append("category", values.category);
         formData.append("enrollment_number", values.enrollmentNo);
         formData.append("id_number", values.idNumber);
         formData.append("challan_number", values.challanNo);
         formData.append("amount", values.amount);
         formData.append("user", userId); // ✅ Ensure user ID is always passed
   
         console.log("🚀 Submitting with user ID:", userId);
   
         formData.append("receipt", {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: "application/pdf",
         });
   
         console.log("📦 Final FormData before API Call:", formData);
   
         const response = await axios.post(`${baseUrl}payment-receipts`, formData, {
            headers: {
               "Content-Type": "multipart/form-data",
               Authorization: `Bearer ${token}`,
            },
         });
   
         console.log("✅ Payment receipt uploaded successfully:", response.data);
         alert("Payment receipt submitted successfully!");
         navigation.goBack();
      } catch (error) {
         console.error("❌ Error submitting payment receipt:", error?.response?.data || error);
         alert("Failed to submit payment receipt. Please try again.");
      }
   };              
   

   return (
      <ScrollView
         style={{ flex: 1 }}
         contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
         showsVerticalScrollIndicator={false}
      >
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <Text style={styles.titleText}>Add Payment Receipt</Text>
               <Formik
               initialValues={{
                  category: "",
                  enrollmentNo: "",
                  idNumber: "",
                  challanNo: "",
                  amount: "",
                  receipt: "",
               }}
               validationSchema={addPaymentReceiptSchema}
               validateOnChange={true} // ✅ Ensures validation occurs on field changes
               validateOnBlur={true} // ✅ Ensures validation occurs on blur
               onSubmit={(values, { setSubmitting }) => {
                  console.log("✅ Formik Submission Triggered with values:", values);
                  handleAddPaymentReceipt(values);
                  setSubmitting(false); // ✅ Prevents UI freezing on submission
               }}
            >


                  {({ handleBlur, handleChange, handleSubmit, values }) => (
                     <View style={styles.form}>
                        {/* Category Dropdown ✅ Fixed */}
                        <Text style={styles.label}>Select Payment Category</Text>
                        <RNPickerSelect
                           onValueChange={handleChange("category")}
                           items={[
                              { label: "Hostel Fees for 8th Semester", value: "Hostel Fees 8th Sem" },
                              { label: "Hostel Fees for 7th Semester", value: "Hostel Fees 7th Sem" },
                              { label: "Hostel Fees for 6th Semester", value: "Hostel Fees 6th Sem" },
                           ]}
                           style={pickerSelectStyles}
                        />

                        {/* Enrollment Number */}
                        <TextInput
                           mode="outlined"
                           label="Enrollment No."
                           placeholder="Enter enrollment number"
                           onChangeText={handleChange("enrollmentNo")}
                           onBlur={handleBlur("enrollmentNo")}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />

                        {/* ID Number (5 Digits) */}
                        <TextInput
                           mode="outlined"
                           label="ID Number"
                           placeholder="Enter 5-digit ID number"
                           keyboardType="numeric"
                           maxLength={5}
                           onChangeText={handleChange("idNumber")}
                           onBlur={handleBlur("idNumber")}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />

                        {/* Challan Number */}
                        <TextInput
                           mode="outlined"
                           label="Challan No."
                           placeholder="Enter challan number"
                           onChangeText={handleChange("challanNo")}
                           onBlur={handleBlur("challanNo")}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />

                        {/* Amount */}
                        <TextInput
                           mode="outlined"
                           label="Amount"
                           placeholder="Enter amount"
                           keyboardType="numeric"
                           onChangeText={handleChange("amount")}
                           onBlur={handleBlur("amount")}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />

                        {/* File Upload with Preview */}
                        <TouchableRipple style={styles.uploadContainer} onPress={handleUploadFile}>
                           <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                              {selectedFile ? (
                                 <Text style={{ fontFamily: "fontRegular", color: primaryBlue }}>
                                    {selectedFile.name}
                                 </Text>
                              ) : (
                                 <Text style={{ fontFamily: "fontRegular", color: lightGray }}>
                                    Tap to upload PDF
                                 </Text>
                              )}
                           </View>
                        </TouchableRipple>

                        {/* Submit Button */}
                        <Button
                        mode="contained"
                        labelStyle={{
                           fontFamily: "fontRegular",
                           fontSize: 16,
                           paddingVertical: 5,
                        }}
                        buttonColor={primaryBlue}
                        onPress={() => {
                           console.log("Submit button pressed. Calling handleSubmit...");
                           handleSubmit(); // Ensure this triggers onSubmit inside Formik
                        }}
                        style={{ marginTop: 12, borderRadius: 8 }}
                     >
                        Submit Payment Receipt
                     </Button>


                     </View>
                  )}
               </Formik>
            </View>
         </View>
      </ScrollView>
   );
};

// Dropdown Styles
const pickerSelectStyles = {
   inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: lightGray,
      borderRadius: 4,
      color: black,
   },
   inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: lightGray,
      borderRadius: 4,
      color: black,
   },
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: white,
   },
   contentContainer: {
      flex: 1,
      width: "90%",
      alignItems: "center",
   },
   title: {
      width: "90%",
      fontFamily: "Roboto Regular",
      fontSize: 16,
      marginVertical: 10,
   },
   titleText: {
      fontFamily: "fontBold",
      fontSize: 20,
      marginVertical: 12,
   },
   form: {
      width: "100%",
   },
   uploadImage: {
      height: 150,
      width: "100%",
      marginTop: 15,
      borderRadius: 8,
      borderStyle: "dashed",
      borderWidth: 1,
      borderColor: lightGray,
   },
});

export default AddPaymentReceipt;

