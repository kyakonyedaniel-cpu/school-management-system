"use client";

import { useState } from 'react';
import { Plus, CheckCircle, XCircle, Clock, Search } from 'lucide-react';

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

const classes = ['All Classes', 'P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [searchTerm, setSearchTerm] = useState('');

  const weeklyData = [
    { day: 'Mon', attendance: 94 },
    { day: 'Tue', attendance: 96 },
    { day: 'Wed', attendance: 92 },
    { day: 'Thu', attendance: 95 },
    { day: 'Fri', attendance: 91 },
  ];

  const filteredAttendance = mockAttendance.filter(student => {
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const presentCount = filteredAttendance.filter(s => s.present).length;
  const totalCount = filteredAttendance.length;
  const presentPercent = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-foreground/60">Track daily student attendance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Mark Attendance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
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
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Absent</p>
              <p className="text-xl font-bold">{totalCount - presentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Rate</p>
              <p className="text-xl font-bold">{presentPercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-primary"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredAttendance.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-medium">{student.name}</td>
                <td className="px-4 py-3">{student.class}</td>
                <td className="px-4 py-3">
                  {student.present ? (
                    <span className="flex items-center gap-2 text-green-600">
                      <CheckCircle size={16} />Present
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-600">
                      <XCircle size={16} />Absent
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}