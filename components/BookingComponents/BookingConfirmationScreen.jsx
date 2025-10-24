import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext"; 
import { appointmentApi } from "../../api/appointmentApi"; 

const BookingConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addBooking } = useBooking();
  const { user } = useAuth(); 
  
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { bookingDetails } = route.params || {};
  const {
    name,
    serviceName,
    category,
    style,
    date,
    time,
    paymentMethod,
    price,
    totalprice,
    status,
  } = bookingDetails || {};

  // ✅ UPDATED: Handle final confirmation with conflict detection
  const handleFinalConfirm = async () => {
    try {
      setIsLoading(true);

      // Prepare appointment data
      const appointmentData = {
        clientId: user?.id || user?._id,
        clientName: user?.fullName || user?.name || name,
        email: user?.email || "N/A",
        phone: user?.phone || "N/A",
        services: [{
          name: serviceName,
          category: category || "",
          style: style || "",
          price: price || 0
        }],
        date: date,
        time: time,
        modeOfPayment: paymentMethod || "Cash on Service",
      };

      console.log("Creating appointment:", appointmentData);

      // ✅ Call API to create appointment
      const response = await appointmentApi.createAppointment(appointmentData);

      if (response.success) {
        // ✅ Success! Add to local context
        const bookingData = {
          ...response.data,
          name: appointmentData.clientName,
          serviceName,
          category,
          style,
          date,
          time,
          paymentMethod,
          price,
          totalprice,
          status: "pending",
          id: response.data?._id,
          _id: response.data?._id,
        };

        addBooking(bookingData);
        setModalVisible(false);

        // Success message
        Alert.alert(
          "Success! 🎉",
          "Your appointment has been confirmed. You will receive a notification once approved.",
          [
            {
              text: "View Bookings",
              onPress: () => {
                navigation.navigate("MainTabs", {
                  screen: "Bookings",
                  params: { refresh: true },
                });
              },
            },
          ]
        );
      } else if (response.conflict) {
        // ✅ Handle conflict - Time slot taken by another user
        setModalVisible(false);
        setIsLoading(false);
        
        Alert.alert(
          "Time Slot Unavailable ⚠️",
          `Sorry, the ${time} slot was just booked by another user. Please select a different time.`,
          [
            {
              text: "Choose Another Time",
              onPress: () => {
                // Navigate back to booking form
                navigation.navigate("BookingFormScreen", {
                  editMode: true,
                  ...bookingDetails
                });
              },
            },
          ]
        );
        return;
      } else {
        throw new Error(response.message || "Failed to create appointment");
      }
    } catch (error) {
      console.error("Booking confirmation error:", error);
      
      setModalVisible(false);
      setIsLoading(false);
      
      Alert.alert(
        "Booking Failed ❌",
        error.message || "Unable to confirm your appointment. Please try again.",
        [
          {
            text: "Try Again",
            onPress: () => setModalVisible(true),
          },
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={modalVisible ? "rgba(0,0,0,0.5)" : "#fefefe"}
        translucent={modalVisible}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fefefe" }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Booking Confirmation</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{user?.fullName || user?.name || name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.value}>{user?.email || "N/A"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{user?.phone || "N/A"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Service Name:</Text>
              <Text style={styles.value}>{serviceName}</Text>
            </View>

            {category && (
              <View style={styles.row}>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.value}>{category}</Text>
              </View>
            )}

            {style && (
              <View style={styles.row}>
                <Text style={styles.label}>Style:</Text>
                <Text style={styles.value}>{style}</Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{date}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>{time}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{paymentMethod}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>{price}</Text>
            </View>

            {totalprice && (
              <View style={styles.row}>
                <Text style={styles.label}>Total Price:</Text>
                <Text style={styles.value}>{totalprice}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => setModalVisible(true)}
            disabled={isLoading}
          >
            <Text style={styles.proceedButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Confirmation Modal */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          statusBarTranslucent
          onRequestClose={() => !isLoading && setModalVisible(false)}
        >
          <View style={styles.fullscreenModal}>
            <View style={styles.modalBox}>
              {isLoading ? (
                // Loading state
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4CAF50" />
                  <Text style={styles.loadingText}>
                    Processing your booking...
                  </Text>
                  <Text style={styles.loadingSubtext}>
                    Please wait, checking availability...
                  </Text>
                </View>
              ) : (
                // Confirmation dialog
                <>
                  <Text style={styles.modalTitle}>Confirm Payment</Text>
                  <Text style={styles.modalText}>
                    You selected <Text style={styles.boldText}>{paymentMethod}</Text> as your payment method.
                  </Text>
                  <Text style={styles.modalSubtext}>
                    Your appointment at <Text style={styles.boldText}>{time}</Text> will be reserved once confirmed.
                  </Text>
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(false)}
                      style={styles.cancelBtn}
                    >
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleFinalConfirm}
                      style={styles.confirmBtn}
                    >
                      <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#fefefe",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 200,
    marginBottom: 25,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderColor: "#D4D4D4",
    padding: 20,
    elevation: 3,
    marginBottom: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#222",
  },
  proceedButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  proceedButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 60,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    width: "100%",
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
    color: "#555",
  },
  modalSubtext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#f5f5f5",
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 12,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  cancelText: {
    color: "#666",
    fontWeight: "bold",
  },
  confirmBtn: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 6,
    minWidth: 100,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    fontWeight: "600",
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});