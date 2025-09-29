import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function PriceNote({ isHairColor, selectedCategory }) {
  const categoriesToShow = ["Full Hair", "Highlight", "Balayage"];
  
  if (!isHairColor || !categoriesToShow.includes(selectedCategory)) {
    return null;
  }

  return (
    <Text style={styles.noteText}>
      Note: Prices may vary depending on hair length.
    </Text>
  );
}

const styles = StyleSheet.create({
  noteText: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    marginBottom: 17,
    textAlign: 'left',
    paddingHorizontal: 5,
  },
});