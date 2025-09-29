import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function NameInput({ name, onNameChange, nameError }) {
  return (
    <View>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={[
          styles.input,
          name !== "" && nameError && styles.invalidInput,
        ]}
        placeholder="Enter your full name"
        value={name}
        onChangeText={onNameChange}
      />
      {nameError !== "" && <Text style={styles.errorText}>{nameError}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginTop: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  invalidInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
});