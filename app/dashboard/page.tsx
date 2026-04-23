'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  School,
  Users,
  TrendingUp,
  TrendingDown,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronDown,
  UserPlus,
  FileText,
  Clock,
  CheckCircle,
  Calendar as CalendarIcon,
  Calendar,
  BookOpen,
  Bed,
  Heart,
  Award,
  Shield,
  MapPin,
  Trophy,
  DollarSign,
  Package,
  CalendarDays,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyRevenue = [
  { month: 'Jan', amount: 2400000 },
  { month: 'Feb', amount: 2800000 },
  { month: 'Mar', amount: 3200000 },
  { month: 'Apr', amount: 2900000 },
  { month: 'May', amount: 3500000 },
  { month: 'Jun', amount: 4100000 },
];

const recentStudents = [
  { id: 1, name: 'John Okello', class: 'P.7', fees: 'UGX 450,000', status: 'Paid' },
  { id: 2, name: 'Sarah Nakato', class: 'S.1', fees: 'UGX 520,000', status: 'Pending' },
  { id: 3, name: 'David Ssebu', class: 'P.6', fees: 'UGX 450,000', status: 'Overdue' },
  { id: 4, name: 'Mary Namuli', class: 'S.2', fees: 'UGX 520,000', status: 'Paid' },
  { id: 5, name: 'Peter Wasswa', class: 'P.5', fees: 'UGX 450,000', status: 'Pending' },
];

const classDistribution = [
  { class: 'P.1', count: 45 },
  { class: 'P.2', count: 52 },
  { class: 'P.3', count: 38 },
  { class: 'P.4', count: 42 },
  { class: 'P.5', count: 55 },
  { class: 'P.6', count: 43 },
  { class: 'P.7', count: 25 },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [schoolName, setSchoolName] = useState('Your School');
  const [schoolEmail, setSchoolEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedSchoolName = localStorage.getItem('schoolName');
    const storedEmail = localStorage.getItem('schoolEmail');
    if (storedSchoolName) setSchoolName(storedSchoolName);
    if (storedEmail) setSchoolEmail(storedEmail);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('schoolName');
    localStorage.removeItem('schoolEmail');
    router.push('/');
  };

  const stats = [
    { label: 'Total Students', value: '300', change: '+12%', trend: 'up', icon: Users },
    { label: 'Monthly Revenue', value: 'UGX 4.1M', change: '+23%', trend: 'up', icon: TrendingUp },
    { label: 'Attendance Rate', value: '94.5%', change: '-2%', trend: 'down', icon: CheckCircle },
    { label: 'Pending Fees', value: 'UGX 890K', change: '-15%', trend: 'up', icon: Clock },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-foreground bg-muted';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-border transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <School className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">SchoolManager</h2>
            <p className="text-xs text-foreground/60">{schoolName}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          <div className="pb-4 mb-4 border-b border-border">
            <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
              <FileText size={20} />
              Dashboard
            </Link>
          </div>

          <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Main</p>
          <Link href="/dashboard/features" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
            <FileText size={18} />
            Features
          </Link>
          <Link href="/dashboard/students" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
            <Users size={18} />
            Students
          </Link>
          <Link href="/dashboard/fees" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
            <TrendingUp size={18} />
            Fees
          </Link>
          <Link href="/dashboard/attendance" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
            <CheckCircle size={18} />
            Attendance
          </Link>

          <div className="pt-4 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Academic</p>
            <Link href="/dashboard/curriculum" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <BookOpen size={18} />
              Curriculum
            </Link>
            <Link href="/dashboard/timetable" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Calendar size={18} />
              Timetable
            </Link>
            <Link href="/dashboard/exams" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <FileText size={18} />
              Exams
            </Link>
            <Link href="/dashboard/results" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <FileText size={18} />
              Results
            </Link>
            <Link href="/dashboard/reports" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <FileText size={18} />
              Reports
            </Link>
          </div>

          <div className="pt-4 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">People</p>
            <Link href="/dashboard/staff" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Users size={18} />
              Staff
            </Link>
            <Link href="/dashboard/parents" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Users size={18} />
              Parents (PTA)
            </Link>
            <Link href="/dashboard/houses" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Heart size={18} />
              Houses
            </Link>
          </div>

          <div className="pt-4 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Campus</p>
            <Link href="/dashboard/library" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <BookOpen size={18} />
              Library
            </Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Bed size={18} />
              Boarding
            </Link>
            <Link href="/dashboard/transport" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <MapPin size={18} />
              Transport
            </Link>
            <Link href="/dashboard/sports" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Trophy size={18} />
              Sports
            </Link>
          </div>

          <div className="pt-4 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Administration</p>
            <Link href="/dashboard/admissions" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Award size={18} />
              Admissions
            </Link>
            <Link href="/dashboard/calendar" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <CalendarIcon size={18} />
              Calendar
            </Link>
            <Link href="/dashboard/budget" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <DollarSign size={18} />
              Budget
            </Link>
            <Link href="/dashboard/inventory" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Package size={18} />
              Inventory
            </Link>
            <Link href="/dashboard/leave" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <CalendarDays size={18} />
              Leave
            </Link>
            <Link href="/dashboard/health" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Heart size={18} />
              Health
            </Link>
            <Link href="/dashboard/discipline" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Shield size={18} />
              Discipline
            </Link>
          </div>

          <div className="pt-4 mt-2 border-t border-border">
            <p className="px-4 py-2 text-xs font-medium text-foreground/50 uppercase tracking-wider">Settings</p>
            <Link href="/subscription" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Award size={18} />
              Subscription
            </Link>
            <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <Users size={18} />
              Profile
            </Link>
          </div>

          <div className="pt-4 mt-4 border-t border-border">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-foreground/70 hover:bg-muted transition-colors">
              <FileText size={20} />
              View Landing Page
            </Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
              <input
                type="text"
                placeholder="Search students, fees..."
                className="pl-10 pr-4 py-2 rounded-lg border border-border w-64 lg:w-80 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 rounded-lg hover:bg-muted transition-colors">
              <Settings size={20} />
            </button>

            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium">
                  {schoolName.charAt(0).toUpperCase()}
                </div>
                <ChevronDown size={16} />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border py-2 z-10">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="font-medium text-foreground">{schoolName}</p>
                    <p className="text-sm text-foreground/60">{schoolEmail}</p>
                  </div>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors">
                    <UserPlus size={16} />
                    Profile
                  </Link>
                  <button onClick={handleSignOut} className="flex items-center gap-2 px-4 py-2 hover:bg-muted transition-colors w-full">
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-foreground/60">Welcome back! Here&apos;s what&apos;s happening.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₦${(value / 1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} dot={{ fill: '#2563eb' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Students by Class</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={classDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="class" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Students</h3>
              <Link href="#" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Name</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Class</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Fees</th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-foreground/70">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentStudents.map((student) => (
                    <tr key={student.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-medium">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground/70">{student.class}</td>
                      <td className="px-6 py-4 font-medium">{student.fees}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
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