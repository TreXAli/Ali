import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '../store/useAuthStore';

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  avatar?: string;
  lastCheckIn?: Date;
  status: 'present' | 'absent' | 'late';
}

export const EmployeeManagementScreen = () => {
  const user = useAuthStore((state) => state.user);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'علی احمدی',
      email: 'ali@example.com',
      phone: '09123456789',
      department: 'IT',
      role: 'Developer',
      status: 'present',
      lastCheckIn: new Date(),
    },
    {
      id: '2',
      name: 'زهرا علوی',
      email: 'zahra@example.com',
      phone: '09987654321',
      department: 'HR',
      role: 'Manager',
      status: 'absent',
    },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isManager = user?.role === 'manager' || user?.role === 'admin';

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalVisible(true);
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
        return '#95a5a6';
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
        return 'نامشخص';
    }
  };

  if (!isManager) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          شما دسترسی به این بخش ندارید
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>مدیریت کارکنان</Text>
      <Text style={styles.subtitle}>تعداد کارکنان: {employees.length}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
      ) : (
        <View>
          {employees.map((employee) => (
            <TouchableOpacity
              key={employee.id}
              style={styles.employeeCard}
              onPress={() => handleSelectEmployee(employee)}
            >
              <View style={styles.cardContent}>
                <View style={styles.employeeInfo}>
                  <Text style={styles.employeeName}>{employee.name}</Text>
                  <Text style={styles.employeeDepartment}>
                    {employee.department} - {employee.role}
                  </Text>
                  <Text style={styles.employeeContact}>{employee.email}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(employee.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(employee.status)}
                  </Text>
                </View>
              </View>

              {employee.lastCheckIn && (
                <Text style={styles.lastCheckIn}>
                  آخرین ورود: {new Date(employee.lastCheckIn).toLocaleTimeString('fa-IR')}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEmployee && (
              <>
                <Text style={styles.modalTitle}>{selectedEmployee.name}</Text>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>ایمیل:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.email}</Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>تلفن:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.phone}</Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>بخش:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.department}</Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>سمت:</Text>
                  <Text style={styles.modalValue}>{selectedEmployee.role}</Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>وضعیت:</Text>
                  <Text
                    style={[
                      styles.modalValue,
                      { color: getStatusColor(selectedEmployee.status) },
                    ]}
                  >
                    {getStatusText(selectedEmployee.status)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>بستن</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    textAlign: 'right',
  },
  loader: {
    marginTop: 50,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  employeeDepartment: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  employeeContact: {
    fontSize: 12,
    color: '#95a5a6',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  lastCheckIn: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'right',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  modalLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  closeButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
