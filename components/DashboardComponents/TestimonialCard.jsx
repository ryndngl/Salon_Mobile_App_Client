// screens/HomeScreen/components/TestimonialCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatDateTime} from '../../utils/dateFormatter';

const TestimonialCard = ({ 
  testimonial, 
  isUserTestimonial = false,
  showOptionsMenu,
  setShowOptionsMenu,
  onEdit,
  onDelete
}) => {
  // Use updatedAt if available, otherwise use createdAt
  const displayDate = testimonial.updatedAt || testimonial.createdAt;

  return (
    <View style={[
      styles.container,
      isUserTestimonial && styles.userTestimonialCard,
    ]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{testimonial.name}</Text>
          <View style={styles.ratingAndDate}>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name={i < (testimonial.rating || 5) ? "star" : "star-outline"}
                  size={16}
                  color="#ffb000"
                  style={{ marginRight: 2 }}
                />
              ))}
            </View>
            <Text style={styles.date}>
              {formatDateTime(displayDate)}
            </Text>
          </View>
        </View>

        {isUserTestimonial && (
          <TouchableOpacity
            onPress={() =>
              setShowOptionsMenu(
                showOptionsMenu === testimonial._id ? null : testimonial._id
              )
            }
            style={styles.optionsButton}
          >
            <Icon name="ellipsis-vertical" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.message}>{testimonial.feedback}</Text>

      {isUserTestimonial && (
        <>
          <TouchableOpacity
            onPress={() => onEdit(testimonial)}
            style={styles.editReviewButton}
          >
            <Text style={styles.editReviewText}>Edit your review</Text>
          </TouchableOpacity>

          {showOptionsMenu === testimonial._id && (
            <View style={styles.optionsMenu}>
              <TouchableOpacity
                onPress={() => {
                  setShowOptionsMenu(null);
                  onDelete(testimonial._id);
                }}
                style={styles.deleteOption}
              >
                <Text style={styles.deleteOptionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
    elevation: 0.5,
  },
  userTestimonialCard: {
    backgroundColor: "#fff",
    borderColor: "#E8E8E8",
    borderWidth: 0.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ratingAndDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  date: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400",
  },
  optionsButton: {
    padding: 4,
    borderRadius: 4,
  },
  message: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 12,
  },
  editReviewButton: {
    alignSelf: "flex-start",
    marginTop: 4,
  },
  editReviewText: {
    fontSize: 14,
    color: "#1976D2",
    fontWeight: "500",
  },
  optionsMenu: {
    position: "absolute",
    top: 40,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    zIndex: 10,
  },
  deleteOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  deleteOptionText: {
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "500",
  },
});

export default TestimonialCard;