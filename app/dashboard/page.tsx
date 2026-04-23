"use client";

import { useState } from 'react';
import { School, Users, TrendingUp, Users as UsersIcon, FileText, Calendar } from 'lucide-react';

const recentStudents = [
  { id: 1, name: 'John Okello', class: 'P.7', status: 'Paid' },
  { id: 2, name: 'Sarah Nakato', class: 'S.1', status: 'Pending' },
  { id: 3, name: 'David Ssebu', class: 'P.6', status: 'Overdue' },
  { id: 4, name: 'Mary Namuli', class: 'S.2', status: 'Paid' },
];

export default function DashboardPage() {
  const [schoolName] = useState('Your School');

  const stats = [
    { label: 'Total Students', value: '+12%', number: 1248, icon: Users },
    { label: 'Monthly Revenue', value: '+23%', number: 'UGX 4.1M', icon: TrendingUp },
    { label: 'Attendance', value: '-2%', number: '94.5%', icon: UsersIcon },
    { label: 'Pending Fees', value: '-15%', number: 'UGX 890K', icon: FileText },
  ];

  const formatUGX = (amount: string) => amount.replace('UGX ', 'UGX ');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-foreground/60">Welcome back! Here's what's happening at {schoolName}.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
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
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <div className="h-48 flex items-end gap-2">
            {[65, 80, 72, 90].map((height, i) => (
              <div key={i} className="flex-1 bg-primary/20 rounded-t">
                <div 
                  className="bg-primary rounded-t transition-all" 
                  style={{ height: `${height}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-foreground/60">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
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

      {/* Recent Students */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Students</h3>
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
            {recentStudents.map((student) => (
              <tr key={student.id}>
                <td className="px-4 py-3 font-medium">{student.name}</td>
                <td className="px-4 py-3">{student.class}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    student.status === 'Paid' ? 'bg-green-100 text-green-600' :
                    student.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {student.status}
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