"use client";

import { useState, useEffect } from 'react';
import { School, Users, TrendingUp, Users as UsersIcon, FileText, Calendar, ImagePlus, Sparkles, Plus, Send, Download, Printer, Bell, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getSchoolProfile, SchoolProfile } from '@/lib/school';

export default function DashboardPage() {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(getSchoolProfile());
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('school_students') || '[]');
    const storedFees = JSON.parse(localStorage.getItem('school_fees') || '[]');
    const storedAttendance = JSON.parse(localStorage.getItem('school_attendance') || '[]');
    setStudents(storedStudents);
    setFees(storedFees);
    setAttendanceRecords(storedAttendance);
  }, []);

  const classAttendance = [
    { class: 'P.1-P.3', present: 95, total: 280 },
    { class: 'P.4-P.7', present: 92, total: 320 },
    { class: 'S.1-S.4', present: 96, total: 380 },
    { class: 'S.5-S.6', present: 89, total: 268 },
  ];

  const upcomingEvents = [
    { date: '2026-05-04', title: 'Term 2 Begins', type: 'academic' },
    { date: '2026-05-10', title: 'P.7 Mock Exams', type: 'exam' },
    { date: '2026-05-15', title: 'Parent-Teacher Meeting', type: 'meeting' },
    { date: '2026-05-20', title: 'Inter-School Sports', type: 'sports' },
  ];

  const recentActivities = [
    { time: '2 hours ago', action: 'John Okello paid UGX 500,000 fees', icon: 'payment' },
    { time: '3 hours ago', action: '15 students marked present in P.5', icon: 'attendance' },
    { time: '5 hours ago', action: 'New student Mary Nambi added to S.1', icon: 'student' },
    { time: 'Yesterday', action: 'Fee reminder sent to 25 parents', icon: 'reminder' },
  ];

  const quickActions = [
    { label: 'Add Student', href: '/dashboard/students', icon: Users, color: 'bg-blue-500' },
    { label: 'Record Payment', href: '/dashboard/fees', icon: FileText, color: 'bg-green-500' },
    { label: 'Mark Attendance', href: '/dashboard/attendance', icon: CheckCircle, color: 'bg-purple-500' },
    { label: 'Send Reminder', href: '/dashboard/fees', icon: Send, color: 'bg-orange-500' },
    { label: 'Print Report', href: '/dashboard/fees', icon: Printer, color: 'bg-gray-500' },
    { label: 'View Calendar', href: '/dashboard', icon: Calendar, color: 'bg-red-500' },
  ];

  const totalStudents = students.length || 1248;
  const totalFees = fees.reduce((sum: number, f: any) => sum + (parseInt(f.amount) || 0), 0) || 4100000;
  const pendingFees = fees.filter((f: any) => f.status === 'Pending').reduce((sum: number, f: any) => sum + (parseInt(f.amount) || 0), 0) || 890000;
  const attendance = '94.5%';

  const stats = [
    { label: 'Total Students', value: '+12%', number: totalStudents.toLocaleString(), icon: Users },
    { label: 'Monthly Revenue', value: '+23%', number: `UGX ${(totalFees / 1000000).toFixed(1)}M`, icon: TrendingUp },
    { label: 'Attendance', value: '-2%', number: attendance, icon: UsersIcon },
    { label: 'Pending Fees', value: '-15%', number: `UGX ${(pendingFees / 1000).toFixed(0)}K`, icon: FileText },
  ];

  const recentStudents = students.length > 0 ? students.slice(0, 5) : [
    { id: 1, name: 'John Okello', class: 'P.7', fees: 'Paid' },
    { id: 2, name: 'Sarah Nakato', class: 'S.1', fees: 'Pending' },
    { id: 3, name: 'David Ssebu', class: 'P.6', fees: 'Overdue' },
    { id: 4, name: 'Mary Namuli', class: 'S.2', fees: 'Paid' },
  ];

  const revenueData = [650000, 800000, 720000, 900000];
  const maxRevenue = Math.max(...revenueData);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-foreground/60">Welcome back! Here's what's happening at {schoolProfile.name}.</p>
      </div>

      {/* School Branding Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {schoolProfile.logo ? (
            <img src={schoolProfile.logo} alt="School Logo" className="w-16 h-16 object-contain rounded-lg bg-white p-2" />
          ) : (
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <ImagePlus className="w-8 h-8 text-primary" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-semibold">Customize Your School Branding</h3>
            </div>
            <p className="text-sm text-foreground/60">
              Upload your school logo and set your motto. They will appear on ID cards, receipts, and throughout the dashboard.
            </p>
          </div>
          <Link href="/dashboard/school-profile" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium text-sm">
            Set Up Branding →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-background p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-foreground/60" />
              <span className={`text-xs ${stat.value.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.value}
              </span>
            </div>
            <p className="text-2xl font-bold">{stat.number}</p>
            <p className="text-sm text-foreground/60">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <div className="h-48 flex items-end gap-2">
            {revenueData.map((value, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-foreground/60">UGX {(value / 1000000).toFixed(1)}M</span>
                <div 
                  className="w-full bg-primary rounded-t-md transition-all" 
                  style={{ height: `${(value / maxRevenue) * 100}%`, minHeight: '20px' }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-foreground/60">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
          </div>
        </div>

        <div className="bg-background p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Students by Class</h3>
          <div className="space-y-3">
            {['P.1-P.3', 'P.4-P.7', 'S.1-S.4', 'S.5-S.6'].map((level, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{level}</span>
                  <span>{[280, 320, 380, 268][i]} students</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${[28, 32, 38, 27][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Quick Actions</h3>
          <button onClick={() => setShowQuickActions(!showQuickActions)} className="text-sm text-primary hover:underline">
            {showQuickActions ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {showQuickActions && (
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {quickActions.map((action, i) => (
              <Link key={i} href={action.href} className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                  <action.icon size={20} />
                </div>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Events */}
        <div className="bg-background rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2"><Calendar size={18} />Upcoming Events</h3>
          </div>
          <div className="p-4 space-y-3">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30">
                <div className={`mt-1 w-2 h-2 rounded-full ${
                  event.type === 'academic' ? 'bg-blue-500' :
                  event.type === 'exam' ? 'bg-red-500' :
                  event.type === 'meeting' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-foreground/60">{new Date(event.date).toLocaleDateString('en-UG', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Attendance Summary */}
        <div className="bg-background rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2"><CheckCircle size={18} />Class Attendance</h3>
          </div>
          <div className="p-4 space-y-4">
            {classAttendance.map((cls, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{cls.class}</span>
                  <span className={cls.present/cls.total >= 0.95 ? 'text-green-600' : cls.present/cls.total >= 0.90 ? 'text-yellow-600' : 'text-red-600'}>
                    {cls.present}/{cls.total} ({((cls.present/cls.total)*100).toFixed(1)}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    cls.present/cls.total >= 0.95 ? 'bg-green-500' : cls.present/cls.total >= 0.90 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} style={{ width: `${(cls.present/cls.total)*100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-background rounded-lg border">
          <div className="p-4 border-b">
            <h3 className="font-semibold flex items-center gap-2"><Bell size={18} />Recent Activities</h3>
          </div>
          <div className="p-4 space-y-3">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${
                  activity.icon === 'payment' ? 'text-green-600' :
                  activity.icon === 'attendance' ? 'text-blue-600' :
                  activity.icon === 'student' ? 'text-purple-600' : 'text-orange-600'
                }`}>
                  {activity.icon === 'payment' ? <FileText size={16} /> :
                   activity.icon === 'attendance' ? <CheckCircle size={16} /> :
                   activity.icon === 'student' ? <Users size={16} /> : <Bell size={16} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-foreground/60">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Students */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Recent Students</h3>
          <Link href="/dashboard/students" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Fees</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentStudents.map((student: any, index: number) => (
              <tr key={student.id || index}>
                <td className="px-4 py-3 font-medium">{student.name}</td>
                <td className="px-4 py-3">{student.class}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.fees === 'Paid' ? 'bg-green-100 text-green-600' :
                    student.fees === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {student.fees}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
