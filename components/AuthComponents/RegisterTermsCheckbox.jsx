import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function RegisterTermsCheckbox({ 
  agreedToTerms, 
  setAgreedToTerms, 
  loading 
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => setAgreedToTerms(!agreedToTerms)}
      disabled={loading}
    >
      <Ionicons
        name={agreedToTerms ? "checkbox-outline" : "square-outline"}
        size={20}
        color="#d13f3f"
      />
      <Text style={styles.checkboxText}>
        I agree with the
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("TermsConditions")}
        >
          {" "}
          Terms and Conditions{" "}
        </Text>
        and
        <Text
          style={styles.linkText}
          onPress={() => navigation.navigate("PrivacyPolicy")}
        >
          {" "}
          Privacy Policy{" "}
        </Text>
        .
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: 20,
    paddingTop: 5,
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    marginLeft: 10,
    lineHeight: 20,
  },
  linkText: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});