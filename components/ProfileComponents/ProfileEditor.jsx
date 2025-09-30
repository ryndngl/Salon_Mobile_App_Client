import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function usePhoneEditor(user, setUser, updateUser) {
  const [phoneEditable, setPhoneEditable] = useState(false);

  const handlePhoneChange = (text) => {
    setUser({ ...user, phone: text });
  };

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
            timeout: 10000,
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

  const handleEditPress = () => {
    if (phoneEditable) {
      handleUpdatePhone();
    } else {
      setPhoneEditable(true);
    }
  };

  return {
    phoneEditable,
    handlePhoneChange,
    handleEditPress,
  };
}