import { useMemo } from "react";
import { Alert } from "react-native";

export function useFavoritesData(favorites, clearFavorites, count) {
  // Categorize favorites into multi-image and single-image
  const { multiImageFavorites, singleImageFavorites } = useMemo(() => {
    if (!favorites || favorites.length === 0) {
      return { multiImageFavorites: [], singleImageFavorites: [] };
    }

    // Multi-image: Items with images array that has MORE THAN 1 image
    const multiImage = favorites.filter(
      (f) => Array.isArray(f.images) && f.images.length > 1
    );

    // Single-image: Items with either:
    // 1. images array with exactly 1 item, OR
    // 2. single image property (no array)
    const singleImage = favorites.filter((f) => {
      const hasMultipleImages = Array.isArray(f.images) && f.images.length > 1;
      const hasSingleImageInArray = Array.isArray(f.images) && f.images.length === 1;
      const hasSingleImage = f.image;
      
      return !hasMultipleImages && (hasSingleImageInArray || hasSingleImage);
    });

    return { multiImageFavorites: multiImage, singleImageFavorites: singleImage };
  }, [favorites]);

  // Handle clear all with confirmation
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
                Alert.alert(
                  "Error",
                  "Failed to clear favorites. Please try again."
                );
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

  return {
    multiImageFavorites,
    singleImageFavorites,
    handleClearAll,
  };
}