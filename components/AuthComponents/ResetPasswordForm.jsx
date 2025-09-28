import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function ResetPasswordForm({ 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword, 
  loading 
}) {
  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        editable={!loading}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
        autoComplete="new-password"
        textContentType="newPassword"
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 25,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    color: "#333",
  },
});