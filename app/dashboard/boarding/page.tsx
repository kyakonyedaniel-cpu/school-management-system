'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Edit, Home, Utensils, Bed } from 'lucide-react';

const boardingStudents = [
  { id: 1, name: 'John Okello', class: 'S.2', dorm: 'Nile House', room: 'Room 12', status: 'Active', meals: 3 },
  { id: 2, name: 'Sarah Nakato', class: 'S.3', dorm: 'Victoria House', room: 'Room 8', status: 'Active', meals: 3 },
  { id: 3, name: 'David Ssebu', class: 'S.1', dorm: 'Albert House', room: 'Room 5', status: 'Active', meals: 3 },
  { id: 4, name: 'Mary Namuli', class: 'S.4', dorm: 'Victoria House', room: 'Room 15', status: 'Active', meals: 3 },
  { id: 5, name: 'Peter Wasswa', class: 'P.7', dorm: 'Baker House', room: 'Room 3', status: 'Active', meals: 3 },
];

const dormitories = [
  { name: 'Nile House', capacity: 40, occupied: 35, gender: 'Boys' },
  { name: 'Albert House', capacity: 35, occupied: 28, gender: 'Boys' },
  { name: 'Baker House', capacity: 30, occupied: 25, gender: 'Boys' },
  { name: 'Victoria House', capacity: 45, occupied: 40, gender: 'Girls' },
];

export default function BoardingPage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [filterType, setFilterType] = useState('All');

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
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CalendarIcon size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><Bed size={14} /> Boarding</Link>
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
              <h1 className="text-xl font-bold text-foreground">Boarding Management</h1>
              <p className="text-sm text-foreground/60">Dormitory allocation & meal tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                <Plus size={18} /> Add Boarder
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-orange-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">{boardingStudents.length}</h3>
                  <p className="text-sm text-foreground/60">Total Boarders</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Bed className="w-6 h-6 text-blue-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">{dormitories.reduce((acc, d) => acc + d.occupied, 0)}</h3>
                  <p className="text-sm text-foreground/60">Dorm Spaces Used</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Utensils className="w-6 h-6 text-green-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">3</h3>
                  <p className="text-sm text-foreground/60">Meals/Day</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Home className="w-6 h-6 text-red-600" /></div>
                <div>
                  <h3 className="text-2xl font-bold">{dormitories.length}</h3>
                  <p className="text-sm text-foreground/60">Dormitories</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Boarding Students</h2>
                <div className="flex items-center gap-2">
                  <select className="px-3 py-1.5 text-sm border border-border rounded-lg">
                    <option>All Classes</option>
                    <option>P.5 - P.7</option>
                    <option>S.1 - S.4</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Dormitory</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Room</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boardingStudents.map((student) => (
                      <tr key={student.id} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3 text-sm">{student.class}</td>
                        <td className="px-4 py-3 text-sm">{student.dorm}</td>
                        <td className="px-4 py-3 text-sm">{student.room}</td>
                        <td className="px-4 py-3">
                          <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Dormitory Occupancy</h2>
              </div>
              <div className="p-4 space-y-4">
                {dormitories.map((dorm) => (
                  <div key={dorm.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{dorm.name} ({dorm.gender})</span>
                      <span>{dorm.occupied}/{dorm.capacity}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full">
                      <div className="h-3 bg-primary rounded-full" style={{ width: `${(dorm.occupied / dorm.capacity) * 100}%` }} />
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