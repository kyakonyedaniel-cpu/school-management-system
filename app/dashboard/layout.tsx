"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion } from 'framer-motion';
import { initializeSampleData } from '@/lib/data';
import { Logo } from '@/components/logo';
import { 
  School, Menu, X, Bell, Search, Settings, LogOut, ChevronDown, Moon, Sun,
  FileText, Users, TrendingUp, CheckCircle, Calendar as CalendarIcon, BookOpen, 
  Calendar, Shield, Heart, MapPin, Trophy, DollarSign, Package, CalendarDays, Award, Bed,
  MessageSquare, Printer, Download, ExternalLink, UserPlus
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: FileText },
  { name: "Features", href: "/dashboard/features", icon: FileText },
  { name: "Students", href: "/dashboard/students", icon: Users },
  { name: "Fees", href: "/dashboard/fees", icon: TrendingUp },
  { name: "Attendance", href: "/dashboard/attendance", icon: CheckCircle },
];

const academicItems = [
  { name: "Curriculum", href: "/dashboard/curriculum", icon: BookOpen },
  { name: "Timetable", href: "/dashboard/timetable", icon: Calendar },
  { name: "Exams", href: "/dashboard/exams", icon: FileText },
  { name: "Results", href: "/dashboard/results", icon: FileText },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
];

const peopleItems = [
  { name: "Staff", href: "/dashboard/staff", icon: Users },
  { name: "Parents (PTA)", href: "/dashboard/parents", icon: Users },
  { name: "Houses", href: "/dashboard/houses", icon: Heart },
];

const campusItems = [
  { name: "Library", href: "/dashboard/library", icon: BookOpen },
  { name: "Boarding", href: "/dashboard/boarding", icon: Bed },
  { name: "Transport", href: "/dashboard/transport", icon: MapPin },
  { name: "Sports", href: "/dashboard/sports", icon: Trophy },
];

const adminItems = [
  { name: "Admissions", href: "/dashboard/admissions", icon: Award },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarIcon },
  { name: "Budget", href: "/dashboard/budget", icon: DollarSign },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
  { name: "Leave", href: "/dashboard/leave", icon: CalendarDays },
  { name: "Health", href: "/dashboard/health", icon: Heart },
  { name: "Discipline", href: "/dashboard/discipline", icon: Shield },
];

const settingsItems = [
  { name: "Subscription", href: "/subscription", icon: Award },
  { name: "Profile", href: "/dashboard/profile", icon: Users },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [pendingFees, setPendingFees] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const schoolName = "Your School";

  useEffect(() => {
    initializeSampleData();
    
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    const fees = JSON.parse(localStorage.getItem('school_fees') || '[]');
    const pending = fees.filter((f: any) => f.status === 'Pending' || f.status === 'Overdue').length;
    setPendingFees(pending);

    const notifications = [
      ...(fees.filter((f: any) => f.status === 'Overdue').map((f: any, i: number) => ({
        id: i, type: 'fee', message: `Overdue fees: ${f.studentName}`, time: 'Today'
      }))),
      { id: 10, type: 'attendance', message: 'Low attendance detected in S.3 today', time: '1 hour ago' },
      { id: 11, type: 'exam', message: 'Mid-Term exams scheduled for next week', time: '2 days ago' },
      { id: 12, type: 'system', message: 'Backup completed successfully', time: '3 days ago' },
    ].slice(0, 10);

    setRecentNotifications(notifications);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) { setSearchResults([]); return; }
    
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    const staff = JSON.parse(localStorage.getItem('school_staff') || '[]');
    
    const q = query.toLowerCase();
    const results = [
      ...students.map((s: any) => ({ type: 'Student', name: s.name, href: '/dashboard/students', detail: s.class })),
      ...staff.map((s: any) => ({ type: 'Staff', name: s.name, href: '/dashboard/staff', detail: s.role })),
    ].filter((item: any) => item.name.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q));
    
    setSearchResults(results.slice(0, 10));
  };

  const sendWhatsAppReminder = (phone: string, name: string, amount: string) => {
    const message = `Dear parent of ${name}, this is a reminder that school fees of UGX ${amount} are due. Please pay at your earliest convenience.`;
    window.open(`https://wa.me/${phone.replace(/\s+/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const printReceipt = (studentName: string, amount: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Fee Receipt</title>
      <style>body{font-family:Arial;padding:40px}h1{text-align:center}table{width:100%;border-collapse:collapse;margin:20px 0}td,th{border:1px solid #333;padding:10px;text-align:left}</style>
      </head><body>
      <h1>SmartSchool Pro - Fee Receipt</h1>
      <p><strong>School:</strong> ${schoolName}</p>
      <table><tr><td>Student</td><td>${studentName}</td></tr>
      <tr><td>Amount</td><td>UGX ${amount}</td></tr>
      <tr><td>Date</td><td>${new Date().toLocaleDateString()}</td></tr>
      <tr><td>Status</td><td>Received</td></tr></table>
      <p style="text-align:center;margin-top:40px">Thank you for your payment!</p>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform transition-transform duration-200`}>
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-border">
          <span className="font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          <div className="pb-4 mb-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
              <Logo size={24} />
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Dashboard
              </motion.span>
            </Link>
          </div>

          <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Main</p>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg ${pathname === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted'}`}>
              <item.icon size={18} />{item.name}
            </Link>
          ))}

          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Academic</p>
            {academicItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${pathname === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted'}`}>
                <item.icon size={18} />{item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">People</p>
            {peopleItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${pathname === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted'}`}>
                <item.icon size={18} />{item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Campus</p>
            {campusItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${pathname === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted'}`}>
                <item.icon size={18} />{item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Administration</p>
            {adminItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${pathname === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted'}`}>
                <item.icon size={18} />{item.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Settings</p>
            {settingsItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${pathname === item.href ? 'bg-primary/10 text-primary font-medium' : 'text-foreground/70 hover:bg-muted'}`}>
                <item.icon size={18} />{item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-muted">
              <FileText size={20} />View Landing Page
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={24} /></button>
            
            {/* Global Search */}
            <div className="relative">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input 
                  type="text" 
                  placeholder="Search students, staff, fees..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-border w-64 lg:w-80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>
              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-background rounded-lg shadow-xl border border-border z-50 max-h-80 overflow-y-auto">
                  <div className="p-2 border-b border-border">
                    <span className="text-xs font-medium text-foreground/60">Results</span>
                  </div>
                  {searchResults.map((result, i) => (
                    <button
                      key={i}
                      onClick={() => { router.push(result.href); setSearchQuery(''); setSearchResults([]); }}
                      className="w-full px-4 py-3 hover:bg-muted text-left flex items-center gap-3"
                    >
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-medium">{result.type}</span>
                      <div>
                        <p className="font-medium text-sm">{result.name}</p>
                        <p className="text-xs text-foreground/60">{result.detail}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-muted"
            >
              {resolvedTheme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative p-2 rounded-lg hover:bg-muted">
                <Bell size={20} />
                {pendingFees > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-xl border border-border z-50 max-h-96 overflow-y-auto">
                  <div className="p-3 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  {recentNotifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 hover:bg-muted border-b border-border/50 flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notif.type === 'fee' ? 'bg-red-100' : notif.type === 'attendance' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {notif.type === 'fee' ? <DollarSign size={14} className="text-red-600" /> :
                         notif.type === 'attendance' ? <Users size={14} className="text-blue-600" /> :
                         <Bell size={14} className="text-green-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{notif.message}</p>
                        <p className="text-xs text-foreground/50">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <button onClick={() => router.push('/dashboard/students')} className="p-2 rounded-lg hover:bg-muted">
              <UserPlus size={20} />
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {schoolName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border border-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-medium">{schoolName}</p>
                    <p className="text-sm text-foreground/60">Administrator</p>
                  </div>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm">
                    <Settings size={14} />Profile Settings
                  </Link>
                  <Link href="/subscription" className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm">
                    <Award size={14} />Subscription
                  </Link>
                  <Link href="/contact" className="flex items-center gap-2 px-4 py-2 hover:bg-muted text-sm">
                    <MessageSquare size={14} />Contact Support
                  </Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-muted text-red-600 flex items-center gap-2 text-sm">
                    <LogOut size={14} />Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      {(searchResults.length > 0 || notificationsOpen || profileOpen) && 
        <div className="fixed inset-0 z-30" onClick={() => { setSearchResults([]); setNotificationsOpen(false); setProfileOpen(false); }} />
      }
    </div>
  );
}