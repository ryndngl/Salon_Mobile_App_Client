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
      console.log('Services data fetched:', {
        hasData: !!data,
        servicesCount: data?.services?.length || 0,
        structure: Object.keys(data || {})
      });
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
    // Trim and validate query
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      console.log('Empty query, returning empty results');
      return [];
    }

    console.log(`🔍 Searching for: "${trimmedQuery}"`);

    try {
      const response = await fetch(
        `${API_BASE_URL}/services/search/styles?query=${encodeURIComponent(trimmedQuery)}`
      );

      if (response.ok) {
        const apiResponse = await response.json();
        const results = apiResponse.data?.results || [];
        console.log(`API Search found ${results.length} results`);
        
        // If API returns no results, fallback to local search
        if (results.length === 0) {
          console.log('API returned 0 results, using local search fallback');
          return performLocalSearch(trimmedQuery);
        }
        
        return results.map((item, index) => ({
          ...item,
          searchId: `${item.serviceName || "unknown"}-${item.name || item._id || index}`,
        }));
      } else {
        console.log(`API returned status ${response.status}, using local search`);
        return performLocalSearch(trimmedQuery);
      }
    } catch (error) {
      console.error('Search API error:', error.message);
      return performLocalSearch(trimmedQuery);
    }
  };

  const performLocalSearch = (query) => {
    console.log('Performing local search...');
    
    // Normalize query - lowercase and trim
    const normalizedQuery = query.toLowerCase().trim();
    
    // Get services list with multiple fallbacks
    const servicesList = servicesData.services || 
                        servicesData.data?.services || 
                        servicesData.data || 
                        servicesData || 
                        [];

    console.log('Services data structure:', {
      totalServices: servicesList.length,
      firstService: servicesList[0] ? {
        name: servicesList[0].name,
        hasCategories: !!servicesList[0].categories,
        categoriesCount: servicesList[0].categories?.length,
        hasStyles: !!servicesList[0].styles,
        stylesCount: servicesList[0].styles?.length
      } : 'No services'
    });

    if (!Array.isArray(servicesList) || servicesList.length === 0) {
      console.log('No services data available for search');
      return [];
    }

    const results = servicesList.flatMap((service) => {
      // Handle new structure with categories
      if (service.categories && Array.isArray(service.categories)) {
        return service.categories.flatMap((category) => {
          const styles = category.styles || [];
          
          return styles
            .filter((style) => {
              if (!style.name) return false;
              
              const styleName = style.name.toLowerCase().trim();
              const serviceNameLower = service.name?.toLowerCase().trim() || '';
              const categoryNameLower = category.name?.toLowerCase().trim() || '';
              const description = style.description?.toLowerCase().trim() || '';
              
              // Search in multiple fields
              return styleName.includes(normalizedQuery) ||
                     serviceNameLower.includes(normalizedQuery) ||
                     categoryNameLower.includes(normalizedQuery) ||
                     description.includes(normalizedQuery);
            })
            .map((style) => ({
              ...style,
              category: category.name,
              serviceName: service.name,
              searchId: `${service.name}-${category.name}-${style.name || style._id || Math.random()}`,
            }));
        });
      }
      
      // Fallback for old structure (backward compatibility)
      const styles = service.styles || [];
      
      return styles
        .filter((style) => {
          if (!style.name) return false;
          
          const styleName = style.name.toLowerCase().trim();
          const serviceNameLower = service.name?.toLowerCase().trim() || '';
          const description = style.description?.toLowerCase().trim() || '';
          
          // Search in multiple fields
          return styleName.includes(normalizedQuery) ||
                 serviceNameLower.includes(normalizedQuery) ||
                 description.includes(normalizedQuery);
        })
        .map((style) => ({
          ...style,
          serviceName: service.name,
          searchId: `${service.name}-${style.name || style._id || Math.random()}`,
        }));
    });

    console.log(`Local search found ${results.length} results for "${query}"`);
    
    if (results.length > 0) {
      console.log('First result:', results[0].name, '-', results[0].serviceName);
    }
    
    return results;
  };

  return {
    servicesData,
    loading,
    error,
    fetchServices,
    searchStyles,
  };
};