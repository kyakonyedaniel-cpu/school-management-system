"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  School, Menu, X, Bell, Search, Settings, LogOut, ChevronDown,
  FileText, Users, TrendingUp, CheckCircle, Calendar as CalendarIcon, BookOpen, 
  Calendar, Shield, Heart, MapPin, Trophy, DollarSign, Package, CalendarDays, Award, Bed 
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
  const pathname = usePathname();
  const schoolName = "Your School";

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-200`}>
        <div className="lg:hidden p-4 flex items-center justify-between border-b border-border">
          <span className="font-bold">Menu</span>
          <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-full">
          <div className="pb-4 mb-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
              <School size={20} />Dashboard
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
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={24} /></button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input type="text" placeholder="Search students, fees..."
                className="pl-10 pr-4 py-2 rounded-lg border border-border w-64 lg:w-80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted">
              <Bell size={20} /><span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted"><Settings size={20} /></button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {schoolName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-medium">{schoolName}</p>
                    <p className="text-sm text-foreground/60">Administrator</p>
                  </div>
                  <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-muted">Profile Settings</Link>
                  <button className="w-full text-left px-4 py-2 hover:bg-muted flex items-center gap-2">
                    <LogOut size={16} />Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}