import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function RegisterFooter({ loading, handleLoginRedirect }) {
  return (
    <TouchableOpacity onPress={handleLoginRedirect} disabled={loading}>
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.loginLink}>Login here.</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loginText: {
    color: "#666",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  loginLink: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});