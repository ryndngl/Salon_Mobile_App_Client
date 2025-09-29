import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { timeSlots } from './bookingData';

export default function TimeSlotSelector({ selectedTime, onTimeSelect }) {
  return (
    <View>
      <Text style={styles.label}>Select Time Slot:</Text>
      <View style={styles.timeSlotContainer}>
        {timeSlots.map((slot, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.timeSlot,
              selectedTime === slot && styles.selectedTimeSlot,
            ]}
            onPress={() => onTimeSelect(slot)}
          >
            <Text
              style={[
                styles.timeSlotText,
                selectedTime === slot && styles.selectedTimeSlotText,
              ]}
            >
              {slot}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    margin: 5,
    backgroundColor: "#f9f9f9",
  },
  selectedTimeSlot: {
    backgroundColor: "#0080ff",
    borderColor: "#0080ff",
  },
  timeSlotText: {
    color: "#333",
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "bold",
  },
});