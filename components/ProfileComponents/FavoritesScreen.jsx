import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useFavorites } from "../../context/FavoritesContext";
import { useNavigation } from "@react-navigation/native";

// I-change to NAMED IMPORTS (with curly braces)
import { FavoritesHeader } from "./FavoritesHeader";
import { EmptyFavoritesView } from "./EmptyFavoritesView";
import { FavoriteCard } from "./FavoriteCard";
import { FavoriteFullWidthCard } from "./FavoriteFullWidthCard";
import { ImageModal } from "./ImageModal";

// Hooks - From hooks folder
import { useImageModal, useFavoritesData } from "../../hooks";

export default function FavoritesScreen() {
  const navigation = useNavigation();
  const { favorites, toggleFavorite, isFavorite, clearFavorites, count } = useFavorites();

  // Custom hooks
  const { modalVisible, selectedImage, openImageModal, closeImageModal } = useImageModal();
  const { multiImageFavorites, singleImageFavorites, handleClearAll } = useFavoritesData(
    favorites,
    clearFavorites,
    count
  );

  // DEBUG: Log favorites data structure
  useEffect(() => {
    if (favorites && favorites.length > 0) {
      favorites.forEach((fav, index) => {});
    }
  }, [favorites, count]);

  const isEmpty = !favorites || favorites.length === 0;

  // Handle navigation to booking
  const handleBookPress = (item) => {
    navigation.navigate("BookingFormScreen", {
      serviceName: item.service?.name,
      styleName: item.name,
      stylePrice: item.price,
    });
  };

  if (isEmpty) {
    return (
      <View style={styles.emptyContainer}>
        <FavoritesHeader
          onBackPress={() => navigation.goBack()}
          onClearAll={handleClearAll}
          favoritesCount={count}
          isEmpty={true}
        />
        <EmptyFavoritesView />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FavoritesHeader
        onBackPress={() => navigation.goBack()}
        onClearAll={handleClearAll}
        favoritesCount={count}
        isEmpty={false}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {/* Multi-image favorites (Foot Spa Package) - full width cards */}
        {multiImageFavorites.map((item, index) => {
          const favorite = isFavorite(item?.service?.name, item?.name);
          return (
            <FavoriteFullWidthCard
              key={`multi-${index}`}
              item={item}
              isFavorite={favorite}
              onToggleFavorite={toggleFavorite}
              onImagePress={openImageModal}
              onBookPress={() => handleBookPress(item)}
            />
          );
        })}

        {/* Single image favorites (Manicure, Pedicure, etc) - grid cards */}
        <View style={styles.grid}>
          {singleImageFavorites.map((item, index) => {
            const favorite = isFavorite(item?.service?.name, item?.name);
            return (
              <FavoriteCard
                key={`single-${index}`}
                item={item}
                isFavorite={favorite}
                onToggleFavorite={toggleFavorite}
                onImagePress={openImageModal}
                onBookPress={() => handleBookPress(item)}
              />
            );
          })}
        </View>
      </ScrollView>

      <ImageModal
        visible={modalVisible}
        imageSource={selectedImage}
        onClose={closeImageModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingTop: 3,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
});

      