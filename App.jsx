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
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

// Help & Support Screens
import FAQScreen from "./screens/FAQScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import TermsConditionsScreen from "./screens/TermsConditionsScreen";
import PrivacyPolicyScreen from "./screens/PrivacyPolicyScreen";

const Stack = createNativeStackNavigator();
const { width, height } = Dimensions.get("window");

export default function App() {
  const [user, setUser] = useState(null);
  const [isAppReady, setIsAppReady] = useState(false);
  const splashFadeOut = useRef(new Animated.Value(1)).current;
  const [showGetStarted, setShowGetStarted] = useState(true);

  useEffect(() => {
    let splashTimer;
    let appLoadCompleted = false;

    const checkAppReadiness = () => {
      if (appLoadCompleted) {
        Animated.timing(splashFadeOut, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          setIsAppReady(true);
        });
      }
    };

    splashTimer = setTimeout(() => {
      appLoadCompleted = true;
      checkAppReadiness();
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BookingProvider>
        <FavoritesProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={"GetStarted"}
            >
              <Stack.Screen
                name="GetStarted"
                component={GetStartedScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Register"
                component={RegisterScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="MainTabs"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ServicesScreen"
                component={ServicesScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ServiceDetailScreen"
                component={ServiceDetailScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BookingScreen"
                component={BookingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BookingFormScreen"
                component={BookingFormScreen}
                options={{ title: "Booking Details" }}
              />
              <Stack.Screen
                name="BookingSummaryScreen"
                component={BookingSummaryScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PaymentMethodScreen"
                component={PaymentMethodScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{ title: "Notifications" }}
              />
              <Stack.Screen
                name="BookingConfirmationScreen"
                component={BookingConfirmationScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="FavoritesScreen"
                component={FavoritesScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{ headerShown: false }}
              />

              {/* Help & Support Screens */}
              <Stack.Screen
                name="FAQs"
                component={FAQScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="ContactUs"
                component={ContactUsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TermsConditions"
                component={TermsConditionsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="PrivacyPolicy"
                component={PrivacyPolicyScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>

            <StatusBar style="dark" />
            <Toast />
          </NavigationContainer>
        </FavoritesProvider>
      </BookingProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
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
});