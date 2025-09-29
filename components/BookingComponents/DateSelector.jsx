import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DateSelector({ 
  date, 
  showDatePicker, 
  onShowPicker, 
  onDateChange 
}) {
  return (
    <View>
      <Text style={styles.label}>Date:</Text>
      <TouchableOpacity
        onPress={onShowPicker}
        style={styles.input}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginTop: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});