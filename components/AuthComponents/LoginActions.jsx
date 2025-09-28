import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginActions({ 
  email, 
  password, 
  loading, 
  handleLogin 
}) {
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity
        onPress={() => navigation.navigate("ForgotPasswordScreen")}
        style={styles.forgotPasswordButton}
        disabled={loading}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          (!email || !password || loading) && styles.buttonDisabled
        ]}
        onPress={handleLogin}
        disabled={loading || !email || !password}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#d13f3f",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
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