"use client";

import { useState } from 'react';
import { Plus, MapPin, Bus, Users, X, Edit, Trash2, Download, Upload } from 'lucide-react';
import { useTransport, formatUGX, parseCSV } from '@/lib/data';

export default function TransportPage() {
  const { routes, addRoute, updateRoute, deleteRoute } = useTransport();
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', area: '', fee: 100000, students: 0
  });

  const totalStudents = routes.reduce((sum, r) => sum + r.students, 0);
  const totalRevenue = routes.reduce((sum, r) => sum + (r.fee * r.students), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateRoute(editingId, form);
      setEditingId(null);
    } else {
      addRoute(form);
    }
    setShowNew(false);
    setForm({ name: '', area: '', fee: 100000, students: 0 });
  };

  const handleEdit = (route: typeof routes[0]) => {
    setForm({ name: route.name, area: route.area, fee: route.fee, students: route.students });
    setEditingId(route.id);
    setShowNew(true);
  };

  const exportRoutes = () => {
    const headers = ['Name', 'Area', 'Fee', 'Students'];
    const rows = routes.map(r => [r.name, r.area, r.fee.toString(), r.students.toString()]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transport-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importRoutes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.area) {
          addRoute({
            name: row.name,
            area: row.area,
            fee: parseInt(row.fee) || 100000,
            students: parseInt(row.students) || 0,
          });
        }
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transport</h1>
          <p className="text-foreground/60">Manage transport routes and fees</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importRoutes} className="hidden" />
          </label>
          <button onClick={exportRoutes} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add Route
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Bus className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{routes.length}</h3>
              <p className="text-sm text-foreground/60">Routes</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
              <p className="text-sm text-foreground/60">Students</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><MapPin className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{routes.length > 0 ? [...new Set(routes.map(r => r.area))].length : 0}</h3>
              <p className="text-sm text-foreground/60">Areas Covered</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><MapPin className="w-6 h-6 text-primary" /></div>
            <div>
              <h3 className="text-2xl font-bold">{formatUGX(totalRevenue)}</h3>
              <p className="text-sm text-foreground/60">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Transport Routes</h2>
        </div>
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3">Route Name</th>
              <th className="text-left px-4 py-3">Area</th>
              <th className="text-right px-4 py-3">Monthly Fee</th>
              <th className="text-right px-4 py-3">Students</th>
              <th className="text-right px-4 py-3">Revenue</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {routes.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3"><MapPin size={16} className="inline mr-2" />{r.name}</td>
                <td className="px-4 py-3">{r.area}</td>
                <td className="px-4 py-3 text-right">{formatUGX(r.fee)}</td>
                <td className="px-4 py-3 text-right">{r.students}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatUGX(r.fee * r.students)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => handleEdit(r)} className="p-1.5 hover:bg-blue-100 rounded">
                      <Edit className="w-4 h-4 text-blue-600" />
                    </button>
                    <button onClick={() => deleteRoute(r.id)} className="p-1.5 hover:bg-red-100 rounded">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {routes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-foreground/60">No routes yet. Add one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Route' : 'Add Transport Route'}</h2>
              <button onClick={() => { setShowNew(false); setEditingId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Route Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Route A - Ntinda"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Area</label>
                <input type="text" required value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                  placeholder="e.g. Ntinda, Kampala"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Fee (UGX)</label>
                  <input type="number" required min="0" value={form.fee} onChange={(e) => setForm({ ...form, fee: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Students</label>
                  <input type="number" required min="0" value={form.students} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowNew(false); setEditingId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Add Route'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}