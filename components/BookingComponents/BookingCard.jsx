import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function BookingCard({ 
  item, 
  selectedTab, 
  onCancel, 
  onDelete 
}) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#f39c12';
      case 'confirmed':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      case 'completed':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'time-outline';
      case 'confirmed':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      case 'completed':
        return 'checkmark-done-circle-outline';
      default:
        return 'information-circle-outline';
    }
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.nameSection}>
          <Icon name="person" size={20} color="#7a0000" />
          <Text style={styles.name}>{item.name}</Text>
        </View>
        {/* Only show status badge if NOT in Cancelled tab */}
        {selectedTab !== "Cancelled" && (
          <Text style={[styles.statusTextOnly, { color: getStatusColor(item.status) }]}>
            {item.status}
          </Text>
        )}
      </View>

      {/* Service Section */}
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Icon name="cut-outline" size={18} color="#555" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Service</Text>
            <Text style={styles.value}>{item.serviceName}</Text>
            {item.category && (
              <Text style={styles.subValue}>Category: {item.category}</Text>
            )}
            {item.style && (
              <Text style={styles.subValue}>Style: {item.style}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Date & Time Section */}
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Icon name="calendar-outline" size={18} color="#555" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Date & Time</Text>
            <Text style={styles.value}>{item.date} • {item.time}</Text>
          </View>
        </View>
      </View>

      {/* Payment Section */}
      <View style={styles.section}>
        <View style={styles.infoRow}>
          <Icon name="card-outline" size={18} color="#555" />
          <View style={styles.infoContent}>
            <Text style={styles.label}>Payment</Text>
            <Text style={styles.value}>{item.paymentMethod}</Text>
          </View>
        </View>
        <View style={styles.priceSection}>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>{item.price}</Text>
        </View>
      </View>

      {item.totalprice && (
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>{item.totalprice}</Text>
        </View>
      )}

      {/* Action Buttons */}
      {selectedTab === "Upcoming" && item.status === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel(item)}
        >
          <Icon name="close-circle-outline" size={20} color="#fff" />
          <Text style={styles.cancelButtonText}>Cancel Booking</Text>
        </TouchableOpacity>
      )}

      {selectedTab === "Cancelled" && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(item)}
        >
          <Icon name="trash-outline" size={20} color="#fff" />
          <Text style={styles.deleteButtonText}>Delete Booking</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3436",
    marginLeft: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  section: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    color: "#2d3436",
    fontWeight: "500",
  },
  subValue: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 2,
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 30,
  },
  priceLabel: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  priceValue: {
    fontSize: 15,
    color: "#2d3436",
    fontWeight: "600",
  },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: "#2d3436",
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 18,
    color: "#7a0000",
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  deleteButton: {
    marginTop: 12,
    paddingVertical: 12,
    backgroundColor: "#c0392b",
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
});