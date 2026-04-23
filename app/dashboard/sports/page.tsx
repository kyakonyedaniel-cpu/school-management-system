'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, Trophy, Users, Plus, Calendar } from 'lucide-react';

const teams = [
  { id: 1, name: 'Football - Senior', coach: 'Mr. Kato', members: 18, wins: 5, losses: 2, status: 'Active' },
  { id: 2, name: 'Football - Junior', coach: 'Mr. Ssebu', members: 15, wins: 4, losses: 1, status: 'Active' },
  { id: 3, name: 'Netball', coach: 'Ms. Nakanwagi', members: 12, wins: 6, losses: 0, status: 'Active' },
  { id: 4, name: 'Volleyball', coach: 'Mr. Muwonge', members: 10, wins: 3, losses: 3, status: 'Active' },
];

const competitions = [
  { id: 1, name: 'East African Games 2026', date: 'Jul 15-25, 2026', participants: 12, status: 'Upcoming' },
  { id: 2, name: 'National Schools Cup', date: 'May 20, 2026', participants: 8, status: 'Preparing' },
  { id: 3, name: 'District Athletics', date: 'Apr 30, 2026', participants: 15, status: 'Completed' },
];

export default function SportsPage() {
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
            <Link href="/dashboard/sports" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><Trophy size={14} /> Sports</Link>
            <Link href="/dashboard/library" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Library</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Sports & Games</h1>
              <p className="text-sm text-foreground/60">Team management & competitions</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add Team
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-blue-600" /></div>
                <div><h3 className="text-2xl font-bold">4</h3><p className="text-sm text-foreground/60">Active Teams</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
                <div><h3 className="text-2xl font-bold">55</h3><p className="text-sm text-foreground/60">Total Athletes</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-yellow-600" /></div>
                <div><h3 className="text-2xl font-bold">18</h3><p className="text-sm text-foreground/60">Wins This Season</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-primary" /></div>
                <div><h3 className="text-2xl font-bold">3</h3><p className="text-sm text-foreground/60">Upcoming Events</p></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border"><h2 className="font-semibold">School Teams</h2></div>
              <div className="divide-y divide-border">
                {teams.map((team) => (
                  <div key={team.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-foreground/60">Coach: {team.coach} • {team.members} members</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{team.wins}W - {team.losses}L</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border"><h2 className="font-semibold">Upcoming Competitions</h2></div>
              <div className="divide-y divide-border">
                {competitions.map((comp) => (
                  <div key={comp.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{comp.name}</p>
                      <p className="text-sm text-foreground/60">{comp.date}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${comp.status === 'Completed' ? 'bg-green-100 text-green-700' : comp.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {comp.status}
                    </span>
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