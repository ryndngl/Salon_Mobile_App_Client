import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from "../context/FavoritesContext";

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

// Fallback images for services
const fallbackImages = {
  'Hair Cut': require('../assets/OurServicesImage/haircut.webp'),
  'Hair Color': require('../assets/OurServicesImage/haircolor.webp'),
  'Hair Treatment': require('../assets/OurServicesImage/hairtreatment.webp'),
  'Rebond & Forms': require('../assets/OurServicesImage/rebondandforms.webp'),
  'Nail Care': require('../assets/OurServicesImage/nailcare.webp'),
  'Foot Spa': require('../assets/OurServicesImage/footspa.webp'),
};

const ServiceDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // FIX: Provide a default empty object for route.params to prevent errors
  const { service, initialStyle } = route.params || {};

  // FIX: Add a robust check for the service object before any logic
  if (!service || !service.name || !service.styles) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>Service not found. Please go back.</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={{ marginTop: 20, padding: 10, backgroundColor: '#7a0000', borderRadius: 5 }}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isHairCut = service.name.trim().toLowerCase() === 'hair cut';
  const isHairColor = service.name.trim().toLowerCase() === 'hair color';

  const haircutCategories = ['Men', 'Women', 'Kids'];
  const hairColorCategories = ['Root Touch Up', 'Full Hair', 'Highlight', 'Balayage'];
  
  const initialCategory = isHairCut ? 'Men' : (isHairColor ? 'Root Touch Up' : null);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const filteredStyles = service.styles.filter((style) => {
    if (isHairCut || isHairColor) {
      return style.category === selectedCategory;
    }
    return true;
  });

  // FIXED: Enhanced image source handler
  const getImageSource = (imageData) => {
    // If imageData is already a require() object (number), return as is
    if (typeof imageData === 'number') {
      return imageData;
    }
    
    // If it's a string (URL from Firestore), try to match to local assets
    if (typeof imageData === 'string') {
      // Try to match the image path to a local asset
      if (imageData.includes('haircut') || imageData.includes('Haircut')) {
        if (imageData.includes('men') || imageData.includes('Men')) return fallbackImages['Hair Cut'];
        if (imageData.includes('women') || imageData.includes('Women')) return fallbackImages['Hair Cut'];
        if (imageData.includes('kids') || imageData.includes('Kids')) return fallbackImages['Hair Cut'];
        return fallbackImages['Hair Cut'];
      }
      if (imageData.includes('haircolor') || imageData.includes('Hair Color')) return fallbackImages['Hair Color'];
      if (imageData.includes('hairtreatment') || imageData.includes('Hair Treatment')) return fallbackImages['Hair Treatment'];
      if (imageData.includes('rebond') || imageData.includes('Rebond')) return fallbackImages['Rebond & Forms'];
      if (imageData.includes('nail') || imageData.includes('Nail')) return fallbackImages['Nail Care'];
      if (imageData.includes('footspa') || imageData.includes('Foot Spa')) return fallbackImages['Foot Spa'];
      
      // If no match found, use service-based fallback
      return fallbackImages[service.name] || fallbackImages['Hair Cut'];
    }
    
    // Default fallback based on service name
    return fallbackImages[service.name] || fallbackImages['Hair Cut'];
  };

  const openImageModal = (image) => {
    const imageSource = getImageSource(image);
    setSelectedImage(imageSource);
    setModalVisible(true);
  };

  const goToBooking = (style) => {
    navigation.navigate('BookingFormScreen', {
      serviceName: service.name,
      styleName: style.name,
      stylePrice: style.price,
    });
  };

  // FIXED: Better separation of foot spa package vs single image styles
  const footSpaPackage = filteredStyles.find(style => Array.isArray(style.images));
  const singleImageStyles = filteredStyles.filter(style => !Array.isArray(style.images));

  const renderCard = (style, index, forceFullWidth = false) => {
    const hasMultipleImages = Array.isArray(style.images);
    // FIX: Pass both service.name and style.name to isFavorite
    const favorite = isFavorite(service.name, style.name);
    
    // FIXED: Force full width only for foot spa package with multiple images
    const shouldUseFullWidth = hasMultipleImages || forceFullWidth;
    const cardStyle = shouldUseFullWidth ? styles.fullWidthCard : styles.card;

    return (
      <View
        key={index}
        style={cardStyle}
      >
        {hasMultipleImages ? (
          // Multiple images layout for Foot Spa Package
          <View style={styles.footSpaImagesContainer}>
            {style.images.map((img, idx) => (
              <TouchableOpacity key={idx} onPress={() => openImageModal(img)}>
                <Image 
                  source={getImageSource(img)} 
                  style={styles.footSpaImage}
                  defaultSource={fallbackImages['Foot Spa']}
                />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          // Single image layout for other services
          <TouchableOpacity onPress={() => openImageModal(style.image)}>
            <View style={styles.imageWrapper}>
              <Image 
                source={getImageSource(style.image)} 
                style={shouldUseFullWidth ? styles.fullWidthImage : styles.image}
                defaultSource={fallbackImages[service.name] || fallbackImages['Hair Cut']}
              />
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.cardContent}>
          <View style={styles.namePriceRow}>
            <Text style={styles.styleName}>{style.name}</Text>
            <Text style={styles.price}>₱{style.price}</Text>
          </View>

          {style.description && (
            <Text style={styles.description}>
              {style.description}
            </Text>
          )}

          <View style={styles.bottomRow}>
            <TouchableOpacity
             onPress={() => toggleFavorite(service, style)}
             style={styles.heartWrapper}
            >
              <Ionicons
                name={favorite ? 'heart' : 'heart-outline'}
                size={26}
                color={favorite ? 'red' : '#555'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => goToBooking(style)}
            >
              <Text style={styles.bookNowButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const categoriesToRender = isHairCut ? haircutCategories : (isHairColor ? hairColorCategories : []);

  // DEBUGGING: Add this function para ma-check mo yung data structure
  const debugServiceData = () => {
    console.log('🔍 SERVICE DEBUG INFO:');
    console.log('Service name:', service?.name);
    console.log('Service styles count:', service?.styles?.length);
    
    if (service?.styles?.length > 0) {
      console.log('First style:', service.styles[0]);
      console.log('First style image:', service.styles[0].image);
      console.log('First style images array:', service.styles[0].images);
      console.log('First style imageKey:', service.styles[0].imageKey);
      console.log('First style imageKeys:', service.styles[0].imageKeys);
    }
  };

  // Call this in useEffect para ma-debug mo
  useEffect(() => {
    if (service) {
      debugServiceData();
    }
  }, [service]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{service.name}</Text>

        {(isHairCut || isHairColor) && (
          <View style={styles.tabs}>
            {categoriesToRender.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.tabButton,
                  selectedCategory === category && styles.activeTab,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedCategory === category && styles.activeTabText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

         {isHairColor && ["Full Hair", "Highlight", "Balayage"].includes(selectedCategory) && (
        <Text style={styles.noteText}>
             Note: Prices may vary depending on hair length.
        </Text>
       )}

        {/* FIXED: Render Foot Spa Package separately with full width */}
        {footSpaPackage && (
          <View style={styles.footSpaSection}>
            {renderCard(footSpaPackage, 0, true)}
          </View>
        )}

        {/* FIXED: Render single image styles in grid layout */}
        {singleImageStyles.length > 0 && (
          <View style={styles.grid}>
            {singleImageStyles.map((style, index) => renderCard(style, index, false))}
          </View>
        )}
         
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Image
            source={selectedImage}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: 3,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7a0000',
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    color: '#7a0000',
    fontWeight: 'bold',
  },
  footSpaSection: {
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    width: cardWidth,
    overflow: 'hidden',
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#D4D4D4',
  },
  fullWidthCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    width: '100%',
    overflow: 'hidden',
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#D4D4D4',
    alignSelf: 'center',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fullWidthImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 12,
    flex: 1, 
    justifyContent: 'space-between', 
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 6,
  },
  styleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d10000',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18, 
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  heartWrapper: {
    padding: 4, 
  },
  bookNowButton: {
    backgroundColor: "#007d3f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    elevation: 1,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  footSpaImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  footSpaImage: {
    width: (screenWidth - 64) / 3,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  noteText: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    marginBottom: 17,
    textAlign: 'left',
    paddingHorizontal: 5
  },
});