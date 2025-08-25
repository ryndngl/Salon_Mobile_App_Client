import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFavorites } from "../../context/FavoritesContext";

const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2;

const BigServiceCard = ({ service, styleData, onPress, searchCard }) => {
  const { favorites, toggleFavorite } = useFavorites();

  // 🔑 Handle both local require() and Cloudinary URL
  const getImageSource = (img) => {
    if (typeof img === "string") {
      return { uri: img };
    }
    return img;
  };

  return (
    <TouchableOpacity
      style={[styles.card, searchCard && styles.searchCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={getImageSource(styleData.image)}
        style={[styles.image, searchCard && styles.searchImage]}
        resizeMode="cover"
      />

      <TouchableOpacity
        style={styles.heartIcon}
        onPress={() => toggleFavorite(service._id, styleData)}
      >
        <Ionicons
          name={
            favorites[service._id]?.some((fav) => fav.name === styleData.name)
              ? "heart"
              : "heart-outline"
          }
          size={22}
          color="red"
        />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title}>{styleData.name}</Text>
        {styleData.price && <Text style={styles.price}>₱{styleData.price}</Text>}
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
  },
  searchCard: {
    width: "100%",
    marginHorizontal: 0,
  },
  image: {
    width: "100%",
    height: 150,
  },
  searchImage: {
    height: 200,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    borderRadius: 20,
    padding: 5,
  },
});

export default BigServiceCard;
