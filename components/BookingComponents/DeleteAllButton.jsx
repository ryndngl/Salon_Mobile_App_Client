import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DeleteAllButton({ onDeleteAll }) {
  return (
    <TouchableOpacity 
      style={styles.deleteAllButton}
      onPress={onDeleteAll}
    >
      <Icon name="trash-outline" size={20} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteAllButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: '#d13f3f',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});