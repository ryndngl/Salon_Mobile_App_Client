import { useState } from "react";

export function useImageModal() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (imageSource) => {
    setSelectedImage(imageSource);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return {
    modalVisible,
    selectedImage,
    openImageModal,
    closeImageModal,
  };
}