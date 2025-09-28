import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export const useLoginForm = () => {
  const navigation = useNavigation();
  const { login, setUser, setIsAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (showSuccessModal, hideSuccessModal) => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      
      console.log('Login attempt for:', email);

      const result = await login(email, password);
      console.log('Login result:', result);
         
      if (result.success) {
        showSuccessModal();

        setTimeout(() => {
          hideSuccessModal();

          setUser(result.user);
          setIsAuthenticated(true);

          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        }, 1000);
      } else {
        Alert.alert("Login Failed", result.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  };
};