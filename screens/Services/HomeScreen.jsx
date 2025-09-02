// HomeScreen.jsx - Updated with testimonial backend integration
import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  FlatList,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import BigServiceCard from "../../components/cards/BigServiceCard";
import { useFavorites } from "../../context/FavoritesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

// API Configuration - Change this to your server URL
const API_BASE_URL = 'http://192.168.100.6:5000/api'; // Replace with your actual server IP
// For Android Emulator use: http://10.0.2.2:3000/api
// For iOS Simulator use: http://localhost:3000/api

const HomeScreen = () => {
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();

  // State variables
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [displayName, setDisplayName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userToken, setUserToken] = useState(null);

  // Testimonial states - Updated for backend integration
  const [testimonials, setTestimonials] = useState([]);
  const [userTestimonials, setUserTestimonials] = useState([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    feedback: "",
    rating: 5
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [testimonialLoading, setTestimonialLoading] = useState(false);

  // API Functions
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/services`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setServicesData(data);
      
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please check your connection.');
      
      // Fallback to local data if API fails
      const fallbackServices = [
        {
          _id: "1",
          name: "Hair Cut",
          styles: [],
        },
        {
          _id: "2", 
          name: "Hair Color",
          styles: [],
        },
        // Add other fallback services as needed
      ];
      setServicesData(fallbackServices);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fetch all testimonials (public)
  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      
      if (response.ok) {
        const result = await response.json();
        setTestimonials(result.data || []);
      } else {
        console.warn('Failed to fetch testimonials');
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  // NEW: Fetch user's own testimonials
  const fetchUserTestimonials = async () => {
    if (!userToken) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/my-testimonials`, {
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setUserTestimonials(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching user testimonials:', error);
    }
  };

  // NEW: Create testimonial
  const createTestimonial = async (testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  // NEW: Update testimonial
  const updateTestimonial = async (testimonialId, testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  // NEW: Delete testimonial
  const deleteTestimonial = async (testimonialId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      return { success: false, message: 'Network error occurred' };
    }
  };

  const searchStyles = async (query) => {
    if (!query.trim()) {
      setFilteredStyles([]);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/search/styles?query=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const data = await response.json();
        const dataWithIds = data.map((item, index) => ({
          ...item,
          searchId: `${item.serviceName || 'unknown'}-${item.name || item._id || index}`,
        }));
        setFilteredStyles(dataWithIds);
      } else {
        console.warn("Search endpoint failed, falling back locally");

        // fallback local search
        const results = servicesData.flatMap((service) =>
          (service.styles || [])
            .filter((style) =>
              style.name?.toLowerCase().includes(query.toLowerCase())
            )
            .map((style) => ({
              ...style,
              serviceName: service.name,
              searchId: `${service.name}-${style.name || style._id || Math.random()}`,
            }))
        );
        setFilteredStyles(results);
      }
    } catch (error) {
      console.error("Error searching styles:", error);

      // fallback local again
      const results = servicesData.flatMap((service) =>
        (service.styles || [])
          .filter((style) =>
            style.name?.toLowerCase().includes(query.toLowerCase())
          )
          .map((style) => ({
            ...style,
            serviceName: service.name,
            searchId: `${service.name}-${style.name || style._id || Math.random()}`,
          }))
      );
      setFilteredStyles(results);
    }
  };

  // Effects
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token"); // Assuming you store token separately
        
        if (storedUser && storedToken) {
          const userObj = JSON.parse(storedUser);
          const userName = userObj.fullName || userObj.name || userObj.displayName;
          setDisplayName(userName || "User");
          setUserToken(storedToken);
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
        navigation.replace('LoginScreen');
      }
    };

    loadUserData();
    fetchServices();
    fetchTestimonials(); // Fetch public testimonials
  }, [navigation]);

  // Fetch user testimonials when token is available
  useEffect(() => {
    if (userToken) {
      fetchUserTestimonials();
    }
  }, [userToken]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchStyles(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, servicesData]);

  // Helper functions
  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  const displayServices = [
    {
      name: "Hair Cut",
      description: "Stylish cuts tailored to your look.",
      image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/haircut_dnayis.webp",
    },
    {
      name: "Hair Color",
      description: "Transform your hair with vibrant, lasting colors.",
      image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/haircolor_bk135m.webp",
    },
    {
      name: "Hair Treatment",
      description: "Revitalize and strengthen your hair for a healthy, shiny look.",
      image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375430/hairtreatment_ddzkdc.webp",
    },
    {
      name: "Rebond & Forms",
      description: "Get sleek, straight, and perfectly styled hair.",
      image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/rebondandforms_ydvsyo.webp",
    },
    {
      name: "Nail Care",
      description: "Keep your nails healthy, polished, and beautifully designed.",
      image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/nailcare_izbusf.webp",
    },
    {
      name: "Foot Spa",
      description: "Relax and rejuvenate your feet with soothing care.",
      image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375432/footspa_idzcx1.webp",
    },
  ];

  // FIXED handleServicePress function sa HomeScreen mo
const handleServicePress = async (serviceName) => {
  try {
    setLoading(true);
    
    const response = await fetch(`${API_BASE_URL}/services/name/${encodeURIComponent(serviceName)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiResponse = await response.json();
    console.log("API Response:", apiResponse); // Debug log
    
    // FIXED: Extract the actual service data from the API response
    const selectedService = apiResponse.data || apiResponse;
    console.log("Extracted Service:", selectedService); // Debug log
    
    if (selectedService && selectedService.name) {
      // Pass the extracted service data, not the whole API response
      navigation.navigate("ServiceDetailScreen", { service: selectedService });
    } else {
      Alert.alert("Service Not Found", "This service is not available yet.");
    }
    
  } catch (error) {
    console.error('Error fetching service:', error);
    Alert.alert("Error", "Failed to load service details. Please try again.");
  } finally {
    setLoading(false);
  }
};

  // Image source handler for API images
  const getImageSource = (imageData) => {
    if (typeof imageData === 'number') {
      return imageData; // Local require() image
    }
    
    if (typeof imageData === 'string') {
      if (imageData.startsWith('/images/') || imageData.startsWith('images/')) {
        // API image path - construct full URL
        return { uri: `${API_BASE_URL.replace('/api', '')}/uploads/${imageData.replace('/images/', '').replace('images/', '')}` };
      }
      
      if (imageData.startsWith('http')) {
        // Full URL
        return { uri: imageData };
      }
    }
  };

  // UPDATED: Testimonial functions with backend integration
  const handleAddTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
      Alert.alert("Error", "Please fill in both name and feedback fields.");
      return;
    }

    setTestimonialLoading(true);

    const result = await createTestimonial({
      name: newTestimonial.name.trim(),
      feedback: newTestimonial.feedback.trim(),
      rating: newTestimonial.rating || 5
    });

    setTestimonialLoading(false);

    if (result.success) {
      setNewTestimonial({ name: "", feedback: "", rating: 5 });
      setShowTestimonialModal(false);
      
      // Refresh testimonials
      fetchTestimonials();
      fetchUserTestimonials();
      
      Alert.alert("Success", "Your testimonial has been added!");
    } else {
      Alert.alert("Error", result.message || "Failed to add testimonial");
    }
  };

  const handleEditTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
      Alert.alert("Error", "Please fill in both name and feedback fields.");
      return;
    }

    setTestimonialLoading(true);

    const result = await updateTestimonial(editingId, {
      name: newTestimonial.name.trim(),
      feedback: newTestimonial.feedback.trim(),
      rating: newTestimonial.rating || 5
    });

    setTestimonialLoading(false);

    if (result.success) {
      resetTestimonialModal();
      
      // Refresh testimonials
      fetchTestimonials();
      fetchUserTestimonials();
      
      Alert.alert("Success", "Testimonial updated successfully!");
    } else {
      Alert.alert("Error", result.message || "Failed to update testimonial");
    }
  };

  const handleDeleteTestimonial = (testimonialId) => {
    Alert.alert(
      "Delete Testimonial",
      "Are you sure you want to delete this testimonial?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteTestimonial(testimonialId);
            
            if (result.success) {
              // Refresh testimonials
              fetchTestimonials();
              fetchUserTestimonials();
              
              Alert.alert("Success", "Testimonial deleted successfully!");
            } else {
              Alert.alert("Error", result.message || "Failed to delete testimonial");
            }
          },
        },
      ]
    );
  };

  const openEditModal = (testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      feedback: testimonial.feedback,
      rating: testimonial.rating || 5
    });
    setEditingId(testimonial._id);
    setIsEditMode(true);
    setShowTestimonialModal(true);
  };

  const resetTestimonialModal = () => {
    setNewTestimonial({ name: "", feedback: "", rating: 5 });
    setShowTestimonialModal(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  // UPDATED: Render functions with backend data
  const renderTestimonialCard = (item, index, isUserTestimonial = false) => (
    <View key={item._id || index} style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialUserInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          {/* Rating display */}
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, i) => (
              <Icon
                key={i}
                name={i < (item.rating || 5) ? "star" : "star-outline"}
                size={16}
                color="#ffcc00"
              />
            ))}
          </View>
        </View>

        {isUserTestimonial && (
          <View style={styles.testimonialActions}>
            <TouchableOpacity
              onPress={() => openEditModal(item)}
              style={styles.actionButton}
            >
              <Icon name="pencil" size={18} color="#007d3f" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteTestimonial(item._id)}
              style={styles.actionButton}
            >
              <Icon name="trash" size={18} color="#d13f3f" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.testimonialMessage}>{item.feedback}</Text>

      {isUserTestimonial && (
        <View style={styles.userBadge}>
          <Icon name="person" size={12} color="#007d3f" />
          <Text style={styles.userBadgeText}>Your Review</Text>
        </View>
      )}
    </View>
  );

  const renderTestimonialModal = () => (
    <Modal
      visible={showTestimonialModal}
      transparent={true}
      animationType="slide"
      onRequestClose={resetTestimonialModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {isEditMode ? "Edit Your Testimonial" : "Share Your Experience"}
          </Text>

          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter your name"
            value={newTestimonial.name}
            onChangeText={(text) =>
              setNewTestimonial((prev) => ({ ...prev, name: text }))
            }
            maxLength={50}
          />

          <Text style={styles.inputLabel}>Your Feedback</Text>
          <TextInput
            style={[styles.modalInput, styles.feedbackInput]}
            placeholder="Share your experience with our services..."
            value={newTestimonial.feedback}
            onChangeText={(text) =>
              setNewTestimonial((prev) => ({ ...prev, feedback: text }))
            }
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {newTestimonial.feedback.length}/200 characters
          </Text>

          {/* Rating selector */}
          <Text style={styles.inputLabel}>Rating</Text>
          <View style={styles.ratingSelector}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() => setNewTestimonial(prev => ({ ...prev, rating }))}
                style={styles.starButton}
              >
                <Icon
                  name={rating <= (newTestimonial.rating || 5) ? "star" : "star-outline"}
                  size={32}
                  color="#ffcc00"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={resetTestimonialModal}
              disabled={testimonialLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={isEditMode ? handleEditTestimonial : handleAddTestimonial}
              disabled={testimonialLoading}
            >
              <Text style={styles.submitButtonText}>
                {testimonialLoading ? "Processing..." : (isEditMode ? "Update" : "Submit")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderNonSearchContent = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Icon
            name="person-circle-outline"
            size={70}
            color="#555"
            style={styles.profileIcon}
          />
          <View>
            <Text style={styles.headerGreeting}>Welcome back!</Text>
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("NotificationScreen")}
        >
          <View style={{ position: "relative" }}>
            <Icon name="notifications" size={31} color="#ffcc00" />
            <View style={styles.notifBadge} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerText}>Pamper Yourself Today!</Text>
        <Text style={[styles.bannerText, { fontSize: 14, marginTop: 5 }]}>
          Book your favorite salon service now.
        </Text>
      </View>

      <Text style={styles.servicesTitle}>Our Services</Text>
      <View style={styles.servicesContainer}>
        {displayServices.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={styles.serviceCard}
            onPress={() => handleServicePress(service.name)}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Image
              source={{ uri: service.image }}
              style={styles.serviceImage}
              resizeMode="cover"
            />
            <View style={styles.serviceLabelContainer}>
            <Text style={styles.serviceText}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* UPDATED: Testimonials Section with backend integration */}
      <View style={styles.testimonialsSection}>
        <View style={styles.testimonialTitleContainer}>
          <Text style={styles.testimonialTitle}>What Our Clients Say</Text>
          <TouchableOpacity
            style={styles.addTestimonialButton}
            onPress={() => setShowTestimonialModal(true)}
            disabled={testimonialLoading}
          >
            <Icon name="add-circle" size={24} color="#007d3f" />
            <Text style={styles.addTestimonialText}>Add Review</Text>
          </TouchableOpacity>
        </View>

        {/* User's own testimonials first */}
        {userTestimonials.length > 0 && (
          <View style={styles.userTestimonialsSection}>
            <Text style={styles.sectionSubtitle}>Your Reviews</Text>
            {userTestimonials.map((item, index) => 
              renderTestimonialCard(item, index, true)
            )}
          </View>
        )}

        {/* All testimonials */}
        {testimonials.length > 0 ? (
          <View style={styles.allTestimonialsSection}>
            <Text style={styles.sectionSubtitle}>
              {userTestimonials.length > 0 ? "Other Reviews" : "Customer Reviews"}
            </Text>
            {testimonials
              .filter(testimonial => !userTestimonials.some(ut => ut._id === testimonial._id))
              .map((item, index) => renderTestimonialCard(item, index, false))
            }
          </View>
        ) : (
          <View style={styles.emptyTestimonials}>
            <Icon name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.emptyTestimonialsText}>
              No reviews yet. Be the first to share your experience!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {/* Search Bar */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 20,
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <View style={styles.searchBarContainer}>
          <Icon
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search styles"
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            style={styles.searchInput}
            editable={!loading}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Icon
                name="close-circle"
                size={20}
                color="#aaa"
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content */}
      {searchQuery.trim() === "" ? (
        renderNonSearchContent()
      ) : (
        <FlatList
          keyboardShouldPersistTaps="handled"
          data={filteredStyles}
          keyExtractor={(item, index) => {
              return item.searchId || `${item.serviceName || 'unknown'}-${item.name || 'unnamed'}-${index}`;
           }}
          numColumns={1}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 130,
            paddingTop: 20,
            gap: 12,
          }}
          renderItem={({ item }) => {
           const isFootSpa = item.serviceName
             .toLowerCase()
             .includes("foot spa");
   return (
     <BigServiceCard
       serviceName={item.serviceName}
       styleData={item}  
       onImagePress={() => openImageModal(item.image)}  
       onBookPress={() =>
         navigation.navigate("BookingFormScreen", {
           serviceName: item.serviceName,
           styleName: item.name,
           stylePrice: item.price,
         })
       }
       isFootSpa={isFootSpa}
       searchCard={true}
     />
   );
 }}
          ListEmptyComponent={
            loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Searching...</Text>
              </View>
            ) : (
              <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
                No results found.
              </Text>
            )
          }
        />
      )}

      {/* Testimonial Modal */}
      {renderTestimonialModal()}

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.9)",
            justifyContent: "center",
            alignItems: "center",
          }}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={selectedImage}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Main container with padding for the entire screen
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    paddingTop: 27,
  },

  // Styles for the search bar and its icons
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 50,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
    color: "#d13f3f",
  },
  clearIcon: {
    marginLeft: 8,
    color: "#999",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 10,
  },

  // Header or top section of the screen
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    borderColor: "#D4D4D4",
    elevation: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileIcon: {
    marginRight: 12,
  },
  headerGreeting: {
    fontSize: 16,
    color: "#777",
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  notifBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "red",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },

  // Banner with a colored background and centered text
  banner: {
    backgroundColor: "#d13f3f",
    height: 160,
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
  },
  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },

  // Section for the list of services
  servicesTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
    color: "#d13f3f",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 15,
  },
  serviceCard: {
    width: "48%",
    height: 210,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D4D4D4",
    elevation: 1,
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: "65%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  serviceLabelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  serviceText: {
    color: "#d13f3f",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  serviceDescription: {
    color: "#555",
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
    paddingHorizontal: 5,
  },

  // UPDATED: Testimonials section with new styles for backend integration
  testimonialsSection: {
    marginTop: 20,
  },
  testimonialTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  testimonialTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#d13f3f",
    marginBottom: 12,
    textAlign: "center",
  },
  addTestimonialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#007d3f",
  },
  addTestimonialText: {
    color: "#007d3f",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  // NEW: Section separators
  userTestimonialsSection: {
    marginBottom: 20,
  },
  allTestimonialsSection: {
    marginTop: 10,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 10,
    paddingLeft: 5,
  },

  testimonialCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderColor: "#D4D4D4",
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  testimonialHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  testimonialUserInfo: {
    flex: 1,
  },
  testimonialDate: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  testimonialActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 5,
    color: "#333",
  },
  testimonialMessage: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
    marginTop: 8,
  },

  // NEW: Rating display
  ratingContainer: {
    flexDirection: "row",
    marginTop: 4,
  },

  userBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  userBadgeText: {
    fontSize: 10,
    color: "#007d3f",
    fontWeight: "500",
    marginLeft: 4,
  },

  // Modal (popup) for adding or editing testimonials
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d13f3f",
    textAlign: "center",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  feedbackInput: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },

  // NEW: Rating selector
  ratingSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  starButton: {
    paddingHorizontal: 5,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007d3f",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  // Empty state for testimonials
  emptyTestimonials: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTestimonialsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },

  // NEW: Loading state
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
});

export default HomeScreen;