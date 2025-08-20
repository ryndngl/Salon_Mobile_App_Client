import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFavorites } from "../../context/FavoritesContext";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

const BigServiceCard = ({
  serviceName,
  styleData,
  onImagePress,
  onBookPress,
  isFootSpa,
  searchCard = false,
}) => {
  const { toggleFavorite, isFavorite } = useFavorites();

  const isItemFavorite = () => {
    if (!styleData || !serviceName) return false;
    return isFavorite(serviceName, styleData.name);
  };

  const handleToggleFavorite = () => {
    if (!styleData || !serviceName) return;
    toggleFavorite({ name: serviceName }, styleData);
  };

  // ✅ Foot Spa Card
  if (isFootSpa && Array.isArray(styleData?.images)) {
    return (
      <View style={styles.fullWidthCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 }}
        >
          {styleData.images.map((img, index) => (
            <TouchableOpacity key={index} onPress={() => onImagePress?.(img)}>
              <Image source={img} style={styles.footSpaImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.cardContent}>
          <Text style={styles.styleName}>{styleData.name}</Text>
          <Text style={styles.description}>
            {styleData.description ||
              "A complete foot spa with manicure and pedicure for full relaxation."}
          </Text>
          <Text style={styles.price}>₱{styleData.price}</Text>

          <View style={styles.bottomRow}>
            {/* Heart Icon - FIXED COLOR */}
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={[styles.heartWrapper, searchCard && { paddingLeft: 0 }]}
              testID="favorite-button"
            >
              <Ionicons
                name={isItemFavorite() ? "heart" : "heart-outline"}
                size={searchCard ? 20 : 24}
                color={isItemFavorite() ? "red" : "#555"}
              />
            </TouchableOpacity>

            {/* Book Now Button */}
            <TouchableOpacity
              style={[
                styles.bookNowButton,
                searchCard && styles.searchBookButton,
              ]}
              onPress={onBookPress}
            >
              <Text style={styles.bookNowButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // ✅ Default Card
  return (
    <View style={[styles.card, searchCard && styles.searchCard]}>
      <TouchableOpacity onPress={() => onImagePress?.(styleData.image)}>
        <View
          style={[styles.imageWrapper, searchCard && styles.searchImageWrapper]}
        >
          <Image
            source={
              typeof styleData.image === "string"
                ? { uri: styleData.image }
                : styleData.image
            }
            style={[styles.image, searchCard && styles.searchImage]}
          />
        </View>
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.namePriceRow}>
          <Text
            style={[styles.styleName, searchCard && styles.searchStyleName]}
            numberOfLines={1}
          >
            {styleData?.name || "Service Name"}
          </Text>
          <Text style={[styles.price, searchCard && styles.searchPrice]}>
            ₱{styleData?.price || "0"}
          </Text>
        </View>

        {styleData?.description && (
          <Text
            style={[styles.description, searchCard && styles.searchDescription]}
            numberOfLines={searchCard ? 1 : 3}
          >
            {styleData.description}
          </Text>
        )}

        <View style={styles.bottomRow}>
          {/* Heart Icon - FIXED COLOR */}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.heartWrapper}
            testID="favorite-button"
          >
            <Ionicons
              name={isItemFavorite() ? "heart" : "heart-outline"}
              size={searchCard ? 20 : 26}
              color={isItemFavorite() ? "red" : "#555"}
            />
          </TouchableOpacity>

          {/* Book Now Button */}
          <TouchableOpacity
            style={[
              styles.bookNowButton,
              searchCard && styles.searchBookButton,
            ]}
            onPress={onBookPress}
          >
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    width: cardWidth,
    overflow: "hidden",
    elevation: 2,
    borderWidth: 0.6,
    borderColor: "#e2e2e2",
  },
  searchCard: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
  },
  fullWidthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    width: screenWidth - 32,
    padding: 12,
    overflow: "hidden",
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
    alignSelf: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
  },
  searchImageWrapper: {
    width: 95,
    height: 95,
    borderRadius: 12,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  searchImage: {
    borderRadius: 12,
  },
  footSpaImage: {
    width: (screenWidth - 64) / 3,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: "cover",
  },
  cardContent: {
    padding: 12,
    flex: 1,
  },
  namePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  styleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    flex: 1,
    marginRight: 4,
  },
  searchStyleName: {
    fontSize: 14,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#d10000",
  },
  searchPrice: {
    fontSize: 13,
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginBottom: 12,
    lineHeight: 18,
  },
  searchDescription: {
    marginBottom: 8,
    fontSize: 12,
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
  searchBookButton: {
    height: 35,
    paddingHorizontal: 12,
  },
  bookNowButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
});

export default BigServiceCard;