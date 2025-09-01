// screens/FavoritesScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFavorites } from "../../context/FavoritesContext";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite, clearFavorites, count } = useFavorites();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // DEBUG: Log favorites data structure
  useEffect(() => {
    console.log('=== FAVORITES DEBUG ===');
    console.log('Favorites count:', count);
    console.log('Favorites array:', JSON.stringify(favorites, null, 2));
    
    if (favorites && favorites.length > 0) {
      favorites.forEach((fav, index) => {
        console.log(`\n--- Favorite ${index + 1} ---`);
        console.log('Name:', fav?.name);
        console.log('Service:', fav?.service?.name);
        console.log('Image field:', fav?.image);
        console.log('Images field:', fav?.images);
        console.log('Image type:', typeof fav?.image);
        console.log('Images type:', typeof fav?.images);
        console.log('Is images array?', Array.isArray(fav?.images));
      });
    }
  }, [favorites, count]);

  const openImageModal = (image) => {
    console.log('Opening modal with image:', image);
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Helper function to get proper image source
  const getImageSource = (imageData) => {
    console.log('Processing image data:', imageData);
    
    if (!imageData) {
      console.log('No image data provided');
      return null;
    }

    // If it's already a proper source object
    if (typeof imageData === 'object' && (imageData.uri || imageData.require)) {
      console.log('Image is already proper source object');
      return imageData;
    }

    // If it's a string URL
    if (typeof imageData === 'string') {
      console.log('Converting string URL to source object');
      return { uri: imageData };
    }

    // If it's a require statement (number)
    if (typeof imageData === 'number') {
      console.log('Image is require number');
      return imageData;
    }

    console.log('Unknown image format');
    return null;
  };

  // FIXED: Clear all favorites with confirmation
  const handleClearAll = () => {
    if (count === 0) {
      Alert.alert("No Favorites", "You don't have any favorites to clear.");
      return;
    }

    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to delete all your favorites? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              const success = await clearFavorites();
              if (success) {
                Alert.alert("Success", "All favorites have been cleared.");
              } else {
                Alert.alert("Error", "Failed to clear favorites. Please try again.");
              }
            } catch (error) {
              console.error("Error clearing favorites:", error);
              Alert.alert("Error", "An unexpected error occurred.");
            }
          },
        },
      ]
    );
  };

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </Pressable>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.emptyContent}>
          <Ionicons name="heart-outline" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubText}>
            Start adding items to your favorites by tapping the heart icon
          </Text>
        </View>
      </View>
    );
  }

  // FIXED: Properly categorize favorites based on image structure
  const multiImageFavorites = favorites.filter(
    (f) => Array.isArray(f.images) && f.images.length > 0
  );
  
  // Single image: has image field OR empty/no images array but has image
  const singleImageFavorites = favorites.filter(
    (f) => {
      const hasMultipleImages = Array.isArray(f.images) && f.images.length > 0;
      const hasSingleImage = f.image; // string URL exists
      return !hasMultipleImages && hasSingleImage;
    }
  );

  console.log('Multi-image favorites:', multiImageFavorites.length);
  console.log('Single-image favorites:', singleImageFavorites.length);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header with Clear All button */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>My Favorites ({count})</Text>
        <Pressable onPress={handleClearAll} style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Multi-image favorites (Foot Spa Package) - full width cards */}
        {multiImageFavorites.map((item, index) => {
          const favorite = isFavorite(item?.service?.name, item?.name);
          return (
            <View key={`multi-${index}`} style={styles.fullWidthCard}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 12 }}
              >
                {item.images.map((img, i) => {
                  const imageSource = getImageSource(img);
                  console.log(`Multi-image ${i}:`, imageSource);
                  
                  return (
                    <Pressable key={i} onPress={() => openImageModal(imageSource)}>
                      {imageSource ? (
                        <Image source={imageSource} style={styles.footSpaImage} />
                      ) : (
                        <View style={[styles.footSpaImage, styles.placeholderImage]}>
                          <Text style={styles.placeholderText}>No Image</Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={styles.cardContent}>
                <View style={styles.serviceBadge}>
                  <Text style={styles.serviceBadgeText}>{item?.service?.name}</Text>
                </View>
                
                <View style={styles.namePriceRow}>
                  <Text style={styles.styleName}>{item?.name}</Text>
                  <Text style={styles.price}>₱{item?.price}</Text>
                </View>

                {item?.description && (
                  <Text style={styles.description}>{item?.description}</Text>
                )}

                <View style={styles.bottomRow}>
                  <Pressable
                    onPress={() => toggleFavorite(item.service, item)}
                    style={({ pressed }) => [
                      styles.heartWrapper,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Ionicons
                      name={favorite ? "heart" : "heart-outline"}
                      size={22}
                      color={favorite ? "red" : "#555"}
                    />
                  </Pressable>
                  
                  <Pressable
                    style={styles.bookNowButton}
                    onPress={() => {
                      navigation.navigate('BookingFormScreen', {
                        serviceName: item.service?.name,
                        styleName: item.name,
                        stylePrice: item.price,
                      });
                    }}
                  >
                    <Text style={styles.bookNowText}>BOOK NOW</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })}

        {/* Single image favorites (Manicure, Pedicure, and other services) - grid cards */}
        <View style={styles.grid}>
          {singleImageFavorites.map((item, index) => {
            const favorite = isFavorite(item?.service?.name, item?.name);
            const rawImageSource = item.image || (Array.isArray(item.images) ? item.images[0] : null);
            const imageSource = getImageSource(rawImageSource);
            
            console.log(`Single-image ${index}:`, imageSource);
            
            return (
              <View key={`single-${index}`} style={styles.card}>
                <Pressable onPress={() => openImageModal(imageSource)}>
                  <View style={styles.imageWrapper}>
                    {imageSource ? (
                      <Image source={imageSource} style={styles.image} />
                    ) : (
                      <View style={[styles.image, styles.placeholderImage]}>
                        <Text style={styles.placeholderText}>No Image</Text>
                      </View>
                    )}
                  </View>
                </Pressable>

                <View style={styles.cardContent}>
                  <View style={styles.serviceBadge}>
                    <Text style={styles.serviceBadgeText}>{item?.service?.name}</Text>
                  </View>
                  
                  <View style={styles.namePriceRow}>
                    <Text style={styles.styleName}>{item?.name}</Text>
                    <Text style={styles.price}>₱{item?.price}</Text>
                  </View>

                  {item?.description && (
                    <Text style={styles.description}>{item.description}</Text>
                  )}

                  <View style={styles.bottomRow}>
                    <Pressable
                      onPress={() => toggleFavorite(item.service, item)}
                      style={({ pressed }) => [
                        styles.heartWrapper,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Ionicons
                        name={favorite ? "heart" : "heart-outline"}
                        size={24}
                        color={favorite ? "red" : "#555"}
                      />
                    </Pressable>
                    
                    <Pressable
                      style={styles.bookNowButton}
                      onPress={() => {
                        navigation.navigate('BookingFormScreen', {
                          serviceName: item.service?.name,
                          styleName: item.name,
                          stylePrice: item.price,
                        });
                      }}
                    >
                      <Text style={styles.bookNowText}>BOOK NOW</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Fullscreen Image Modal */}
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
            {selectedImage ? (
              <Image
                source={selectedImage}
                style={styles.fullscreenImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={{ color: 'white', fontSize: 18 }}>No Image Available</Text>
            )}
          </Pressable>
        </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 32, // Balance the back button
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#d13f3f",
    borderRadius: 6,
  },
  clearAllText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  container: {
    paddingTop: 3,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    color: "#777",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "500",
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    width: cardWidth,
    overflow: "hidden",
    elevation: 3,
    borderWidth: 0.5,
    borderColor: "#D4D4D4",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholderImage: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 12,
    fontWeight: "500",
  },
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
  },
  serviceBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#007d3f",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  serviceBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  namePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  styleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d10000",
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 12,
  },
  heartWrapper: {
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 20,
  },
  bookNowButton: {
    backgroundColor: "#007d3f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bookNowText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  // Multi-image specific styles (Foot Spa Package)
  fullWidthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    width: "100%",
    padding: 12,
    overflow: "hidden",
    elevation: 5,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    marginTop: 20,
  },
  footSpaImage: {
    width: (screenWidth - 64) / 3,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: "cover",
  },
});