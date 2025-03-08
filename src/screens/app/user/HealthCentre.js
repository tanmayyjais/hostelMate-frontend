import React, { useState } from "react";
import { View, Image, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Appbar } from "react-native-paper";
import { white } from "../../../constants/Colors";

const HealthCentre = ({ navigation }) => {
   const [modalVisible, setModalVisible] = useState(false);

   return (
      <View style={styles.container}>
         {/* ✅ Sleek White AppBar */}
         <Appbar.Header style={styles.appBar}>
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            <Appbar.Content title="Health Centre Info" titleStyle={styles.appBarTitle} />
         </Appbar.Header>

         {/* ✅ Scrollable Image View */}
         <ScrollView contentContainerStyle={styles.imageContainer}>
            <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
               <Image
                  source={require("../../../../assets/images/vnit_health.jpg")}
                  style={styles.image}
                  resizeMode="contain"
               />
            </TouchableWithoutFeedback>
         </ScrollView>

         {/* ✅ Full-Screen Image Modal */}
         <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View style={styles.modalBackground}>
               <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                  <Image
                     source={require("../../../../assets/images/vnit_health.jpg")}
                     style={styles.fullImage}
                     resizeMode="contain"
                  />
               </TouchableWithoutFeedback>
            </View>
         </Modal>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: white,
      marginTop: -30,
   },
   appBar: {
      backgroundColor: white,
      elevation: 4, // Soft shadow for sleek look
   },
   appBarTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: -5,
   },
   imageContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
   },
   image: {
      width: "100%",
      height: 600, // Large enough but scrollable
   },
   modalBackground: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.9)", // Dark background for modal
      justifyContent: "center",
      alignItems: "center",
   },
   fullImage: {
      width: "100%",
      height: "100%",
   },
});

export default HealthCentre;
