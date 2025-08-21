// Add these imports at the top
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
import services from "../data/servicesData";
import BigServiceCard from "../components/cards/BigServiceCard";
import { useFavorites } from "../context/FavoritesContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenWidth = Dimensions.get("window").width;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();

  // All state variables properly defined
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStyles, setFilteredStyles] = useState([]);
  const [displayName, setDisplayName] = useState("Guest");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Use local state for services
  const [servicesData, setServicesData] = useState([]);

  // Testimonial states
  const [testimonials, setTestimonials] = useState([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    feedback: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Effects
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          
          // Extract full name from different possible fields
          const userName = userObj.fullName || userObj.name || userObj.displayName;
          
          if (userName) {
            // Use the full name instead of just first name
            setDisplayName(userName);
          } else {
            setDisplayName("User");
          }
        } else {
          setDisplayName("Guest");
        }
      } catch (error) {
        setDisplayName("Guest");
      }
    };

    loadUserData();

    // Load services from local data
    setServicesData(services);
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim() === "" || servicesData.length === 0) {
        setFilteredStyles([]);
        return;
      }

      const results = servicesData.flatMap((service) =>
        (service.styles || [])
          .filter(
            (style) =>
              style.name &&
              style.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((style) => ({
            ...style,
            serviceName: service.name,
          }))
      );

      setFilteredStyles(results);
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
      image: require("../assets/OurServicesImage/haircut.webp"),
    },
    {
      name: "Hair Color",
      image: require("../assets/OurServicesImage/haircolor.webp"),
    },
    {
      name: "Hair Treatment",
      image: require("../assets/OurServicesImage/hairtreatment.webp"),
    },
    {
      name: "Rebond & Forms",
      image: require("../assets/OurServicesImage/rebondandforms.webp"),
    },
    {
      name: "Nail Care",
      image: require("../assets/OurServicesImage/nailcare.webp"),
    },
    {
      name: "Foot Spa",
      image: require("../assets/OurServicesImage/footspa.webp"),
    },
  ];

  const handleServicePress = (serviceName) => {
    const selectedService = servicesData.find((s) => s.name === serviceName);

    if (selectedService) {
      navigation.navigate("ServiceDetailScreen", { service: selectedService });
    } else {
      Alert.alert("Service Not Found", "This service is not available yet.");
    }
  };

  // Testimonial functions
  const handleAddTestimonial = () => {
    if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
      Alert.alert("Error", "Please fill in both name and feedback fields.");
      return;
    }

    const newId = Date.now();
    const testimonialToAdd = {
      id: newId,
      name: newTestimonial.name.trim(),
      feedback: newTestimonial.feedback.trim(),
      isDefault: false,
      dateAdded: new Date().toISOString(),
    };

    setTestimonials([...testimonials, testimonialToAdd]);
    setNewTestimonial({ name: "", feedback: "" });
    setShowTestimonialModal(false);

    Alert.alert("Success", "Your testimonial has been added!");
  };

  const handleEditTestimonial = () => {
    if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
      Alert.alert("Error", "Please fill in both name and feedback fields.");
      return;
    }

    const updatedTestimonials = testimonials.map((t) =>
      t.id === editingId
        ? {
            ...t,
            name: newTestimonial.name.trim(),
            feedback: newTestimonial.feedback.trim(),
          }
        : t
    );

    setTestimonials(updatedTestimonials);
    resetTestimonialModal();
    Alert.alert("Success", "Testimonial updated successfully!");
  };

  const handleDeleteTestimonial = (id) => {
    Alert.alert(
      "Delete Testimonial",
      "Are you sure you want to delete this testimonial?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedTestimonials = testimonials.filter((t) => t.id !== id);
            setTestimonials(updatedTestimonials);
          },
        },
      ]
    );
  };

  const openEditModal = (testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      feedback: testimonial.feedback,
    });
    setEditingId(testimonial.id);
    setIsEditMode(true);
    setShowTestimonialModal(true);
  };

  const resetTestimonialModal = () => {
    setNewTestimonial({ name: "", feedback: "" });
    setShowTestimonialModal(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  // Render functions
  const renderTestimonialCard = (item, index) => (
    <View key={index} style={styles.testimonialCard}>
      <View style={styles.testimonialHeader}>
        <View style={styles.testimonialUserInfo}>
          <Text style={styles.testimonialName}>{item.name}</Text>
          <Text style={styles.testimonialDate}>
            {new Date(item.dateAdded).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.testimonialActions}>
          <TouchableOpacity
            onPress={() => openEditModal(item)}
            style={styles.actionButton}
          >
            <Icon name="pencil" size={18} color="#007d3f" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTestimonial(item.id)}
            style={styles.actionButton}
          >
            <Icon name="trash" size={18} color="#d13f3f" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.testimonialMessage}>{item.feedback}</Text>

      <View style={styles.userBadge}>
        <Icon name="person" size={12} color="#007d3f" />
        <Text style={styles.userBadgeText}>Your Review</Text>
      </View>
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

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={resetTestimonialModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={
                isEditMode ? handleEditTestimonial : handleAddTestimonial
              }
            >
              <Text style={styles.submitButtonText}>
                {isEditMode ? "Update" : "Submit"}
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
          >
            <Image
              source={service.image}
              style={styles.serviceImage}
              resizeMode="cover"
            />
            <View style={styles.serviceLabelContainer}>
              <Text style={styles.serviceText}>{service.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Enhanced Testimonials Section */}
      <View style={styles.testimonialsSection}>
        <View style={styles.testimonialTitleContainer}>
          <Text style={styles.testimonialTitle}>What Our Clients Say</Text>
          <TouchableOpacity
            style={styles.addTestimonialButton}
            onPress={() => setShowTestimonialModal(true)}
          >
            <Icon name="add-circle" size={24} color="#007d3f" />
            <Text style={styles.addTestimonialText}>Add Review</Text>
          </TouchableOpacity>
        </View>

        {testimonials.length > 0 ? (
          testimonials.map((item, index) => renderTestimonialCard(item, index))
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
            placeholder="Search styles or services..."
            placeholderTextColor="#aaa"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            style={styles.searchInput}
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
          keyExtractor={(item, index) =>
            `${item.serviceName}-${item.name}-${index}`
          }
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

            // Add fallback images
            const fallbackImages = {
              "Hair Cut": require("../assets/OurServicesImage/haircut.webp"),
              "Hair Color": require("../assets/OurServicesImage/haircolor.webp"),
              "Hair Treatment": require("../assets/OurServicesImage/hairtreatment.webp"),
              "Rebond & Forms": require("../assets/OurServicesImage/rebondandforms.webp"),
              "Nail Care": require("../assets/OurServicesImage/nailcare.webp"),
              "Foot Spa": require("../assets/OurServicesImage/footspa.webp"),
            };

            const styleWithImage = {
              ...item,
              image:
                item.image ||
                fallbackImages[item.serviceName] ||
                fallbackImages["Hair Cut"],
            };

            return (
              <BigServiceCard
                serviceName={item.serviceName}
                styleData={styleWithImage}
                onImagePress={() => openImageModal(styleWithImage.image)}
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
            <Text style={{ textAlign: "center", color: "#888", marginTop: 20 }}>
              No results found.
            </Text>
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

  // Testimonials section
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
});

export default HomeScreen;