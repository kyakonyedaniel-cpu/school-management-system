'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Star, TrendingUp, Users, Plus, X } from 'lucide-react';
import { useStudents, useExams } from '@/lib/data';

interface Report {
  id: string;
  name: string;
  class: string;
  date: string;
  status: 'Draft' | 'Published';
  students: number;
  type: string;
}

const gradingSystem = [
  { grade: 'A', mark: '90-100', description: 'Excellent', color: 'bg-green-500' },
  { grade: 'B', mark: '80-89', description: 'Very Good', color: 'bg-green-400' },
  { grade: 'C', mark: '70-79', description: 'Good', color: 'bg-yellow-400' },
  { grade: 'D', mark: '60-69', description: 'Satisfactory', color: 'bg-yellow-300' },
  { grade: 'E', mark: '50-59', description: 'Pass', color: 'bg-orange-300' },
  { grade: 'F', mark: '0-49', description: 'Fail', color: 'bg-red-300' },
];

export default function ReportsPage() {
  const { students } = useStudents();
  const { exams } = useExams();
  const [reports, setReports] = useState<Report[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('school_reports');
      if (stored) return JSON.parse(stored);
    }
    return [
      { id: '1', name: 'Term I Progress Report', class: 'P.7', date: 'Apr 15, 2026', status: 'Draft', students: 25, type: 'Progress' },
      { id: '2', name: 'Mid-Term Assessment', class: 'S.2', date: 'Mar 25, 2026', status: 'Published', students: 42, type: 'Assessment' },
    ];
  });
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', class: 'All', type: 'Progress' });

  const publishedCount = reports.filter(r => r.status === 'Published').length;

  const handleSave = () => {
    localStorage.setItem('school_reports', JSON.stringify(reports));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Report = {
      id: Date.now().toString(),
      name: form.name,
      class: form.class,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      status: 'Draft',
      students: form.class === 'All' ? students.length : students.filter(s => s.class === form.class).length,
      type: form.type
    };
    setReports(prev => [...prev, newReport]);
    handleSave();
    setShowNew(false);
    setForm({ name: '', class: 'All', type: 'Progress' });
  };

  const handlePublish = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Published' } : r));
    handleSave();
  };

  const handleDelete = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    handleSave();
  };

  const classes = ['All', 'P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];
  const reportTypes = ['Progress', 'Assessment', 'Character', 'Fees', 'Attendance'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-foreground/60">Generate and manage school reports</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Create Report
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{reports.length}</h3>
              <p className="text-sm text-foreground/60">Reports Generated</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{students.length}</h3>
              <p className="text-sm text-foreground/60">Students Reported</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">72%</h3>
              <p className="text-sm text-foreground/60">Class Average</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Star className="w-6 h-6 text-purple-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{publishedCount}</h3>
              <p className="text-sm text-foreground/60">Published</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Recent Reports</h2>
          </div>
          <div className="divide-y divide-border">
            {reports.map((report) => (
              <div key={report.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{report.name}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{report.class} - {report.date} - {report.students} students</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${report.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {report.status}
                  </span>
                  {report.status === 'Draft' && (
                    <button onClick={() => handlePublish(report.id)} className="px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                      Publish
                    </button>
                  )}
                  <button className="p-1.5 hover:bg-muted rounded"><Eye size={16} /></button>
                  <button onClick={() => handleDelete(report.id)} className="p-1.5 hover:bg-muted rounded text-red-600"><X size={16} /></button>
                </div>
              </div>
            ))}
            {reports.length === 0 && (
              <div className="p-8 text-center text-foreground/60">No reports yet. Create one!</div>
            )}
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Grading System</h2>
          </div>
          <div className="p-4 space-y-3">
            {gradingSystem.map((g) => (
              <div key={g.grade} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${g.color} rounded flex items-center justify-center text-white font-bold`}>{g.grade}</div>
                  <div>
                    <p className="font-medium">{g.description}</p>
                    <p className="text-xs text-foreground/60">{g.mark}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Create Report</h2>
              <button onClick={() => setShowNew(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Term I Progress Report"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {reportTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}