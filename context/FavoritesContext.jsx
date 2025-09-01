// context/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from './AuthContext';
import { extractImages } from '../utils/imageHelper'; // Import your image helper

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Get user-specific storage key
  const getFavoritesKey = () => {
    if (isAuthenticated && (user?.id || user?._id)) {
      const userId = user.id || user._id;
      return `favorites_${userId}`;
    }
    return null; // No key if not authenticated
  };

  // Enhanced load function with error boundary and user-specific storage
  const loadFavorites = async (forceReload = false) => {
    try {
      // Don't load if already loading or no user
      if (isLoading && !forceReload) return;
      if (!isAuthenticated || !user) {
        setFavorites([]);
        return;
      }

      setIsLoading(true);
      const favoritesKey = getFavoritesKey();
      
      if (!favoritesKey) {
        setFavorites([]);
        return;
      }

      const storedFavorites = await AsyncStorage.getItem(favoritesKey);
      
      if (storedFavorites) {
        const parsed = JSON.parse(storedFavorites);
        const cleaned = parsed.filter(
          fav => fav?.service?.name && fav?.name && fav?.price
        );
        if (cleaned.length !== parsed.length) {
          console.warn(`Cleaned ${parsed.length - cleaned.length} invalid favorites`);
          // Save cleaned data back
          await AsyncStorage.setItem(favoritesKey, JSON.stringify(cleaned));
        }
        setFavorites(cleaned);
        console.log(`Loaded ${cleaned.length} favorites for user:`, user?.email || user?.fullName);
      } else {
        setFavorites([]);
        console.log(`No favorites found for user:`, user?.email || user?.fullName);
      }
    } catch (error) {
      console.error("Favorites load error:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save favorites to user-specific storage immediately
  const saveFavorites = async (favoritesData) => {
    try {
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, cannot save favorites');
        return false;
      }

      const favoritesKey = getFavoritesKey();
      if (!favoritesKey) {
        console.log('No favorites key, cannot save');
        return false;
      }

      await AsyncStorage.setItem(favoritesKey, JSON.stringify(favoritesData));
      console.log(`Saved ${favoritesData.length} favorites for user:`, user?.email || user?.fullName);
      return true;
    } catch (error) {
      console.error("Favorites save error:", error);
      return false;
    }
  };

  // Load favorites when user authentication status changes
  useEffect(() => {
    if (isAuthenticated && user && (user.id || user._id)) {
      console.log('User authenticated, loading favorites...');
      loadFavorites(true); // Force reload when user changes
    } else if (!isAuthenticated) {
      console.log('User not authenticated, clearing favorites...');
      setFavorites([]);
    }
  }, [isAuthenticated, user?.id, user?._id, user?.email]);

  // FIXED: Improved item identification that handles both service name and style name properly
  const getItemKey = (service, style) => {
    if (!service?.name || !style?.name) {
      console.warn("Attempting to get key for invalid item:", { service, style });
      return null;
    }
    // Create a consistent key using service name and style name
    return `${service.name.toLowerCase().trim()}|${style.name.toLowerCase().trim()}`;
  };

  // FIXED: Enhanced toggle function with proper data structure handling
  const toggleFavorite = async (service, style) => {
    try {
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, cannot toggle favorite');
        return false;
      }

      const key = getItemKey(service, style);
      if (!key) return false;
      
      let updatedFavorites;
      
      setFavorites(prev => {
        const existingIndex = prev.findIndex(item => 
          getItemKey(item.service, item) === key
        );

        if (existingIndex >= 0) {
          // Remove from favorites
          updatedFavorites = prev.filter((_, index) => index !== existingIndex);
          console.log(`Removed ${service.name} - ${style.name} from favorites`);
        } else {
          // Add to favorites with proper structure
          const favoriteItem = {
            ...style,
            service: {
              ...service,
              name: service.name
            },
            timestamp: new Date().toISOString(),
            userId: user?.id || user?._id,
            
            // FIXED: Handle images properly for different service types
            ...(style.images && Array.isArray(style.images) && style.images.length > 0 
              ? { images: style.images } 
              : style.image 
                ? { image: style.image }
                : extractImages && extractImages(style) 
                  ? (() => {
                      const extracted = extractImages(style);
                      return Array.isArray(extracted) && extracted.length > 1 
                        ? { images: extracted }
                        : { image: extracted[0] || extracted };
                    })()
                  : {}
            )
          };
          
          updatedFavorites = [...prev, favoriteItem];
          console.log(`Added ${service.name} - ${style.name} to favorites`, favoriteItem);
        }
        
        // Save immediately after updating
        saveFavorites(updatedFavorites);
        
        return updatedFavorites;
      });
      
      return true;
    } catch (error) {
      console.error('Toggle favorite error:', error);
      return false;
    }
  };

  // FIXED: Simplified and more reliable isFavorite check
  const isFavorite = (serviceName, styleName) => {
    if (!serviceName || !styleName || !isAuthenticated) {
      return false;
    }

    const key = `${serviceName.toLowerCase().trim()}|${styleName.toLowerCase().trim()}`;
    return favorites.some(item => {
      const itemKey = getItemKey(item.service, item);
      return itemKey === key;
    });
  };

  // Add to favorites function
  const addToFavorites = async (service, style) => {
    if (!isAuthenticated || !user) return false;
    
    const key = getItemKey(service, style);
    if (!key) return false;
    
    const exists = favorites.some(item => 
      getItemKey(item.service, item) === key
    );
    
    if (!exists) {
      await toggleFavorite(service, style);
      return true;
    }
    return false;
  };

  // Remove from favorites function
  const removeFromFavorites = async (service, style) => {
    if (!isAuthenticated || !user) return false;
    
    const key = getItemKey(service, style);
    if (!key) return false;
    
    const exists = favorites.some(item => 
      getItemKey(item.service, item) === key
    );
    
    if (exists) {
      await toggleFavorite(service, style);
      return true;
    }
    return false;
  };

  // Clear all favorites for current user
  const clearFavorites = async () => {
    try {
      if (!isAuthenticated || !user) return false;
      
      setFavorites([]);
      const favoritesKey = getFavoritesKey();
      
      if (favoritesKey) {
        await AsyncStorage.removeItem(favoritesKey);
        console.log(`Cleared all favorites for user:`, user?.email || user?.fullName);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Clear favorites error:', error);
      return false;
    }
  };

  // Get favorites by service
  const getFavoritesByService = (serviceName) => {
    if (!isAuthenticated) return [];
    
    return favorites.filter(item => 
      item.service?.name?.toLowerCase() === serviceName?.toLowerCase()
    );
  };

  // Force refresh favorites from storage
  const refreshFavorites = () => {
    return loadFavorites(true);
  };

  // Context value
  const value = {
    favorites,
    toggleFavorite,
    isFavorite,
    isLoading,
    refreshFavorites,
    count: favorites.length,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
    getFavoritesByService,
    isAuthenticated,
    user: user ? { id: user.id || user._id, email: user.email || user.fullName } : null,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};