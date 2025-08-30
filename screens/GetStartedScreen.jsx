import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');

const GetStartedScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Background with solid color */}
      <View style={styles.backgroundGradient} />

      {/* Decorative Elements */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
      <View style={styles.decorativeCircle3} />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
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

        {/* Main Image with Frame */}
        <Animatable.View animation="zoomIn" delay={600} style={styles.imageFrame}>
          <Image
            source={require('../assets/Salon Banner.webp')}
            style={styles.image}
            resizeMode="contain"
          />
        </Animatable.View>

        {/* Description */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.textContainer}>
          <Text style={styles.subtitle}>
            Step into elegance, where every detail is crafted for your glow.
          </Text>
          <Text style={styles.subDescription}>
            Discover the ultimate beauty experience tailored just for you.
          </Text>
        </Animatable.View>

        {/* Get Started Button */}
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

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 25,
  },
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
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
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
  bottomSpacing: {
    height: 30,
  },
});