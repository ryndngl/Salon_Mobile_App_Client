import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

export default function GetStartedImage() {
  return (
    <Animatable.View animation="zoomIn" delay={600} style={styles.imageFrame}>
      <Image
        source={require('../../assets/Salon Banner.webp')}
        style={styles.image}
        resizeMode="contain"
      />
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  imageFrame: {
    width: width * 0.9,
    height: height * 0.4,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginVertical: 25,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});