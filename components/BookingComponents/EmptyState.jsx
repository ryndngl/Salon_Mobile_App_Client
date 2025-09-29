import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EmptyState({ selectedTab }) {
  const getMessage = () => {
    switch (selectedTab) {
      case "Upcoming":
        return "No upcoming bookings.";
      case "Cancelled":
        return "No cancelled bookings.";
      case "Completed":
        return "No completed bookings.";
      default:
        return "No bookings found.";
    }
  };

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{getMessage()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },
});