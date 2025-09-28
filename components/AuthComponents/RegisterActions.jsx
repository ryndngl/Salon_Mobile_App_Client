import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

export default function RegisterActions({ 
  isFormValid, 
  loading, 
  handleRegister 
}) {
  return (
    <TouchableOpacity
      style={[styles.button, !isFormValid && styles.buttonDisabled]}
      onPress={handleRegister}
      disabled={!isFormValid}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>Register</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
    elevation: 1,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
});