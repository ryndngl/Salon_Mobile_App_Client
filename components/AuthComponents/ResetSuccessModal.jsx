import React from 'react';
import { View, Text, Modal, Animated, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ResetSuccessModal({ 
  visible, 
  scaleAnim, 
  fadeAnim 
}) {
  return (
    <Modal 
      animationType="none" 
      transparent={true} 
      visible={visible}
    >
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
          <Text style={styles.successRedirectText}>
            Redirecting to login...
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  successRedirectText: {
    fontSize: 13,
    color: "#bbb",
    marginTop: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
});