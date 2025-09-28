import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function GetStartedDescription() {
  return (
    <Animatable.View animation="fadeInUp" delay={800} style={styles.textContainer}>
      <Text style={styles.subtitle}>
        Step into elegance, where every detail is crafted for your glow.
      </Text>
      <Text style={styles.subDescription}>
        Discover the ultimate beauty experience tailored just for you.
      </Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  subDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
    opacity: 0.8,
  },
});