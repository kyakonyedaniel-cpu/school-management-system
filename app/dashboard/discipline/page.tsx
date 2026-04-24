'use client';

import { useState } from 'react';
import { Plus, AlertTriangle, FileText, CheckCircle, Search, X } from 'lucide-react';
import { useDiscipline, useStudents, classes } from '@/lib/data';

const incidentTypes = [
  'Late Coming', 'Uniform Violation', 'Disruptive Behavior', 'Fighting', 
  'Homework Default', 'Cheating', 'Vandalism', 'Bullying', 'Absenteeism', 'Other'
];

const actions = [
  'Warning Letter', 'Counseling', 'Community Service', 'Suspension', 
  'Parent Meeting', 'Detention', 'Behavioral Contract', 'Expulsion (Board Decision)'
];

export default function DisciplinePage() {
  const { incidents, addIncident, resolveIncident } = useDiscipline();
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    studentId: '', type: 'Late Coming', description: '', action: 'Warning Letter'
  });

  const filteredIncidents = incidents.filter(i => 
    i.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingCount = incidents.filter(i => i.status === 'pending').length;
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === form.studentId);
    if (student) {
      addIncident({
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        type: form.type,
        description: form.description,
        date: new Date().toISOString().split('T')[0],
        action: form.action,
        status: 'pending'
      });
      setShowNew(false);
      setForm({ studentId: '', type: 'Late Coming', description: '', action: 'Warning Letter' });
    }
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discipline</h1>
          <p className="text-foreground/60">Track and manage student behavior</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Report Incident
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{pendingCount}</h3><p className="text-sm text-foreground/60">Pending Cases</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div><h3 className="text-2xl font-bold">{incidents.filter(i => i.type === 'Fighting').length}</h3><p className="text-sm text-foreground/60">Serious Cases</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{incidents.length}</h3><p className="text-sm text-foreground/60">Total Incidents</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{resolvedCount}</h3><p className="text-sm text-foreground/60">Resolved</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Recent Discipline Cases</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
              className="pl-10 pr-4 py-2 rounded-lg border border-border w-64" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Incident Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Description</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Action Taken</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.map((incident) => (
                <tr key={incident.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{incident.studentName}</td>
                  <td className="px-4 py-3 text-sm">{incident.class}</td>
                  <td className="px-4 py-3 text-sm">{incident.type}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{incident.description}</td>
                  <td className="px-4 py-3 text-sm">{incident.date}</td>
                  <td className="px-4 py-3 text-sm">{incident.action}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {incident.status === 'pending' && (
                      <button onClick={() => resolveIncident(incident.id)} 
                        className="text-green-600 hover:underline text-sm">Resolve</button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredIncidents.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-foreground/60">No incidents found</td>
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
              <h2 className="text-lg font-semibold">Report Incident</h2>
              <button onClick={() => setShowNew(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Incident Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {incidentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Action</label>
                  <select value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {actions.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
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