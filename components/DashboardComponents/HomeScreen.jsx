// screens/HomeScreen/HomeScreen.jsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHomeScreen } from '../../hooks';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import HomeContent from './HomeContent';
import ImageModal from './ImageModal';

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