// Data export/import utilities

export interface ExportData {
  version: string;
  exportDate: string;
  school: any;
  students: any[];
  staff: any[];
  attendance: any[];
  payments: any[];
  exams: any[];
  books: any[];
  loans: any[];
  leaveRequests: any[];
  events: any[];
  curriculum: any;
  discipline: any[];
}

export function exportAllData(): ExportData {
  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    school: JSON.parse(localStorage.getItem('school_profile') || '{}'),
    students: JSON.parse(localStorage.getItem('school_students') || '[]'),
    staff: JSON.parse(localStorage.getItem('school_staff') || '[]'),
    attendance: JSON.parse(localStorage.getItem('school_attendance') || '[]'),
    payments: JSON.parse(localStorage.getItem('school_payments') || '[]'),
    exams: JSON.parse(localStorage.getItem('school_exams') || '[]'),
    books: JSON.parse(localStorage.getItem('school_books') || '[]'),
    loans: JSON.parse(localStorage.getItem('school_loans') || '[]'),
    leaveRequests: JSON.parse(localStorage.getItem('school_leave') || '[]'),
    events: JSON.parse(localStorage.getItem('school_events') || '[]'),
    curriculum: JSON.parse(localStorage.getItem('school_curriculum') || '{}'),
    discipline: JSON.parse(localStorage.getItem('school_discipline') || '[]'),
  };
}

export function downloadJSON(data: ExportData, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(data: ExportData) {
  if (data.version && data.exportDate) {
    if (data.school) localStorage.setItem('school_profile', JSON.stringify(data.school));
    if (data.students) localStorage.setItem('school_students', JSON.stringify(data.students));
    if (data.staff) localStorage.setItem('school_staff', JSON.stringify(data.staff));
    if (data.attendance) localStorage.setItem('school_attendance', JSON.stringify(data.attendance));
    if (data.payments) localStorage.setItem('school_payments', JSON.stringify(data.payments));
    if (data.exams) localStorage.setItem('school_exams', JSON.stringify(data.exams));
    if (data.books) localStorage.setItem('school_books', JSON.stringify(data.books));
    if (data.loans) localStorage.setItem('school_loans', JSON.stringify(data.loans));
    if (data.leaveRequests) localStorage.setItem('school_leave', JSON.stringify(data.leaveRequests));
    if (data.events) localStorage.setItem('school_events', JSON.stringify(data.events));
    if (data.curriculum) localStorage.setItem('school_curriculum', JSON.stringify(data.curriculum));
    if (data.discipline) localStorage.setItem('school_discipline', JSON.stringify(data.discipline));
    return true;
  }
  return false;
}

export function clearAllData() {
  const keys = [
    'school_profile', 'school_students', 'school_staff', 'school_attendance',
    'school_payments', 'school_exams', 'school_books', 'school_loans',
    'school_leave', 'school_events', 'school_curriculum', 'school_discipline',
    'school_admissions', 'school_transport', 'school_budget', 'school_inventory',
    'school_health', 'school_teams', 'school_houses', 'school_reports', 'school_boarders'
  ];
  keys.forEach(key => localStorage.removeItem(key));
}

export function getStorageUsage(): { used: number; keys: number } {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key) && key.startsWith('school_')) {
      total += localStorage.getItem(key)?.length || 0;
    }
  }
  return {
    used: total,
    keys: Object.keys(localStorage).filter(k => k.startsWith('school_')).length
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}