import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export function EmptyFavoritesView() {
  return (
    <View style={styles.emptyContent}>
      <Ionicons name="heart-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No favorites yet</Text>
      <Text style={styles.emptySubText}>
        Start adding items to your favorites by tapping the heart icon
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});