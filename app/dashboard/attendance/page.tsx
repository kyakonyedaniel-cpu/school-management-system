'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, XCircle, Clock, AlertCircle, Search, Filter, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockAttendance = [
  { id: 1, name: 'John Okello', class: 'P.7', present: true },
  { id: 2, name: 'Sarah Nakato', class: 'S.1', present: true },
  { id: 3, name: 'David Ssebu', class: 'P.6', present: false },
  { id: 4, name: 'Mary Namuli', class: 'S.2', present: true },
  { id: 5, name: 'Peter Wasswa', class: 'P.5', present: true },
  { id: 6, name: 'Grace Atim', class: 'S.3', present: false },
  { id: 7, name: 'James Mukasa', class: 'P.6', present: true },
  { id: 8, name: 'Faith Apio', class: 'S.1', present: true },
];

export default function AttendancePage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('All Classes');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  const weeklyData = [
    { day: 'Mon', attendance: 94 },
    { day: 'Tue', attendance: 96 },
    { day: 'Wed', attendance: 92 },
    { day: 'Thu', attendance: 95 },
    { day: 'Fri', attendance: 91 },
  ];

  const presentCount = mockAttendance.filter(s => s.present).length;
  const totalCount = mockAttendance.length;
  const presentPercent = Math.round((presentCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">{schoolName}</span>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Dashboard</Link>
          <Link href="/dashboard/features" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Features</Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Students</Link>
          <Link href="/dashboard/fees" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Fees</Link>
          <Link href="/dashboard/attendance" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><CheckCircle size={14} /> Attendance</Link>
          <Link href="/dashboard/calendar" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Calendar</Link>
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 py-1 text-xs font-medium text-foreground/40">African Features</p>
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><BookOpen size={14} /> Curriculum</Link>
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Reports</Link>
            <Link href="/dashboard/staff" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Staff</Link>
            <Link href="/dashboard/houses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Heart size={14} /> Houses</Link>
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><UsersRound size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Award size={14} /> Admissions</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Attendance</h1>
              <p className="text-sm text-foreground/60">Track student attendance</p>
            </div>
            <div className="flex items-center gap-3">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2 rounded-lg border border-border" />
              <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">Mark Attendance</button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-5 h-5 text-green-600" /></div>
                <span className="text-2xl font-bold text-green-600">{presentCount}</span>
              </div>
              <p className="text-sm text-foreground/60">Present Today</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"><XCircle className="w-5 h-5 text-red-600" /></div>
                <span className="text-2xl font-bold text-red-600">{totalCount - presentCount}</span>
              </div>
              <p className="text-sm text-foreground/60">Absent Today</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-blue-600" /></div>
                <span className="text-2xl font-bold text-blue-600">{presentPercent}%</span>
              </div>
              <p className="text-sm text-foreground/60">Attendance Rate</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-border mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Attendance Trend</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                <Bar dataKey="attendance" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border flex flex-wrap gap-4 items-center justify-between">
              <h3 className="text-lg font-semibold">Today&apos;s Attendance</h3>
              <div className="flex items-center gap-3">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm">
                  <option>All Classes</option>
                  <option>P.1</option><option>P.2</option><option>P.3</option><option>P.4</option>
                  <option>P.5</option><option>P.6</option><option>P.7</option>
                  <option>S.1</option><option>S.2</option><option>S.3</option>
                  <option>S.4</option><option>S.5</option><option>S.6</option>
                </select>
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-sm hover:bg-muted"><Download size={16} />Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Class</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAttendance.map((student) => (
                    <tr key={student.id} className="border-t border-border">
                      <td className="px-6 py-4 font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-sm">{student.class}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${student.present ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'}`}>
                          {student.present ? <CheckCircle size={14} /> : <XCircle size={14} />}
                          {student.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}