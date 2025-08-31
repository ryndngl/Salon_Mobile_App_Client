
import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('SelectDateTimeScreen', { selectedService: item.name })
      }
    >
      <Image source={item.image} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to Van's Glow-Up Salon!</Text>
      <Text style={styles.subHeader}>Popular Services</Text>

      <FlatList
        data={servicesData}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  list: {
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#545454',
    borderRadius: 10,
    padding: 10,
    margin: 8,
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
