import { useState } from 'react';
import { Alert } from 'react-native';
import API_URL from '../config/api';

export const useForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTokenEntry, setShowTokenEntry] = useState(false);

  const handleForgotPassword = async (showEmailSentModal, hideEmailSentModal) => {
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

      console.log('=== SENDING REQUEST ===');
      console.log('URL:', `${API_URL}/api/auth/forgot-password`);
      console.log('Email:', email);

      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('=== RESPONSE RECEIVED ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', response.headers);
      console.log('Content-Type:', response.headers.get('content-type'));

      const responseText = await response.text();
      console.log('=== RAW RESPONSE ===');
      console.log('Raw Response Text:', responseText);
      console.log('Response Length:', responseText.length);

      if (!responseText) {
        console.log('❌ Empty response from server');
        Alert.alert('Error', 'Empty response from server');
        return;
      }

      // Check if response looks like JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.log('❌ Server returned non-JSON response');
        console.log('Content-Type:', contentType);
        console.log('Response preview:', responseText.substring(0, 200));
        Alert.alert('Error', `Server returned ${contentType || 'unknown'} instead of JSON. Check server logs.`);
        return;
      }

      let result;
      try {
        result = JSON.parse(responseText);
        console.log('✅ Successfully parsed JSON:', result);
      } catch (parseError) {
        console.log('❌ JSON Parse Error:', parseError);
        console.log('Trying to parse:', responseText.substring(0, 100));
        Alert.alert('Error', 'Server returned invalid JSON. Check server configuration.');
        return;
      }

      console.log('=== FORGOT PASSWORD DEBUG ===');
      console.log('HTTP Status:', response.status);
      console.log('Parsed Result:', result);
      console.log('result.success:', result.success);
      console.log('result.message:', result.message);
      console.log('============================');

      // Check HTTP status first
      if (!response.ok) {
        console.log('❌ HTTP Error Status:', response.status);
        Alert.alert('Error', result.message || `Server error: ${response.status}`);
        return;
      }

      if (result.success === true || result.isSuccess === true) {
        console.log('✅ SUCCESS: Showing email sent modal');
        showEmailSentModal();
        
        setTimeout(() => {
          console.log('⏰ TIMEOUT: Hiding modal and showing token entry');
          hideEmailSentModal();
          setShowTokenEntry(true);
        }, 3000);
      } else {
        console.log('❌ FAILED: Showing error alert');
        Alert.alert('Error', result.message || 'Failed to send reset email');
      }
    } catch (error) {
      console.log('❌ NETWORK ERROR:', error);
      console.log('Error name:', error.name);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      
      if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
        Alert.alert('Connection Error', 'Cannot connect to server. Please check:\n• Server is running\n• Correct IP address\n• Network connection');
      } else {
        Alert.alert('Error', `Network error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    showTokenEntry,
    setShowTokenEntry,
    handleForgotPassword,
  };
};