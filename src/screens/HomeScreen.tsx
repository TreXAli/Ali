import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { getCurrentLocation } from '../utils/locationService';

export const HomeScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { checkIn, checkOut, isLoading } = useAttendanceStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = async () => {
    try {
      const location = await getCurrentLocation();
      await checkIn(user?.id || '', location);
      setIsCheckedIn(true);
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      const location = await getCurrentLocation();
      await checkOut(user?.id || '', location);
      setIsCheckedIn(false);
    } catch (error) {
      console.error('Check-out error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>سلام، {user?.name}</Text>
      <Text style={styles.time}>{currentTime.toLocaleTimeString('fa-IR')}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <TouchableOpacity
          style={[styles.button, isCheckedIn && styles.checkOutButton]}
          onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
        >
          <Text style={styles.buttonText}>
            {isCheckedIn ? 'خروج' : 'ورود'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.status}>
        <Text style={styles.statusLabel}>وضعیت:</Text>
        <Text style={[styles.statusValue, isCheckedIn && styles.checkedIn]}>
          {isCheckedIn ? 'حاضر' : 'غایب'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  time: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2c3e50',
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  checkOutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  checkedIn: {
    color: '#27ae60',
  },
});
