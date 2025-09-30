import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function PaymentMethodsSection({ paymentMethods }) {
  const handleAddPaymentMethod = () => {
    // TODO: Implement add payment method functionality
    console.log("Add payment method");
  };

  const handleSelectPaymentMethod = (method) => {
    // TODO: Implement payment method selection
    console.log("Selected payment method:", method);
  };

  return (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>Payment Methods</Text>
      {paymentMethods.map((method, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleSelectPaymentMethod(method)}
          >
            <View style={styles.menuItemLeft}>
              <Icon name="payment" size={20} color="#666" />
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>{method.name}</Text>
                {method.isDefault && (
                  <Text style={styles.defaultText}>Default</Text>
                )}
              </View>
            </View>
            <View style={styles.menuItemRight}>
              <Icon name="chevron-right" size={20} color="#ccc" />
            </View>
          </TouchableOpacity>
          <View style={styles.menuDivider} />
        </View>
      ))}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleAddPaymentMethod}
      >
        <View style={styles.menuItemLeft}>
          <Icon name="add" size={20} color="#666" />
          <View style={styles.menuItemContent}>
            <Text style={styles.menuItemText}>Add Payment Method</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 12,
    flex: 1,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  defaultText: {
    fontSize: 12,
    color: "#4CAF50",
    marginTop: 2,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginLeft: 48,
  },
});