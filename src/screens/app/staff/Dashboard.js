import { useState, useCallback, useContext } from "react";
import { View, Text, Image, RefreshControl, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableRipple } from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { AuthContext } from "../../../context/AuthContext";
import {
   black,
   darkGreen,
   darkYellow,
   primaryBlue,
   redIndicator,
   textDarkGray,
   white,
} from "../../../constants/Colors";

const StaffDashboard = ({ navigation }) => {
   const { userInfo } = useContext(AuthContext);
   const [refreshing, setRefreshing] = useState(false);

   const onRefresh = useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
         setRefreshing(false);
      }, 1500);
   }, []);

   return (
      <ScrollView
         style={{ flex: 1 }}
         contentContainerStyle={{ backgroundColor: white, minHeight: "100%" }}
         showsVerticalScrollIndicator={false}
         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
         <View style={styles.container}>
            <View style={styles.contentContainer}>
               <Text style={styles.welcomeText}>
                  {`Welcome, ${userInfo?.full_name || "Staff"} 👋`}
               </Text>
               <Text style={styles.subText}>
                  {`Department: ${userInfo?.department?.toUpperCase() || "N/A"}`}
               </Text>

               {/* Complaints Overview */}
               <View style={[styles.capacityCard, { marginTop: 20 }]}>
                  <Text style={styles.title}>Assigned Complaints</Text>
                  <View style={styles.indicatorContainer}>
                     <CircularProgress
                        value={34}
                        radius={50}
                        duration={1500}
                        progressValueColor={primaryBlue}
                        maxValue={50}
                        title="Total"
                        titleColor={black}
                        titleStyle={{ fontFamily: "fontBold" }}
                        inActiveStrokeColor={primaryBlue}
                        inActiveStrokeOpacity={0.2}
                        activeStrokeColor={primaryBlue}
                        inActiveStrokeWidth={8}
                        activeStrokeWidth={8}
                     />
                     <View style={styles.progressIndicator}>
                        <CircularProgress
                           value={12}
                           radius={50}
                           duration={1500}
                           progressValueColor={darkGreen}
                           maxValue={50}
                           title="Resolved"
                           titleColor={black}
                           titleStyle={{ fontFamily: "fontBold" }}
                           inActiveStrokeColor={darkGreen}
                           inActiveStrokeOpacity={0.2}
                           activeStrokeColor={darkGreen}
                           inActiveStrokeWidth={8}
                           activeStrokeWidth={8}
                        />
                     </View>
                     <CircularProgress
                        value={22}
                        radius={50}
                        duration={1500}
                        progressValueColor={redIndicator}
                        maxValue={50}
                        title="Pending"
                        titleColor={black}
                        titleStyle={{ fontFamily: "fontBold" }}
                        inActiveStrokeColor={redIndicator}
                        inActiveStrokeOpacity={0.2}
                        activeStrokeColor={redIndicator}
                        inActiveStrokeWidth={8}
                        activeStrokeWidth={8}
                     />
                  </View>
               </View>

               {/* Staff Navigation */}
               <View style={styles.quickButtons}>
                  <TouchableRipple
                     onPress={() =>
                        navigation.navigate("StaffComplaints", {
                           department: userInfo?.department,
                        })
                     }
                     style={styles.dashboardCard}
                  >
                     <View style={styles.cardInner}>
                        <Image
                           source={require("../../../../assets/images/complains.png")}
                           style={styles.cardImg}
                        />
                        <Text style={styles.cardText}>View Complaints</Text>
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
   welcomeText: {
      fontFamily: "fontBold",
      fontSize: 20,
      marginTop: 10,
      color: textDarkGray,
   },
   subText: {
      fontFamily: "fontRegular",
      fontSize: 16,
      color: primaryBlue,
   },
   capacityCard: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      backgroundColor: white,
      elevation: 4,
   },
   title: {
      width: "90%",
      fontFamily: "fontBold",
      fontSize: 18,
      marginVertical: 10,
   },
   indicatorContainer: {
      padding: 10,
      marginBottom: 10,
      flexDirection: "row",
   },
   progressIndicator: {
      marginHorizontal: 10,
   },
   quickButtons: {
      width: "100%",
      marginTop: 25,
      flexDirection: "row",
      justifyContent: "center",
   },
   dashboardCard: {
      width: "60%",
      backgroundColor: white,
      borderRadius: 16,
      elevation: 5,
   },
   cardInner: {
      alignItems: "center",
      paddingHorizontal: 15,
      paddingVertical: 20,
   },
   cardImg: {
      width: 60,
      height: 60,
   },
   cardText: {
      fontFamily: "fontBold",
      fontSize: 17,
      marginTop: 5,
   },
});

export default StaffDashboard;
