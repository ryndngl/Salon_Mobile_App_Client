import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import API_URL from '../config/api';

export const useRegisterForm = () => {
  const navigation = useNavigation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid =
    fullName &&
    email &&
    password &&
    confirmPassword &&
    agreedToTerms &&
    !loading;

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all required information.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Password and confirmation password do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }
    if (!agreedToTerms) {
      Alert.alert(
        "Error",
        "You must agree to the Terms and Conditions and Privacy Policy to register."
      );
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      Alert.alert(
        "Success",
        `Welcome, ${fullName}! Your account has been created.`
      );
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
      console.error("Registration Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate("LoginScreen");
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    agreedToTerms,
    setAgreedToTerms,
    loading,
    isFormValid,
    handleRegister,
    handleLoginRedirect,
  };
};