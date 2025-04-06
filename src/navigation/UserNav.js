import { useContext } from "react";
import AppStack from "./AppStack";
import UserStack from "./UserStack";
import { AuthContext } from "../context/AuthContext";

const UserNav = () => {
   const { userInfo } = useContext(AuthContext);

   if (!userInfo) return null;
   
   return userInfo.member_type === "admin" ? <AppStack /> : <UserStack />;
};

export default UserNav;
