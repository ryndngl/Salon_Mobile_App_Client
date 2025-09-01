// screens/ServiceDetailScreen.js
import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFavorites } from "../../context/FavoritesContext";
import { extractImages, getImageSource } from "../../utils/imageHelper";
import ImageView from "../../utils/ImageView";

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

const ServiceDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { service } = route.params || {};

  if (!service || !service.name || !service.styles) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16 }}>Service not found. Please go back.</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 20, padding: 10, backgroundColor: '#7a0000', borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isHairCut = service.name.trim().toLowerCase() === 'hair cut';
  const isHairColor = service.name.trim().toLowerCase() === 'hair color';
  const isFootSpa = service.name.trim().toLowerCase() === 'foot spa';

  const haircutCategories = ['Men', 'Women', 'Kids'];
  const hairColorCategories = ['Root Touch Up', 'Full Hair', 'Highlight', 'Balayage'];
  const initialCategory = isHairCut ? 'Men' : (isHairColor ? 'Root Touch Up' : null);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Image viewer state
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerImageSource, setViewerImageSource] = useState(null);

  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredStyles = service.styles.filter((style) => {
    if (isHairCut || isHairColor) {
      return style.category === selectedCategory;
    }
    return true;
  });

  const openImageViewer = (image) => {
    const imageSource = getImageSource(image, service.name);
    setViewerImageSource(imageSource);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setViewerImageSource(null);
  };

  const goToBooking = (style) => {
    navigation.navigate('BookingFormScreen', {
      serviceName: service.name,
      styleName: style.name,
      stylePrice: style.price,
    });
  };

  // FIXED: Proper favorites handling
  const handleToggleFavorite = async (style) => {
    try {
      // Create proper style object with images for Foot Spa
      const styleObj = {
        ...style,
        // Ensure we have extracted images properly for multi-image services
        ...(isFootSpa && { images: extractImages(style) })
      };
      
      await toggleFavorite(service, styleObj);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const renderCard = (style, index) => {
    const imagesArray = extractImages(style);
    const hasMultipleImages = imagesArray.length > 1;
    // FIXED: Use correct parameters for isFavorite check
    const favorite = isFavorite(service.name, style.name);

    // Special layout for Foot Spa
    if (isFootSpa && hasMultipleImages) {
      return (
        <View key={index} style={styles.footSpaCard}>
          <View style={styles.footSpaImagesRow}>
            {imagesArray.slice(0, 3).map((img, idx) => {
              const imageSource = getImageSource(img, service.name);
              return (
                <TouchableOpacity key={idx} onPress={() => openImageViewer(img)}>
                  <Image source={imageSource} style={styles.footSpaImage} />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footSpaContent}>
            <View style={styles.footSpaNamePriceRow}>
              <Text style={styles.footSpaStyleName} numberOfLines={2}>{style.name}</Text>
              <Text style={styles.footSpaPrice}>₱{style.price}</Text>
            </View>

            {style.description && (
              <Text style={styles.footSpaDescription} numberOfLines={3}>{style.description}</Text>
            )}

            <View style={styles.footSpaBottomRow}>
              <TouchableOpacity onPress={() => handleToggleFavorite(style)} style={styles.footSpaHeartWrapper}>
                <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={24} color={favorite ? 'red' : '#555'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.footSpaBookNowButton} onPress={() => goToBooking(style)}>
                <Text style={styles.footSpaBookNowButtonText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    // Default card
    const firstImage = imagesArray[0];
    const imageSource = getImageSource(firstImage, service.name);
    
    return (
      <View key={index} style={styles.card}>
        <TouchableOpacity onPress={() => openImageViewer(firstImage)}>
          <View style={styles.imageWrapper}>
            <Image source={imageSource} style={styles.image} />
          </View>
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.namePriceRow}>
            <Text style={styles.styleName}>{style.name}</Text>
            <Text style={styles.price}>₱{style.price}</Text>
          </View>

          {style.description && (
            <Text style={styles.description}>{style.description}</Text>
          )}

          <View style={styles.bottomRow}>
            <TouchableOpacity onPress={() => handleToggleFavorite(style)} style={styles.heartWrapper}>
              <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={24} color={favorite ? 'red' : '#555'} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookNowButton} onPress={() => goToBooking(style)}>
              <Text style={styles.bookNowButtonText}>BOOK NOW</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const categoriesToRender = isHairCut ? haircutCategories : (isHairColor ? hairColorCategories : []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{service.name}</Text>

        {(isHairCut || isHairColor) && (
          <View style={styles.tabs}>
            {categoriesToRender.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.tabButton, selectedCategory === category && styles.activeTab]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.tabText, selectedCategory === category && styles.activeTabText]}>
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

        <View style={styles.grid}>
          {filteredStyles.map((style, index) => renderCard(style, index))}
        </View>
      </ScrollView>

      {/* Centralized Image Viewer Modal */}
      <ImageView
        visible={imageViewerVisible}
        image={viewerImageSource}
        onClose={closeImageViewer}
      />
    </SafeAreaView>
  );
};

export default ServiceDetailScreen;

const styles = StyleSheet.create({
  /* --- Screen Layout --- */
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  
  /* --- Header --- */
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  
  /* --- Category Tabs --- */
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7a0000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#7a0000',
    fontWeight: 'bold',
  },
  
  /* --- Grid and Cards --- */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    width: cardWidth,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  
  /* --- Regular Images --- */
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
  
  /* --- Card Content --- */
  cardContent: {
    padding: 14,
    flex: 1,
    justifyContent: 'space-between',
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
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
  
  /* --- Bottom Row (Heart & Book Button) - CENTERED --- */
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  heartWrapper: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  bookNowButton: {
    backgroundColor: '#007d3f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  /* --- FOOT SPA SPECIFIC STYLES --- */
  footSpaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    padding: 16,
  },
  footSpaImagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    paddingHorizontal: 8,
  },
  footSpaImage: {
    width: (screenWidth - 96) / 3,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  footSpaContent: {
    flex: 1,
  },
  footSpaNamePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  footSpaStyleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  footSpaPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d10000',
  },
  footSpaDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 16,
  },
  footSpaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  footSpaHeartWrapper: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  footSpaBookNowButton: {
    backgroundColor: '#007d3f',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footSpaBookNowButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  
  /* --- Other Styles --- */
  noteText: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    marginBottom: 17,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
});