import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import custom hook
import { useServiceDetail } from '../../hooks';

// Import components
import ErrorState from './ErrorState';
import ServiceDetailHeader from './ServiceDetailHeader';
import CategoryTabs from './CategoryTabs';
import PriceNote from './PriceNote';
import ServiceCard from './ServiceCard';
import FootSpaCard from './FootSpaCard';
import ImageView from "../../utils/ImageView";

export default function ServiceDetailScreen() {
  // Custom hook
  const {
    service,
    isHairCut,
    isHairColor,
    isFootSpa,
    selectedCategory,
    setSelectedCategory,
    categoriesToRender,
    filteredStyles,
    imageViewerVisible,
    viewerImageSource,
    openImageViewer,
    closeImageViewer,
    goToBooking,
    handleToggleFavorite,
    checkIsFavorite,
    hasMultipleImages,
  } = useServiceDetail();

  // Error state
  if (!service || !service.name || !service.styles) {
    return <ErrorState />;
  }

  // Render appropriate card based on service type and images
  const renderCard = (style, index) => {
    const isFootSpaWithMultipleImages = isFootSpa && hasMultipleImages(style);
    
    if (isFootSpaWithMultipleImages) {
      return (
        <FootSpaCard
          key={index}
          style={style}
          serviceName={service.name}
          isFavorite={checkIsFavorite(style)}
          onToggleFavorite={handleToggleFavorite}
          onImagePress={openImageViewer}
          onBookNow={goToBooking}
        />
      );
    }

    return (
      <ServiceCard
        key={index}
        style={style}
        serviceName={service.name}
        isFavorite={checkIsFavorite(style)}
        onToggleFavorite={handleToggleFavorite}
        onImagePress={openImageViewer}
        onBookNow={goToBooking}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ServiceDetailHeader serviceName={service.name} />

        <CategoryTabs
          categories={categoriesToRender}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        <PriceNote 
          isHairColor={isHairColor} 
          selectedCategory={selectedCategory} 
        />

        <View style={styles.grid}>
          {filteredStyles.map((style, index) => renderCard(style, index))}
        </View>
      </ScrollView>

      <ImageView
        visible={imageViewerVisible}
        image={viewerImageSource}
        onClose={closeImageViewer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 20,
  },
});