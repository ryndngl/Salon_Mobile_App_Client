// screens/HomeScreen/HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHomeScreen } from '../../hooks';
import { notificationService } from '../../services/notificationService';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import HomeContent from './HomeContent';
import ImageModal from './ImageModal';

const HomeScreen = () => {
  const navigation = useNavigation();
  
  const {
    searchQuery,
    setSearchQuery,
    filteredStyles,
    handleClearSearch,
    modalVisible,
    setModalVisible,
    selectedImage,
    loading,
    displayName,
    userObj,
    refreshing,    
    onRefresh,     
    handleServicePress,
    openImageModal,
  } = useHomeScreen();

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (!userData) return;

      const user = JSON.parse(userData);
      const userId = user._id || user.id;

      const data = await notificationService.getUserNotifications(userId);
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
      
      console.log('📬 Unread notifications:', unread);
    } catch (error) {
      console.error('Fetch unread count error:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('🔄 HomeScreen focused - refreshing badge count');
      fetchUnreadCount();
    });

    return unsubscribe;
  }, [navigation]);

  // ✅ CUSTOM REFRESH HANDLER (includes badge refresh)
  const handleRefresh = async () => {
    await Promise.all([
      onRefresh(), // Original refresh (bookings, etc.)
      fetchUnreadCount() // Refresh badge count
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onClearSearch={handleClearSearch}
        loading={loading}
      />

      {searchQuery.trim() === "" ? (
        <HomeContent
          displayName={displayName}
          loading={loading}
          onServicePress={handleServicePress}
          onImagePress={openImageModal}
          userObj={userObj}
          refreshing={refreshing}
          onRefresh={handleRefresh} // ✅ Use new handler
          unreadCount={unreadCount}
        />
      ) : (
        <SearchResults
          filteredStyles={filteredStyles}
          loading={loading}
          onImagePress={openImageModal}
        />
      )}

      <ImageModal
        visible={modalVisible}
        selectedImage={selectedImage}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;