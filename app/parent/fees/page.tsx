'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, DollarSign, CheckCircle, Clock, AlertCircle, Download, Printer } from 'lucide-react';
import Link from 'next/link';

export default function ParentFeesPage() {
  const [student, setStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    if (students.length > 0) setStudent(students[0]);
    const stored = JSON.parse(localStorage.getItem('school_payments') || '[]');
    setPayments(stored);
  }, []);

  const studentPayments = payments.filter((p: any) => p.studentId === student?.id);
  const totalPaid = studentPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
  const totalFees = 920000;
  const balance = Math.max(0, totalFees - totalPaid);

  return (
    <div className="space-y-6">
      <Link href="/parent" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold">School Fees</h1>

      {student && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {student.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-foreground/60">{student.class} - {student.admissionNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Total Fees</p>
              <p className="text-xl font-bold">UGX {totalFees.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Paid</p>
              <p className="text-xl font-bold text-green-600">UGX {totalPaid.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Balance</p>
              <p className="text-xl font-bold text-red-600">UGX {balance.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-3 bg-white rounded-full overflow-hidden">
              <div className="h-3 bg-green-600 rounded-full transition-all" style={{ width: `${(totalPaid / totalFees) * 100}%` }} />
            </div>
            <p className="text-sm text-right mt-1 text-foreground/60">{((totalPaid / totalFees) * 100).toFixed(0)}% paid</p>
          </div>
        </div>
      )}

      <div className="bg-background rounded-xl border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Payment History</h2>
          <div className="flex gap-2">
            <button onClick={() => {
              const csv = 'Date,Amount,Method,Status\n' + studentPayments.map((p: any) => `${p.date},${p.amount},${p.method},${p.status}`).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'payment_history.csv';
              a.click();
            }} className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-muted"><Download size={14} /> Export</button>
          </div>
        </div>
        <div className="divide-y">
          {studentPayments.length > 0 ? studentPayments.map((p: any, i: number) => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30">
              <div className="flex items-center gap-3">
                {p.status === 'completed' || p.status === 'Paid' ? <CheckCircle size={20} className="text-green-600" /> :
                 p.status === 'Pending' ? <Clock size={20} className="text-yellow-600" /> :
                 <AlertCircle size={20} className="text-red-600" />}
                <div>
                  <p className="font-medium">UGX {(p.amount || 0).toLocaleString()}</p>
                  <p className="text-sm text-foreground/60">{p.date} - {p.method || 'Mobile Money'}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'Paid' || p.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                {p.status}
              </span>
            </div>
          )) : (
            <p className="p-8 text-center text-foreground/60">No payments recorded yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
