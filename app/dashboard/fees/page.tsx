'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Search, Download, DollarSign, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const feeStructure = [
  { id: 1, class: 'P.1 - P.3', tuition: 450000, development: 100000, uniforms: 150000, books: 80000, total: 780000 },
  { id: 2, class: 'P.4 - P.7', tuition: 550000, development: 120000, uniforms: 150000, books: 100000, total: 920000 },
  { id: 3, class: 'S.1 - S.2', tuition: 650000, development: 150000, uniforms: 180000, books: 120000, total: 1100000 },
  { id: 4, class: 'S.3 - S.4', tuition: 700000, development: 150000, uniforms: 180000, books: 120000, total: 1150000 },
  { id: 5, class: 'S.5 - S.6', tuition: 800000, development: 180000, uniforms: 200000, books: 150000, total: 1330000 },
];

const recentPayments = [
  { id: 1, student: 'John Okello', class: 'P.7', amount: 920000, date: 'Apr 20, 2026', method: 'Mobile Money', status: 'Confirmed' },
  { id: 2, student: 'Mary Namuli', class: 'S.2', amount: 1100000, date: 'Apr 19, 2026', method: 'Bank Transfer', status: 'Confirmed' },
  { id: 3, student: 'James Mukasa', class: 'P.6', amount: 920000, date: 'Apr 18, 2026', method: 'Cash', status: 'Pending' },
  { id: 4, student: 'Faith Apio', class: 'S.1', amount: 1100000, date: 'Apr 17, 2026', method: 'Mobile Money', status: 'Confirmed' },
];

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b'];

export default function FeesPage() {
  const [schoolName, setSchoolName] = useState('Your School');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  const collectionData = [
    { name: 'Jan', collected: 2800000, expected: 3200000 },
    { name: 'Feb', collected: 3200000, expected: 3200000 },
    { name: 'Mar', collected: 2900000, expected: 3200000 },
    { name: 'Apr', collected: 3500000, expected: 3200000 },
  ];

  const statusData = [
    { name: 'Paid', value: 245 },
    { name: 'Pending', value: 38 },
    { name: 'Overdue', value: 17 },
  ];

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">{schoolName}</span>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Dashboard</Link>
          <Link href="/dashboard/features" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Features</Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Students</Link>
          <Link href="/dashboard/fees" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm">Fees</Link>
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 py-1 text-xs font-medium text-foreground/40">African Features</p>
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><BookOpen size={14} /> Curriculum</Link>
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Reports</Link>
            <Link href="/dashboard/staff" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Staff</Link>
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
              <h1 className="text-xl font-bold text-foreground">Fees Management</h1>
              <p className="text-sm text-foreground/60">Track and manage school fees</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
              <Plus size={18} />
              Record Payment
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">UGX 15.2M</h3>
              <p className="text-sm text-foreground/60">Collected (This Term)</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">UGX 890K</h3>
              <p className="text-sm text-foreground/60">Pending</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">UGX 540K</h3>
              <p className="text-sm text-foreground/60">Overdue</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">92%</h3>
              <p className="text-sm text-foreground/60">Collection Rate</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Collection</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={collectionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v/1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, '']} />
                  <Bar dataKey="collected" fill="#16a34a" name="Collected" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expected" fill="#e5e7eb" name="Expected" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Payment Status</h3>
              <div className="flex items-center">
                <ResponsiveContainer width="50%" height={250}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {statusData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {statusData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value} students</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Class</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Method</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPayments.map((payment) => (
                    <tr key={payment.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium">{payment.student}</td>
                      <td className="px-6 py-4 text-sm">{payment.class}</td>
                      <td className="px-6 py-4 font-medium">UGX {payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">{payment.date}</td>
                      <td className="px-6 py-4 text-sm">{payment.method}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'Confirmed' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'}`}>
                          {payment.status}
                        </span>
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