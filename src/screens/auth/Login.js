import { useState, useContext } from "react";
import { View, Text, Image, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, Checkbox, IconButton } from "react-native-paper";
import { useFonts } from "expo-font";

import logo from "../../../assets/images/VNIT.png";
import {
   primaryBlue,
   textLightGray,
   lightGray,
   textDarkGray,
   white,
   darkRed,
} from "../../constants/Colors";
import { Formik } from "formik";
import * as Yup from "yup";

import {
   fontBold,
   fontLight,
   fontMedium,
   fontRegular,
   fontThin,
} from "../../constants/Fonts";

import { AuthContext } from "../../context/AuthContext";

const Login = ({ navigation }) => {
   const [rememberMe, setRememberMe] = useState(false);
   const [showPassword, setShowPassword] = useState(false);

   const { login, err, isLoading } = useContext(AuthContext);

   const [fontsLoaded] = useFonts({
      fontBold,
      fontLight,
      fontMedium,
      fontRegular,
      fontThin,
   });

   if (!fontsLoaded) return null;

   const handleLogin = (values) => {
      login(values.email, values.password).then((userInfo) => {
         if (userInfo) {
            if (userInfo.member_type === "student") {
               navigation.navigate("UserDashboard");
            } else if (userInfo.member_type === "academicStaff") {
               navigation.navigate("AdminDashboard");
            }
         } else {
            Alert.alert("Failure", "Login failed!");
         }
      });
   };

   const loginSchema = Yup.object({
      email: Yup.string()
         .email("Enter a valid email!")
         .required("Email is required!"),
      password: Yup.string().required("Password is required!"),
   });

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.contentContainer}>
            <View style={styles.imageContainer}>
               <Image source={logo} resizeMode="contain" style={styles.image} />
            </View>
            <Text style={[styles.title, { fontFamily: "fontBold" }]}>Login</Text>
            <Text style={[styles.text, { fontFamily: "fontRegular" }]}>
               Welcome to Hostel Mate - Hostel Management Application
            </Text>
            <View style={styles.loginForm}>
               <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={loginSchema}
                  onSubmit={(values) => handleLogin(values)}
               >
                  {({
                     handleChange,
                     handleBlur,
                     handleSubmit,
                     values,
                     errors,
                     touched,
                  }) => (
                     <View>
                        <TextInput
                           mode="outlined"
                           label={"Email"}
                           keyboardType="email-address"
                           keyboardAppearance="dark"
                           onChangeText={handleChange("email")}
                           onBlur={handleBlur("email")}
                           value={values.email}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />
                        {errors.email && touched.email && (
                           <Text style={[styles.errorText, { fontFamily: "fontRegular" }]}>
                              {errors.email}
                           </Text>
                        )}
                        <TextInput
                           mode="outlined"
                           label={"Password"}
                           keyboardType="default"
                           onChangeText={handleChange("password")}
                           onBlur={handleBlur("password")}
                           value={values.password}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                           secureTextEntry={!showPassword}
                           right={
                              <TextInput.Icon
                                 icon={showPassword ? "eye-off" : "eye"}
                                 iconColor={textLightGray}
                                 size={20}
                                 onPress={() => {
                                    setShowPassword(!showPassword);
                                 }}
                              />
                           }
                           style={{ marginTop: 10 }}
                        />
                        {errors.password && touched.password && (
                           <Text style={[styles.errorText, { fontFamily: "fontRegular" }]}>
                              {errors.password}
                           </Text>
                        )}

                        <View style={styles.rememberForgotContainer}>
                           <View style={{ flexDirection: "row", alignItems: "center" }}>
                              <Checkbox
                                 status={rememberMe ? "checked" : "unchecked"}
                                 color={primaryBlue}
                                 uncheckedColor={lightGray}
                                 onPress={() => setRememberMe(!rememberMe)}
                              />
                              <Text style={{ fontFamily: "fontRegular", fontSize: 16 }}>
                                 Remember me
                              </Text>
                           </View>
                           <Button
                              mode="text"
                              textColor={primaryBlue}
                              labelStyle={{
                                 textDecorationLine: "underline",
                                 fontFamily: "fontRegular",
                                 fontSize: 16,
                              }}
                              onPress={() => navigation.navigate("ForgotPassword")}
                           >
                              Forgot password
                           </Button>
                        </View>

                        <Button
                           mode="contained"
                           style={{ width: "100%", borderRadius: 9 }}
                           buttonColor={primaryBlue}
                           labelStyle={{
                              fontFamily: "fontRegular",
                              fontSize: 16,
                           }}
                           onPress={handleSubmit}
                           disabled={errors.email || errors.password ? true : false}
                        >
                           Login
                        </Button>

                        <View style={styles.signupContainer}>
                           <Text
                              style={{
                                 fontFamily: "fontRegular",
                                 fontSize: 16,
                                 color: textLightGray,
                              }}
                           >
                              Don't have an account?{" "}
                           </Text>
                           <Button
                              mode="text"
                              textColor={primaryBlue}
                              labelStyle={{
                                 textDecorationLine: "underline",
                                 fontFamily: "fontRegular",
                                 fontSize: 16,
                              }}
                              onPress={() => navigation.navigate("SignUp")}
                           >
                              Sign up
                           </Button>
                        </View>
                     </View>
                  )}
               </Formik>
            </View>
         </View>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
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
      fontSize: 24,
      color: textDarkGray,
      textAlign: "center",
      margin: 15,
   },
   text: {
      fontSize: 16,
      color: textLightGray,
      width: "70%",
      textAlign: "center",
   },
   loginForm: {
      marginTop: 15,
      width: "100%",
   },
   errorText: {
      color: darkRed,
      fontSize: 16,
      marginTop: 3,
   },
   rememberForgotContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
   },
   signupContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
   },
});

export default Login;
