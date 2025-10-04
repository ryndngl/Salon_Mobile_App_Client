// hooks/useHomeScreen.js
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../context/FavoritesContext';
import { useApi } from './useApi';
import { useTestimonials } from './useTestimonials';

import API_URL from '../config/api';
const API_BASE_URL = API_URL.replace("/api", "") + "/api";

export const useHomeScreen = () => {
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();
  
  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStyles, setFilteredStyles] = useState([]);
  
  // User states
  const [displayName, setDisplayName] = useState("");
  const [userToken, setUserToken] = useState(null);
  const [userObj, setUserObj] = useState(null);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Custom hooks
  const { 
    servicesData, 
    fetchServices, 
    searchStyles 
  } = useApi();
  
  const {
    testimonials,
    userTestimonials,
    showTestimonialModal,
    testimonialModalProps,
    fetchTestimonials
  } = useTestimonials(userObj);

  // Initialize app
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

          await fetchServices();
          setTimeout(async () => {
            await fetchTestimonials();
          }, 100);
        } else {
          navigation.replace("LoginScreen");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        navigation.replace("LoginScreen");
      } finally {
        setIsInitialLoad(false);
      }
    };

    initializeApp();
  }, [navigation]);

  // Search effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      searchStyles(searchQuery).then(setFilteredStyles);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, servicesData]);

  // Handlers
 const handleServicePress = async (serviceName) => {
  try {
    setLoading(true);
    
    const response = await fetch(
      `${API_BASE_URL}/services/name/${encodeURIComponent(serviceName)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiResponse = await response.json();
    const selectedService = apiResponse.data || apiResponse;

    // ADD THIS DEBUG LOG
    console.log('=== SERVICE DATA ===');
    console.log('Service name:', selectedService.name);
    console.log('Has categories:', !!selectedService.categories);
    console.log('Categories count:', selectedService.categories?.length);
    console.log('Full service:', JSON.stringify(selectedService, null, 2));
    console.log('==================');

    if (selectedService && selectedService.name) {
      navigation.navigate("ServiceDetailScreen", {
        service: selectedService,
      });
    } else {
      Alert.alert("Service Not Found", "This service is not available yet.");
    }
  } catch (error) {
    console.error('Error details:', error); // ADD THIS TOO
    Alert.alert("Error", "Failed to load service details. Please try again.");
  } finally {
    setLoading(false);
  }
};
  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    Keyboard.dismiss();
  };

  return {
    // Search related
    searchQuery,
    setSearchQuery,
    filteredStyles,
    handleClearSearch,
    
    // Modal states
    modalVisible,
    setModalVisible,
    selectedImage,
    
    // Other states
    loading,
    displayName,
    servicesData,
    userObj,
    
    // Handlers
    handleServicePress,
    openImageModal,
  };
};