import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function RegisterHeader() {
  return (
    <Text style={styles.title}>Create Your Account</Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#d13f3f",
    textAlign: "center",
  },
});