import React, { useEffect, useState, useCallback } from "react";
import {
   View,
   Text,
   RefreshControl,
   FlatList,
   StyleSheet,
   Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import {
   darkGreen,
   darkRed,
   textDarkGray,
   white,
   primaryBlue,
} from "../../../constants/Colors";
import { List, TouchableRipple, Avatar, ActivityIndicator } from "react-native-paper";
import { baseUrl } from "../../../config/BaseUrl";

const Complains = ({ navigation }) => {
   const [complains, setComplains] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

   const fetchComplaints = async () => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem("userToken");
         
         if (!token) throw new Error("No token found!");

         const response = await axios.get(`${baseUrl}complaints`, {
            headers: { Authorization: `Bearer ${token}` },
         });

         setComplains(response.data);
      } catch (error) {
         Alert.alert("Error", "Failed to load complaints.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchComplaints();
   }, []);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchComplaints().finally(() => setRefreshing(false));
   }, []);

   const updateComplaintStatus = async (complaintId, newStatus) => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         if (!token) throw new Error("No token found!");

         await axios.patch(
            `${baseUrl}complaints/${complaintId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
         );

         Alert.alert("Success", `Complaint status updated to ${newStatus}!`);
         fetchComplaints();
      } catch (error) {
         Alert.alert("Error", "Failed to update complaint status.");
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         {loading ? (
            <ActivityIndicator animating={true} size="large" color={primaryBlue} />
         ) : (
            <FlatList
               data={complains}
               keyExtractor={(item) => item._id}
               refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
               renderItem={({ item }) => (
                  <List.Item
                     title={item.title}
                     description={item.description}
                     left={() => (
                        <Avatar.Image
                           size={50}
                           source={require("../../../../assets/images/profile_pic.png")}
                        />
                     )}
                     right={(props) => (
                        <View style={styles.statusActions}>
                           <TouchableRipple
                              onPress={() => updateComplaintStatus(item._id, "rejected")}
                           >
                              <List.Icon {...props} icon="close" color={darkRed} />
                           </TouchableRipple>
                           <TouchableRipple
                              onPress={() => updateComplaintStatus(item._id, "approved")}
                           >
                              <List.Icon {...props} icon="check" color={darkGreen} />
                           </TouchableRipple>
                        </View>
                     )}
                     style={styles.listItem}
                     onPress={() => navigation.navigate("AdminViewComplain", { complain: item })}
                  />
               )}
               ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                     <Text style={styles.emptyText}>No complaints found.</Text>
                  </View>
               }
            />
         )}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: white,
   },
   listItem: {
      paddingLeft: 15,
      elevation: 5,
      backgroundColor: white,
      width: "90%",
      alignSelf: "center",
      marginVertical: 8,
      borderRadius: 8,
   },
   statusActions: {
      flexDirection: "row",
      alignItems: "center",
   },
   emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
   emptyText: {
      fontSize: 18,
      color: textDarkGray,
   },
});

export default Complains;
