"use client";

import { useState } from 'react';
import { Plus, DollarSign, AlertTriangle, Clock, TrendingUp, X, Search } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePayments, useStudents, formatUGX, classes } from '@/lib/data';

const COLORS = ['#2563eb', '#16a34a', '#dc2626'];

const feeStructure = [
  { id: 1, class: 'P.1 - P.3', tuition: 450000, development: 100000, uniforms: 150000, books: 80000, total: 780000 },
  { id: 2, class: 'P.4 - P.7', tuition: 550000, development: 120000, uniforms: 150000, books: 100000, total: 920000 },
  { id: 3, class: 'S.1 - S.2', tuition: 650000, development: 150000, uniforms: 180000, books: 120000, total: 1100000 },
  { id: 4, class: 'S.3 - S.4', tuition: 700000, development: 150000, uniforms: 180000, books: 120000, total: 1150000 },
  { id: 5, class: 'S.5 - S.6', tuition: 800000, development: 180000, uniforms: 200000, books: 150000, total: 1330000 },
];

export default function FeesPage() {
  const { payments, addPayment, updatePaymentStatus } = usePayments();
  const { students } = useStudents();
  const [showCollect, setShowCollect] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    amount: 0,
    method: 'Mobile Money',
    description: ''
  });

  const collectionData = [
    { name: 'Jan', collected: 2800000, expected: 3200000 },
    { name: 'Feb', collected: 3200000, expected: 3200000 },
    { name: 'Mar', collected: 2900000, expected: 3200000 },
    { name: 'Apr', collected: payments.filter(p => p.status === 'Confirmed').reduce((sum, p) => sum + p.amount, 0), expected: 3200000 },
  ];

  const statusData = [
    { name: 'Paid', value: payments.filter(p => p.status === 'Confirmed').length },
    { name: 'Pending', value: payments.filter(p => p.status === 'Pending').length },
    { name: 'Overdue', value: 17 },
  ];

  const filteredPayments = payments.filter(p => 
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.studentId.includes(searchTerm)
  );

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === paymentForm.studentId);
    if (student) {
      addPayment({
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        amount: paymentForm.amount,
        date: new Date().toISOString().split('T')[0],
        method: paymentForm.method,
        status: 'Confirmed',
        description: paymentForm.description
      });
      setShowCollect(false);
      setPaymentForm({ studentId: '', amount: 0, method: 'Mobile Money', description: '' });
    }
  };

  const totalCollected = payments.filter(p => p.status === 'Confirmed').reduce((sum, p) => sum + p.amount, 0);
  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fees Management</h1>
          <p className="text-foreground/60">Track and manage school fees</p>
        </div>
        <button onClick={() => setShowCollect(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Collect Fee
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-foreground/60">Total Collected</p>
              <p className="text-xl font-bold">{formatUGX(totalCollected)}</p>
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
              <p className="text-xl font-bold">{payments.filter(p => p.status === 'Pending').length}</p>
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

      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex items-center gap-4">
          <h3 className="font-semibold">Recent Payments</h3>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input type="text" placeholder="Search payments..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
          </div>
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
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-4 py-3 font-medium">{payment.studentName}</td>
                <td className="px-4 py-3">{payment.class}</td>
                <td className="px-4 py-3 text-right">{formatUGX(payment.amount)}</td>
                <td className="px-4 py-3">{payment.date}</td>
                <td className="px-4 py-3">{payment.method}</td>
                <td className="px-4 py-3">
                  <select value={payment.status} onChange={(e) => updatePaymentStatus(payment.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs ${payment.status === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCollect && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Collect Fee</h2>
              <button onClick={() => setShowCollect(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCollect} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select required value={paymentForm.studentId} onChange={(e) => setPaymentForm({ ...paymentForm, studentId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (UGX)</label>
                <input type="number" required min="0" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="Mobile Money">Mobile Money</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <input type="text" value={paymentForm.description} onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  placeholder="e.g. Term 1 Tuition"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCollect(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Collect</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}