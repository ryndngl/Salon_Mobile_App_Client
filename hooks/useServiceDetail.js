import { useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import { extractImages } from '../utils/imageHelper';

export const useServiceDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { service } = route.params || {};

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

  // Filter styles based on category
  const filteredStyles = service?.styles?.filter((style) => {
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
    
    // Actions
    goToBooking,
    handleToggleFavorite,
    checkIsFavorite,
    hasMultipleImages,
  };
};