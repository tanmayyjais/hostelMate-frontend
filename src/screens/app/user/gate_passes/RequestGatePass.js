import { useState, useCallback, useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../../../../context/AuthContext";
import {
   primaryBlue,
   textDarkGray,
   textLightGray,
   white,
} from "../../../../constants/Colors";
import { baseUrl } from "../../../../config/BaseUrl";

const RequestGatePass = ({ navigation }) => {
   const { userInfo } = useContext(AuthContext);
   const [departureDate, setDepartureDate] = useState(null);

   // ✅ Schema Validation
   const requestGatePassSchema = Yup.object({
      name: Yup.string().required("Name is required"),
      enrollment_no: Yup.string().required("Enrollment No. is required"),
      id_number: Yup.string().required("ID No. is required"),
      hostel_block: Yup.string().required("Hostel Block is required"),
      room_no: Yup.string().required("Room No. is required"),
      departure_date: Yup.date().required("Departure Date is required"),
      laptop_make: Yup.string(),
      laptop_quantity: Yup.number().min(1, "Quantity must be at least 1"),
      baggage_details: Yup.string(),
   });

   // ✅ Submit Handler
   const handleRequestGatePass = async (values) => {
      try {
         const token = await AsyncStorage.getItem("userToken");
   
         const response = await axios.post(
            `${baseUrl}gate-pass/`,
            {
               user: userInfo ? userInfo._id : null,
               name: values.name,
               enrollment_no: values.enrollment_no,
               id_number: values.id_number,
               hostel_block: values.hostel_block,
               room_no: values.room_no,
               departure_date: values.departure_date,
               laptop_details: {
                  make: values.laptop_make || null,  // ✅ Ensure it's nested correctly
                  quantity: values.laptop_quantity ? parseInt(values.laptop_quantity) : 0, // ✅ Convert to integer
               },
               baggage_details: values.baggage_details || "No bags",
               status: "pending",
            },
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
   
         if (response.status === 201) {
            alert("Gate Pass Requested Successfully");
            navigation.goBack();
         }
      } catch (error) {
         console.error("Error requesting gate pass:", error.response?.data || error);
         alert("Failed to request gate pass. Please try again.");
      }
   };
   

   return (
      <ScrollView
         style={styles.scrollView}
         contentContainerStyle={styles.scrollViewContent}
         showsVerticalScrollIndicator={false}
      >
         <View style={styles.container}>
            <Text style={styles.titleText}>Request a Gate Pass</Text>

            <Formik
               initialValues={{
                  name: userInfo?.full_name || "",
                  enrollment_no: userInfo?.enrollment_no || "",
                  id_number: userInfo?.id_number || "",
                  hostel_block: userInfo?.hostel_no || "",
                  room_no: userInfo?.room_no ? String(userInfo.room_no) : "",
                  departure_date: new Date(),
                  laptop_make: "",
                  laptop_quantity: "",
                  baggage_details: "",
               }}
               validationSchema={requestGatePassSchema}
               onSubmit={handleRequestGatePass}
            >
               {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, errors, touched }) => (
                  <View style={styles.form}>
                     {/* Full Name */}
                     <TextInput
                        mode="outlined"
                        label="Full Name"
                        value={values.name}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        editable={!userInfo?.full_name}
                        style={styles.input}
                        error={errors.name && touched.name}
                     />

                     {/* Enrollment No. */}
                     <TextInput
                        mode="outlined"
                        label="Enrollment No."
                        value={values.enrollment_no}
                        onChangeText={handleChange("enrollment_no")}
                        onBlur={handleBlur("enrollment_no")}
                        editable={!userInfo?.enrollment_no}
                        style={styles.input}
                        error={errors.enrollment_no && touched.enrollment_no}
                     />

                     {/* ID No. */}
                     <TextInput
                        mode="outlined"
                        label="ID Number"
                        value={values.id_number}
                        onChangeText={handleChange("id_number")}
                        onBlur={handleBlur("id_number")}
                        editable={!userInfo?.id_number}
                        style={styles.input}
                        error={errors.id_number && touched.id_number}
                     />

                     {/* Hostel Block */}
                     <TextInput
                        mode="outlined"
                        label="Hostel Block"
                        value={values.hostel_block}
                        onChangeText={handleChange("hostel_block")}
                        onBlur={handleBlur("hostel_block")}
                        editable={!userInfo?.hostel_no}
                        style={styles.input}
                        error={errors.hostel_block && touched.hostel_block}
                     />

                     {/* Room No. */}
                     <TextInput
                        mode="outlined"
                        label="Room No."
                        value={values.room_no}
                        onChangeText={handleChange("room_no")}
                        onBlur={handleBlur("room_no")}
                        editable={!userInfo?.room_no}
                        keyboardType="numeric"
                        style={styles.input}
                        error={errors.room_no && touched.room_no}
                     />

                     {/* Departure Date */}
                     <DatePickerInput
                        locale="en"
                        label="Departure Date"
                        value={departureDate}
                        onChange={(d) => {
                           setDepartureDate(d);
                           setFieldValue("departure_date", d);
                        }}
                        inputMode="start"
                        style={styles.input}
                        mode="outlined"
                     />

                     {/* Laptop Make */}
                     <TextInput
                        mode="outlined"
                        label="Laptop Make (Optional)"
                        value={values.laptop_make}
                        onChangeText={handleChange("laptop_make")}
                        onBlur={handleBlur("laptop_make")}
                        style={styles.input}
                     />

                     {/* Laptop Quantity */}
                     <TextInput
                        mode="outlined"
                        label="Laptop Quantity (Optional)"
                        value={values.laptop_quantity}
                        onChangeText={handleChange("laptop_quantity")}
                        onBlur={handleBlur("laptop_quantity")}
                        keyboardType="numeric"
                        style={styles.input}
                     />

                     {/* Baggage Details */}
                     <TextInput
                        mode="outlined"
                        label="Baggage Details (Optional)"
                        value={values.baggage_details}
                        onChangeText={handleChange("baggage_details")}
                        onBlur={handleBlur("baggage_details")}
                        multiline
                        numberOfLines={3}
                        style={[styles.input, styles.multilineInput]}
                     />

                     {/* Submit Button */}
                     <Button
                        mode="contained"
                        labelStyle={styles.buttonText}
                        buttonColor={primaryBlue}
                        onPress={handleSubmit}
                        style={styles.button}
                     >
                        Submit Gate Pass Request
                     </Button>
                  </View>
               )}
            </Formik>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   scrollView: {
      flex: 1,
      backgroundColor: white,
   },
   scrollViewContent: {
      paddingBottom: 30, // Ensures button is visible
   },
   container: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 20,
   },
   titleText: {
      fontFamily: "fontBold",
      fontSize: 22,
      marginBottom: 15,
   },
   form: {
      width: "100%",
   },
   input: {
      marginBottom: 12,
      backgroundColor: white,
   },
   multilineInput: {
      height: 80, // Consistent size for multiline inputs
      textAlignVertical: "top",
   },
   button: {
      marginTop: 20,
      borderRadius: 8,
      alignSelf: "center",
      width: "100%", // Ensures button takes full width
   },
   buttonText: {
      fontFamily: "fontRegular",
      fontSize: 16,
      paddingVertical: 5,
   },
});

export default RequestGatePass;
