import React from 'react';
import { View, Text, Modal, Animated, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function EmailSentModal({ 
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
            name="mail-outline"
            size={60}
            color="#4CAF50"
          />
          <Text style={styles.successText}>Email Sent!</Text>
          <Text style={styles.successSubText}>
            Check your email for the reset code.
          </Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  successModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: '#FAFAFA',
    paddingVertical: 30,
    paddingHorizontal: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EEE',
    maxWidth: '85%',
  },
  successText: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 15,
    color: '#4CAF50',
    textAlign: 'center',
  },
  successSubText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  successInstructions: {
    fontSize: 14,
    color: '#888',
    marginTop: 15,
    textAlign: 'center',
    lineHeight: 20,
  },
});