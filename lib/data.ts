"use client";

import { useState, useEffect, useCallback } from 'react';

export interface Student {
  id: string;
  name: string;
  class: string;
  admissionNo: string;
  gender: string;
  parent: string;
  phone: string;
  email?: string;
  fees: string;
  status: string;
  photo?: string;
  createdAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  email: string;
  status: string;
  photo?: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Exam {
  id: string;
  name: string;
  class: string;
  date: string;
  duration: string;
  status: string;
  subject?: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  examId: string;
  examName: string;
  score: number;
  maxScore: number;
  grade: string;
}

export interface Payment {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  date: string;
  method: string;
  status: string;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  class: string;
  copies: number;
  available: number;
  shelf: string;
  isbn?: string;
}

export interface Loan {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  bookId: string;
  bookTitle: string;
  loanDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Generate unique ID
export const generateId = () => Math.random().toString(36).substring(2, 15);

export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; }
      else { current += char; }
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] || ''; });
    return row;
  });
}

// Initial mock data
const initialStudents: Student[] = [
  { id: '1', name: 'John Okello', class: 'P.7', admissionNo: 'ST/2024/001', gender: 'Male', parent: 'Mr. Okello', phone: '0770XXX', fees: 'Paid', status: 'Active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Sarah Nakato', class: 'S.1', admissionNo: 'ST/2024/002', gender: 'Female', parent: 'Mrs. Nakato', phone: '0772XXX', fees: 'Pending', status: 'Active', createdAt: new Date().toISOString() },
  { id: '3', name: 'David Ssebu', class: 'P.6', admissionNo: 'ST/2024/003', gender: 'Male', parent: 'Mr. Ssebu', phone: '0773XXX', fees: 'Overdue', status: 'Active', createdAt: new Date().toISOString() },
  { id: '4', name: 'Mary Namuli', class: 'S.2', admissionNo: 'ST/2024/004', gender: 'Female', parent: 'Mr. Namuli', phone: '0774XXX', fees: 'Paid', status: 'Active', createdAt: new Date().toISOString() },
  { id: '5', name: 'Peter Wasswa', class: 'P.5', admissionNo: 'ST/2024/005', gender: 'Male', parent: 'Mr. Wasswa', phone: '0775XXX', fees: 'Paid', status: 'Active', createdAt: new Date().toISOString() },
  { id: '6', name: 'Grace Atim', class: 'S.3', admissionNo: 'ST/2024/006', gender: 'Female', parent: 'Mrs. Atim', phone: '0776XXX', fees: 'Pending', status: 'Active', createdAt: new Date().toISOString() },
  { id: '7', name: 'James Mukasa', class: 'P.6', admissionNo: 'ST/2024/007', gender: 'Male', parent: 'Mr. Mukasa', phone: '0777XXX', fees: 'Paid', status: 'Active', createdAt: new Date().toISOString() },
  { id: '8', name: 'Faith Apio', class: 'S.1', admissionNo: 'ST/2024/008', gender: 'Female', parent: 'Mrs. Apio', phone: '0778XXX', fees: 'Paid', status: 'Active', createdAt: new Date().toISOString() },
];

const initialStaff: Staff[] = [
  { id: '1', name: 'Mr. John Kamulegeya', role: 'Headteacher', department: 'Administration', phone: '0772XXX', email: 'john@school.ug', status: 'Active', createdAt: new Date().toISOString() },
  { id: '2', name: 'Mrs. Grace Namutowe', role: 'Deputy Head', department: 'Administration', phone: '0773XXX', email: 'grace@school.ug', status: 'Active', createdAt: new Date().toISOString() },
  { id: '3', name: 'Mr. Peter Ssegujja', role: 'Mathematics Teacher', department: 'Science', phone: '0774XXX', email: 'peter@school.ug', status: 'Active', createdAt: new Date().toISOString() },
  { id: '4', name: 'Mrs. Faith Mbabazi', role: 'English Teacher', department: 'Languages', phone: '0775XXX', email: 'faith@school.ug', status: 'Active', createdAt: new Date().toISOString() },
  { id: '5', name: 'Mr. David Kigozi', role: 'Science Teacher', department: 'Science', phone: '0776XXX', email: 'david@school.ug', status: 'Active', createdAt: new Date().toISOString() },
  { id: '6', name: 'Ms. Sarah Nakayiza', role: 'Secretary', department: 'Administration', phone: '0777XXX', email: 'sarah@school.ug', status: 'Active', createdAt: new Date().toISOString() },
];

const initialExams: Exam[] = [
  { id: '1', name: 'UNEB PLE Mock', class: 'P.7', date: 'May 5, 2026', duration: '2 hours', status: 'Upcoming' },
  { id: '2', name: 'UCE Mid-Term', class: 'S.2', date: 'May 10, 2026', duration: '3 hours', status: 'Upcoming' },
  { id: '3', name: 'CA2 - Mathematics', class: 'P.5', date: 'Apr 25, 2026', duration: '1 hour', status: 'Due Soon' },
  { id: '4', name: 'Physics Quiz', class: 'S.4', date: 'Apr 23, 2026', duration: '30 mins', status: 'Due Soon' },
];

const initialAttendance: Attendance[] = [
  { id: '1', studentId: '1', studentName: 'John Okello', class: 'P.7', date: new Date().toISOString().split('T')[0], status: 'present' },
  { id: '2', studentId: '2', studentName: 'Sarah Nakato', class: 'S.1', date: new Date().toISOString().split('T')[0], status: 'present' },
  { id: '3', studentId: '3', studentName: 'David Ssebu', class: 'P.6', date: new Date().toISOString().split('T')[0], status: 'absent' },
  { id: '4', studentId: '4', studentName: 'Mary Namuli', class: 'S.2', date: new Date().toISOString().split('T')[0], status: 'present' },
];

const initialBooks: Book[] = [
  { id: '1', title: 'Primary English P.7', author: 'NCDC', class: 'P.7', copies: 45, available: 38, shelf: 'A-1' },
  { id: '2', title: 'Mathematics for Uganda P.4', author: 'MECS', class: 'P.4', copies: 30, available: 25, shelf: 'A-2' },
  { id: '3', title: 'Science & Technology P.6', author: 'NCDC', class: 'P.6', copies: 28, available: 20, shelf: 'B-1' },
  { id: '4', title: 'Social Studies S.1', author: 'MECS', class: 'S.1', copies: 35, available: 30, shelf: 'B-2' },
];

const initialLoans: Loan[] = [
  { id: '1', studentId: '1', studentName: 'John Okello', class: 'P.7', bookId: '1', bookTitle: 'English P.7', loanDate: 'Apr 18, 2026', dueDate: 'May 2, 2026', status: 'active' },
  { id: '2', studentId: '2', studentName: 'Sarah Nakato', class: 'S.1', bookId: '4', bookTitle: 'Social Studies S.1', loanDate: 'Apr 17, 2026', dueDate: 'May 1, 2026', status: 'active' },
];

const initialLeaveRequests: LeaveRequest[] = [
  { id: '1', staffId: '1', staffName: 'Mr. Ochieng David', department: 'Science', type: 'Annual Leave', startDate: '2024-02-19', endDate: '2024-02-25', days: 5, reason: 'Family vacation', status: 'pending', createdAt: new Date().toISOString() },
  { id: '2', staffId: '2', staffName: 'Ms. Akello Faith', department: 'Mathematics', type: 'Sick Leave', startDate: '2024-02-14', endDate: '2024-02-16', days: 3, reason: 'Medical appointment', status: 'approved', createdAt: new Date().toISOString() },
];

// LocalStorage helpers
const getFromStorage = <T>(key: string, initial: T): T => {
  if (typeof window === 'undefined') return initial;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initial;
  } catch (e) {
    console.error(`Failed to read from localStorage (${key}):`, e);
    return initial;
  }
};

const saveToStorage = <T>(key: string, data: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save to localStorage (${key}):`, e);
  }
};

// Hook for Students
export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStudents(getFromStorage('school_students', initialStudents));
    setLoading(false);
  }, []);

  const addStudent = useCallback((student: Omit<Student, 'id' | 'createdAt'>) => {
    const newStudent = { ...student, id: generateId(), createdAt: new Date().toISOString() };
    setStudents(prev => {
      const updated = [...prev, newStudent];
      saveToStorage('school_students', updated);
      return updated;
    });
    return newStudent;
  }, []);

  const updateStudent = useCallback((id: string, updates: Partial<Student>) => {
    setStudents(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      saveToStorage('school_students', updated);
      return updated;
    });
  }, []);

  const deleteStudent = useCallback((id: string) => {
    setStudents(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveToStorage('school_students', updated);
      return updated;
    });
  }, []);

  return { students, loading, addStudent, updateStudent, deleteStudent };
}

// Hook for Staff
export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setStaff(getFromStorage('school_staff', initialStaff));
    setLoading(false);
  }, []);

  const addStaff = useCallback((member: Omit<Staff, 'id' | 'createdAt'>) => {
    const newStaff = { ...member, id: generateId(), createdAt: new Date().toISOString() };
    setStaff(prev => {
      const updated = [...prev, newStaff];
      saveToStorage('school_staff', updated);
      return updated;
    });
    return newStaff;
  }, []);

  const updateStaff = useCallback((id: string, updates: Partial<Staff>) => {
    setStaff(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      saveToStorage('school_staff', updated);
      return updated;
    });
  }, []);

  const deleteStaff = useCallback((id: string) => {
    setStaff(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveToStorage('school_staff', updated);
      return updated;
    });
  }, []);

  return { staff, loading, addStaff, updateStaff, deleteStaff };
}

// Hook for Exams
export function useExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setExams(getFromStorage('school_exams', initialExams));
    setLoading(false);
  }, []);

  const addExam = useCallback((exam: Omit<Exam, 'id'>) => {
    const newExam = { ...exam, id: generateId() };
    setExams(prev => {
      const updated = [...prev, newExam];
      saveToStorage('school_exams', updated);
      return updated;
    });
    return newExam;
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage('school_exams', updated);
      return updated;
    });
  }, []);

  return { exams, loading, addExam, deleteExam };
}

// Hook for Attendance
export function useAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAttendance(getFromStorage('school_attendance', initialAttendance));
    setLoading(false);
  }, []);

  const markAttendance = useCallback((record: Omit<Attendance, 'id'>) => {
    const existingIndex = attendance.findIndex(
      a => a.studentId === record.studentId && a.date === record.date
    );
    
    if (existingIndex >= 0) {
      setAttendance(prev => {
        const updated = [...prev];
        updated[existingIndex] = { ...record, id: prev[existingIndex].id };
        saveToStorage('school_attendance', updated);
        return updated;
      });
    } else {
      const newRecord = { ...record, id: generateId() };
      setAttendance(prev => {
        const updated = [...prev, newRecord];
        saveToStorage('school_attendance', updated);
        return updated;
      });
    }
  }, [attendance]);

  const getAttendanceByDate = useCallback((date: string) => {
    return attendance.filter(a => a.date === date);
  }, [attendance]);

  return { attendance, loading, markAttendance, getAttendanceByDate };
}

// Hook for Library
export function useLibrary() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBooks(getFromStorage('school_books', initialBooks));
    setLoans(getFromStorage('school_loans', initialLoans));
    setLoading(false);
  }, []);

  const addBook = useCallback((book: Omit<Book, 'id'>) => {
    const newBook = { ...book, id: generateId() };
    setBooks(prev => {
      const updated = [...prev, newBook];
      saveToStorage('school_books', updated);
      return updated;
    });
    return newBook;
  }, []);

  const issueBook = useCallback((loan: Omit<Loan, 'id' | 'status'>) => {
    const newLoan: Loan = { ...loan, id: generateId(), status: 'active' };
    setLoans(prev => {
      const updated = [...prev, newLoan];
      saveToStorage('school_loans', updated);
      return updated;
    });
    setBooks(prev => {
      const updated = prev.map(b => {
        if (b.id === loan.bookId) {
          return { ...b, available: Math.max(0, b.available - 1) };
        }
        return b;
      });
      saveToStorage('school_books', updated);
      return updated;
    });
    return newLoan;
  }, []);

  const returnBook = useCallback((loanId: string) => {
    setLoans(prev => {
      const loan = prev.find(l => l.id === loanId);
      if (loan) {
        const updated = prev.map(l => 
          l.id === loanId ? { ...l, status: 'returned' as const, returnDate: new Date().toISOString() } : l
        );
        saveToStorage('school_loans', updated);
        return updated;
      }
      return prev;
    });
    setBooks(prev => {
      const loan = loans.find(l => l.id === loanId);
      if (loan) {
        const updated = prev.map(b => {
          if (b.id === loan.bookId) {
            return { ...b, available: Math.min(b.copies, b.available + 1) };
          }
          return b;
        });
        saveToStorage('school_books', updated);
        return updated;
      }
      return prev;
    });
  }, [loans]);

  return { books, loans, loading, addBook, issueBook, returnBook };
}

// Hook for Leave Requests
export function useLeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRequests(getFromStorage('school_leave', initialLeaveRequests));
    setLoading(false);
  }, []);

  const addRequest = useCallback((request: Omit<LeaveRequest, 'id' | 'createdAt'>) => {
    const newRequest = { ...request, id: generateId(), createdAt: new Date().toISOString() };
    setRequests(prev => {
      const updated = [...prev, newRequest];
      saveToStorage('school_leave', updated);
      return updated;
    });
    return newRequest;
  }, []);

  const updateRequestStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    setRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status } : r);
      saveToStorage('school_leave', updated);
      return updated;
    });
  }, []);

  return { requests, loading, addRequest, updateRequestStatus };
}

// Format UGX
export const formatUGX = (amount: number) => `UGX ${amount.toLocaleString('en-US')}`;

// Hook for Payments
export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const initialPayments: Payment[] = [
    { id: '1', studentId: '1', studentName: 'John Okello', class: 'P.7', amount: 920000, date: '2026-04-20', method: 'Mobile Money', status: 'Confirmed' },
    { id: '2', studentId: '2', studentName: 'Mary Namuli', class: 'S.2', amount: 1100000, date: '2026-04-19', method: 'Bank Transfer', status: 'Confirmed' },
    { id: '3', studentId: '3', studentName: 'James Mukasa', class: 'P.6', amount: 920000, date: '2026-04-18', method: 'Cash', status: 'Pending' },
    { id: '4', studentId: '4', studentName: 'Faith Apio', class: 'S.1', amount: 1100000, date: '2026-04-17', method: 'Mobile Money', status: 'Confirmed' },
  ];

  useEffect(() => {
    setPayments(getFromStorage('school_payments', initialPayments));
    setLoading(false);
  }, []);

  const addPayment = useCallback((payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: generateId() };
    setPayments(prev => {
      const updated = [...prev, newPayment];
      saveToStorage('school_payments', updated);
      return updated;
    });
    return newPayment;
  }, []);

  const updatePaymentStatus = useCallback((id: string, status: string) => {
    setPayments(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, status } : p);
      saveToStorage('school_payments', updated);
      return updated;
    });
  }, []);

  return { payments, loading, addPayment, updatePaymentStatus };
}

export interface TimetableEntry {
  id: string;
  class: string;
  time: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
}

export interface ExamSchedule {
  id: string;
  name: string;
  class: string;
  date: string;
  duration: string;
}

// Hook for Timetable
export function useTimetable() {
  const initialTimetable: { [key: string]: TimetableEntry[] } = {
    'P.7': [
      { id: '1', class: 'P.7', time: '7:30 - 8:30', mon: 'English', tue: 'Math', wed: 'Science', thu: 'Social Studies', fri: 'English' },
      { id: '2', class: 'P.7', time: '8:30 - 9:30', mon: 'Math', tue: 'Science', wed: 'English', thu: 'Math', fri: 'Science' },
      { id: '3', class: 'P.7', time: '9:30 - 10:30', mon: 'Science', tue: 'English', wed: 'Math', thu: 'Science', fri: 'Math' },
      { id: '4', class: 'P.7', time: '10:30 - 11:00', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
      { id: '5', class: 'P.7', time: '11:00 - 12:00', mon: 'Social Studies', tue: 'PE', wed: 'CRE', thu: 'Art', fri: 'Music' },
      { id: '6', class: 'P.7', time: '12:00 - 1:00', mon: 'CRE', tue: 'Social Studies', wed: 'PE', thu: 'Art', fri: 'Library' },
    ],
    'S.1': [
      { id: '1', class: 'S.1', time: '7:30 - 8:30', mon: 'Math', tue: 'English', wed: 'Biology', thu: 'Chemistry', fri: 'Physics' },
      { id: '2', class: 'S.1', time: '8:30 - 9:30', mon: 'English', tue: 'Physics', wed: 'Math', thu: 'English', fri: 'Chemistry' },
      { id: '3', class: 'S.1', time: '9:30 - 10:30', mon: 'Chemistry', tue: 'Biology', wed: 'Physics', thu: 'Math', fri: 'Biology' },
      { id: '4', class: 'S.1', time: '10:30 - 11:00', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
      { id: '5', class: 'S.1', time: '11:00 - 12:00', mon: 'Geography', tue: 'History', wed: 'CRE', thu: 'Computer', fri: 'Geography' },
      { id: '6', class: 'S.1', time: '12:00 - 1:00', mon: 'History', tue: 'Geography', wed: 'Computer', thu: 'CRE', fri: 'History' },
    ],
  };

  const initialSchedules: ExamSchedule[] = [
    { id: '1', name: 'Mid-Term Exams', class: 'All', date: 'Mar 20 - Mar 27, 2026', duration: 'Week' },
    { id: '2', name: 'End of Term Exams', class: 'All', date: 'Apr 14 - Apr 21, 2026', duration: 'Week' },
    { id: '3', name: 'UNEB Mock Exams', class: 'P.7, S.4', date: 'May 5 - May 12, 2026', duration: 'Week' },
  ];

  const [timetable, setTimetable] = useState<{ [key: string]: TimetableEntry[] }>({});
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimetable(getFromStorage('school_timetable', initialTimetable));
    setSchedules(getFromStorage('school_schedules', initialSchedules));
    setLoading(false);
  }, []);

  return { timetable, schedules, loading };
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  description?: string;
}

// Hook for Calendar/Events
export function useEvents() {
  const initialEvents: CalendarEvent[] = [
    { id: '1', title: 'First Term Examinations', date: '2026-04-25', time: '8:00 AM', type: 'Exam' },
    { id: '2', title: 'Parents Teachers Meeting', date: '2026-04-28', time: '10:00 AM', type: 'Event' },
    { id: '3', title: 'Sport Day', date: '2026-05-05', time: '7:00 AM', type: 'Event' },
    { id: '4', title: 'Career Day', date: '2026-05-12', time: '9:00 AM', type: 'Event' },
    { id: '5', title: 'Second Term Begins', date: '2026-05-15', time: '8:00 AM', type: 'Holiday' },
  ];

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEvents(getFromStorage('school_events', initialEvents));
    setLoading(false);
  }, []);

  const addEvent = useCallback((event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = { ...event, id: generateId() };
    setEvents(prev => {
      const updated = [...prev, newEvent];
      saveToStorage('school_events', updated);
      return updated;
    });
    return newEvent;
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage('school_events', updated);
      return updated;
    });
  }, []);

  return { events, loading, addEvent, deleteEvent };
}

export interface Admission {
  id: string;
  name: string;
  class: string;
  parent: string;
  phone: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  dob: string;
  gender: string;
  photo?: string;
  parentPhoto?: string;
}

export function useAdmissions() {
  const initialAdmissions: Admission[] = [
    { id: '1', name: 'Emmanuel Tumusiime', class: 'P.1', parent: 'Mr. Tumusiime', phone: '0770XXX', email: 'tumusiime@email.ug', status: 'pending', date: '2026-04-20', dob: '2020-03-15', gender: 'Male', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%233b82f6%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EET%3C/text%3E%3C/svg%3E', parentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%238b5cf6%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2235%22 text-anchor=%22middle%22 fill=%22white%22%3EMT%3C/text%3E%3C/svg%3E' },
    { id: '2', name: 'Ruth Akello', class: 'S.1', parent: 'Mrs. Akello', phone: '0772XXX', email: 'akello@email.ug', status: 'approved', date: '2026-04-18', dob: '2010-07-22', gender: 'Female', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23ec4899%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ERA%3C/text%3E%3C/svg%3E', parentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%2306b6d4%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2235%22 text-anchor=%22middle%22 fill=%22white%22%3EMA%3C/text%3E%3C/svg%3E' },
    { id: '3', name: 'Steven Mwesigwa', class: 'P.4', parent: 'Mr. Mwesigwa', phone: '0773XXX', email: 'mwesigwa@email.ug', status: 'pending', date: '2026-04-19', dob: '2016-01-10', gender: 'Male', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%2310b981%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ESM%3C/text%3E%3C/svg%3E', parentPhoto: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2235%22 text-anchor=%22middle%22 fill=%22white%22%3EMM%3C/text%3E%3C/svg%3E' },
  ];

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAdmissions(getFromStorage('school_admissions', initialAdmissions));
    setLoading(false);
  }, []);

  const addAdmission = useCallback((admission: Omit<Admission, 'id'>) => {
    const newAdmission = { ...admission, id: generateId() };
    setAdmissions(prev => {
      const updated = [...prev, newAdmission];
      saveToStorage('school_admissions', updated);
      return updated;
    });
    return newAdmission;
  }, []);

  const updateStatus = useCallback((id: string, status: 'pending' | 'approved' | 'rejected') => {
    setAdmissions(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, status } : a);
      saveToStorage('school_admissions', updated);
      return updated;
    });
  }, []);

  const updateAdmission = useCallback((id: string, updates: Partial<Admission>) => {
    setAdmissions(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, ...updates } : a);
      saveToStorage('school_admissions', updated);
      return updated;
    });
  }, []);

  return { admissions, loading, addAdmission, updateStatus, updateAdmission };
}

export interface BoardingStudent {
  id: string;
  name: string;
  class: string;
  dorm: string;
  room: string;
  meals: number;
  status: 'active' | 'checked_out' | 'on_leave';
}

export function useBoarding() {
  const initialBoarders: BoardingStudent[] = [
    { id: '1', name: 'John Okello', class: 'S.2', dorm: 'Nile House', room: 'Room 12', meals: 3, status: 'active' },
    { id: '2', name: 'Sarah Nakato', class: 'S.3', dorm: 'Victoria House', room: 'Room 8', meals: 3, status: 'active' },
    { id: '3', name: 'David Ssebu', class: 'S.1', dorm: 'Albert House', room: 'Room 5', meals: 3, status: 'active' },
    { id: '4', name: 'Mary Namuli', class: 'S.4', dorm: 'Victoria House', room: 'Room 15', meals: 3, status: 'active' },
    { id: '5', name: 'Peter Wasswa', class: 'P.7', dorm: 'Baker House', room: 'Room 3', meals: 3, status: 'active' },
  ];

  const [boarders, setBoarders] = useState<BoardingStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setBoarders(getFromStorage('school_boarding', initialBoarders));
    setLoading(false);
  }, []);

  const addBoarder = useCallback((boarder: Omit<BoardingStudent, 'id'>) => {
    const newBoarder = { ...boarder, id: generateId() };
    setBoarders(prev => {
      const updated = [...prev, newBoarder];
      saveToStorage('school_boarding', updated);
      return updated;
    });
    return newBoarder;
  }, []);

  const updateBoarder = useCallback((id: string, updates: Partial<BoardingStudent>) => {
    setBoarders(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...updates } : b);
      saveToStorage('school_boarding', updated);
      return updated;
    });
  }, []);

  const deleteBoarder = useCallback((id: string) => {
    setBoarders(prev => {
      const updated = prev.filter(b => b.id !== id);
      saveToStorage('school_boarding', updated);
      return updated;
    });
  }, []);

  return { boarders, loading, addBoarder, updateBoarder, deleteBoarder };
}

export interface TransportRoute {
  id: string;
  name: string;
  area: string;
  fee: number;
  students: number;
}

export interface BudgetRequest {
  id: string;
  department: string;
  description: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  condition: 'good' | 'fair' | 'poor';
  location: string;
  lastUpdated: string;
}

export interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  condition: string;
  medication: string;
  allergies: string;
  lastCheckup: string;
  notes: string;
}

export interface Team {
  id: string;
  name: string;
  coach: string;
  members: number;
  wins: number;
  losses: number;
  status: string;
}

export interface SportEvent {
  id: string;
  name: string;
  sport: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  participants: number;
  result: string;
}

export function useSportEvents() {
  const initialEvents: SportEvent[] = [
    { id: '1', name: 'East African Games 2026', sport: 'Multi-sport', date: 'Jul 15-25, 2026', location: 'Nairobi, Kenya', status: 'upcoming', participants: 12, result: '' },
    { id: '2', name: 'National Schools Cup', sport: 'Football', date: 'May 20, 2026', location: 'Kampala', status: 'upcoming', participants: 8, result: '' },
    { id: '3', name: 'District Athletics', sport: 'Athletics', date: 'Apr 30, 2026', location: 'Mukono', status: 'completed', participants: 15, result: '2nd Place' },
  ];

  const [events, setEvents] = useState<SportEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setEvents(getFromStorage('school_sport_events', initialEvents));
    setLoading(false);
  }, []);

  const addEvent = useCallback((event: Omit<SportEvent, 'id'>) => {
    const newEvent = { ...event, id: generateId() };
    setEvents(prev => {
      const updated = [...prev, newEvent];
      saveToStorage('school_sport_events', updated);
      return updated;
    });
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, updates: Partial<SportEvent>) => {
    setEvents(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...updates } : e);
      saveToStorage('school_sport_events', updated);
      return updated;
    });
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const updated = prev.filter(e => e.id !== id);
      saveToStorage('school_sport_events', updated);
      return updated;
    });
  }, []);

  return { events, loading, addEvent, updateEvent, deleteEvent };
}

export interface House {
  id: string;
  name: string;
  color: string;
  students: number;
  points: number;
  captain: string;
}

export interface DisciplineIncident {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  type: string;
  description: string;
  date: string;
  action: string;
  status: 'pending' | 'resolved';
}

export function useDiscipline() {
  const initialIncidents: DisciplineIncident[] = [
    { id: '1', studentId: '1', studentName: 'John Okello', class: 'P.7', type: 'Late Arrival', description: 'Arrived 30 minutes late', date: '2026-04-20', action: 'Warning issued', status: 'resolved' },
    { id: '2', studentId: '2', studentName: 'Sarah Nakato', class: 'S.1', type: 'Uniform Violation', description: 'Not wearing proper uniform', date: '2026-04-19', action: 'Warning issued', status: 'pending' },
    { id: '3', studentId: '3', studentName: 'David Ssebu', class: 'P.6', type: 'Disruptive Behavior', description: 'Disrupting class', date: '2026-04-18', action: 'Sent to headteacher', status: 'pending' },
  ];

  const [incidents, setIncidents] = useState<DisciplineIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIncidents(getFromStorage('school_discipline', initialIncidents));
    setLoading(false);
  }, []);

  const addIncident = useCallback((incident: Omit<DisciplineIncident, 'id'>) => {
    const newIncident = { ...incident, id: generateId() };
    setIncidents(prev => {
      const updated = [...prev, newIncident];
      saveToStorage('school_discipline', updated);
      return updated;
    });
    return newIncident;
  }, []);

  const resolveIncident = useCallback((id: string) => {
    setIncidents(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, status: 'resolved' as const } : i);
      saveToStorage('school_discipline', updated);
      return updated;
    });
  }, []);

  return { incidents, loading, addIncident, resolveIncident };
}

// Hook for Transport
export function useTransport() {
  const initialRoutes: TransportRoute[] = [
    { id: '1', name: 'Route A - Kampala Central', area: 'Kampala', fee: 150000, students: 25 },
    { id: '2', name: 'Route B - Entebbe', area: 'Entebbe', fee: 200000, students: 15 },
    { id: '3', name: 'Route C - Mukono', area: 'Mukono', fee: 180000, students: 20 },
    { id: '4', name: 'Route D - Wakiso', area: 'Wakiso', fee: 120000, students: 30 },
  ];

  const [routes, setRoutes] = useState<TransportRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRoutes(getFromStorage('school_transport', initialRoutes));
    setLoading(false);
  }, []);

  const addRoute = useCallback((route: Omit<TransportRoute, 'id'>) => {
    const newRoute = { ...route, id: generateId() };
    setRoutes(prev => {
      const updated = [...prev, newRoute];
      saveToStorage('school_transport', updated);
      return updated;
    });
    return newRoute;
  }, []);

  const updateRoute = useCallback((id: string, updates: Partial<TransportRoute>) => {
    setRoutes(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      saveToStorage('school_transport', updated);
      return updated;
    });
  }, []);

  const deleteRoute = useCallback((id: string) => {
    setRoutes(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveToStorage('school_transport', updated);
      return updated;
    });
  }, []);

  return { routes, loading, addRoute, updateRoute, deleteRoute };
}

// Hook for Budget Requests
export function useBudgetRequests() {
  const initialRequests: BudgetRequest[] = [
    { id: 'BR-001', department: 'Science Lab', description: 'Laboratory Equipment', amount: 4500000, status: 'pending', date: '2026-04-15' },
    { id: 'BR-002', department: 'Library', description: 'Textbooks Restocking', amount: 2800000, status: 'approved', date: '2026-04-14' },
    { id: 'BR-003', department: 'Sports', description: 'Sports Equipment', amount: 1500000, status: 'pending', date: '2026-04-13' },
    { id: 'BR-004', department: 'Administration', description: 'Office Furniture', amount: 3800000, status: 'rejected', date: '2026-04-12' },
  ];

  const [requests, setRequests] = useState<BudgetRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRequests(getFromStorage('school_budget', initialRequests));
    setLoading(false);
  }, []);

  const addRequest = useCallback((request: Omit<BudgetRequest, 'id'>) => {
    const newRequest = { ...request, id: generateId() };
    setRequests(prev => {
      const updated = [...prev, newRequest];
      saveToStorage('school_budget', updated);
      return updated;
    });
    return newRequest;
  }, []);

  const updateStatus = useCallback((id: string, status: 'pending' | 'approved' | 'rejected') => {
    setRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status } : r);
      saveToStorage('school_budget', updated);
      return updated;
    });
  }, []);

  return { requests, loading, addRequest, updateStatus };
}

// Hook for Inventory
export function useInventory() {
  const initialItems: InventoryItem[] = [
    { id: 'INV-001', name: 'Desks (Primary)', category: 'Furniture', quantity: 45, minStock: 20, condition: 'good', location: 'Block A', lastUpdated: '2026-04-10' },
    { id: 'INV-002', name: 'Chairs (Standard)', category: 'Furniture', quantity: 8, minStock: 30, condition: 'good', location: 'Block A', lastUpdated: '2026-04-12' },
    { id: 'INV-003', name: 'Mathematics Set', category: 'Equipment', quantity: 120, minStock: 50, condition: 'good', location: 'Store Room', lastUpdated: '2026-04-08' },
    { id: 'INV-004', name: 'Whiteboard Markers', category: 'Supplies', quantity: 25, minStock: 100, condition: 'good', location: 'Store Room', lastUpdated: '2026-04-14' },
    { id: 'INV-005', name: 'Science Lab Microscopes', category: 'Equipment', quantity: 15, minStock: 10, condition: 'fair', location: 'Lab 1', lastUpdated: '2026-04-05' },
    { id: 'INV-006', name: 'Textbooks P.5 Maths', category: 'Books', quantity: 180, minStock: 100, condition: 'good', location: 'Library', lastUpdated: '2026-04-01' },
    { id: 'INV-007', name: 'Sports Balls (Football)', category: 'Sports', quantity: 12, minStock: 15, condition: 'good', location: 'Sports Store', lastUpdated: '2026-04-11' },
  ];

  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setItems(getFromStorage('school_inventory', initialItems));
    setLoading(false);
  }, []);

  const addItem = useCallback((item: Omit<InventoryItem, 'id'>) => {
    const newItem = { ...item, id: generateId() };
    setItems(prev => {
      const updated = [...prev, newItem];
      saveToStorage('school_inventory', updated);
      return updated;
    });
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, ...updates } : i);
      saveToStorage('school_inventory', updated);
      return updated;
    });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveToStorage('school_inventory', updated);
      return updated;
    });
  }, []);

  return { items, loading, addItem, updateItem, deleteItem };
}

// Hook for Health Records
export function useHealth() {
  const initialRecords: HealthRecord[] = [
    { id: '1', studentId: '1', studentName: 'John Okello', class: 'P.7', condition: 'Asthma', medication: 'Inhaler', allergies: 'Dust', lastCheckup: 'Mar 2026', notes: 'Regular checkups required' },
    { id: '2', studentId: '2', studentName: 'Sarah Nakato', class: 'S.1', condition: 'None', medication: 'None', allergies: 'Peanuts', lastCheckup: 'Jan 2026', notes: 'Avoid all nut products' },
    { id: '3', studentId: '3', studentName: 'David Ssebu', class: 'P.6', condition: 'Sickle Cell', medication: 'Folic Acid', allergies: 'None', lastCheckup: 'Feb 2026', notes: 'Stay hydrated' },
  ];

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRecords(getFromStorage('school_health', initialRecords));
    setLoading(false);
  }, []);

  const addRecord = useCallback((record: Omit<HealthRecord, 'id'>) => {
    const newRecord = { ...record, id: generateId() };
    setRecords(prev => {
      const updated = [...prev, newRecord];
      saveToStorage('school_health', updated);
      return updated;
    });
    return newRecord;
  }, []);

  const updateRecord = useCallback((id: string, updates: Partial<HealthRecord>) => {
    setRecords(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      saveToStorage('school_health', updated);
      return updated;
    });
  }, []);

  return { records, loading, addRecord, updateRecord };
}

// Hook for Sports Teams
export function useSports() {
  const initialTeams: Team[] = [
    { id: '1', name: 'Football - Senior', coach: 'Mr. Kato', members: 18, wins: 5, losses: 2, status: 'Active' },
    { id: '2', name: 'Football - Junior', coach: 'Mr. Ssebu', members: 15, wins: 4, losses: 1, status: 'Active' },
    { id: '3', name: 'Netball', coach: 'Ms. Nakanwagi', members: 12, wins: 6, losses: 0, status: 'Active' },
    { id: '4', name: 'Volleyball', coach: 'Mr. Muwonge', members: 10, wins: 3, losses: 3, status: 'Active' },
  ];

  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTeams(getFromStorage('school_teams', initialTeams));
    setLoading(false);
  }, []);

  const addTeam = useCallback((team: Omit<Team, 'id'>) => {
    const newTeam = { ...team, id: generateId() };
    setTeams(prev => {
      const updated = [...prev, newTeam];
      saveToStorage('school_teams', updated);
      return updated;
    });
    return newTeam;
  }, []);

  const updateTeam = useCallback((id: string, updates: Partial<Team>) => {
    setTeams(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...updates } : t);
      saveToStorage('school_teams', updated);
      return updated;
    });
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setTeams(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveToStorage('school_teams', updated);
      return updated;
    });
  }, []);

  return { teams, loading, addTeam, updateTeam, deleteTeam };
}

// Hook for Houses
export function useHouses() {
  const initialHouses: House[] = [
    { id: '1', name: 'Nile House', color: 'bg-blue-500', students: 85, points: 450, captain: 'David Ssebu' },
    { id: '2', name: 'Victoria House', color: 'bg-purple-500', students: 78, points: 420, captain: 'Sarah Nakato' },
    { id: '3', name: 'Albert House', color: 'bg-green-500', students: 72, points: 380, captain: 'John Okello' },
    { id: '4', name: 'Baker House', color: 'bg-red-500', students: 65, points: 350, captain: 'Mary Namuli' },
  ];

  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setHouses(getFromStorage('school_houses', initialHouses));
    setLoading(false);
  }, []);

  const updateHousePoints = useCallback((id: string, pointsToAdd: number) => {
    setHouses(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, points: h.points + pointsToAdd } : h);
      saveToStorage('school_houses', updated);
      return updated;
    });
  }, []);

  const addHouse = useCallback((house: Omit<House, 'id'>) => {
    const newHouse = { ...house, id: generateId() };
    setHouses(prev => {
      const updated = [...prev, newHouse];
      saveToStorage('school_houses', updated);
      return updated;
    });
    return newHouse;
  }, []);

  const updateHouse = useCallback((id: string, updates: Partial<House>) => {
    setHouses(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, ...updates } : h);
      saveToStorage('school_houses', updated);
      return updated;
    });
  }, []);

  const deleteHouse = useCallback((id: string) => {
    setHouses(prev => {
      const updated = prev.filter(h => h.id !== id);
      saveToStorage('school_houses', updated);
      return updated;
    });
  }, []);

  const resetPoints = useCallback((id: string) => {
    setHouses(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, points: 0 } : h);
      saveToStorage('school_houses', updated);
      return updated;
    });
  }, []);

  return { houses, loading, updateHousePoints, addHouse, updateHouse, deleteHouse, resetPoints };
}

// Classes
export const classes = ['All Classes', 'P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

// Sample data initialization
export function initializeSampleData() {
  const existing = localStorage.getItem('school_students');
  if (existing && JSON.parse(existing).length > 0) return false;

  const sampleStudents = [
    { id: '1', name: 'John Okello', class: 'P.7', admissionNo: 'KPS/2024/001', gender: 'Male', parent: 'Michael Okello', phone: '+256 701 234 567', email: 'm.ok@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%233b82f6%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EJO%3C/text%3E%3C/svg%3E', createdAt: '2024-01-15' },
    { id: '2', name: 'Sarah Nakato', class: 'S.1', admissionNo: 'KPS/2024/002', gender: 'Female', parent: 'Grace Nakato', phone: '+256 702 345 678', email: 'g.nak@email.com', fees: 'Pending', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23ec4899%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ESN%3C/text%3E%3C/svg%3E', createdAt: '2024-02-10' },
    { id: '3', name: 'David Ssebu', class: 'P.6', admissionNo: 'KPS/2024/003', gender: 'Male', parent: 'Robert Ssebu', phone: '+256 703 456 789', email: 'r.sse@email.com', fees: 'Overdue', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%2310b981%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EDS%3C/text%3E%3C/svg%3E', createdAt: '2024-03-05' },
    { id: '4', name: 'Mary Namuli', class: 'S.2', admissionNo: 'KPS/2024/004', gender: 'Female', parent: 'Joseph Namuli', phone: '+256 704 567 890', email: 'j.nam@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%238b5cf6%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EMN%3C/text%3E%3C/svg%3E', createdAt: '2024-04-12' },
    { id: '5', name: 'Peter Mugisha', class: 'P.4', admissionNo: 'KPS/2024/005', gender: 'Male', parent: 'Alice Mugisha', phone: '+256 705 678 901', email: 'a.mug@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23f59e0b%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EPM%3C/text%3E%3C/svg%3E', createdAt: '2024-05-20' },
    { id: '6', name: 'Patricia Achieng', class: 'S.4', admissionNo: 'KPS/2024/006', gender: 'Female', parent: 'Daniel Achieng', phone: '+256 706 789 012', email: 'd.ach@email.com', fees: 'Pending', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23ef4444%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EPA%3C/text%3E%3C/svg%3E', createdAt: '2024-06-08' },
    { id: '7', name: 'James Kamya', class: 'P.1', admissionNo: 'KPS/2024/007', gender: 'Male', parent: 'Susan Kamya', phone: '+256 707 890 123', email: 's.kam@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%2306b6d4%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EJK%3C/text%3E%3C/svg%3E', createdAt: '2024-07-15' },
    { id: '8', name: 'Rebecca Nalwanga', class: 'S.5', admissionNo: 'KPS/2024/008', gender: 'Female', parent: 'Edward Nalwanga', phone: '+256 708 901 234', email: 'e.nal@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%2384cc16%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ERN%3C/text%3E%3C/svg%3E', createdAt: '2024-08-22' },
    { id: '9', name: 'Isaac Tumusiime', class: 'P.3', admissionNo: 'KPS/2024/009', gender: 'Male', parent: 'Betty Tumusiime', phone: '+256 709 012 345', email: 'b.tum@email.com', fees: 'Pending', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23f97316%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EIT%3C/text%3E%3C/svg%3E', createdAt: '2024-09-10' },
    { id: '10', name: 'Christine Auma', class: 'S.6', admissionNo: 'KPS/2024/010', gender: 'Female', parent: 'Frank Auma', phone: '+256 710 123 456', email: 'f.aum@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23a855f7%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ECA%3C/text%3E%3C/svg%3E', createdAt: '2024-10-05' },
    { id: '11', name: 'Samuel Lwanga', class: 'P.5', admissionNo: 'KPS/2024/011', gender: 'Male', parent: 'Rose Lwanga', phone: '+256 711 234 567', email: 'r.lwa@email.com', fees: 'Paid', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%2314b8a6%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ESL%3C/text%3E%3C/svg%3E', createdAt: '2024-11-12' },
    { id: '12', name: 'Faith Nantume', class: 'S.3', admissionNo: 'KPS/2024/012', gender: 'Female', parent: 'George Nantume', phone: '+256 712 345 678', email: 'g.nan@email.com', fees: 'Overdue', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23e11d48%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EFN%3C/text%3E%3C/svg%3E', createdAt: '2024-12-01' },
  ];

  const sampleStaff = [
    { id: '1', name: 'Mr. Patrick Ochieng', role: 'Head Teacher', department: 'Administration', phone: '+256 771 111 222', email: 'p.ochieng@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%231e40af%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EPO%3C/text%3E%3C/svg%3E', createdAt: '2023-01-15' },
    { id: '2', name: 'Mrs. Sarah Kintu', role: 'Deputy Head Teacher', department: 'Administration', phone: '+256 772 222 333', email: 's.kintu@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23be185d%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ESK%3C/text%3E%3C/svg%3E', createdAt: '2023-02-10' },
    { id: '3', name: 'Mr. David Mukasa', role: 'Teacher', department: 'Mathematics', phone: '+256 773 333 444', email: 'd.mukasa@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23047857%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EDM%3C/text%3E%3C/svg%3E', createdAt: '2023-03-05' },
    { id: '4', name: 'Mrs. Grace Namugga', role: 'Teacher', department: 'English', phone: '+256 774 444 555', email: 'g.namugga@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%237c3aed%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EGN%3C/text%3E%3C/svg%3E', createdAt: '2023-04-12' },
    { id: '5', name: 'Mr. Joseph Okello', role: 'Teacher', department: 'Science', phone: '+256 775 555 666', email: 'j.okello@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23d97706%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EJO%3C/text%3E%3C/svg%3E', createdAt: '2023-05-20' },
    { id: '6', name: 'Ms. Mary Atim', role: 'Teacher', department: 'Social Studies', phone: '+256 776 666 777', email: 'm.atim@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%23dc2626%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3EMA%3C/text%3E%3C/svg%3E', createdAt: '2023-06-08' },
    { id: '7', name: 'Mrs. Rose Nalubega', role: 'Accountant', department: 'Finance', phone: '+256 777 777 888', email: 'r.nalubega@school.ug', status: 'Active', photo: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2250%22 fill=%22%230891b2%22/%3E%3Ctext x=%2250%22 y=%2265%22 font-size=%2240%22 text-anchor=%22middle%22 fill=%22white%22%3ERN%3C/text%3E%3C/svg%3E', createdAt: '2023-07-15' },
  ];

  const sampleFees = [
    { id: '1', studentId: '1', studentName: 'John Okello', class: 'P.7', amount: '800000', date: '2024-01-20', method: 'Bank', status: 'Paid', description: 'Term 1 fees' },
    { id: '2', studentId: '2', studentName: 'Sarah Nakato', class: 'S.1', amount: '950000', date: '2024-02-15', method: 'MoMo', status: 'Pending', description: 'Term 1 fees' },
    { id: '3', studentId: '4', studentName: 'Mary Namuli', class: 'S.2', amount: '950000', date: '2024-04-15', method: 'Bank', status: 'Paid', description: 'Term 2 fees' },
    { id: '4', studentId: '5', studentName: 'Peter Mugisha', class: 'P.4', amount: '700000', date: '2024-05-25', method: 'MoMo', status: 'Paid', description: 'Term 2 fees' },
    { id: '5', studentId: '7', studentName: 'James Kamya', class: 'P.1', amount: '650000', date: '2024-07-20', method: 'Bank', status: 'Paid', description: 'Term 3 fees' },
    { id: '6', studentId: '8', studentName: 'Rebecca Nalwanga', class: 'S.5', amount: '1000000', date: '2024-08-25', method: 'MoMo', status: 'Paid', description: 'Term 3 fees' },
    { id: '7', studentId: '3', studentName: 'David Ssebu', class: 'P.6', amount: '750000', date: '2024-03-10', method: '', status: 'Overdue', description: 'Term 1 fees' },
    { id: '8', studentId: '12', studentName: 'Faith Nantume', class: 'S.3', amount: '900000', date: '2024-12-05', method: '', status: 'Overdue', description: 'Term 1 fees' },
  ];

  const today = new Date();
  const sampleAttendance: Attendance[] = [];
  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    sampleStudents.forEach(student => {
      const rand = Math.random();
      sampleAttendance.push({
        id: generateId(),
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        date: date.toISOString().split('T')[0],
        status: rand > 0.1 ? 'present' : rand > 0.05 ? 'late' : 'absent',
      });
    });
  }

  const sampleExams = [
    { id: '1', name: 'Mid-Term Exams', class: 'All', date: '2024-06-10', duration: '2 hours', status: 'Completed', subject: 'All Subjects' },
    { id: '2', name: 'End of Term 3', class: 'All', date: '2024-11-15', duration: '2 hours', status: 'Scheduled', subject: 'All Subjects' },
  ];

  const sampleResults = sampleStudents.slice(0, 6).map((student, i) => ({
    id: generateId(),
    studentId: student.id,
    studentName: student.name,
    class: student.class,
    examId: '1',
    examName: 'Mid-Term Exams',
    score: [78, 85, 65, 92, 73, 88][i],
    maxScore: 100,
    grade: ['B+', 'A-', 'C+', 'A', 'B', 'A-'][i],
  }));

  const sampleBooks = [
    { id: '1', title: 'New Primary Mathematics P.7', author: 'John Ochieng', class: 'P.7', copies: 50, available: 42, shelf: 'A-1', isbn: '978-9970-001' },
    { id: '2', title: 'English for Secondary Schools', author: 'Grace Namugga', class: 'S.1', copies: 60, available: 35, shelf: 'B-2', isbn: '978-9970-002' },
    { id: '3', title: 'Biology for East Africa', author: 'David Mukasa', class: 'S.3', copies: 40, available: 28, shelf: 'C-1', isbn: '978-9970-003' },
    { id: '4', title: 'Kampala History Textbook', author: 'Mary Atim', class: 'S.2', copies: 45, available: 38, shelf: 'D-3', isbn: '978-9970-004' },
  ];

  localStorage.setItem('school_students', JSON.stringify(sampleStudents));
  localStorage.setItem('school_staff', JSON.stringify(sampleStaff));
  localStorage.setItem('school_fees', JSON.stringify(sampleFees));
  localStorage.setItem('school_attendance', JSON.stringify(sampleAttendance));
  localStorage.setItem('school_exams', JSON.stringify(sampleExams));
  localStorage.setItem('school_results', JSON.stringify(sampleResults));
  localStorage.setItem('school_books', JSON.stringify(sampleBooks));

  return true;
}