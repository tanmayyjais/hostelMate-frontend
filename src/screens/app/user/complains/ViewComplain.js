import React from "react";
import {
   View,
   Text,
   StyleSheet,
   Image,
   TouchableOpacity,
   ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "react-native-paper";
import { imageBaseUrl } from "../../../../config/BaseUrl";

const ViewComplain = ({ navigation, route }) => {
   const { complain } = route.params;

   // Construct the full image URL
   const imageUrl = complain.image ? `${imageBaseUrl}${complain.image}` : null;

   return (
      <View style={styles.screenContainer}>
         {/* Header with Back Button and Title */}
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Complaint Details</Text>
         </View>

         <ScrollView contentContainerStyle={styles.container}>
            {/* Complaint Details Card */}
            <Card style={styles.card}>
               {/* Display Image if available */}
               {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.complainImage} />
               ) : (
                  <View style={styles.noImageContainer}>
                     <Ionicons name="image-outline" size={50} color="#ccc" />
                     <Text style={styles.noImageText}>No Image Available</Text>
                  </View>
               )}

               <View style={styles.complainContent}>
                  <Text style={styles.complainTitle}>{complain.title}</Text>

                  <View style={styles.divider}></View>

                  <Text style={styles.complainDescription}>{complain.description}</Text>
               </View>
            </Card>
         </ScrollView>
      </View>
   );
};

const styles = StyleSheet.create({
   screenContainer: {
      flex: 1,
      backgroundColor: "#f8f9fa",
   },
   header: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      paddingHorizontal: 20,
      backgroundColor: "#ffffff",
      elevation: 3,
   },
   backButton: {
      marginRight: 10,
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
   },
   container: {
      flexGrow: 1,
      padding: 20,
      alignItems: "center",
   },
   card: {
      width: "100%",
      backgroundColor: "#fff",
      borderRadius: 12,
      overflow: "hidden",
      elevation: 3,
   },
   complainImage: {
      width: "100%",
      height: 220,
   },
   noImageContainer: {
      width: "100%",
      height: 220,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f1f1f1",
   },
   noImageText: {
      fontSize: 14,
      color: "#777",
      marginTop: 5,
   },
   complainContent: {
      padding: 20,
   },
   complainTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
   },
   divider: {
      width: "100%",
      height: 1,
      backgroundColor: "#ddd",
      marginVertical: 10,
   },
   complainDescription: {
      fontSize: 16,
      color: "#555",
   },
});

export default ViewComplain;
