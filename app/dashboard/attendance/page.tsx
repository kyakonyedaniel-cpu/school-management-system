"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useStudents, useAttendance, classes } from '@/lib/data';

export default function AttendancePage() {
  const { students } = useStudents();
  const { attendance, markAttendance, getAttendanceByDate } = useAttendance();
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const todayAttendance = getAttendanceByDate(selectedDate);
  const studentAttendance = new Map(todayAttendance.map(a => [a.studentId, a]));

  const filteredStudents = students.filter(s => selectedClass === 'All Classes' || s.class === selectedClass);

  const presentCount = filteredStudents.filter(s => studentAttendance.get(s.id)?.status === 'present').length;
  const absentCount = filteredStudents.filter(s => studentAttendance.get(s.id)?.status === 'absent').length;
  const notMarked = filteredStudents.length - presentCount - absentCount;
  const presentPercent = filteredStudents.length > 0 ? Math.round((presentCount / filteredStudents.length) * 100) : 0;

  const toggleAttendance = (student: any) => {
    const currentStatus = studentAttendance.get(student.id)?.status;
    const newStatus = currentStatus === 'present' ? 'absent' : 'present';
    
    markAttendance({
      studentId: student.id,
      studentName: student.name,
      class: student.class,
      date: selectedDate,
      status: newStatus as 'present' | 'absent' | 'late'
    });
  };

  const markAllPresent = () => {
    filteredStudents.forEach(student => {
      if (!studentAttendance.get(student.id)) {
        markAttendance({
          studentId: student.id,
          studentName: student.name,
          class: student.class,
          date: selectedDate,
          status: 'present'
        });
      }
    });
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-foreground/60">Track daily student attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border" />
          <button onClick={markAllPresent} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Mark All Present
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Present</p>
              <p className="text-xl font-bold">{presentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Absent</p>
              <p className="text-xl font-bold">{absentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <XCircle className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Not Marked</p>
              <p className="text-xl font-bold">{notMarked}</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Attendance Rate</p>
              <p className="text-xl font-bold">{presentPercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border">
            {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
          <div className="text-sm text-foreground/60 flex items-center">
            Date: {new Date(selectedDate).toLocaleDateString('en-UG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
              <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStudents.map((student) => {
              const status = studentAttendance.get(student.id)?.status;
              return (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">{student.class}</td>
                  <td className="px-4 py-3">
                    {status === 'present' ? (
                      <span className="flex items-center gap-2 text-green-600">
                        <CheckCircle size={16} />Present
                      </span>
                    ) : status === 'absent' ? (
                      <span className="flex items-center gap-2 text-red-600">
                        <XCircle size={16} />Absent
                      </span>
                    ) : (
                      <span className="text-foreground/40">Not marked</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => toggleAttendance(student)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          status === 'present' 
                            ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}>
                        {status === 'present' ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}