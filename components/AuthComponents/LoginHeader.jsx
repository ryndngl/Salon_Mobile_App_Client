import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function LoginHeader() {
  return (
    <Text style={styles.title}>Login to Your Salon Account</Text>
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