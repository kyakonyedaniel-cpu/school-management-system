'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, ChevronLeft, ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';

const academicTerms = [
  { term: 1, name: 'Term I', startDate: 'Feb 2, 2026', endDate: 'Apr 24, 2026', status: 'Current', progress: 75 },
  { term: 2, name: 'Term II', startDate: 'May 4, 2026', endDate: 'Aug 7, 2026', status: 'Upcoming', progress: 0 },
  { term: 3, name: 'Term III', startDate: 'Sep 7, 2026', endDate: 'Nov 27, 2026', status: 'Upcoming', progress: 0 },
];

const importantDates = [
  { event: 'Mid-Term Exams', date: 'Mar 20 - Mar 27, 2026', type: 'Exam' },
  { event: 'Parent-Teacher Meeting', date: 'Mar 28, 2026', type: 'Event' },
  { event: 'End of Term Exams', date: 'Apr 14 - Apr 21, 2026', type: 'Exam' },
  { event: 'Term I Ends', date: 'Apr 24, 2026', type: 'Holiday' },
  { event: 'Holiday Begins', date: 'Apr 25, 2026', type: 'Holiday' },
];

export default function AcademicsPage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [currentTerm, setCurrentTerm] = useState(1);

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
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><CalendarIcon size={14} /> Academics</Link>
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
              <h1 className="text-xl font-bold text-foreground">Academic Terms</h1>
              <p className="text-sm text-foreground/60">Uganda 3-term academic year 2026</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add Term
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {academicTerms.map((term) => (
              <div key={term.term} className={`bg-white rounded-xl border-2 p-6 ${term.status === 'Current' ? 'border-primary' : 'border-border'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{term.name}</h3>
                    <p className="text-sm text-foreground/60">{term.startDate} - {term.endDate}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${term.status === 'Current' ? 'bg-primary text-white' : 'bg-muted text-foreground/60'}`}>
                    {term.status}
                  </span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{term.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: `${term.progress}%` }} />
                  </div>
                </div>
                {term.status === 'Current' && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-foreground/60">Weeks remaining: <span className="font-medium text-foreground">4</span></p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Important Academic Dates - Term I</h2>
            </div>
            <div className="divide-y divide-border">
              {importantDates.map((item, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.type === 'Exam' ? 'bg-red-500' : item.type === 'Holiday' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div>
                      <h3 className="font-medium">{item.event}</h3>
                      <p className="text-sm text-foreground/60">{item.date}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${item.type === 'Exam' ? 'bg-red-100 text-red-700' : item.type === 'Holiday' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}