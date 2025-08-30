import { useState } from "react";
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
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
      const response = await fetch("http://192.168.100.6:5000/api/auth/sign-up", {
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

      Alert.alert("Success", `Welcome, ${fullName}! Your account has been created.`);
      navigation.navigate("LoginScreen");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
      console.error("Registration Error:", error.message);
    }
  };

  const handleLoginRedirect = () => {
    navigation.navigate("LoginScreen");
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
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Your Account</Text>

            {/* Full Name Input */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#888"
              autoCapitalize="words"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password Input */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={{
                    uri: showPassword
                      ? "https://img.icons8.com/material-outlined/24/000000/visible--v1.png"
                      : "https://img.icons8.com/material-outlined/24/000000/invisible--v1.png",
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInputField}
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.togglePasswordButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image
                  source={{
                    uri: showConfirmPassword
                      ? "https://img.icons8.com/material-outlined/24/000000/visible--v1.png"
                      : "https://img.icons8.com/material-outlined/24/000000/invisible--v1.png",
                  }}
                  style={styles.togglePasswordIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Checkbox */}
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <Image
                source={{
                  uri: agreedToTerms
                    ? "https://img.icons8.com/material-outlined/24/000000/checked-checkbox.png"
                    : "https://img.icons8.com/material-outlined/24/000000/unchecked-checkbox.png",
                }}
                style={styles.checkboxIcon}
              />
              <Text style={styles.checkboxText}>
                I agree with the
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("TermsConditions")}
                >
                  {" "}Terms and Conditions{" "}
                </Text>
                and
                <Text
                  style={styles.linkText}
                  onPress={() => navigation.navigate("PrivacyPolicy")}
                >
                  {" "}Privacy Policy{" "}
                </Text>.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLoginRedirect}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginLink}>Login here.</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCE4EC",
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
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
    color: "#880E4F",
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
  togglePasswordIcon: {
    width: 24,
    height: 24,
    tintColor: "#888",
  },
  // ðŸ‘ˆ NEW: Styles for the checkbox and text
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  checkboxIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    tintColor: "#d13f3f",
  },
  checkboxText: {
    flex: 1,
    fontSize: 14,
    color: "#666",
    flexWrap: "wrap",
  },
  linkText: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  button: {
    width: "100%",
    height: 55,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 25,
    borderColor: "#d13f3f",
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  loginText: {
    color: "#666",
    fontSize: 15,
    marginTop: 10,
  },
  loginLink: {
    color: "#d13f3f",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});