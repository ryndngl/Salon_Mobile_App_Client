import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function DeleteAllButton({ onDeleteAll }) {
  return (
    <TouchableOpacity 
      style={styles.deleteAllButton} 
      onPress={onDeleteAll}
    >
      <Text style={styles.deleteAllText}>Delete All Cancelled</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteAllButton: {
    marginHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: "#d13f3f",
    borderRadius: 6,
    alignItems: "center",
  },
  deleteAllText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});