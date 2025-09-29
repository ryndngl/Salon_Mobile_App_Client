import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { allServices } from './bookingData';

export default function ServiceTypeSelector({ 
  serviceName, 
  onServiceSelect 
}) {
  return (
    <View>
      <Text style={styles.label}>Service Type:</Text>
      <View style={styles.optionsContainer}>
        {allServices.map((service) => (
          <TouchableOpacity
            key={service}
            style={[
              styles.optionButton,
              serviceName === service && styles.optionButtonSelected,
            ]}
            onPress={() => onServiceSelect(service)}
          >
            <Text
              style={[
                styles.optionButtonText,
                serviceName === service && styles.optionButtonTextSelected,
              ]}
            >
              {service}
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
  optionsContainer: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: "#0080ff",
    borderColor: "#0080ff",
  },
  optionButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  optionButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});