'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Clock, AlertCircle, Edit, Download } from 'lucide-react';

const upcomingExams = [
  { id: 1, name: 'UNEBPLE Mock Exam', class: 'P.7', date: 'May 5, 2026', duration: '2 hours', status: 'Upcoming' },
  { id: 2, name: 'UCE Mid-Term', class: 'S.2', date: 'May 10, 2026', duration: '3 hours', status: 'Upcoming' },
  { id: 3, name: 'CA2 - Mathematics', class: 'P.5', date: 'Apr 25, 2026', duration: '1 hour', status: 'Due Soon' },
  { id: 4, name: 'Physics Quiz', class: 'S.4', date: 'Apr 23, 2026', duration: '30 mins', status: 'Due Soon' },
];

const pastExams = [
  { id: 1, name: 'CA1 - English', class: 'P.6', date: 'Apr 10, 2026', avgScore: 72 },
  { id: 2, name: 'Mathematics Test', class: 'S.1', date: 'Apr 8, 2026', avgScore: 65 },
  { id: 3, name: 'Science Quiz', class: 'P.4', date: 'Apr 5, 2026', avgScore: 78 },
];

export default function ExamsPage() {
  const [schoolName, setSchoolName] = useState('Your School');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

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
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><FileText size={14} /> Exams</Link>
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
              <h1 className="text-xl font-bold text-foreground">Exam Management</h1>
              <p className="text-sm text-foreground/60">UNEBPLE, UCE & UACE preparation</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                <Plus size={18} /> Create Exam
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Clock className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">{upcomingExams.length}</h3>
                  <p className="text-sm text-foreground/60">Upcoming Exams</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">24</h3>
                  <p className="text-sm text-foreground/60">Completed This Term</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><AlertCircle className="w-6 h-6 text-yellow-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">2</h3>
                  <p className="text-sm text-foreground/60">Due This Week</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Upcoming Examinations</h2>
              </div>
              <div className="divide-y divide-border">
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{exam.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-foreground/60 mt-1">
                        <span>{exam.class}</span>
                        <span>•</span>
                        <span>{exam.date}</span>
                        <span>•</span>
                        <span>{exam.duration}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${exam.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                        {exam.status}
                      </span>
                      <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Past Examination Results</h2>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="divide-y divide-border">
                {pastExams.map((exam) => (
                  <div key={exam.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{exam.name}</h3>
                      <p className="text-sm text-foreground/60 mt-1">{exam.class} • {exam.date}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${exam.avgScore >= 70 ? 'text-green-600' : exam.avgScore >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {exam.avgScore}%
                      </span>
                      <p className="text-xs text-foreground/60">Avg Score</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}