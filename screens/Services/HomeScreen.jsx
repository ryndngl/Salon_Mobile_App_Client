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
import API_URL from "../../config/api";

const screenWidth = Dimensions.get("window").width;
const API_BASE_URL = API_URL.replace('/api', '') + '/api';

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
  const [userObj, setUserObj] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Testimonial states
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
      setError('Failed to load services. Please check your connection.');
      
      // Fallback to local data if API fails
      const fallbackServices = {
        services: [
          { _id: "1", name: "Hair Cut", styles: [] },
          { _id: "2", name: "Hair Color", styles: [] },
          { _id: "3", name: "Hair Treatment", styles: [] },
          { _id: "4", name: "Rebond & Forms", styles: [] },
          { _id: "5", name: "Nail Care", styles: [] },
          { _id: "6", name: "Foot Spa", styles: [] },
        ]
      };
      setServicesData(fallbackServices);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);
      
      if (response.ok) {
        const result = await response.json();
        const allTestimonials = result.data || [];
        
        if (userObj && userObj.id) {
          const currentUserId = userObj.id.toString().trim();
          
          const userTestimonials = allTestimonials.filter(t => {
            if (!t.userId) return false;
            const testimonialUserId = t.userId.toString().trim();
            return testimonialUserId === currentUserId;
          });
          
          const otherTestimonials = allTestimonials.filter(t => {
            if (!t.userId) return true;
            const testimonialUserId = t.userId.toString().trim();
            return testimonialUserId !== currentUserId;
          });
          
          setUserTestimonials(userTestimonials);
          setTestimonials(otherTestimonials);
        } else {
          setTestimonials(allTestimonials);
          setUserTestimonials([]);
        }
      }
    } catch (error) {
      // Silent fail for testimonials
    }
  };

  const createTestimonial = async (testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: {
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
      return { success: false, message: 'Network error occurred' };
    }
  };

  // Fixed updateTestimonial function
const updateTestimonial = async (testimonialId, testimonialData) => {
  try {
    // IMPORTANT: Remove any undefined or invalid fields
    const cleanData = {
      name: testimonialData.name,
      feedback: testimonialData.feedback,
      rating: testimonialData.rating || 5
    };

    const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanData), 
    });
    
    const responseText = await response.text(); 
    
    try {
      const result = JSON.parse(responseText); 
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, message: result.message };
      }
    } catch (parseError) {
      return { success: false, message: 'Invalid response from server' };
    }
  } catch (error) {
    return { success: false, message: 'Network error occurred' };
  }
};

  const deleteTestimonial = async (testimonialId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/testimonials/${testimonialId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const responseText = await response.text();
    
    try {
      const result = responseText ? JSON.parse(responseText) : {};
      
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Failed to delete' };
      }
    } catch (parseError) {
      // If delete was successful but returned empty response
      if (response.ok) {
        return { success: true };
      }
      return { success: false, message: 'Invalid response from server' };
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
        `${API_BASE_URL}/services/search/styles?query=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const apiResponse = await response.json();
        const results = apiResponse.data?.results || [];
        const dataWithIds = results.map((item, index) => ({
          ...item,
          searchId: `${item.serviceName || 'unknown'}-${item.name || item._id || index}`,
        }));
        setFilteredStyles(dataWithIds);
      } else {
        performLocalSearch(query);
      }
    } catch (error) {
      performLocalSearch(query);
    }
  };

  const performLocalSearch = (query) => {
    const servicesList = servicesData.services || servicesData.data || servicesData || [];
    
    const results = servicesList.flatMap((service) =>
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
  };

  // Optimized initialization
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setUserObj(userData);
          const userName = userData.fullName || userData.name || userData.displayName;
          setDisplayName(userName || "User");
          setUserToken(storedToken);
          
          // Load services and testimonials in parallel
          await Promise.all([
            fetchServices(),
            fetchTestimonials()
          ]);
        } else {
          navigation.replace('LoginScreen');
        }
      } catch (error) {
        navigation.replace('LoginScreen');
      } finally {
        setIsInitialLoad(false);
      }
    };

    initializeApp();
  }, [navigation]);

  useEffect(() => {
    if (userObj && !isInitialLoad) {
      fetchTestimonials();
    }
  }, [userObj]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchStyles(searchQuery);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, servicesData]);

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

  const handleServicePress = async (serviceName) => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE_URL}/services/name/${encodeURIComponent(serviceName)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      const selectedService = apiResponse.data || apiResponse;
      
      if (selectedService && selectedService.name) {
        navigation.navigate("ServiceDetailScreen", { service: selectedService });
      } else {
        Alert.alert("Service Not Found", "This service is not available yet.");
      }
      
    } catch (error) {
      Alert.alert("Error", "Failed to load service details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
      Alert.alert("Error", "Please fill in both name and feedback fields.");
      return;
    }

    const existingUserTestimonial = [...testimonials, ...userTestimonials].find(t => 
      t.userId && userObj && t.userId.toString() === userObj.id?.toString()
    );

    if (existingUserTestimonial) {
      Alert.alert(
        "Review Already Exists", 
        "You already have a testimonial. You can edit your existing review instead.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Edit Existing", 
            onPress: () => openEditModal(existingUserTestimonial)
          }
        ]
      );
      return;
    }

    setTestimonialLoading(true);

    const testimonialData = {
      name: newTestimonial.name.trim(),
      feedback: newTestimonial.feedback.trim(),
      rating: newTestimonial.rating || 5,
      userId: userObj?.id || userObj?._id,
      userEmail: userObj?.email
    };

    const result = await createTestimonial(testimonialData);

    setTestimonialLoading(false);

    if (result.success) {
      setNewTestimonial({ name: "", feedback: "", rating: 5 });
      setShowTestimonialModal(false);
      fetchTestimonials();
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

    const testimonialData = {
      name: newTestimonial.name.trim(),
      feedback: newTestimonial.feedback.trim(),
      rating: newTestimonial.rating || 5
    };

    if (userObj && userObj.id) {
      testimonialData.userId = userObj.id;
      testimonialData.userEmail = userObj.email;
    }

    const result = await updateTestimonial(editingId, testimonialData);

    setTestimonialLoading(false);

    if (result.success) {
      resetTestimonialModal();
      fetchTestimonials();
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
              fetchTestimonials();
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

  const renderTestimonialCard = (item, index, isUserTestimonial = false) => {
    return (
      <View key={item._id || index} style={[
        styles.testimonialCard,
        isUserTestimonial && styles.userTestimonialCard
      ]}>
        <View style={styles.testimonialHeader}>
          <View style={styles.testimonialUserInfo}>
            <Text style={styles.testimonialName}>{item.name}</Text>
            <Text style={styles.testimonialDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
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
                <Icon name="pencil" size={20} color="#007d3f" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteTestimonial(item._id)}
                style={styles.actionButton}
              >
                <Icon name="trash" size={20} color="#d13f3f" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.testimonialMessage}>{item.feedback}</Text>

        {isUserTestimonial && (
          <View style={styles.userBadge}>
            <Icon name="person" size={14} color="#007d3f" />
            <Text style={styles.userBadgeText}>Your Review</Text>
          </View>
        )}
      </View>
    );
  };

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
            style={[
              styles.serviceCard,
              loading && styles.serviceCardDisabled
            ]}
            onPress={() => handleServicePress(service.name)}
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.serviceImageContainer}>
              <Image
                source={{ uri: service.image }}
                style={styles.serviceImage}
                resizeMode="cover"
              />
            </View>
            
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle} numberOfLines={2}>
                {service.name}
              </Text>
              <Text style={styles.serviceDescription} numberOfLines={3}>
                {service.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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

        {userTestimonials.length > 0 && (
          <View style={styles.userTestimonialsSection}>
            <Text style={styles.sectionSubtitle}>Your Reviews</Text>
            {userTestimonials.map((item, index) => 
              renderTestimonialCard(item, index, true)
            )}
          </View>
        )}

        {testimonials.length > 0 ? (
          <View style={styles.allTestimonialsSection}>
            <Text style={styles.sectionSubtitle}>
              {userTestimonials.length > 0 ? "Other Reviews" : "Customer Reviews"}
            </Text>
            {testimonials.map((item, index) => renderTestimonialCard(item, index, false))}
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
               onImagePress={() => openImageModal(item.imageUrl || item.image)}  
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

      {renderTestimonialModal()}

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
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    paddingTop: 27,
  },
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
  servicesTitle: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 15,
    color: "#d13f3f",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    textShadowColor: 'rgba(0, 0, 0, 0.08)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 5,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 22,
    overflow: "hidden",
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
  },
  serviceCardDisabled: {
    opacity: 0.9,
  },
  serviceImageContainer: {
    height: 140,
    position: "relative",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  serviceContent: {
    paddingHorizontal: 15,
    paddingVertical: 16,
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceTitle: {
    color: "#d13f3f",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  serviceDescription: {
    color: "#555",
    fontSize: 12.5,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 4,
    fontWeight: "400",
    opacity: 0.95,
    letterSpacing: 0.2,
  },
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
  },
  // ADDED: Special styling for user's own testimonial cards
  userTestimonialCard: {
    backgroundColor: "#f0f9f4",
    borderColor: "#007d3f",
    borderWidth: 1.5,
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
  // ADDED: Debug info styles (hidden by default)
  debugInfo: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    display: 'none', // Hidden by default
  },
  debugText: {
    fontSize: 10,
    color: "#666",
    fontStyle: 'italic',
  },
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