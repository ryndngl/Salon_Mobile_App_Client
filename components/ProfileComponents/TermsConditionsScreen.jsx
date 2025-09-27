import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function TermsConditionsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Conditions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.lastUpdated}>Last Updated: January 2025</Text>

          <Text style={styles.introText}>
            Welcome to Van's Glow up Salon! These Terms and Conditions ("Terms") govern your use of our mobile application and services. By using our app, you agree to these terms.
          </Text>

          {/* Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
            <Text style={styles.sectionContent}>
              By accessing and using the Van's Glow up Salon mobile application, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, you should not use this app.
            </Text>
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Booking and Appointments</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Booking Confirmation:</Text> All appointments must be confirmed through the app or by phone. Appointments are not guaranteed until confirmed.
              {"\n\n"}
              <Text style={styles.boldText}>Cancellation Policy:</Text> Cancellations must be made at least 24 hours before your scheduled appointment. Cancellations made less than 24 hours in advance may incur a cancellation fee.
              {"\n\n"}
              <Text style={styles.boldText}>Late Arrivals:</Text> We can accommodate late arrivals up to 15 minutes. Beyond this time, we may need to reschedule your appointment.
              {"\n\n"}
              <Text style={styles.boldText}>No-Shows:</Text> Failure to show up for your appointment without prior cancellation may result in a no-show fee and could affect future booking privileges.
            </Text>
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Payment Terms</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Payment Methods:</Text> We accept GCash, credit/debit cards, cash on service.
              {"\n\n"}
              <Text style={styles.boldText}>Pricing:</Text> All prices are listed in Philippine Pesos (PHP) and are subject to change without notice.
              {"\n\n"}
              <Text style={styles.boldText}>Refunds:</Text> Refunds will be processed according to our cancellation policy. Processing time is 5-7 business days.
              {"\n\n"}
              <Text style={styles.boldText}>Deposits:</Text> Some services may require a deposit, which will be applied to your final bill.
            </Text>
          </View>

          {/* Section 4 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Service Policies</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Health and Safety:</Text> Please inform us of any allergies, medical conditions, or medications that may affect your treatment.
              {"\n\n"}
              <Text style={styles.boldText}>Service Results:</Text> Results may vary based on individual hair/skin type and condition. We cannot guarantee specific outcomes.
              {"\n\n"}
              <Text style={styles.boldText}>Product Reactions:</Text> While we use high-quality products, individual reactions may occur. Patch tests are recommended for color services.
              {"\n\n"}
              <Text style={styles.boldText}>Age Requirements:</Text> Minors under 16 must be accompanied by a parent or guardian for certain services.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. User Accounts and Privacy</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Account Security:</Text> You are responsible for maintaining the confidentiality of your account credentials.
              {"\n\n"}
              <Text style={styles.boldText}>Accurate Information:</Text> You agree to provide accurate and complete information when creating your account and booking services.
              {"\n\n"}
              <Text style={styles.boldText}>Data Protection:</Text> We collect and process your personal data in accordance with our Privacy Policy.
            </Text>
          </View>

          {/* Section 6 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Loyalty Program</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Point Earning:</Text> Loyalty points are earned on completed services and are calculated based on the final bill amount.
              {"\n\n"}
              <Text style={styles.boldText}>Point Expiry:</Text> Points expire 2 years from the date earned. No extensions will be granted.
              {"\n\n"}
              <Text style={styles.boldText}>Redemption:</Text> Points can only be redeemed for services and cannot be exchanged for cash.
              {"\n\n"}
              <Text style={styles.boldText}>Program Changes:</Text> We reserve the right to modify or discontinue the loyalty program with 30 days' notice.
            </Text>
          </View>

          {/* Section 7 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Prohibited Uses</Text>
            <Text style={styles.sectionContent}>
              You may not use our app to:
              {"\n"}• Make fraudulent bookings or payments
              {"\n"}• Harass staff or other clients
              {"\n"}• Share account credentials with others
              {"\n"}• Attempt to hack or damage our systems
              {"\n"}• Use our services for any illegal purposes
              {"\n"}• Create multiple accounts to abuse promotions
            </Text>
          </View>

          {/* Section 8 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
            <Text style={styles.sectionContent}>
              Salon Sarap shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of our services. Our total liability shall not exceed the amount paid for the specific service in question.
            </Text>
          </View>

          {/* Section 9 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Intellectual Property</Text>
            <Text style={styles.sectionContent}>
              All content in the app, including but not limited to text, graphics, logos, and software, is the property of Salon Sarap and is protected by copyright and other intellectual property laws.
            </Text>
          </View>

          {/* Section 10 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Modifications to Terms</Text>
            <Text style={styles.sectionContent}>
              We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting in the app. Continued use of the app constitutes acceptance of the modified terms.
            </Text>
          </View>

          {/* Section 11 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Governing Law</Text>
            <Text style={styles.sectionContent}>
              These Terms and Conditions are governed by the laws of the Republic of the Philippines. Any disputes will be subject to the jurisdiction of the courts in Pampanga, Philippines.
            </Text>
          </View>

          {/* Section 12 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Information</Text>
            <Text style={styles.sectionContent}>
              If you have any questions about these Terms and Conditions, please contact us:
              {"\n\n"}
              Email: vansglowupsalon2k5@gmail.com
              {"\n"}
              Phone: +63 956 411 7744
              {"\n"}
              Blk 7 Lot 2 Phase 1 SuB Urban Village,  Brgy. San Jose Rodriguez Rizal, Philippines
            </Text>
          </View>

          {/* Agreement Section */}
          <View style={styles.agreementSection}>
            <Text style={styles.agreementText}>
              By using Van's Glow up Salon mobile application and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 55,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    padding: 20,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  introText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  sectionContent: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  boldText: {
    fontWeight: '600',
    color: '#333',
  },
  agreementSection: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    marginTop: 10,
  },
  agreementText: {
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
});