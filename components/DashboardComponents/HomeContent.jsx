// screens/HomeScreen/components/HomeContent.jsx
import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import Banner from './Banner';
import ServicesGrid from './ServicesGrid';
import TestimonialsSection from './TestimonialsSection';

const HomeContent = ({ displayName, loading, onServicePress, userObj, refreshing, onRefresh }) => {
  const navigation = useNavigation();

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007d3f']}
          tintColor="#007d3f"
        />
      }
    >
      <Header
        displayName={displayName}
        onNotificationPress={() => navigation.navigate("NotificationScreen")}
      />
      <Banner />
      <ServicesGrid
        loading={loading}
        onServicePress={onServicePress}
      />
      <TestimonialsSection userObj={userObj} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 130,
    paddingTop: 27,
  },
});

export default HomeContent;