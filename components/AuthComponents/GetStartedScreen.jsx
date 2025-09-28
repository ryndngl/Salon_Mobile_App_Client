import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Import components
import GetStartedBackground from './GetStartedBackground';
import GetStartedHeader from './GetStartedHeader';
import GetStartedImage from './GetStartedImage';
import GetStartedDescription from './GetStartedDescription';
import GetStartedActions from './GetStartedActions';

export default function GetStartedScreen() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.replace('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <GetStartedBackground />

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <GetStartedHeader />
        
        <GetStartedImage />
        
        <GetStartedDescription />
        
        <GetStartedActions handleGetStarted={handleGetStarted} />

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 25,
  },
  bottomSpacing: {
    height: 30,
  },
});