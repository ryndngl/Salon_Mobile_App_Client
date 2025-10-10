// screens/HomeScreen/hooks/useTestimonials.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "../config/api";

const API_BASE_URL = API_URL.replace("/api", "") + "/api";

export const useTestimonials = (userObj) => {
  const [testimonials, setTestimonials] = useState([]);
  const [userTestimonials, setUserTestimonials] = useState([]);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    feedback: "",
    rating: 5,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [testimonialLoading, setTestimonialLoading] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
  setRefreshing(true);
  await fetchTestimonials();
  setRefreshing(false);
};

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`);

      if (response.ok) {
        const result = await response.json();

        const allTestimonials = result.data || [];

        const storedUser = await AsyncStorage.getItem("user");
        let currentUser = userObj;

        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        }

        if (currentUser && (currentUser.id || currentUser._id)) {
          const currentUserId = (currentUser.id || currentUser._id)
            .toString()
            .trim();

          const userTestimonials = allTestimonials.filter((t) => {
            if (!t.userId) return false;
            const testimonialUserId = t.userId.toString().trim();
            return testimonialUserId === currentUserId;
          });

          const otherTestimonials = allTestimonials.filter((t) => {
            if (!t.userId) return true;
            const testimonialUserId = t.userId.toString().trim();
            return testimonialUserId !== currentUserId;
          });

          setUserTestimonials(userTestimonials);
          setTestimonials(otherTestimonials);
        } else {
          setTestimonials(allTestimonials);
          setUserTestimonials([]);
        }
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  };

  const createTestimonial = async (testimonialData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonialData),
      });

      const result = await response.json();
      return response.ok
        ? { success: true, data: result.data }
        : { success: false, message: result.message };
    } catch (error) {
      return { success: false, message: "Network error occurred" };
    }
  };
const updateTestimonial = async (testimonialId, testimonialData) => {
  try {
    const cleanData = {
      name: testimonialData.name,
      feedback: testimonialData.feedback,
      rating: testimonialData.rating || 5,
    };

    const response = await fetch(
      `${API_BASE_URL}/testimonials/${testimonialId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanData),
      }
    );

    const responseText = await response.text();
    const result = JSON.parse(responseText);

    return response.ok
      ? { success: true, data: result.data }
      : { success: false, message: result.message };
  } catch (error) {
    return { success: false, message: "Network error occurred" };
  }
};

  const deleteTestimonial = async (testimonialId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/testimonials/${testimonialId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      return { success: response.ok };
    } catch (error) {
      return { success: false, message: "Network error occurred" };
    }
  };

  // Testimonial handlers
 const handleAddTestimonial = async () => {
  if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
    Alert.alert("Error", "Please fill in both name and feedback fields.");
    return;
  }

  const existingUserTestimonial = userTestimonials.find(
    (t) => t.userId && userObj && t.userId.toString() === (userObj.id || userObj._id)?.toString()
  );

  if (existingUserTestimonial) {
    Alert.alert(
      "Review Already Exists",
      "You already have a testimonial. You can edit your existing review instead.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Edit Existing",
          onPress: () => openEditModal(existingUserTestimonial),
        },
      ]
    );
    return;
  }

  setTestimonialLoading(true);

  const testimonialData = {
    name: newTestimonial.name.trim(),
    feedback: newTestimonial.feedback.trim(),
    rating: newTestimonial.rating || 5,
    userId: userObj?.id || userObj?._id,
    userEmail: userObj?.email,
  };

  const result = await createTestimonial(testimonialData);
  setTestimonialLoading(false);

  if (result.success) {
    resetTestimonialModal();
    fetchTestimonials();
    Alert.alert("Success", "Your testimonial has been added!");
  } else {
    Alert.alert("Error", result.message || "Failed to add testimonial");
  }
};

  const handleEditTestimonial = async () => {
    if (!newTestimonial.name.trim() || !newTestimonial.feedback.trim()) {
      Alert.alert("Error", "Please fill in both name and feedback fields.");
      return;
    }

    setTestimonialLoading(true);

    const testimonialData = {
      name: newTestimonial.name.trim(),
      feedback: newTestimonial.feedback.trim(),
      rating: newTestimonial.rating || 5,
    };

    if (userObj && userObj.id) {
      testimonialData.userId = userObj.id;
      testimonialData.userEmail = userObj.email;
    }

    const result = await updateTestimonial(editingId, testimonialData);
    setTestimonialLoading(false);

    if (result.success) {
      resetTestimonialModal();
      fetchTestimonials();
      Alert.alert("Success", "Testimonial updated successfully!");
    } else {
      Alert.alert("Error", result.message || "Failed to update testimonial");
    }
  };

  const handleDeleteTestimonial = (testimonialId) => {
    Alert.alert(
      "Delete Testimonial",
      "Are you sure you want to delete this testimonial?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteTestimonial(testimonialId);
            if (result.success) {
              fetchTestimonials();
              Alert.alert("Success", "Testimonial deleted successfully!");
            } else {
              Alert.alert(
                "Error",
                result.message || "Failed to delete testimonial"
              );
            }
          },
        },
      ]
    );
  };
 
  const openEditModal = (testimonial) => {
    setNewTestimonial({
      name: testimonial.name,
      feedback: testimonial.feedback,
      rating: testimonial.rating || 5,
    });
    setEditingId(testimonial._id);
    setIsEditMode(true);
    setShowTestimonialModal(true);
  };

  const resetTestimonialModal = () => {
    setNewTestimonial({ name: "", feedback: "", rating: 5 });
    setShowTestimonialModal(false);
    setIsEditMode(false);
    setEditingId(null);
  };

  useEffect(() => {
    if (userObj) {
      fetchTestimonials();
    }
  }, [userObj]);

  const testimonialModalProps = {
    newTestimonial,
    setNewTestimonial,
    isEditMode,
    testimonialLoading,
    onSubmit: isEditMode ? handleEditTestimonial : handleAddTestimonial,
    onClose: resetTestimonialModal,
  };

  return {
    testimonials,
    userTestimonials,
    showTestimonialModal,
    setShowTestimonialModal,
    testimonialModalProps,
    showOptionsMenu,
    setShowOptionsMenu,
    fetchTestimonials,
    handleDeleteTestimonial,
    openEditModal,
    refreshing,
    onRefresh,
  };
};
