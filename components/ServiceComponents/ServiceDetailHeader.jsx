import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function ServiceDetailHeader({ serviceName }) {
  return (
    <Text style={styles.title}>{serviceName}</Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
});