"use client";

import { useState } from 'react';
import { Plus, Clock, Edit, Download } from 'lucide-react';

const upcomingExams = [
  { id: 1, name: 'UNEB PLE Mock', class: 'P.7', date: 'May 5, 2026', duration: '2 hours', status: 'Upcoming' },
  { id: 2, name: 'UCE Mid-Term', class: 'S.2', date: 'May 10, 2026', duration: '3 hours', status: 'Upcoming' },
  { id: 3, name: 'CA2 - Mathematics', class: 'P.5', date: 'Apr 25, 2026', duration: '1 hour', status: 'Due Soon' },
  { id: 4, name: 'Physics Quiz', class: 'S.4', date: 'Apr 23, 2026', duration: '30 mins', status: 'Due Soon' },
];

const pastExams = [
  { id: 1, name: 'CA1 - English', class: 'P.6', date: 'Apr 10, 2026', avgScore: 72 },
  { id: 2, name: 'Mathematics Test', class: 'S.1', date: 'Apr 8, 2026', avgScore: 65 },
  { id: 3, name: 'Science Quiz', class: 'P.4', date: 'Apr 5, 2026', avgScore: 78 },
];

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-foreground/60">Manage exams and assessments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Schedule Exam
        </button>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Upcoming Exams</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Exam Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Duration</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {upcomingExams.map((exam) => (
              <tr key={exam.id}>
                <td className="px-4 py-3 font-medium">{exam.name}</td>
                <td className="px-4 py-3">{exam.class}</td>
                <td className="px-4 py-3">{exam.date}</td>
                <td className="px-4 py-3">{exam.duration}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {exam.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                  <button className="p-2 rounded-lg hover:bg-muted"><Download size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Past Exams */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Past Exam Results</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Exam Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Avg Score</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pastExams.map((exam) => (
              <tr key={exam.id}>
                <td className="px-4 py-3 font-medium">{exam.name}</td>
                <td className="px-4 py-3">{exam.class}</td>
                <td className="px-4 py-3">{exam.date}</td>
                <td className="px-4 py-3 text-right font-medium">{exam.avgScore}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}