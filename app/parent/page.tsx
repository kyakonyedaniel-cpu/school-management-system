'use client';

import { SessionProvider } from 'next-auth/react';
import { useState, useEffect, ReactNode } from 'react';
import { Users, DollarSign, Calendar, BookOpen, FileText, AlertTriangle, GraduationCap } from 'lucide-react';
import Link from 'next/link';

function ParentContent() {
  const [session, setSession] = useState<any>(null);
  const [status, setStatus] = useState<string>('loading');
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    import('next-auth/react').then(({ useSession }) => {
      const { data } = useSession() as any;
      setSession(data);
      setStatus('authenticated');
    });
    
    const students = JSON.parse(localStorage.getItem('school_students') || '[]');
    if (students.length > 0) {
      setStudentData(students[0]);
    }
  }, []);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, Parent</h1>
        <p className="text-foreground/60">View your child&apos;s progress</p>
      </div>

      {studentData && (
        <div className="bg-primary/10 rounded-xl p-6 border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
              {studentData.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-xl font-bold">{studentData.name}</h2>
              <p className="text-foreground/60">Class: {studentData.class} | Admission: {studentData.admissionNo}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/parent/fees" className="bg-background rounded-xl p-6 border hover:border-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold">School Fees</h3>
              <p className="text-sm text-foreground/60">View & pay fees</p>
            </div>
          </div>
        </Link>

        <Link href="/parent/attendance" className="bg-background rounded-xl p-6 border hover:border-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold">Attendance</h3>
              <p className="text-sm text-foreground/60">Track attendance</p>
            </div>
          </div>
        </Link>

        <Link href="/parent/results" className="bg-background rounded-xl p-6 border hover:border-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold">Results</h3>
              <p className="text-sm text-foreground/60">View exam results</p>
            </div>
          </div>
        </Link>

        <Link href="/parent/library" className="bg-background rounded-xl p-6 border hover:border-primary transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold">Library</h3>
              <p className="text-sm text-foreground/60">Borrowed books</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-xl border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Recent Results</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Mid-Term Exams</p>
                  <p className="text-sm text-foreground/60">English, Math, Science</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">78%</p>
                  <p className="text-xs text-foreground/60">Grade B</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">CA2 - Mathematics</p>
                  <p className="text-sm text-foreground/60">Class Test</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">85%</p>
                  <p className="text-xs text-foreground/60">Grade A</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl border">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Fee Summary</h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-foreground/60">Total Fees</span>
                <span className="font-bold">UGX 920,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Paid</span>
                <span className="font-bold text-green-600">UGX 600,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Balance</span>
                <span className="font-bold text-red-600">UGX 320,000</span>
              </div>
              <div className="h-2 bg-muted rounded-full mt-3">
                <div className="h-2 bg-primary rounded-full" style={{ width: '65%' }} />
              </div>
              <button className="w-full mt-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Pay Balance Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ParentDashboard() {
  return <ParentContent />;
}