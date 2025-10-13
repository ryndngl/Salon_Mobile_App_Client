// screens/HomeScreen/Components/HomeContent.jsx
import React from 'react';
import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from './Header';
import Banner from './Banner';
import ServicesGrid from './ServicesGrid';
import TestimonialsSection from './TestimonialsSection';

const HomeContent = ({ displayName, loading, onServicePress, userObj, refreshing, onRefresh, unreadCount }) => {
  const navigation = useNavigation();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#7a0000']}
          tintColor="#7a0000"
        />
      }
    >
      <Header 
        displayName={displayName}
        onNotificationPress={() => navigation.navigate("NotificationScreen")}
        unreadCount={unreadCount}
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