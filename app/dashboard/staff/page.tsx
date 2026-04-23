'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Edit, Search, DollarSign, Download, TrendingUp } from 'lucide-react';

const staffMembers = [
  { id: 1, name: 'Mr. John Kamulegeya', role: 'Headteacher', department: 'Administration', salary: 2500000, status: 'Active' },
  { id: 2, name: 'Mrs. Grace Namutowe', role: 'Deputy Head', department: 'Administration', salary: 1800000, status: 'Active' },
  { id: 3, name: 'Mr. Peter Ssegujja', role: 'Mathematics Teacher', department: 'Science', salary: 1200000, status: 'Active' },
  { id: 4, name: 'Mrs. Faith Mbabazi', role: 'English Teacher', department: 'Languages', salary: 1200000, status: 'Active' },
  { id: 5, name: 'Mr. David Kigozi', role: 'Science Teacher', department: 'Science', salary: 1200000, status: 'Active' },
  { id: 6, name: 'Ms. Sarah Nakayiza', role: 'Secretary', department: 'Administration', salary: 800000, status: 'Active' },
];

export default function StaffPage() {
  const [schoolName, setSchoolName] = useState('Your School');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  const totalPayroll = staffMembers.reduce((acc, s) => acc + s.salary, 0);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"><Building className="w-4 h-4 text-white" /></div>
          <span className="font-bold text-sm">{schoolName}</span>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Dashboard</Link>
          <Link href="/dashboard/features" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Features</Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Students</Link>
          <Link href="/dashboard/fees" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Fees</Link>
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 py-1 text-xs font-medium text-foreground/40">African Features</p>
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><BookOpen size={14} /> Curriculum</Link>
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Reports</Link>
            <Link href="/dashboard/staff" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><Users size={14} /> Staff</Link>
            <Link href="/dashboard/houses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Heart size={14} /> Houses</Link>
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><UsersRound size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Award size={14} /> Admissions</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Staff Payroll</h1>
              <p className="text-sm text-foreground/60">NSSF, taxes & allowances</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add Staff
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">{staffMembers.length}</h3>
                  <p className="text-sm text-foreground/60">Total Staff</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><DollarSign className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">UGX {(totalPayroll / 1000000).toFixed(1)}M</h3>
                  <p className="text-sm text-foreground/60">Monthly Payroll</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-yellow-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">Apr 2026</h3>
                  <p className="text-sm text-foreground/60">Next Payment</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-purple-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">NSSF 10%</h3>
                  <p className="text-sm text-foreground/60">Pension Deduction</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Staff Directory</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                  <input type="text" placeholder="Search staff..." className="pl-10 pr-4 py-2 rounded-lg border border-border w-64" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
                  <Download size={18} /> Export
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Staff Member</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Department</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Monthly Salary</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">NSSF (10%)</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((staff) => (
                    <tr key={staff.id} className="border-t border-border">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                            {staff.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <span className="font-medium">{staff.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{staff.role}</td>
                      <td className="px-4 py-3 text-sm">{staff.department}</td>
                      <td className="px-4 py-3 font-medium">UGX {staff.salary.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">UGX {(staff.salary * 0.1).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
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