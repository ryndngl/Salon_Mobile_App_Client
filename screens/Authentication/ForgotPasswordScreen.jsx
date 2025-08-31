import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
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
  const [showTokenEntry, setShowTokenEntry] = useState(false);
  const [manualToken, setManualToken] = useState('');

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

      const response = await fetch('http://192.168.100.6:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await response.text();

      if (!responseText) {
        Alert.alert('Error', 'Empty response from server');
        return;
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        Alert.alert('Error', 'Server returned invalid response');
        return;
      }

      if (result.success) {
        setEmailSentVisible(true);
        setTimeout(() => {
          setEmailSentVisible(false);
          setShowTokenEntry(true);
        }, 3000);
      } else {
        Alert.alert('Error', result.message || 'Failed to send reset email');
      }
    } catch (error) {
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

    navigation.navigate('ResetPasswordScreen', { token: manualToken.trim() });
  };

  if (showTokenEntry) {
    return (
      <View style={styles.tokenContainer}>
        <KeyboardAvoidingView
          style={styles.tokenKeyboard}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.tokenScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.tokenCard}>
              <TouchableOpacity
                style={styles.tokenBackButton}
                onPress={() => setShowTokenEntry(false)}
              >
                <Ionicons name="arrow-back-outline" size={24} color="#d13f3f" />
              </TouchableOpacity>

              <Text style={styles.tokenTitle}>Enter Reset Token</Text>
              <Text style={styles.tokenSubtitle}>
                Check your email and enter the token we sent you.
              </Text>

              <View style={styles.tokenInputSection}>
                <Text style={styles.tokenInputLabel}>
                  Enter the token from your email:
                </Text>
                <TextInput
                  style={styles.tokenTextInput}
                  placeholder="Paste token here..."
                  placeholderTextColor="#888"
                  value={manualToken}
                  onChangeText={setManualToken}
                  multiline={true}
                  numberOfLines={3}
                  autoFocus={true}
                />
                <View style={styles.tokenButtonRow}>
                  <TouchableOpacity
                    style={styles.cancelTokenButton}
                    onPress={() => {
                      setShowTokenEntry(false);
                      setManualToken('');
                    }}
                  >
                    <Text style={styles.cancelTokenButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.submitTokenButton,
                      !manualToken.trim() && styles.submitTokenButtonDisabled
                    ]}
                    onPress={handleManualTokenSubmit}
                    disabled={!manualToken.trim()}
                  >
                    <Text style={styles.submitTokenButtonText}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.tokenBackToLoginText}>
                  Remember your password?{' '}
                  <Text style={styles.tokenBackToLoginLink}>Back to Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
          >
            <Ionicons name="arrow-back-outline" size={24} color="#d13f3f" />
          </TouchableOpacity>

          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a reset token.
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
            style={[
              styles.button,
              (!email || loading) && styles.buttonDisabled
            ]}
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
      </ScrollView>

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
              Check your email for the reset token.
            </Text>
            <Text style={styles.successInstructions}>
              • Copy the token from your email{'\n'}
              • We'll ask you to paste it next{'\n'}
              • Token expires in 1 hour ⏰
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
    backgroundColor: '#fff', // White background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    borderColor: '#D4D4D4',
    elevation: 1.5,
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
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: 'bold',
  },
  backToLoginText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 15,
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
  tokenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tokenKeyboard: {
    flex: 1,
  },
  tokenScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  tokenCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    elevation: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  tokenBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 5,
  },
  tokenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
    color: '#d13f3f',
    textAlign: 'center',
  },
  tokenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  tokenInputSection: {
    width: '100%',
    marginBottom: 30,
  },
  tokenInputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  tokenTextInput: {
    width: '100%',
    minHeight: 100,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  tokenButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelTokenButton: {
    flex: 1,
    height: 50,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cancelTokenButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitTokenButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitTokenButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitTokenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenBackToLoginText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },
  tokenBackToLoginLink: {
    color: '#d13f3f',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});