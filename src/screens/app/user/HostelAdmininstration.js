import { View, ScrollView, StyleSheet } from "react-native";
import { white } from "../../../constants/Colors";
import { useCallback, useState } from "react";
import HostelAdministrationCard from "../../../components/HostelAdministrationCard";

const HostelAdministration = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   }, []);

   // ✅ Hardcoded contact details
   const hostelContacts = [
      { name: "Dr. Vijaykumar R. P.", position: "Associate Dean", phone_no: "9970335593", email: "hostelmanager@vnit.ac.in" },
      { name: "Mrs. Deepali S. Deshpande", position: "I/c. AR", phone_no: "9373228300", email: "anand@email.com" },
      { name: "Dr. Deepti D. Shrimankar", position: "Warden", phone_no: "9860606477", email: "dshrimankar@cse.vnit.ac.in" },
      { name: "Dr. Poonam Sharma", position: "Warden", phone_no: "9826090830", email: "Poonamsharma@cse.vnit.ac.in" },
      { name: "Dr. Asha Jaiswal", position: "Warden", phone_no: "9890276937", email: "asha.jaiswal@vnit.ac.in" },
      { name: "Dr. Amol Rajurkar", position: "Warden", phone_no: "8856179567", email: "rajurkar@mech.vnit.ac.in" },
      { name: "Dr. Sunita Kate", position: "Warden", phone_no: "9618172666", email: "sunitakate@eee.vnit.ac.in" },
      { name: "Dr. Susanta Kumar Nayak", position: "Warden", phone_no: "8806021888", email: "nayak@vnit.ac.in" },
      { name: "Dr. Gaurav Mishra", position: "Warden", phone_no: "9406770430", email: "gmishra@vnit.ac.in" },
      { name: "Dr. G. N. Nimbankar", position: "Warden", phone_no: "9370334542", email: "nimbankar@vnit.ac.in" },
      { name: "Dr. Sandeep Panchal", position: "Warden", phone_no: "9547010129", email: "sandeep.panchal@mech.vnit.ac.in" }
   ];

   return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               {hostelContacts.map((contact, index) => (
                  <HostelAdministrationCard
                     key={index}
                     name={contact.name}
                     position={contact.position}
                     phone_no={contact.phone_no}
                     email={contact.email}
                     profilePicture={require("../../../../assets/images/profile_pic.png")} // 🖼️ Default Profile Pic
                  />
               ))}
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   scrollContainer: {
      flexGrow: 1,
      backgroundColor: white,
      paddingVertical: 15,
   },
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: white,
   },
   contentContainer: {
      width: "90%",
      alignItems: "center",
   },
});

export default HostelAdministration;
