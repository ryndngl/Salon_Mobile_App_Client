import React from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

// Import custom hooks
import { useResetPassword, useResetPasswordAnimation } from '../../hooks';

// Import components
import ResetPasswordHeader from './ResetPasswordHeader';
import ResetPasswordForm from './ResetPasswordForm';
import ResetPasswordActions from './ResetPasswordActions';
import ResetSuccessModal from './ResetSuccessModal';

export default function ResetPasswordScreen() {
  // Custom hooks
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleResetPassword,
  } = useResetPassword();

  const {
    resetSuccessVisible,
    scaleAnim,
    fadeAnim,
    showResetSuccessModal,
    hideResetSuccessModal,
  } = useResetPasswordAnimation();

  // Enhanced reset password handler that includes animation
  const onResetPasswordPress = () => {
    handleResetPassword(showResetSuccessModal, hideResetSuccessModal);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <ResetPasswordHeader loading={loading} />
          
          <ResetPasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
          />
          
          <ResetPasswordActions
            newPassword={newPassword}
            confirmPassword={confirmPassword}
            loading={loading}
            handleResetPassword={onResetPasswordPress}
          />
        </View>
      </ScrollView>

      <ResetSuccessModal
        visible={resetSuccessVisible}
        scaleAnim={scaleAnim}
        fadeAnim={fadeAnim}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    padding: 30,
    elevation: 1.5,
    alignItems: "center",
    position: "relative",
  },
});