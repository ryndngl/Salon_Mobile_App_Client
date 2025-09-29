import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookingCard({ 
  item, 
  selectedTab, 
  onCancel, 
  onDelete 
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.detail}>Name: {item.name}</Text>
      <Text style={styles.detail}>Service: {item.serviceName}</Text>
      {item.category && <Text style={styles.detail}>Category: {item.category}</Text>}
      {item.style && <Text style={styles.detail}>Style: {item.style}</Text>}
      <Text style={styles.detail}>Date: {item.date}</Text>
      <Text style={styles.detail}>Time: {item.time}</Text>
      <Text style={styles.detail}>Payment Method: {item.paymentMethod}</Text>
      <Text style={styles.detail}>Price: ₱{item.price}</Text>
      {item.totalprice && <Text style={styles.detail}>Total: ₱{item.totalprice}</Text>}
      <Text style={styles.detail}>Status: {item.status}</Text>

      {/* Cancel button for upcoming bookings */}
      {selectedTab === "Upcoming" && item.status === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel(item)}
        >
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}

      {/* Delete button for cancelled bookings */}
      {selectedTab === "Cancelled" && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fcebed",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 6,
    color: "#2d3436",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#d13f3f",
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteButton: {
    marginTop: 12,
    paddingVertical: 10,
    backgroundColor: "#d13f3f",
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});