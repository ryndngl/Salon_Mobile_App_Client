// screens/HomeScreen/components/Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ displayName, onNotificationPress, unreadCount = 0 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.name}>{displayName}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onNotificationPress}>
        <View style={{ position: "relative" }}>
          <Icon name="notifications" size={31} color="#ffcc00" />
          
          {/*  CONDITIONAL BADGE - Show only if unreadCount > 0 */}
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              {unreadCount > 9 ? (
                <Text style={styles.badgeText}>9+</Text>
              ) : (
                <Text style={styles.badgeText}>{unreadCount}</Text>
              )}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 16,
    borderColor: "#D4D4D4",
    elevation: 2,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 16,
    color: "#777",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  notifBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#e74c3c",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Header;