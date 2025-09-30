import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";

export default function LogoutConfirmModal({ visible, onConfirm, onCancel }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.confirmContainer}>
        <View style={styles.confirmBox}>
          <Text style={styles.confirmTitle}>Are you sure?</Text>
          <Text style={styles.confirmMessage}>
            Do you really want to log out?
          </Text>
          <View style={styles.confirmButtons}>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: "#d13f3f" }]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                {
                  backgroundColor: "#f5f5f5",
                  borderColor: "#ddd",
                  borderWidth: 1,
                },
              ]}
              onPress={onCancel}
            >
              <Text style={[styles.confirmBtnText, { color: "#666" }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});