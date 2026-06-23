import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAttendanceStore } from '../store/useAttendanceStore';

interface CalendarDay {
  date: Date;
  status: 'present' | 'absent' | 'late' | 'empty';
  isCurrentMonth: boolean;
}

export const CalendarScreen = () => {
  const { records, isLoading } = useAttendanceStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: CalendarDay[] = [];

    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          prevMonthDays - i
        ),
        status: 'empty',
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const record = records.find((r) => {
        const recordDate = new Date(r.date);
        return (
          recordDate.getDate() === date.getDate() &&
          recordDate.getMonth() === date.getMonth() &&
          recordDate.getFullYear() === date.getFullYear()
        );
      });

      days.push({
        date,
        status: (record?.status as any) || 'empty',
        isCurrentMonth: true,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i),
        status: 'empty',
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#27ae60';
      case 'absent':
        return '#e74c3c';
      case 'late':
        return '#f39c12';
      default:
        return '#ecf0f1';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return 'حاضر';
      case 'absent':
        return 'غایب';
      case 'late':
        return 'تاخیر';
      default:
        return '';
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const calendarDays = getCalendarDays();
  const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>تقویم حضور</Text>
      </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {currentDate.toLocaleDateString('fa-IR', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#27ae60' }]} />
          <Text style={styles.legendText}>حاضر</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#e74c3c' }]} />
          <Text style={styles.legendText}>غایب</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#f39c12' }]} />
          <Text style={styles.legendText}>تاخیر</Text>
        </View>
      </View>

      <View style={styles.calendar}>
        {weekDays.map((day) => (
          <View key={day} style={styles.weekDayHeader}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}

        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              !day.isCurrentMonth && styles.otherMonthDay,
              day.status !== 'empty' && {
                backgroundColor: getStatusColor(day.status),
              },
            ]}
            onPress={() => setSelectedDate(day.date)}
          >
            <Text
              style={[
                styles.dayText,
                day.status !== 'empty' && styles.dayTextWhite,
                !day.isCurrentMonth && styles.otherMonthText,
              ]}
            >
              {day.date.getDate()}
            </Text>
            {day.status !== 'empty' && (
              <Text style={styles.statusIndicator}>
                {day.status === 'present'
                  ? '✓'
                  : day.status === 'absent'
                  ? '✕'
                  : '⏰'}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedDate && (
        <View style={styles.selectedDayInfo}>
          <Text style={styles.selectedDayTitle}>جزئیات روز</Text>
          <Text style={styles.selectedDayDate}>
            {selectedDate.toLocaleDateString('fa-IR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          {records.find(
            (r) =>
              new Date(r.date).toDateString() ===
              selectedDate.toDateString()
          ) ? (
            <>
              <Text style={styles.detailLabel}>وضعیت:</Text>
              <Text style={styles.detailValue}>
                {getStatusText(
                  records.find(
                    (r) =>
                      new Date(r.date).toDateString() ===
                      selectedDate.toDateString()
                  )?.status || ''
                )}
              </Text>
              {records.find(
                (r) =>
                  new Date(r.date).toDateString() ===
                  selectedDate.toDateString()
              )?.checkInTime && (
                <>
                  <Text style={styles.detailLabel}>ورود:</Text>
                  <Text style={styles.detailValue}>
                    {new Date(
                      records.find(
                        (r) =>
                          new Date(r.date).toDateString() ===
                          selectedDate.toDateString()
                      )?.checkInTime || ''
                    ).toLocaleTimeString('fa-IR')}
                  </Text>
                </>
              )}
            </>
          ) : (
            <Text style={styles.noDataText}>اطلاعات برای این روز موجود نیست</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    elevation: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  calendar: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekDayHeader: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    margin: 2,
    borderRadius: 8,
  },
  weekDayText: {
    fontWeight: 'bold',
    color: '#2c3e50',
    fontSize: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  otherMonthDay: {
    backgroundColor: '#f0f0f0',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2c3e50',
  },
  dayTextWhite: {
    color: '#fff',
    fontWeight: 'bold',
  },
  otherMonthText: {
    color: '#bdc3c7',
  },
  statusIndicator: {
    fontSize: 10,
    marginTop: 2,
  },
  selectedDayInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  selectedDayDate: {
    fontSize: 14,
    color: '#3498db',
    marginBottom: 15,
    textAlign: 'right',
  },
  detailLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 10,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
    marginTop: 5,
  },
  noDataText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 10,
  },
});
