'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Clock, AlertTriangle, Search } from 'lucide-react';
import Link from 'next/link';

export default function ParentLibraryPage() {
  const [student, setStudent] = useState<any>(null);
  const [loans, setLoans] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);

  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    if (students.length > 0) setStudent(students[0]);
    const storedLoans = JSON.parse(localStorage.getItem('school_loans') || '[]');
    const storedBooks = JSON.parse(localStorage.getItem('school_books') || '[]');
    setLoans(storedLoans);
    setBooks(storedBooks);
  }, []);

  const studentLoans = loans.filter((l: any) => l.studentId === student?.id || l.studentName === student?.name);
  const activeLoans = studentLoans.filter((l: any) => l.status === 'active' || l.status === 'overdue');
  const returnedLoans = studentLoans.filter((l: any) => l.status === 'returned');
  const overdueLoans = activeLoans.filter((l: any) => l.status === 'overdue' || (l.status === 'active' && new Date(l.dueDate) < new Date()));

  return (
    <div className="space-y-6">
      <Link href="/parent" className="flex items-center gap-2 text-primary hover:underline">
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold">School Library</h1>

      {student && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {student.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <p className="text-foreground/60">{student.class} - {student.admissionNo}</p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Total Borrowed</p>
              <p className="text-2xl font-bold">{studentLoans.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Active</p>
              <p className="text-2xl font-bold text-blue-600">{activeLoans.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Returned</p>
              <p className="text-2xl font-bold text-green-600">{returnedLoans.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-foreground/60">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueLoans.length}</p>
            </div>
          </div>
        </div>
      )}

      {activeLoans.length > 0 && (
        <div className="bg-background rounded-xl border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Currently Borrowed</h2>
          </div>
          <div className="divide-y">
            {activeLoans.map((loan: any, i: number) => {
              const book = books.find((b: any) => b.id === loan.bookId);
              const overdue = loan.status === 'overdue' || (loan.status === 'active' && new Date(loan.dueDate) < new Date());
              return (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    {overdue ? <AlertTriangle size={20} className="text-red-600" /> : <BookOpen size={20} className="text-blue-600" />}
                    <div>
                      <p className="font-medium">{book?.title || loan.bookTitle}</p>
                      <p className="text-sm text-foreground/60">{book?.author || loan.bookId}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-foreground'}`}>
                      Due: {new Date(loan.dueDate).toLocaleDateString('en-UG')}
                    </p>
                    {overdue && <p className="text-xs text-red-600">OVERDUE</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-background rounded-xl border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Library History</h2>
        </div>
        {studentLoans.length > 0 ? (
          <div className="divide-y">
            {studentLoans.map((loan: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  {loan.status === 'returned' ? <CheckCircle size={18} className="text-green-600" /> :
                   loan.status === 'overdue' ? <AlertTriangle size={18} className="text-red-600" /> :
                   <Clock size={18} className="text-blue-600" />}
                  <div>
                    <p className="font-medium">{loan.bookTitle}</p>
                    <p className="text-sm text-foreground/60">Borrowed: {new Date(loan.loanDate).toLocaleDateString('en-UG')}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  loan.status === 'returned' ? 'bg-green-100 text-green-600' :
                  loan.status === 'overdue' ? 'bg-red-100 text-red-600' :
                  'bg-blue-100 text-blue-600'
                }`}>{loan.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-foreground/60">
            <BookOpen size={48} className="mx-auto mb-3 text-foreground/20" />
            <p>No library records found</p>
          </div>
        )}
      </div>
    </div>
  );
}
