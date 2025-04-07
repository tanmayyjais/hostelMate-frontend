import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../../../context/AuthContext";

const StaffProfile = () => {
   const { userInfo } = useContext(AuthContext);

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Profile</Text>
         <Text>Name: {userInfo?.full_name}</Text>
         <Text>Email: {userInfo?.email}</Text>
         <Text>Mobile: {userInfo?.mobile_no}</Text>
         <Text>Member Type: {userInfo?.member_type}</Text>
         <Text>Department: {userInfo?.department || "-"}</Text>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#fff",
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 20,
   },
});

export default StaffProfile;