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

  //  FIXED: Filter bookings based on selected tab
  const filteredBookings = bookings.filter((item) => {
    if (!item.paymentMethod || !item.name || !item.date || !item.time) return false;
    
    // Normalize status to lowercase for comparison
    const status = item.status?.toLowerCase() || '';
    
    //  UPCOMING: Include Pending, Confirmed, AND Declined
    if (selectedTab === "Upcoming") {
      return status === "pending" || status === "confirmed" || status === "declined";
    }
    
    //  CANCELLED: Only user-cancelled bookings
    if (selectedTab === "Cancelled") {
      return status === "cancelled";
    }
    
    //  COMPLETED: Only completed bookings
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
      //  BETTER: Extract ID with fallback
      const bookingId = selectedBooking.id || selectedBooking._id;
      
      console.log(' Attempting to cancel booking');
      console.log(' Booking ID:', bookingId);
      console.log(' Full booking object:', JSON.stringify(selectedBooking, null, 2));
      
      //  Validate ID before calling API
      if (!bookingId) {
        console.error(' Booking ID is missing from object!');
        console.error(' Available keys:', Object.keys(selectedBooking));
        alert('Error: Booking ID is missing. Please refresh and try again.');
        setCancelModalVisible(false);
        setSelectedBooking(null);
        return;
      }
      
      //  Call API to update status in database
      console.log('📡 Calling API with ID:', bookingId);
      await appointmentService.cancelAppointment(bookingId);
      
      console.log(' Booking cancelled successfully in backend');
      
      //  Update local state - use the bookingId we extracted
      setBookings((prev) =>
        prev.map((b) =>
          (b.id === bookingId || b._id === bookingId) 
            ? { ...b, status: "cancelled" } 
            : b
        )
      );
      
      // Switch to Cancelled tab to show result
      setSelectedTab("Cancelled");
      
      console.log(' Local state updated');
      
    } catch (error) {
      console.error(' Cancel booking error:', error);
      console.error(' Error details:', error.message);
      alert(`Failed to cancel booking: ${error.message}`);
    } finally {
      //  Always close modal
      setCancelModalVisible(false);
      setSelectedBooking(null);
    }
  }
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