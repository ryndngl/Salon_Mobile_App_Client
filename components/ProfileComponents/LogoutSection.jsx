import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function LogoutSection({ onLogoutPress }) {
  return (
    <View style={styles.menuSection}>
      <TouchableOpacity style={styles.menuItem} onPress={onLogoutPress}>
        <View style={styles.menuItemLeft}>
          <Icon name="logout" size={20} color="#d13f3f" />
          <View style={styles.menuItemContent}>
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  logoutText: {
    fontSize: 16,
    color: "#d13f3f",
  },
});