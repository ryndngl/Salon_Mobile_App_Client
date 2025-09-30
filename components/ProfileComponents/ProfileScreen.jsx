import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFavorites } from "../../context/FavoritesContext";
import { useAuth } from "../../context/AuthContext";
// Components - same level lang kayo sa ProfileComponents folder
import ProfileHeader from "./ProfileHeader";
import ProfileCard from "./ProfileCard";
import FavoritesSection from "./FavoritesSection";
import PastBookingsSection from "./PastBookingsSection";
import PaymentMethodsSection from "./PaymentMethodsSection";
import LoyaltySection from "./LoyaltySection";
import LogoutSection from "./LogoutSection";
import LogoutConfirmModal from "./LogoutConfirmModal";
import LogoutSuccessModal from "./LogoutSuccessModal";

// Hooks - galing sa hooks folder (2 levels up)
import { useProfileData, usePhoneEditor, useLogoutFlow } from "../../hooks";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const {
    user: authUser,
    logout,
    updateUser,
    isAuthenticated,
    setShowSplashOnLogout,
  } = useAuth();
  const { refreshFavorites, count: favoritesCount } = useFavorites();

  // Custom hooks
  const { user, setUser, loading, dataLoaded, setDataLoaded } = useProfileData(
    authUser,
    isAuthenticated,
    updateUser,
    refreshFavorites
  );

  const { phoneEditable, handlePhoneChange, handleEditPress } = usePhoneEditor(
    user,
    setUser,
    updateUser
  );

  const {
    confirmVisible,
    setConfirmVisible,
    logoutSuccessVisible,
    scaleAnim,
    fadeAnim,
    confirmLogout,
    handleLogout,
  } = useLogoutFlow(logout, setShowSplashOnLogout, setUser, setDataLoaded);

  // Sample data - in real app, these should come from API based on user
  const pastBookings = [
    { service: "Hair Cut", date: "Jan 25, 2025" },
    { service: "Soft Gel", date: "Jan 10, 2025" },
    { service: "Hair Color", date: "Dec 28, 2024" },
  ];

  const paymentMethods = [
    { name: "GCash", isDefault: true },
    { name: "Credit/Debit Card", isDefault: false },
    { name: "Cash on Service", isDefault: false },
  ];

  const loyaltyPoints = 150;

  return (
    <>
      <View style={styles.container}>
        <ProfileHeader
          onBackPress={() => navigation.goBack()}
          onSettingsPress={() => navigation.navigate("SettingsScreen")}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <ProfileCard
            user={user}
            phoneEditable={phoneEditable}
            onPhoneChange={handlePhoneChange}
            onEditPress={handleEditPress}
          />

          <View style={styles.menuContainer}>
            <FavoritesSection
              favoritesCount={favoritesCount}
              onPress={() => navigation.navigate("FavoritesScreen")}
            />

            <PastBookingsSection bookings={pastBookings} />

            <PaymentMethodsSection paymentMethods={paymentMethods} />

            <LoyaltySection loyaltyPoints={loyaltyPoints} />

            <LogoutSection onLogoutPress={confirmLogout} />
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>App version 0.1</Text>
          </View>
        </ScrollView>
      </View>

      <LogoutConfirmModal
        visible={confirmVisible}
        onConfirm={handleLogout}
        onCancel={() => setConfirmVisible(false)}
      />

      <LogoutSuccessModal
        visible={logoutSuccessVisible}
        scaleAnim={scaleAnim}
        fadeAnim={fadeAnim}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  versionContainer: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 75,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
});