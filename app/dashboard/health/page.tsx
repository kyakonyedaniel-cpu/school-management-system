'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Heart as HealthIcon } from 'lucide-react';

const healthRecords = [
  { id: 1, student: 'John Okello', class: 'P.7', condition: 'Asthma', medication: 'Inhaler', allergies: 'Dust', lastCheckup: 'Mar 2026', notes: 'Regular checkups required' },
  { id: 2, student: 'Sarah Nakato', class: 'S.1', condition: 'None', medication: 'None', allergies: 'Peanuts', lastCheckup: 'Jan 2026', notes: 'Avoid all nut products' },
  { id: 3, student: 'David Ssebu', class: 'P.6', condition: 'Sickle Cell', medication: 'Folic Acid', allergies: 'None', lastCheckup: 'Feb 2026', notes: 'Stay hydrated' },
];

export default function HealthPage() {
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
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 py-1 text-xs font-medium text-foreground/40">African Features</p>
            <Link href="/dashboard/health" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><HealthIcon size={14} /> Health</Link>
            <Link href="/dashboard/transport" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Transport</Link>
            <Link href="/dashboard/discipline" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Discipline</Link>
            <Link href="/dashboard/inventory" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CheckCircle size={14} /> Inventory</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Health Records</h1>
              <p className="text-sm text-foreground/60">Medical forms, allergies & immunizations</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add Health Record
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-blue-600" /></div>
                <div><h3 className="text-2xl font-bold">300</h3><p className="text-sm text-foreground/60">Total Students</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-yellow-600" /></div>
                <div><h3 className="text-2xl font-bold">8</h3><p className="text-sm text-foreground/60">With Conditions</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-red-600" /></div>
                <div><h3 className="text-2xl font-bold">15</h3><p className="text-sm text-foreground/60">With Allergies</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
                <div><h3 className="text-2xl font-bold">95%</h3><p className="text-sm text-foreground/60">Immunized</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Student Health Records</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Medical Condition</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Medication</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Allergies</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Last Checkup</th>
                  </tr>
                </thead>
                <tbody>
                  {healthRecords.map((record) => (
                    <tr key={record.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{record.student}</td>
                      <td className="px-4 py-3 text-sm">{record.class}</td>
                      <td className="px-4 py-3 text-sm">{record.condition}</td>
                      <td className="px-4 py-3 text-sm">{record.medication}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${record.allergies === 'None' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {record.allergies}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">{record.lastCheckup}</td>
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