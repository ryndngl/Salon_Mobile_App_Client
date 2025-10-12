import { useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { appointmentService } from '../services/appointmentService'; 

export const useBookingManagement = () => {
  const { bookings, setBookings } = useBooking();
  const [selectedTab, setSelectedTab] = useState("Upcoming");

  // Cancel Booking Modal state
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Delete Booking Modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [bookingToDelete, setBookingToDelete] = useState(null);

  // ✅ FIXED: Filter bookings based on selected tab
  const filteredBookings = bookings.filter((item) => {
    if (!item.paymentMethod || !item.name || !item.date || !item.time) return false;
    
    // Normalize status to lowercase for comparison
    const status = item.status?.toLowerCase() || '';
    
    // ✅ UPCOMING: Include Pending, Confirmed, AND Declined
    if (selectedTab === "Upcoming") {
      return status === "pending" || status === "confirmed" || status === "declined";
    }
    
    // ✅ CANCELLED: Only user-cancelled bookings
    if (selectedTab === "Cancelled") {
      return status === "cancelled";
    }
    
    // ✅ COMPLETED: Only completed bookings
    if (selectedTab === "Completed") {
      return status === "completed";
    }
    
    return true;
  });

  // Tab change handler
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Cancel Booking handlers
  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setCancelModalVisible(true);
  };

  const confirmCancelBooking = async () => {
  if (selectedBooking) {
    try {
      console.log('🔄 Cancelling booking:', selectedBooking.id);
      console.log('📋 Full booking object:', selectedBooking); // ✅ Debug log
      
      // ✅ Validate ID before calling API
      if (!selectedBooking.id) {
        console.error('❌ Booking ID is undefined!');
        alert('Error: Booking ID is missing. Please refresh and try again.');
        return;
      }
      
      // ✅ Call API to update status in database
      await appointmentService.cancelAppointment(selectedBooking.id);
      
      console.log('✅ Booking cancelled successfully');
      
      // ✅ Update local state - compare by ID!
      setBookings((prev) =>
        prev.map((b) =>
          b.id === selectedBooking.id ? { ...b, status: "cancelled" } : b
        )
      );
      setSelectedTab("Cancelled");
    } catch (error) {
      console.error('❌ Cancel booking error:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  }
  setCancelModalVisible(false);
  setSelectedBooking(null);
};

  const closeCancelModal = () => {
    setCancelModalVisible(false);
    setSelectedBooking(null);
  };

  // Delete Booking handlers
  const handleDeleteBooking = (booking) => {
    setBookingToDelete(booking);
    setActionType("deleteSingle");
    setDeleteModalVisible(true);
  };

  const handleDeleteAllCancelled = () => {
    setActionType("deleteAll");
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (actionType === "deleteSingle" && bookingToDelete) {
      setBookings((prev) => prev.filter((b) => b !== bookingToDelete));
    } else if (actionType === "deleteAll") {
      // ✅ FIXED: Only delete "cancelled" status, NOT declined
      setBookings((prev) => prev.filter((b) => b.status?.toLowerCase() !== "cancelled"));
    }
    setDeleteModalVisible(false);
    setBookingToDelete(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setBookingToDelete(null);
  };

  return {
    // Tab state
    selectedTab,
    handleTabChange,
    
    // Filtered data
    filteredBookings,
    
    // Cancel modal state and handlers
    cancelModalVisible,
    handleCancelBooking,
    confirmCancelBooking,
    closeCancelModal,
    
    // Delete modal state and handlers
    deleteModalVisible,
    actionType,
    handleDeleteBooking,
    handleDeleteAllCancelled,
    confirmDelete,
    closeDeleteModal,
  };
};