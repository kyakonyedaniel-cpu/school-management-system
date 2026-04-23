'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Edit, Trash2 } from 'lucide-react';

const curriculumData = {
  primary: [
    { level: 'P.1', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Art & Craft', 'Music', 'Hygiene'] },
    { level: 'P.2', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Art & Craft', 'Music', 'Science'] },
    { level: 'P.3', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies'] },
    { level: 'P.4', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies'] },
    { level: 'P.5', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies', 'Agriculture'] },
    { level: 'P.6', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies', 'Agriculture'] },
    { level: 'P.7', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Religious Education', 'Physical Education', 'Agriculture', 'Technology'] },
  ],
  secondary: [
    { level: 'S.1', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'Christian Religious Studies', 'Computer'] },
    { level: 'S.2', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer'] },
    { level: 'S.3', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer', 'Elective Mathematics'] },
    { level: 'S.4', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer'] },
    { level: 'S.5', subjects: ['English', 'Literature', 'Mathematics', 'Economics', 'Geography', 'History', 'Christian Religious Studies', 'Entrepreneurship'] },
    { level: 'S.6', subjects: ['English', 'Literature', 'Advanced Mathematics', 'Economics', 'Geography', 'History', 'Christian Religious Studies', 'Entrepreneurship'] },
  ],
};

export default function CurriculumPage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

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
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><BookOpen size={14} /> Curriculum</Link>
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
          <h1 className="text-xl font-bold text-foreground">Curriculum Management</h1>
          <p className="text-sm text-foreground/60">UNEB-aligned curriculum for P.1 to S.6</p>
        </header>

        <main className="flex-1 p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Primary Section (P.1 - P.7)</h2>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                  <Plus size={16} /> Add Subject
                </button>
              </div>
              <div className="p-4">
                {curriculumData.primary.map((pclass) => (
                  <div key={pclass.level} className="mb-4">
                    <h3 className="font-medium mb-2">{pclass.level}</h3>
                    <div className="flex flex-wrap gap-2">
                      {pclass.subjects.map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{subject}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Secondary Section (S.1 - S.6)</h2>
                <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                  <Plus size={16} /> Add Subject
                </button>
              </div>
              <div className="p-4">
                {curriculumData.secondary.map((sclass) => (
                  <div key={sclass.level} className="mb-4">
                    <h3 className="font-medium mb-2">{sclass.level}</h3>
                    <div className="flex flex-wrap gap-2">
                      {sclass.subjects.map((subject) => (
                        <span key={subject} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{subject}</span>
                      ))}
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