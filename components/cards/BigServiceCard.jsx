import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFavorites } from "../../context/FavoritesContext";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

// Fallback images
const fallbackImages = {
  'Hair Cut': require('../../assets/OurServicesImage/haircut.webp'),
  'Hair Color': require('../../assets/OurServicesImage/haircolor.webp'),
  'Hair Treatment': require('../../assets/OurServicesImage/hairtreatment.webp'),
  'Rebond & Forms': require('../../assets/OurServicesImage/rebondandforms.webp'),
  'Nail Care': require('../../assets/OurServicesImage/nailcare.webp'),
  'Foot Spa': require('../../assets/OurServicesImage/footspa.webp'),
};

const BigServiceCard = ({ 
  service, 
  serviceName, // For search results
  styleData, 
  onPress, 
  onImagePress,
  onBookPress,
  searchCard,
  isFootSpa 
}) => {
  const { favorites, toggleFavorite } = useFavorites();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Determine the actual service name
  const actualServiceName = serviceName || service?.name || 'Hair Cut';

  const getImageSource = (imageData) => {
    if (!imageData) {
      return fallbackImages[actualServiceName] || fallbackImages['Hair Cut'];
    }

    if (typeof imageData === 'number') {
      return imageData;
    }

    if (typeof imageData === 'string') {
      if (imageData.startsWith('https://res.cloudinary.com/') || imageData.startsWith('http://') || imageData.startsWith('https://')) {
        return { uri: imageData };
      }
      if (imageData.startsWith('/images/') || imageData.startsWith('images/')) {
        return fallbackImages[actualServiceName] || fallbackImages['Hair Cut'];
      }
    }

    if (typeof imageData === 'object' && imageData.uri) {
      return imageData;
    }

    return fallbackImages[actualServiceName] || fallbackImages['Hair Cut'];
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }
  };

  const handleImagePress = () => {
    if (onImagePress) {
      onImagePress();
    }
  };

  const handleBookPress = () => {
    if (onBookPress) {
      onBookPress();
    }
  };

  const handleFavoritePress = () => {
    if (service && service._id) {
      toggleFavorite(service._id, styleData);
    } else {
      const serviceKey = actualServiceName;
      toggleFavorite(serviceKey, styleData);
    }
  };

  const isFavorite = () => {
    if (service && service._id) {
      return favorites[service._id]?.some((fav) => fav.name === styleData?.name);
    } else {
      const serviceKey = actualServiceName;
      return favorites[serviceKey]?.some((fav) => fav.name === styleData?.name);
    }
  };

  const imageSource = getImageSource(styleData?.image);

  return (
    <TouchableOpacity
      style={[styles.card, searchCard && styles.searchCard]}
      onPress={handleCardPress}
      activeOpacity={0.8}
    >
      <View style={[styles.imageWrapper, searchCard && styles.searchImageWrapper]}>
        <TouchableOpacity 
          onPress={handleImagePress} 
          style={styles.imagePressable}
        >
          <Image
            source={imageSource}
            style={[styles.image, searchCard && styles.searchImage]}
            resizeMode="cover"
            onLoadStart={handleImageLoadStart}
            onLoad={handleImageLoad}
            onError={handleImageError}
            defaultSource={fallbackImages[actualServiceName] || fallbackImages['Hair Cut']}
          />
          
          {imageLoading && (
            <View style={styles.imageLoadingOverlay}>
              <ActivityIndicator size="small" color="#7a0000" />
            </View>
          )}
          
          {imageError && (
            <View style={styles.imageErrorOverlay}>
              <Ionicons name="image-outline" size={24} color="#999" />
              <Text style={styles.imageErrorText}>Image unavailable</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.info, searchCard && styles.searchInfo]}>
        <Text style={[styles.title, searchCard && styles.searchTitle]} numberOfLines={2}>
          {styleData?.name || 'Unnamed Style'}
        </Text>
        
        {styleData?.description && (
          <Text style={styles.description} numberOfLines={2}>
            {styleData.description}
          </Text>
        )}
        
        {styleData?.price && (
          <Text style={[styles.price, searchCard && styles.searchPrice]}>₱{styleData.price}</Text>
        )}
        
        {searchCard && onBookPress && (
          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.heartIcon}
              onPress={handleFavoritePress}
            >
              <Ionicons
                name={isFavorite() ? "heart" : "heart-outline"}
                size={20}
                color={isFavorite() ? "red" : "#999"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBookPress}
            >
              <Text style={styles.bookButtonText}>BOOK NOW</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    marginHorizontal: 8,
    overflow: "hidden",
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchCard: {
    width: "100%",
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginHorizontal: 0,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    borderRadius: 8, 
  },
  searchImageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
    flexShrink: 0,
  },
  imagePressable: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: "100%",
    height: 150,
  },
  searchImage: {
    width: '100%',
    height: '100%',
  },
  imageLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(245, 245, 245, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageErrorOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imageErrorText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  info: {
    padding: 12,
    flex: 1,
  },
  searchInfo: {
    padding: 0,
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: '#1a1a1a',
    marginBottom: 4,
  },
  searchTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    color: "#d10000",
    fontWeight: '700',
    marginTop: 4,
  },
  searchPrice: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: "#d10000",
  },
  bottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heartIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  bookButton: {
    backgroundColor: '#007d3f',
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: 12, 
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default BigServiceCard;