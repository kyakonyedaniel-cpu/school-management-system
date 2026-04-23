'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, Award, Users, UsersRound, Baby, GraduationCap, Heart, Bed, Calendar as CalendarIcon, FileText, CheckCircle } from 'lucide-react';

const africanFeatures = [
  {
    id: 1,
    title: 'Ugandan Curriculum',
    description: 'Aligned with UNEB, UACE & NCAA requirements. Track all subjects across P.1 - S.6 levels.',
    icon: BookOpen,
    color: 'bg-green-100 text-green-600',
    link: '/dashboard/curriculum',
  },
  {
    id: 2,
    title: 'Exam Management',
    description: 'UNEBPLE, UCE & UACE preparation tracking, mock exams, and online practice.',
    icon: Award,
    color: 'bg-blue-100 text-blue-600',
    link: '/dashboard/exams',
  },
  {
    id: 3,
    title: 'Term & Semester',
    description: 'Uganda\'s 3-term academic year with automatic promotion tracking.',
    icon: GraduationCap,
    color: 'bg-purple-100 text-purple-600',
    link: '/dashboard/academics',
  },
  {
    id: 4,
    title: 'House System',
    description: 'Traditional houses, inter-house sports, and school competitions.',
    icon: Heart,
    color: 'bg-red-100 text-red-600',
    link: '/dashboard/houses',
  },
  {
    id: 5,
    title: 'Mobile Money',
    description: 'MTN, Airtel & Vodafone payments. Bank transfers accepted.',
    icon: Users,
    color: 'bg-yellow-100 text-yellow-600',
    link: '/dashboard/fees',
  },
  {
    id: 6,
    title: 'SMS & WhatsApp',
    description: 'Bulk SMS alerts for parents. WhatsApp groups & status updates.',
    icon: UsersRound,
    color: 'bg-green-100 text-green-600',
    link: '/dashboard/parents',
  },
  {
    id: 7,
    title: 'Boarding & Day',
    description: 'Track boarding students, dormitory allocation & meal management.',
    icon: Baby,
    color: 'bg-orange-100 text-orange-600',
    link: '/dashboard/boarding',
  },
  {
    id: 8,
    title: 'Ugandan Reports',
    description: 'Continuous assessment, exams & character grading per Ugandan standards.',
    icon: BookOpen,
    color: 'bg-indigo-100 text-indigo-600',
    link: '/dashboard/reports',
  },
  {
    id: 9,
    title: 'PTA & Community',
    description: 'Parent-Teacher meetings, contributions tracking & transparency.',
    icon: UsersRound,
    color: 'bg-teal-100 text-teal-600',
    link: '/dashboard/parents',
  },
  {
    id: 10,
    title: 'Staff Payroll',
    description: 'Salary computation with taxes, NSSF & allowances.',
    icon: Users,
    color: 'bg-pink-100 text-pink-600',
    link: '/dashboard/staff',
  },
  {
    id: 11,
    title: 'Admission Numbers',
    description: 'Auto-generate unique admission numbers for students.',
    icon: Award,
    color: 'bg-cyan-100 text-cyan-600',
    link: '/dashboard/admissions',
  },
  {
    id: 12,
    title: 'Multi-Campus',
    description: 'Manage multiple branches from a single dashboard.',
    icon: Building,
    color: 'bg-amber-100 text-amber-600',
    link: '/dashboard',
  },
];

export default function FeaturesPage() {
  const [schoolName, setSchoolName] = useState('Your School');

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">{schoolName}</span>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-sm mb-2">
          ← Full Dashboard
        </Link>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Dashboard</Link>
          <Link href="/dashboard/features" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm">Features</Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Students</Link>
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
          <div>
            <h1 className="text-xl font-bold text-foreground">African School Features</h1>
            <p className="text-sm text-foreground/60">Comprehensive tools designed for Nigerian & African schools</p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {africanFeatures.map((feature) => (
              <div key={feature.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.description}</p>
                <Link href={feature.link} className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
                  Open <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Need Something Specific?</h2>
            <p className="mb-6 opacity-90">We can customize features to match your school&apos;s unique requirements. Contact us to discuss your needs.</p>
            <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
              Contact Support
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}