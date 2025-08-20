import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingScreen from '../screens/BookingScreen'; 


const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: (props) => (
          <Pressable
            android_ripple={null}
            style={({ pressed }) => [
              styles.buttonStyle,
              pressed && Platform.OS === 'ios' && { opacity: 0.7 }
            ]}
            {...props}
          />
        ),
        tabBarIcon: ({ focused }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={styles.iconWrapper}>
              <Ionicons name={iconName} size={26} color={focused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'} />
              {focused && <View style={styles.activeDot} />}
            </View>
          );
        },
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
     <Tab.Screen name="Bookings" component={BookingScreen}/>
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#800000',
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 15,
    paddingTop: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    shadowColor: 'transparent',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  buttonStyle: {
    flex: 1,
  },
});