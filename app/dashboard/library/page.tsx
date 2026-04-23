'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Search, Edit, Book, ArrowRight } from 'lucide-react';

const books = [
  { id: 1, title: 'Primary English P.7', author: 'NCDC', class: 'P.7', copies: 45, available: 38, shelf: 'A-1' },
  { id: 2, title: 'Mathematics for Uganda P.4', author: 'MECS', class: 'P.4', copies: 30, available: 25, shelf: 'A-2' },
  { id: 3, title: 'Science & Technology P.6', author: 'NCDC', class: 'P.6', copies: 28, available: 20, shelf: 'B-1' },
  { id: 4, title: 'Social Studies S.1', author: 'MECS', class: 'S.1', copies: 35, available: 30, shelf: 'B-2' },
];

const recentLoans = [
  { id: 1, student: 'John Okello', class: 'P.7', book: 'English P.7', date: 'Apr 18, 2026', due: 'May 2, 2026', status: 'Active' },
  { id: 2, student: 'Sarah Nakato', class: 'S.1', book: 'History S.1', date: 'Apr 15, 2026', due: 'Apr 29, 2026', status: 'Overdue' },
  { id: 3, student: 'David Ssebu', class: 'P.6', book: 'Science P.6', date: 'Apr 10, 2026', due: 'Apr 24, 2026', status: 'Returned' },
];

export default function LibraryPage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [searchTerm, setSearchTerm] = useState('');

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
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><UsersRound size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Award size={14} /> Admissions</Link>
            <Link href="/dashboard/library" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><Book size={14} /> Library</Link>
            <Link href="/dashboard/timetable" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Calendar size={14} /> Timetable</Link>
            <Link href="/dashboard/discipline" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Discipline</Link>
            <Link href="/dashboard/health" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CheckCircle size={14} /> Health</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Library Management</h1>
              <p className="text-sm text-foreground/60">Book catalog, issue & return tracking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
                <input type="text" placeholder="Search books..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border border-border w-64" />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
                <Plus size={18} /> Add Book
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><BookOpen className="w-6 h-6 text-blue-600" /></div>
                <div><h3 className="text-2xl font-bold">450</h3><p className="text-sm text-foreground/60">Total Books</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Book className="w-6 h-6 text-green-600" /></div>
                <div><h3 className="text-2xl font-bold">380</h3><p className="text-sm text-foreground/60">Available</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><ArrowRight className="w-6 h-6 text-yellow-600" /></div>
                <div><h3 className="text-2xl font-bold">42</h3><p className="text-sm text-foreground/60">On Loan</p></div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Book className="w-6 h-6 text-red-600" /></div>
                <div><h3 className="text-2xl font-bold">5</h3><p className="text-sm text-foreground/60">Overdue</p></div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Book Catalog</h2>
                <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Title</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Available</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Shelf</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id} className="border-t border-border">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{book.title}</p>
                            <p className="text-xs text-foreground/60">{book.author}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{book.class}</td>
                        <td className="px-4 py-3 text-sm">{book.available}/{book.copies}</td>
                        <td className="px-4 py-3 font-mono text-sm">{book.shelf}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border">
                <h2 className="font-semibold">Recent Loans</h2>
              </div>
              <div className="divide-y divide-border">
                {recentLoans.map((loan) => (
                  <div key={loan.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{loan.student}</p>
                      <p className="text-sm text-foreground/60">{loan.book} • Due {loan.due}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${loan.status === 'Returned' ? 'bg-green-100 text-green-700' : loan.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {loan.status}
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