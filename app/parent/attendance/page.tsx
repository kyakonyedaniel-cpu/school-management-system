'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ParentAttendancePage() {
  const [student, setStudent] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    if (students.length > 0) setStudent(students[0]);
    const stored = JSON.parse(localStorage.getItem('school_attendance') || '[]');
    setAttendance(stored);
  }, []);

  const studentAttendance = attendance.filter((a: any) => a.studentId === student?.id || a.studentName === student?.name);
  const present = studentAttendance.filter((a: any) => a.status === 'present').length;
  const absent = studentAttendance.filter((a: any) => a.status === 'absent').length;
  const late = studentAttendance.filter((a: any) => a.status === 'late').length;
  const total = studentAttendance.length || 1;

  const getIcon = (status: string) => {
    if (status === 'present') return <CheckCircle size={18} className="text-green-600" />;
    if (status === 'late') return <Clock size={18} className="text-yellow-600" />;
    return <XCircle size={18} className="text-red-600" />;
  };

  const recentDays = [...new Set(studentAttendance.map((a: any) => a.date))].slice(-10).reverse();

  return (
    <div className="space-y-6">
      <Link href="/parent" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold">Attendance Records</h1>

      {student && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {student.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-foreground/60">{student.class} - {student.admissionNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Present</p>
              <p className="text-2xl font-bold text-green-600">{present}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Late</p>
              <p className="text-2xl font-bold text-yellow-600">{late}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Absent</p>
              <p className="text-2xl font-bold text-red-600">{absent}</p>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-3">
            <p className="text-sm font-medium">Attendance Rate: <span className="text-green-600">{((present / total) * 100).toFixed(1)}%</span></p>
            <div className="h-2 bg-gray-200 rounded-full mt-1">
              <div className="h-2 bg-green-600 rounded-full" style={{ width: `${(present / total) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      <div className="bg-background rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Daily Records</h2>
        </div>
        <div className="divide-y">
          {recentDays.length > 0 ? recentDays.map((date: any) => {
            const dayRecords = studentAttendance.filter((a: any) => a.date === date);
            const dayStatus = dayRecords[0]?.status || 'absent';
            return (
              <div key={date} className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  {getIcon(dayStatus)}
                  <div>
                    <p className="font-medium">{new Date(date).toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-sm text-foreground/60 capitalize">{dayStatus}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  dayStatus === 'present' ? 'bg-green-100 text-green-600' :
                  dayStatus === 'late' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>{dayStatus}</span>
              </div>
            );
          }) : (
            <p className="p-8 text-center text-foreground/60">No attendance records found</p>
          )}
        </div>
      </div>
    </div>
  );
}
