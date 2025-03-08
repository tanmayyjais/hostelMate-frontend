import { useState, useEffect, useCallback, useContext } from "react";
import { View, Text, Image, RefreshControl, StyleSheet, FlatList } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { white, textLightGray } from "../../../constants/Colors";
import { Button, Avatar, TouchableRipple } from "react-native-paper";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";

import { AuthContext } from "../../../context/AuthContext";

const Dashboard = ({ navigation }) => {
   const [refreshing, setRefreshing] = useState(false);

   const { userInfo } = useContext(AuthContext);

   const [recentAnnouncement, setRecentAnnouncement] = useState(null);
   const [currentPage, setCurrentPage] = useState(0);

useEffect(() => {
   const fetchRecentAnnouncement = async () => {
      try {
         const response = await axios.get(`${baseUrl}announcements`);
         if (response.data.length > 0) {
            setRecentAnnouncement(response.data); // Assuming the latest is first
         }
      } catch (error) {
         console.error("Error fetching announcements:", error);
      }
   };

   fetchRecentAnnouncement();
}, []);

   var date = new Date();
   var hours = date.getHours();
   var greet = "Greetings!";

   //Greeting based on the time of the day
   if (hours < 12) {
      greet = "Good Morning!";
   } else if (hours < 15) {
      greet = "Good Afternoon!";
   } else {
      greet = "Good Evening!";
   }

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   });

   return (
      <ScrollView
         style={{ flex: 1 }}
         contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
         showsVerticalScrollIndicator={false}
         refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
         }
      >
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <View style={styles.profileDetails}>
                  <Avatar.Image
                     size={75}
                     source={require("../../../../assets/images/profile_pic.png")}
                  />
                  <View style={styles.profileText}>
                     <Text
                        style={{
                           fontFamily: "fontRegular",
                           fontSize: 16,
                           color: textLightGray,
                        }}
                     >
                        {greet}
                     </Text>
                     <Text
                        style={{
                           fontFamily: "fontBold",
                           fontSize: 16,
                           marginTop: -5,
                        }}
                     >
                        {userInfo.full_name}
                     </Text>
                  </View>
               </View>
               <View style={styles.announcementContainer}>
   <View style={styles.announcementWrapper}>
      <Text style={styles.announcementIcon}>📢</Text>
      <Text style={{ fontFamily: "fontBold", fontSize: 18 }}>Announcements</Text>
   </View>

   {recentAnnouncement && recentAnnouncement.length > 0 ? (
      <>
         <FlatList
            data={recentAnnouncement}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingRight: 20 }} // Ensures last slide is fully visible
            snapToAlignment="center" // Centers each slide
            //snapToInterval={320} // Set width of each announcement card
            decelerationRate="normal" // Smooth scrolling effect
            renderItem={({ item }) => (
               <View style={styles.recentAnnouncement}>
                  <Text style={styles.announcementTitle}>{item.title}</Text>
                  <Text style={styles.announcementDescription}>{item.description}</Text>
               </View>
            )}
            onMomentumScrollEnd={(event) => {
               const page = Math.round(event.nativeEvent.contentOffset.x / 320);
               setCurrentPage(page);
            }}
         />

         {/* Bullet Indicator */}
         <View style={styles.bulletContainer}>
            {recentAnnouncement.map((_, index) => (
               <View key={index} style={[styles.bullet, index === currentPage && styles.activeBullet]} />
            ))}
         </View>
      </>
   ) : (
      <View style={styles.recentAnnouncement}>
         <Text style={{ fontFamily: "fontRegular", color: textLightGray }}>
            No recent announcements available.
         </Text>
      </View>
   )}
</View>


               <View style={styles.quickButtons}>
                  <TouchableRipple
                     onPress={() => navigation.navigate("UserRoomsDashboard")}
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/room_management.png")}
                           style={[styles.cardImg, { marginVertical: 10 }]}
                        />
                        <Text style={styles.cardText}>Request Room</Text>
                     </View>
                  </TouchableRipple>

                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("UserRoomsAcceptanceDashboard")
                     }
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/accepted_requests.png")}
                           style={styles.cardImg}
                        />
                        <Text style={styles.cardText}>Room Acceptance</Text>
                     </View>
                  </TouchableRipple>
               </View>
               <View style={styles.quickButtons}>
                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("UserPaymentReceiptsDashboard")
                     }
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/payment_receipts.png")}
                           style={styles.cardImg}
                        />
                        <Text style={styles.cardText}>Payment Receipts</Text>
                     </View>
                  </TouchableRipple>

                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("UserComplainsDashboard")
                     }
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/complains.png")}
                           style={[styles.cardImg, { marginVertical: 10 }]}
                        />
                        <Text style={styles.cardText}>Complains</Text>
                     </View>
                  </TouchableRipple>
               </View>
               <View style={styles.quickButtons}>
                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("UserHostelRulesDashboard")
                     }
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/hostel_rules.png")}
                           style={styles.cardImg}
                        />
                        <Text style={styles.cardText}>Hostel Rules</Text>
                     </View>
                  </TouchableRipple>
                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("UserGatePassesDashboard")
                     }
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/gate_passes.png")}
                           style={[styles.cardImg, { marginVertical: 10 }]}
                        />
                        <Text style={styles.cardText}>Gate Pass</Text>
                     </View>
                  </TouchableRipple>
               </View>
               <View style={[styles.quickButtons, { marginBottom: 15 }]}>
                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("UserAnnouncementsDashboard")
                     }
                     style={styles.dashboardCard}
                  >
                     <View
                        style={{
                           alignItems: "center",
                           paddingHorizontal: 15,
                           paddingVertical: 20,
                        }}
                     >
                        <Image
                           source={require("../../../../assets/images/announcements.png")}
                           style={[styles.cardImg, { marginVertical: 10 }]}
                        />
                        <Text style={styles.cardText}>Announcements</Text>
                     </View>
                  </TouchableRipple>
                  <TouchableRipple
                     onPress={() => navigation.navigate("UserHealthCentre")}
                     style={styles.dashboardCard}
                  >
                     <View style={{ alignItems: "center", paddingHorizontal: 15, paddingVertical: 20 }}>
                        <Image
                           source={require("../../../../assets/images/HC.png")} // Ensure path is correct
                           style={[styles.cardImgg, { marginVertical: 10 }]} // Matches other icons
                        />
                        <Text style={styles.cardText}>Health Centre</Text>
                     </View>
                  </TouchableRipple>


               </View>
            </View>
         </View>
      </ScrollView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: white,
   },
   contentContainer: {
      flex: 1,
      width: "90%",
      alignItems: "center",
   },
   profileDetails: {
      width: "100%",
      marginTop: 15,
      flexDirection: "row",
      alignItems: "center",
   },
   title: {
      width: "90%",
      fontFamily: "Roboto Regular",
      fontSize: 16,
      marginVertical: 10,
   },
   profileText: {
      marginLeft: 20,
   },
   announcementContainer: {
      width: "100%",
      marginTop: 15,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
   },
   announcementWrapper: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
   },
   announcementIcon: {
      fontSize: 20,
      marginRight: 8,
   },
   recentAnnouncement: {
      width: 320,  // Slightly wider for better readability
      padding: 20,
      backgroundColor: "#F9F9F9",  // Light grey background for contrast
      borderRadius: 12,
      elevation: 5,
      alignItems: "center",
      justifyContent: "center",
      marginHorizontal: 12,  
      borderLeftWidth: 5,  // Adds a left border for emphasis
      borderLeftColor: "#FF5733",  // Red-orange for important notifications
   },
   announcementTitle: {
      fontFamily: "fontBold",
      fontSize: 18,
      textAlign: "center",
      color: "#333",
      marginBottom: 5,
   },
   announcementDescription: {
      fontFamily: "fontRegular",
      fontSize: 15,
      textAlign: "center",
      color: textLightGray,
   },
   bulletContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8,
   },
   bullet: {
      width: 8,
      height: 8,
      marginHorizontal: 4,
      borderRadius: 4,
      backgroundColor: textLightGray,
   },
   activeBullet: {
      backgroundColor: "#FF5733",  // Active indicator color
   },      
   quickButtons: {
      width: "100%",
      marginTop: 25,
      flexDirection: "row",
      justifyContent: "space-between",
   },
   dashboardCard: {
      width: "48%",
      backgroundColor: white,
      borderRadius: 16,
      elevation: 5,
   },
   cardImg: {
      width: 60,
   },
   cardImgg: {
      width: 60,
      height: 60, // Ensure icon is square for uniformity
   },
   cardText: {
      fontFamily: "fontBold",
      fontSize: 17,
      marginTop: 5,
   },
});

export default Dashboard;
