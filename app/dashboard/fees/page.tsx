"use client";

import { useState, useMemo } from 'react';
import { Plus, DollarSign, AlertTriangle, Clock, TrendingUp, X, Search, Send, FileText, Download, Phone, Wallet, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePayments, useStudents, formatUGX, classes } from '@/lib/data';

const COLORS = ['#2563eb', '#16a34a', '#dc2626'];

interface FeeItem {
  id: number;
  class: string;
  term: string;
  tuition: number;
  development: number;
  uniforms: number;
  books: number;
  boarding?: number;
  transport?: number;
  meals?: number;
  total: number;
}

const defaultFeeStructure: FeeItem[] = [
  { id: 1, class: 'P.1 - P.3', term: 'Term 1', tuition: 450000, development: 100000, uniforms: 150000, books: 80000, total: 780000 },
  { id: 2, class: 'P.4 - P.7', term: 'Term 1', tuition: 550000, development: 120000, uniforms: 150000, books: 100000, total: 920000 },
  { id: 3, class: 'S.1 - S.2', term: 'Term 1', tuition: 650000, development: 150000, uniforms: 180000, books: 120000, total: 1100000 },
  { id: 4, class: 'S.3 - S.4', term: 'Term 1', tuition: 700000, development: 150000, uniforms: 180000, books: 120000, total: 1150000 },
  { id: 5, class: 'S.5 - S.6', term: 'Term 1', tuition: 800000, development: 180000, uniforms: 200000, books: 150000, total: 1330000 },
];

export default function FeesPage() {
  const { payments, addPayment, updatePaymentStatus } = usePayments();
  const { students } = useStudents();
  const [showCollect, setShowCollect] = useState(false);
  const [showStatement, setShowStatement] = useState<string | null>(null);
  const [showReminder, setShowReminder] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [paymentForm, setPaymentForm] = useState({
    studentId: '',
    amount: 0,
    method: 'Mobile Money',
    description: '',
    phone: '',
    sendSMS: true
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
    { name: 'Overdue', value: students.filter(s => {
      const studentPayments = payments.filter(p => p.studentId === s.id && p.status === 'Confirmed');
      const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
      const classFee = feeStructure.find(f => s.class.startsWith(f.class.split(' ')[0]))?.total || 0;
      return totalPaid < classFee;
    }).length },
  ];

  const studentBalances = useMemo(() => {
    return students.map(student => {
      const studentPayments = payments.filter(p => p.studentId === student.id && p.status === 'Confirmed');
      const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
      const classFee = feeStructure.find(f => student.class.startsWith(f.class.split(' ')[0]))?.total || 0;
      const balance = classFee - totalPaid;
      return {
        ...student,
        totalPaid,
        classFee,
        balance,
        lastPayment: studentPayments.length > 0 ? studentPayments[studentPayments.length - 1].date : null
      };
    }).filter(s => selectedClass === 'All Classes' || s.class === selectedClass);
  }, [students, payments, selectedClass]);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.studentId.includes(searchTerm);
    const student = students.find(s => s.id === p.studentId);
    const matchesClass = selectedClass === 'All Classes' || student?.class === selectedClass;
    return matchesSearch && matchesClass;
  });

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
        status: paymentForm.method === 'Mobile Money' ? 'Pending' : 'Confirmed',
        description: paymentForm.description
      });
      if (paymentForm.sendSMS) {
        alert(`SMS notification sent to parent of ${student.name}`);
      }
      setShowCollect(false);
      setPaymentForm({ studentId: '', amount: 0, method: 'Mobile Money', description: '', phone: '', sendSMS: true });
    }
  };

  const sendReminder = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const balance = studentBalances.find(b => b.id === studentId);
    if (student && balance) {
      alert(`Reminder sent to ${student.name}'s parent: Balance of ${formatUGX(balance.balance)}`);
      setShowReminder(false);
    }
  };

  const exportBalances = () => {
    const data = studentBalances.map(s => ({
      name: s.name,
      class: s.class,
      totalPaid: s.totalPaid,
      classFee: s.classFee,
      balance: s.balance
    }));
    const csv = 'Name,Class,Total Paid,Expected,Balance\n' +
      data.map(d => `${d.name},${d.class},${d.totalPaid},${d.classFee},${d.balance}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fee-balances-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const totalCollected = payments.filter(p => p.status === 'Confirmed').reduce((sum, p) => sum + p.amount, 0);
  const totalExpected = students.reduce((sum, s) => {
    const classFee = feeStructure.find(f => f.class.includes(s.class.split(' ')[0]))?.total || 0;
    return sum + classFee;
  }, 0);
  const totalOverdue = studentBalances.reduce((sum, s) => Math.max(0, s.balance), 0);

  const [activeTab, setActiveTab] = useState<'structure' | 'balances' | 'payments'>('structure');
  const [feeStructure, setFeeStructure] = useState<FeeItem[]>(defaultFeeStructure);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);
  const [feeForm, setFeeForm] = useState({
    class: '',
    term: 'Term 1',
    tuition: '',
    development: '',
    uniforms: '',
    books: '',
    boarding: '',
    transport: '',
    meals: ''
  });

  const calculateTotal = () => {
    const values = [feeForm.tuition, feeForm.development, feeForm.uniforms, feeForm.books, feeForm.boarding, feeForm.transport, feeForm.meals];
    return values.reduce((sum, v) => sum + (parseInt(v) || 0), 0);
  };

  const openAddFee = () => {
    setEditingFee(null);
    setFeeForm({
      class: '', term: 'Term 1', tuition: '', development: '', uniforms: '', books: '', boarding: '', transport: '', meals: ''
    });
    setShowFeeModal(true);
  };

  const openEditFee = (fee: FeeItem) => {
    setEditingFee(fee);
    setFeeForm({
      class: fee.class, term: fee.term, tuition: fee.tuition.toString(), development: fee.development.toString(),
      uniforms: fee.uniforms.toString(), books: fee.books.toString(),
      boarding: fee.boarding?.toString() || '', transport: fee.transport?.toString() || '', meals: fee.meals?.toString() || ''
    });
    setShowFeeModal(true);
  };

  const handleSaveFee = () => {
    const total = calculateTotal();
    const newFee: FeeItem = {
      id: editingFee?.id || Date.now(), class: feeForm.class, term: feeForm.term,
      tuition: parseInt(feeForm.tuition) || 0, development: parseInt(feeForm.development) || 0,
      uniforms: parseInt(feeForm.uniforms) || 0, books: parseInt(feeForm.books) || 0,
      boarding: parseInt(feeForm.boarding) || undefined, transport: parseInt(feeForm.transport) || undefined,
      meals: parseInt(feeForm.meals) || undefined, total
    };
    if (editingFee) {
      setFeeStructure(prev => prev.map(f => f.id === editingFee.id ? newFee : f));
    } else {
      setFeeStructure(prev => [...prev, newFee]);
    }
    setShowFeeModal(false);
  };

  const handleDeleteFee = (id: number) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      setFeeStructure(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fees Management</h1>
          <p className="text-foreground/60">Track and manage school fees</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportBalances}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
            <Download size={18} />Export
          </button>
          <button onClick={() => setShowCollect(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Collect Fee
          </button>
        </div>
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
              <p className="text-xl font-bold">{formatUGX(totalExpected)}</p>
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
              <p className="text-xl font-bold">{formatUGX(totalOverdue)}</p>
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

      {/* Tabs Navigation */}
      <div className="bg-background rounded-lg border">
        <div className="border-b flex">
          <button
            onClick={() => setActiveTab('structure')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'structure' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground/80'
            }`}
          >
            Fee Structure
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'balances' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground/80'
            }`}
          >
            Student Balances
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'payments' ? 'border-primary text-primary' : 'border-transparent hover:text-foreground/80'
            }`}
          >
            Recent Payments
          </button>
        </div>

        {/* Fee Structure Tab */}
        {activeTab === 'structure' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Fee Structure by Class</h3>
              <button onClick={openAddFee} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                <Plus size={14} />Add Fee Structure
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Term</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Tuition</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Development</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Uniforms</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Books</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Total</th>
                  <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {feeStructure.map((fee) => (
                  <tr key={fee.id}>
                    <td className="px-4 py-3 font-medium">{fee.class}</td>
                    <td className="px-4 py-3">{fee.term}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(fee.tuition)}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(fee.development)}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(fee.uniforms)}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(fee.books)}</td>
                    <td className="px-4 py-3 text-right font-semibold">{formatUGX(fee.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditFee(fee)} className="p-1.5 rounded hover:bg-muted" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteFee(fee.id)} className="p-1.5 rounded hover:bg-muted text-red-600" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Student Balances Tab */}
        {activeTab === 'balances' && (
          <div>
            <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="font-semibold">Student Fee Balances</h3>
              <div className="flex gap-2 items-center">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
                  className="px-3 py-2 rounded-lg border text-sm">
                  {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={14} />
                  <input type="text" placeholder="Search..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-3 py-2 rounded-lg border text-sm w-48" />
                </div>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Paid</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Expected</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Balance</th>
                  <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {studentBalances
                  .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .slice(0, 20)
                  .map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3">{student.class}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(student.totalPaid)}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(student.classFee)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatUGX(Math.max(0, student.balance))}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setShowStatement(student.id)}
                          className="p-1.5 rounded hover:bg-muted" title="View Statement">
                          <FileText size={14} />
                        </button>
                        <button onClick={() => { setShowReminder(true); setShowStatement(student.id); }}
                          className="p-1.5 rounded hover:bg-muted text-yellow-600" title="Send Reminder">
                          <Send size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Recent Payments Tab */}
        {activeTab === 'payments' && (
          <div>
            <div className="p-4 border-b flex items-center gap-4">
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
                {filteredPayments.slice(0, 10).map((payment) => (
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
        )}
      </div>

      {/* Collect Fee Modal */}
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
                <input type="number" required min="0" value={paymentForm.amount || ''} onChange={(e) => setPaymentForm({ ...paymentForm, amount: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="Mobile Money">Mobile Money (MTN/Airtel)</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
              {paymentForm.method === 'Mobile Money' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                    <input type="tel" value={paymentForm.phone} onChange={(e) => setPaymentForm({ ...paymentForm, phone: e.target.value })}
                      placeholder="+256..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <input type="text" value={paymentForm.description} onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  placeholder="e.g. Term 1 Tuition"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={paymentForm.sendSMS} onChange={(e) => setPaymentForm({ ...paymentForm, sendSMS: e.target.checked })}
                  id="sms-notify" />
                <label htmlFor="sms-notify" className="text-sm">Send SMS notification to parent</label>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCollect(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
                  <Wallet size={16} />Collect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fee Statement Modal */}
      {showStatement && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Fee Statement</h2>
              <button onClick={() => setShowStatement(null)}><X size={20} /></button>
            </div>
            {(() => {
              const student = students.find(s => s.id === showStatement);
              const studentPayments = payments.filter(p => p.studentId === showStatement && p.status === 'Confirmed');
              const classFee = feeStructure.find(f => f.class.includes(student?.class.split(' ')[0] || ''))?.total || 0;
              const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
              return student ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm text-foreground/60">Student</p>
                      <p className="font-semibold">{student.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Class</p>
                      <p className="font-semibold">{student.class}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Total Expected</p>
                      <p className="font-semibold">{formatUGX(classFee)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Balance</p>
                      <p className={`font-semibold ${classFee - totalPaid > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatUGX(Math.max(0, classFee - totalPaid))}
                      </p>
                    </div>
                  </div>
                  <h4 className="font-medium">Payment History</h4>
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left px-3 py-2 text-sm">Date</th>
                        <th className="text-right px-3 py-2 text-sm">Amount</th>
                        <th className="text-left px-3 py-2 text-sm">Method</th>
                        <th className="text-left px-3 py-2 text-sm">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {studentPayments.map((p, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{p.date}</td>
                          <td className="px-3 py-2 text-right">{formatUGX(p.amount)}</td>
                          <td className="px-3 py-2">{p.method}</td>
                          <td className="px-3 py-2">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null;
            })()}
          </div>
        </div>
        )}

        {/* Fee Structure Modal */}
        {showFeeModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-xl border border-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'}
                </h2>
                <button onClick={() => setShowFeeModal(false)}><X size={20} /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Class Range</label>
                    <input type="text" required value={feeForm.class}
                      onChange={(e) => setFeeForm({ ...feeForm, class: e.target.value })}
                      placeholder="e.g., P.1 - P.3" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Term</label>
                    <select value={feeForm.term} onChange={(e) => setFeeForm({ ...feeForm, term: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border">
                      <option value="Term 1">Term 1</option>
                      <option value="Term 2">Term 2</option>
                      <option value="Term 3">Term 3</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tuition (UGX)</label>
                    <input type="number" value={feeForm.tuition} onChange={(e) => setFeeForm({ ...feeForm, tuition: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Development (UGX)</label>
                    <input type="number" value={feeForm.development} onChange={(e) => setFeeForm({ ...feeForm, development: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Uniforms (UGX)</label>
                    <input type="number" value={feeForm.uniforms} onChange={(e) => setFeeForm({ ...feeForm, uniforms: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Books (UGX)</label>
                    <input type="number" value={feeForm.books} onChange={(e) => setFeeForm({ ...feeForm, books: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Boarding (Optional)</label>
                    <input type="number" value={feeForm.boarding} onChange={(e) => setFeeForm({ ...feeForm, boarding: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Transport (Optional)</label>
                    <input type="number" value={feeForm.transport} onChange={(e) => setFeeForm({ ...feeForm, transport: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Meals (Optional)</label>
                    <input type="number" value={feeForm.meals} onChange={(e) => setFeeForm({ ...feeForm, meals: e.target.value })}
                      placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm text-foreground/60">Total: <span className="font-semibold text-foreground">{formatUGX(calculateTotal())}</span></p>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowFeeModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                  <button onClick={handleSaveFee} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                    {editingFee ? 'Update' : 'Add'} Fee Structure
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}