import React from "react";
import { StyleSheet, FlatList, SafeAreaView } from "react-native";

// Import custom hook
import { useBookingManagement } from "../../hooks";

// Import components
import BookingHeader from "./BookingHeader";
import BookingTabs from "./BookingTabs";
import DeleteAllButton from "./DeleteAllButton";
import BookingCard from "./BookingCard";
import EmptyState from "./EmptyState";
import CancelBookingModal from "./CancelBookingModal";
import DeleteBookingModal from "./DeleteBookingModal";

export default function BookingScreen() {
  // Custom hook
  const {
    selectedTab,
    handleTabChange,
    filteredBookings,
    cancelModalVisible,
    handleCancelBooking,
    confirmCancelBooking,
    closeCancelModal,
    deleteModalVisible,
    actionType,
    handleDeleteBooking,
    handleDeleteAllCancelled,
    confirmDelete,
    closeDeleteModal,
  } = useBookingManagement();

  return (
    <SafeAreaView style={styles.container}>
      <BookingHeader />

      <BookingTabs 
        selectedTab={selectedTab} 
        onTabChange={handleTabChange} 
      />

      {selectedTab === "Cancelled" && filteredBookings.length > 0 && (
        <DeleteAllButton onDeleteAll={handleDeleteAllCancelled} />
      )}

      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <BookingCard
              item={item}
              selectedTab={selectedTab}
              onCancel={handleCancelBooking}
              onDelete={handleDeleteBooking}
            />
          )}
        />
      ) : (
        <EmptyState selectedTab={selectedTab} />
      )}

      <CancelBookingModal
        visible={cancelModalVisible}
        onClose={closeCancelModal}
        onConfirm={confirmCancelBooking}
      />

      <DeleteBookingModal
        visible={deleteModalVisible}
        actionType={actionType}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    paddingBottom: 40,
  },
});