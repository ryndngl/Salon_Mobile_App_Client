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
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualTokenMode, setManualTokenMode] = useState(false);
  const [manualToken, setManualToken] = useState('');
  
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      console.log('Sending request to:', 'http://192.168.100.6:5000/api/auth/forgot-password');
      console.log('Email:', email);

      const response = await fetch('http://192.168.100.6:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response status:', response.status);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      if (!responseText) {
        Alert.alert('Error', 'Empty response from server');
        return;
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.log('JSON Parse Error:', parseError);
        Alert.alert('Error', 'Server returned invalid response');
        return;
      }

      if (result.success) {
        setEmailSentVisible(true);
        setTimeout(() => {
          setEmailSentVisible(false);
        }, 4000);
      } else {
        Alert.alert('Error', result.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', 'Network error. Check your connection and server.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualTokenSubmit = () => {
    if (!manualToken.trim()) {
      Alert.alert('Error', 'Please enter the token from your email');
      return;
    }

    // Navigate to reset password screen with the manual token
    navigation.navigate('ResetPasswordScreen', { token: manualToken.trim() });
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
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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

              {/* Manual Token Entry Option */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {!manualTokenMode ? (
                <TouchableOpacity
                  style={styles.manualTokenButton}
                  onPress={() => setManualTokenMode(true)}
                >
                  <Ionicons name="key-outline" size={20} color="#d13f3f" />
                  <Text style={styles.manualTokenButtonText}>
                    I have a reset token
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.manualTokenSection}>
                  <Text style={styles.manualTokenLabel}>
                    Enter the token from your email:
                  </Text>
                  <TextInput
                    style={styles.tokenInput}
                    placeholder="Paste token here..."
                    placeholderTextColor="#888"
                    value={manualToken}
                    onChangeText={setManualToken}
                    multiline={true}
                    numberOfLines={3}
                  />
                  <View style={styles.tokenButtonRow}>
                    <TouchableOpacity
                      style={styles.cancelTokenButton}
                      onPress={() => {
                        setManualTokenMode(false);
                        setManualToken('');
                      }}
                    >
                      <Text style={styles.cancelTokenButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.submitTokenButton}
                      onPress={handleManualTokenSubmit}
                      disabled={!manualToken.trim()}
                    >
                      <Text style={styles.submitTokenButtonText}>Continue</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

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
        </ScrollView>
      </ImageBackground>

      {/* Enhanced Email Sent Success Modal */}
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
            <Text style={styles.successText}>Email Sent! 📧</Text>
            <Text style={styles.successSubText}>
              Check your email for reset instructions.
            </Text>
            <Text style={styles.successInstructions}>
              • Click the button in the email{'\n'}
              • Or copy and paste the token above{'\n'}
              • Link expires in 1 hour ⏰
            </Text>
            <TouchableOpacity
              style={styles.gotItButton}
              onPress={() => {
                setEmailSentVisible(false);
                setManualTokenMode(true);
              }}
            >
              <Text style={styles.gotItButtonText}>Got it!</Text>
            </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
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
    marginBottom: 20,
    elevation: 1,
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  manualTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderColor: '#d13f3f',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 25,
    width: '100%',
    justifyContent: 'center',
  },
  manualTokenButtonText: {
    marginLeft: 8,
    color: '#d13f3f',
    fontSize: 16,
    fontWeight: '600',
  },
  manualTokenSection: {
    width: '100%',
    marginBottom: 25,
  },
  manualTokenLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  tokenInput: {
    width: '100%',
    minHeight: 80,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  tokenButtonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelTokenButton: {
    flex: 1,
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelTokenButtonText: {
    color: '#666',
    fontSize: 16,
  },
  submitTokenButton: {
    flex: 1,
    height: 45,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitTokenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backToLoginText: {
    color: '#666',
    fontSize: 15,
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
    paddingVertical: 30,
    paddingHorizontal: 25,
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
  },
  successSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  successInstructions: {
    fontSize: 14,
    color: '#888',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
  gotItButton: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  gotItButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});