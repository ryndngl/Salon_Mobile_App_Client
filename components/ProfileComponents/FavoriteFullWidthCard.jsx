import { View, Text, Image, Pressable, ScrollView, StyleSheet, Dimensions } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

export function FavoriteFullWidthCard({ 
  item, 
  isFavorite, 
  onToggleFavorite, 
  onImagePress,
  onBookPress 
}) {
  const getImageSource = (imageData) => {
    if (!imageData) return null;
    if (typeof imageData === "object" && (imageData.uri || imageData.require)) {
      return imageData;
    }
    if (typeof imageData === "string") {
      return { uri: imageData };
    }
    if (typeof imageData === "number") {
      return imageData;
    }
    return null;
  };

  return (
    <View style={styles.fullWidthCard}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 12 }}
      >
        {item.images.map((img, i) => {
          const imageSource = getImageSource(img);

          return (
            <Pressable
              key={i}
              onPress={() => onImagePress(imageSource)}
            >
              {imageSource ? (
                <Image
                  source={imageSource}
                  style={styles.footSpaImage}
                />
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
          <Text style={styles.serviceBadgeText}>
            {item?.service?.name}
          </Text>
        </View>

        <View style={styles.namePriceRow}>
          <Text style={styles.styleName}>{item?.name}</Text>
          <Text style={styles.price}>{item?.price}</Text>
        </View>

        {item?.description && (
          <Text style={styles.description}>{item?.description}</Text>
        )}

        <View style={styles.bottomRow}>
          <Pressable
            onPress={() => onToggleFavorite(item.service, item)}
            style={({ pressed }) => [
              styles.heartWrapper,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? "red" : "#555"}
            />
          </Pressable>

          <Pressable style={styles.bookNowButton} onPress={onBookPress}>
            <Text style={styles.bookNowText}>BOOK NOW</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 4,
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
});