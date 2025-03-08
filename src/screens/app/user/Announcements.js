import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, RefreshControl, StyleSheet } from "react-native";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { List, Avatar, ActivityIndicator } from "react-native-paper";
import { baseUrl } from "../../../config/BaseUrl";
import { textDarkGray, white, primaryBlue } from "../../../constants/Colors";

const Announcements = ({ navigation }) => {
   const [announcements, setAnnouncements] = useState([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

   const fetchAnnouncements = async () => {
      try {
         setLoading(true);
         const response = await axios.get(`${baseUrl}announcements`);
         setAnnouncements(response.data);
      } catch (error) {
         console.error("Error fetching announcements:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAnnouncements();
   }, []);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      fetchAnnouncements().finally(() => setRefreshing(false));
   }, []);

   return (
      <SafeAreaView style={styles.container}>
         {loading ? (
            <ActivityIndicator size="large" color={primaryBlue} />
         ) : (
            <FlatList
               data={announcements}
               keyExtractor={(item) => item._id}
               refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
               renderItem={({ item }) => (
                  <List.Item
                     title={item.title}
                     description={item.description}
                     left={() => <Avatar.Image size={40} source={require("../../../../assets/images/announcement.png")} />}
                     right={() => <List.Icon color={textDarkGray} icon="chevron-right" />}
                     style={styles.listItem}
                     onPress={() => navigation.navigate("UserViewAnnouncement", { announcement: item })}
                  />
               )}
            />
         )}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: white },
   listItem: { paddingLeft: 15, elevation: 3, backgroundColor: white, marginVertical: 8, borderRadius: 8 },
});

export default Announcements;
