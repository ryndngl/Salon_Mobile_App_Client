import { useState, useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useLoginAnimation = () => {
  const [loginSuccessVisible, setLoginSuccessVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (loginSuccessVisible) {
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
  }, [loginSuccessVisible]);

  const showSuccessModal = () => {
    setLoginSuccessVisible(true);
  };

  const hideSuccessModal = () => {
    setLoginSuccessVisible(false);
  };

  return {
    loginSuccessVisible,
    scaleAnim,
    fadeAnim,
    showSuccessModal,
    hideSuccessModal,
  };
};