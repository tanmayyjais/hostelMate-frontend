import { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { baseUrl } from "../config/BaseUrl";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [userToken, setUserToken] = useState(null);
   const [userInfo, setUserInfo] = useState(null);
   const [err, setErr] = useState(null);

   // ✅ Called when app launches to check saved credentials
   const isLoggedIn = async () => {
      try {
         const token = await AsyncStorage.getItem("userToken");
         const storedUserInfo = await AsyncStorage.getItem("userInfo");

         console.log("🔍 Retrieving user info from AsyncStorage:", storedUserInfo);

         let parsedUserInfo = null;
         try {
            parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
         } catch (parseErr) {
            console.error("⚠️ Error parsing stored user info:", parseErr);
         }

         if (parsedUserInfo && token) {
            console.log("✅ Auto-login successful");
            setUserInfo(parsedUserInfo);
            setUserToken(token);
         } else {
            console.warn("⚠️ Stored user data or token missing/invalid.");
            setUserInfo(null);
            setUserToken(null);
         }
      } catch (e) {
         console.error(`AsyncStorage Error: ${e.message}`);
         setErr(e);
         setUserInfo(null);
         setUserToken(null);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      isLoggedIn();
   }, []);

   // ✅ Login Function
   const login = async (email, password) => {
      setIsLoading(true);
      try {
         console.log("📤 Sending login request to:", `${baseUrl}auth/login`);
         const res = await axios.post(`${baseUrl}auth/login`, { email, password });

         if (res.data && res.data.user && res.data.token) {
            const { user, token } = res.data;

            console.log("✅ User Info received from API:", user);
            console.log("🔑 Token received from API:", token);

            setUserInfo(user);
            setUserToken(token);

            await AsyncStorage.setItem("userToken", token);
            await AsyncStorage.setItem("userInfo", JSON.stringify(user));

            const savedToken = await AsyncStorage.getItem("userToken");
            const savedUser = await AsyncStorage.getItem("userInfo");

            console.log("📦 Saved token in AsyncStorage:", savedToken);
            console.log("📦 Saved userInfo in AsyncStorage:", savedUser);

            return res.data;
         } else {
            console.warn("⚠️ Login response missing user or token.");
            return null;
         }
      } catch (error) {
         console.error("❌ Login Error:", error.message);
         console.log("🧾 Full error response:", error.response?.data);
         console.log("🧾 Status Code:", error.response?.status);

         setErr(error);
         return null;
      } finally {
         setIsLoading(false);
      }
   };

   // ✅ Update user info (e.g., department, name, etc.)
   const updateUser = async (updatedData) => {
      setUserInfo((prevUserInfo) => {
         const newUserInfo = { ...prevUserInfo, ...updatedData };
         AsyncStorage.setItem("userInfo", JSON.stringify(newUserInfo));
         return newUserInfo;
      });
   };

   // ✅ Logout function
   const logout = async () => {
      setIsLoading(true);
      try {
         setUserToken(null);
         setUserInfo(null);
         setErr(null);
         await AsyncStorage.removeItem("userToken");
         await AsyncStorage.removeItem("userInfo");
      } catch (e) {
         console.error("Logout error:", e);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AuthContext.Provider
         value={{
            login,
            logout,
            err,
            isLoading,
            userToken,
            userInfo,
            updateUser,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};