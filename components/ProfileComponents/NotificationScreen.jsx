// screens/NotificationScreen.js
import { View, Text, StyleSheet, SafeAreaView, FlatList } from 'react-native';

const NotificationScreen = () => {
  // Sample dummy data
  const notifications = [
    { id: '1', message: 'Your booking has been received!' },
    { id: '2', message: 'Admin approved your schedule.' },
    { id: '3', message: 'Reminder: Your appointment is tomorrow.' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    padding: 16,
    backgroundColor: '#fce4ec',
    borderRadius: 12,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
});
