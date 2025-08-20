import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  initializeAuth, 
  getAuth,
  getReactNativePersistence 
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBAS409-zb6ET8ZQhSztD9pJNfHb3d5Mpk",
  authDomain: "salon-booking-app-2d85f.firebaseapp.com",
  projectId: "salon-booking-app-2d85f",
  storageBucket: "salon-booking-app-2d85f.appspot.com",
  messagingSenderId: "365428725051",
  appId: "1:365428725051:web:49e45831f046fcbcac531e",
};

// ✅ Initialize Firebase App once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// ✅ Always use initializeAuth ONCE with persistence in React Native
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  // If already initialized, just get the existing instance
  auth = getAuth(app);
}

export { app, auth };
