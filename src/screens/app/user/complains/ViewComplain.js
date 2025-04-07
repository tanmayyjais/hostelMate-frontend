import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Platform
} from "react-native";
import { Surface, Button, Divider, Chip } from "react-native-paper";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { imageBaseUrl } from "../../../../config/BaseUrl";

const ViewComplaint = ({ navigation, route }) => {
  const { complain } = route.params;
  
  // Construct the full image URL
  const imageUrl = complain.image ? `${imageBaseUrl}${complain.image}` : null;
  
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
  
  const statusDetails = getStatusDetails(complain.status);
  const departmentIcon = getDepartmentIcon(complain.category);
  
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
            <Text style={styles.headerTitle}>Complaint Details</Text>
            <Text style={styles.headerSubtitle}>View your complaint information</Text>
         </View>
      </LinearGradient>
      
      <ScrollView 
         contentContainerStyle={styles.scrollContent}
         showsVerticalScrollIndicator={false}
      >
         {/* Status Card */}
         <Surface style={styles.statusCard}>
            <View style={[styles.statusContainer, { backgroundColor: statusDetails.bgColor }]}>
               <MaterialCommunityIcons name={statusDetails.icon} size={24} color={statusDetails.color} />
               <Text style={[styles.statusText, { color: statusDetails.color }]}>
                  {statusDetails.label}
               </Text>
            </View>
            
            <View style={styles.dateSection}>
               <View style={styles.dateItem}>
                  <MaterialIcons name="event" size={16} color="#666" />
                  <Text style={styles.dateLabel}>Filed on:</Text>
                  <Text style={styles.dateText}>{formatDate(complain.createdAt)}</Text>
               </View>
               
               {complain.updatedAt !== complain.createdAt && (
                  <View style={styles.dateItem}>
                     <MaterialIcons name="update" size={16} color="#666" />
                     <Text style={styles.dateLabel}>Last Updated:</Text>
                     <Text style={styles.dateText}>{formatDate(complain.updatedAt)}</Text>
                  </View>
               )}
            </View>
         </Surface>
         
         {/* Main Complaint Card */}
         <Surface style={styles.mainCard}>
            {/* Complaint Title & Category */}
            <View style={styles.titleSection}>
               <Text style={styles.complaintTitle}>{complain.title}</Text>
               
               <View style={styles.categoryContainer}>
                  <View style={styles.iconCircle}>
                     <FontAwesome5 name={departmentIcon} size={16} color="#ffffff" />
                  </View>
                  <Text style={styles.categoryText}>
                     {complain.category}
                  </Text>
               </View>
            </View>
            
            <Divider style={styles.divider} />
            
            {/* Complaint Description */}
            <View style={styles.descriptionSection}>
               <Text style={styles.sectionTitle}>Description</Text>
               <Text style={styles.descriptionText}>
                  {complain.description}
               </Text>
            </View>
            
            <Divider style={styles.divider} />
            
            {/* Complaint Image */}
            <View style={styles.imageSection}>
               <Text style={styles.sectionTitle}>Evidence</Text>
               
               {imageUrl ? (
                  <View style={styles.imageContainer}>
                     <Image
                        source={{ uri: imageUrl }}
                        style={styles.complaintImage}
                        resizeMode="cover"
                     />
                     <TouchableOpacity style={styles.expandImageButton}>
                        <MaterialIcons name="fullscreen" size={22} color="#fff" />
                     </TouchableOpacity>
                  </View>
               ) : (
                  <View style={styles.noImageContainer}>
                     <MaterialCommunityIcons name="image-off" size={48} color="#ccc" />
                     <Text style={styles.noImageText}>No Image Available</Text>
                  </View>
               )}
            </View>
            
            {/* Admin Feedback Section - only show if feedback exists */}
            {complain.adminFeedback && (
               <>
                  <Divider style={styles.divider} />
                  <View style={styles.feedbackSection}>
                     <Text style={styles.sectionTitle}>Admin Feedback</Text>
                     <Surface style={styles.feedbackCard}>
                        <View style={styles.feedbackHeader}>
                           <MaterialIcons name="feedback" size={18} color="#0066cc" />
                           <Text style={styles.feedbackHeaderText}>Response from Management</Text>
                        </View>
                        <Text style={styles.feedbackText}>
                           {complain.adminFeedback}
                        </Text>
                     </Surface>
                  </View>
               </>
            )}
         </Surface>
         
         {/* Action Buttons */}
         <View style={styles.actionButtonsContainer}>
            <Button 
               mode="contained" 
               icon="arrow-left" 
               style={[styles.actionButton, { backgroundColor: '#0066cc' }]}
               contentStyle={styles.buttonContent}
               labelStyle={styles.buttonLabel}
               onPress={() => navigation.goBack()}
            >
               Go Back
            </Button>
         </View>
      </ScrollView>
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
    shadowOpacity: 0.3,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  statusCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: -15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  dateSection: {
    padding: 16,
    backgroundColor: "white",
  },
  dateItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
    marginRight: 4,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  mainCard: {
    marginTop: 16,
    borderRadius: 12,
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
  titleSection: {
    padding: 16,
  },
  complaintTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0066cc",
    textTransform: "capitalize",
  },
  divider: {
    backgroundColor: "#e0e0e0",
    height: 1,
  },
  descriptionSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  imageSection: {
    padding: 16,
  },
  imageContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
  },
  complaintImage: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  expandImageButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  noImageContainer: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    backgroundColor: "#f6f6f6",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  noImageText: {
    marginTop: 8,
    fontSize: 14,
    color: "#999",
  },
  feedbackSection: {
    padding: 16,
  },
  feedbackCard: {
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    borderLeftWidth: 4,
    borderLeftColor: "#0066cc",
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
  },
  feedbackHeaderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0066cc",
    marginLeft: 8,
  },
  feedbackText: {
    padding: 16,
    fontSize: 14,
    color: "#444",
    lineHeight: 22,
  },
  actionButtonsContainer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default ViewComplaint;