import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";

const PaymentMethodScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const route = useRoute();
  const navigation = useNavigation();

  const { bookingDetails } = route.params;

  const handleConfirm = () => {
    if (!selectedMethod) {
      Alert.alert("Please select a payment method");
      return;
    }

    const updatedBooking = {
      ...bookingDetails,
      paymentMethod: selectedMethod,
      status: "Pending",
    };

    navigation.navigate("BookingConfirmationScreen", {
      bookingDetails: updatedBooking,
    });
  };
  const paymentOptions = [
    {
      key: "GCash",
      label: "GCash",
      icon: <FontAwesome5 name="wallet" size={22} color="#6c5ce7" />,
    },
    {
      key: "Cash on Service",
      label: "Cash on Service",
      icon: <Ionicons name="cash" size={22} color="#00b894" />,
    },
    {
      key: "Credit/Debit Card",
      label: "Credit/Debit Card",
      icon: <Ionicons name="card-outline" size={22} color="#0984e3" />,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Choose Your Payment Method</Text>
        </View>
        <View style={styles.underline} />

        {paymentOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.card,
              selectedMethod === option.key && styles.cardSelected,
            ]}
            onPress={() => setSelectedMethod(option.key)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              {option.icon}
              <Text style={styles.cardText}>{option.label}</Text>
            </View>
            {selectedMethod === option.key && (
              <Ionicons name="checkmark-circle" size={22} color="#2ecc71" />
            )}
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.button} onPress={handleConfirm}>
          <Text style={styles.buttonText}>Confirm Payment Method</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 10,
    color: "#f56a79",
  },
  underline: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardSelected: {
    borderColor: "#6c5ce7",
    backgroundColor: "#f3f0ff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3436",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 30,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});