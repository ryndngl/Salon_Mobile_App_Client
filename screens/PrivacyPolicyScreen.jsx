import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
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
            At Van's Glow up Salon, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our mobile application and services.
          </Text>

          {/* Section 1 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Information We Collect</Text>
            
            <Text style={styles.subsectionTitle}>Personal Information:</Text>
            <Text style={styles.sectionContent}>
              • Full name and contact details (phone, email)
              {"\n"}• Profile photo (optional)
              {"\n"}• Date of birth for birthday promotions
              {"\n"}• Payment information (processed securely)
              {"\n"}• Service preferences and history
            </Text>

            <Text style={styles.subsectionTitle}>Automatically Collected Information:</Text>
            <Text style={styles.sectionContent}>
              • Device information (model, operating system)
              {"\n"}• App usage data and analytics
              {"\n"}• Location data (when permitted)
              {"\n"}• IP address and network information
              {"\n"}• Crash reports and performance data
            </Text>
          </View>

          {/* Section 2 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Service Delivery:</Text>
              {"\n"}• Process and manage your appointments
              {"\n"}• Send booking confirmations and reminders
              {"\n"}• Process payments and maintain records
              {"\n"}• Provide customer support
              {"\n\n"}
              <Text style={styles.boldText}>Communication:</Text>
              {"\n"}• Send promotional offers and updates (with consent)
              {"\n"}• Notify about service changes or app updates
              {"\n"}• Respond to your inquiries and feedback
              {"\n\n"}
              <Text style={styles.boldText}>Improvement:</Text>
              {"\n"}• Analyze app usage to improve features
              {"\n"}• Personalize your experience
              {"\n"}• Develop new services and features
            </Text>
          </View>

          {/* Section 3 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Information Sharing</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>We do not sell your personal information.</Text> We may share your data only in these circumstances:
              {"\n\n"}
              <Text style={styles.boldText}>Service Providers:</Text>
              {"\n"}• Payment processors (GCash, credit card companies)
              {"\n"}• Cloud storage providers
              {"\n"}• Analytics services (anonymized data only)
              {"\n\n"}
              <Text style={styles.boldText}>Legal Requirements:</Text>
              {"\n"}• When required by Philippine law
              {"\n"}• To protect our rights and safety
              {"\n"}• In case of business transfer or merger
              {"\n\n"}
              <Text style={styles.boldText}>With Your Consent:</Text>
              {"\n"}• Sharing reviews and photos (when you choose to)
              {"\n"}• Social media integration (if enabled)
            </Text>
          </View>

          {/* Section 4 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. Data Security</Text>
            <Text style={styles.sectionContent}>
              We implement industry-standard security measures to protect your information:
              {"\n\n"}
              • Encrypted data transmission (SSL/TLS)
              {"\n"}• Secure database storage
              {"\n"}• Regular security audits and updates
              {"\n"}• Access controls and staff training
              {"\n"}• Two-factor authentication options
              {"\n\n"}
              However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but continuously work to protect your data.
            </Text>
          </View>

          {/* Section 5 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Data Retention</Text>
            <Text style={styles.sectionContent}>
              <Text style={styles.boldText}>Account Data:</Text> Retained while your account is active
              {"\n"}
              <Text style={styles.boldText}>Booking History:</Text> Kept for 3 years for service and tax purposes
              {"\n"}
              <Text style={styles.boldText}>Payment Records:</Text> Retained for 7 years as required by law
              {"\n"}
              <Text style={styles.boldText}>Marketing Data:</Text> Until you unsubscribe or object
              {"\n\n"}
              When you delete your account, we will remove or anonymize your personal data within 30 days, except where retention is required by law.
            </Text>
          </View>

          {/* Section 6 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Your Rights and Choices</Text>
            <Text style={styles.sectionContent}>
              Under the Data Privacy Act of 2012, you have the right to:
              {"\n\n"}
              <Text style={styles.boldText}>Access:</Text> Request a copy of your personal data
              {"\n"}
              <Text style={styles.boldText}>Correction:</Text> Update or correct inaccurate information
              {"\n"}
              <Text style={styles.boldText}>Deletion:</Text> Request deletion of your data
              {"\n"}
              <Text style={styles.boldText}>Portability:</Text> Receive your data in a common format
              {"\n"}
              <Text style={styles.boldText}>Object:</Text> Opt out of marketing communications
              {"\n"}
              <Text style={styles.boldText}>Restrict:</Text> Limit how we process your data
              {"\n\n"}
              To exercise these rights, contact us at privacy@salonsarap.com
            </Text>
          </View>

          {/* Section 7 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Cookies and Tracking</Text>
            <Text style={styles.sectionContent}>
              Our app may use cookies and similar technologies to:
              {"\n\n"}
              • Remember your preferences and settings
              {"\n"}• Analyze app performance and usage
              {"\n"}• Provide personalized content
              {"\n"}• Enable social media features
              {"\n\n"}
              You can control cookie settings through your device settings, but disabling them may affect app functionality.
            </Text>
          </View>

          {/* Section 8 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
            <Text style={styles.sectionContent}>
              Our app may integrate with third-party services:
              {"\n\n"}
              <Text style={styles.boldText}>Social Media Login:</Text> Google, Facebook (optional)
              {"\n"}
              <Text style={styles.boldText}>Payment Processors:</Text> GCash, PayPal, Stripe
              {"\n"}
              <Text style={styles.boldText}>Analytics:</Text> Google Analytics, Firebase
              {"\n"}
              <Text style={styles.boldText}>Maps:</Text> Google Maps for location services
              {"\n\n"}
              These services have their own privacy policies. We encourage you to review them.
            </Text>
          </View>

          {/* Section 9 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Children's Privacy</Text>
            <Text style={styles.sectionContent}>
              Our app is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately.
              {"\n\n"}
              For users aged 13-17, parental consent may be required for certain services.
            </Text>
          </View>

          {/* Section 10 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. International Data Transfers</Text>
            <Text style={styles.sectionContent}>
              Your data may be processed in countries other than the Philippines for cloud storage and analytics purposes. We ensure appropriate safeguards are in place to protect your data during international transfers.
            </Text>
          </View>

          {/* Section 11 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Changes to This Policy</Text>
            <Text style={styles.sectionContent}>
              We may update this Privacy Policy periodically to reflect changes in our practices or applicable laws. We will:
              {"\n\n"}
              • Notify you through the app or email
              {"\n"}• Post the updated policy with the revision date
              {"\n"}• Give you time to review changes before they take effect
              {"\n\n"}
              Continued use of the app after changes constitutes acceptance of the updated policy.
            </Text>
          </View>

          {/* Section 12 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>12. Contact Us</Text>
            <Text style={styles.sectionContent}>
              For questions about this Privacy Policy or your personal data:
              {"\n\n"}
              <Text style={styles.boldText}>Data Protection Officer:</Text>
              {"\n"}Email: vansglowupsalon2k25@gmail.com
              {"\n"}Phone: +63 956 411 7744
              {"\n\n"}
              <Text style={styles.boldText}>Mailing Address:</Text>
              {"\n"}Van's Glow up Salon - Privacy Department
              {"\n"}Blk 7 Lot 2 Phase 1 SuB Urban Village, 
              {"\n"}Brgy. San Jose Rodriguez Rizal, Philippines
              {"\n\n"}
              <Text style={styles.boldText}>Regulatory Authority:</Text>
              {"\n"}You may also file complaints with the National Privacy Commission of the Philippines.
            </Text>
          </View>

          {/* Consent Section */}
          <View style={styles.consentSection}>
            <Text style={styles.consentTitle}>Your Consent</Text>
            <Text style={styles.consentText}>
              By using Van's Glow up Salon mobile application, you consent to the collection, use, and processing of your personal information as described in this Privacy Policy.
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
    borderLeftColor: '#2196F3',
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
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '600',
    color: '#333',
  },
  consentSection: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2196F3',
    marginTop: 10,
  },
  consentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 8,
    textAlign: 'center',
  },
  consentText: {
    fontSize: 16,
    color: '#1976d2',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 22,
  },
});