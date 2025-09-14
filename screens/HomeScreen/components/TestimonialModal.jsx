// screens/HomeScreen/components/TestimonialModal.jsx
import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const TestimonialModal = ({
  visible,
  newTestimonial,
  setNewTestimonial,
  isEditMode,
  testimonialLoading,
  onSubmit,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {isEditMode ? "Edit Your Testimonial" : "Share Your Experience"}
          </Text>

          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={newTestimonial.name}
            onChangeText={(text) =>
              setNewTestimonial((prev) => ({ ...prev, name: text }))
            }
            maxLength={50}
          />

          <Text style={styles.inputLabel}>Your Feedback</Text>
          <TextInput
            style={[styles.input, styles.feedbackInput]}
            placeholder="Share your experience with our services..."
            value={newTestimonial.feedback}
            onChangeText={(text) =>
              setNewTestimonial((prev) => ({ ...prev, feedback: text }))
            }
            multiline
            numberOfLines={4}
            maxLength={200}
            textAlignVertical="top"
          />

          <Text style={styles.characterCount}>
            {newTestimonial.feedback.length}/200 characters
          </Text>

          <Text style={styles.inputLabel}>Rating</Text>
          <View style={styles.ratingSelector}>
            {[1, 2, 3, 4, 5].map((rating) => (
              <TouchableOpacity
                key={rating}
                onPress={() =>
                  setNewTestimonial((prev) => ({ ...prev, rating }))
                }
                style={styles.starButton}
              >
                <Icon
                  name={
                    rating <= (newTestimonial.rating || 5)
                      ? "star"
                      : "star-outline"
                  }
                  size={32}
                  color="#ffcc00"
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
              disabled={testimonialLoading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.submitButton]}
              onPress={onSubmit}
              disabled={testimonialLoading}
            >
              <Text style={styles.submitButtonText}>
                {testimonialLoading
                  ? "Processing..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#d13f3f",
    textAlign: "center",
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  feedbackInput: {
    height: 100,
    textAlignVertical: "top",
  },
  characterCount: {
    textAlign: "right",
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  ratingSelector: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  starButton: {
    paddingHorizontal: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#007d3f",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TestimonialModal;