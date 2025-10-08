// context/BookingContext.js
import React, { createContext, useState, useContext } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);

 const addBooking = (booking) => {
  setBookings((prev) => [
    ...prev,
    { ...booking, status: booking.status || "pending" }, // ✅ fallback
  ]);
};  


  return (
    <BookingContext.Provider value={{ bookings, setBookings, addBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

// Para magamit ang context sa ibang components
export const useBooking = () => useContext(BookingContext);