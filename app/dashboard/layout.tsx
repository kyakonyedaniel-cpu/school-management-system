'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Home, Users, GraduationCap, UserCheck, Calendar, BookOpen, DollarSign,
  Library, FileText, ClipboardList, Bus, Settings, LogOut, Menu, X,
  BarChart3, Trophy, Heart, Clock, AlertTriangle, UsersRound, Building,
  Bed, Stethoscope, CalendarDays, Calculator, FileBarChart, User, Award
} from 'lucide-react';
import { navigation, roleLabels, getNavigationForRole } from '@/lib/navigation';

const iconMap: Record<string, any> = {
  Home, Users, UserCheck, Calendar, FileText, BarChart3, DollarSign, BookOpen,
  Clock, ClipboardList, CalendarDays, Bus, Award, AlertTriangle, Stethoscope,
  Trophy, Heart, Bed, UsersRound, Building, Calculator, FileBarChart, User, Settings, GraduationCap
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userRole = session.user?.role || 'ADMIN';
  const allowedNav = getNavigationForRole(userRole);
  const roleLabel = roleLabels[userRole] || userRole;

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-muted rounded-lg">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold">SmartSchool</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-muted rounded-lg">
          <Settings size={20} />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {allowedNav.map((item) => {
              const Icon = iconMap[item.icon] || Home;
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-foreground/70 hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="p-3 border-t">
            <div className="mb-3 px-3 py-2 bg-muted rounded-lg">
              <p className="font-medium text-sm truncate">{session.user?.name}</p>
              <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
                userRole === 'ADMIN' ? 'bg-red-100 text-red-700' :
                userRole === 'TEACHER' ? 'bg-blue-100 text-blue-700' :
                userRole === 'ACCOUNTANT' ? 'bg-green-100 text-green-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {roleLabel}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-16 right-4 z-40 bg-background rounded-lg shadow-lg border p-4 min-w-48">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}