import { useContext } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import UserNav from "./UserNav";
import AuthStack from "./AuthStack";
import { AuthContext } from "../context/AuthContext";

const AppNav = () => {
   const { userToken, userInfo } = useContext(AuthContext);

   return (
      <NavigationContainer>
         {userToken !== null ? (
            userInfo?.member_type === "student" ? (
               <UserNav />
            ) : userInfo?.member_type === "academicStaff" ? (
               <AppStack />
            ) : null
         ) : (
            <AuthStack />
         )}
      </NavigationContainer>
   );
};

export default AppNav;