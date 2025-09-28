import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function GetStartedHeader() {
  return (
    <>
      {/* Welcome Section */}
      <Animatable.View animation="fadeInDown" delay={200} style={styles.welcomeSection}>
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeText}>Welcome to</Text>
        </View>
      </Animatable.View>

      {/* Brand Header */}
      <Animatable.View animation="fadeInDown" delay={400} style={styles.headerWrapper}>
        <Text style={styles.brand}>Van's Glow Up</Text>
        <Text style={styles.brandSubtext}>SALON</Text>
        <View style={styles.dividerLine} />
        <Text style={styles.tagline}>Beauty made personal</Text>
      </Animatable.View>
    </>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: 20,
  },
  welcomeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  welcomeText: {
    fontSize: 14,
    color: '#d13f3f',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brand: {
    fontSize: 42,
    fontWeight: '800',
    color: '#2c2c2c',
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  brandSubtext: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d13f3f',
    letterSpacing: 4,
    marginTop: -5,
  },
  dividerLine: {
    width: 60,
    height: 3,
    backgroundColor: '#ff6b6b',
    borderRadius: 2,
    marginVertical: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '400',
  },
});