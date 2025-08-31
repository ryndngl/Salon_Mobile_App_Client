import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Linking
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ContactUsScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.message) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      'Message Sent!', 
      'Thank you for contacting us. We will get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => navigation.goBack() }]
    );
  };

  const handleCall = () => {
    Linking.openURL('tel:+639564117744');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:vansglowupsalon2k25@gmail.com');
  };

  const handleSMS = () => {
    Linking.openURL('sms:+639564117744');
  };

  const contactMethods = [
    {
      icon: 'phone',
      title: 'Call Us',
      subtitle: '+63 956 411 7744',
      description: 'Available Mon-Sat, 9AM-9PM',
      action: handleCall,
      color: '#4CAF50'
    },
    {
      icon: 'email',
      title: 'Email Support',
      subtitle: 'vansglowupsalon2k25@gmail.com',
      description: 'We respond within 24 hours',
      action: handleEmail,
      color: '#2196F3'
    },
    {
      icon: 'sms',
      title: 'Text Us',
      subtitle: '+63 956 411 7744',
      description: 'Quick questions & support',
      action: handleSMS,
      color: '#FF9800'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Contact Methods */}
        <View style={styles.contactMethodsSection}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          <Text style={styles.sectionSubtitle}>
            Choose the best way to reach us. We're here to help with any questions or concerns!
          </Text>
          
          {contactMethods.map((method, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.contactMethodCard}
              onPress={method.action}
            >
              <View style={[styles.contactMethodIcon, { backgroundColor: method.color }]}>
                <Icon name={method.icon} size={24} color="#fff" />
              </View>
              <View style={styles.contactMethodContent}>
                <Text style={styles.contactMethodTitle}>{method.title}</Text>
                <Text style={styles.contactMethodSubtitle}>{method.subtitle}</Text>
                <Text style={styles.contactMethodDescription}>{method.description}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Contact Form */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <Text style={styles.sectionSubtitle}>
            Fill out the form below and we'll get back to you as soon as possible.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.textInput}
              placeholder="What is this about?"
              value={formData.subject}
              onChangeText={(text) => setFormData({...formData, subject: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Message *</Text>
            <TextInput
              style={[styles.textInput, styles.messageInput]}
              placeholder="Please describe your question or concern..."
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={formData.message}
              onChangeText={(text) => setFormData({...formData, message: text})}
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Icon name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>

        {/* Business Hours */}
        <View style={styles.hoursSection}>
          <Text style={styles.sectionTitle}>Business Hours</Text>
          
          <View style={styles.hoursCard}>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Monday - Friday</Text>
              <Text style={styles.timeText}>9:00 AM - 9:00 PM</Text>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Saturday</Text>
              <Text style={styles.timeText}>9:00 AM - 9:00 PM</Text>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Sunday</Text>
              <Text style={styles.timeText}>9:00 AM - 9:00 PM</Text>
            </View>
            <View style={styles.hourRow}>
              <Text style={styles.dayText}>Holidays</Text>
              <Text style={styles.timeText}>By Appointment Only</Text>
            </View>
          </View>

          <View style={styles.responseTimeCard}>
            <Icon name="schedule" size={20} color="#4CAF50" />
            <Text style={styles.responseTimeText}>
              We typically respond to all inquiries within 24 hours during business days.
            </Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationSection}>
          <Text style={styles.sectionTitle}>Visit Our Salon</Text>
          
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <Icon name="location-on" size={20} color="#4CAF50" />
              <View style={styles.locationContent}>
                <Text style={styles.locationTitle}>Van's Glow up Salon</Text>
                <Text style={styles.locationAddress}>
                 Blk 7 Lot 2 Phase 1 SuB Urban Village{"\n"}
                 Brgy. San Jose Rodriguez Rizal{"\n"}
                  Philippines
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => Linking.openURL('https://www.google.com/maps/place/DHALIA+SALON/@14.7527606,121.140007,3a,75y,358.61h,93.72t/data=!3m8!1e1!3m6!1s1XYYx1P5CGRuNC5P8n-s_w!2e0!5s20240201T000000!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D-3.719836212531348%26panoid%3D1XYYx1P5CGRuNC5P8n-s_w%26yaw%3D358.6066431000693!7i16384!8i8192!4m6!3m5!1s0x3397a4ccd3336411:0xdf88bba0b4df985e!8m2!3d14.7528255!4d121.1400074!16s%2Fg%2F11w33sfjnz?hl=en&entry=ttu&g_ep=EgoyMDI1MDgwNi4wIKXMDSoASAFQAw%3D%3D')}
            >
              <Icon name="directions" size={18} color="#fff" />
              <Text style={styles.directionsButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Redirect */}
        <View style={styles.faqRedirectSection}>
          <Text style={styles.faqRedirectTitle}>Looking for Quick Answers?</Text>
          <Text style={styles.faqRedirectText}>
            Check our FAQ section for instant answers to common questions.
          </Text>
          <TouchableOpacity 
            style={styles.faqRedirectButton}
            onPress={() => navigation.navigate('FAQs')}
          >
            <Icon name="help" size={18} color="#4CAF50" />
            <Text style={styles.faqRedirectButtonText}>View FAQs</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  
  // Contact Methods
  contactMethodsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactMethodContent: {
    flex: 1,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactMethodSubtitle: {
    fontSize: 15,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 2,
  },
  contactMethodDescription: {
    fontSize: 14,
    color: '#666',
  },
  
  // Form Section
  formSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  messageInput: {
    height: 120,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // Business Hours
  hoursSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  hoursCard: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  hourRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  responseTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  responseTimeText: {
    fontSize: 14,
    color: '#15803d',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  
  // Location
  locationSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
  },
  locationCard: {
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  locationContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  
  // FAQ Redirect
  faqRedirectSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  faqRedirectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  faqRedirectText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  faqRedirectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  faqRedirectButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});