'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, MapPin } from 'lucide-react';

const routes = [
  { id: 1, name: 'Route A - Ntinda', vehicle: 'UBM 123R', driver: 'Mr. Kato', students: 25, pickup: '6:30 AM', dropoff: '3:00 PM', status: 'Active' },
  { id: 2, name: 'Route B - Kampala', vehicle: 'UBM 456R', driver: 'Mr. Ssebu', students: 30, pickup: '6:00 AM', dropoff: '3:30 PM', status: 'Active' },
  { id: 3, name: 'Route C - Kira', vehicle: 'UBM 789R', driver: 'Mr. Muwonge', students: 20, pickup: '6:45 AM', dropoff: '3:15 PM', status: 'Active' },
];

export default function TransportPage() {
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
            <Link href="/dashboard/transport" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><MapPin size={14} /> Transport</Link>
            <Link href="/dashboard/sports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CheckCircle size={14} /> Sports</Link>
            <Link href="/dashboard/health" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Health</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Transport Management</h1>
              <p className="text-sm text-foreground/60">Bus routes, drivers & pickup points</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add Route
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><MapPin className="w-6 h-6 text-blue-600" /></div>
                <div><h3 className="text-2xl font-bold">3</h3><p className="text-sm text-foreground/60">Active Routes</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
                <div><h3 className="text-2xl font-bold">75</h3><p className="text-sm text-foreground/60">Day Students</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><MapPin className="w-6 h-6 text-yellow-600" /></div>
                <div><h3 className="text-2xl font-bold">3</h3><p className="text-sm text-foreground/60">Buses</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
                <div><h3 className="text-2xl font-bold">3</h3><p className="text-sm text-foreground/60">Drivers</p></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Bus Routes & Schedules</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Route</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Vehicle</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Driver</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Students</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Pickup</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Dropoff</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((route) => (
                    <tr key={route.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{route.name}</td>
                      <td className="px-4 py-3 font-mono text-sm">{route.vehicle}</td>
                      <td className="px-4 py-3 text-sm">{route.driver}</td>
                      <td className="px-4 py-3 text-sm">{route.students}</td>
                      <td className="px-4 py-3 text-sm">{route.pickup}</td>
                      <td className="px-4 py-3 text-sm">{route.dropoff}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 font-medium">
                          {route.status}
                        </span>
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