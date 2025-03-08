import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, IconButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
   black,
   lightGray,
   primaryBlue,
   textDarkGray,
   textLightGray,
   white,
} from "../../../../constants/Colors";
import { imageBaseUrl } from "../../../../config/BaseUrl";

const ViewAnnouncement = ({ route }) => {
   const { announcement } = route.params;
   const navigation = useNavigation();
   const announcementImage = announcement.image ? `${imageBaseUrl}${announcement.image}` : null;

   return (
      <SafeAreaView style={styles.container}>
         {/* Top Navigation with Back Button */}
         

         <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

            {/* Announcement Details */}
            <View style={styles.contentContainer}>
               <Text style={styles.announcementTitle}>{announcement.title}</Text>
               {/* Announcement Image */}
            {announcementImage ? (
               <TouchableOpacity>
                  <Image source={{ uri: announcementImage }} style={styles.announcementImage} resizeMode="cover" />
               </TouchableOpacity>
            ) : (
               <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image Available</Text>
               </View>
            )}
               <View style={styles.divider} />
               <Text style={styles.announcementDescription}>{announcement.description}</Text>
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
   header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 5,
   },
   backButton: {
      marginLeft: 10,
   },
   headerText: {
      fontFamily: "fontMedium",
      fontSize: 20,
      color: black,
      flex: 1,
      textAlign: "left",
   },
   scrollContainer: {
      paddingBottom: 20,
   },
   announcementImage: {
      width: "100%",
      height: 200,
      borderRadius: 15,
      marginTop: 15,
   },
   placeholderImage: {
      width: "100%",
      height: 200,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: lightGray,
      borderRadius: 15,
      marginTop: 15,
   },
   placeholderText: {
      fontFamily: "fontRegular",
      fontSize: 16,
      color: textDarkGray,
   },
   contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
   },
   announcementTitle: {
      fontFamily: "fontBold",
      fontSize: 22,
      color: textDarkGray,
      textAlign: "center",
   },
   divider: {
      width: "100%",
      height: 1,
      backgroundColor: textLightGray,
      marginVertical: 20,
   },
   announcementDescription: {
      fontFamily: "fontRegular",
      fontSize: 16,
      color: textDarkGray,
      textAlign: "justify",
      lineHeight: 22,
   },
});

export default ViewAnnouncement;
