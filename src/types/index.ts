// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'employee';
  department: string;
  avatar?: string;
  createdAt: Date;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  userId: string;
  date: Date;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'present' | 'absent' | 'late' | 'half-day';
  location?: {
    latitude: number;
    longitude: number;
  };
  notes?: string;
}

// Report Types
export interface AttendanceReport {
  userId: string;
  month: number;
  year: number;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  attendanceRate: number;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  industry: string;
  employees: number;
  createdAt: Date;
}
