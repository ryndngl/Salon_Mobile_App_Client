import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

// Import custom hooks
import { useLoginForm, useLoginAnimation } from "../../hooks";

// Import components
import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import LoginActions from "./LoginActions";
import LoginFooter from "./LoginFooter";
import LoginSuccessModal from "./LoginSuccessModal";

export default function LoginScreen() {
  // Custom hooks
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleLogin,
  } = useLoginForm();

  const {
    loginSuccessVisible,
    scaleAnim,
    fadeAnim,
    showSuccessModal,
    hideSuccessModal,
  } = useLoginAnimation();

  // Enhanced login handler that includes animation
  const onLoginPress = () => {
    handleLogin(showSuccessModal, hideSuccessModal);
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
            <LoginHeader />
            
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
            />
            
            <LoginActions
              email={email}
              password={password}
              loading={loading}
              handleLogin={onLoginPress}
            />
            
            <LoginFooter loading={loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoginSuccessModal
        visible={loginSuccessVisible}
        scaleAnim={scaleAnim}
        fadeAnim={fadeAnim}
      />
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
    borderColor: "#D4D4D4",
    borderWidth: 1,
    padding: 30,
    elevation: 1.5,
    alignItems: "center",
  },
});