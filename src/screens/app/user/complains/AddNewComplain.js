import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  Pressable,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, TextInput, Divider, Surface, Banner, ActivityIndicator } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { baseUrl } from "../../../../config/BaseUrl";
import { Ionicons, MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const AddNewComplaint = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  
  // Create ref for dropdown button
  const dropdownRef = useRef(null);

  // Department options with icons
  const departments = [
    { label: "Electrical", value: "electrical", icon: "lightbulb" },
    { label: "Water", value: "water", icon: "water" },
    { label: "Maintenance", value: "maintenance", icon: "tools" },
    { label: "Security", value: "security", icon: "shield-alt" },
    { label: "Housekeeping", value: "housekeeping", icon: "broom" },
    { label: "Network Support", value: "network", icon: "laptop" },
  ];

  const addNewComplaintSchema = Yup.object({
    department: Yup.string().required("Department is required!"),
    title: Yup.string().required("Title is required!"),
    description: Yup.string()
      .required("Description is required!")
      .min(10, "Description should be at least 10 characters long"),
  });

  // Function to pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to take a photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }
    
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Function to remove selected image
  const removeImage = () => {
    setSelectedImage(null);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const closeDropdown = () => setDropdownOpen(false);
  
  const selectDepartment = (dept, setFieldValue) => {
    setSelectedDepartment(dept.value);
    setFieldValue("department", dept.value);
    closeDropdown();
  };

  const handleAddNewComplaint = async (values, { resetForm }) => {
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Authentication Error", "No token found, please login again!");
        setSubmitting(false);
        return;
      }

      const formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;

      const formData = new FormData();
      formData.append("category", values.department);
      formData.append("department", values.department);
      formData.append("title", values.title);
      formData.append("description", values.description);

      if (selectedImage) {
        const imageName = selectedImage.split("/").pop();
        const imageExt = imageName.split(".").pop();

        formData.append("image", {
          uri: selectedImage,
          name: imageName,
          type: `image/${imageExt}`,
        });
      }

      const response = await axios.post(`${baseUrl}complaints`, formData, {
        headers: {
          Authorization: formattedToken,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setBannerVisible(true);
        resetForm();
        setSelectedDepartment("");
        setSelectedImage(null);
        
        // Navigate back after a short delay
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getDepartmentIcon = (value) => {
    const dept = departments.find(d => d.value === value);
    return dept ? dept.icon : "question";
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0055a5" />
      
      {/* Success Banner */}
      <Banner
        visible={bannerVisible}
        actions={[
          {
            label: 'OK',
            onPress: () => setBannerVisible(false),
          },
        ]}
        style={styles.banner}
        icon={({size}) => (
          <MaterialCommunityIcons name="check-circle" size={size} color="#4CAF50" />
        )}
      >
        Complaint submitted successfully! Redirecting...
      </Banner>
      
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
          <Text style={styles.headerTitle}>File a Complaint</Text>
          <Text style={styles.headerSubtitle}>Let us know how we can help</Text>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Surface style={styles.formContainer}>
          <Formik
            onSubmit={handleAddNewComplaint}
            initialValues={{ department: selectedDepartment, title: "", description: "" }}
            validationSchema={addNewComplaintSchema}
            enableReinitialize={true}
          >
            {({ handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <View style={styles.sectionTitleContainer}>
                  <MaterialIcons name="note-add" size={20} color="#0066cc" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Complaint Details</Text>
                </View>
                
                {/* Department Dropdown */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Department <Text style={styles.requiredStar}>*</Text></Text>
                  
                  {/* Custom Dropdown Button */}
                  <TouchableOpacity
                    ref={dropdownRef}
                    style={[
                      styles.dropdownButton,
                      errors.department && touched.department && styles.inputError,
                    ]}
                    onPress={toggleDropdown}
                    activeOpacity={0.7}
                  >
                    {selectedDepartment ? (
                      <View style={styles.selectedDeptContainer}>
                        <View style={styles.iconCircle}>
                          <FontAwesome5 
                            name={getDepartmentIcon(selectedDepartment)} 
                            size={16} 
                            color="#ffffff" 
                          />
                        </View>
                        <Text style={styles.selectedText}>
                          {departments.find(dept => dept.value === selectedDepartment)?.label}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.placeholderText}>Select a Department</Text>
                    )}
                    <MaterialIcons 
                      name={dropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                      size={26} 
                      color="#555" 
                    />
                  </TouchableOpacity>
                  
                  {/* Custom Dropdown Menu */}
                  <Modal
                    visible={dropdownOpen}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={closeDropdown}
                  >
                    <Pressable style={styles.modalOverlay} onPress={closeDropdown}>
                      <Pressable style={styles.dropdownMenu}>
                        <Text style={styles.dropdownTitle}>Select Department</Text>
                        <Divider style={styles.dropdownDivider} />
                        <ScrollView style={styles.dropdownScrollView}>
                          {departments.map((dept) => (
                            <TouchableOpacity
                              key={dept.value}
                              style={styles.dropdownItem}
                              onPress={() => selectDepartment(dept, setFieldValue)}
                            >
                              <View style={[styles.iconCircle, { backgroundColor: dept.value === selectedDepartment ? '#0066cc' : '#8eb3e2' }]}>
                                <FontAwesome5 name={dept.icon} size={16} color="#ffffff" />
                              </View>
                              <Text style={[styles.dropdownItemText, 
                                dept.value === selectedDepartment && styles.dropdownItemSelected]}>
                                {dept.label}
                              </Text>
                              {dept.value === selectedDepartment && (
                                <MaterialIcons name="check" size={20} color="#0066cc" style={styles.checkIcon} />
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </Pressable>
                    </Pressable>
                  </Modal>
                  
                  {errors.department && touched.department && (
                    <Text style={styles.errorText}>{errors.department}</Text>
                  )}
                </View>

                {/* Title Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter a brief title for your complaint"
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    style={styles.input}
                    outlineColor={errors.title && touched.title ? "#ff3b30" : "#ddd"}
                    activeOutlineColor="#0066cc"
                    left={<TextInput.Icon icon="format-title" color={errors.title && touched.title ? "#ff3b30" : "#888"} />}
                  />
                  {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}
                </View>

                {/* Description Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description <Text style={styles.requiredStar}>*</Text></Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Please describe the issue in detail to help us resolve it quickly"
                    multiline
                    numberOfLines={8}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    style={[styles.input, styles.textArea]}
                    outlineColor={errors.description && touched.description ? "#ff3b30" : "#ddd"}
                    activeOutlineColor="#0066cc"
                    left={<TextInput.Icon icon="text" color={errors.description && touched.description ? "#ff3b30" : "#888"} />}
                  />
                  {errors.description && touched.description && (
                    <Text style={styles.errorText}>{errors.description}</Text>
                  )}
                </View>

                <View style={styles.sectionTitleContainer}>
                  <MaterialIcons name="photo-camera" size={20} color="#0066cc" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>Supporting Evidence</Text>
                </View>
                
                {/* Image Picker */}
                <View style={styles.imageOptionsContainer}>
                  <Text style={styles.inputLabel}>Add Image (Optional)</Text>
                  <Text style={styles.imageHelpText}>
                    Adding an image can help us better understand and resolve your issue
                  </Text>
                  
                  <View style={styles.imageButtonsRow}>
                    <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                      <Ionicons name="images" size={22} color="#0066cc" />
                      <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={takePhoto} style={styles.imageButton}>
                      <Ionicons name="camera" size={22} color="#0066cc" />
                      <Text style={styles.imageButtonText}>Take a Photo</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Show Image Preview If Selected */}
                  {selectedImage ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                      <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                        <MaterialIcons name="cancel" size={24} color="#ff3b30" />
                      </TouchableOpacity>
                      <View style={styles.imageInfoOverlay}>
                        <Text style={styles.imageInfoText}>Preview</Text>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.noImageContainer}>
                      <MaterialCommunityIcons name="image-plus" size={40} color="#ccc" />
                      <Text style={styles.noImageText}>
                        No image selected
                      </Text>
                      <Text style={styles.noImageSubtext}>
                        Tap an option above to add an image
                      </Text>
                    </View>
                  )}
                </View>

                {/* Submit Button */}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.submitButton}
                  labelStyle={styles.submitButtonLabel}
                  loading={submitting}
                  disabled={submitting}
                  icon={submitting ? null : "send"}
                >
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </Button>
              </View>
            )}
          </Formik>
        </Surface>
        
        {/* Help Section */}
        <Surface style={styles.infoContainer}>
          <View style={styles.infoHeader}>
            <MaterialIcons name="lightbulb" size={22} color="#0066cc" />
            <Text style={styles.infoHeaderText}>How Complaints Are Processed</Text>
          </View>
          <Divider style={styles.infoDivider} />
          
          <View style={styles.infoItemsContainer}>
            <View style={styles.infoItem}>
              <View style={styles.infoNumberCircle}>
                <Text style={styles.infoNumber}>1</Text>
              </View>
              <View style={styles.infoContentContainer}>
                <Text style={styles.infoTitle}>Complaint Filed</Text>
                <Text style={styles.infoText}>
                  Your complaint is securely recorded in our system
                </Text>
              </View>
            </View>
            
            <View style={styles.infoConnector} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoNumberCircle}>
                <Text style={styles.infoNumber}>2</Text>
              </View>
              <View style={styles.infoContentContainer}>
                <Text style={styles.infoTitle}>Department Assignment</Text>
                <Text style={styles.infoText}>
                  Your complaint is assigned to the appropriate department staff
                </Text>
              </View>
            </View>
            
            <View style={styles.infoConnector} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoNumberCircle}>
                <Text style={styles.infoNumber}>3</Text>
              </View>
              <View style={styles.infoContentContainer}>
                <Text style={styles.infoTitle}>Review & Action</Text>
                <Text style={styles.infoText}>
                  Staff will review your complaint and take necessary action
                </Text>
              </View>
            </View>
            
            <View style={styles.infoConnector} />
            
            <View style={styles.infoItem}>
              <View style={styles.infoNumberCircle}>
                <Text style={styles.infoNumber}>4</Text>
              </View>
              <View style={styles.infoContentContainer}>
                <Text style={styles.infoTitle}>Updates & Resolution</Text>
                <Text style={styles.infoText}>
                  Track status and updates in the Complaints section
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tipContainer}>
            <MaterialIcons name="info" size={18} color="#0066cc" style={styles.tipIcon} />
            <Text style={styles.tipText}>
              For urgent matters, please contact the helpdesk directly at +1-800-123-4567
            </Text>
          </View>
        </Surface>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for helping us improve our services
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  banner: {
    backgroundColor: "#e7f5e8",
    marginBottom: 10,
  },
  formContainer: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  form: {
    width: "100%",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0066cc",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  requiredStar: {
    color: "#ff3b30",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    minHeight: 160,
    textAlignVertical: "top",
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 16,
    backgroundColor: "#fff",
    height: 56,
  },
  selectedDeptContainer: {
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
    marginRight: 12,
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  selectedText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownMenu: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "85%",
    maxHeight: "60%",
    padding: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: "hidden",
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    padding: 16,
    textAlign: "center",
  },
  dropdownDivider: {
    backgroundColor: "#e0e0e0",
    height: 1,
  },
  dropdownScrollView: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  dropdownItemSelected: {
    color: "#0066cc",
    fontWeight: "600",
  },
  checkIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 13,
    marginTop: 6,
    marginLeft: 2,
  },
  inputError: {
    borderColor: "#ff3b30",
  },
  imageOptionsContainer: {
    marginBottom: 28,
  },
  imageHelpText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    fontStyle: "italic",
  },
  imageButtonsRow: {
    flexDirection: "column",
    marginBottom: 16,
    gap: 12,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f7ff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1e3ff",
    elevation: 2,
    shadowColor: "#0066cc",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#0066cc",
    fontWeight: "500",
  },
  imagePreviewContainer: {
    marginTop: 16,
    width: "100%",
    height: 250,
    alignItems: "center",
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  noImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fafafa",
    marginTop: 16,
  },
  noImageText: {
    marginTop: 12,
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
  noImageSubtext: {
    color: "#999",
    fontSize: 14,
    marginTop: 4,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 20,
    padding: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  imageInfoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  imageInfoText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  submitButton: {
    borderRadius: 8,
    backgroundColor: "#0066cc",
    paddingVertical: 6,
    marginTop: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
    paddingVertical: 6,
  },
  infoContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#f5f9ff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoHeaderText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#0066cc",
  },
  infoDivider: {
    backgroundColor: "#d1e3ff",
    height: 1.5,
    marginBottom: 20,
  },
  infoItemsContainer: {
    paddingHorizontal: 8,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoConnector: {
    width: 2,
    height: 20,
    backgroundColor: "#d1e3ff",
    marginLeft: 16,
    marginBottom: 8,
  },
  infoNumberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0066cc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  infoContentContainer: {
    flex: 1,
    paddingTop: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: "flex-start",
    borderLeftWidth: 4,
    borderLeftColor: "#0066cc",
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  }
});

export default AddNewComplaint;