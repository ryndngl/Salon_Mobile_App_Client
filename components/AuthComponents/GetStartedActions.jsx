import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function GetStartedActions({ handleGetStarted }) {
  return (
    <Animatable.View animation="bounceInUp" delay={1000} style={styles.buttonWrapper}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleGetStarted}
        activeOpacity={0.8}
      >
        <View style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Get Started</Text>
          <Text style={styles.buttonArrow}>→</Text>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.bottomText}>
        Built for beautiful transformations
      </Text>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    marginTop: 40,
    alignItems: 'center',
  },
  button: {
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#d13f3f',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 15,
    backgroundColor: '#d13f3f',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
    letterSpacing: 0.5,
  },
  buttonArrow: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    fontWeight: '400',
  },
});