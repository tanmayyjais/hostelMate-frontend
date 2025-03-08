import { useEffect, useState, useContext } from "react";
import { View, Text, RefreshControl, ScrollView, Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import { AuthContext } from "../../../context/AuthContext";
import { darkGreen, lightGray, primaryBlue, white } from "../../../constants/Colors";

const Rooms = ({ navigation }) => {
   const { userInfo, updateUser } = useContext(AuthContext);
   const [refreshing, setRefreshing] = useState(false);
   const [hostelList, setHostelList] = useState([]);
   const [floorList, setFloorList] = useState([]);
   const [availableRooms, setAvailableRooms] = useState([]);

   // DropDown States
   const [selectedHostel, setSelectedHostel] = useState(null);
   const [selectedFloor, setSelectedFloor] = useState(null);
   const [selectedRoom, setSelectedRoom] = useState(null);
   const [showHostelDropdown, setShowHostelDropdown] = useState(false);
   const [showFloorDropdown, setShowFloorDropdown] = useState(false);
   const [showRoomDropdown, setShowRoomDropdown] = useState(false);

   const isUserLoaded = userInfo !== null;

   // ✅ Fetch Hostel and Floor Options from Backend
   useEffect(() => {
      const fetchOptions = async () => {
         try {
            const response = await axios.get(`${baseUrl}rooms/options`);
            setHostelList(response.data.hostels);
            setFloorList(response.data.floors);
         } catch (error) {
            console.error("❌ Error fetching hostel/floor options:", error);
            Alert.alert("Error", "Could not fetch hostel and floor options.");
         }
      };
      fetchOptions();
   }, []);

   // ✅ Fetch Available Rooms Based on Selection
   // ✅ Fetch Available Rooms Based on Selection
// ✅ Fetch Available Rooms Based on Selection
useEffect(() => {
   if (selectedHostel && selectedFloor) {
      axios
         .get(`${baseUrl}rooms/available`, {
            params: { hostel_no: selectedHostel, floor_no: selectedFloor }
         })
         .then(response => {
            console.log("🟢 Fetched Available Rooms:", response.data.rooms);
            setAvailableRooms(
               response.data.rooms.map(room => ({
                  label: `Room ${room.room_no} (${room.status})`, 
                  value: room.room_no,
                  status: room.status
               }))
            );
            setSelectedRoom(null);
         })
         .catch(error => {
            console.error("❌ Error fetching available rooms:", error);
            Alert.alert("Error", "Could not fetch available rooms.");
         });
   } else {
      setAvailableRooms([]);
      setSelectedRoom(null);
   }
}, [selectedHostel, selectedFloor]);

   // ✅ Handle Room Allocation
   const handleRoomSelection = async () => {
      if (!isUserLoaded) {
          Alert.alert("Error", "User data is still loading. Please try again.");
          return;
      }
  
      console.log("🔍 User Info:", userInfo); // 🛑 Check if `userInfo` contains `id`
  
      if (userInfo.hostel_no && userInfo.room_no) {
          Alert.alert("Already Allocated", `You have already been assigned Room ${userInfo.room_no} in ${userInfo.hostel_no}.`);
          return;
      }
  
      if (!selectedRoom) {
          Alert.alert("Error", "Please select a room.");
          return;
      }
  
      const requestData = {
          userId: userInfo?._id,  // 🛑 Ensure this exists
          hostel_no: selectedHostel,
          floor_no: selectedFloor,
          room_no: Number(selectedRoom),
      };
  
      console.log("🔹 API Request Data:", requestData);  // ✅ Check if userId is still undefined
  
      try {
          const response = await axios.post(`${baseUrl}rooms/request`, requestData);
          console.log("✅ Room Request Response:", response.data);
          Alert.alert("Success", response.data.message);
          updateUser({ hostel_no: selectedHostel, floor_no: selectedFloor, room_no: selectedRoom });
      } catch (error) {
          console.error("❌ Room allocation failed:", error.response ? error.response.data : error);
          Alert.alert("Error", error.response?.data?.message || "Room allocation failed. Please try again.");
      }
  };
    
   return (
      <SafeAreaView style={styles.container}>
         <ScrollView
            style={styles.scrollView}
            contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
         >
            <View style={styles.contentContainer}>
               <Text style={styles.reqRoomTitle}>Request a Room</Text>

               {isUserLoaded && userInfo.hostel_no && userInfo.room_no ? (
                  <View style={styles.allocatedContainer}>
                     <Text style={styles.allocatedText}>
                        ✅ You have requested a Room {userInfo.room_no} in {userInfo.hostel_no}.
                     </Text>
                  </View>
               ) : (
                  <View style={styles.formContainer}>
                     {/* Hostel Selection */}
                     <DropDown
                        mode="outlined"
                        label="Select Hostel"
                        visible={showHostelDropdown}
                        showDropDown={() => setShowHostelDropdown(true)}
                        onDismiss={() => setShowHostelDropdown(false)}
                        list={hostelList.map(hostel => ({ label: hostel, value: hostel }))}
                        value={selectedHostel}
                        setValue={(value) => {
                           setSelectedHostel(value);
                           setSelectedFloor(null);
                           setAvailableRooms([]);
                           setSelectedRoom(null);
                        }}
                     />

                     {/* Floor Selection */}
                     <DropDown
                        mode="outlined"
                        label="Select Floor"
                        visible={showFloorDropdown}
                        showDropDown={() => setShowFloorDropdown(true)}
                        onDismiss={() => setShowFloorDropdown(false)}
                        list={floorList.map(floor => ({ label: floor, value: floor }))}
                        value={selectedFloor}
                        setValue={(value) => {
                           setSelectedFloor(value);
                           setAvailableRooms([]);
                           setSelectedRoom(null);
                        }}
                        disabled={!selectedHostel}
                        style={styles.dropdown}
                     />

                     {/* Room Selection */}
                     <DropDown
    mode="outlined"
    label="Select Room"
    visible={showRoomDropdown}
    showDropDown={() => setShowRoomDropdown(true)}
    onDismiss={() => setShowRoomDropdown(false)}
    list={availableRooms.map(room => ({
        label: `Room ${room.value} (${room.status})`,
        value: room.value,
        disabled: room.status !== "available"
    }))}
    value={selectedRoom}
    setValue={(value) => {
        console.log("🛏 Selected Room:", value);  // 🛑 Ensure this logs a number
        setSelectedRoom(value);
    }}
    disabled={!selectedFloor || availableRooms.length === 0}
    style={styles.dropdown}
/>

                     {/* Confirm Button */}
                     <Button
                        mode="contained"
                        buttonColor={primaryBlue}
                        style={styles.confirmButton}
                        labelStyle={{ fontSize: 16 }}
                        onPress={handleRoomSelection}
                        disabled={!selectedRoom}
                     >
                        Confirm Room Selection
                     </Button>
                  </View>
               )}
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: white },
   scrollView: { width: "100%" },
   contentContainer: { width: "85%", alignItems: "center" },
   reqRoomTitle: { marginVertical: 8, fontSize: 18, fontFamily: "fontBold" },
   allocatedContainer: { backgroundColor: lightGray, padding: 10, borderRadius: 8, marginBottom: 10, width: "100%" },
   allocatedText: { fontFamily: "fontRegular", fontSize: 16, color: darkGreen, textAlign: "center" },
   formContainer: { width: "100%", marginTop: 10 },
   dropdown: { marginTop: 10 },
   confirmButton: { width: "100%", borderRadius: 9, marginTop: 10 },
});

export default Rooms;