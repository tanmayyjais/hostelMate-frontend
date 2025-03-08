import { useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   Image,
   Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "../../../../config/BaseUrl";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; 

const AddNewComplain = ({ navigation }) => {
   const [selectedImage, setSelectedImage] = useState(null);

   const addNewComplainSchema = Yup.object({
      title: Yup.string().required("Title is required!"),
      description: Yup.string().required("Description is required!"),
   });

   // Function to pick an image
   const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ['images'],
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.canceled) {
         setSelectedImage(result.assets[0].uri);
      }
   };

   // Function to remove selected image
   const removeImage = () => {
      setSelectedImage(null);
   };

   const handleAddNewComplain = async (values) => {
      try {
         const token = await AsyncStorage.getItem("userToken");

         if (!token) {
            Alert.alert("Authentication Error", "No token found, please login again!");
            return;
         }

         const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

         const formData = new FormData();
         formData.append("title", values.title);
         formData.append("description", values.description);

         if (selectedImage) {
            const imageName = selectedImage.split("/").pop();
            const imageExt = imageName.split(".").pop();

            formData.append("image", {
               uri: selectedImage,
               name: imageName,
               type: `image/${imageExt}`,
            });
         }

         const response = await axios.post(`${baseUrl}complaints`, formData, {
            headers: {
               Authorization: formattedToken,
               "Content-Type": "multipart/form-data",
            },
         });

         if (response.status === 201) {
            Alert.alert("Success", "Complaint submitted successfully!");
            navigation.goBack();
         }
      } catch (error) {
         console.error("API Error:", error.response?.data || error.message);
         Alert.alert("Error", "Failed to submit complaint. Please try again.");
      }
   };

   return (
      <ScrollView style={styles.container}>
         {/* Header with Back Button and Title */}
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Complaint</Text>
         </View>

         <View style={styles.contentContainer}>
            <Formik
               onSubmit={(values) => handleAddNewComplain(values)}
               initialValues={{ title: "", description: "" }}
               validationSchema={addNewComplainSchema}
            >
               {({ handleBlur, handleChange, handleSubmit, values, errors, touched }) => (
                  <View style={styles.form}>
                     {/* Title Input */}
                     <TextInput
                        mode="outlined"
                        label="Title"
                        placeholder="Enter Complaint Title"
                        onChangeText={handleChange("title")}
                        onBlur={handleBlur("title")}
                        style={styles.input}
                     />
                     {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}

                     {/* Description Input */}
                     <TextInput
                        mode="outlined"
                        label="Description"
                        placeholder="Describe the issue"
                        multiline
                        numberOfLines={4}
                        onChangeText={handleChange("description")}
                        onBlur={handleBlur("description")}
                        style={[styles.input, styles.textArea]}
                     />
                     {errors.description && touched.description && <Text style={styles.errorText}>{errors.description}</Text>}

                     {/* Image Picker */}
                     <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                        <Ionicons name="image-outline" size={24} color="#007bff" />
                        <Text style={styles.imagePickerText}>Select an Image</Text>
                     </TouchableOpacity>

                     {/* Show Image Preview If Selected */}
                     {selectedImage && (
                        <View style={styles.imagePreviewContainer}>
                           <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                           <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                              <MaterialIcons name="cancel" size={24} color="red" />
                           </TouchableOpacity>
                        </View>
                     )}

                     {/* Submit Button */}
                     <Button mode="contained" onPress={handleSubmit} style={styles.submitButton}>
                        Submit Complaint
                     </Button>
                  </View>
               )}
            </Formik>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#f8f9fa",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 15,
   },
   backButton: {
      position: "absolute",
      left: 10,
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
   },
   contentContainer: {
      width: "100%",
      alignItems: "center",
   },
   form: {
      width: "100%",
      marginTop: 10,
   },
   input: {
      marginBottom: 10,
   },
   textArea: {
      height: 100,
   },
   errorText: {
      color: "red",
      fontSize: 12,
      marginBottom: 10,
   },
   imagePicker: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#e9ecef",
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
   },
   imagePickerText: {
      marginLeft: 8,
      fontSize: 16,
      color: "#007bff",
   },
   imagePreviewContainer: {
      marginTop: 15,
      width: "100%",
      alignItems: "center",
      position: "relative",
   },
   previewImage: {
      width: "100%",
      height: 200,
      borderRadius: 8,
   },
   removeImageButton: {
      position: "absolute",
      top: 5,
      right: 5,
      backgroundColor: "white",
      borderRadius: 12,
   },
   submitButton: {
      marginTop: 20,
      borderRadius: 8,
      backgroundColor: "#007bff",
   },
});

export default AddNewComplain;
