// screens/LoginScreen.js 
import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Modal,
  Pressable,
  Animated,
  Easing,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Firebase imports
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [loginSuccessVisible, setLoginSuccessVisible] = useState(false);

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loginSuccessVisible) {
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
  }, [loginSuccessVisible]);

  const auth = getAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User logged in:", user.email);
      setLoginSuccessVisible(true);
      setTimeout(() => {
        setLoginSuccessVisible(false);
        navigation.replace("MainTabs");
      }, 2000);
    } catch (error) {
      let userFriendlyMessage = "An unexpected error occurred. Please try again.";
      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
          userFriendlyMessage = "Incorrect email or password.";
          break;
        case "auth/user-disabled":
          userFriendlyMessage = "Your account has been disabled.";
          break;
        case "auth/invalid-email":
          userFriendlyMessage = "The email address is invalid.";
          break;
        case "auth/network-request-failed":
          userFriendlyMessage = "No internet connection.";
          break;
        default:
          userFriendlyMessage = "Login failed. " + error.message;
      }
      Alert.alert("Login Error", userFriendlyMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterRedirect = () => {
    navigation.navigate("Register");
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordModal(true);
    setForgotPasswordEmail(email);
  };

  const sendResetEmail = async () => {
    if (!forgotPasswordEmail) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsSendingPasswordReset(true);
    try {
      await sendPasswordResetEmail(auth, forgotPasswordEmail);
      Alert.alert("Password Reset", `A reset link was sent to ${forgotPasswordEmail}`);
      setShowForgotPasswordModal(false);
      setForgotPasswordEmail("");
    } catch (error) {
      let userFriendlyMessage = "Failed to send password reset email.";
      switch (error.code) {
        case "auth/invalid-email":
          userFriendlyMessage = "The email address is not valid.";
          break;
        case "auth/user-not-found":
          userFriendlyMessage = "No user found with this email.";
          break;
        case "auth/network-request-failed":
          userFriendlyMessage = "No internet connection.";
          break;
        default:
          userFriendlyMessage = `Error: ${error.message}`;
      }
      Alert.alert("Password Reset Error", userFriendlyMessage);
    } finally {
      setIsSendingPasswordReset(false);
    }
  };

  const anyLoading = isLoggingIn || isSendingPasswordReset;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ImageBackground
        source={{ uri: "https://placehold.co/700x1200/FCE4EC/880E4F?text=Salon+Background" }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Login to Your Salon Account</Text>

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!anyLoading}
            />

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!anyLoading}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={anyLoading}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
              disabled={anyLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={anyLoading}
            >
              {isLoggingIn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log In</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRegisterRedirect}
              disabled={anyLoading}
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerLink}>Register here.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      {/* Forgot Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showForgotPasswordModal}
        onRequestClose={() => setShowForgotPasswordModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowForgotPasswordModal(false)}
        >
          <View
            style={styles.modalContent}
            onStartShouldSetResponder={() => true}
          >
            <Text style={styles.modalTitle}>Reset Password</Text>
            <Text style={styles.modalDescription}>
              Enter your email address to receive a password reset link.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={forgotPasswordEmail}
              onChangeText={setForgotPasswordEmail}
              editable={!isSendingPasswordReset}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={sendResetEmail}
              disabled={isSendingPasswordReset}
            >
              {isSendingPasswordReset ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setShowForgotPasswordModal(false)}
              disabled={isSendingPasswordReset}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Login Success Modal with Animation */}
      <Modal animationType="none" transparent={true} visible={loginSuccessVisible}>
        <View style={styles.successModalContainer}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}
          >
            <Image
              source={{ uri: "https://img.icons8.com/color/96/ok--v1.png" }}
              style={{ width: 60, height: 60 }}
            />
            <Text style={styles.successText}>Login Successful</Text>
            <Text style={styles.successSubText}>Redirecting...</Text>
          </Animated.View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FCE4EC" },
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
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#d13f3f",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    fontSize: 16,
    color: "#333",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 55,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F8F8F8",
    paddingRight: 10,
  },
  passwordInputField: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 20,
    fontSize: 16,
    color: "#333",
  },
  togglePasswordButton: { padding: 5 },
  forgotPasswordButton: { alignSelf: "flex-end", marginBottom: 20 },
  forgotPasswordText: {
    color: "#d13f3f",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
    borderColor: "#4CAF50",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  registerText: { color: "#666", fontSize: 15, marginTop: 10 },
  registerLink: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    maxWidth: 350,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#d13f3f",
  },
  modalDescription: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderColor: "#4CAF50",
    elevation: 2,
  },
  modalCancelButton: {
    backgroundColor: "#E0E0E0",
    shadowColor: "transparent",
    elevation: 0,
    borderWidth: 1,
    borderColor: "#CCC",
  },
  modalCancelButtonText: {
    color: "#666",
    fontSize: 17,
    fontWeight: "bold",
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
  },
  successText: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 15,
    color: "#006600",
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
