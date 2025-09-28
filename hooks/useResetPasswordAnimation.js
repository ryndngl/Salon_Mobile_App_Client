import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useResetPasswordAnimation = () => {
  const [resetSuccessVisible, setResetSuccessVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (resetSuccessVisible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.5);
      fadeAnim.setValue(0);
    }
  }, [resetSuccessVisible]);

  const showResetSuccessModal = () => {
    setResetSuccessVisible(true);
  };

  const hideResetSuccessModal = () => {
    setResetSuccessVisible(false);
  };

  return {
    resetSuccessVisible,
    scaleAnim,
    fadeAnim,
    showResetSuccessModal,
    hideResetSuccessModal,
  };
};