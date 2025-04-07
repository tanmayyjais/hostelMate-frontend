import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StaffDashboard from "../screens/app/staff/Dashboard";
import StaffComplaints from "../screens/app/staff/StaffComplaints"; // Your new screen

const Stack = createNativeStackNavigator();

const StaffNav = () => {
   return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
         <Stack.Screen name="StaffDashboard" component={StaffDashboard} />
         <Stack.Screen name="StaffComplaints" component={StaffComplaints} />
      </Stack.Navigator>
   );
};

export default StaffNav;
