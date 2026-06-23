import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

interface Notification {
  id: string;
  type: 'late' | 'absent' | 'alert' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  userId: string;
}

export const NotificationsScreen = () => {
  const user = useAuthStore((state) => state.user);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'late',
      title: 'هشدار تاخیر',
      message: 'شما 15 دقیقه تاخیر داشتید',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      userId: user?.id || '',
    },
    {
      id: '2',
      type: 'alert',
      title: 'یادآوری حضور',
      message: 'فردا روز کاری است. به موقع حاضر شوید',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
      userId: user?.id || '',
    },
    {
      id: '3',
      type: 'info',
      title: 'اطلاع جدید',
      message: 'سیستم حضور و غیاب به روز شد',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      userId: user?.id || '',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'late':
        return '#f39c12';
      case 'absent':
        return '#e74c3c';
      case 'alert':
        return '#3498db';
      case 'info':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'late':
        return '⏰';
      case 'absent':
        return '❌';
      case 'alert':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>اطلاع‌رسانی‌ها</Text>
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>

      {unreadCount > 0 && (
        <TouchableOpacity
          style={styles.markAllButton}
          onPress={markAllAsRead}
        >
          <Text style={styles.markAllButtonText}>علامت‌گذاری همه به عنوان خوانده شده</Text>
        </TouchableOpacity>
      )}

      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>اطلاع‌رسانی جدیدی نیست</Text>
        </View>
      ) : (
        <ScrollView style={styles.notificationsList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                !notification.read && styles.unreadCard,
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>
                    {getTypeIcon(notification.type)}
                  </Text>
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(notification.timestamp).toLocaleDateString('fa-IR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>

                {!notification.read && (
                  <View
                    style={[
                      styles.unreadDot,
                      { backgroundColor: getTypeColor(notification.type) },
                    ]}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  badge: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markAllButton: {
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  markAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loader: {
    marginTop: 50,
  },
  notificationsList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },
  unreadCard: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2c3e50',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: '#95a5a6',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
  },
});
