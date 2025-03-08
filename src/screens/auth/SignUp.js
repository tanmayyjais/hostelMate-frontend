import { ScrollView } from "react-native-gesture-handler";
import { useState } from "react";
import { View, Text, Image, StyleSheet, ToastAndroid } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import axios from "axios";
import { baseUrl } from "../../config/BaseUrl";
import { Formik } from "formik";
import * as Yup from "yup";

import logo from "../../../assets/images/VNIT.png";
import { primaryBlue, textLightGray, lightGray, textDarkGray, white, darkRed } from "../../constants/Colors";

const SignUp = ({ navigation }) => {
   const [showMemberType, setShowMemberType] = useState(false);
   const [showGender, setShowGender] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const showToast = () => {
      ToastAndroid.show("User registered successfully!", ToastAndroid.SHORT);
   };

   const handleSignUp = (values) => {
      axios
         .post(`${baseUrl}auth/register`, {
            email: values.email,
            full_name: values.name,
            password: values.password,
            member_type: values.memberType,
            mobile_no: values.mobileNo,
            gender: values.gender,
            enrollment_no: values.enrollmentNo,
            id_number: values.idNumber,
         })
         .then((res) => {
            console.log(res.data);
            showToast();
            navigation.navigate("Login");
         })
         .catch((e) => {
            console.log(e);
         });
   };

   const signUpSchema = Yup.object({
      email: Yup.string().email("Enter a valid email!").required("Email is required!"),
      name: Yup.string().required("Name is required!"),
      mobileNo: Yup.string().length(10, "Enter a valid phone number!").required("Mobile No is required!"),
      memberType: Yup.string().required("Member type is required!"),
      gender: Yup.string().required("Gender is required!"),
      enrollmentNo: Yup.string().required("Enrollment number is required!"),
      idNumber: Yup.string().required("ID number is required!"),
      password: Yup.string().required("Password is required!"),
   });

   return (
      <SafeAreaView style={styles.mainContainer}>
         <ScrollView
            style={styles.container}
            contentContainerStyle={{
               alignItems: "center",
               justifyContent: "center",
            }}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.contentContainer}>
               <View style={styles.imageContainer}>
                  <Image source={logo} resizeMode="contain" style={styles.image} />
               </View>
               <Text style={styles.title}>Sign Up</Text>
               <Text style={styles.text}>Welcome to Hostel Mate - Hostel Management Application</Text>
               <View style={styles.signUpForm}>
                  <Formik
                     initialValues={{
                        email: "",
                        name: "",
                        mobileNo: "",
                        memberType: "",
                        enrollmentNo: "",
                        idNumber: "",
                        gender: "",
                        password: "",
                     }}
                     validationSchema={signUpSchema}
                     onSubmit={(values) => handleSignUp(values)}
                  >
                     {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => {
                        return (
                           <View>
                              <TextInput
                                 mode="outlined"
                                 label={"Email"}
                                 onChangeText={handleChange("email")}
                                 onBlur={handleBlur("email")}
                                 value={values.email}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                              />
                              {errors.email && touched.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                              <TextInput
                                 mode="outlined"
                                 label={"Name"}
                                 onChangeText={handleChange("name")}
                                 onBlur={handleBlur("name")}
                                 value={values.name}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                                 style={{ marginVertical: 10 }}
                              />
                              {errors.name && touched.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}

                              <TextInput
                                 mode="outlined"
                                 label={"Mobile Number"}
                                 onChangeText={handleChange("mobileNo")}
                                 onBlur={handleBlur("mobileNo")}
                                 value={values.mobileNo}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                                 style={{ marginBottom: 10 }}
                              />
                              {errors.mobileNo && touched.mobileNo ? <Text style={styles.errorText}>{errors.mobileNo}</Text> : null}

                              <DropDown
                                 mode="outlined"
                                 label="Member Type"
                                 visible={showMemberType}
                                 showDropDown={() => setShowMemberType(true)}
                                 onDismiss={() => setShowMemberType(false)}
                                 list={[
                                    { label: "Student", value: "student" },
                                    { label: "Academic Staff", value: "academicStaff" },
                                 ]}
                                 value={values.memberType}
                                 onBlur={handleBlur("memberType")}
                                 setValue={handleChange("memberType")}
                                 activeColor={primaryBlue}
                              />
                              {errors.memberType && touched.memberType ? <Text style={styles.errorText}>{errors.memberType}</Text> : null}

                              <TextInput
                                 mode="outlined"
                                 label={"Enrollment Number"}
                                 onChangeText={handleChange("enrollmentNo")}
                                 onBlur={handleBlur("enrollmentNo")}
                                 value={values.enrollmentNo}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                                 style={{ marginTop: 10 }}
                              />
                              {errors.enrollmentNo && touched.enrollmentNo ? <Text style={styles.errorText}>{errors.enrollmentNo}</Text> : null}

                              <TextInput
                                 mode="outlined"
                                 label={"ID Number"}
                                 onChangeText={handleChange("idNumber")}
                                 onBlur={handleBlur("idNumber")}
                                 value={values.idNumber}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                                 style={{ marginTop: 10 }}
                              />
                              {errors.idNumber && touched.idNumber ? <Text style={styles.errorText}>{errors.idNumber}</Text> : null}

                              <DropDown
                                 mode="outlined"
                                 label="Gender"
                                 visible={showGender}
                                 showDropDown={() => setShowGender(true)}
                                 onDismiss={() => setShowGender(false)}
                                 list={[
                                    { label: "Male", value: "male" },
                                    { label: "Female", value: "female" },
                                    { label: "Other", value: "other" },
                                 ]}
                                 value={values.gender}
                                 onBlur={handleBlur("gender")}
                                 setValue={handleChange("gender")}
                                 activeColor={primaryBlue}
                              />
                              {errors.gender && touched.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}

                              <TextInput
                                 mode="outlined"
                                 label={"Password"}
                                 onChangeText={handleChange("password")}
                                 onBlur={handleBlur("password")}
                                 value={values.password}
                                 selectionColor={lightGray}
                                 cursorColor={primaryBlue}
                                 outlineColor={lightGray}
                                 activeOutlineColor={primaryBlue}
                                 outlineStyle={{ borderRadius: 4 }}
                                 secureTextEntry={!showPassword}
                                 style={{ marginVertical: 10 }}
                              />
                              {errors.password && touched.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                              <Button mode="contained" style={{ width: "100%", borderRadius: 9, marginTop: 10 }} buttonColor={primaryBlue} labelStyle={{ fontSize: 16 }} onPress={handleSubmit}>
                                 Sign Up
                              </Button>
                           </View>
                        );
                     }}
                  </Formik>
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   mainContainer: {
      flex: 1,
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: white,
   },
   container: {
      flex: 1,
      width: "100%",
      backgroundColor: white,
   },
   contentContainer: {
      width: "85%",
      alignItems: "center",
      justifyContent: "center",
   },
   imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
   },
   image: {
      height: 150,
   },
   title: {
      fontFamily: "Roboto Bold",
      fontSize: 24,
      color: textDarkGray,
      textAlign: "center",
      margin: 5,
   },
   text: {
      fontFamily: "Roboto Regular",
      fontSize: 16,
      color: textLightGray,
      width: "70%",
      textAlign: "center",
   },
   signUpForm: {
      marginTop: 15,
      width: "100%",
   },
   errorText: {
      color: darkRed,
      fontFamily: "fontRegular",
      fontSize: 16,
      marginTop: 3,
   },
});

export default SignUp;

