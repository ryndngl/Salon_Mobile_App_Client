import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function RegisterForm({ 
  fullName,
  setFullName,
  email, 
  setEmail, 
  password, 
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#888"
        autoCapitalize="words"
        value={fullName}
        onChangeText={setFullName}
        editable={!loading}
      />

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

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInputField}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={() => setShowPassword(!showPassword)}
          disabled={loading}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#888"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.passwordInputContainer}>
        <TextInput
          style={styles.passwordInputField}
          placeholder="Confirm Password"
          placeholderTextColor="#888"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />
        <TouchableOpacity
          style={styles.togglePasswordButton}
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
  input: {
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    color: "#333",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    paddingRight: 10,
  },
  passwordInputField: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
  },
  togglePasswordButton: {
    padding: 5,
  },
});