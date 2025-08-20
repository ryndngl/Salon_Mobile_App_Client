import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooking } from '../context/BookingContext';

const BookingConfirmationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { addBooking } = useBooking();
  const [modalVisible, setModalVisible] = useState(false);

  const { bookingDetails } = route.params || {};
  const {
    name,
    serviceName,
    category,
    style,
    date,
    time,
    paymentMethod,
    price,
    totalprice,
    status,
  } = bookingDetails || {};

  const handleFinalConfirm = () => {
    const bookingData = {
      name,
      serviceName,
      category,
      style,
      date,
      time,
      paymentMethod,
      price,
      totalprice,
      status: "pending",
    };

    addBooking(bookingData);
    setModalVisible(false);

    navigation.navigate('MainTabs', {
      screen: 'Bookings',
      params: { bookingDetails: bookingData },
    });
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={modalVisible ? 'rgba(0,0,0,0.5)' : '#fefefe'}
        translucent={modalVisible}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fefefe' }}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Booking Confirmation</Text>

          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{name}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Service Name:</Text>
              <Text style={styles.value}>{serviceName}</Text>
            </View>

            {category && (
              <View style={styles.row}>
                <Text style={styles.label}>Category:</Text>
                <Text style={styles.value}>{category}</Text>
              </View>
            )}

            {style && (
              <View style={styles.row}>
                <Text style={styles.label}>Style:</Text>
                <Text style={styles.value}>{style}</Text>
              </View>
            )}

            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{date}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Time:</Text>
              <Text style={styles.value}>{time}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{paymentMethod}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Price:</Text>
              <Text style={styles.value}>₱{price}</Text>
            </View>

            {totalprice && (
              <View style={styles.row}>
                <Text style={styles.label}>Total Price:</Text>
                <Text style={styles.value}>₱{totalprice}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.proceedButtonText}>Confirm Booking</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          statusBarTranslucent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.fullscreenModal}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>
                Confirm payment via {paymentMethod}?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelBtn}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFinalConfirm}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.confirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
};

export default BookingConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 200,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderColor: '#D4D4D4',
    padding: 20,
    elevation: 3,
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#222',
  },
  proceedButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 10,
    width: '100%',
    maxWidth: 350,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  cancelBtn: {
    backgroundColor:'#f5f5f5',
    borderColor:'#ddd', 
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});