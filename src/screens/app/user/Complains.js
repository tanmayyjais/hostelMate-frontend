import { useState, useCallback, useContext, useEffect } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  RefreshControl, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  Platform,
  Image
} from "react-native";
import { Button, Surface, ActivityIndicator, Divider, Badge } from "react-native-paper";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { baseUrl } from "../../../config/BaseUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";

const Complaints = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const { userInfo } = useContext(AuthContext);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        console.error("No token found, user might not be logged in!");
        alert("No token found, please login again!");
        return;
      }

      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const response = await axios.get(`${baseUrl}complaints/user`, {
        headers: {
          Authorization: formattedToken,
        },
      });

      const complaintsData = response.data;
      setComplaints(complaintsData);
      
      // Calculate statistics
      const total = complaintsData.length;
      const pending = complaintsData.filter(c => c.status.toLowerCase() === 'pending').length;
      const inProgress = complaintsData.filter(c => c.status.toLowerCase() === 'accepted').length;
      const resolved = complaintsData.filter(c => c.status.toLowerCase() === 'resolved').length;
      
      setStats({
        total,
        pending,
        inProgress,
        resolved
      });
      
    } catch (error) {
      console.error("Failed to fetch complaints", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);
  
  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchComplaints();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchComplaints().finally(() => setRefreshing(false));
  }, []);

  // Function to get status details based on status
  const getStatusDetails = (status) => {
    const lowerStatus = status.toLowerCase().trim(); // Normalize status

    switch (lowerStatus) {
      case "pending":
        return { 
          icon: "timer-sand", 
          color: "#FF9800",
          bgColor: "#FFF5E6",
          label: "Pending Review"
        };
      case "accepted":
      case "in progress":
        return { 
          icon: "progress-check", 
          color: "#1976D2",
          bgColor: "#E3F2FD", 
          label: "In Progress"
        };
      case "resolved":
        return { 
          icon: "check-circle", 
          color: "#4CAF50",
          bgColor: "#E8F5E9", 
          label: "Resolved"
        };
      case "rejected":
        return { 
          icon: "close-circle", 
          color: "#F44336",
          bgColor: "#FFEBEE", 
          label: "Rejected"
        };
      default:
        return { 
          icon: "help-circle", 
          color: "#78909C",
          bgColor: "#ECEFF1", 
          label: "Unknown"
        };
    }
  };

  // Function to get department icon
  const getDepartmentIcon = (category) => {
    const lowerCategory = category?.toLowerCase().trim() || '';

    switch (lowerCategory) {
      case "electrical":
        return "lightbulb";
      case "water":
        return "water";
      case "maintenance":
        return "tools";
      case "security":
        return "shield-alt";
      case "housekeeping":
        return "broom";
      case "it":
        return "laptop";
      default:
        return "clipboard-list";
    }
  };

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  };

  const renderComplaintItem = ({ item }) => {
    const statusDetails = getStatusDetails(item.status);
    const departmentIcon = getDepartmentIcon(item.category);
    
    return (
      <TouchableOpacity 
        onPress={() => navigation.navigate("UserViewComplain", { complain: item })}
        activeOpacity={0.7}
      >
        <Surface style={styles.complaintCard}>
          <View style={styles.cardHeader}>
            <View style={styles.departmentContainer}>
              <View style={styles.iconCircle}>
                <FontAwesome5 name={departmentIcon} size={16} color="#ffffff" />
              </View>
              <Text style={styles.departmentText}>
                {item.category}
              </Text>
            </View>
            
            <View style={[styles.statusBadge, { backgroundColor: statusDetails.bgColor }]}>
              <MaterialCommunityIcons name={statusDetails.icon} size={14} color={statusDetails.color} />
              <Text style={[styles.statusText, { color: statusDetails.color }]}>
                {statusDetails.label}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.complaintTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.complaintDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <MaterialIcons name="event" size={14} color="#666" />
              <Text style={styles.dateText}>Filed on: {formatDate(item.createdAt)}</Text>
            </View>
            
            <View style={styles.viewDetailsContainer}>
              <Text style={styles.viewDetailsText}>View Details</Text>
              <MaterialIcons name="chevron-right" size={18} color="#0066cc" />
            </View>
          </View>
          
          {item.image && (
            <View style={styles.hasImageIndicator}>
              <MaterialCommunityIcons name="image" size={14} color="#666" />
            </View>
          )}
        </Surface>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0055a5" />
      
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#0066cc', '#004999']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientHeader}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Complaints</Text>
          <Text style={styles.headerSubtitle}>Track and manage your submissions</Text>
        </View>
      </LinearGradient>
      
      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Surface style={[styles.statCard, { backgroundColor: '#FFF5E6' }]}>
          <View style={styles.statContent}>
            <Text style={styles.statCount}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <MaterialCommunityIcons name="timer-sand" size={24} color="#FF9800" />
        </Surface>
        
        <Surface style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
          <View style={styles.statContent}>
            <Text style={styles.statCount}>{stats.inProgress}</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <MaterialCommunityIcons name="progress-check" size={24} color="#1976D2" />
        </Surface>
        
        <Surface style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <View style={styles.statContent}>
            <Text style={styles.statCount}>{stats.resolved}</Text>
            <Text style={styles.statLabel}>Resolved</Text>
          </View>
          <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
        </Surface>
      </View>
      
      {/* Complaints List */}
      <View style={styles.complaintsListContainer}>
        <View style={styles.listHeaderContainer}>
          <View style={styles.listHeaderLeft}>
            <MaterialCommunityIcons name="clipboard-list" size={20} color="#0066cc" />
            <Text style={styles.listHeaderText}>
              Recent Complaints
            </Text>
          </View>
          
          <Badge style={styles.countBadge}>
            {stats.total}
          </Badge>
        </View>
        
        <Divider style={styles.divider} />
        
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0066cc" />
            <Text style={styles.loadingText}>Loading your complaints...</Text>
          </View>
        ) : (
          <FlatList
            data={complaints}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderComplaintItem}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                colors={["#0066cc"]} 
                tintColor="#0066cc"
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="clipboard-text-off" size={70} color="#ccc" />
                <Text style={styles.emptyTitle}>No Complaints Yet</Text>
                <Text style={styles.emptyText}>
                  You haven't filed any complaints. Tap the button below to create your first complaint.
                </Text>
              </View>
            }
          />
        )}
      </View>
      
      {/* Add New Complaint Button */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => navigation.navigate("UserAddNewComplain")}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#0066cc', '#0055aa']}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          borderRadius={28}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  gradientHeader: {
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 5.65,
  },
  headerContent: {
    marginTop: 15,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "ios" ? 50 : 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    fontWeight: "400",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: -25,
    marginBottom: 16,
  },
  statCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    width: "31%",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  statContent: {
    flex: 1,
  },
  statCount: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  complaintsListContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.62,
    paddingTop: 16,
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  listHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: "#0066cc",
    fontSize: 12,
  },
  divider: {
    backgroundColor: "#e0e0e0",
    height: 1,
    marginBottom: 8,
  },
  listContent: {
    padding: 8,
    paddingBottom: 80, // Space for the FAB button
  },
  complaintCard: {
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  departmentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  departmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066cc",
    textTransform: "capitalize",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  cardContent: {
    padding: 16,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  complaintDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    backgroundColor: "#fafafa",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  viewDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#0066cc",
    fontWeight: "500",
  },
  hasImageIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    padding: 4,
  },
  fabButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 10,
    elevation: 6,
    shadowColor: "#0066cc",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});

export default Complaints;