import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function ProfileCard({ 
  user, 
  phoneEditable, 
  onPhoneChange,
  onEditPress 
}) {
  return (
    <View style={styles.profileCard}>
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user.photo ? (
            <Image
              source={{ uri: user.photo }}
              style={styles.profileImage}
            />
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
          <Text style={styles.userName}>
            {user.fullName || "No name"}
          </Text>
          <Text style={styles.userEmail}>{user.email || "No email"}</Text>
          {phoneEditable ? (
            <TextInput
              style={styles.phoneInput}
              placeholder="+63 --- --- ----"
              value={user.phone}
              onChangeText={onPhoneChange}
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
        onPress={onEditPress}
      >
        <Text style={styles.editButtonText}>
          {phoneEditable ? "Save Phone" : "Edit Profile"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
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
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#666",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
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
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: "center",
    width: 160,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    flexWrap: "wrap",
  },
});