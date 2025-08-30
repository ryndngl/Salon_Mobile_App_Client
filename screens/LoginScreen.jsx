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
  Pressable,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, setUser, setIsAuthenticated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loginSuccessVisible, setLoginSuccessVisible] = useState(false);
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

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      const result = await login(email, password);

      if (result.success) {
        setLoginSuccessVisible(true);

        setTimeout(() => {
          setLoginSuccessVisible(false);

          setUser(result.user);
          setIsAuthenticated(true);

          navigation.reset({
            index: 0,
            routes: [{ name: "MainTabs" }],
          });
        }, 1000);
      } else {
        Alert.alert("Login Failed", result.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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
              editable={!loading}
            />

            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>
           
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPasswordScreen")}
              style={styles.forgotPasswordButton}
              disabled={loading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                (!email || !password || loading) && styles.buttonDisabled
              ]}
              onPress={handleLogin}
              disabled={loading || !email || !password}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              disabled={loading}
            >
              <Text style={styles.registerText}>
                Don't have an account?{" "}
                <Text style={styles.registerLink}>Register here.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        animationType="none"
        transparent={true}
        visible={loginSuccessVisible}
      >
        <View style={styles.successModalContainer}>
          <Animated.View
            style={[
              styles.successCard,
              { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
            ]}
          >
            <Ionicons
              name="checkmark-circle-outline"
              size={60}
              color="#4CAF50"
            />
            <Text style={styles.successText}>Login Successful! </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 30,
    elevation: 1.5,
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
  togglePasswordButton: {
    padding: 5,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
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
    elevation: 1,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
  registerText: {
    color: "#666",
    fontSize: 15,
    marginTop: 10,
    textAlign: "center",
  },
  registerLink: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  successModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  successCard: {
    backgroundColor: "#FAFAFA",
    paddingVertical: 30,
    paddingHorizontal: 25,
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
  },
  successSubText: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
    fontWeight: "500",
  },
});