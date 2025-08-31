import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function FAQScreen({ navigation }) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
 
  const faqData = [
    {
      category: "Booking & Appointments",
      questions: [
        {
          question: "How do I book an appointment?",
          answer: "You can book an appointment through our app in 3 easy steps:\n\n1. Browse our services and select your preferred treatment\n2. Choose your preferred service and style and available time slot\n3. Confirm your booking and receive instant confirmation\n\nYou can also call us directly."
        },
        {
          question: "Can I cancel or reschedule my appointment?",
          answer: "Yes! You can cancel or reschedule your appointment up to 24 hours before your scheduled time:\n\n• Go to 'My Bookings' in the app\n• Select the appointment you want to change\n• Choose 'Reschedule' or 'Cancel'\n\nCancellations made less than 24 hours may incur a cancellation fee."
        },
        {
          question: "What if I'm running late?",
          answer: "Please call the salon immediately if you're running late. We can hold your appointment for up to 15 minutes. If you're more than 15 minutes late, we may need to reschedule your appointment to accommodate other clients."
        },
        {
          question: "Can I book multiple services at once?",
          answer: "Absolutely! You can add multiple services to your booking:\n\n• Select your first service\n• Tap 'Add Another Service' before checkout\n• Choose additional treatments\n\nThe app will automatically calculate the total time and price for your combined services."
        }
      ]
    },
    {
      category: "Payments & Pricing",
      questions: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept various payment methods:\n\n• GCash (recommended for faster checkout)\n• Credit/Debit Cards (Visa, Mastercard)\n• Cash payment at the salon\n\nYou can save your preferred payment method in the app for quick bookings."
        },
        {
          question: "When am I charged for my appointment?",
          answer: "Payment timing depends on your chosen method:\n\n• Online payments: Charged immediately upon booking\n• Cash payments: Pay when you arrive at the salon\n• Deposit bookings: 50% deposit upon booking, remainder at the salon\n\nYou'll receive a detailed receipt via email after payment."
        },
        {
          question: "Do you offer discounts or promotions?",
          answer: "Yes! We regularly offer promotions:\n\n• First-time client discounts\n• Loyalty rewards program\n• Birthday month specials\n• Package deals for multiple services\n\nEnable notifications in the app to receive exclusive offers and promo codes."
        },
        {
          question: "What is your refund policy?",
          answer: "Refunds are processed based on our cancellation policy:\n\n• Cancellations 24+ hours: Full refund\n• Cancellations 12-24 hours: 50% refund\n• Cancellations <12 hours: No refund\n\nRefunds are processed within 5-7 business days to your original payment method."
        }
      ]
    },
    {
      category: "Services & Style",
      questions: [
        {
          question: "How long do different services take?",
          answer: "Service durations vary by treatment:\n\n• Hair Cut: 30-45 minutes\n• Hair Color: 2-3 hours\n• Rebond: 3-4 hours\n• Manicure: 45-60 minutes\n• Pedicure: 60-75 minutes\n\nExact timing is shown when you select each service in the app."
        },
        {
          question: "What should I bring to my appointment?",
          answer: "For most appointments, just bring:\n\n• Your booking confirmation\n• Valid ID\n• Payment method (if paying at salon)\n• Any inspiration photos for your desired look\n\nFor specific treatments like chemical services, avoid washing your hair 24-48 hours prior."
        },
        {
           question: "Can I customize my service or style?",
           answer: "Yes! Many of our services allow customization.\nFor example, you can choose specific haircut styles, add nail art designs, or request adjustments for treatments. Options and prices are shown when you select the service in the app."
    },
      ]
    },
    {
      category: "Account & App Issues",
      questions: [
        {
          question: "How do I create an account?",
          answer: "Creating an account is quick and easy:\n\n1. Download our Mobile app from the Website\n2. Tap 'Register Here' and enter your details\n3. Verify your email address\n4. Complete your profile with preferences\n\nYou can also sign up using your Google or Facebook account."
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer: "To reset your password:\n\n1. Go to the login screen\n2. Tap 'Forgot Password?'\n3. Enter your email address\n4. Check your email for reset instructions\n5. Create your new password\n\nIf you don't receive the email, check your spam folder."
        },
        {
          question: "How do I update my profile information?",
          answer: "You can update your profile anytime:\n\n• Go to 'My Profile' in the app\n• Tap 'Edit Profile'\n• Update your information\n• Save changes\n\nKeep your contact info current to receive booking confirmations and reminders."
        },
        {
          question: "The app isn't working properly. What should I do?",
          answer: "Try these troubleshooting steps:\n\n1. Force close and restart the app\n2. Check your internet connection\n3. Update to the latest app version\n4. Restart your phone\n5. Clear app cache\n\nIf issues persist, contact our support team through 'Contact Us' in the app."
        }
      ]
    },
    {
      category: "Loyalty & Rewards",
      questions: [
        {
          question: "How does the loyalty program work?",
          answer: "Earn points with every visit:\n\n• 1 point for every ₱50 spent\n• Bonus points on your birthday month\n• Extra points for referrals\n• Double points on select services\n\nTrack your points in the 'Loyalty & Rewards' section of your profile."
        },
        {
          question: "How do I redeem my points?",
          answer: "Redeem points easily:\n\n• 100 points = ₱100 discount\n• 250 points = Free basic manicure\n• 500 points = Free hair treatment\n• 1000 points = ₱1000 service credit\n\nPoints can be redeemed during checkout or at the salon."
        },
        {
          question: "Do my points expire?",
          answer: "Points have a 2-year expiry from the date earned. We'll send you reminders:\n\n• 6 months before expiry\n• 1 month before expiry\n• 1 week before expiry\n\nUse your points regularly to maximize your rewards!"
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {faqData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.category}</Text>
            
            {category.questions.map((item, questionIndex) => {
              const itemKey = `${categoryIndex}-${questionIndex}`;
              const isExpanded = expandedItems[itemKey];
              
              return (
                <View key={questionIndex} style={styles.faqItem}>
                  <TouchableOpacity
                    style={styles.questionContainer}
                    onPress={() => toggleExpanded(itemKey)}
                  >
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Icon 
                      name={isExpanded ? "expand-less" : "expand-more"} 
                      size={24} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {isExpanded && (
                    <View style={styles.answerContainer}>
                      <Text style={styles.answerText}>{item.answer}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Still have questions section */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <Text style={styles.contactText}>
            Can't find what you're looking for? Our support team is here to help!
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('ContactUs')}
          >
            <Icon name="chat" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
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
  categorySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#4CAF50',
    color: '#fff',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fafafa',
  },
  answerText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    marginTop: 20,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});