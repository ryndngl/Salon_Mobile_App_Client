// screens/ServiceDetailScreen.js
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

  const { service, initialStyle } = route.params || {};

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

  // ✅ FIXED: Smart handler for Cloudinary/local images
  const getImageSource = (imageData) => {
    if (!imageData) {
      return fallbackImages[service.name] || fallbackImages['Hair Cut'];
    }

    if (typeof imageData === 'number') {
      return imageData; // local require()
    }

    if (typeof imageData === 'string') {
      if (imageData.startsWith('http')) {
        return { uri: imageData }; // ✅ Cloudinary / Firebase URL
      }
      return fallbackImages[service.name] || fallbackImages['Hair Cut'];
    }

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

  const footSpaPackage = filteredStyles.find(style => Array.isArray(style.images));
  const singleImageStyles = filteredStyles.filter(style => !Array.isArray(style.images));

  const renderCard = (style, index, forceFullWidth = false) => {
    const hasMultipleImages = Array.isArray(style.images);
    const favorite = isFavorite(service.name, style.name);
    const shouldUseFullWidth = hasMultipleImages || forceFullWidth;
    const cardStyle = shouldUseFullWidth ? styles.fullWidthCard : styles.card;

    return (
      <View key={index} style={cardStyle}>
        {hasMultipleImages ? (
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
            <Text style={styles.description}>{style.description}</Text>
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

  useEffect(() => {
    if (service) {
      // Debugging helper if needed
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

        {footSpaPackage && (
          <View style={styles.footSpaSection}>
            {renderCard(footSpaPackage, 0, true)}
          </View>
        )}

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
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { paddingTop: 8, paddingHorizontal: 16, paddingBottom: 40 },

  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#000' 
  },

  tabs: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginBottom: 20, 
    borderBottomWidth: 1, 
    borderColor: '#eee', 
    paddingBottom: 8 
  },
  tabButton: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    borderBottomWidth: 2, 
    borderColor: 'transparent' 
  },
  activeTab: { borderColor: '#7a0000' },
  tabText: { fontSize: 16, color: '#666' },
  activeTabText: { color: '#7a0000', fontWeight: 'bold' },

  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    gap: 16,            // 🔑 dagdag spacing
    paddingBottom: 20 
  },

  card: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 20, 
    width: cardWidth, 
    overflow: 'hidden', 
    elevation: 4, 
    borderWidth: 0.5, 
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },

  fullWidthCard: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 20, 
    width: '100%', 
    overflow: 'hidden', 
    elevation: 4, 
    borderWidth: 0.5, 
    borderColor: '#E5E5E5',
    alignSelf: 'center'
  },

  imageWrapper: { 
    width: '100%', 
    aspectRatio: 1, 
    overflow: 'hidden' 
  },
  image: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  fullWidthImage: { 
    width: '100%', 
    height: 220, 
    resizeMode: 'cover' 
  },

  cardContent: { 
    padding: 14, 
    flex: 1, 
    justifyContent: 'space-between' 
  },
  namePriceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 6, 
    marginBottom: 8 
  },
  styleName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  price: { fontSize: 14, fontWeight: '700', color: '#d10000' },

  description: { fontSize: 13, color: '#555', marginTop: 4, marginBottom: 10, lineHeight: 18 },

  bottomRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',  // 🔑 para hiwalay heart at button
    alignItems: 'center', 
    marginTop: 10 
  },
  heartWrapper: { padding: 4 },
  bookNowButton: { 
    backgroundColor: "#007d3f", 
    paddingVertical: 8, 
    paddingHorizontal: 20, 
    borderRadius: 100, 
    elevation: 1, 
    alignItems: "center", 
    justifyContent: "center", 
    height: 40 
  },
  bookNowButtonText: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: 'bold', 
    letterSpacing: 0.5, 
    textTransform: 'uppercase' 
  },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  fullscreenImage: { width: '100%', height: '100%' },

  footSpaImagesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 12, 
    paddingVertical: 8, 
    paddingHorizontal: 8, 
    gap: 8 
  },
  footSpaImage: { 
    width: (screenWidth - 64) / 3, 
    height: 100, 
    borderRadius: 12, 
    resizeMode: 'cover' 
  },

  noteText: { 
    fontSize: 14, 
    color: 'red', 
    marginTop: 5, 
    marginBottom: 17, 
    textAlign: 'left', 
    paddingHorizontal: 5 
  }
});
