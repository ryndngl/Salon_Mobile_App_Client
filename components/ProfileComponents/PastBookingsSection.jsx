import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function PastBookingsSection({ bookings }) {
  const handleBookAgain = (booking) => {
    // TODO: Implement book again functionality
    console.log("Book again:", booking);
  };

  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Past Bookings</Text>
      {bookings.map((booking, index) => (
        <View key={index}>
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="history" size={20} color="#666" />
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>
                  {booking.service} - {booking.date}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleBookAgain(booking)}
            >
              <Text style={styles.actionText}>Book Again</Text>
            </TouchableOpacity>
          </View>
          {index < bookings.length - 1 && (
            <View style={styles.menuDivider} />
          )}
        </View>
      ))}
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
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 48,
  },
});