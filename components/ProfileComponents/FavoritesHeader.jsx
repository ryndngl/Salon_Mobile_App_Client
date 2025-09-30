import { View, Text, Pressable, StyleSheet, Platform, StatusBar } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export function FavoritesHeader({ onBackPress, onClearAll, favoritesCount, isEmpty }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
      <Text style={styles.headerTitle}>
        {isEmpty ? "My Favorites" : `My Favorites (${favoritesCount})`}
      </Text>
      {!isEmpty ? (
        <Pressable onPress={onClearAll} style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </Pressable>
      ) : (
        <View style={styles.headerRight} />
      )}
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
    width: 32,
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
});