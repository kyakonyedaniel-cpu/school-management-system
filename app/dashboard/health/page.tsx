'use client';

import { useState } from 'react';
import { Plus, Heart as HealthIcon, CheckCircle, Search, X } from 'lucide-react';
import { useHealth, useStudents } from '@/lib/data';

export default function HealthPage() {
  const { records, addRecord, updateRecord } = useHealth();
  const { students } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    studentId: '', studentName: '', class: '', condition: 'None', medication: 'None', allergies: 'None', lastCheckup: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), notes: ''
  });

  const filteredRecords = records.filter(r => 
    r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const withConditions = records.filter(r => r.condition !== 'None').length;
  const withAllergies = records.filter(r => r.allergies !== 'None').length;

  const handleStudentSelect = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setForm({ ...form, studentId, studentName: student.name, class: student.class });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateRecord(editingId, form);
      setEditingId(null);
    } else {
      addRecord(form);
    }
    setShowNew(false);
    setForm({ studentId: '', studentName: '', class: '', condition: 'None', medication: 'None', allergies: 'None', lastCheckup: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), notes: '' });
  };

  const handleEdit = (record: typeof records[0]) => {
    setForm({
      studentId: record.studentId,
      studentName: record.studentName,
      class: record.class,
      condition: record.condition,
      medication: record.medication,
      allergies: record.allergies,
      lastCheckup: record.lastCheckup,
      notes: record.notes
    });
    setEditingId(record.id);
    setShowNew(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Health Records</h1>
          <p className="text-foreground/60">Manage student health information</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Record
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{students.length}</h3><p className="text-sm text-foreground/60">Total Students</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{withConditions}</h3><p className="text-sm text-foreground/60">With Conditions</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-red-600" /></div>
            <div><h3 className="text-2xl font-bold">{withAllergies}</h3><p className="text-sm text-foreground/60">With Allergies</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">95%</h3><p className="text-sm text-foreground/60">Immunized</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Student Health Records</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input type="text" placeholder="Search..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-border rounded-lg" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Medical Condition</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Medication</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Allergies</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Last Checkup</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{record.studentName}</td>
                  <td className="px-4 py-3 text-sm">{record.class}</td>
                  <td className="px-4 py-3 text-sm">{record.condition}</td>
                  <td className="px-4 py-3 text-sm">{record.medication}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${record.allergies === 'None' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {record.allergies}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{record.lastCheckup}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleEdit(record)} className="text-sm text-primary hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">No health records found</td>
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
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Record' : 'Add Health Record'}</h2>
              <button onClick={() => { setShowNew(false); setEditingId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student</label>
                <select required value={form.studentId} onChange={(e) => handleStudentSelect(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.class}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Medical Condition</label>
                  <input type="text" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    placeholder="e.g. Asthma, None"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Medication</label>
                  <input type="text" value={form.medication} onChange={(e) => setForm({ ...form, medication: e.target.value })}
                    placeholder="e.g. Inhaler, None"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <input type="text" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                  placeholder="e.g. Dust, Peanuts, None"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowNew(false); setEditingId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}