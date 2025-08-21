// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoritesMigrationHelper } from '../utils/FavoritesMigrationHelper';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialAuthCheck, setInitialAuthCheck] = useState(false);
  
  // New states for splash screen functionality
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [showSplashOnLogout, setShowSplashOnLogout] = useState(false);

  // Check kung may saved token sa device startup
  const checkAuthStatus = async (showLogs = true) => {
    try {
      if (showLogs) setIsLoading(true);
      
      // Check if it's the first time opening the app
      const hasOpenedBefore = await AsyncStorage.getItem('hasOpenedBefore');
      if (!hasOpenedBefore) {
        setIsFirstTime(true);
        await AsyncStorage.setItem('hasOpenedBefore', 'true');
      } else {
        setIsFirstTime(false);
      }
      
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          
          // Verify token sa backend kung valid pa
          const isValidToken = await verifyToken(token);
          
          if (isValidToken) {
            // Ensure user has both id formats for compatibility
            const completeUserData = {
              ...parsedUser,
              id: parsedUser.id || parsedUser._id,
              _id: parsedUser._id || parsedUser.id,
            };
            
            setUser(completeUserData);
            setIsAuthenticated(true);
            
            if (showLogs) {
              console.log('User auto-authenticated:', completeUserData.email || completeUserData.fullName);
            }
            
            // Try to migrate old favorites if user doesn't have user-specific favorites yet
            const userId = completeUserData.id || completeUserData._id;
            if (userId) {
              // Don't await this - let it run in background
              FavoritesMigrationHelper.migrateGlobalFavoritesToUser(userId)
                .catch(err => console.warn('Migration warning:', err));
            }
            
            return true;
          } else {
            // Token expired o invalid, clear storage
            await clearAuthData();
            if (showLogs) {
              console.log('Token invalid, cleared auth data');
            }
            return false;
          }
        } catch (parseError) {
          console.error('User data parse error:', parseError);
          await clearAuthData();
          return false;
        }
      } else {
        if (showLogs) {
          console.log('No stored auth data found');
        }
        return false;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      await clearAuthData();
      return false;
    } finally {
      if (showLogs) {
        setIsLoading(false);
        setInitialAuthCheck(true);
      }
    }
  };

  // Verify token sa backend
  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://192.168.100.6:5000/api/auth/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.ok) {
        const data = await response.json();
        return data.isSuccess;
      }
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      // For network errors, assume token is still valid to allow offline usage
      // In production, you might want to be more strict
      return true; // Changed to true to allow offline functionality
    }
  };

 // Login function
const login = async (email, password) => {
  try {
    const response = await fetch('http://192.168.100.6:5000/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      timeout: 15000,
    });

    const data = await response.json();

    if (data.isSuccess && data.token) {
      // Save token first
      await AsyncStorage.setItem('token', data.token);

      // Create complete user data
      const userData = {
        id: data.user._id || data.user.id,
        _id: data.user._id || data.user.id, 
        fullName: data.user.fullName || data.user.name || '',
        name: data.user.fullName || data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        photo: data.user.photo || data.user.profilePicture || '',
        ...data.user
      };

      // Save user data
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      console.log('Login successful (pending auth):', userData.email || userData.fullName);

      // 👉 Huwag muna mag setUser / setIsAuthenticated dito
      return { success: true, data, user: userData };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
      return { success: false, message: 'Network error. Please check your internet connection.' };
    }
    return { success: false, message: 'Login failed. Please try again.' };
  }
};

  // Logout function - ONLY clears current user's data and auth
  const logout = async () => {
    try {
      const currentUserId = user?.id || user?._id;
      console.log('Logging out user:', user?.email || user?.fullName);
      
      // Optional: Create backup of current user's favorites before logout
      if (currentUserId) {
        try {
          await FavoritesMigrationHelper.backupUserFavorites(currentUserId);
        } catch (backupError) {
          console.warn('Backup error:', backupError);
        }
      }
      
      // Only clear auth data - NOT user-specific data like favorites
      await clearAuthData();
      
      // Reset auth state
      setUser(null);
      setIsAuthenticated(false);
      // Note: We don't reset isFirstTime here because the user has used the app before
      
      console.log('Logout completed - user data preserved');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force clear auth data
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Clear only auth data (token & user info) - keeps favorites
  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      console.log('Auth data cleared - favorites preserved');
    } catch (error) {
      console.error('Clear auth data error:', error);
    }
  };

  // Clear ALL app data (use only for complete app reset)
  const clearAllAppData = async (userId = null) => {
    try {
      console.warn('CLEARING ALL APP DATA - This will remove favorites!');
      
      // Get all keys first
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Keys to always clear
      const basicKeysToRemove = ['token', 'user'];
      
      // User-specific keys to clear if userId provided
      const userSpecificKeys = [];
      if (userId) {
        const userDataKeys = allKeys.filter(key => key.includes(`_${userId}`));
        userSpecificKeys.push(...userDataKeys);
      }
      
      // Global app keys
      const globalAppKeys = [
        'recentSearches',
        'appCache', 
        'tempData',
        'favorites' // Old global favorites
      ];
      
      // Combine all keys to remove
      const allKeysToRemove = [
        ...basicKeysToRemove,
        ...userSpecificKeys,
        ...globalAppKeys
      ];
      
      // Remove duplicates and filter existing keys
      const uniqueKeysToRemove = [...new Set(allKeysToRemove)];
      const existingKeysToRemove = uniqueKeysToRemove.filter(key => allKeys.includes(key));
      
      if (existingKeysToRemove.length > 0) {
        await AsyncStorage.multiRemove(existingKeysToRemove);
        console.log('Cleared keys:', existingKeysToRemove);
      }
      
      console.log('All app data cleared');
    } catch (error) {
      console.error('Clear all app data error:', error);
      // Fallback: clear essential data
      try {
        await AsyncStorage.clear(); // Nuclear option
        console.log('Storage cleared with nuclear option');
      } catch (fallbackError) {
        console.error('Nuclear clear failed:', fallbackError);
      }
    }
  };

  // Update user data
  const updateUser = async (newUserData) => {
    try {
      const updatedUser = { ...user, ...newUserData };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      console.log('User data updated:', updatedUser.email || updatedUser.fullName);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  };

  // Check auth status on app startup
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Auto-refresh token periodically (optional)
  useEffect(() => {
    if (isAuthenticated && initialAuthCheck) {
      const interval = setInterval(() => {
        checkAuthStatus(false); // Silent check
      }, 300000); // Check every 5 minutes

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, initialAuthCheck]);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    initialAuthCheck, // Add this so components know when initial check is done
    isFirstTime, // New: track if first time opening app
    showSplashOnLogout, // New: control splash screen on logout
    setShowSplashOnLogout, // New: function to trigger splash on logout
    login,
    logout,
    updateUser,
    checkAuthStatus,
    clearAllAppData, // Only for admin/dev use
     setUser,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};