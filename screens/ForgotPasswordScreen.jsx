import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Success modal animation
  const [emailSentVisible, setEmailSentVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (emailSentVisible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.5);
      fadeAnim.setValue(0);
    }
  }, [emailSentVisible]);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      // Replace with your actual API endpoint
      const response = await fetch('YOUR_API_URL/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        // Show success modal
        setEmailSentVisible(true);
        
        // Auto close modal and navigate back after 3 seconds
        setTimeout(() => {
          setEmailSentVisible(false);
          navigation.goBack();
        }, 3000);
      } else {
        Alert.alert('Error', result.message || 'Failed to send reset email');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Forgot password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ImageBackground
        source={{
          uri: 'https://placehold.co/700x1200/FCE4EC/880E4F?text=Salon+Background',
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            {/* Back Button */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Ionicons name="arrow-back-outline" size={24} color="#d13f3f" />
            </TouchableOpacity>

            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleForgotPassword}
              disabled={loading || !email}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.backToLoginText}>
                Remember your password?{' '}
                <Text style={styles.backToLoginLink}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Email Sent Success Modal */}
      <Modal
        animationType="none"
        transparent={true}
        visible={emailSentVisible}
      >
        <View style={styles.successModalContainer}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={60}
              color="#4CAF50"
            />
            <Text style={styles.successText}>Email Sent!</Text>
            <Text style={styles.successSubText}>
              Please check your email for password reset instructions.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCE4EC',
  },

  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  overlay: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    borderColor: '#D4D4D4',
    elevation: 3,
    alignItems: 'center',
    position: 'relative',
  },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
    color: '#d13f3f',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },

  input: {
    width: '100%',
    height: 55,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 25,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    color: '#333',
  },

  button: {
    width: '100%',
    height: 55,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderColor: '#4CAF50',
    elevation: 1,
  },

  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },

  backToLoginText: {
    color: '#666',
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
  },

  backToLoginLink: {
    color: '#d13f3f',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  successCard: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 38,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEE',
    maxWidth: '85%',
  },

  successText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 15,
    color: '#4CAF50',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  successSubText: {
    fontSize: 15,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
});