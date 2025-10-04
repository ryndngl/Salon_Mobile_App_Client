import { useState } from "react";
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
import { getImageSource, extractImages } from "../../utils/imageHelper";
import ImageView from "../../utils/ImageView";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

const BigServiceCard = ({
  service,
  serviceName,
  styleData,
  onPress,
  onBookPress,
  searchCard,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Image viewer state
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerImageSource, setViewerImageSource] = useState(null);

  const actualServiceName = serviceName || service?.name || "Hair Cut";
  const isFootSpaService = actualServiceName.toLowerCase().trim() === "foot spa";

  const handleImageLoadStart = () => setImageLoading(true);
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleCardPress = () => onPress?.();
  
  const handleImagePress = (image) => {
    const imageSource = getImageSource(image, actualServiceName);
    setViewerImageSource(imageSource);
    setImageViewerVisible(true);
  };

  const closeImageViewer = () => {
    setImageViewerVisible(false);
    setViewerImageSource(null);
  };

  const handleBookPress = () => onBookPress?.();

  const handleFavoritePress = async () => {
    const serviceObj = service || { name: actualServiceName };
    
    const styleObj = {
      ...styleData,
      ...(isFootSpaService && { images: extractImages(styleData) })
    };

    try {
      await toggleFavorite(serviceObj, styleObj);
    } catch (error) {
    }
  };

  const checkIsFavorite = () => {
    return isFavorite(actualServiceName, styleData?.name);
  };

  const imagesArray = Array.isArray(extractImages(styleData))
    ? extractImages(styleData)
    : [];
  const hasMultipleImages = imagesArray.length > 1;

  // Foot Spa multi-image layout
  if (isFootSpaService && hasMultipleImages) {
    return (
      <>
        <TouchableOpacity
          style={styles.footSpaCard}
          onPress={handleCardPress}
          activeOpacity={0.8}
        >
          <View style={styles.footSpaImagesRow}>
            {imagesArray.slice(0, 3).map((img, idx) => (
              <TouchableOpacity key={idx} onPress={() => handleImagePress(img)}>
                <Image
                  source={getImageSource(img, actualServiceName)}
                  style={styles.footSpaImage}
                  resizeMode="cover"
                  onLoadStart={handleImageLoadStart}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footSpaContent}>
            <View style={styles.footSpaNamePriceRow}>
              <Text style={styles.footSpaTitle} numberOfLines={2}>
                {styleData?.name || "Unnamed Style"}
              </Text>
              <Text style={styles.footSpaPrice}>{styleData?.price}</Text>
            </View>

            {styleData?.description && (
              <Text style={styles.footSpaDescription} numberOfLines={3}>
                {styleData.description}
              </Text>
            )}

            <View style={styles.footSpaBottomActions}>
              <TouchableOpacity
                style={styles.footSpaHeartIcon}
                onPress={handleFavoritePress}
              >
                <Ionicons
                  name={checkIsFavorite() ? "heart" : "heart-outline"}
                  size={24}
                  color={checkIsFavorite() ? "red" : "#555"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.footSpaBookButton}
                onPress={handleBookPress}
              >
                <Text style={styles.footSpaBookButtonText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </View>

          {imageLoading && (
            <View style={styles.imageLoadingOverlay}>
              <ActivityIndicator size="small" color="#7a0000" />
            </View>
          )}
        </TouchableOpacity>

        <ImageView
          visible={imageViewerVisible}
          image={viewerImageSource}
          onClose={closeImageViewer}
        />
      </>
    );
  }

  // Default layout for all other services
  const firstImage = imagesArray.length > 0 ? imagesArray[0] : styleData?.image;
  const imageSource = getImageSource(firstImage, actualServiceName);

  return (
    <>
      <TouchableOpacity
        style={[styles.card, searchCard && styles.searchCard]}
        onPress={handleCardPress}
        activeOpacity={0.8}
      >
        <View
          style={[styles.imageWrapper, searchCard && styles.searchImageWrapper]}
        >
          <TouchableOpacity onPress={() => handleImagePress(firstImage)} style={styles.imagePressable}>
            <Image
              source={imageSource}
              style={[styles.image, searchCard && styles.searchImage]}
              resizeMode="cover"
              onLoadStart={handleImageLoadStart}
              onLoad={handleImageLoad}
              onError={handleImageError}
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
          <Text
            style={[styles.title, searchCard && styles.searchTitle]}
            numberOfLines={2}
          >
            {styleData?.name || "Unnamed Style"}
          </Text>

          {styleData?.description && (
            <Text style={styles.description} numberOfLines={2}>
              {styleData.description}
            </Text>
          )}

          {styleData?.price && (
            <Text style={[styles.price, searchCard && styles.searchPrice]}>
              {styleData.price}
            </Text>
          )}

          {searchCard && onBookPress && (
            <View style={styles.bottomActions}>
              <TouchableOpacity style={styles.heartIcon} onPress={handleFavoritePress}>
                <Ionicons
                  name={checkIsFavorite() ? "heart" : "heart-outline"}
                  size={20}
                  color={checkIsFavorite() ? "red" : "#999"}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.bookButton} onPress={handleBookPress}>
                <Text style={styles.bookButtonText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>

      <ImageView
        visible={imageViewerVisible}
        image={viewerImageSource}
        onClose={closeImageViewer}
      />
    </>
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
    elevation: 2,
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
  },
  
  footSpaCard: {
    width: "100%",
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
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
  footSpaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  footSpaPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: "#d10000",
  },
  footSpaDescription: {
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
    marginBottom: 16,
  },
  footSpaBottomActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  footSpaHeartIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  footSpaBookButton: {
    backgroundColor: '#007d3f',
    paddingVertical: 12,
    paddingHorizontal: 28,
    alignItems: 'center',
    borderRadius: 100,
  },
  footSpaBookButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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
    justifyContent: 'center',
    gap: 12,
  },
  heartIcon: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  bookButton: {
    backgroundColor: '#007d3f',
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 100,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});

export default BigServiceCard;