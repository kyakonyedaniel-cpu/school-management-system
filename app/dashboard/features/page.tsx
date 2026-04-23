'use client';

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
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {africanFeatures.map((feature) => (
          <div key={feature.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color}`}>
              <feature.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
            <p className="text-sm text-foreground/70">{feature.description}</p>
            <a href={feature.link} className="mt-4 flex items-center gap-2 text-sm text-primary font-medium hover:underline">
              Open <span aria-hidden="true">→</span>
            </a>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Need Something Specific?</h2>
        <p className="mb-6 opacity-90">We can customize features to match your school&apos;s unique requirements. Contact us to discuss your needs.</p>
        <button className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
}