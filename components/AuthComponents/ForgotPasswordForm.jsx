import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default function ForgotPasswordForm({ 
  email, 
  setEmail, 
  loading 
}) {
  return (
    <TextInput
      style={styles.input}
      placeholder="Email Address"
      placeholderTextColor="#888"
      keyboardType="email-address"
      autoCapitalize="none"
      value={email}
      onChangeText={setEmail}
      editable={!loading}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 55,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    color: '#333',
  },
});