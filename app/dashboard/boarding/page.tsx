'use client';

import { useState } from 'react';
import { Users, Bed, Utensils, Home, Edit, Trash2, Plus, Search, X, Download, Upload } from 'lucide-react';
import { useBoarding, parseCSV } from '@/lib/data';

const dormitories = [
  { name: 'Nile House', capacity: 40, gender: 'Boys' },
  { name: 'Albert House', capacity: 35, gender: 'Boys' },
  { name: 'Baker House', capacity: 30, gender: 'Boys' },
  { name: 'Victoria House', capacity: 45, gender: 'Girls' },
];

export default function BoardingPage() {
  const { boarders, addBoarder, updateBoarder, deleteBoarder } = useBoarding();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  interface BoardingForm {
    name: string; class: string; dorm: string; room: string; meals: number; status: 'active' | 'checked_out' | 'on_leave'
  }
  const [form, setForm] = useState<BoardingForm>({
    name: '', class: 'S.1', dorm: 'Nile House', room: '', meals: 3, status: 'active'
  });

  const filteredBoarders = boarders.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.dorm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = boarders.filter(b => b.status === 'active').length;
  const checkedOutCount = boarders.filter(b => b.status === 'checked_out').length;

  const getDormOccupancy = (dormName: string) => {
    return boarders.filter(b => b.dorm === dormName && b.status === 'active').length;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateBoarder(editingId, form);
      setEditingId(null);
    } else {
      addBoarder(form);
    }
    setShowModal(false);
    setForm({ name: '', class: 'S.1', dorm: 'Nile House', room: '', meals: 3, status: 'active' });
  };

  const handleEdit = (b: typeof boarders[0]) => {
    setForm({ name: b.name, class: b.class, dorm: b.dorm, room: b.room, meals: b.meals, status: b.status });
    setEditingId(b.id);
    setShowModal(true);
  };

  const toggleStatus = (b: typeof boarders[0]) => {
    if (b.status === 'active') updateBoarder(b.id, { status: 'checked_out' });
    else updateBoarder(b.id, { status: 'active' });
  };

  const exportBoarding = () => {
    const headers = ['Name', 'Class', 'Dorm', 'Room', 'Meals', 'Status'];
    const rows = filteredBoarders.map(b => [b.name, b.class, b.dorm, b.room, b.meals.toString(), b.status]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boarding-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBoarding = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.dorm) {
          addBoarder({
            name: row.name,
            class: row.class || 'S.1',
            dorm: row.dorm,
            room: row.room || '',
            meals: parseInt(row.meals) || 3,
            status: (row.status as 'active' | 'checked_out' | 'on_leave') || 'active',
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
          <h1 className="text-2xl font-bold">Boarding Management</h1>
          <p className="text-foreground/60">Manage dormitory assignments and boarder status</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importBoarding} className="hidden" />
          </label>
          <button onClick={exportBoarding} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => { setEditingId(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add Boarder
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-orange-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{boarders.length}</h3>
              <p className="text-sm text-foreground/60">Total Boarders</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Bed className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{activeCount}</h3>
              <p className="text-sm text-foreground/60">Currently Active</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Utensils className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{boarders.filter(b => b.status === 'active').reduce((sum, b) => sum + b.meals, 0)}</h3>
              <p className="text-sm text-foreground/60">Daily Meals Served</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Home className="w-6 h-6 text-red-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{dormitories.length}</h3>
              <p className="text-sm text-foreground/60">Dormitories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <h2 className="font-semibold">Boarding Students</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border w-48" />
              </div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-1.5 text-sm border border-border rounded-lg">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="checked_out">Checked Out</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Dormitory</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Meals</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBoarders.map((student) => (
                  <tr key={student.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-sm">{student.class}</td>
                    <td className="px-4 py-3 text-sm">{student.dorm}</td>
                    <td className="px-4 py-3 text-sm">{student.room}</td>
                    <td className="px-4 py-3 text-sm">{student.meals}/day</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        student.status === 'active' ? 'bg-green-100 text-green-700' :
                        student.status === 'checked_out' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {student.status === 'active' ? 'Active' : student.status === 'checked_out' ? 'Checked Out' : 'On Leave'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => toggleStatus(student)} className="px-2 py-1 text-xs rounded hover:bg-muted" title={student.status === 'active' ? 'Check out' : 'Check in'}>
                          {student.status === 'active' ? 'Check Out' : 'Check In'}
                        </button>
                        <button onClick={() => handleEdit(student)} className="p-1.5 hover:bg-blue-100 rounded"><Edit size={14} className="text-blue-600" /></button>
                        <button onClick={() => deleteBoarder(student.id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 size={14} className="text-red-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredBoarders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-foreground/60">No boarding students found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Dormitory Occupancy</h2>
          </div>
          <div className="p-4 space-y-4">
            {dormitories.map((dorm) => {
              const occupied = getDormOccupancy(dorm.name);
              const pct = Math.round((occupied / dorm.capacity) * 100);
              return (
                <div key={dorm.name}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{dorm.name} ({dorm.gender})</span>
                    <span>{occupied}/{dorm.capacity} ({pct}%)</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all ${pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Boarder' : 'Add Boarder'}</h2>
              <button onClick={() => { setShowModal(false); setEditingId(null); }}><X size={20} /></button>
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
                    {['P.1','P.2','P.3','P.4','P.5','P.6','P.7','S.1','S.2','S.3','S.4','S.5','S.6'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dormitory</label>
                  <select value={form.dorm} onChange={(e) => setForm({ ...form, dorm: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {dormitories.map(d => <option key={d.name} value={d.name}>{d.name} ({d.gender})</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Room</label>
                  <input type="text" required value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                    placeholder="e.g. Room 12"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Meals/Day</label>
                  <select value={form.meals} onChange={(e) => setForm({ ...form, meals: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    <option value={1}>1 meal</option>
                    <option value={2}>2 meals</option>
                    <option value={3}>3 meals</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'active' | 'checked_out' | 'on_leave' })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="active">Active</option>
                  <option value="on_leave">On Leave</option>
                  <option value="checked_out">Checked Out</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
