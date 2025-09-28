import React from 'react';
import { View, StyleSheet, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function GetStartedBackground() {
  return (
    <>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Background with solid color */}
      <View style={styles.backgroundGradient} />

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />
    </>
  );
}

const styles = StyleSheet.create({
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#ff6b6b',
    opacity: 0.1,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ffd93d',
    opacity: 0.15,
  },
  decorativeCircle3: {
    position: 'absolute',
    top: height * 0.3,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6bcf7f',
    opacity: 0.1,
  },
});