'use client';

import { useState } from 'react';
import { Plus, Clock, Calendar as CalendarIcon, X } from 'lucide-react';
import { useTimetable } from '@/lib/data';

export default function TimetablePage() {
  const { timetable, schedules } = useTimetable();
  const [selectedClass, setSelectedClass] = useState('P.7');

  const classes = ['P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Timetable</h1>
          <p className="text-foreground/60">Class schedules and exam calendar</p>
        </div>
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border">
          {classes.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="bg-background rounded-xl border border-border overflow-hidden">
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
              {(timetable[selectedClass] || []).map((row, index) => (
                <tr key={row.id || index} className={`border-t border-border ${row.mon === 'Break' ? 'bg-yellow-50' : ''}`}>
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
          {(!timetable[selectedClass] || timetable[selectedClass].length === 0) && (
            <div className="p-8 text-center text-foreground/60">
              No timetable available for {selectedClass}. Contact administration to add timetable.
            </div>
          )}
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Examination Timetable - Term I 2026</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="p-4 border border-border rounded-lg">
              <p className="text-sm font-medium">{schedule.name}</p>
              <p className="text-xs text-foreground/60 mt-1">{schedule.date}</p>
              <p className="text-xs text-foreground/60">Duration: {schedule.duration}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}