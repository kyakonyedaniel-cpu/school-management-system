'use client';

import { useState } from 'react';
import { Users, Search, Plus, Download, Award, FileText, CheckCircle, XCircle, X } from 'lucide-react';
import { useAdmissions, useStudents, formatUGX, classes } from '@/lib/data';

export default function AdmissionsPage() {
  const { admissions, addAdmission, updateStatus } = useAdmissions();
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    name: '', class: 'P.1', parent: '', phone: '', email: '', dob: '', gender: 'Male'
  });

  const filteredAdmissions = admissions.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.parent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = admissions.filter(a => a.status === 'pending').length;
  const approvedCount = admissions.filter(a => a.status === 'approved').length;

  const generateAdmNo = (name: string) => {
    const year = 2026;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `ST/${year}/${initials}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAdmission({
      ...form,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
    setShowNew(false);
    setForm({ name: '', class: 'P.1', parent: '', phone: '', email: '', dob: '', gender: 'Male' });
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admissions</h1>
          <p className="text-foreground/60">Manage student admissions</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />New Application
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Award className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{admissions.length}</h3>
              <p className="text-sm text-foreground/60">Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{pendingCount}</h3>
              <p className="text-sm text-foreground/60">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{approvedCount}</h3>
              <p className="text-sm text-foreground/60">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
            <div>
              <h3 className="text-2xl font-bold">{students.length}</h3>
              <p className="text-sm text-foreground/60">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Recent Applications</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border border-border w-64" />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted"><Download size={18} /> Export</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Admission No.</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Parent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmissions.map((app) => (
                <tr key={app.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-sm">{generateAdmNo(app.name)}</td>
                  <td className="px-4 py-3 font-medium">{app.name}</td>
                  <td className="px-4 py-3 text-sm">{app.class}</td>
                  <td className="px-4 py-3 text-sm">{app.parent}</td>
                  <td className="px-4 py-3 text-sm">{app.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                      app.status === 'approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status === 'approved' ? <CheckCircle size={12} /> : app.status === 'rejected' ? <XCircle size={12} /> : null}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {app.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(app.id, 'approved')} className="text-green-600 hover:underline text-sm">Approve</button>
                        <button onClick={() => updateStatus(app.id, 'rejected')} className="text-red-600 hover:underline text-sm">Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAdmissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">No applications found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Application</h2>
              <button onClick={() => setShowNew(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {classesList.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent/Guardian</label>
                <input type="text" required value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}