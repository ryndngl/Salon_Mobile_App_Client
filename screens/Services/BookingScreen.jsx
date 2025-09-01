import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useBooking } from "../../context/BookingContext";

const BookingScreen = () => {
  const navigation = useNavigation();
  const { bookings, setBookings } = useBooking();
  const [selectedTab, setSelectedTab] = useState("Upcoming");

  // Cancel Booking Modal
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Delete Booking Modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null); // "deleteSingle" or "deleteAll"
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // Filter bookings depende sa tab
  const filteredBookings = bookings.filter((item) => {
    if (!item.paymentMethod || !item.name || !item.date || !item.time) return false;
    if (selectedTab === "Upcoming") return item.status === "pending";
    if (selectedTab === "Cancelled") return item.status === "cancelled";
    if (selectedTab === "Completed") return item.status === "completed";
    return true;
  });

  // Cancel Booking
  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelModalVisible(true);
  };

  const confirmCancelBooking = () => {
    if (selectedBooking) {
      setBookings((prev) =>
        prev.map((b) =>
          b === selectedBooking ? { ...b, status: "cancelled" } : b
        )
      );
      setSelectedTab("Cancelled");
    }
    setCancelModalVisible(false);
    setSelectedBooking(null);
  };

  // Delete Booking
  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setActionType("deleteSingle");
    setDeleteModalVisible(true);
  };

  const handleDeleteAllCancelled = () => {
    setActionType("deleteAll");
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (actionType === "deleteSingle" && bookingToDelete) {
      setBookings((prev) => prev.filter((b) => b !== bookingToDelete));
    } else if (actionType === "deleteAll") {
      setBookings((prev) => prev.filter((b) => b.status !== "cancelled"));
    }
    setDeleteModalVisible(false);
    setBookingToDelete(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {["Upcoming", "Cancelled", "Completed"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Delete All Cancelled Button */}
      {selectedTab === "Cancelled" && filteredBookings.length > 0 && (
        <TouchableOpacity style={styles.deleteAllButton} onPress={handleDeleteAllCancelled}>
          <Text style={styles.deleteAllText}>Delete All Cancelled</Text>
        </TouchableOpacity>
      )}

      {/* Booking List */}
      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
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

              {/* Cancel button */}
              {selectedTab === "Upcoming" && item.status === "pending" && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => handleCancelBooking(item)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                </TouchableOpacity>
              )}

              {/* Delete button */}
              {selectedTab === "Cancelled" && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteBooking(item)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedTab === "Upcoming" && "No upcoming bookings."}
            {selectedTab === "Cancelled" && "No cancelled bookings."}
            {selectedTab === "Completed" && "No completed bookings."}
          </Text>
        </View>
      )}

      {/* Cancel Confirmation Modal */}
      <Modal
        visible={cancelModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to cancel your booking? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setCancelModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmCancelBooking}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                  Yes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              {actionType === "deleteSingle"
? "Are you sure you want to delete this booking? This action cannot be undone."
: "Are you sure you want to delete all cancelled bookings? This action cannot be undone."}
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  // Main container for the whole screen
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  // Header section
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#222",
  },

  // Tab navigation section
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 16,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  activeTab: {
    borderColor: "#7a0000",
  },
  tabText: {
    fontSize: 16,
    color: "#555",
  },
  activeTabText: {
    color: "#7a0000",
    fontWeight: "bold",
  },

  // List and individual card items
  list: {
    paddingBottom: 40,
  },
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

  // Buttons
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
  deleteAllButton: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: "#d13f3f",
    borderRadius: 6,
    alignItems: "center",
  },
  deleteAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  // Empty state for lists
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
  },

  // Modal (popup) styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: "#eee",
    borderRadius: 6,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#d13f3f",
  },
});