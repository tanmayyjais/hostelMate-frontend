import { View, Text, StyleSheet, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, TextInput, TouchableRipple } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { baseUrl } from "../../../../config/BaseUrl";
import {
   black,
   lightGray,
   primaryBlue,
   white,
} from "../../../../constants/Colors";

const AddAnnouncement = ({ navigation }) => {
   const addAnnouncementSchema = Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      image: Yup.string(),
   });

   // Function to handle announcement submission
   const handleAddAnnouncement = async (values) => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         if (!token) {
            Alert.alert("Error", "Authentication required. Please log in again.");
            return;
         }

         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

         const formData = new FormData();
         formData.append("title", values.title);
         formData.append("description", values.description);

         if (values.image) {
            const imageName = values.image.split("/").pop();
            const imageExt = imageName.split(".").pop();

            formData.append("image", {
               uri: values.image,
               name: imageName,
               type: `image/${imageExt}`,
            });
         }

         const response = await axios.post(`${baseUrl}announcements`, formData, {
            headers: {
               Authorization: formattedToken,
               "Content-Type": "multipart/form-data",
            },
         });

         if (response.status === 201) {
            Alert.alert("Success", "Announcement added successfully!");
            navigation.goBack();
         }
      } catch (error) {
         console.error("API Error:", error.response?.data || error.message);
         Alert.alert("Error", "Failed to add announcement. Please try again.");
      }
   };

   // Function to handle image upload
   const handleUploadImage = async (setFieldValue) => {
      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
         });

         if (!result.canceled) {
            setFieldValue("image", result.assets[0].uri);
         }
      } catch (error) {
         Alert.alert("Error", "Failed to select image. Please try again.");
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
               <Text style={styles.titleText}>Add Announcement</Text>
               <Formik
                  initialValues={{ title: "", description: "", image: "" }}
                  validationSchema={addAnnouncementSchema}
                  onSubmit={(values) => handleAddAnnouncement(values)}
               >
                  {({ handleBlur, handleChange, handleSubmit, setFieldValue, values, errors, touched }) => (
                     <View style={styles.form}>
                        <TextInput
                           mode="outlined"
                           label={"Title"}
                           placeholder="Announcement Title"
                           onChangeText={handleChange("title")}
                           onBlur={handleBlur("title")}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />
                        {errors.title && touched.title && (
                           <Text style={styles.errorText}>{errors.title}</Text>
                        )}

                        <TextInput
                           mode="outlined"
                           label={"Description"}
                           placeholder="Add short description about the announcement"
                           multiline
                           numberOfLines={6}
                           style={{ marginTop: 8 }}
                           onChangeText={handleChange("description")}
                           onBlur={handleBlur("description")}
                           selectionColor={lightGray}
                           cursorColor={primaryBlue}
                           outlineColor={lightGray}
                           activeOutlineColor={primaryBlue}
                           outlineStyle={{ borderRadius: 4 }}
                        />
                        {errors.description && touched.description && (
                           <Text style={styles.errorText}>{errors.description}</Text>
                        )}

                        <TouchableRipple
                           style={styles.uploadImage}
                           onPress={() => handleUploadImage(setFieldValue)}
                        >
                           <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                              <Text style={{ color: primaryBlue }}>Upload Image</Text>
                           </View>
                        </TouchableRipple>

                        {values.image ? (
                           <Text style={{ textAlign: "center", marginTop: 5 }}>
                              Selected Image: {values.image.split("/").pop()}
                           </Text>
                        ) : null}

                        <Button
                           mode="contained"
                           labelStyle={{
                              fontFamily: "fontRegular",
                              fontSize: 16,
                              paddingVertical: 5,
                           }}
                           buttonColor={primaryBlue}
                           onPress={handleSubmit}
                           style={{ marginTop: 12, borderRadius: 8 }}
                        >
                           Add Announcement
                        </Button>
                     </View>
                  )}
               </Formik>
            </View>
         </View>
      </ScrollView>
   );
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
      alignItems: "center",
      justifyContent: "center",
   },
   errorText: {
      color: "red",
      fontSize: 14,
      marginTop: 4,
   },
});

export default AddAnnouncement;
