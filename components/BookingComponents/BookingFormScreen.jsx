import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Import custom hook
import { useBookingForm } from "../../hooks";

// Import components
import NameInput from "./NameInput";
import ServiceTypeSelector from "./ServiceTypeSelector";
import HairCutSelector from "./HairCutSelector";
import HairColorSelector from "./HairColorSelector";
import DateSelector from "./DateSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import BookingFormActions from "./BookingFormActions";

export default function BookingFormScreen() {
  // Custom hook
  const {
    serviceName,
    category,
    style,
    name,
    nameError,
    date,
    showDatePicker,
    selectedTime,
    isHairCut,
    isHairColor,
    comingFromCTA,
    passedStyle,
    isFormValid,
    validateName,
    handleServiceSelect,
    handleHairCutCategorySelect,
    handleHairCutStyleSelect,
    handleHairColorCategorySelect,
    handleHairColorStyleSelect,
    handleDateChange,
    handleShowDatePicker,
    handleTimeSelect,
    handleSubmit,
  } = useBookingForm();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <NameInput
          name={name}
          onNameChange={validateName}
          nameError={nameError}
        />

        {comingFromCTA && (
          <ServiceTypeSelector
            serviceName={serviceName}
            onServiceSelect={handleServiceSelect}
          />
        )}

        {isHairCut && (
          <HairCutSelector
            category={category}
            style={style}
            passedStyle={passedStyle}
            onCategorySelect={handleHairCutCategorySelect}
            onStyleSelect={handleHairCutStyleSelect}
          />
        )}

        {isHairColor && (
          <HairColorSelector
            category={category}
            style={style}
            passedStyle={passedStyle}
            onCategorySelect={handleHairColorCategorySelect}
            onStyleSelect={handleHairColorStyleSelect}
          />
        )}

        {!isHairCut && !isHairColor && style ? (
          <>
            <Text style={styles.label}>Style:</Text>
            <View style={styles.input}>
              <Text>{style}</Text>
            </View>
          </>
        ) : null}

        <DateSelector
          date={date}
          showDatePicker={showDatePicker}
          onShowPicker={handleShowDatePicker}
          onDateChange={handleDateChange}
        />

        <TimeSlotSelector
          selectedTime={selectedTime}
          onTimeSelect={handleTimeSelect}
        />

        <BookingFormActions
          isFormValid={isFormValid}
          onSubmit={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  label: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    marginTop: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
});