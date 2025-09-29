import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CategoryTabs({ 
  categories, 
  selectedCategory, 
  onCategorySelect 
}) {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <View style={styles.tabs}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          style={[
            styles.tabButton, 
            selectedCategory === category && styles.activeTab
          ]}
          onPress={() => onCategorySelect(category)}
        >
          <Text 
            style={[
              styles.tabText, 
              selectedCategory === category && styles.activeTabText
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 8,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: '#7a0000',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#7a0000',
    fontWeight: 'bold',
  },
});