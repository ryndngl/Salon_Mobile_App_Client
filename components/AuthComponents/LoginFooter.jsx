import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginFooter({ loading }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Register")}
      disabled={loading}
    >
      <Text style={styles.registerText}>
        Don't have an account?{" "}
        <Text style={styles.registerLink}>Register here.</Text>
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  registerText: {
    color: "#666",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  registerLink: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});