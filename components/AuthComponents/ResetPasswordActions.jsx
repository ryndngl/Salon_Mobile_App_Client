import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ResetPasswordActions({ 
  newPassword, 
  confirmPassword, 
  loading, 
  handleResetPassword 
}) {
  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity
        style={[
          styles.button,
          (!newPassword || !confirmPassword || loading) && styles.buttonDisabled
        ]}
        onPress={handleResetPassword}
        disabled={!newPassword || !confirmPassword || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        disabled={loading}
      >
        <Text style={styles.backToLoginText}>
          Remember your password?{' '}
          <Text style={styles.backToLoginLink}>Back to Login</Text>
        </Text>
      </TouchableOpacity>
    </>
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
    letterSpacing: 0.5,
  },
  backToLoginText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 15,
  },
  backToLoginLink: {
    color: '#d13f3f',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});