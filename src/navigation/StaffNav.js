import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StaffDashboard from "../screens/app/staff/Dashboard";
import StaffComplaints from "../screens/app/staff/StaffComplaints";
import ResolvedComplaints from "../screens/app/staff/ResolvedComplaints";
import PendingComplaints from "../screens/app/staff/PendingComplaints";
import StaffProfile from "../screens/app/staff/StaffProfile";

const Stack = createNativeStackNavigator();

const StaffNav = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
         <Stack.Screen name="StaffComplaints" component={StaffComplaints} />
         <Stack.Screen name="ResolvedComplaints" component={ResolvedComplaints} />
         <Stack.Screen name="PendingComplaints" component={PendingComplaints} />
         <Stack.Screen name="Profile" component={StaffProfile} />
      </Stack.Navigator>
   );
};

export default StaffNav;
