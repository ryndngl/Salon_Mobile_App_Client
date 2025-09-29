import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { extractImages, getImageSource } from "../../utils/imageHelper";

const screenWidth = Dimensions.get('window').width;

export default function FootSpaCard({ 
  style, 
  serviceName,
  isFavorite, 
  onToggleFavorite, 
  onImagePress, 
  onBookNow 
}) {
  const imagesArray = extractImages(style);

  return (
    <View style={styles.footSpaCard}>
      <View style={styles.footSpaImagesRow}>
        {imagesArray.slice(0, 3).map((img, idx) => {
          const imageSource = getImageSource(img, serviceName);
          return (
            <TouchableOpacity key={idx} onPress={() => onImagePress(img)}>
              <Image source={imageSource} style={styles.footSpaImage} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footSpaContent}>
        <View style={styles.footSpaNamePriceRow}>
          <Text style={styles.footSpaStyleName} numberOfLines={2}>{style.name}</Text>
          <Text style={styles.footSpaPrice}>₱{style.price}</Text>
        </View>

        {style.description && (
          <Text style={styles.footSpaDescription} numberOfLines={3}>{style.description}</Text>
        )}

        <View style={styles.footSpaBottomRow}>
          <TouchableOpacity onPress={() => onToggleFavorite(style)} style={styles.footSpaHeartWrapper}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? 'red' : '#555'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.footSpaBookNowButton} onPress={() => onBookNow(style)}>
            <Text style={styles.footSpaBookNowButtonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footSpaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    padding: 16,
  },
  footSpaImagesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
    paddingHorizontal: 8,
  },
  footSpaImage: {
    width: (screenWidth - 96) / 3,
    height: 100,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  footSpaContent: {
    flex: 1,
  },
  footSpaNamePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  footSpaStyleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    marginRight: 8,
  },
  footSpaPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#d10000',
  },
  footSpaDescription: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
    marginBottom: 16,
  },
  footSpaBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  footSpaHeartWrapper: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  footSpaBookNowButton: {
    backgroundColor: '#007d3f',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footSpaBookNowButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});