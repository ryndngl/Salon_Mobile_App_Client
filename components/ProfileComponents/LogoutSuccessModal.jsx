import { View, Text, Modal, Animated, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function LogoutSuccessModal({ visible, scaleAnim, fadeAnim }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.confirmContainer}>
        <Animated.View
          style={[
            styles.confirmBox,
            { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
          ]}
        >
          <Icon name="logout" size={48} color="#4CAF50" />
          <Text style={styles.confirmTitle}>Logged Out Successfully!</Text>
          <Text style={styles.confirmMessage}>Redirecting to login...</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  confirmContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  confirmBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
    color: "#333",
  },
  confirmMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
});