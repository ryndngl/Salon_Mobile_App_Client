import { Modal, Pressable, Image, Text, StyleSheet } from "react-native";

export function ImageModal({ visible, imageSource, onClose }) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        {imageSource ? (
          <Image
            source={imageSource}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.noImageText}>No Image Available</Text>
        )}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
  },
  noImageText: {
    color: "white",
    fontSize: 18,
  },
});