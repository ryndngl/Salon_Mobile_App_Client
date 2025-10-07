import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getImageSource } from "../../utils/imageHelper";

const screenWidth = Dimensions.get('window').width;
const cardWidth = (screenWidth - 48) / 2;

export default function ServiceCard({ 
  style, 
  serviceName,
  isFavorite, 
  onToggleFavorite, 
  onImagePress, 
  onBookNow 
}) {
  const imageSource = getImageSource(style.image || style.images?.[0], serviceName);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onImagePress(style.image || style.images?.[0])}>
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.image} />
        </View>
      </TouchableOpacity>

      <View style={styles.cardContent}>
        <View style={styles.namePriceRow}>
          <Text style={styles.styleName}>{style.name}</Text>
          <Text style={styles.price}>
            {style.price?.toString().startsWith('₱') ? style.price : `₱${style.price}`}
          </Text>
        </View>

        {style.description && (
          <Text style={styles.description}>{style.description}</Text>
        )}

        <View style={styles.bottomRow}>
          <TouchableOpacity onPress={() => onToggleFavorite(style)} style={styles.heartWrapper}>
            <Ionicons 
              name={isFavorite ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorite ? 'red' : '#555'} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookNowButton} onPress={() => onBookNow(style)}>
            <Text style={styles.bookNowButtonText}>BOOK NOW</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    width: cardWidth,
    overflow: 'hidden',
    elevation: 2,
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 14,
    flex: 1,
    justifyContent: 'space-between',
  },
  namePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  styleName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d10000',
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    marginBottom: 10,
    lineHeight: 18,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 12,
  },
  heartWrapper: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  bookNowButton: {
    backgroundColor: '#007d3f',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});