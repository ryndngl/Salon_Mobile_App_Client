import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

// Import custom hooks
import { 
  useForgotPassword, 
  useForgotPasswordAnimation, 
  useTokenValidation 
} from '../../hooks';

// Import components
import ForgotPasswordHeader from './ForgotPasswordHeader';
import ForgotPasswordForm from './ForgotPasswordForm';
import ForgotPasswordActions from './ForgotPasswordActions';
import TokenEntryScreen from './TokenEntryScreen';
import EmailSentModal from './EmailSentModal';

export default function ForgotPasswordScreen() {
  // Custom hooks
  const {
    email,
    setEmail,
    loading,
    showTokenEntry,
    setShowTokenEntry,
    handleForgotPassword,
  } = useForgotPassword();

  const {
    emailSentVisible,
    scaleAnim,
    fadeAnim,
    showEmailSentModal,
    hideEmailSentModal,
  } = useForgotPasswordAnimation();

  const {
    manualToken,
    setManualToken,
    validatingToken,
    handleManualTokenSubmit,
  } = useTokenValidation();

  // Enhanced forgot password handler that includes animation
  const onForgotPasswordPress = () => {
    handleForgotPassword(showEmailSentModal, hideEmailSentModal);
  };

  // Show token entry screen when needed
  if (showTokenEntry) {
    return (
      <TokenEntryScreen
        manualToken={manualToken}
        setManualToken={setManualToken}
        validatingToken={validatingToken}
        setShowTokenEntry={setShowTokenEntry}
        handleManualTokenSubmit={handleManualTokenSubmit}
      />
    );
  }

  // Main forgot password screen
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <ForgotPasswordHeader loading={loading} />
          
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            loading={loading}
          />
          
          <ForgotPasswordActions
            email={email}
            loading={loading}
            handleForgotPassword={onForgotPasswordPress}
          />
        </View>
      </ScrollView>

      <EmailSentModal
        visible={emailSentVisible}
        scaleAnim={scaleAnim}
        fadeAnim={fadeAnim}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
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
    borderColor: "#D4D4D4",
    borderWidth: 1,
    padding: 30,
    elevation: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
});