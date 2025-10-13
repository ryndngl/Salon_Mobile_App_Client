// services/notificationService.js
const API_BASE_URL = 'http://192.168.100.6:5000/api'; 

export const notificationService = {
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

  deleteNotification: async (notificationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Notification deleted:', result);
      return { success: true };

    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  },

  markAllAsRead: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ All notifications marked as read:', result);
      return { success: true };

    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  },
};