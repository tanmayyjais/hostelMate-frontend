import { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import UserNav from "./UserNav";
import AuthStack from "./AuthStack";
import StaffDashboard from "../screens/app/staff/Dashboard";
import { AuthContext } from "../context/AuthContext";
import { white, primaryBlue } from "../constants/Colors";
import StaffNav from "./StaffNav"; // ✅ Import this

const AppNav = () => {
   const { userToken, userInfo, isLoading } = useContext(AuthContext);

   if (isLoading) {
      return (
         <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: white }}>
            <ActivityIndicator size="large" color={primaryBlue} />
            <Text style={{ marginTop: 10 }}>Checking login status...</Text>
         </View>
      );
   }

   console.log("🚦 Navigation Decision:");
   console.log("User token:", userToken);
   console.log("User info:", userInfo);

   return (
      <NavigationContainer>
         {userToken !== null ? (
            userInfo?.member_type === "student" ? (
               <UserNav />
            ) : userInfo?.member_type === "academicStaff" ? (
               <AppStack />
            ) : userInfo?.member_type?.endsWith("Staff") ? (
               <StaffNav />  // ✅ Use StaffNav instead of <StaffDashboard />
            ) : (
               <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: white }}>
                  <Text>Unknown user role. Please contact support.</Text>
               </View>
            )
         ) : (
            <AuthStack />
         )}
      </NavigationContainer>
   );   
};

export default AppNav;