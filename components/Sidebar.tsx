"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FileText, Users, TrendingUp, CheckCircle, Calendar as CalendarIcon, BookOpen, 
  Calendar, Shield, Heart, MapPin, Trophy, DollarSign, Package, CalendarDays, Award, Bed, Bell, Settings 
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

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="p-4 space-y-1">
      <div className="pb-4 mb-4 border-b border-border">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-2 mt-2 border-t border-border">
        <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Academic</p>
        {academicItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-2 mt-2 border-t border-border">
        <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">People</p>
        {peopleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-2 mt-2 border-t border-border">
        <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Campus</p>
        {campusItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-2 mt-2 border-t border-border">
        <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Administration</p>
        {adminItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-2 mt-2 border-t border-border">
        <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Settings</p>
        {settingsItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-primary/10 text-primary font-medium"
                : "text-foreground/70 hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="pt-4 mt-4 border-t border-border">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
          <FileText size={20} />
          View Landing Page
        </Link>
      </div>
    </nav>
  );
}