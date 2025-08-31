// screens/FavoritesScreen.js
import React, { useState } from "react";
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
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFavorites } from "../../context/FavoritesContext";
import { useNavigation } from "@react-navigation/native";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
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
        </View>

        <Text style={styles.emptyText}>No favorites yet</Text>
      </View>
    );
  }

  // FIXED: Separate based on images array vs single image, not service name
  const multiImageFavorites = favorites.filter(
    (f) => Array.isArray(f.images) && f.images.length > 0
  );
  const singleImageFavorites = favorites.filter(
    (f) => !Array.isArray(f.images) && f.image
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>My Favorites</Text>
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
                {item.images.map((img, i) => (
                  <Pressable key={i} onPress={() => openImageModal(img)}>
                    <Image source={img} style={styles.footSpaImage} />
                  </Pressable>
                ))}
              </ScrollView>

              <View style={styles.cardContent}>
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
                </View>
              </View>
            </View>
          );
        })}

        {/* Single image favorites (Manicure, Pedicure, and other services) - grid cards */}
        <View style={styles.grid}>
          {singleImageFavorites.map((item, index) => {
            const favorite = isFavorite(item?.service?.name, item?.name);
            return (
              <View key={`single-${index}`} style={styles.card}>
                <Pressable onPress={() => openImageModal(item.image)}>
                  <View style={styles.imageWrapper}>
                    <Image source={item.image} style={styles.image} />
                  </View>
                </Pressable>

                <View style={styles.cardContent}>
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
            <Image
              source={selectedImage}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
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
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 8 : 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
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
  emptyText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
    marginTop: 40,
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
  cardContent: {
    padding: 12,
    flex: 1,
    justifyContent: "space-between",
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
    gap: 6,
  },
  heartWrapper: {
    padding: 4,
    backgroundColor: "transparent",
    borderRadius: 20,
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