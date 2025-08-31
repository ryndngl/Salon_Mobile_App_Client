import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promos, setPromos] = useState(false);

  const menuSections = [
    {
      title: 'Notifications & Settings',
      items: [
        { icon: 'notifications', label: 'Booking Reminders', hasSwitch: true, value: bookingReminders, onChange: setBookingReminders },
        { icon: 'local-offer', label: 'Promos & Offers', hasSwitch: true, value: promos, onChange: setPromos },
        { icon: 'lock', label: 'Change Password', hasAction: true, onPress: () => {} } // Maaari kang magdagdag ng function para mag-navigate sa isang Change Password screen
      ]
    },
    {
      title: 'Help & Support',
      items: [
        { icon: 'help', label: 'FAQs', onPress: () => navigation.navigate('FAQs') },
        { icon: 'chat', label: 'Contact Us', onPress: () => navigation.navigate('ContactUs') },
        { icon: 'description', label: 'Terms & Conditions', onPress: () => navigation.navigate('TermsConditions') },
        { icon: 'privacy-tip', label: 'Privacy Policy', onPress: () => navigation.navigate('PrivacyPolicy') }
      ]
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.scrollView}>
        <View style={styles.menuContainer}>
          {menuSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.menuSection}>
              {section.title && (
                <Text style={styles.sectionTitle}>{section.title}</Text>
              )}
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <TouchableOpacity style={styles.menuItem} onPress={item.onPress || (() => {})}>
                    <View style={styles.menuItemLeft}>
                      <Icon name={item.icon} size={20} color="#666" />
                      <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemText}>{item.label}</Text>
                      </View>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.hasSwitch && (
                        <Switch
                          value={item.value}
                          onValueChange={item.onChange}
                          trackColor={{ false: "#ddd", true: "#4CAF50" }}
                          thumbColor="#fff"
                        />
                      )}
                      {!item.hasSwitch && (
                        <Icon name="chevron-right" size={20} color="#ccc" />
                      )}
                    </View>
                  </TouchableOpacity>
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.menuDivider} />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 55,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    zIndex: -1,
  },
  scrollView: {
    flex: 1,
  },
  menuContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  menuSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 48,
  },
});