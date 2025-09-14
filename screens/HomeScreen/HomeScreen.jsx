// screens/HomeScreen/HomeScreen.jsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeScreen } from './hooks/useHomeScreen';
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import HomeContent from './components/HomeContent';
import ImageModal from './components/ImageModal';

const HomeScreen = () => {
  const {
    // Search related
    searchQuery,
    setSearchQuery,
    filteredStyles,
    handleClearSearch,
    
    // Modal states
    modalVisible,
    setModalVisible,
    selectedImage,
    
    // Other states
    loading,
    displayName,
     userObj,

    // Handlers
    handleServicePress,
    openImageModal,
  } = useHomeScreen();

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