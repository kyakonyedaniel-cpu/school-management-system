'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Heart, Users, Trophy, Plus, Edit, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Award, UsersRound } from 'lucide-react';

const houses = [
  { id: 1, name: 'Nile House', color: 'bg-blue-500', students: 85, points: 450, captain: 'David Ssebu' },
  { id: 2, name: 'Victoria House', color: 'bg-purple-500', students: 78, points: 420, captain: 'Sarah Nakato' },
  { id: 3, name: 'Albert House', color: 'bg-green-500', students: 72, points: 380, captain: 'John Okello' },
  { id: 4, name: 'Baker House', color: 'bg-red-500', students: 65, points: 350, captain: 'Mary Namuli' },
];

export default function HousesPage() {
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
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><BookOpen size={14} /> Curriculum</Link>
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Reports</Link>
            <Link href="/dashboard/staff" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Staff</Link>
            <Link href="/dashboard/houses" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><Heart size={14} /> Houses</Link>
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Award size={14} /> Admissions</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">House System</h1>
              <p className="text-sm text-foreground/60">Traditional houses & inter-house competitions</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add House
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {houses.sort((a, b) => b.points - a.points).map((house, index) => (
              <div key={house.id} className="bg-white rounded-xl border-2 overflow-hidden">
                <div className={`${house.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{house.name}</h3>
                    {index === 0 && <Trophy className="w-6 h-6" />}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold">{house.students}</p>
                      <p className="text-xs text-foreground/60">Students</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{house.points}</p>
                      <p className="text-xs text-foreground/60">Points</p>
                    </div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs text-foreground/60">House Captain</p>
                    <p className="font-medium">{house.captain}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Inter-House Competitions</h2>
            </div>
            <div className="divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Athletics Meet 2026</h3>
                  <p className="text-sm text-foreground/60">April 15, 2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-blue-500">Nile House</p>
                    <p className="text-xs">Winner</p>
                  </div>
                  <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Football Tournament</h3>
                  <p className="text-sm text-foreground/60">Term II, 2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-green-500">Victoria House</p>
                    <p className="text-xs">Winner</p>
                  </div>
                  <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Debate Competition</h3>
                  <p className="text-sm text-foreground/60">Term I, 2026</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="font-bold text-purple-500">Albert House</p>
                    <p className="text-xs">Winner</p>
                  </div>
                  <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}