// src/screens/app/staff/StaffDashboard.js
import React, { useState, useEffect, useContext, useCallback } from "react";
import { View, Text, StyleSheet, StatusBar, RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { TouchableRipple, Button, Avatar, Card, Divider } from "react-native-paper";
import CircularProgress from "react-native-circular-progress-indicator";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { AuthContext } from "../../../context/AuthContext";
import { baseUrl } from "../../../config/BaseUrl";
import {
  black, darkGreen, darkYellow, primaryBlue,
  redIndicator, textDarkGray, white,
} from "../../../constants/Colors";

const StaffDashboard = ({ navigation }) => {
  const { userInfo, logout } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints().finally(() => setRefreshing(false));
  }, []);

  const fetchComplaints = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
      const response = await axios.get(`${baseUrl}complaints/department`, {
        headers: { Authorization: formattedToken }
      });
      setComplaints(response.data);
    } catch (err) {
      console.error("❌ Fetch complaints failed:", err.message);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const todayDate = new Date().toDateString();
  const todayComplaints = complaints.filter(
    (c) => new Date(c.createdAt).toDateString() === todayDate
  ).slice(0, 2);

  const totalComplaints = complaints.length;
  const resolved = complaints.filter(c => c.status === "resolved").length;
  const pending = complaints.filter(c => c.status === "pending").length;

  const handleLogout = () => logout();

  return (
    <View style={styles.mainContainer}>
      <StatusBar backgroundColor={primaryBlue} barStyle="light-content" />
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
              <Text style={styles.welcomeText}>{`Welcome, ${userInfo?.full_name || "Staff"}`}</Text>
              <Text style={styles.subText}>{`${userInfo?.department?.toUpperCase() || "N/A"} Department`}</Text>
            </View>
          </View>
          <TouchableRipple onPress={handleLogout} style={styles.logoutButton} borderless>
            <Ionicons name="log-out-outline" size={26} color={white} />
          </TouchableRipple>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[primaryBlue]} />}
      >
        <Card style={styles.dashboardSummary}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Today's Overview</Text>
            {todayComplaints.length > 0 ? (
              todayComplaints.map((c, i) => (
                <View key={i} style={{ marginVertical: 4 }}>
                  <Text style={{ fontWeight: "600", fontSize: 14 }}>{c.title}</Text>
                  <Text style={{ fontSize: 12, color: "#555" }}>{c.description.slice(0, 50)}...</Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 12, color: "#999" }}>No complaints today.</Text>
            )}
            <Button onPress={() => navigation.navigate("StaffComplaints")} textColor={primaryBlue}>
              View More
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.capacityCard}>
          <Card.Content>
            <Text style={styles.title}>Complaint Statistics</Text>
            <Divider style={styles.divider} />
            <View style={styles.indicatorContainer}>
              <CircularProgress
                value={totalComplaints}
                radius={45}
                progressValueColor={primaryBlue}
                title="Total"
                titleColor={black}
                inActiveStrokeColor={primaryBlue}
                inActiveStrokeOpacity={0.2}
                activeStrokeColor={primaryBlue}
              />
              <CircularProgress
                value={resolved}
                radius={45}
                progressValueColor={darkGreen}
                title="Resolved"
                titleColor={black}
                inActiveStrokeColor={darkGreen}
                inActiveStrokeOpacity={0.2}
                activeStrokeColor={darkGreen}
              />
              <CircularProgress
                value={pending}
                radius={45}
                progressValueColor={redIndicator}
                title="Pending"
                titleColor={black}
                inActiveStrokeColor={redIndicator}
                inActiveStrokeOpacity={0.2}
                activeStrokeColor={redIndicator}
              />
            </View>
          </Card.Content>
        </Card>

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          <TouchableRipple onPress={() => navigation.navigate("StaffComplaints")} style={styles.actionCard}>
            <View style={styles.cardInner}>
              <MaterialCommunityIcons name="file-document-outline" size={28} color={primaryBlue} />
              <Text style={styles.cardText}>View Complaints</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => navigation.navigate("ResolvedComplaints")} style={styles.actionCard}>
            <View style={styles.cardInner}>
              <MaterialCommunityIcons name="check-circle-outline" size={28} color={darkGreen} />
              <Text style={styles.cardText}>Resolved</Text>
            </View>
          </TouchableRipple>
        </View>

        <View style={styles.quickActionsContainer}>
          <TouchableRipple onPress={() => navigation.navigate("PendingComplaints")} style={styles.actionCard}>
            <View style={styles.cardInner}>
              <MaterialCommunityIcons name="clock-outline" size={28} color={redIndicator} />
              <Text style={styles.cardText}>Pending</Text>
            </View>
          </TouchableRipple>

          <TouchableRipple onPress={() => navigation.navigate("Profile")} style={styles.actionCard}>
            <View style={styles.cardInner}>
              <MaterialCommunityIcons name="account-outline" size={28} color={darkYellow} />
              <Text style={styles.cardText}>Profile</Text>
            </View>
          </TouchableRipple>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#F5F7FA" },
  header: { backgroundColor: primaryBlue, paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  userInfo: { flexDirection: "row", alignItems: "center" },
  userTextContainer: { marginLeft: 15 },
  welcomeText: { fontSize: 18, color: white, fontWeight: "600" },
  subText: { fontSize: 14, color: "#ffffffaa" },
  logoutButton: { padding: 8, borderRadius: 20 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  dashboardSummary: { marginTop: 10, marginBottom: 15, borderRadius: 10, backgroundColor: white, elevation: 2 },
  summaryTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  capacityCard: { width: "100%", borderRadius: 10, marginBottom: 20, backgroundColor: white, elevation: 2 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 10 },
  indicatorContainer: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginTop: 10, marginBottom: 10 },
  quickActionsContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  actionCard: { width: "48%", backgroundColor: white, borderRadius: 10, elevation: 2, alignItems: "center", padding: 15 },
  cardInner: { alignItems: "center" },
  cardText: { marginTop: 10, fontWeight: "600", color: "#333" },
});

export default StaffDashboard;
