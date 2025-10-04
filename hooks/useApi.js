// screens/HomeScreen/hooks/useApi.js
import { useState } from 'react';
import API_URL from '../config/api';

const API_BASE_URL = API_URL.replace("/api", "") + "/api";

export const useApi = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/services`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setServicesData(data);
    } catch (error) {
      console.error('Fetch services error:', error);
      setError("Failed to load services. Please check your connection.");
      
      // Fallback data with categories structure
      const fallbackServices = {
        services: [
          { _id: "1", name: "Hair Cut", categories: [] },
          { _id: "2", name: "Hair Color", categories: [] },
          { _id: "3", name: "Hair Treatment", categories: [] },
          { _id: "4", name: "Rebond & Forms", categories: [] },
          { _id: "5", name: "Nail Care", categories: [] },
          { _id: "6", name: "Foot Spa", categories: [] },
        ],
      };
      setServicesData(fallbackServices);
    } finally {
      setLoading(false);
    }
  };

  const searchStyles = async (query) => {
    if (!query.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/services/search/styles?query=${encodeURIComponent(query)}`
      );

      if (response.ok) {
        const apiResponse = await response.json();
        const results = apiResponse.data?.results || [];
        return results.map((item, index) => ({
          ...item,
          searchId: `${item.serviceName || "unknown"}-${item.name || item._id || index}`,
        }));
      } else {
        return performLocalSearch(query);
      }
    } catch (error) {
      console.error('Search error:', error);
      return performLocalSearch(query);
    }
  };

  const performLocalSearch = (query) => {
    const servicesList = servicesData.services || servicesData.data || servicesData || [];

    return servicesList.flatMap((service) => {
      // Handle new structure with categories
      if (service.categories && Array.isArray(service.categories)) {
        return service.categories.flatMap((category) =>
          (category.styles || [])
            .filter((style) =>
              style.name?.toLowerCase().includes(query.toLowerCase())
            )
            .map((style) => ({
              ...style,
              category: category.name, // Add category name
              serviceName: service.name,
              searchId: `${service.name}-${category.name}-${style.name || style.id || Math.random()}`,
            }))
        );
      }
      
      // Fallback for old structure (backward compatibility)
      return (service.styles || [])
        .filter((style) =>
          style.name?.toLowerCase().includes(query.toLowerCase())
        )
        .map((style) => ({
          ...style,
          serviceName: service.name,
          searchId: `${service.name}-${style.name || style._id || Math.random()}`,
        }));
    });
  };

  return {
    servicesData,
    loading,
    error,
    fetchServices,
    searchStyles,
  };
};