'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Users, Search, Plus, Download, Edit, Award, FileText, Calendar as CalendarIcon, Calendar, CheckCircle, XCircle, BookOpen, Bed, Heart, UsersRound } from 'lucide-react';

const applications = [
  { id: 1, name: 'Emma Nabisere', class: 'P.1', gender: 'Female', parent: 'Mr. Nabisere', date: 'Apr 15, 2026', status: 'Pending' },
  { id: 2, name: 'Joshua Mulinde', class: 'P.1', gender: 'Male', parent: 'Mrs. Mulinde', date: 'Apr 12, 2026', status: 'Approved' },
  { id: 3, name: 'Sarah Akuruti', class: 'S.1', gender: 'Female', parent: 'Mr. Akuruti', date: 'Apr 10, 2026', status: 'Pending' },
  { id: 4, name: 'Samuel Kigozi', class: 'P.4', gender: 'Male', parent: 'Mrs. Kigozi', date: 'Apr 8, 2026', status: 'Rejected' },
];

export default function AdmissionsPage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  const generateAdmNo = (name: string) => {
    const year = 2026;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `ST/${year}/${initials}`;
  };

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
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 py-1 text-xs font-medium text-foreground/40">African Features</p>
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><BookOpen size={14} /> Curriculum</Link>
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Reports</Link>
            <Link href="/dashboard/staff" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Staff</Link>
            <Link href="/dashboard/houses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Heart size={14} /> Houses</Link>
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><UsersRound size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><Award size={14} /> Admissions</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Admissions</h1>
              <p className="text-sm text-foreground/60">Student enrollment & admission numbers</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> New Application
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Award className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">12</h3>
                  <p className="text-sm text-foreground/60">Applications</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-yellow-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">5</h3>
                  <p className="text-sm text-foreground/60">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">6</h3>
                  <p className="text-sm text-foreground/60">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
                <div>
                  <h3 className="text-2xl font-bold">300</h3>
                  <p className="text-sm text-foreground/60">Total Students</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold">Recent Applications</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                  <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border border-border w-64" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted"><Download size={18} /> Export</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Admission No.</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Gender</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Parent</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-t border-border">
                      <td className="px-4 py-3 font-mono text-sm">{generateAdmNo(app.name)}</td>
                      <td className="px-4 py-3 font-medium">{app.name}</td>
                      <td className="px-4 py-3 text-sm">{app.class}</td>
                      <td className="px-4 py-3 text-sm">{app.gender}</td>
                      <td className="px-4 py-3 text-sm">{app.parent}</td>
                      <td className="px-4 py-3 text-sm">{app.date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                          {app.status === 'Approved' ? <CheckCircle size={12} /> : app.status === 'Rejected' ? <XCircle size={12} /> : null}
                          {app.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}