import React, { useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   Image,
   Alert,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   lightGray,
   primaryBlue,
   textLightGray,
   white,
   darkGreen,
   darkRed,
} from "../../../../constants/Colors";
import { Button } from "react-native-paper";
import { baseUrl,imageBaseUrl } from "../../../../config/BaseUrl";

const ViewComplain = ({ navigation, route }) => {
   const { complain } = route.params;
   const [status, setStatus] = useState(complain.status);

   const updateStatus = async (newStatus) => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         if (!token) throw new Error("No token found!");

         await axios.patch(
            `${baseUrl}complaints/${complain._id}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         setStatus(newStatus);
         Alert.alert("Success", `Complaint status updated to ${newStatus}`);
      } catch (error) {
         Alert.alert("Error", "Failed to update complaint status.");
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.contentContainer}>
            {/* Image Display */}
            {complain.image ? (
               <Image source={{ uri: `${imageBaseUrl}${complain.image}` }} style={styles.image} />
            ) : (
               <View style={styles.imagePlaceholder}>
                  <Text>No Image Available</Text>
               </View>
            )}

            {/* Complaint Details */}
            <Text style={styles.title}>{complain.title}</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{complain.description}</Text>

            {/* Status Update Buttons */}
            <View style={styles.buttonContainer}>
               <Button
                  mode="contained"
                  buttonColor={darkGreen}
                  onPress={() => updateStatus("accepted")}
               >
                  Accept
               </Button>
               <Button
                  mode="contained"
                  buttonColor={darkRed}
                  onPress={() => updateStatus("resolved")}
               >
                  Resolved
               </Button>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: white,
   },
   contentContainer: {
      padding: 20,
      alignItems: "center",
   },
   image: {
      width: "100%",
      height: 200,
      borderRadius: 10,
   },
   imagePlaceholder: {
      width: "100%",
      height: 200,
      backgroundColor: lightGray,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
   },
   title: {
      fontSize: 22,
      fontWeight: "bold",
      marginVertical: 10,
   },
   divider: {
      width: "100%",
      height: 1,
      backgroundColor: textLightGray,
      marginVertical: 10,
   },
   description: {
      fontSize: 16,
      textAlign: "center",
   },
   buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginTop: 20,
      width: "100%",
   },
});

export default ViewComplain;
