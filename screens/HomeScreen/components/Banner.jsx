// screens/HomeScreen/components/Banner.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Banner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pamper Yourself Today!</Text>
      <Text style={[styles.text, styles.subtitle]}>
        Book your favorite salon service now.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d13f3f",
    height: 160,
    marginVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default Banner;