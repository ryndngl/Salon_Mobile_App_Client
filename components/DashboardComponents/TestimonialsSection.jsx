// screens/HomeScreen/components/TestimonialsSection.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTestimonials } from '../../hooks';
import TestimonialCard from './TestimonialCard';
import TestimonialModal from './TestimonialModal';

const TestimonialsSection = ({ userObj }) => {
  const {
    testimonials,
    userTestimonials,
    showTestimonialModal,        
    setShowTestimonialModal,
    testimonialModalProps,         
    showOptionsMenu,
    setShowOptionsMenu,
    handleDeleteTestimonial,
    openEditModal,
  } = useTestimonials(userObj);
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What Our Clients Say</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowTestimonialModal(true)}
        >
          <Icon name="chatbubble-ellipses" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Review</Text>
        </TouchableOpacity>

        <TestimonialModal
      visible={showTestimonialModal}
      {...testimonialModalProps}
    />
      </View>

      {userTestimonials.length > 0 && (
        <View style={styles.userTestimonialsSection}>
          <Text style={styles.sectionSubtitle}>Your Reviews</Text>
          {userTestimonials.map((item, index) => (
            <TestimonialCard
              key={item._id || index}
              testimonial={item}
              isUserTestimonial={true}
              showOptionsMenu={showOptionsMenu}
              setShowOptionsMenu={setShowOptionsMenu}
              onEdit={openEditModal}
              onDelete={handleDeleteTestimonial}
            />
          ))}
        </View>
      )}

      {testimonials.length > 0 ? (
        <View style={styles.allTestimonialsSection}>
          <Text style={styles.sectionSubtitle}>
            {userTestimonials.length > 0 ? "Other Reviews" : "Customer Reviews"}
          </Text>
          {testimonials.map((item, index) => (
            <TestimonialCard
              key={item._id || index}
              testimonial={item}
              isUserTestimonial={false}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyTestimonials}>
          <Icon name="chatbubbles-outline" size={48} color="#ccc" />
          <Text style={styles.emptyTestimonialsText}>
            No reviews yet. Be the first to share your experience!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 4,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#d13f3f",
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007d3f",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  userTestimonialsSection: {
    marginBottom: 25,
  },
  allTestimonialsSection: {
    marginTop: 5,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
    paddingLeft: 8,
    letterSpacing: 0.3,
  },
  emptyTestimonials: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTestimonialsText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 22,
  },
});

export default TestimonialsSection;