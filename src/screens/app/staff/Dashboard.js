import { useState, useCallback, useContext } from "react";
import { View, Text, Image, RefreshControl, StyleSheet, StatusBar } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableRipple, Button, Avatar, Card, Divider } from "react-native-paper";
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const StaffDashboard = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLogout = () => {
    logout();
   //navigation.navigate("Welcome");
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={primaryBlue} barStyle="light-content" />
      
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={50} 
              label={userInfo?.full_name?.split(' ').map(n => n[0]).join('') || "ST"} 
              backgroundColor={primaryBlue}
              color={white}
            />
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>
                {`Welcome, ${userInfo?.full_name || "Staff"}`}
              </Text>
              <Text style={styles.subText}>
                {`${userInfo?.department?.toUpperCase() || "N/A"} Department`}
              </Text>
            </View>
          </View>
          <TouchableRipple
            onPress={handleLogout}
            style={styles.logoutButton}
            borderless
            rippleColor="rgba(255, 255, 255, 0.2)"
          >
            <Ionicons name="log-out-outline" size={26} color={white} />
          </TouchableRipple>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[primaryBlue]} />}
      >
        {/* Dashboard Summary Card */}
        <Card style={styles.dashboardSummary}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Today's Overview</Text>
            <Text style={styles.summarySubtitle}>Track your assigned complaints</Text>
          </Card.Content>
        </Card>

        {/* Complaints Overview */}
        <Card style={styles.capacityCard}>
          <Card.Content>
            <Text style={styles.title}>Complaint Statistics</Text>
            <Divider style={styles.divider} />
            <View style={styles.indicatorContainer}>
              <View style={styles.progressItem}>
                <CircularProgress
                  value={34}
                  radius={45}
                  duration={1500}
                  progressValueColor={primaryBlue}
                  maxValue={50}
                  title="Total"
                  titleColor={black}
                  titleStyle={{ fontFamily: "fontBold", fontSize: 12 }}
                  inActiveStrokeColor={primaryBlue}
                  inActiveStrokeOpacity={0.2}
                  activeStrokeColor={primaryBlue}
                  inActiveStrokeWidth={8}
                  activeStrokeWidth={8}
                  valueSuffix=""
                />
              </View>
              <View style={styles.progressItem}>
                <CircularProgress
                  value={12}
                  radius={45}
                  duration={1500}
                  progressValueColor={darkGreen}
                  maxValue={50}
                  title="Resolved"
                  titleColor={black}
                  titleStyle={{ fontFamily: "fontBold", fontSize: 12 }}
                  inActiveStrokeColor={darkGreen}
                  inActiveStrokeOpacity={0.2}
                  activeStrokeColor={darkGreen}
                  inActiveStrokeWidth={8}
                  activeStrokeWidth={8}
                  valueSuffix=""
                />
              </View>
              <View style={styles.progressItem}>
                <CircularProgress
                  value={22}
                  radius={45}
                  duration={1500}
                  progressValueColor={redIndicator}
                  maxValue={50}
                  title="Pending"
                  titleColor={black}
                  titleStyle={{ fontFamily: "fontBold", fontSize: 12 }}
                  inActiveStrokeColor={redIndicator}
                  inActiveStrokeOpacity={0.2}
                  activeStrokeColor={redIndicator}
                  inActiveStrokeWidth={8}
                  activeStrokeWidth={8}
                  valueSuffix=""
                />
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableRipple
            onPress={() => navigation.navigate("StaffComplaints", { department: userInfo?.department })}
            style={styles.actionCard}
          >
            <View style={styles.cardInner}>
              <View style={[styles.iconBackground, { backgroundColor: 'rgba(25, 118, 210, 0.1)' }]}>
                <MaterialCommunityIcons name="file-document-outline" size={28} color={primaryBlue} />
              </View>
              <Text style={styles.cardText}>View Complaints</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => navigation.navigate("ResolvedComplaints")}
            style={styles.actionCard}
          >
            <View style={styles.cardInner}>
              <View style={[styles.iconBackground, { backgroundColor: 'rgba(46, 125, 50, 0.1)' }]}>
                <MaterialCommunityIcons name="check-circle-outline" size={28} color={darkGreen} />
              </View>
              <Text style={styles.cardText}>Resolved</Text>
            </View>
          </TouchableRipple>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableRipple
            onPress={() => navigation.navigate("PendingComplaints")}
            style={styles.actionCard}
          >
            <View style={styles.cardInner}>
              <View style={[styles.iconBackground, { backgroundColor: 'rgba(211, 47, 47, 0.1)' }]}>
                <MaterialCommunityIcons name="clock-outline" size={28} color={redIndicator} />
              </View>
              <Text style={styles.cardText}>Pending</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple
            onPress={() => navigation.navigate("Profile")}
            style={styles.actionCard}
          >
            <View style={styles.cardInner}>
              <View style={[styles.iconBackground, { backgroundColor: 'rgba(156, 39, 176, 0.1)' }]}>
                <MaterialCommunityIcons name="account-outline" size={28} color="#9C27B0" />
              </View>
              <Text style={styles.cardText}>Profile</Text>
            </View>
          </TouchableRipple>
        </View>

        {/* Recent Activity */}
        <Card style={styles.recentActivityCard}>
          <Card.Content>
            <Text style={styles.title}>Recent Activity</Text>
            <Divider style={styles.divider} />
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: darkGreen }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Complaint #1234 Resolved</Text>
                <Text style={styles.activityTime}>Today, 10:30 AM</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityDot, { backgroundColor: primaryBlue }]} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>New complaint assigned</Text>
                <Text style={styles.activityTime}>Yesterday, 4:15 PM</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="text" 
              onPress={() => navigation.navigate("ActivityHistory")}
              textColor={primaryBlue}
            >
              View All
            </Button>
          </Card.Actions>
        </Card>

        <View style={styles.footer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    backgroundColor: primaryBlue,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userTextContainer: {
    marginLeft: 15,
  },
  welcomeText: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: white,
  },
  subText: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  dashboardSummary: {
    marginTop: -20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: white,
  },
  summaryTitle: {
    fontFamily: "fontBold",
    fontSize: 20,
    color: textDarkGray,
  },
  summarySubtitle: {
    fontFamily: "fontRegular",
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.6)",
    marginTop: 4,
  },
  capacityCard: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  title: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: textDarkGray,
  },
  divider: {
    marginVertical: 10,
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  progressItem: {
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: "fontBold",
    fontSize: 18,
    color: textDarkGray,
    marginBottom: 10,
    marginTop: 5,
  },
  quickActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  actionCard: {
    width: "48%",
    backgroundColor: white,
    borderRadius: 10,
    elevation: 2,
  },
  cardInner: {
    alignItems: "center",
    padding: 15,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardText: {
    fontFamily: "fontBold",
    fontSize: 14,
    color: textDarkGray,
  },
  recentActivityCard: {
    width: "100%",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: "fontMedium",
    fontSize: 14,
    color: textDarkGray,
  },
  activityTime: {
    fontFamily: "fontRegular",
    fontSize: 12,
    color: "rgba(0, 0, 0, 0.5)",
    marginTop: 2,
  },
  footer: {
    height: 20,
  },
});

export default StaffDashboard;