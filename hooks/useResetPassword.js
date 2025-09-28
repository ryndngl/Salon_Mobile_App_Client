import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import API_URL from '../config/api';

export const useResetPassword = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { token } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (showResetSuccessModal, hideResetSuccessModal) => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });
      const result = await response.json();

      console.log('=== RESET PASSWORD DEBUG ===');
      console.log('Response:', result);
      console.log('Success field:', result.success);
      console.log('isSuccess field:', result.isSuccess);
      console.log('============================');

      if (result.success === true || result.isSuccess === true) {
        console.log('SUCCESS: Password reset successful');
        
        setNewPassword("");
        setConfirmPassword("");
        
        showResetSuccessModal();
        
        setTimeout(() => {
          hideResetSuccessModal();
          
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                { name: 'LoginScreen' },
              ],
            })
          );
        }, 3000); 

      } else {
        console.log('FAILED: Password reset failed');
        Alert.alert("Error", result.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleResetPassword,
  };
};