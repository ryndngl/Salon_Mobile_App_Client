// api/appointmentApi.js
import { API_BASE_URL, API_ENDPOINTS } from './config';

// ✅ HELPER FUNCTIONS: Format data for backend

/**
 * Convert date string "MM/DD/YYYY" to ISO format "YYYY-MM-DD"
 */
const formatDateForBackend = (dateString) => {
  try {
    // Handle if already a Date object
    if (dateString instanceof Date) {
      return dateString.toISOString().split('T')[0];
    }
    
    // Parse "MM/DD/YYYY" format
    const [month, day, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return as-is if parsing fails
  }
};

/**
 * Remove peso sign and convert to number
 */
const cleanPrice = (price) => {
  if (typeof price === 'number') return price;
  if (typeof price === 'string') {
    // Remove ₱, spaces, commas and convert to number
    return parseFloat(price.replace(/[₱,\s]/g, '')) || 0;
  }
  return 0;
};

export const appointmentApi = {
  /**
   * Create new appointment
   * @param {Object} appointmentData - Appointment details
   * @returns {Promise<Object>} Response with appointment data
   */
  createAppointment: async (appointmentData) => {
    try {
      console.log('Creating appointment (raw data):', appointmentData);

      // ✅ FIX: Format data before sending to backend
      const formattedData = {
        ...appointmentData,
        // ✅ Convert date string "10/12/2025" → ISO format "2025-10-12"
        date: formatDateForBackend(appointmentData.date),
        // ✅ Clean service prices - remove ₱ symbol
        services: appointmentData.services.map(service => ({
          ...service,
          price: cleanPrice(service.price)
        }))
      };

      console.log('Creating appointment (formatted data):', formattedData);

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.CREATE_APPOINTMENT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create appointment');
      }

      console.log('Appointment created successfully:', data);
      return {
        success: true,
        data: data.data,
        message: data.message
      };

    } catch (error) {
      console.error('Create appointment error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create appointment. Please try again.',
        error: error
      };
    }
  },

  /**
   * Get all appointments for a user
   * @param {String} userId - User ID
   * @returns {Promise<Object>} Response with appointments array
   */
  getUserAppointments: async (userId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.GET_USER_APPOINTMENTS}/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      return {
        success: true,
        data: data.data || [],
        count: data.count || 0
      };

    } catch (error) {
      console.error('Get user appointments error:', error);
      return {
        success: false,
        message: error.message || 'Failed to load appointments',
        data: [],
        error: error
      };
    }
  },

  /**
   * Get all appointments (for admin/desktop)
   * @returns {Promise<Object>} Response with all appointments
   */
  getAllAppointments: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_APPOINTMENTS}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch appointments');
      }

      return {
        success: true,
        data: data.data || [],
        count: data.count || 0
      };

    } catch (error) {
      console.error('Get all appointments error:', error);
      return {
        success: false,
        message: error.message || 'Failed to load appointments',
        data: [],
        error: error
      };
    }
  },

  /**
   * Update appointment status
   * @param {String} appointmentId - Appointment ID
   * @param {String} status - New status (Pending, Confirmed, Completed, etc.)
   * @returns {Promise<Object>} Response
   */
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.UPDATE_APPOINTMENT}/${appointmentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update appointment');
      }

      return {
        success: true,
        data: data.data,
        message: data.message
      };

    } catch (error) {
      console.error('Update appointment status error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update appointment',
        error: error
      };
    }
  },

  /**
   * Delete appointment
   * @param {String} appointmentId - Appointment ID
   * @returns {Promise<Object>} Response
   */
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.DELETE_APPOINTMENT}/${appointmentId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete appointment');
      }

      return {
        success: true,
        message: data.message
      };

    } catch (error) {
      console.error('Delete appointment error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete appointment',
        error: error
      };
    }
  },
};