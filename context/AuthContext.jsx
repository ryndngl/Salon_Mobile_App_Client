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
  
  // FIXED: Proper splash screen states
  const [isFirstTime, setIsFirstTime] = useState(false); // Default to false
  const [showSplashOnLogout, setShowSplashOnLogout] = useState(false);

  // FIXED: Check authentication status with proper first-time logic
  const checkAuthStatus = async (showLogs = true) => {
    try {
      if (showLogs) setIsLoading(true);
      
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');
      const hasEverLoggedIn = await AsyncStorage.getItem('hasEverLoggedIn');
      
      // FIXED: Proper first time detection
      if (hasEverLoggedIn === null) {
        // Truly first time - never opened app before
        setIsFirstTime(true);
        await AsyncStorage.setItem('hasEverLoggedIn', 'false'); // Mark as opened
        if (showLogs) {
          console.log('First time user detected');
        }
      } else {
        // User has opened app before
        setIsFirstTime(false);
        if (showLogs) {
          console.log('Returning user');
        }
      }

      // Check if user is authenticated
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
        timeout: 10000,
      });

      if (response.ok) {
        const data = await response.json();
        return data.isSuccess;
      }
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      // For network errors, assume token is still valid to allow offline usage
      return true;
    }
  };

  // FIXED: Login function with proper state management
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
        
        // FIXED: Mark that user has successfully logged in
        await AsyncStorage.setItem('hasEverLoggedIn', 'true');
        
        // Update states
        setUser(userData);
        setIsAuthenticated(true);
        setIsFirstTime(false); // User is no longer first time after login
        
        console.log('Login successful:', userData.email || userData.fullName);

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

  // FIXED: Logout function - keeps hasEverLoggedIn
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
      
      // FIXED: Only clear auth data, keep hasEverLoggedIn
      await AsyncStorage.multiRemove(['token', 'user']);
      
      // Reset auth state but keep first time as false
      setUser(null);
      setIsAuthenticated(false);
      setShowSplashOnLogout(true); // Show splash animation
      // isFirstTime stays false since user has used app before
      
      console.log('Logout completed - login history preserved');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force clear auth data
      await AsyncStorage.multiRemove(['token', 'user']);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Clear only auth data (token & user info) - keeps everything else
  const clearAuthData = async () => {
    try {
      await AsyncStorage.multiRemove(['token', 'user']);
      console.log('Auth data cleared - app history preserved');
    } catch (error) {
      console.error('Clear auth data error:', error);
    }
  };

  // FIXED: Complete app reset function (for dev/admin use only)
  const clearAllAppData = async (userId = null) => {
    try {
      console.warn('CLEARING ALL APP DATA - This will reset everything!');
      
      // Get all keys first
      const allKeys = await AsyncStorage.getAllKeys();
      
      // Clear everything including hasEverLoggedIn
      await AsyncStorage.clear();
      
      // Reset all states to initial values
      setUser(null);
      setIsAuthenticated(false);
      setIsFirstTime(true); // Reset to true since we cleared everything
      setShowSplashOnLogout(false);
      
      console.log('All app data cleared - app will show GetStarted on next launch');
    } catch (error) {
      console.error('Clear all app data error:', error);
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
    initialAuthCheck,
    isFirstTime,
    showSplashOnLogout,
    setShowSplashOnLogout,
    login,
    logout,
    updateUser,
    checkAuthStatus,
    clearAllAppData,
    setUser,
    setIsAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};