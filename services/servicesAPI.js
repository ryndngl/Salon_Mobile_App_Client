// services/servicesAPI.js
import API_URL from "../config/api";

export const servicesAPI = {
  // Get service by name
  getServiceByName: async (serviceName) => {
    try {
      const response = await fetch(
        `${API_URL}/api/services/name/${encodeURIComponent(serviceName)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.message || 'Failed to fetch service');
      }
    } catch (error) {
      console.error('❌ Error fetching service:', error);
      throw error;
    }
  },
};