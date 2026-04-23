'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, School, Mail, Phone, MapPin, Save, User } from 'lucide-react';

export default function ProfilePage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [schoolEmail, setSchoolEmail] = useState('');
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    phone: '',
    address: '',
    slogan: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('schoolName');
    const storedEmail = localStorage.getItem('schoolEmail');
    if (storedName) {
      setSchoolName(storedName);
      setFormData(prev => ({ ...prev, schoolName: storedName }));
    }
    if (storedEmail) {
      setSchoolEmail(storedEmail);
      setFormData(prev => ({ ...prev, email: storedEmail }));
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('schoolName', formData.schoolName);
    localStorage.setItem('schoolEmail', formData.email);
    setTimeout(() => {
      setIsSaving(false);
      setSchoolName(formData.schoolName);
      setSchoolEmail(formData.email);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <School className="w-4 h-4 text-white" />
          </div>
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
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
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
          <h1 className="text-xl font-bold text-foreground">School Profile</h1>
          <p className="text-sm text-foreground/60">Manage your school settings</p>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-2xl">
            <div className="bg-white rounded-xl border border-border p-6 mb-6">
              <h2 className="text-lg font-semibold mb-6">School Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">School Name</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                    <input
                      type="text"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="0803 XXX XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-foreground/40" size={20} />
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={3}
                      className="w-full pl-11 pr-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="School address..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">School Slogan</label>
                  <input
                    type="text"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Education for Excellence"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Account Details</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <span className="text-foreground/70">Email</span>
                  <span className="font-medium">{schoolEmail || 'Not set'}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-foreground/70">Plan</span>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">Professional</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}