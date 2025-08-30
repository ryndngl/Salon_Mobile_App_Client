import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function ResetPasswordScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { token } = route.params || {};

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetSuccessVisible, setResetSuccessVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (resetSuccessVisible) {
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
  }, [resetSuccessVisible]);

  const handleResetPassword = async () => {
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
      const response = await fetch(
        "http://192.168.100.6:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const result = await response.json();

      if (result.success) {
        setResetSuccessVisible(true);
        setTimeout(() => {
          setResetSuccessVisible(false);
          navigation.navigate("LoginScreen");
        }, 3000);
      } else {
        Alert.alert("Error", result.message || "Failed to reset password");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={{
          uri: "https://placehold.co/700x1200/FCE4EC/880E4F?text=Salon+Background",
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}>
            <View style={styles.card}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                disabled={loading}
              >
                <Ionicons name="arrow-back-outline" size={24} color="#d13f3f" />
              </TouchableOpacity>

              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your new password below. Make sure it's strong and secure.
              </Text>

              <TextInput
                style={styles.input}
                placeholder="New Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
              />

              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Update Password</Text>
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
        </ScrollView>
      </ImageBackground>

      <Modal animationType="none" transparent={true} visible={resetSuccessVisible}>
        <View style={styles.successModalContainer}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}
          >
            <Ionicons name="checkmark-circle-outline" size={60} color="#4CAF50" />
            <Text style={styles.successText}>Password Updated!</Text>
            <Text style={styles.successSubText}>
              You can now log in with your new password.
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
    backgroundColor: "#FCE4EC",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    borderColor: "#D4D4D4",
    elevation: 3,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 25,
    color: "#d13f3f",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 25,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    color: "#333",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderColor: "#1565C0",
    elevation: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    backgroundColor: "#FAFAFA",
    paddingVertical: 38,
    paddingHorizontal: 32,
    borderRadius: 15,
    alignItems: "center",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EEE",
    maxWidth: "85%",
  },
  successText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 15,
    color: "#4CAF50",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  successSubText: {
    fontSize: 15,
    color: "#888",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
});