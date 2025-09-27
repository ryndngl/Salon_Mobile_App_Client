// screens/HomeScreen/components/SearchBar.jsx
import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchBar = ({ searchQuery, setSearchQuery, onClearSearch, loading }) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Icon name="search" size={20} color="#d13f3f" style={styles.searchIcon} />
        <TextInput
          placeholder="Search styles"
          placeholderTextColor="#aaa"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          style={styles.searchInput}
          editable={!loading}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={onClearSearch}>
            <Icon name="close-circle" size={20} color="#999" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: "#fff",
    zIndex: 1,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 10,
  },
});

export default SearchBar;