'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Users, Calendar, DollarSign, Plus, Phone, Mail, UsersRound, BookOpen, FileText, Bed, Calendar as CalendarIcon, CheckCircle, Heart, Award } from 'lucide-react';

const ptaMembers = [
  { id: 1, name: 'Mr. James Okello', role: 'Chairman', child: 'John Okello P.7', phone: '0770XXX', email: 'james@gmail.com' },
  { id: 2, name: 'Mrs. Grace Namutowe', role: 'Secretary', child: 'Sarah Nakato S.1', phone: '0772XXX', email: 'grace@gmail.com' },
  { id: 3, name: 'Mr. David Kigozi', role: 'Treasurer', child: 'David Ssebu P.6', phone: '0773XXX', email: 'david@gmail.com' },
];

const meetings = [
  { id: 1, title: 'Term I PTA Meeting', date: 'Mar 28, 2026', venue: 'School Hall', attendance: 85, contributions: 2500000 },
  { id: 2, title: 'End of Term Meeting', date: 'Apr 25, 2026', venue: 'School Hall', attendance: 0, contributions: 0 },
];

export default function ParentsPage() {
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
            <Link href="/dashboard/houses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Heart size={14} /> Houses</Link>
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><UsersRound size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Award size={14} /> Admissions</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">PTA & Community</h1>
              <p className="text-sm text-foreground/60">Parent-Teacher meetings & contributions</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Schedule Meeting
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">300</h3>
                  <p className="text-sm text-foreground/60">Registered Parents</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">4</h3>
                  <p className="text-sm text-foreground/60">Meetings This Year</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><DollarSign className="w-6 h-6 text-yellow-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">UGX 5.2M</h3>
                  <p className="text-sm text-foreground/60">Total Contributions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">PTA Executive Committee</h2>
                <button className="text-sm text-primary hover:underline">View All Parents</button>
              </div>
              <div className="divide-y divide-border">
                {ptaMembers.map((member) => (
                  <div key={member.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-foreground/60">{member.role} • Parent of {member.child}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-muted rounded"><Phone size={16} /></button>
                      <button className="p-1.5 hover:bg-muted rounded"><Mail size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Upcoming Meetings</h2>
                <button className="text-sm text-primary hover:underline">Schedule New</button>
              </div>
              <div className="divide-y divide-border">
                {meetings.map((meeting) => (
                  <div key={meeting.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-foreground/60">{meeting.venue}</p>
                      </div>
                      <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded">{meeting.date}</span>
                    </div>
                    {meeting.attendance > 0 && (
                      <div className="flex items-center gap-4 mt-2 text-sm text-foreground/60">
                        <span>{meeting.attendance} parents attended</span>
                        <span>•</span>
                        <span>UGX {meeting.contributions.toLocaleString()} raised</span>
                      </div>
                    )}
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