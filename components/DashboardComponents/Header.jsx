// screens/HomeScreen/components/Header.jsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({ displayName, onNotificationPress }) => {
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
          <View style={styles.notifBadge} />
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
    top: -2,
    right: -2,
    backgroundColor: "red",
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
});

export default Header;