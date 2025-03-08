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

   const isLoggedIn = async () => {
      try {
         let token = await AsyncStorage.getItem("userToken");
         let storedUserInfo = await AsyncStorage.getItem("userInfo");

         console.log("🔍 Retrieving user info from AsyncStorage:", storedUserInfo);

         storedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

         if (storedUserInfo) {
            setUserInfo(storedUserInfo);
            setUserToken(token);
         } else {
            console.error("❌ User Info is null or undefined in AsyncStorage");
         }
      } catch (e) {
         console.error(`AsyncStorage Error: ${e.message}`);
         setErr(e);
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => {
      isLoggedIn();
   }, []);

   const login = async (email, password) => {
      setIsLoading(true);
      try {
         const res = await axios.post(`${baseUrl}auth/login`, { email, password });

         if (res.data && res.data.user) {
            console.log("✅ User Info received from API:", res.data.user);
            console.log("🔑 Token received from API:", res.data.token);

            setUserInfo(res.data.user);
            setUserToken(res.data.token);

            await AsyncStorage.setItem("userToken", res.data.token);
            await AsyncStorage.setItem("userInfo", JSON.stringify(res.data.user));

            return res.data;
         }
      } catch (e) {
         console.error(`Login Error: ${e.message}`);
         setErr(e);
      } finally {
         setIsLoading(false);
      }
   };

   const updateUser = async (updatedData) => {
      setUserInfo((prevUserInfo) => {
         const newUserInfo = { ...prevUserInfo, ...updatedData };
         AsyncStorage.setItem("userInfo", JSON.stringify(newUserInfo));
         return newUserInfo;
      });
   };

   const logout = async () => {
      setIsLoading(true);
      setUserToken(null);
      setUserInfo(null);
      setErr(null);

      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");

      setIsLoading(false);
   };

   return (
      <AuthContext.Provider value={{ login, logout, err, isLoading, userToken, userInfo, updateUser }}>
         {children}
      </AuthContext.Provider>
   );
};
