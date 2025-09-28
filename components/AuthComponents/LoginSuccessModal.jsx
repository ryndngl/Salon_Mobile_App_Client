import React from 'react';
import { View, Text, Modal, Animated, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function LoginSuccessModal({ 
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
          <Ionicons
            name="checkmark-circle-outline"
            size={60}
            color="#4CAF50"
          />
          <Text style={styles.successText}>Login Successful! </Text>
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
});