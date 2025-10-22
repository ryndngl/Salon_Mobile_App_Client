import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  TextInput,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// FIXED: Cloudinary image should be loaded as direct source
const GCASH_QR_URL = 'https://res.cloudinary.com/dyw0qxjzn/image/upload/v1761153850/Adobe_Express_-_file_ygwisf.png';

const PaymentMethodScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [amountInput, setAmountInput] = useState("");
  const [showQRModal, setShowQRModal] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();

  const { bookingDetails } = route.params;

  // Auto-set the amount from booking details price
  useEffect(() => {
    if (bookingDetails.price) {
      setAmountInput(bookingDetails.price.toString());
    }
  }, [bookingDetails.price]);

  const handleUploadProof = async () => {
    try {
      // FIXED: Correct mediaTypes syntax
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setProofOfPayment(result.assets[0].uri);
        Alert.alert("Success", "Proof of payment uploaded!");
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to upload image");
    }
  };

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert("Error", "Please select a payment method");
      return;
    }

    if (selectedMethod === "GCash") {
      if (!proofOfPayment) {
        Alert.alert("Error", "Please upload proof of payment for GCash");
        return;
      }
      if (!amountInput || parseFloat(amountInput) <= 0) {
        Alert.alert("Error", "Please enter the amount you paid");
        return;
      }
    }

    const updatedBooking = {
      ...bookingDetails,
      paymentMethod: selectedMethod,
      proofOfPayment: proofOfPayment,
      amountPaid: selectedMethod === "GCash" ? amountInput : null,
      status: "Pending",
    };

    navigation.navigate("BookingConfirmationScreen", {
      bookingDetails: updatedBooking,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Method</Text>
        </View>
        
        {/* GCash Option */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === "GCash" && styles.paymentCardSelected,
          ]}
          onPress={() => setSelectedMethod("GCash")}
          activeOpacity={0.7}
        >
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <FontAwesome5 name="wallet" size={24} color="#007DFF" />
              <Text style={styles.paymentLabel}>GCash</Text>
            </View>
            {selectedMethod === "GCash" && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </View>
        </TouchableOpacity>

        {/* GCash QR Code & Upload Section */}
        {selectedMethod === "GCash" && (
          <View style={styles.gcashSection}>
            {/* No Refund Policy Notice */}
            <View style={styles.policyNotice}>
              <Ionicons name="alert-circle" size={20} color="#FF6B6B" />
              <Text style={styles.policyText}>
                No Refund Policy: All payments are final and non-refundable
              </Text>
            </View>

            <View style={styles.qrContainer}>
              <Text style={styles.instructionText}>Scan QR Code to Pay</Text>
              <TouchableOpacity 
                onPress={() => setShowQRModal(true)}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: GCASH_QR_URL }}
                  style={styles.qrCode}
                  resizeMode="contain"
                  onError={(error) => console.log('QR Image Load Error:', error.nativeEvent.error)}
                />
              </TouchableOpacity>
              <View style={styles.tapToViewContainer}>
                <Ionicons name="expand-outline" size={16} color="#007DFF" />
                <Text style={styles.tapToViewText}>
                  Tap image to view full screen
                </Text>
              </View>
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadLabel}>
                Upload Proof of Payment <Text style={styles.required}>*</Text>
              </Text>

              {proofOfPayment ? (
                <View style={styles.uploadedContainer}>
                  <Image
                    source={{ uri: proofOfPayment }}
                    style={styles.uploadedImage}
                  />
                  <View style={styles.uploadButtonsRow}>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={handleUploadProof}
                    >
                      <Ionicons name="images-outline" size={18} color="#fff" />
                      <Text style={styles.changeButtonText}>Change</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.doneButton}
                      onPress={() => Alert.alert("Success", "Proof of payment confirmed!")}
                    >
                      <Ionicons name="checkmark-circle" size={18} color="#fff" />
                      <Text style={styles.doneButtonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.uploadButton}
                  onPress={handleUploadProof}
                >
                  <Ionicons name="cloud-upload-outline" size={32} color="#666" />
                  <Text style={styles.uploadButtonText}>
                    Tap to upload screenshot
                  </Text>
                  <Text style={styles.uploadSubtext}>
                    JPG, PNG (Max 5MB)
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Amount Input Field - AUTO DISPLAY PRICE */}
            <View style={styles.amountInputSection}>
              <Text style={styles.amountInputLabel}>
                Amount Paid <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.currencySymbol}></Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amountInput}
                  onChangeText={setAmountInput}
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          </View>
        )}

        {/* ENLARGED QR MODAL - Modal box stays same, IMAGE gets bigger */}
        <Modal
          visible={showQRModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowQRModal(false)}
        >
          <View style={styles.modalOverlay}>
            {/* Close Button - Outside the modal box */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowQRModal(false)}
              activeOpacity={0.9}
            >
              <Ionicons name="close-circle" size={40} color="#fff" />
            </TouchableOpacity>
            
            {/* Modal Content Box - SAME SIZE, but image inside is BIGGER */}
            <View style={styles.modalContentBox}>
              {/* ENLARGED QR IMAGE - Fills the entire modal box */}
              <Image 
                source={{ uri: GCASH_QR_URL }}
                style={styles.enlargedQR}
                resizeMode="contain"
                onError={(error) => console.log('Modal QR Image Load Error:', error.nativeEvent.error)}
              />
            </View>
            
            {/* Bottom Text */}
            <Text style={styles.modalText}>
              Scan with your GCash app
            </Text>
          </View>
        </Modal>

        {/* Cash on Service Option */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === "Cash on Service" && styles.paymentCardSelected,
          ]}
          onPress={() => setSelectedMethod("Cash on Service")}
          activeOpacity={0.7}
        >
          <View style={styles.paymentHeader}>
            <View style={styles.paymentInfo}>
              <Ionicons name="cash" size={24} color="#4CAF50" />
              <Text style={styles.paymentLabel}>Cash on Service</Text>
            </View>
            {selectedMethod === "Cash on Service" && (
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            )}
          </View>
        </TouchableOpacity>

        {/* Cash on Service Details - AUTO DISPLAY PRICE */}
        {selectedMethod === "Cash on Service" && (
          <View style={styles.cashSection}>
            <View style={styles.cashInfo}>
              <Ionicons name="information-circle" size={20} color="#666" />
              <Text style={styles.cashInfoText}>
                Pay directly to the service provider when they arrive
              </Text>
            </View>
            <View style={styles.amountDisplay}>
              <Text style={styles.cashLabel}>Amount to Pay:</Text>
              <Text style={styles.cashAmount}>{bookingDetails.price || 0}</Text>
            </View>
          </View>
        )}

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedMethod && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedMethod}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginLeft: 16,
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentCardSelected: {
    borderColor: "#4CAF50",
    elevation: 4,
    shadowOpacity: 0.15,
  },
  paymentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  gcashSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  policyNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B6B",
  },
  policyText: {
    flex: 1,
    fontSize: 12,
    color: "#D63031",
    marginLeft: 8,
    fontWeight: "500",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  qrCode: {
    width: 300,
    height: 300,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  tapToViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  tapToViewText: {
    fontSize: 13,
    color: "#007DFF",
    marginLeft: 6,
    fontWeight: "500",
  },
  uploadSection: {
    marginTop: 8,
  },
  uploadLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  required: {
    color: "#f44336",
  },
  uploadButton: {
    backgroundColor: "#f9f9f9",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButtonText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  uploadedContainer: {
    alignItems: "center",
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  uploadButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  changeButton: {
    backgroundColor: "#666",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  changeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  doneButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  amountInputSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  amountInputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    width: 150,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingVertical: 12,
  },
  totalAmountHint: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
    alignSelf: "flex-end",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.92)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 999,
    padding: 8,
  },

  modalContentBox: {
    width: SCREEN_WIDTH * 0.90,     
    height: SCREEN_HEIGHT * 0.70,    
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",             
    justifyContent: "center",
    alignItems: "center",
  },
  enlargedQR: {
    width: "100%",      
    height: "100%",     
  },
  modalText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 24,
    textAlign: "center",
  },
  
  cashSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cashInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  cashInfoText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 8,
    flex: 1,
  },
  amountDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cashLabel: {
    fontSize: 15,
    color: "#666",
  },
  cashAmount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#4CAF50",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default PaymentMethodScreen;