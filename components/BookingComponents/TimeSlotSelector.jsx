import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { timeSlots } from './bookingData';
import { appointmentApi } from '../../api/appointmentApi';

export default function TimeSlotSelector({ selectedTime, onTimeSelect, selectedDate }) {
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch available slots
  const fetchAvailableSlots = async () => {
    try {
      setLoading(true);
      
      // Use appointmentApi to fetch slots
      const response = await appointmentApi.getAvailableSlots(selectedDate);

      if (response.success) {
        setBookedSlots(response.data.booked || []);
      } else {
        console.error('Failed to fetch slots:', response.message);
      }
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 10 seconds (like FB Messenger)
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
      
      const interval = setInterval(() => {
        fetchAvailableSlots();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [selectedDate]);

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAvailableSlots();
    setRefreshing(false);
  };

  // Check if slot is booked
  const isSlotBooked = (slot) => {
    return bookedSlots.includes(slot);
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <Text style={styles.label}>Select Time Slot:</Text>
        {loading && <ActivityIndicator size="small" color="#0080ff" />}
      </View>

      <Text style={styles.legend}>
        Pull down to refresh • Auto-updates every 10s
      </Text>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0080ff"
          />
        }
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot, index) => {
            const isBooked = isSlotBooked(slot);
            const isSelected = selectedTime === slot;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.timeSlot,
                  isSelected && styles.selectedTimeSlot,
                  isBooked && styles.bookedTimeSlot,
                ]}
                onPress={() => {
                  if (!isBooked) {
                    onTimeSelect(slot);
                  }
                }}
                disabled={isBooked}
              >
                <Text
                  style={[
                    styles.timeSlotText,
                    isSelected && styles.selectedTimeSlotText,
                    isBooked && styles.bookedTimeSlotText,
                  ]}
                >
                  {slot}
                </Text>
                {isBooked && (
                  <Text style={styles.bookedLabel}>Booked</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  legend: {
    fontSize: 12,
    color: "#666",
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  scrollView: {
    maxHeight: 300, // Limit height so it's scrollable
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 10,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    margin: 5,
    backgroundColor: "#f9f9f9",
    minWidth: 80,
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: "#0080ff",
    borderColor: "#0080ff",
  },
  bookedTimeSlot: {
    backgroundColor: "#ffebee",
    borderColor: "#ef5350",
    opacity: 0.6,
  },
  timeSlotText: {
    color: "#333",
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bookedTimeSlotText: {
    color: "#c62828",
    textDecorationLine: 'line-through',
  },
  bookedLabel: {
    fontSize: 10,
    color: "#c62828",
    marginTop: 2,
    fontWeight: '600',
  },
});