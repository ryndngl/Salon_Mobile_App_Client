// services/notificationService.js
const API_BASE_URL = 'http://192.168.100.6:5000/api'; 

export const notificationService = {
  /**
   * Get user notifications
   */
  getUserNotifications: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return result.data || [];

    } catch (error) {
      console.error('Get notifications error:', error);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/read/${notificationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      return result.data;

    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  },
};