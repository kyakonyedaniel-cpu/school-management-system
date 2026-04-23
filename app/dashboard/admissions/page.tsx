'use client';

import { useState } from 'react';
import { Users, Search, Plus, Download, Edit, Award, FileText, CheckCircle, XCircle } from 'lucide-react';

const applications = [
  { id: 1, name: 'Emma Nabisere', class: 'P.1', gender: 'Female', parent: 'Mr. Nabisere', date: 'Apr 15, 2026', status: 'Pending' },
  { id: 2, name: 'Joshua Mulinde', class: 'P.1', gender: 'Male', parent: 'Mrs. Mulinde', date: 'Apr 12, 2026', status: 'Approved' },
  { id: 3, name: 'Sarah Akuruti', class: 'S.1', gender: 'Female', parent: 'Mr. Akuruti', date: 'Apr 10, 2026', status: 'Pending' },
  { id: 4, name: 'Samuel Kigozi', class: 'P.4', gender: 'Male', parent: 'Mrs. Kigozi', date: 'Apr 8, 2026', status: 'Rejected' },
];

export default function AdmissionsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const generateAdmNo = (name: string) => {
    const year = 2026;
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return `ST/${year}/${initials}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Award className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-foreground/60">Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">5</h3>
              <p className="text-sm text-foreground/60">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">6</h3>
              <p className="text-sm text-foreground/60">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-primary" /></div>
            <div>
              <h3 className="text-2xl font-bold">300</h3>
              <p className="text-sm text-foreground/60">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Recent Applications</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input type="text" placeholder="Search students..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 rounded-lg border border-border w-64" />
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
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Gender</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Parent</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-sm">{generateAdmNo(app.name)}</td>
                  <td className="px-4 py-3 font-medium">{app.name}</td>
                  <td className="px-4 py-3 text-sm">{app.class}</td>
                  <td className="px-4 py-3 text-sm">{app.gender}</td>
                  <td className="px-4 py-3 text-sm">{app.parent}</td>
                  <td className="px-4 py-3 text-sm">{app.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {app.status === 'Approved' ? <CheckCircle size={12} /> : app.status === 'Rejected' ? <XCircle size={12} /> : null}
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}