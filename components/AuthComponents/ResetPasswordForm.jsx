import React, { useState } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordForm({ 
  newPassword, 
  setNewPassword, 
  confirmPassword, 
  setConfirmPassword, 
  loading 
}) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#888"
          secureTextEntry={!showNewPassword}
          value={newPassword}
          onChangeText={setNewPassword}
          editable={!loading}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setShowNewPassword(!showNewPassword)}
          disabled={loading}
        >
          <Ionicons 
            name={showNewPassword ? "eye-outline" : "eye-off-outline"} 
            size={24} 
            color="#888" 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
          autoComplete="new-password"
          textContentType="newPassword"
        />
        <TouchableOpacity 
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          disabled={loading}
        >
          <Ionicons 
            name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
            size={24} 
            color="#888" 
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    position: 'relative',
    marginBottom: 25,
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingRight: 55,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
});