// screens/HomeScreen/components/ServicesGrid.jsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const DISPLAY_SERVICES = [
  {
    name: "Hair Cut",
    description: "Stylish cuts tailored to your look.",
    image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/haircut_dnayis.webp",
  },
  {
    name: "Hair Color",
    description: "Transform your hair with vibrant, lasting colors.",
    image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/haircolor_bk135m.webp",
  },
  {
    name: "Hair Treatment",
    description: "Revitalize and strengthen your hair for a healthy, shiny look.",
    image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375430/hairtreatment_ddzkdc.webp",
  },
  {
    name: "Rebond & Forms",
    description: "Get sleek, straight, and perfectly styled hair.",
    image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/rebondandforms_ydvsyo.webp",
  },
  {
    name: "Nail Care",
    description: "Keep your nails healthy, polished, and beautifully designed.",
    image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375431/nailcare_izbusf.webp",
  },
  {
    name: "Foot Spa",
    description: "Relax and rejuvenate your feet with soothing care.",
    image: "https://res.cloudinary.com/dyw0qxjzn/image/upload/v1756375432/footspa_idzcx1.webp",
  },
];

const ServicesGrid = ({ loading, onServicePress }) => {
  return (
    <View>
      <Text style={styles.title}>Our Services</Text>
      <View style={styles.container}>
        {DISPLAY_SERVICES.map((service, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.serviceCard, loading && styles.serviceCardDisabled]}
            onPress={() => onServicePress(service.name)}
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: service.image }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>

            <View style={styles.content}>
              <Text style={styles.serviceTitle} numberOfLines={2}>
                {service.name}
              </Text>
              <Text style={styles.description} numberOfLines={3}>
                {service.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 15,
    color: "#d13f3f",
    textTransform: "uppercase",
    letterSpacing: 1.8,
    textShadowColor: "rgba(0, 0, 0, 0.08)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 5,
  },
  serviceCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 22,
    marginBottom: 22,
    overflow: "hidden",
    elevation: 2,
    borderWidth: 0.5,
    borderColor: "#E8E8E8",
  },
  serviceCardDisabled: {
    opacity: 0.9,
  },
  imageContainer: {
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  content: {
    paddingHorizontal: 15,
    paddingVertical: 16,
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceTitle: {
    color: "#d13f3f",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  description: {
    color: "#555",
    fontSize: 12.5,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 4,
    fontWeight: "400",
    opacity: 0.95,
    letterSpacing: 0.2,
  },
});

export default ServicesGrid;