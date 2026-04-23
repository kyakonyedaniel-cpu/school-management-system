'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, Edit, Mail, Phone, Search, Plus as PlusIcon, Filter, Download, ChevronLeft, ChevronRight, Users as UsersIcon, Shield, MapPin, Trophy, DollarSign, Package, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';

const mockStudents = [
  { id: 1, name: 'John Okello', class: 'P.7', admissionNo: 'ST/2024/001', gender: 'Male', parent: 'Mr. Okello', phone: '0770XXX', fees: 'Paid', status: 'Active' },
  { id: 2, name: 'Sarah Nakato', class: 'S.1', admissionNo: 'ST/2024/002', gender: 'Female', parent: 'Mrs. Nakato', phone: '0772XXX', fees: 'Pending', status: 'Active' },
  { id: 3, name: 'David Ssebu', class: 'P.6', admissionNo: 'ST/2024/003', gender: 'Male', parent: 'Mr. Ssebu', phone: '0773XXX', fees: 'Overdue', status: 'Active' },
  { id: 4, name: 'Mary Namuli', class: 'S.2', admissionNo: 'ST/2024/004', gender: 'Female', parent: 'Mr. Namuli', phone: '0774XXX', fees: 'Paid', status: 'Active' },
  { id: 5, name: 'Peter Wasswa', class: 'P.5', admissionNo: 'ST/2024/005', gender: 'Male', parent: 'Mr. Wasswa', phone: '0775XXX', fees: 'Paid', status: 'Active' },
  { id: 6, name: 'Grace Atim', class: 'S.3', admissionNo: 'ST/2024/006', gender: 'Female', parent: 'Mrs. Atim', phone: '0776XXX', fees: 'Pending', status: 'Active' },
  { id: 7, name: 'James Mukasa', class: 'P.6', admissionNo: 'ST/2024/007', gender: 'Male', parent: 'Mr. Mukasa', phone: '0777XXX', fees: 'Paid', status: 'Active' },
  { id: 8, name: 'Faith Apio', class: 'S.1', admissionNo: 'ST/2024/008', gender: 'Female', parent: 'Mrs. Apio', phone: '0778XXX', fees: 'Paid', status: 'Active' },
];

const classes = ['All Classes', 'P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [currentPage, setCurrentPage] = useState(1);
  const [schoolName, setSchoolName] = useState('Your School');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getFeesColor = (fees: string) => {
    switch (fees) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-foreground bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <UsersIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">{schoolName}</span>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm mb-2">
          ← Full Dashboard
        </Link>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Dashboard</Link>
          <Link href="/dashboard/features" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Features</Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm">Students</Link>
          <Link href="/dashboard/fees" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Fees</Link>
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
            <Link href="/dashboard/library" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Library</Link>
            <Link href="/dashboard/timetable" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Timetable</Link>
            <Link href="/dashboard/discipline" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Discipline</Link>
            <Link href="/dashboard/health" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Health</Link>
            <Link href="/dashboard/transport" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Transport</Link>
            <Link href="/dashboard/sports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Sports</Link>
            <Link href="/dashboard/results" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Results</Link>
            <Link href="/dashboard/budget" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Budget</Link>
            <Link href="/dashboard/inventory" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Inventory</Link>
            <Link href="/dashboard/leave" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Leave</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Students</h1>
              <p className="text-sm text-foreground/60">{filteredStudents.length} total students</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
              <Plus size={18} />
              Add Student
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-border">
            <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Filter size={18} />
                More Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Download size={18} />
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Class</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Gender</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Parent</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Phone</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Fees</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-foreground/70">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-foreground/60">{student.admissionNo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{student.class}</td>
                      <td className="px-6 py-4 text-sm">{student.gender}</td>
                      <td className="px-6 py-4 text-sm">{student.parent}</td>
                      <td className="px-6 py-4 text-sm">{student.phone}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeesColor(student.fees)}`}>
                          {student.fees}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <Mail size={16} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <Phone size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-foreground/60">Showing {filteredStudents.length} of {mockStudents.length} students</p>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft size={18} />
                </button>
                <span className="px-3 py-1 bg-primary text-white text-sm rounded-lg">1</span>
                <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}