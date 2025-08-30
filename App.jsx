// App.jsx
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import "./firebaseConfig";

import { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Animated,
  Dimensions,
  ImageBackground,
  StatusBar,
  LogBox,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Linking from "expo-linking";

LogBox.ignoreLogs([
  "Warning: Text strings must be rendered within a <Text> component.",
]);

import Toast from "react-native-toast-message";

// Navigation
import "react-native-screens";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Context
import { BookingProvider } from "./context/BookingContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Screens
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import BottomTabNavigator from "./navigation/BottomTabNavigator";
import ServicesScreen from "./screens/ServicesScreen";
import ServiceDetailScreen from "./screens/ServiceDetailScreen";
import BookingScreen from "./screens/BookingScreen";
import BookingFormScreen from "./screens/BookingFormScreen";
import PaymentMethodScreen from "./screens/PaymentMethodScreen";
import GetStartedScreen from "./screens/GetStartedScreen";
import NotificationScreen from "./screens/NotificationScreen";
import BookingSummaryScreen from "./screens/BookingSummaryScreen";
import BookingConfirmationScreen from "./screens/BookingConfirmationScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";

// Help & Support Screens
import FAQScreen from "./screens/FAQScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import TermsConditionsScreen from "./screens/TermsConditionsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

// UPDATED: Deep linking configuration for password reset
const linking = {
  prefixes: [
    "salonmobileapp://",
    "exp://192.168.100.6:19000/--/",
    "http://192.168.100.6:5000/",
  ],
  config: {
    screens: {
      GetStarted: "get-started",
      LoginScreen: "login",
      Register: "register",
      ForgotPasswordScreen: "forgot-password",
      // MAIN ROUTE: For password reset deep linking
      ResetPasswordScreen: {
        path: "ResetPasswordScreen",
        parse: {
          token: (token) => {
            console.log("🔗 Deep link received token:", token);
            return token;
          },
        },
        stringify: {
          token: (token) => token,
        },
      },
      MainTabs: {
        screens: {
          Home: "home",
          Services: "services",
        },
      },
      // Help screens
      FAQs: "faqs",
      ContactUs: "contact-us",
      TermsConditions: "terms-conditions",
      PrivacyPolicy: "privacy-policy",
    },
  },
};

// Auth Navigator Component
const AuthNavigator = () => {
  const {
    isAuthenticated,
    isLoading,
    isFirstTime,
    showSplashOnLogout,
    setShowSplashOnLogout,
  } = useAuth();

  const splashFadeOut = useRef(new Animated.Value(1)).current;

  // ADDED: Deep link handling
  useEffect(() => {
    // Handle initial URL when app is opened via deep link
    const handleInitialURL = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          console.log("🚀 App opened with URL:", initialUrl);
        }
      } catch (error) {
        console.error("❌ Error getting initial URL:", error);
      }
    };

    // Handle URLs when app is already running
    const handleDeepLink = (event) => {
      console.log("🔗 Deep link received while app running:", event.url);
    };

    handleInitialURL();

    // Listen for incoming links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (showSplashOnLogout) {
      splashFadeOut.setValue(1);
      const timer = setTimeout(() => {
        Animated.timing(splashFadeOut, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setShowSplashOnLogout(false);
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSplashOnLogout]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ImageBackground
          source={require("./assets/SplashScreenImage/BGIMG.jpg")}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        >
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#d13f3f" />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        </ImageBackground>
      </View>
    );
  }

  if (showSplashOnLogout) {
    return (
      <Animated.View
        style={[styles.splashContainer, { opacity: splashFadeOut }]}
      >
        <ImageBackground
          source={require("./assets/SplashScreenImage/BGIMG.jpg")}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        />
      </Animated.View>
    );
  }

  return (
    <Stack.Navigator
      initialRouteName={
        isAuthenticated ? "MainTabs" : isFirstTime ? "GetStarted" : "LoginScreen"
      }
      screenOptions={{
        headerShown: false,
        animation: "fade",
      }}
    >
      {/* UPDATED: Always available screens (including when authenticated) */}
      <Stack.Screen name="GetStarted" component={GetStartedScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* PASSWORD RESET SCREENS - Always available for deep linking */}
      <Stack.Screen 
        name="ForgotPasswordScreen" 
        component={ForgotPasswordScreen}
        options={{
          title: "Forgot Password",
        }}
      />
      <Stack.Screen 
        name="ResetPasswordScreen" 
        component={ResetPasswordScreen}
        options={{
          title: "Reset Password",
        }}
      />
      
      {/* Help screens - always available */}
      <Stack.Screen name="FAQs" component={FAQScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="TermsConditions" component={TermsConditionsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

      {/* Authenticated screens */}
      {isAuthenticated && (
        <>
          <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
          <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
          <Stack.Screen
            name="ServiceDetailScreen"
            component={ServiceDetailScreen}
          />
          <Stack.Screen name="BookingScreen" component={BookingScreen} />
          <Stack.Screen
            name="BookingFormScreen"
            component={BookingFormScreen}
            options={{ title: "Booking Details", headerShown: true }}
          />
          <Stack.Screen
            name="BookingSummaryScreen"
            component={BookingSummaryScreen}
          />
          <Stack.Screen
            name="PaymentMethodScreen"
            component={PaymentMethodScreen}
          />
          <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{ title: "Notifications", headerShown: true }}
          />
          <Stack.Screen
            name="BookingConfirmationScreen"
            component={BookingConfirmationScreen}
          />
          <Stack.Screen name="FavoritesScreen" component={FavoritesScreen} />
          <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

// Main App Component
const AppContent = () => {
  const [isAppReady, setIsAppReady] = useState(false);
  const splashFadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let splashTimer;
    splashTimer = setTimeout(() => {
      Animated.timing(splashFadeOut, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setIsAppReady(true);
      });
    }, 2000);
    return () => {
      if (splashTimer) clearTimeout(splashTimer);
    };
  }, []);

  if (!isAppReady) {
    return (
      <Animated.View
        style={[styles.splashContainer, { opacity: splashFadeOut }]}
      >
        <ImageBackground
          source={require("./assets/SplashScreenImage/BGIMG.jpg")}
          style={styles.backgroundImage}
          imageStyle={styles.backgroundImageStyle}
        />
      </Animated.View>
    );
  }

  return (
    <BookingProvider>
      <FavoritesProvider>
        <NavigationContainer
          linking={linking}
          onReady={() => {
            console.log("🚀 Navigation is ready!");
          }}
          onStateChange={(state) => {
            // Debug deep linking navigation
            console.log("🧭 Navigation state changed");
            if (state) {
              const currentRoute = state.routes[state.index];
              console.log("📍 Current route:", currentRoute.name);
              if (currentRoute.params) {
                console.log("📋 Route params:", currentRoute.params);
              }
            }
          }}
          fallback={
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#d13f3f" />
              <Text style={styles.loadingText}>Loading navigation...</Text>
            </View>
          }
        >
          <AuthNavigator />
          <StatusBar style="dark" />
          <Toast />
        </NavigationContainer>
      </FavoritesProvider>
    </BookingProvider>
  );
};

// Root App Component
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImageStyle: {
    resizeMode: "cover",
  },
  loadingOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#d13f3f",
    fontWeight: "500",
  },
});