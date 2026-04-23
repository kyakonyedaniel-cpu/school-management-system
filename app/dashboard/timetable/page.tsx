'use client';

import { useState } from 'react';
import { Plus, Clock, Calendar as CalendarIcon } from 'lucide-react';

const timetable = {
  'P.7': [
    { time: '7:30 - 8:30', mon: 'English', tue: 'Math', wed: 'Science', thu: 'Social Studies', fri: 'English' },
    { time: '8:30 - 9:30', mon: 'Math', tue: 'Science', wed: 'English', thu: 'Math', fri: 'Science' },
    { time: '9:30 - 10:30', mon: 'Science', tue: 'English', wed: 'Math', thu: 'Science', fri: 'Math' },
    { time: '10:30 - 11:00', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
    { time: '11:00 - 12:00', mon: 'Social Studies', tue: 'PE', wed: 'CRE', thu: 'Art', fri: 'Music' },
    { time: '12:00 - 1:00', mon: 'CRE', tue: 'Social Studies', wed: 'PE', thu: 'Art', fri: 'Library' },
  ],
  'S.1': [
    { time: '7:30 - 8:30', mon: 'Math', tue: 'English', wed: 'Biology', thu: 'Chemistry', fri: 'Physics' },
    { time: '8:30 - 9:30', mon: 'English', tue: 'Physics', wed: 'Math', thu: 'English', fri: 'Chemistry' },
    { time: '9:30 - 10:30', mon: 'Chemistry', tue: 'Biology', wed: 'Physics', thu: 'Math', fri: 'Biology' },
    { time: '10:30 - 11:00', mon: 'Break', tue: 'Break', wed: 'Break', thu: 'Break', fri: 'Break' },
    { time: '11:00 - 12:00', mon: 'Geography', tue: 'History', wed: 'CRE', thu: 'Computer', fri: 'Geography' },
    { time: '12:00 - 1:00', mon: 'History', tue: 'Geography', wed: 'Computer', thu: 'CRE', fri: 'History' },
  ],
};

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('P.7');

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Weekly Timetable - {selectedClass}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70 w-28">Time</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Monday</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Tuesday</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Wednesday</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Thursday</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Friday</th>
              </tr>
            </thead>
            <tbody>
              {timetable[selectedClass as keyof typeof timetable]?.map((row, index) => (
                <tr key={index} className={`border-t border-border ${row.mon === 'Break' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock size={14} className="text-foreground/50" />
                      {row.time}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{row.mon}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{row.tue}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{row.wed}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{row.thu}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{row.fri}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Examination Timetable - Term I 2026</h2>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm font-medium">Mid-Term Exams</p>
            <p className="text-xs text-foreground/60 mt-1">Mar 20 - Mar 27, 2026</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm font-medium">End of Term Exams</p>
            <p className="text-xs text-foreground/60 mt-1">Apr 14 - Apr 21, 2026</p>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <p className="text-sm font-medium">UNEB Mock Exams</p>
            <p className="text-xs text-foreground/60 mt-1">May 5 - May 12, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}