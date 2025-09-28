import React from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

// Import custom hook
import { useRegisterForm } from "../../hooks";

// Import components
import RegisterHeader from "./RegisterHeader";
import RegisterForm from "./RegisterForm";
import RegisterTermsCheckbox from "./RegisterTermsCheckbox";
import RegisterActions from "./RegisterActions";
import RegisterFooter from "./RegisterFooter";

export default function RegisterScreen() {
  // Custom hook
  const {
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
  } = useRegisterForm();

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
            <RegisterHeader />
            
            <RegisterForm
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
            />
            
            <RegisterTermsCheckbox
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              loading={loading}
            />
            
            <RegisterActions
              isFormValid={isFormValid}
              loading={loading}
              handleRegister={handleRegister}
            />
            
            <RegisterFooter
              loading={loading}
              handleLoginRedirect={handleLoginRedirect}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    justifyContent: "center",
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