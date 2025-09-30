import { useState, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export function useProfileData(authUser, isAuthenticated, updateUser, refreshFavorites) {
  const [user, setUser] = useState({
    _id: null,
    fullName: "",
    email: "",
    phone: "",
    photo: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        if (!isAuthenticated || !authUser) {
          // Reset user data if not authenticated
          setUser({
            _id: null,
            fullName: "",
            email: "",
            phone: "",
            photo: "",
          });
          setDataLoaded(false);
          return;
        }

        // Don't re-initialize if already loaded for this user
        if (dataLoaded && user._id === (authUser.id || authUser._id)) {
          return;
        }

        setLoading(true);

        // Initialize with AuthContext user data
        const userData = {
          _id: authUser.id || authUser._id,
          fullName: authUser.fullName || authUser.name || "",
          email: authUser.email || "",
          phone: authUser.phone || "",
          photo: authUser.photo || authUser.profilePicture || "",
        };

        setUser(userData);

        // Try to fetch fresh data from server
        if (authUser.id || authUser._id) {
          try {
            const userId = authUser.id || authUser._id;
            const storedToken = await AsyncStorage.getItem("token");

            if (storedToken) {
              const response = await axios.get(
                `http://192.168.100.6:5000/api/users/${userId}`,
                {
                  headers: { Authorization: `Bearer ${storedToken}` },
                  timeout: 5000,
                }
              );

              // Update with fresh data from server
              const freshUserData = {
                _id: response.data.id || response.data._id,
                fullName:
                  response.data.fullName ||
                  response.data.name ||
                  userData.fullName,
                email: response.data.email || userData.email,
                phone: response.data.phone || userData.phone || "",
                photo: response.data.photo || userData.photo || "",
              };

              setUser(freshUserData);

              // Update AuthContext with fresh data if it's different
              if (JSON.stringify(freshUserData) !== JSON.stringify(userData)) {
                updateUser(freshUserData);
              }
            }
          } catch (fetchError) {
            console.warn(
              "Could not fetch fresh user data:",
              fetchError.message
            );
            // Continue with cached data
          }
        }

        setDataLoaded(true);

        // Refresh favorites to ensure they're loaded for this user
        setTimeout(() => {
          refreshFavorites();
        }, 100);
      } catch (error) {
        console.error("Failed to initialize user data:", error);
        Alert.alert("Error", "Failed to load user information");
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();
  }, [isAuthenticated, authUser?.id, authUser?._id, authUser?.email]);

  return {
    user,
    setUser,
    loading,
    dataLoaded,
    setDataLoaded,
  };
}