import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import { extractImages } from '../utils/imageHelper';
import { servicesAPI } from '../services/servicesAPI'; // ✅ ADD THIS

export const useServiceDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();

  // Get service from params (passed by HomeScreen)
  const { service: passedService } = route.params || {};
  
  // State
  const [service, setService] = useState(passedService || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // ✅ ADD THIS

  // Service type detection
  const isHairCut = service?.name?.trim().toLowerCase() === 'hair cut';
  const isHairColor = service?.name?.trim().toLowerCase() === 'hair color';
  const isFootSpa = service?.name?.trim().toLowerCase() === 'foot spa';

  // Categories
  const haircutCategories = ['Men', 'Women', 'Kids'];
  const hairColorCategories = ['Root Touch Up', 'Full Hair', 'Highlight', 'Balayage'];
  const initialCategory = isHairCut ? 'Men' : (isHairColor ? 'Root Touch Up' : null);

  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerImageSource, setViewerImageSource] = useState(null);

 //  NEW CODE - Only set category on INITIAL mount, not on refresh
useEffect(() => {
  // Only set default category if there's no selected category yet
  if (service && !selectedCategory) {
    const newCategory = isHairCut ? 'Men' : (isHairColor ? 'Root Touch Up' : null);
    setSelectedCategory(newCategory);
  }
}, [service?.name]); // Only trigger when service NAME changes, not the whole object

  // ADD THIS - Refresh function
  const onRefresh = async () => {
    if (!service?.name) return;
    
    setRefreshing(true);
    try {
      const updatedService = await servicesAPI.getServiceByName(service.name);
      setService(updatedService);
      console.log('✅ Service refreshed successfully');
    } catch (error) {
      console.error('❌ Error refreshing service:', error);
      setError(error.message);
    } finally {
      setRefreshing(false);
    }
  };

  // Filter styles based on category AND isActive status
  const filteredStyles = service?.styles?.filter((style) => {
    // Filter out disabled styles (hide them in mobile app)
    if (style.isActive === false) {
      return false;
    }
    
    // Filter by category for Hair Cut and Hair Color
    if (isHairCut || isHairColor) {
      return style.category === selectedCategory;
    }
    
    return true;
  }) || [];

  // Image viewer handlers
  const openImageViewer = (image) => {
    const { getImageSource } = require('../utils/imageHelper');
    const imageSource = getImageSource(image, service.name);
    setViewerImageSource(imageSource);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setViewerImageSource(null);
  };

  // Navigation to booking
  const goToBooking = (style) => {
    navigation.navigate('BookingFormScreen', {
      serviceName: service.name,
      styleName: style.name,
      stylePrice: style.price,
    });
  };

  // Favorites handler
  const handleToggleFavorite = async (style) => {
    try {
      const styleObj = {
        ...style,
        ...(isFootSpa && { images: extractImages(style) })
      };
      
      await toggleFavorite(service, styleObj);
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  // Check if style is favorite
  const checkIsFavorite = (style) => {
    return isFavorite(service?.name, style.name);
  };

  // Determine categories to render
  const categoriesToRender = isHairCut ? haircutCategories : (isHairColor ? hairColorCategories : []);

  // Check if service has multiple images (for Foot Spa layout)
  const hasMultipleImages = (style) => {
    const imagesArray = extractImages(style);
    return imagesArray.length > 1;
  };

  return {
    // Service data
    service,
    loading,
    error,
    isHairCut,
    isHairColor,
    isFootSpa,
    
    // Category state
    selectedCategory,
    setSelectedCategory,
    categoriesToRender,
    
    // Filtered data
    filteredStyles,
    
    // Image viewer state
    imageViewerVisible,
    viewerImageSource,
    openImageViewer,
    closeImageViewer,
    
    // ADD THIS - Refresh state
    refreshing,
    onRefresh,
    
    // Actions
    goToBooking,
    handleToggleFavorite,
    checkIsFavorite,
    hasMultipleImages,
  };
};