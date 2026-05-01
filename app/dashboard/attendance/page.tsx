"use client";

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Search, Download, Users, Filter } from 'lucide-react';
import { useStudents, useAttendance, classes } from '@/lib/data';

type AttendanceStatus = 'present' | 'absent' | 'late';

export default function AttendancePage() {
  const { students } = useStudents();
  const { attendance, markAttendance, getAttendanceByDate } = useAttendance();
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<AttendanceStatus>('present');

  const todayAttendance = getAttendanceByDate(selectedDate);
  const studentAttendance = new Map(todayAttendance.map(a => [a.studentId, a]));

  const filteredStudents = students.filter(s => {
    const classMatch = selectedClass === 'All Classes' || s.class === selectedClass;
    const searchMatch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
    return classMatch && searchMatch;
  });

  const presentCount = filteredStudents.filter(s => studentAttendance.get(s.id)?.status === 'present').length;
  const absentCount = filteredStudents.filter(s => studentAttendance.get(s.id)?.status === 'absent').length;
  const lateCount = filteredStudents.filter(s => studentAttendance.get(s.id)?.status === 'late').length;
  const notMarked = filteredStudents.length - presentCount - absentCount - lateCount;
  const presentPercent = filteredStudents.length > 0 ? Math.round(((presentCount + lateCount * 0.5) / filteredStudents.length) * 100) : 0;

  const markAttendanceForStudent = (student: any, status: AttendanceStatus) => {
    markAttendance({
      studentId: student.id,
      studentName: student.name,
      class: student.class,
      date: selectedDate,
      status
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

  const markAllAbsent = () => {
    filteredStudents.forEach(student => {
      if (!studentAttendance.get(student.id)) {
        markAttendance({
          studentId: student.id,
          studentName: student.name,
          class: student.class,
          date: selectedDate,
          status: 'absent'
        });
      }
    });
  };

  const handleBulkAction = () => {
    selectedStudents.forEach(studentId => {
      const student = students.find(s => s.id === studentId);
      if (student) {
        markAttendanceForStudent(student, bulkAction);
      }
    });
    setSelectedStudents([]);
  };

  const toggleSelectStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const selectAll = () => {
    const unmarkedIds = filteredStudents
      .filter(s => !studentAttendance.get(s.id))
      .map(s => s.id);
    setSelectedStudents(unmarkedIds);
  };

  const getStatusBadge = (status: string | undefined) => {
    if (status === 'present') {
      return <span className="flex items-center gap-2 text-green-600"><CheckCircle size={16} />Present</span>;
    } else if (status === 'absent') {
      return <span className="flex items-center gap-2 text-red-600"><XCircle size={16} />Absent</span>;
    } else if (status === 'late') {
      return <span className="flex items-center gap-2 text-yellow-600"><Clock size={16} />Late</span>;
    }
    return <span className="text-foreground/40">Not marked</span>;
  };

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
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-green-600" size={20} />
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
              <XCircle className="text-red-600" size={20} />
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
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Late</p>
              <p className="text-xl font-bold">{lateCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="text-gray-600" size={20} />
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
              <CheckCircle className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Rate</p>
              <p className="text-xl font-bold">{presentPercent}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-background rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border">
              {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-border w-64"
              />
            </div>
            <div className="text-sm text-foreground/60 flex items-center">
              {new Date(selectedDate).toLocaleDateString('en-UG', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={markAllPresent} className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              All Present
            </button>
            <button onClick={markAllAbsent} className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
              All Absent
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedStudents.length > 0 && (
          <div className="mt-4 p-3 bg-muted/30 rounded-lg flex items-center gap-3">
            <span className="text-sm font-medium">{selectedStudents.length} selected</span>
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value as AttendanceStatus)}
              className="px-3 py-1 rounded border text-sm"
            >
              <option value="present">Mark Present</option>
              <option value="absent">Mark Absent</option>
              <option value="late">Mark Late</option>
            </select>
            <button onClick={handleBulkAction} className="px-3 py-1 bg-primary text-white rounded text-sm">
              Apply
            </button>
            <button onClick={() => setSelectedStudents([])} className="px-3 py-1 border rounded text-sm">
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Attendance List */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              onChange={selectAll}
              checked={selectedStudents.length === filteredStudents.filter(s => !studentAttendance.get(s.id)).length && filteredStudents.length > 0}
              className="rounded"
            />
            <span className="text-sm text-foreground/60">Select unmarked</span>
          </div>
          <button
            onClick={() => {
              const data = filteredStudents.map(s => ({
                name: s.name,
                class: s.class,
                status: studentAttendance.get(s.id)?.status || 'Not marked'
              }));
              const csv = 'Name,Class,Status\n' + data.map(d => `${d.name},${d.class},${d.status}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `attendance-${selectedDate}.csv`;
              a.click();
            }}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted text-sm"
          >
            <Download size={14} />Export
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium w-10"></th>
              <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
              <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStudents.map((student) => {
              const status = studentAttendance.get(student.id)?.status;
              const isSelected = selectedStudents.includes(student.id);
              return (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectStudent(student.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium">{student.name}</td>
                  <td className="px-4 py-3">{student.class}</td>
                  <td className="px-4 py-3">
                    {getStatusBadge(status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => markAttendanceForStudent(student, 'present')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          status === 'present' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}>
                        Present
                      </button>
                      <button onClick={() => markAttendanceForStudent(student, 'late')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          status === 'late' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                        }`}>
                        Late
                      </button>
                      <button onClick={() => markAttendanceForStudent(student, 'absent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          status === 'absent' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'
                        }`}>
                        Absent
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