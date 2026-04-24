import { Session } from 'next-auth';

export interface NavigationItem {
  name: string;
  href: string;
  icon: any;
  roles: string[];
}

export const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: 'Home', roles: ['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT'] },
  { name: 'Students', href: '/dashboard/students', icon: 'Users', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Staff', href: '/dashboard/staff', icon: 'UserCheck', roles: ['ADMIN', 'HEADTEACHER'] },
  { name: 'Attendance', href: '/dashboard/attendance', icon: 'Calendar', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Exams', href: '/dashboard/exams', icon: 'FileText', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Results', href: '/dashboard/results', icon: 'BarChart3', roles: ['ADMIN', 'TEACHER', 'PARENT'] },
  { name: 'Fees', href: '/dashboard/fees', icon: 'DollarSign', roles: ['ADMIN', 'ACCOUNTANT', 'PARENT'] },
  { name: 'Library', href: '/dashboard/library', icon: 'BookOpen', roles: ['ADMIN', 'TEACHER', 'PARENT'] },
  { name: 'Leave', href: '/dashboard/leave', icon: 'Clock', roles: ['ADMIN', 'HEADTEACHER'] },
  { name: 'Timetable', href: '/dashboard/timetable', icon: 'ClipboardList', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Calendar', href: '/dashboard/calendar', icon: 'CalendarDays', roles: ['ADMIN', 'TEACHER', 'PARENT'] },
  { name: 'Transport', href: '/dashboard/transport', icon: 'Bus', roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'Admissions', href: '/dashboard/admissions', icon: 'Award', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Discipline', href: '/dashboard/discipline', icon: 'AlertTriangle', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Health', href: '/dashboard/health', icon: 'Stethoscope', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Sports', href: '/dashboard/sports', icon: 'Trophy', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Houses', href: '/dashboard/houses', icon: 'Heart', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Boarding', href: '/dashboard/boarding', icon: 'Bed', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Parents', href: '/dashboard/parents', icon: 'UsersRound', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Inventory', href: '/dashboard/inventory', icon: 'Building', roles: ['ADMIN'] },
  { name: 'Budget', href: '/dashboard/budget', icon: 'Calculator', roles: ['ADMIN', 'ACCOUNTANT'] },
  { name: 'Reports', href: '/dashboard/reports', icon: 'FileBarChart', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Curriculum', href: '/dashboard/curriculum', icon: 'BookOpen', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Academics', href: '/dashboard/academics', icon: 'GraduationCap', roles: ['ADMIN', 'TEACHER'] },
  { name: 'Settings', href: '/dashboard/settings', icon: 'Settings', roles: ['ADMIN'] },
  { name: 'Profile', href: '/dashboard/profile', icon: 'User', roles: ['ADMIN', 'TEACHER', 'ACCOUNTANT', 'PARENT'] },
];

export function getNavigationForRole(role: string): NavigationItem[] {
  return navigation.filter(item => item.roles.includes(role));
}

export const roleColors: Record<string, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  HEADTEACHER: 'bg-purple-100 text-purple-700',
  TEACHER: 'bg-blue-100 text-blue-700',
  ACCOUNTANT: 'bg-green-100 text-green-700',
  PARENT: 'bg-yellow-100 text-yellow-700',
};

export const roleLabels: Record<string, string> = {
  ADMIN: 'Administrator',
  HEADTEACHER: 'Headteacher',
  TEACHER: 'Teacher',
  ACCOUNTANT: 'Accountant',
  PARENT: 'Parent',
};