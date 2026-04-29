"use client";

import { useState, useEffect } from 'react';
import { School, Users, TrendingUp, Users as UsersIcon, FileText, Calendar } from 'lucide-react';
import { getSchoolProfile, SchoolProfile } from '@/lib/school';

export default function DashboardPage() {
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(getSchoolProfile());
  const [students, setStudents] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('school_students') || '[]');
    const storedFees = JSON.parse(localStorage.getItem('school_fees') || '[]');
    setStudents(storedStudents);
    setFees(storedFees);
  }, []);

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

      {/* Recent Students */}
      <div className="bg-background rounded-lg border">
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
