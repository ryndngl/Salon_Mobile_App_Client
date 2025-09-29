import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { hairColorOptions, hairColorStyles } from './bookingData';

export default function HairColorSelector({ 
  category, 
  style, 
  passedStyle,
  onCategorySelect, 
  onStyleSelect 
}) {
  return (
    <>
      <Text style={styles.label}>Category:</Text>
      {passedStyle ? (
        <View style={styles.input}>
          <Text>{category}</Text>
        </View>
      ) : (
        <View style={styles.optionsContainer}>
          {hairColorOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                category === option && styles.optionButtonSelected,
              ]}
              onPress={() => onCategorySelect(option)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  category === option && styles.optionButtonTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {category && (
        <>
          <Text style={styles.label}>Style:</Text>
          {passedStyle ? (
            <View style={styles.input}>
              <Text>{style}</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {hairColorStyles[category].map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionButton,
                    style === opt && styles.optionButtonSelected,
                  ]}
                  onPress={() => onStyleSelect(opt)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      style === opt && styles.optionButtonTextSelected,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </>
      )}
    </>
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