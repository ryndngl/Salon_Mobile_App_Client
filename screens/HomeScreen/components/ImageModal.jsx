// screens/HomeScreen/components/ImageModal.jsx
import React from 'react';
import { Modal, TouchableOpacity, Image, StyleSheet } from 'react-native';

const ImageModal = ({ visible, selectedImage, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <Image
          source={selectedImage}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ImageModal;