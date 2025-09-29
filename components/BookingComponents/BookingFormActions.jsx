import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function BookingFormActions({ isFormValid, onSubmit }) {
  return (
    <TouchableOpacity
      style={[styles.button, !isFormValid && styles.buttonDisabled]}
      onPress={onSubmit}
      disabled={!isFormValid}
    >
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});