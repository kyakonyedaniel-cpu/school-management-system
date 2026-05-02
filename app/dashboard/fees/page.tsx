"use client";

import { useState, useMemo, useEffect } from 'react';
import { Plus, DollarSign, AlertTriangle, Clock, TrendingUp, X, Search, Send, FileText, Download, Phone, Wallet, Edit, Trash2, Calendar, Percent, Gift, FileDown, Settings, Bell, CreditCard, Printer, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePayments, useStudents, formatUGX, classes } from '@/lib/data';
import { defaultSchoolProfile } from '@/lib/school';

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#f59e0b', '#8b5cf6'];

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
  category?: 'day' | 'boarding' | 'international';
}

interface InstallmentPlan {
  id: number;
  studentId: string;
  totalAmount: number;
  installments: { dueDate: string; amount: number; status: 'pending' | 'paid' | 'overdue' }[];
  createdAt: string;
}

interface Discount {
  id: number;
  studentId: string;
  type: 'merit' | 'sibling' | 'financial_aid' | 'sports' | 'music';
  percentage: number;
  amount: number;
  reason: string;
  approvedBy: string;
  date: string;
}

interface AutomatedReminder {
  id: number;
  type: 'before_due' | 'on_due' | 'after_due' | 'custom';
  daysBeforeDue?: number;
  daysAfterDue?: number;
  message: string;
  channels: ('sms' | 'whatsapp' | 'email')[];
  isActive: boolean;
}

interface FeeTemplate {
  id: number;
  name: string;
  academicYear: string;
  term: string;
  structure: FeeItem[];
  isActive: boolean;
}

interface Credit {
  id: number;
  studentId: string;
  amount: number;
  type: 'overpayment' | 'refund' | 'scholarship';
  status: 'available' | 'applied' | 'refunded';
  appliedTo?: string;
  date: string;
}

interface StudentTypeFee {
  studentType: 'day' | 'boarding' | 'international';
  class: string;
  term: string;
  baseFee: number;
  additionalCharges: { name: string; amount: number }[];
  total: number;
}

const defaultFeeStructure: FeeItem[] = [
  { id: 1, class: 'P.1 - P.3', term: 'Term 1', tuition: 450000, development: 100000, uniforms: 150000, books: 80000, total: 780000, category: 'day' },
  { id: 2, class: 'P.4 - P.7', term: 'Term 1', tuition: 550000, development: 120000, uniforms: 150000, books: 100000, total: 920000, category: 'day' },
  { id: 3, class: 'S.1 - S.2', term: 'Term 1', tuition: 650000, development: 150000, uniforms: 180000, books: 120000, total: 1100000, category: 'day' },
  { id: 4, class: 'S.3 - S.4', term: 'Term 1', tuition: 700000, development: 150000, uniforms: 180000, books: 120000, total: 1150000, category: 'day' },
  { id: 5, class: 'S.5 - S.6', term: 'Term 1', tuition: 800000, development: 180000, uniforms: 200000, books: 150000, total: 1330000, category: 'day' },
];

export default function FeesPage() {
  const { payments, addPayment, updatePaymentStatus } = usePayments();
  const { students } = useStudents();
  
  const [activeTab, setActiveTab] = useState<'structure' | 'balances' | 'payments' | 'installments' | 'discounts' | 'reminders' | 'templates' | 'credits' | 'reports'>('structure');
  const [feeStructure, setFeeStructure] = useState<FeeItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fee_structure');
      return saved ? JSON.parse(saved) : defaultFeeStructure;
    }
    return defaultFeeStructure;
  });
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeItem | null>(null);
  const [feeForm, setFeeForm] = useState({
    class: '', term: 'Term 1', tuition: '', development: '', uniforms: '', books: '', boarding: '', transport: '', meals: '', category: 'day'
  });

  const [showCollect, setShowCollect] = useState(false);
  const [showStatement, setShowStatement] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [paymentForm, setPaymentForm] = useState({
    studentId: '', amount: 0, method: 'Mobile Money', description: '', phone: '', sendSMS: true
  });

  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('installment_plans');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  
  const [discounts, setDiscounts] = useState<Discount[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fee_discounts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  
  const [reminders, setReminders] = useState<AutomatedReminder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fee_reminders');
      return saved ? JSON.parse(saved) : [
        { id: 1, type: 'before_due', daysBeforeDue: 3, message: 'Dear parent, fee payment for {student} is due in 3 days. Amount: {amount}.', channels: ['sms', 'whatsapp'], isActive: true },
        { id: 2, type: 'on_due', message: 'Dear parent, fee payment for {student} is due today. Amount: {amount}.', channels: ['sms'], isActive: true },
        { id: 3, type: 'after_due', daysAfterDue: 3, message: 'ALERT: Fee payment for {student} is overdue by 3 days. Amount: {amount}. Please pay immediately.', channels: ['sms', 'whatsapp'], isActive: true },
      ];
    }
    return [
      { id: 1, type: 'before_due', daysBeforeDue: 3, message: 'Dear parent, fee payment for {student} is due in 3 days. Amount: {amount}.', channels: ['sms', 'whatsapp'], isActive: true },
      { id: 2, type: 'on_due', message: 'Dear parent, fee payment for {student} is due today. Amount: {amount}.', channels: ['sms'], isActive: true },
      { id: 3, type: 'after_due', daysAfterDue: 3, message: 'ALERT: Fee payment for {student} is overdue by 3 days. Amount: {amount}. Please pay immediately.', channels: ['sms', 'whatsapp'], isActive: true },
    ];
  });
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<AutomatedReminder | null>(null);
  const [reminderForm, setReminderForm] = useState({
    type: 'before_due' as string, daysBeforeDue: 3, daysAfterDue: 3, message: '', channels: ['sms'] as string[]
  });
  
  const [credits, setCredits] = useState<Credit[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fee_credits');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [showCreditModal, setShowCreditModal] = useState(false);
  
  const [studentTypeFees, setStudentTypeFees] = useState<StudentTypeFee[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('student_type_fees');
      return saved ? JSON.parse(saved) : [
        { studentType: 'day', class: 'P.1 - P.3', term: 'Term 1', baseFee: 780000, additionalCharges: [], total: 780000 },
        { studentType: 'boarding', class: 'P.1 - P.3', term: 'Term 1', baseFee: 780000, additionalCharges: [{ name: 'Boarding', amount: 500000 }], total: 1280000 },
        { studentType: 'international', class: 'P.1 - P.3', term: 'Term 1', baseFee: 780000, additionalCharges: [{ name: 'International Fee', amount: 1000000 }], total: 1780000 },
      ];
    }
    return [
      { studentType: 'day', class: 'P.1 - P.3', term: 'Term 1', baseFee: 780000, additionalCharges: [], total: 780000 },
      { studentType: 'boarding', class: 'P.1 - P.3', term: 'Term 1', baseFee: 780000, additionalCharges: [{ name: 'Boarding', amount: 500000 }], total: 1280000 },
      { studentType: 'international', class: 'P.1 - P.3', term: 'Term 1', baseFee: 780000, additionalCharges: [{ name: 'International Fee', amount: 1000000 }], total: 1780000 },
    ];
  });
  
  const [receipts, setReceipts] = useState<{id: number, paymentId: string, studentName: string, amount: number, date: string, receiptNo: string}[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fee_receipts');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fee_structure', JSON.stringify(feeStructure));
    }
  }, [feeStructure]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('installment_plans', JSON.stringify(installmentPlans));
    }
  }, [installmentPlans]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fee_discounts', JSON.stringify(discounts));
    }
  }, [discounts]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fee_reminders', JSON.stringify(reminders));
    }
  }, [reminders]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fee_templates', JSON.stringify(templates));
    }
  }, [templates]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fee_credits', JSON.stringify(credits));
    }
  }, [credits]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('fee_receipts', JSON.stringify(receipts));
    }
  }, [receipts]);
  
  const calculateTotal = () => {
    const values = [feeForm.tuition, feeForm.development, feeForm.uniforms, feeForm.books, feeForm.boarding, feeForm.transport, feeForm.meals];
    return values.reduce((sum, v) => sum + (parseInt(v) || 0), 0);
  };

  const openAddFee = () => {
    setEditingFee(null);
    setFeeForm({ class: '', term: 'Term 1', tuition: '', development: '', uniforms: '', books: '', boarding: '', transport: '', meals: '', category: 'day' });
    setShowFeeModal(true);
  };

  const openEditFee = (fee: FeeItem) => {
    setEditingFee(fee);
    setFeeForm({
      class: fee.class, term: fee.term, tuition: fee.tuition.toString(), development: fee.development.toString(),
      uniforms: fee.uniforms.toString(), books: fee.books.toString(),
      boarding: fee.boarding?.toString() || '', transport: fee.transport?.toString() || '', meals: fee.meals?.toString() || '',
      category: fee.category || 'day'
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
      meals: parseInt(feeForm.meals) || undefined, total, category: feeForm.category as 'day' | 'boarding' | 'international'
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
      const studentDiscounts = discounts.filter(d => d.studentId === student.id);
      const discountAmount = studentDiscounts.reduce((sum, d) => sum + d.amount, 0);
      const balance = classFee - totalPaid - discountAmount;
      const studentCredits = credits.filter(c => c.studentId === student.id && c.status === 'available');
      const creditAmount = studentCredits.reduce((sum, c) => sum + c.amount, 0);
      return {
        ...student,
        totalPaid,
        classFee,
        discountAmount,
        balance: Math.max(0, balance - creditAmount),
        creditAmount,
        hasInstallment: installmentPlans.some(p => p.studentId === student.id)
      };
    }).filter(s => selectedClass === 'All Classes' || s.class === selectedClass);
  }, [students, payments, selectedClass, feeStructure, discounts, credits, installmentPlans]);

  const filteredPayments = payments.filter(p => {
    const matchesSearch = p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || p.studentId.includes(searchTerm);
    const student = students.find(s => s.id === p.studentId);
    const matchesClass = selectedClass === 'All Classes' || student?.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === paymentForm.studentId);
    if (student) {
      const newPayment = {
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        amount: paymentForm.amount,
        date: new Date().toISOString().split('T')[0],
        method: paymentForm.method,
        status: paymentForm.method === 'Mobile Money' ? 'Pending' : 'Confirmed',
        description: paymentForm.description
      };
      addPayment(newPayment);
      
      const receiptNo = `RCP-${Date.now()}`;
      setReceipts(prev => [...prev, {
        id: Date.now(),
        paymentId: Date.now().toString(),
        studentName: student.name,
        amount: paymentForm.amount,
        date: new Date().toISOString().split('T')[0],
        receiptNo
      }]);
      
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
    }
  };

  const exportBalances = () => {
    const data = studentBalances.map(s => ({
      name: s.name, class: s.class, totalPaid: s.totalPaid, classFee: s.classFee, balance: s.balance
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

  const downloadFeeStructure = (format: 'csv' | 'print') => {
    const headers = ['Class', 'Term', 'Type', 'Tuition', 'Development', 'Uniforms', 'Books', 'Boarding', 'Transport', 'Meals', 'Total'];
    const rows = feeStructure.map(f => [
      f.class, f.term, f.category || 'day', 
      formatUGX(f.tuition), formatUGX(f.development), formatUGX(f.uniforms), formatUGX(f.books),
      f.boarding ? formatUGX(f.boarding) : '-', 
      f.transport ? formatUGX(f.transport) : '-', 
      f.meals ? formatUGX(f.meals) : '-', 
      formatUGX(f.total)
    ]);
    
    let school = defaultSchoolProfile;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('school_profile');
      if (stored) school = JSON.parse(stored);
    }
    
    if (format === 'csv') {
      const csv = headers.join(',') + '\n' + rows.map(r => r.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fee-structure-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } else {
      const logoHTML = school.logo ? `<img src="${school.logo}" alt="Logo" style="width: 80px; height: auto;" />` : '';
      const printContent = `
        <html>
          <head><title>Fee Structure - ${school.name}</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              h1 { color: #333; margin: 0; }
              h2 { color: #666; font-weight: normal; margin: 5px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 20px; }
              .school-info { display: flex; align-items: center; gap: 20px; }
              .total { font-weight: bold; }
              .motto { font-style: italic; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="school-info">
                ${logoHTML}
                <div>
                  <h1>${school.name}</h1>
                  <p class="motto">${school.motto}</p>
                  <p>${school.address} | ${school.phone} | ${school.email}</p>
                </div>
              </div>
              <div style="text-align: right;">
                <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Academic Year:</strong> 2026</p>
                <p><strong>Term:</strong> 1</p>
              </div>
            </div>
            <table>
              <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>              </thead>
              <tbody>
                ${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
              </tbody>
            </table>
            <p class="total" style="margin-top: 20px; font-weight: bold; font-size: 1.1em;">
              Total Expected Revenue: UGX ${feeStructure.reduce((sum, f) => sum + f.total, 0).toLocaleString()}
            </p>
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); }, 250);
      }
    }
  };

  const generateReceipt = (payment: any) => {
    const existingReceipt = receipts.find(r => r.paymentId === payment.id);
    if (existingReceipt) {
      const school = typeof window !== 'undefined' ? (localStorage.getItem('school_profile') ? JSON.parse(localStorage.getItem('school_profile')!) : defaultSchoolProfile) : defaultSchoolProfile;
      const receiptContent = `
        <html>
          <head><title>Receipt ${existingReceipt.receiptNo}</title>
            <style>
              body { font-family: Arial; padding: 40px; max-width: 400px; margin: 0 auto; }
              .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
              .logo { width: 80px; height: auto; }
              .motto { font-style: italic; color: #666; }
              .details { margin: 20px 0; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; padding-top: 20px; border-top: 2px solid #333; }
              .footer { text-align: center; margin-top: 30px; font-size: 0.9em; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              ${school.logo ? `<img src="${school.logo}" alt="Logo" class="logo" />` : ''}
              <h1>${school.name}</h1>
              <p class="motto">${school.motto}</p>
            </div>
            <div class="details">
              <div class="row"><span>Receipt No:</span><span>${existingReceipt.receiptNo}</span></div>
              <div class="row"><span>Student:</span><span>${existingReceipt.studentName}</span></div>
              <div class="row"><span>Date:</span><span>${existingReceipt.date}</span></div>
              <div class="row"><span>Payment Method:</span><span>${payment.method}</span></div>
              <div class="row"><span>Description:</span><span>${payment.description || 'School Fees'}</span></div>
            </div>
            <div class="total">
              <div class="row"><span>Total Paid:</span><span>${formatUGX(existingReceipt.amount)}</span></div>
            </div>
            <div class="footer">
              <p>Thank you for your payment!</p>
              <p>${school.name} | ${school.phone} | ${school.email}</p>
            </div>
          </body>
        </html>
      `;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(receiptContent);
        printWindow.document.close();
        setTimeout(() => { printWindow.print(); }, 250);
      }
    } else {
      const newReceiptNo = `RCP-${Date.now()}`;
      const newReceipt = {
        id: Date.now(),
        paymentId: payment.id,
        studentName: payment.studentName,
        amount: payment.amount,
        date: payment.date,
        receiptNo: newReceiptNo
      };
      setReceipts(prev => [...prev, newReceipt]);
      alert(`Receipt ${newReceiptNo} generated for ${payment.studentName}\nAmount: ${formatUGX(payment.amount)}\nDate: ${payment.date}`);
    }
  };

  const totalCollected = payments.filter(p => p.status === 'Confirmed').reduce((sum, p) => sum + p.amount, 0);
  const totalExpected = students.reduce((sum, s) => {
    const classFee = feeStructure.find(f => s.class.startsWith(f.class.split(' ')[0]))?.total || 0;
    return sum + classFee;
  }, 0);
  const totalOverdue = studentBalances.reduce((sum, s) => Math.max(0, s.balance), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fees Management</h1>
          <p className="text-foreground/60">Track and manage school fees with advanced tools</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportBalances} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted">
            <Download size={18} />Export
          </button>
          <button onClick={() => setShowCollect(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
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
              <YAxis tickFormatter={(v: number) => `${(v/1000000).toFixed(1)}M`} />
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
        <div className="border-b flex flex-wrap">
          {[
            { key: 'structure', label: 'Fee Structure' },
            { key: 'balances', label: 'Student Balances' },
            { key: 'payments', label: 'Recent Payments' },
            { key: 'installments', label: 'Installment Plans' },
            { key: 'discounts', label: 'Discounts' },
            { key: 'reminders', label: 'Auto Reminders' },
            { key: 'templates', label: 'Templates' },
            { key: 'credits', label: 'Credits' },
            { key: 'reports', label: 'Reports' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key ? 'border-primary text-primary' : 'border-transparent hover:text-foreground/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'structure' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Fee Structure by Class</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => downloadFeeStructure('csv')} className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted" title="Download CSV">
                  <Download size={14} />CSV
                </button>
                <button onClick={() => downloadFeeStructure('print')} className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted" title="Print Fee Structure">
                  <Printer size={14} />Print
                </button>
                <button onClick={openAddFee} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                  <Plus size={14} />Add Fee Structure
                </button>
              </div>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Term</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
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
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        fee.category === 'boarding' ? 'bg-purple-100 text-purple-600' :
                        fee.category === 'international' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {fee.category || 'day'}
                      </span>
                    </td>
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

        {activeTab === 'balances' && (
          <div>
            <div className="p-4 border-b flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h3 className="font-semibold">Student Fee Balances</h3>
              <div className="flex gap-2 items-center">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="px-3 py-2 rounded-lg border text-sm">
                  {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={14} />
                  <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="text-right px-4 py-3 text-sm font-medium">Discount</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Expected</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Balance</th>
                  <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {studentBalances.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 20).map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3">{student.class}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(student.totalPaid)}</td>
                    <td className="px-4 py-3 text-right text-green-600">-{formatUGX(student.discountAmount)}</td>
                    <td className="px-4 py-3 text-right">{formatUGX(student.classFee)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${student.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatUGX(Math.max(0, student.balance))}
                      {student.creditAmount > 0 && <span className="text-xs text-blue-600 block">Credit: {formatUGX(student.creditAmount)}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setShowStatement(student.id)} className="p-1.5 rounded hover:bg-muted" title="View Statement">
                          <FileText size={14} />
                        </button>
                        <button onClick={() => sendReminder(student.id)} className="p-1.5 rounded hover:bg-muted text-yellow-600" title="Send Reminder">
                          <Send size={14} />
                        </button>
                        {student.hasInstallment && <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">Installment</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

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
                  <th className="text-center px-4 py-3 text-sm font-medium">Receipt</th>
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
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => generateReceipt(payment)} className="p-1.5 rounded hover:bg-muted text-blue-600" title="Generate Receipt">
                        <Printer size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'installments' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Installment Payment Plans</h3>
              <button onClick={() => setShowInstallmentModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                <Plus size={14} />Create Plan
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Total Amount</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Installments</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Paid</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Balance</th>
                  <th className="text-center px-4 py-3 text-sm font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {installmentPlans.map((plan) => {
                  const student = students.find(s => s.id === plan.studentId);
                  const paidAmount = plan.installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
                  const balance = plan.totalAmount - paidAmount;
                  return (
                    <tr key={plan.id}>
                      <td className="px-4 py-3 font-medium">{student?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-right">{formatUGX(plan.totalAmount)}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          {plan.installments.map((inst, idx) => (
                            <div key={idx} className={`${inst.status === 'paid' ? 'text-green-600' : inst.status === 'overdue' ? 'text-red-600' : 'text-yellow-600'}`}>
                              {inst.dueDate}: {formatUGX(inst.amount)} ({inst.status})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">{formatUGX(paidAmount)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-red-600">{formatUGX(balance)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${balance === 0 ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                          {balance === 0 ? 'Complete' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {installmentPlans.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                      No installment plans created yet. Click "Create Plan" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'discounts' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Discounts & Scholarships</h3>
              <button onClick={() => setShowDiscountModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                <Plus size={14} />Add Discount
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Percentage</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Reason</th>
                  <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {discounts.map((discount) => {
                  const student = students.find(s => s.id === discount.studentId);
                  return (
                    <tr key={discount.id}>
                      <td className="px-4 py-3 font-medium">{student?.name || 'Unknown'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          discount.type === 'merit' ? 'bg-blue-100 text-blue-600' :
                          discount.type === 'sibling' ? 'bg-green-100 text-green-600' :
                          discount.type === 'financial_aid' ? 'bg-purple-100 text-purple-600' :
                          discount.type === 'sports' ? 'bg-orange-100 text-orange-600' :
                          'bg-pink-100 text-pink-600'
                        }`}>
                          {discount.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">{discount.percentage}%</td>
                      <td className="px-4 py-3 text-right font-semibold text-green-600">-{formatUGX(discount.amount)}</td>
                      <td className="px-4 py-3 text-sm">{discount.reason}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setDiscounts(prev => prev.filter(d => d.id !== discount.id))} className="p-1.5 rounded hover:bg-muted text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {discounts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                      No discounts added yet. Click "Add Discount" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Automated Fee Reminders</h3>
              <button onClick={() => { setEditingReminder(null); setReminderForm({ type: 'before_due', daysBeforeDue: 3, daysAfterDue: 3, message: '', channels: ['sms'] }); setShowReminderModal(true); }} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                <Plus size={14} />Add Reminder
              </button>
            </div>
            <div className="p-4 space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell size={16} className={reminder.isActive ? 'text-green-600' : 'text-gray-400'} />
                      <span className="font-medium capitalize">{reminder.type.replace('_', ' ')}</span>
                      {reminder.type === 'before_due' && <span className="text-sm text-foreground/60">{reminder.daysBeforeDue} days before due</span>}
                      {reminder.type === 'after_due' && <span className="text-sm text-foreground/60">{reminder.daysAfterDue} days after due</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${reminder.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {reminder.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button onClick={() => { 
                        setEditingReminder(reminder); 
                        setReminderForm({ 
                          type: reminder.type, 
                          daysBeforeDue: reminder.daysBeforeDue || 3, 
                          daysAfterDue: reminder.daysAfterDue || 3, 
                          message: reminder.message, 
                          channels: reminder.channels 
                        }); 
                        setShowReminderModal(true); 
                      }} className="p-1.5 rounded hover:bg-muted">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => setReminders(prev => prev.filter(r => r.id !== reminder.id))} className="p-1.5 rounded hover:bg-muted text-red-600">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/60 mb-2">{reminder.message}</p>
                  <div className="flex gap-2">
                    {reminder.channels.map(ch => (
                      <span key={ch} className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs capitalize">{ch}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <div className="p-4 border-b">
              <h3 className="font-semibold">Fee Structure Templates</h3>
            </div>
            <div className="p-4 space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-foreground/60">{template.academicYear} - {template.term}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${template.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/60">{template.structure.length} fee structures</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'credits' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Overpayments & Credits</h3>
              <button onClick={() => setShowCreditModal(true)} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                <Plus size={14} />Add Credit
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">Student</th>
                  <th className="text-right px-4 py-3 text-sm font-medium">Amount</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium">Applied To</th>
                  <th className="text-center px-4 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {credits.map((credit) => {
                  const student = students.find(s => s.id === credit.studentId);
                  return (
                    <tr key={credit.id}>
                      <td className="px-4 py-3 font-medium">{student?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-blue-600">{formatUGX(credit.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          credit.type === 'overpayment' ? 'bg-blue-100 text-blue-600' :
                          credit.type === 'refund' ? 'bg-red-100 text-red-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {credit.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          credit.status === 'available' ? 'bg-green-100 text-green-600' :
                          credit.status === 'applied' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {credit.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{credit.appliedTo || '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => setCredits(prev => prev.filter(c => c.id !== credit.id))} className="p-1.5 rounded hover:bg-muted text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {credits.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">
                      No credits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Advanced Reports</h3>
              <button onClick={() => {
                const reportData = [
                  ['Report Type', 'Data'],
                  ['Total Collected', formatUGX(totalCollected)],
                  ['Total Expected', formatUGX(totalExpected)],
                  ['Overdue Amount', formatUGX(totalOverdue)],
                  ['Pending Payments', payments.filter(p => p.status === 'Pending').length],
                  ['Active Installments', installmentPlans.filter(p => p.totalAmount > 0).length],
                  ['Total Discounts', formatUGX(discounts.reduce((sum, d) => sum + d.amount, 0))],
                ];
                const csv = reportData.map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `fee-reports-${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
              }} className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted">
                <FileDown size={14} />Export All Reports
              </button>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { 
                  title: 'Class-wise Collection', 
                  desc: 'View collection rates by class', 
                  icon: <Filter size={24} className="text-blue-600" />,
                  action: () => {
                    const classData = classes.filter(c => c !== 'All Classes').map(cls => {
                      const classStudents = students.filter(s => s.class === cls);
                      const classFee = feeStructure.find(f => f.class.startsWith(cls.split(' ')[0]))?.total || 0;
                      const totalExpected = classStudents.length * classFee;
                      const totalPaid = payments
                        .filter(p => p.status === 'Confirmed' && classStudents.some(s => s.id === p.studentId))
                        .reduce((sum, p) => sum + p.amount, 0);
                      const rate = totalExpected > 0 ? Math.round((totalPaid / totalExpected) * 100) : 0;
                      return [cls, classStudents.length, formatUGX(totalExpected), formatUGX(totalPaid), `${rate}%`];
                    });
                    const csv = 'Class,Students,Expected,Collected,Rate\n' + classData.map(r => r.join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `class-collection-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }
                },
                { 
                  title: 'Defaulter List', 
                  desc: 'Students with overdue payments + contact info', 
                  icon: <AlertTriangle size={24} className="text-red-600" />,
                  action: () => {
                    const defaulters = studentBalances.filter(s => s.balance > 0);
                    const csv = 'Name,Class,Balance,Phone,Email\n' + 
                      defaulters.map(s => {
                        const student = students.find(st => st.id === s.id);
                        return `${s.name},${s.class},${s.balance},${student?.phone || ''},${student?.email || ''}`;
                      }).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `defaulters-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }
                },
                { 
                  title: 'Monthly Summary', 
                  desc: 'Financial summary for any period', 
                  icon: <Calendar size={24} className="text-green-600" />,
                  action: () => {
                    const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => {
                      const monthPayments = payments.filter(p => {
                        const date = new Date(p.date);
                        return date.toLocaleString('default', { month: 'short' }) === month && p.status === 'Confirmed';
                      });
                      const collected = monthPayments.reduce((sum, p) => sum + p.amount, 0);
                      return [month, formatUGX(collected), monthPayments.length];
                    });
                    const csv = 'Month,Collected,Payments\n' + monthlyData.map(r => r.join(',')).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `monthly-summary-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }
                },
                { 
                  title: 'Discount Report', 
                  desc: 'All discounts and scholarships', 
                  icon: <Gift size={24} className="text-purple-600" />,
                  action: () => {
                    const csv = 'Student,Type,Percentage,Amount,Reason\n' + 
                      discounts.map(d => {
                        const student = students.find(s => s.id === d.studentId);
                        return `${student?.name || 'Unknown'},${d.type},${d.percentage}%,${d.amount},${d.reason}`;
                      }).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `discounts-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }
                },
                { 
                  title: 'Installment Progress', 
                  desc: 'Track all installment plans', 
                  icon: <CreditCard size={24} className="text-orange-600" />,
                  action: () => {
                    const csv = 'Student,Total Amount,Paid,Remaining,Status\n' + 
                      installmentPlans.map(p => {
                        const student = students.find(s => s.id === p.studentId);
                        const paid = p.installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
                        const remaining = p.totalAmount - paid;
                        return `${student?.name || 'Unknown'},${p.totalAmount},${paid},${remaining},${remaining === 0 ? 'Complete' : 'Active'}`;
                      }).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `installments-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }
                },
                { 
                  title: 'Export All Data', 
                  desc: 'Download complete fee reports', 
                  icon: <FileDown size={24} className="text-gray-600" />,
                  action: () => {
                    const allData = [
                      ['=== STUDENT BALANCES ==='],
                      ['Name', 'Class', 'Paid', 'Expected', 'Balance'],
                      ...studentBalances.map(s => [s.name, s.class, s.totalPaid, s.classFee, s.balance]),
                      [],
                      ['=== PAYMENTS ==='],
                      ['Student', 'Amount', 'Date', 'Method', 'Status'],
                      ...payments.map(p => [p.studentName, p.amount, p.date, p.method, p.status]),
                      [],
                      ['=== INSTALLMENTS ==='],
                      ['Student', 'Total', 'Paid', 'Balance', 'Status'],
                      ...installmentPlans.map(p => {
                        const student = students.find(s => s.id === p.studentId);
                        const paid = p.installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
                        return [student?.name || 'Unknown', p.totalAmount, paid, p.totalAmount - paid, p.totalAmount - paid === 0 ? 'Complete' : 'Active'];
                      }),
                    ];
                    const csv = allData.map(r => Array.isArray(r) ? r.join(',') : r).join('\n');
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `all-fee-data-${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                  }
                },
              ].map((report, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:bg-muted/30 cursor-pointer" onClick={report.action}>
                  <div className="flex items-center gap-3 mb-3">
                    {report.icon}
                    <h4 className="font-medium">{report.title}</h4>
                  </div>
                  <p className="text-sm text-foreground/60">{report.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
                <div>
                  <label className="block text-sm font-medium mb-1">Student Type</label>
                  <select value={feeForm.category} onChange={(e) => setFeeForm({ ...feeForm, category: e.target.value as any })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    <option value="day">Day Student</option>
                    <option value="boarding">Boarding</option>
                    <option value="international">International</option>
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
                      placeholder="+256..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <input type="text" value={paymentForm.description} onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  placeholder="e.g. Term 1 Tuition" className="w-full px-4 py-2 rounded-lg border border-border" />
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
              const classFee = feeStructure.find(f => f.class.startsWith(student?.class.split(' ')[0] || ''))?.total || 0;
              const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
              return student ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div><p className="text-sm text-foreground/60">Student</p><p className="font-semibold">{student.name}</p></div>
                    <div><p className="text-sm text-foreground/60">Class</p><p className="font-semibold">{student.class}</p></div>
                    <div><p className="text-sm text-foreground/60">Total Expected</p><p className="font-semibold">{formatUGX(classFee)}</p></div>
                    <div><p className="text-sm text-foreground/60">Balance</p><p className={`font-semibold ${classFee - totalPaid > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatUGX(Math.max(0, classFee - totalPaid))}
                    </p></div>
                  </div>
                  <h4 className="font-medium">Payment History</h4>
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left px-3 py-2 text-sm">Date</th>
                        <th className="text-right px-3 py-2 text-sm">Amount</th>
                        <th className="text-left px-3 py-2 text-sm">Method</th>
                        <th className="text-left px-3 py-2 text-sm">Description</th>
                        <th className="text-center px-3 py-2 text-sm">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {studentPayments.map((p, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{p.date}</td>
                          <td className="px-3 py-2 text-right">{formatUGX(p.amount)}</td>
                          <td className="px-3 py-2">{p.method}</td>
                          <td className="px-3 py-2">{p.description}</td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => generateReceipt(p)} className="p-1 rounded hover:bg-muted">
                              <Printer size={12} />
                            </button>
                          </td>
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

      {showInstallmentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Installment Plan</h2>
              <button onClick={() => setShowInstallmentModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select id="installment-student" className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Total Amount (UGX)</label>
                <input type="number" id="installment-total" placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Installments</label>
                <select id="installment-count" className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="2">2 Installments</option>
                  <option value="3">3 Installments</option>
                  <option value="4">4 Installments</option>
                </select>
              </div>
              <div id="installment-dates" className="space-y-2">
                {/* Dates will be generated dynamically */}
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowInstallmentModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button onClick={() => {
                  const studentSelect = document.getElementById('installment-student') as HTMLSelectElement;
                  const totalInput = document.getElementById('installment-total') as HTMLInputElement;
                  const countSelect = document.getElementById('installment-count') as HTMLSelectElement;
                  
                  const studentId = studentSelect?.value;
                  const total = parseInt(totalInput?.value || '0');
                  const count = parseInt(countSelect?.value || '2');
                  
                  if (!studentId || total === 0) { alert('Please select student and enter amount'); return; }
                  
                  const installmentAmount = Math.floor(total / count);
                  const lastAmount = total - (installmentAmount * (count - 1));
                  const installments: { dueDate: string; amount: number; status: 'pending' }[] = [];
                  
                  for (let i = 0; i < count; i++) {
                    const date = new Date();
                    date.setMonth(date.getMonth() + i * 2); // Every 2 months
                    installments.push({
                      dueDate: date.toISOString().split('T')[0],
                      amount: i === count - 1 ? lastAmount : installmentAmount,
                      status: 'pending' as const
                    });
                  }
                  
                  setInstallmentPlans(prev => [...prev, {
                    id: Date.now(),
                    studentId,
                    totalAmount: total,
                    installments,
                    createdAt: new Date().toISOString().split('T')[0]
                  }]);
                  setShowInstallmentModal(false);
                  alert('Installment plan created successfully!');
                }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  Create Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDiscountModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Discount</h2>
              <button onClick={() => setShowDiscountModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select id="discount-student" className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Discount Type</label>
                <select id="discount-type" className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="merit">Merit-based</option>
                  <option value="sibling">Sibling Discount</option>
                  <option value="financial_aid">Financial Aid</option>
                  <option value="sports">Sports Scholarship</option>
                  <option value="music">Music Scholarship</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Percentage (%)</label>
                <input type="number" id="discount-percentage" placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input type="text" id="discount-reason" placeholder="e.g., Excellent academics" className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowDiscountModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button onClick={() => {
                  const studentSelect = document.getElementById('discount-student') as HTMLSelectElement;
                  const typeSelect = document.getElementById('discount-type') as HTMLSelectElement;
                  const percentageInput = document.getElementById('discount-percentage') as HTMLInputElement;
                  const reasonInput = document.getElementById('discount-reason') as HTMLInputElement;
                  
                  const studentId = studentSelect?.value;
                  const type = typeSelect?.value as Discount['type'];
                  const percentage = parseInt(percentageInput?.value || '0');
                  const reason = reasonInput?.value;
                  
                  if (!studentId || percentage === 0) { alert('Please fill all required fields'); return; }
                  
                  const student = students.find(s => s.id === studentId);
                  const classFee = feeStructure.find(f => f.class.startsWith(student?.class.split(' ')[0] || ''))?.total || 0;
                  const amount = Math.floor(classFee * (percentage / 100));
                  
                  setDiscounts(prev => [...prev, {
                    id: Date.now(),
                    studentId,
                    type,
                    percentage,
                    amount,
                    reason: reason || type.replace('_', ' '),
                    approvedBy: 'Admin',
                    date: new Date().toISOString().split('T')[0]
                  }]);
                  setShowDiscountModal(false);
                  alert('Discount added successfully!');
                }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  Add Discount
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingReminder ? 'Edit Reminder' : 'Add Reminder'}
              </h2>
              <button onClick={() => setShowReminderModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Reminder Type</label>
                <select 
                  value={reminderForm.type} 
                  onChange={(e) => setReminderForm({ ...reminderForm, type: e.target.value as AutomatedReminder['type'] })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="before_due">Before Due Date</option>
                  <option value="on_due">On Due Date</option>
                  <option value="after_due">After Due Date</option>
                  <option value="custom">Custom Message</option>
                </select>
              </div>
              {reminderForm.type === 'before_due' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Days Before Due</label>
                  <input 
                    type="number" 
                    value={reminderForm.daysBeforeDue} 
                    onChange={(e) => setReminderForm({ ...reminderForm, daysBeforeDue: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-2 rounded-lg border border-border" 
                  />
                </div>
              )}
              {reminderForm.type === 'after_due' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Days After Due</label>
                  <input 
                    type="number" 
                    value={reminderForm.daysAfterDue} 
                    onChange={(e) => setReminderForm({ ...reminderForm, daysAfterDue: parseInt(e.target.value) || 3 })}
                    className="w-full px-4 py-2 rounded-lg border border-border" 
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Message (use {student} and {amount} as placeholders)</label>
                <textarea 
                  value={reminderForm.message} 
                  onChange={(e) => setReminderForm({ ...reminderForm, message: e.target.value })}
                  placeholder="Dear parent, fee payment for {student} is due in 3 days. Amount: {amount}."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Channels</label>
                <div className="flex gap-4">
                  {['sms', 'whatsapp', 'email'].map(channel => (
                    <label key={channel} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        checked={reminderForm.channels.includes(channel as any)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setReminderForm({ ...reminderForm, channels: [...reminderForm.channels, channel] as any });
                          } else {
                            setReminderForm({ ...reminderForm, channels: reminderForm.channels.filter(c => c !== channel) as any });
                          }
                        }}
                      />
                      <span className="text-sm capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowReminderModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button                   onClick={() => {
                  if (!reminderForm.message) { alert('Please enter a message'); return; }
                  if (editingReminder) {
                    setReminders(prev => prev.map(r => r.id === editingReminder.id ? { ...r, ...reminderForm } : r));
                  } else {
                    setReminders(prev => [...prev, { id: Date.now(), ...reminderForm, isActive: true }]);
                  }
                  setShowReminderModal(false);
                  alert(`Reminder ${editingReminder ? 'updated' : 'added'} successfully!`);
                }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Credit</h2>
              <button onClick={() => setShowCreditModal(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select id="credit-student" className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (UGX)</label>
                <input type="number" id="credit-amount" placeholder="0" className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select id="credit-type" className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="overpayment">Overpayment</option>
                  <option value="refund">Refund</option>
                  <option value="scholarship">Scholarship</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCreditModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button onClick={() => {
                  const studentSelect = document.getElementById('credit-student') as HTMLSelectElement;
                  const amountInput = document.getElementById('credit-amount') as HTMLInputElement;
                  const typeSelect = document.getElementById('credit-type') as HTMLSelectElement;
                  
                  const studentId = studentSelect?.value;
                  const amount = parseInt(amountInput?.value || '0');
                  const type = typeSelect?.value as Credit['type'];
                  
                  if (!studentId || amount === 0) { alert('Please fill all required fields'); return; }
                  
                  setCredits(prev => [...prev, {
                    id: Date.now(),
                    studentId,
                    amount,
                    type,
                    status: 'available' as const,
                    date: new Date().toISOString().split('T')[0]
                  }]);
                  setShowCreditModal(false);
                  alert('Credit added successfully!');
                }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  Add Credit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              const classFee = feeStructure.find(f => f.class.startsWith(student?.class.split(' ')[0] || ''))?.total || 0;
              const totalPaid = studentPayments.reduce((sum, p) => sum + p.amount, 0);
              return student ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                    <div><p className="text-sm text-foreground/60">Student</p><p className="font-semibold">{student.name}</p></div>
                    <div><p className="text-sm text-foreground/60">Class</p><p className="font-semibold">{student.class}</p></div>
                    <div><p className="text-sm text-foreground/60">Total Expected</p><p className="font-semibold">{formatUGX(classFee)}</p></div>
                    <div><p className="text-sm text-foreground/60">Balance</p><p className={`font-semibold ${classFee - totalPaid > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatUGX(Math.max(0, classFee - totalPaid))}
                    </p></div>
                  </div>
                  <h4 className="font-medium">Payment History</h4>
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left px-3 py-2 text-sm">Date</th>
                        <th className="text-right px-3 py-2 text-sm">Amount</th>
                        <th className="text-left px-3 py-2 text-sm">Method</th>
                        <th className="text-left px-3 py-2 text-sm">Description</th>
                        <th className="text-center px-3 py-2 text-sm">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {studentPayments.map((p, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2">{p.date}</td>
                          <td className="px-3 py-2 text-right">{formatUGX(p.amount)}</td>
                          <td className="px-3 py-2">{p.method}</td>
                          <td className="px-3 py-2">{p.description}</td>
                          <td className="px-3 py-2 text-center">
                            <button onClick={() => generateReceipt(p)} className="p-1 rounded hover:bg-muted">
                              <Printer size={12} />
                            </button>
                          </td>
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
    </div>
  );
}
