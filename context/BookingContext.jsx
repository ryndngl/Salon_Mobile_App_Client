// context/BookingContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import API_URL from '../config/api.js';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    const loadUserBookings = async () => {
      if (isAuthenticated && user?.id) {
        console.log('📄 Auto-fetching bookings for logged-in user...');
        await fetchUserBookings(user.id);
      } else {
        setBookings([]);
      }
    };

    loadUserBookings();
  }, [isAuthenticated, user?.id]);

  const fetchUserBookings = async (userId) => {
    try {
      setIsLoadingBookings(true);
      console.log('🔥 Fetching bookings for user:', userId);
      
      const response = await fetch(`${API_URL}/api/appointments/user/${userId}`);
      const data = await response.json();

      if (data.success && data.data) {
        const transformedBookings = data.data.map(appointment => {
          const service = appointment.services && appointment.services[0] ? appointment.services[0] : {};
          
          const dateObj = new Date(appointment.date);
          const formattedDate = dateObj.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit', 
            year: 'numeric'
          });

          return {
            id: appointment._id, 
            name: appointment.clientName,
            email: appointment.email,
            phone: appointment.phone,
            serviceName: service.name || service || "N/A",
            category: service.category || "",
            style: service.style || "",
            price: service.price || 0,
            date: formattedDate,
            time: appointment.time,
            paymentMethod: appointment.modeOfPayment,
            status: appointment.status.toLowerCase(),
          };
        });

        setBookings(transformedBookings);
        console.log(`✅ Loaded ${transformedBookings.length} bookings`);
        console.log('📋 Sample booking:', transformedBookings[0]);
        return { success: true, count: transformedBookings.length };
      } else {
        console.log('ℹ️ No bookings found');
        setBookings([]);
        return { success: true, count: 0 };
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setBookings([]);
      return { success: false, error: error.message };
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const addBooking = (booking) => {
    setBookings((prev) => [
      ...prev,
      { ...booking, status: booking.status || "pending" },
    ]);
  };

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      setBookings, 
      addBooking, 
      fetchUserBookings,
      isLoadingBookings 
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);