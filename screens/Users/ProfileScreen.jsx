import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Image,
  ScrollView,
  Switch,
  StyleSheet,
  TextInput,
  Alert
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user: authUser, logout, updateUser, isAuthenticated, setShowSplashOnLogout } = useAuth();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [logoutSuccessVisible, setLogoutSuccessVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promos, setPromos] = useState(false);
  const { favorites, refreshFavorites, count: favoritesCount } = useFavorites();
  const [user, setUser] = useState({
    _id: null,
    fullName: "",
    email: "",
    phone: "",
    photo: "",
  });
  const [phoneEditable, setPhoneEditable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Initialize user data from AuthContext
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
                  timeout: 5000
                }
              );
              
              // Update with fresh data from server
              const freshUserData = {
                _id: response.data.id || response.data._id,
                fullName: response.data.fullName || response.data.name || userData.fullName,
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
            console.warn("Could not fetch fresh user data:", fetchError.message);
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

  const handleUpdatePhone = async () => {
    if (!user.phone.trim()) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken && user._id) {
        await axios.put(
          `http://192.168.100.6:5000/api/users/${user._id}`,
          { phone: user.phone },
          { 
            headers: { Authorization: `Bearer ${storedToken}` },
            timeout: 10000
          }
        );
        
        // Update AuthContext with new phone number
        const updatedUserData = { ...user, phone: user.phone };
        await updateUser(updatedUserData);
        setUser(updatedUserData);
        
        Alert.alert("Success", "Phone number updated successfully");
      }
      setPhoneEditable(false);
    } catch (error) {
      console.error("Failed to update phone:", error);
      Alert.alert("Error", "Failed to update phone number");
    }
  };

  const confirmLogout = () => setConfirmVisible(true);

  const handleLogout = async () => {
    setConfirmVisible(false);
    try {
      // Show logout animation
      setLogoutSuccessVisible(true);
      scaleAnim.setValue(0.5);
      fadeAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(scaleAnim, { 
          toValue: 1, 
          friction: 3, 
          tension: 120, 
          useNativeDriver: true 
        }),
        Animated.timing(fadeAnim, { 
          toValue: 1, 
          duration: 300, 
          easing: Easing.out(Easing.ease), 
          useNativeDriver: true 
        }),
      ]).start();

      // Wait for animation, then logout
      setTimeout(async () => {
        // Hide the success modal first
        Animated.parallel([
          Animated.timing(fadeAnim, { 
            toValue: 0, 
            duration: 200, 
            easing: Easing.in(Easing.ease), 
            useNativeDriver: true 
          }),
          Animated.timing(scaleAnim, { 
            toValue: 0.8, 
            duration: 200, 
            useNativeDriver: true 
          }),
        ]).start(async () => {
          setLogoutSuccessVisible(false);
          
          try {
            // Set flag to show splash screen after logout
            setShowSplashOnLogout(true);
            
            // This will only clear auth data, not user favorites
            await logout();
            
            // Reset local state
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
      // Fallback: direct logout without animation
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

  // Sample data - in real app, these should come from API based on user
  const pastBookings = [
    { service: 'Hair Cut', date: 'Jan 25, 2025' },
    { service: 'Soft Gel', date: 'Jan 10, 2025' },
    { service: 'Hair Color', date: 'Dec 28, 2024' },
  ];

  const paymentMethods = [
    { name: 'GCash', isDefault: true },
    { name: 'Credit/Debit Card', isDefault: false },
    { name: 'Cash on Service', isDefault: false },
  ];

  const [loyaltyPoints, setLoyaltyPoints] = useState(150);

  const menuSections = [
    {
      title: 'Favorites',
      items: [
        {
          key: 'favorites-nav',
          icon: 'favorite',
          label: `View All Favorites (${favoritesCount || 0})`,
          onPress: () => navigation.navigate('FavoritesScreen')
        }
      ]
    },
    {
      title: 'Past Bookings',
      items: pastBookings.map(booking => ({
        icon: 'history',
        label: `${booking.service} - ${booking.date}`,
        hasAction: true,
        actionText: 'Book Again'
      }))
    },
    {
      title: 'Payment Methods',
      items: [
        ...paymentMethods.map(method => ({
          icon: 'payment',
          label: method.name,
          isDefault: method.isDefault,
          hasToggle: true
        })),
        { icon: 'add', label: 'Add Payment Method', hasAction: true }
      ]
    },
    {
      title: 'Loyalty & Rewards',
      items: [
        { icon: 'stars', label: `You have ${loyaltyPoints} points`, isPoints: true },
        { icon: 'redeem', label: 'Redeem Rewards', hasAction: true }
      ]
    },
    {
      title: '',
      items: [
        { icon: 'logout', label: 'Log Out', isLogout: true, onPress: confirmLogout },
      ]
    }
  ];

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SettingsScreen')}>
            <Icon name="settings" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
          <View style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.profileImageContainer}>
                {user.photo ? (
                  <Image source={{ uri: user.photo }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderCircle}>
                    <Icon name="person" size={40} color="#999" />
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <Icon name="camera-alt" size={12} color="#fff" />
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>{user.fullName || "No name"}</Text>
                <Text style={styles.userEmail}>{user.email || "No email"}</Text>
                {phoneEditable ? (
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="+63 --- --- ----"
                    value={user.phone}
                    onChangeText={(text) => setUser({ ...user, phone: text })}
                    keyboardType="phone-pad"
                    placeholderTextColor="#aaa"
                  />
                ) : (
                  <Text style={styles.userPhone}>
                    {user.phone || "No phone number"}
                  </Text>
                )}
              </View>
            </View>
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={phoneEditable ? handleUpdatePhone : () => setPhoneEditable(true)}
            >
              <Text style={styles.editButtonText}>
                {phoneEditable ? "Save Phone" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.menuContainer}>
            {menuSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.menuSection}>
                {section.title && (
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                )}
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex}>
                    <TouchableOpacity style={styles.menuItem} onPress={item.onPress || (() => {})}>
                      <View style={styles.menuItemLeft}>
                        <Icon 
                          name={item.icon} 
                          size={20} 
                          color={item.isLogout ? "#d13f3f" : item.isPoints ? "#4CAF50" : "#666"}
                        />
                        <View style={styles.menuItemContent}>
                          <Text style={[
                            styles.menuItemText,
                            item.isLogout && styles.logoutText,
                            item.isPoints && styles.pointsText
                          ]}>
                            {item.label}
                          </Text>
                          {item.isDefault && <Text style={styles.defaultText}>Default</Text>}
                        </View>
                      </View>
                      <View style={styles.menuItemRight}>
                        {item.hasSwitch && (
                          <Switch
                            value={item.value}
                            onValueChange={item.onChange}
                            trackColor={{ false: "#ddd", true: "#4CAF50" }}
                            thumbColor="#fff"
                          />
                        )}
                        {!item.hasSwitch && !item.hasAction && !item.isLogout && (
                          <Icon name="chevron-right" size={20} color="#ccc" />
                        )}
                      </View>
                    </TouchableOpacity>
                    {itemIndex < section.items.length - 1 && (
                      <View style={styles.menuDivider} />
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>

          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>App version 0.1</Text>
          </View>
        </ScrollView>
      </View>

      <Modal transparent visible={confirmVisible} animationType="fade" statusBarTranslucent>
        <View style={styles.confirmContainer}>
          <View style={styles.confirmBox}>
            <Text style={styles.confirmTitle}>Are you sure?</Text>
            <Text style={styles.confirmMessage}>
              Do you really want to log out?
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: "#d13f3f" }]} onPress={handleLogout}>
                <Text style={styles.confirmBtnText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.confirmBtn, 
                  { 
                    backgroundColor: "#f5f5f5", 
                    borderColor: "#ddd", 
                    borderWidth: 1 
                  }
                ]} 
                onPress={() => setConfirmVisible(false)}
              >
                <Text style={[styles.confirmBtnText, { color: "#666" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={logoutSuccessVisible} animationType="fade" statusBarTranslucent>
        <View style={styles.confirmContainer}>
          <Animated.View style={[
            styles.confirmBox,
            { transform: [{ scale: scaleAnim }], opacity: fadeAnim },
          ]}>
            <Icon name="logout" size={48} color="#4CAF50" />
            <Text style={styles.confirmTitle}>Logged Out Successfully!</Text>
            <Text style={styles.confirmMessage}>Redirecting to login...</Text>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 55,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderCircle: {
    width: 95,
    height: 95,
    borderRadius: 50,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#666',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#666',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: 160,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  menuContainer: {
    paddingHorizontal: 16,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  placeholderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 12,
    fontStyle: 'italic',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  defaultText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  logoutText: {
    color: '#d13f3f',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 48,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 75,
  },
  versionText: {
    fontSize: 14,
    color: '#999',
  },
  confirmContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 9999,
  },
  confirmBox: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  confirmTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 8,
    color: "#333",
  },
  confirmMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmBtn: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  confirmBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
});