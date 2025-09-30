import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function LoyaltySection({ loyaltyPoints }) {
  const handleRedeemRewards = () => {
    // TODO: Implement redeem rewards functionality
    console.log("Redeem rewards");
  };

  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Loyalty & Rewards</Text>
      <View style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Icon name="stars" size={20} color="#4CAF50" />
          <View style={styles.menuItemContent}>
            <Text style={styles.pointsText}>
              You have {loyaltyPoints} points
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.menuDivider} />
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleRedeemRewards}
      >
        <View style={styles.menuItemLeft}>
          <Icon name="redeem" size={20} color="#666" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Redeem Rewards</Text>
          </View>
        </View>
        <View style={styles.menuItemRight}>
          <Icon name="chevron-right" size={20} color="#ccc" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  pointsText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 48,
  },
});