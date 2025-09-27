import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBooking } from "../../context/BookingContext";

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];
const allServices = [
  "Hair Cut",
  "Hair Color",
  "Rebond & Forms",
  "Hair Treatment",
  "Foot Spa",
  "Nail Care",
];

const hairCutOptions = ["Men", "Women", "Kids"];
const haircutStyles = {
  Men: [
    "Buzz Cut",
    "High Fade",
    "Crew Cut",
    "Curtain Fringe",
    "Fohawk",
    "French Crop",
    "Side Part",
    "Taper Fade Mohawk",
    "Textured-Comb-Over",
    "Two Block",
    "Army Cut",
    "Burst Fade",
  ],
  Women: [
    "Boy Cut",
    "Butterfly Cut",
    "Fluffy Waves Bob",
    "Layered Curls",
    "Layered",
    "Long Layered",
    "Middy",
    "Short",
    "Soft and Pixie Cut",
    "Textured Bob",
    "V Cut",
    "Wolf Cut Mallet",
    "Wolf Cut",
    "Bangs",
    "Side swept",
    "Sombre",
  ],
  Kids: [
  "Little Army Cut",  
  "Bowl Cut", 
  "Little Buzz",      
  "Little Comb Over Cut",
  "Pompadour",
  "Little Fade",      
  "Fringe Fade",
  "Little High Fade",
  "Mid Fade",
  "Mohawk",
  "Side Part Cut",
],
};

const hairColorOptions = [
  "Root Touch Up",
  "Full Hair",
  "Highlights",
  "Balayage",
];
const hairColorStyles = {
  "Root Touch Up": [
    "Medium Brown",
    "Light Blonde",
    "Black",
    "Auburn Tones",
    "Dark Brown",
  ],
  "Full Hair": [
    "Inky Grey",
    "Blonde",
    "Purple",
    "Chestnut Brown",
    "Plum",
    "Light Golden Brown",
    "Ember",
  ],
  Highlights: [
    "Money Piece",
    "Copper",
    "Blue",
    "Cherry Red",
    "Honey Blonde",
    "Ombre",
    "Toasted Caramel",
    "Chunky",
  ],
  Balayage: [
    "Ash Blonde",
    "Burgundy",
    "Auburn",
    "Bronde",
    "Chocolate Brown",
    "Silver",
    "Golden Caramel",
  ],
};

const BookingFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { addBooking } = useBooking();

  const passedServiceName = route?.params?.serviceName || "";
  const passedStyle = route?.params?.styleName || "";
  const passedPrice = route?.params?.stylePrice || 0;

  const [serviceName, setServiceName] = useState(passedServiceName);
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState(passedStyle);
  const [price, setPrice] = useState(passedPrice);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [nameError, setNameError] = useState("");

  const isHairCut = serviceName === "Hair Cut";
  const isHairColor = serviceName === "Hair Color";
  const comingFromCTA = passedServiceName === "";

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

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };
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

  const handleSubmit = () => {
    if (!isFormValid) {
      Alert.alert("Incomplete Form", "Please complete all fields correctly.");
      return;
    }

    const bookingData = {
      name,
      serviceName,
      category: isHairCut || isHairColor ? category : "",
      style: style || "",
      date: date.toLocaleDateString(),
      time: selectedTime,
      price: price,
      status: "pending",
    };
    addBooking(bookingData);
    navigation.navigate("BookingSummaryScreen", {
      bookingDetails: bookingData,
    });
  };

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
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={[
            styles.input,
            name !== "" && nameError && styles.invalidInput,
          ]}
          placeholder="Enter your full name"
          value={name}
          onChangeText={validateName}
        />
        {nameError !== "" && <Text style={styles.errorText}>{nameError}</Text>}

        {comingFromCTA && (
          <>
            <Text style={styles.label}>Service Type:</Text>
            <View style={styles.optionsContainer}>
              {allServices.map((service) => (
                <TouchableOpacity
                  key={service}
                  style={[
                    styles.optionButton,
                    serviceName === service && styles.optionButtonSelected,
                  ]}
                  onPress={() => {
                    setServiceName(service);
                    setCategory("");
                    setStyle("");
                    setPrice(0);
                  }}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      serviceName === service &&
                        styles.optionButtonTextSelected,
                    ]}
                  >
                    {service}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {isHairCut && (
          <>
            <Text style={styles.label}>Category:</Text>
            {passedStyle ? (
              <View style={styles.input}>
                <Text>{category}</Text>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                {hairCutOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      category === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      setCategory(option);
                      setStyle("");
                      setPrice(0);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        category === option && styles.optionButtonTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {category && (
              <>
                <Text style={styles.label}>Style:</Text>
                {passedStyle ? (
                  <View style={styles.input}>
                    <Text>{style}</Text>
                  </View>
                ) : (
                  <View style={styles.optionsContainer}>
                    {haircutStyles[category].map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={[
                          styles.optionButton,
                          style === opt && styles.optionButtonSelected,
                        ]}
                        onPress={() => setStyle(opt)}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            style === opt && styles.optionButtonTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
        )}

        {isHairColor && (
          <>
            <Text style={styles.label}>Category:</Text>
            {passedStyle ? (
              <View style={styles.input}>
                <Text>{category}</Text>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                {hairColorOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      category === option && styles.optionButtonSelected,
                    ]}
                    onPress={() => {
                      setCategory(option);
                      setStyle("");
                      setPrice(0);
                    }}
                  >
                    <Text
                      style={[
                        styles.optionButtonText,
                        category === option && styles.optionButtonTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {category && (
              <>
                <Text style={styles.label}>Style:</Text>
                {passedStyle ? (
                  <View style={styles.input}>
                    <Text>{style}</Text>
                  </View>
                ) : (
                  <View style={styles.optionsContainer}>
                    {hairColorStyles[category].map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={[
                          styles.optionButton,
                          style === opt && styles.optionButtonSelected,
                        ]}
                        onPress={() => {
                          setStyle(opt);
                          setPrice(0); // Price will be 0 if the user changes the style. This is a limitation.
                        }}
                      >
                        <Text
                          style={[
                            styles.optionButtonText,
                            style === opt && styles.optionButtonTextSelected,
                          ]}
                        >
                          {opt}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </>
        )}

        {!isHairCut && !isHairColor && style ? (
          <>
            <Text style={styles.label}>Style:</Text>
            <View style={styles.input}>
              <Text>{style}</Text>
            </View>
          </>
        ) : null}

        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}
        >
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Select Time Slot:</Text>
        <View style={styles.timeSlotContainer}>
          {timeSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                selectedTime === slot && styles.selectedTimeSlot,
              ]}
              onPress={() => setSelectedTime(slot)}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  selectedTime === slot && styles.selectedTimeSlotText,
                ]}
              >
                {slot}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, !isFormValid && { backgroundColor: "#ccc" }]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default BookingFormScreen;

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
  invalidInput: {
    borderColor: "red",
  },
  optionsContainer: {
    flexDirection: "row",
    marginTop: 10,
    flexWrap: "wrap",
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: "#0080ff",
    borderColor: "#0080ff",
  },
  optionButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  optionButtonTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    margin: 5,
    backgroundColor: "#f9f9f9",
  },
  selectedTimeSlot: {
    backgroundColor: "#0080ff",
    borderColor: "#0080ff",
  },
  timeSlotText: {
    color: "#333",
    fontSize: 14,
  },
  selectedTimeSlotText: {
    color: "#fff",
    fontWeight: "bold",
  },
  button: {
    marginTop: 30,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginTop: 5,
    fontSize: 13,
  },
});
