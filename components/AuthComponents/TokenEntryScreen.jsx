import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function TokenEntryScreen({
  manualToken,
  setManualToken,
  validatingToken,
  setShowTokenEntry,
  handleManualTokenSubmit,
}) {
  const navigation = useNavigation();

  return (
    <View style={styles.tokenContainer}>
      <KeyboardAvoidingView
        style={styles.tokenKeyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.tokenScrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.tokenCard}>
            <TouchableOpacity
              style={styles.tokenBackButton}
              onPress={() => setShowTokenEntry(false)}
              disabled={validatingToken}
            >
              <Ionicons name="arrow-back-outline" size={24} color="#d13f3f" />
            </TouchableOpacity>

            <Text style={styles.tokenTitle}>Enter Reset Token</Text>
            <Text style={styles.tokenSubtitle}>
              Check your email and enter the token we sent you.
            </Text>

            <View style={styles.tokenInputSection}>
              <Text style={styles.tokenInputLabel}>
                Enter the token from your email:
              </Text>
              <TextInput
                style={styles.tokenTextInput}
                placeholder="Paste token here..."
                placeholderTextColor="#888"
                value={manualToken}
                onChangeText={setManualToken}
                multiline={true}
                numberOfLines={3}
                autoFocus={true}
                editable={!validatingToken}
              />
              <View style={styles.tokenButtonRow}>
                <TouchableOpacity
                  style={styles.cancelTokenButton}
                  onPress={() => {
                    setShowTokenEntry(false);
                    setManualToken('');
                  }}
                  disabled={validatingToken}
                >
                  <Text style={styles.cancelTokenButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.submitTokenButton,
                    (!manualToken.trim() || validatingToken) && styles.submitTokenButtonDisabled
                  ]}
                  onPress={handleManualTokenSubmit}
                  disabled={!manualToken.trim() || validatingToken}
                >
                  {validatingToken ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <Text style={styles.submitTokenButtonText}>Continue</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              disabled={validatingToken}
            >
              <Text style={styles.tokenBackToLoginText}>
                Remember your password?{' '}
                <Text style={styles.tokenBackToLoginLink}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  tokenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tokenKeyboard: {
    flex: 1,
  },
  tokenScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  tokenCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderColor: "#D4D4D4",
    borderWidth: 1,
    padding: 30,
    elevation: 1.5,
    alignItems: 'center',
    position: 'relative',
  },
  tokenBackButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 5,
  },
  tokenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 25,
    color: '#d13f3f',
    textAlign: 'center',
  },
  tokenSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  tokenInputSection: {
    width: '100%',
    marginBottom: 30,
  },
  tokenInputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
  tokenTextInput: {
    width: '100%',
    minHeight: 100,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#F8F8F8',
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  tokenButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelTokenButton: {
    flex: 1,
    height: 50,
    borderColor: '#D4D4D4',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  cancelTokenButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  submitTokenButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitTokenButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitTokenButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tokenBackToLoginText: {
    color: '#666',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 20,
  },
  tokenBackToLoginLink: {
    color: '#d13f3f',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});