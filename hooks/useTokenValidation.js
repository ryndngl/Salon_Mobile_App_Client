import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API_URL from '../config/api';

export const useTokenValidation = () => {
  const navigation = useNavigation();
  const [manualToken, setManualToken] = useState('');
  const [validatingToken, setValidatingToken] = useState(false);

  const validateTokenBeforeNavigate = async (token) => {
    try {
      setValidatingToken(true);
      
      const response = await fetch(`${API_URL}/api/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token: token.trim(),
          type: 'mobile'
        }),
      });

      const result = await response.json();
      
      console.log('=== TOKEN VALIDATION DEBUG ===');
      console.log('Token being validated:', token.trim());
      console.log('Validation result:', result);
      console.log('===============================');

      if (result.success === true || result.isSuccess === true) {
        console.log('✅ Token validation successful, navigating to ResetPasswordScreen');
        return true;
      } else {
        console.log('❌ Token validation failed:', result.message);
        Alert.alert('Invalid Token', result.message || 'The token you entered is invalid or has already been used.');
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      Alert.alert('Error', 'Unable to validate token. Please check your connection.');
      return false;
    } finally {
      setValidatingToken(false);
    }
  };

  const handleManualTokenSubmit = async () => {
    if (!manualToken.trim()) {
      Alert.alert('Error', 'Please enter the token from your email');
      return;
    }

    const isValidToken = await validateTokenBeforeNavigate(manualToken.trim());
    
    if (isValidToken) {
      console.log('Navigating to ResetPasswordScreen with validated token:', manualToken.trim());
      navigation.navigate('ResetPasswordScreen', { token: manualToken.trim() });
    }
  };

  return {
    manualToken,
    setManualToken,
    validatingToken,
    handleManualTokenSubmit,
    validateTokenBeforeNavigate,
  };
};