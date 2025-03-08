import { View, Text, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-paper";
import { primaryBlue, textDarkGray, white, cardBackground } from "../constants/Colors";

const HostelAdministrationCard = ({ position, name, phone_no, email, profilePicture }) => {
   return (
      <View style={styles.cardContainer}>
         {/* ✅ Profile Image */}
         <Image source={profilePicture} style={styles.profileImage} />

         {/* ✅ Details Section */}
         <View style={styles.detailsContainer}>
            <Text style={styles.positionText}>{position}</Text>
            <Text style={styles.nameText}>{name}</Text>

            {/* ✅ Contact Info */}
            <View style={styles.contactDetails}>
               <View style={styles.contactDetail}>
                  <Icon source="phone" color={primaryBlue} size={20} />
                  <Text style={styles.contactText}>{phone_no}</Text>
               </View>
               <View style={styles.contactDetail}>
                  <Icon source="email" color={primaryBlue} size={20} />
                  <Text style={styles.contactText}>{email}</Text>
               </View>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   cardContainer: {
      width: "90%",
      backgroundColor: white,
      borderRadius: 12,
      elevation: 5, // ✅ Subtle shadow effect
      padding: 15,
      alignItems: "center",
      marginBottom: 15,
      borderWidth: 1,
      borderColor: "#ddd",
   },
   profileImage: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
   },
   detailsContainer: {
      alignItems: "center",
   },
   positionText: {
      fontFamily: "fontBold",
      fontSize: 18,
      textAlign: "center",
      color: primaryBlue,
      marginBottom: 4,
   },
   nameText: {
      fontFamily: "fontRegular",
      fontSize: 16,
      textAlign: "center",
      color: textDarkGray,
      marginBottom: 8,
   },
   contactDetails: {
      width: "100%",
      paddingTop: 5,
   },
   contactDetail: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 4,
      gap: 8,
   },
   contactText: {
      fontFamily: "fontRegular",
      fontSize: 15,
      color: textDarkGray,
   },
});

export default HostelAdministrationCard;
