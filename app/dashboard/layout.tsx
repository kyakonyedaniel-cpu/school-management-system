'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Home, Users, GraduationCap, UserCheck, Calendar, BookOpen, DollarSign,
  Library, FileText, ClipboardList, Bus, Settings, LogOut, Menu, X,
  BarChart3, Trophy, Heart, Clock, AlertTriangle, UsersRound, Building,
  Bed, Stethoscope, MessageSquare, Award, MapPin
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Students', href: '/dashboard/students', icon: Users },
  { name: 'Staff', href: '/dashboard/staff', icon: UserCheck },
  { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
  { name: 'Exams', href: '/dashboard/exams', icon: FileText },
  { name: 'Results', href: '/dashboard/results', icon: BarChart3 },
  { name: 'Fees', href: '/dashboard/fees', icon: DollarSign },
  { name: 'Library', href: '/dashboard/library', icon: BookOpen },
  { name: 'Leave', href: '/dashboard/leave', icon: Clock },
  { name: 'Timetable', href: '/dashboard/timetable', icon: ClipboardList },
  { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
  { name: 'Transport', href: '/dashboard/transport', icon: Bus },
  { name: 'Admissions', href: '/dashboard/admissions', icon: Award },
  { name: 'Discipline', href: '/dashboard/discipline', icon: AlertTriangle },
  { name: 'Health', href: '/dashboard/health', icon: Stethoscope },
  { name: 'Sports', href: '/dashboard/sports', icon: Trophy },
  { name: 'Houses', href: '/dashboard/houses', icon: Heart },
  { name: 'Boarding', href: '/dashboard/boarding', icon: Bed },
  { name: 'Parents', href: '/dashboard/parents', icon: UsersRound },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Building },
  { name: 'Budget', href: '/dashboard/budget', icon: DollarSign },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Curriculum', href: '/dashboard/curriculum', icon: BookOpen },
  { name: 'Academics', href: '/dashboard/academics', icon: GraduationCap },
  { name: 'Features', href: '/dashboard/features', icon: Settings },
  { name: 'Profile', href: '/dashboard/profile', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background rounded-lg shadow-md"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold">SmartSchool</h2>
                <p className="text-xs text-foreground/60">Pro Edition</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon size={18} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="mb-3 px-3 py-2 bg-muted rounded-lg">
              <p className="font-medium text-sm truncate">{session.user?.name}</p>
              <p className="text-xs text-foreground/60">{session.user?.role}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}