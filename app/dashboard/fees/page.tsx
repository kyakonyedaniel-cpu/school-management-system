"use client";

import { useState } from 'react';
import { Plus, DollarSign, AlertTriangle, Clock, TrendingUp } from 'lucide-react';
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

const COLORS = ['#2563eb', '#16a34a', '#dc2626'];

export default function FeesPage() {
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

  const formatUGX = (amount: number) => `UGX ${amount.toLocaleString('en-US')}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fees Management</h1>
          <p className="text-foreground/60">Track and manage school fees</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Collect Fee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Total Collected</p>
              <p className="text-xl font-bold">{formatUGX(12400000)}</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Expected</p>
              <p className="text-xl font-bold">{formatUGX(12800000)}</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Pending</p>
              <p className="text-xl font-bold">38</p>
            </div>
          </div>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Overdue</p>
              <p className="text-xl font-bold">17</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Monthly Collection</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={collectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => formatUGX(v)} />
              <Bar dataKey="collected" fill="#2563eb" name="Collected" />
              <Bar dataKey="expected" fill="#e5e7eb" name="Expected" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-background p-4 rounded-lg border">
          <h3 className="font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fee Structure Table */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Fee Structure by Class</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Tuition</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Development</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Uniforms</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Books</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {feeStructure.map((fee) => (
              <tr key={fee.id}>
                <td className="px-4 py-3 font-medium">{fee.class}</td>
                <td className="px-4 py-3 text-right">{formatUGX(fee.tuition)}</td>
                <td className="px-4 py-3 text-right">{formatUGX(fee.development)}</td>
                <td className="px-4 py-3 text-right">{formatUGX(fee.uniforms)}</td>
                <td className="px-4 py-3 text-right">{formatUGX(fee.books)}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatUGX(fee.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Payments */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Recent Payments</h3>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Amount</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Method</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {recentPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 font-medium">{payment.student}</td>
                <td className="px-4 py-3">{payment.class}</td>
                <td className="px-4 py-3 text-right">{formatUGX(payment.amount)}</td>
                <td className="px-4 py-3">{payment.date}</td>
                <td className="px-4 py-3">{payment.method}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {payment.status}
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
