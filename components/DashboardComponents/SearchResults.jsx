// screens/HomeScreen/components/SearchResults.jsx
import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BigServiceCard from '../cards/BigServiceCard'

const SearchResults = ({ filteredStyles, loading, onImagePress }) => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    const isFootSpa = item.serviceName?.toLowerCase().includes("foot spa");
    return (
      <BigServiceCard
        serviceName={item.serviceName}
        styleData={item}
        onImagePress={() => onImagePress(item.imageUrl || item.image)}
        onBookPress={() =>
          navigation.navigate("BookingFormScreen", {
            serviceName: item.serviceName,
            styleName: item.name,
            stylePrice: item.price,
          })
        }
        isFootSpa={isFootSpa}
        searchCard={true}
      />
    );
  };

  const getItemKey = (item, index) => {
    return (
      item.searchId ||
      `${item.serviceName || "unknown"}-${item.name || "unnamed"}-${index}`
    );
  };

  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }
    return (
      <Text style={styles.emptyText}>No results found.</Text>
    );
  };

  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      data={filteredStyles}
      keyExtractor={getItemKey}
      numColumns={1}
      contentContainerStyle={styles.container}
      renderItem={renderItem}
      ListEmptyComponent={renderEmptyComponent}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    paddingTop: 20,
    gap: 12,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});

export default SearchResults;