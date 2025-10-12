// services/appointmentService.js

// ✅ Use your PC's IP address
const API_BASE_URL = 'http://192.168.100.6:5000/api'; // Replace with your IP
// const API_BASE_URL = 'http://10.0.2.2:5000/api'; // For Android emulator

export const appointmentService = {
  /**
   * Get user appointments
   */
  getUserAppointments: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
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
      console.error('Get appointments error:', error);
      return [];
    }
  },

  /**
   * Cancel appointment (user action)
   */
  cancelAppointment: async (appointmentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/update-status/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Cancelled' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('Appointment cancelled:', result);
      
      return result.data;

    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  },
};