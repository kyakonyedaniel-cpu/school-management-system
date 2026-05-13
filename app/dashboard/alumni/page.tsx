'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, Search, Mail, Phone, Calendar, Award, Download, Users } from 'lucide-react';

interface Alumni {
  id: string;
  name: string;
  class: string;
  graduationYear: string;
  gender: string;
  phone: string;
  email: string;
  occupation: string;
  organization: string;
  location: string;
}

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', class: '', graduationYear: new Date().getFullYear().toString(), gender: 'Male', phone: '', email: '', occupation: '', organization: '', location: '' });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('school_alumni') || '[]');
    setAlumni(stored.length > 0 ? stored : [
      { id: '1', name: 'John Okello', class: 'P.7', graduationYear: '2024', gender: 'Male', phone: '0772123456', email: 'john@email.com', occupation: 'Student', organization: 'King\'s College Budo', location: 'Kampala' },
      { id: '2', name: 'Sarah Nakato', class: 'S.4', graduationYear: '2023', gender: 'Female', phone: '0789123456', email: 'sarah@email.com', occupation: 'Student', organization: 'Makerere University', location: 'Kampala' },
    ]);
  }, []);

  const saveAlumni = (data: Alumni[]) => {
    setAlumni(data);
    localStorage.setItem('school_alumni', JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!form.name || !form.class) return;
    const newAlumni: Alumni = { id: Date.now().toString(), ...form };
    saveAlumni([...alumni, newAlumni]);
    setShowAddModal(false);
    setForm({ name: '', class: '', graduationYear: '', gender: 'Male', phone: '', email: '', occupation: '', organization: '', location: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this alumni record?')) saveAlumni(alumni.filter(a => a.id !== id));
  };

  const exportCSV = () => {
    const headers = 'Name,Class,Graduation Year,Gender,Phone,Email,Occupation,Organization,Location\n';
    const rows = filtered.map(a => `${a.name},${a.class},${a.graduationYear},${a.gender},${a.phone},${a.email},${a.occupation},${a.organization},${a.location}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumni.csv';
    a.click();
  };

  const filtered = search ? alumni.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.class.toLowerCase().includes(search.toLowerCase()) || a.occupation.toLowerCase().includes(search.toLowerCase())) : alumni;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alumni</h1>
          <p className="text-foreground/60">{alumni.length} graduated students</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-muted"><Download size={18} /> Export</button>
          <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"><GraduationCap size={18} /> Add Alumni</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold">{alumni.length}</p><p className="text-sm text-foreground/60">Total Alumni</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold">{alumni.filter(a => a.gender === 'Male').length}</p><p className="text-sm text-foreground/60">Male</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold">{alumni.filter(a => a.gender === 'Female').length}</p><p className="text-sm text-foreground/60">Female</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold">{[...new Set(alumni.map(a => a.graduationYear))].length}</p><p className="text-sm text-foreground/60">Graduation Years</p></div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, class, occupation..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
      </div>

      <div className="bg-background rounded-xl border">
        <div className="divide-y">
          {filtered.map(a => (
            <div key={a.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{a.name.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-sm text-foreground/60">{a.class} • Graduated {a.graduationYear}</p>
                  <p className="text-xs text-foreground/60">{a.occupation} at {a.organization} • {a.location}</p>
                  {a.email && <p className="text-xs text-foreground/60">{a.email} • {a.phone}</p>}
                </div>
              </div>
              <button onClick={() => handleDelete(a.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">Delete</button>
            </div>
          ))}
          {filtered.length === 0 && <p className="p-8 text-center text-foreground/60">No alumni records found</p>}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Add Alumni</h2>
            <div className="space-y-3">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name *" className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="px-4 py-2 rounded-lg border border-border"><option value="">Class</option>{['P.7', 'S.4', 'S.6'].map(c => <option key={c} value={c}>{c}</option>)}</select>
                <input type="text" value={form.graduationYear} onChange={(e) => setForm({ ...form, graduationYear: e.target.value })} placeholder="Grad Year" className="px-4 py-2 rounded-lg border border-border" />
              </div>
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border"><option>Male</option><option>Female</option></select>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full px-4 py-2 rounded-lg border border-border" />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-border" />
              <input type="text" value={form.occupation} onChange={(e) => setForm({ ...form, occupation: e.target.value })} placeholder="Occupation" className="w-full px-4 py-2 rounded-lg border border-border" />
              <input type="text" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Organization" className="w-full px-4 py-2 rounded-lg border border-border" />
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
