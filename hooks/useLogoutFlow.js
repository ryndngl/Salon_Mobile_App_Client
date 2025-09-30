import { useState, useRef } from "react";
import { Alert, Animated, Easing } from "react-native";

export function useLogoutFlow(logout, setShowSplashOnLogout, setUser, setDataLoaded) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const confirmLogout = () => setConfirmVisible(true);

  const handleLogout = async () => {
    setConfirmVisible(false);
    try {
      setLogoutSuccessVisible(true);
      scaleAnim.setValue(0.5);
      fadeAnim.setValue(0);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 3,
          tension: 120,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(async () => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(async () => {
          setLogoutSuccessVisible(false);

          try {
            setShowSplashOnLogout(true);
            await logout();
            setUser({
              _id: null,
              fullName: "",
              email: "",
              phone: "",
              photo: "",
            });
            setDataLoaded(false);
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        });
      }, 1500);
    } catch (error) {
      console.error("Logout animation failed:", error);
      setShowSplashOnLogout(true);
      await logout();
      setUser({
        _id: null,
        fullName: "",
        email: "",
        phone: "",
        photo: "",
      });
      setDataLoaded(false);
    }
  };

  return {
    confirmVisible,
    setConfirmVisible,
    logoutSuccessVisible,
    scaleAnim,
    fadeAnim,
    confirmLogout,
    handleLogout,
  };
}