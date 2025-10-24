import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBooking } from '../context/BookingContext';
import { haircutStyles, hairColorStyles } from '../components/BookingComponents/bookingData';

export const useBookingForm = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { addBooking } = useBooking();

  // Get passed parameters from route
  const passedServiceName = route?.params?.serviceName || "";
  const passedStyle = route?.params?.styleName || "";
  const passedPrice = route?.params?.stylePrice || 0;

  // Form state
  const [serviceName, setServiceName] = useState(passedServiceName);
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState(passedStyle);
  const [price, setPrice] = useState(passedPrice);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date()); // ✅ Auto-set to today
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [nameError, setNameError] = useState("");

  // Determine service types
  const isHairCut = serviceName === "Hair Cut";
  const isHairColor = serviceName === "Hair Color";
  const comingFromCTA = passedServiceName === "";

  // Auto-detect category when coming from service detail page
  useEffect(() => {
    if (isHairCut && passedStyle) {
      for (const cat of Object.keys(haircutStyles)) {
        if (haircutStyles[cat].includes(passedStyle)) {
          setCategory(cat);
          setStyle(passedStyle);
          break;
        }
      }
    } else if (isHairColor && passedStyle) {
      for (const cat of Object.keys(hairColorStyles)) {
        if (hairColorStyles[cat].includes(passedStyle)) {
          setCategory(cat);
          setStyle(passedStyle);
          break;
        }
      }
    }
  }, [isHairCut, isHairColor, passedStyle]);

  // Validation
  const validateName = (inputName) => {
    const nameRegex = /^[A-Za-z]{2,}(?:\s[A-Za-z]{2,})+$/;
    if (!nameRegex.test(inputName.trim())) {
      setNameError("Enter a valid full name (e.g. Juan Cruz)");
    } else {
      setNameError("");
    }
    setName(inputName);
  };

  const isFormValid =
    name.trim() !== "" &&
    nameError === "" &&
    serviceName !== "" &&
    date !== null &&
    selectedTime !== "" &&
    (!isHairCut || (category !== "" && style !== "")) &&
    (!isHairColor || (category !== "" && style !== ""));

  // Handlers
  const handleServiceSelect = (service) => {
    setServiceName(service);
    setCategory("");
    setStyle("");
    setPrice(0);
  };

  const handleHairCutCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setStyle("");
    setPrice(0);
  };

  const handleHairCutStyleSelect = (selectedStyle) => {
    setStyle(selectedStyle);
  };

  const handleHairColorCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setStyle("");
    setPrice(0);
  };

  const handleHairColorStyleSelect = (selectedStyle) => {
    setStyle(selectedStyle);
    setPrice(0);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // ✅ UPDATED: Just prepare data and navigate (NO API call yet)
  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("Incomplete Form", "Please complete all fields correctly.");
      return;
    }

    // Just prepare booking data for display
    const bookingData = {
      name,
      serviceName,
      category: isHairCut || isHairColor ? category : "",
      style: style || "",
      date: date.toLocaleDateString('en-US'),
      time: selectedTime,
      price: price,
      status: "pending",
    };
    
    // Navigate to summary WITHOUT creating booking yet
    navigation.navigate("BookingSummaryScreen", {
      bookingDetails: bookingData,
    });
  };

  return {
    // Form state
    serviceName,
    category,
    style,
    price,
    name,
    nameError,
    date,
    showDatePicker,
    selectedTime,
    
    // Computed values
    isHairCut,
    isHairColor,
    comingFromCTA,
    passedStyle,
    isFormValid,
    
    // Handlers
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
  };
};