'use client';

import { useState } from 'react';
import { Trophy, Plus, Download, Edit, Trash2, RotateCcw, Minus, Search, X } from 'lucide-react';
import { useHouses, generateId } from '@/lib/data';

const colorOptions = [
  { label: 'Blue', value: 'bg-blue-500' },
  { label: 'Purple', value: 'bg-purple-500' },
  { label: 'Green', value: 'bg-green-500' },
  { label: 'Red', value: 'bg-red-500' },
  { label: 'Orange', value: 'bg-orange-500' },
  { label: 'Pink', value: 'bg-pink-500' },
  { label: 'Cyan', value: 'bg-cyan-500' },
  { label: 'Indigo', value: 'bg-indigo-500' },
];

export interface Competition {
  id: string;
  event: string;
  date: string;
  winner: string;
}

const initialCompetitions: Competition[] = [
  { id: '1', event: 'Athletics Meet 2026', date: 'April 15, 2026', winner: 'Nile House' },
  { id: '2', event: 'Football Tournament', date: 'Term II, 2026', winner: 'Victoria House' },
  { id: '3', event: 'Debate Competition', date: 'Term I, 2026', winner: 'Albert House' },
];

export default function HousesPage() {
  const { houses, updateHousePoints, addHouse, updateHouse, deleteHouse, resetPoints } = useHouses();
  const [searchTerm, setSearchTerm] = useState('');
  const [showPoints, setShowPoints] = useState(false);
  const [showDeduct, setShowDeduct] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showCompetition, setShowCompetition] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pointsForm, setPointsForm] = useState({ houseId: '', points: 0, reason: '' });
  const [deductForm, setDeductForm] = useState({ houseId: '', points: 0, reason: '' });
  const [form, setForm] = useState({ name: '', color: 'bg-blue-500', students: 0, points: 0, captain: '' });
  const [competitionForm, setCompetitionForm] = useState({ event: '', date: '', winner: '' });
  const [competitions, setCompetitions] = useState<Competition[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('school_competitions');
      return stored ? JSON.parse(stored) : initialCompetitions;
    }
    return initialCompetitions;
  });

  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);
  const filteredHouses = sortedHouses.filter(h =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.captain.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPoints = houses.reduce((sum, h) => sum + h.points, 0);
  const totalStudents = houses.reduce((sum, h) => sum + h.students, 0);

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsForm.houseId && pointsForm.points > 0) {
      updateHousePoints(pointsForm.houseId, pointsForm.points);
      setPointsForm({ houseId: '', points: 0, reason: '' });
      setShowPoints(false);
    }
  };

  const handleDeductPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (deductForm.houseId && deductForm.points > 0) {
      updateHousePoints(deductForm.houseId, -deductForm.points);
      setDeductForm({ houseId: '', points: 0, reason: '' });
      setShowDeduct(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateHouse(editingId, form);
      setEditingId(null);
    } else {
      addHouse(form);
    }
    setShowAdd(false);
    setForm({ name: '', color: 'bg-blue-500', students: 0, points: 0, captain: '' });
  };

  const handleEdit = (h: typeof houses[0]) => {
    setForm({ name: h.name, color: h.color, students: h.students, points: h.points, captain: h.captain });
    setEditingId(h.id);
    setShowAdd(true);
  };

  const handleAddCompetition = (e: React.FormEvent) => {
    e.preventDefault();
    const newComp = { id: generateId(), ...competitionForm };
    const updated = [...competitions, newComp];
    setCompetitions(updated);
    localStorage.setItem('school_competitions', JSON.stringify(updated));
    setCompetitionForm({ event: '', date: '', winner: '' });
    setShowCompetition(false);
  };

  const deleteCompetition = (id: string) => {
    const updated = competitions.filter(c => c.id !== id);
    setCompetitions(updated);
    localStorage.setItem('school_competitions', JSON.stringify(updated));
  };

  const exportHouses = () => {
    const headers = ['Rank', 'House', 'Captain', 'Students', 'Points', '% of Total Points'];
    const rows = filteredHouses.map((h, i) => [
      (i + 1).toString(), h.name, h.captain, h.students.toString(), h.points.toString(),
      totalPoints > 0 ? ((h.points / totalPoints) * 100).toFixed(1) + '%' : '0%'
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `houses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Houses</h1>
          <p className="text-foreground/60">Manage school houses and inter-house competitions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportHouses} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} /> Export
          </button>
          <button onClick={() => setShowCompetition(true)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <Trophy size={18} /> Add Competition
          </button>
          <button onClick={() => { setEditingId(null); setShowAdd(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add House
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{totalPoints}</h3>
              <p className="text-sm text-foreground/60">Total Points</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{houses.length}</h3>
              <p className="text-sm text-foreground/60">Houses</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-purple-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
              <p className="text-sm text-foreground/60">Total Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">House Rankings</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input type="text" placeholder="Search houses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border w-56" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
          {filteredHouses.map((house, index) => (
            <div key={house.id} className="rounded-xl border-2 overflow-hidden bg-background">
              <div className={`${house.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">{house.name}</h3>
                  {index === 0 && <Trophy className="w-6 h-6" />}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold">{house.students}</p>
                    <p className="text-xs text-foreground/60">Students</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{house.points}</p>
                    <p className="text-xs text-foreground/60">Points</p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 mb-3">
                  <p className="text-xs text-foreground/60">House Captain</p>
                  <p className="font-medium">{house.captain}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setPointsForm({ houseId: house.id, points: 0, reason: '' }); setShowPoints(true); }}
                    className="flex-1 px-2 py-1.5 text-xs bg-green-600 text-white rounded hover:bg-green-700" title="Award points">
                    <Plus size={12} className="inline mr-1" />Award
                  </button>
                  <button onClick={() => { setDeductForm({ houseId: house.id, points: 0, reason: '' }); setShowDeduct(true); }}
                    className="flex-1 px-2 py-1.5 text-xs bg-orange-600 text-white rounded hover:bg-orange-700" title="Deduct points">
                    <Minus size={12} className="inline mr-1" />Deduct
                  </button>
                  <button onClick={() => handleEdit(house)}
                    className="px-2 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200" title="Edit">
                    <Edit size={12} />
                  </button>
                  <button onClick={() => resetPoints(house.id)}
                    className="px-2 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200" title="Reset points">
                    <RotateCcw size={12} />
                  </button>
                  <button onClick={() => deleteHouse(house.id)}
                    className="px-2 py-1.5 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200" title="Delete">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Inter-House Competitions</h2>
        </div>
        <div className="divide-y divide-border">
          {competitions.map((comp) => (
            <div key={comp.id} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{comp.event}</h3>
                <p className="text-sm text-foreground/60">{comp.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-bold text-blue-600">{comp.winner}</p>
                  <p className="text-xs">Winner</p>
                </div>
                <button onClick={() => deleteCompetition(comp.id)} className="p-1.5 hover:bg-red-100 rounded">
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
          {competitions.length === 0 && (
            <div className="p-8 text-center text-foreground/60">No competitions recorded yet.</div>
          )}
        </div>
      </div>

      {showPoints && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Award House Points</h3>
            <form onSubmit={handleAddPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select House</label>
                <select required value={pointsForm.houseId} onChange={(e) => setPointsForm({ ...pointsForm, houseId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select house</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points to Add</label>
                <input type="number" required min="1" value={pointsForm.points} onChange={(e) => setPointsForm({ ...pointsForm, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input type="text" value={pointsForm.reason} onChange={(e) => setPointsForm({ ...pointsForm, reason: e.target.value })}
                  placeholder="e.g. Won football match"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPoints(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">Award Points</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeduct && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Deduct House Points</h3>
            <form onSubmit={handleDeductPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select House</label>
                <select required value={deductForm.houseId} onChange={(e) => setDeductForm({ ...deductForm, houseId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select house</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points to Deduct</label>
                <input type="number" required min="1" value={deductForm.points} onChange={(e) => setDeductForm({ ...deductForm, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input type="text" value={deductForm.reason} onChange={(e) => setDeductForm({ ...deductForm, reason: e.target.value })}
                  placeholder="e.g. Discipline violation"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowDeduct(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg">Deduct Points</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit House' : 'Add New House'}</h2>
              <button onClick={() => { setShowAdd(false); setEditingId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">House Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Kilimanjaro House"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map(c => (
                    <button key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })}
                      className={`p-3 rounded-lg border-2 transition-all ${form.color === c.value ? 'border-primary scale-105' : 'border-transparent'}`}>
                      <div className={`w-full h-6 rounded ${c.value}`} />
                      <span className="text-xs mt-1 block text-center">{c.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Students</label>
                  <input type="number" required min="0" value={form.students} onChange={(e) => setForm({ ...form, students: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Points</label>
                  <input type="number" required min="0" value={form.points} onChange={(e) => setForm({ ...form, points: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">House Captain</label>
                <input type="text" required value={form.captain} onChange={(e) => setForm({ ...form, captain: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCompetition && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Competition</h2>
              <button onClick={() => setShowCompetition(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddCompetition} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input type="text" required value={competitionForm.event} onChange={(e) => setCompetitionForm({ ...competitionForm, event: e.target.value })}
                  placeholder="e.g. Swimming Gala"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="text" required value={competitionForm.date} onChange={(e) => setCompetitionForm({ ...competitionForm, date: e.target.value })}
                  placeholder="e.g. Term III, 2026"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Winner</label>
                <select required value={competitionForm.winner} onChange={(e) => setCompetitionForm({ ...competitionForm, winner: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select house</option>
                  {houses.map(h => <option key={h.id} value={h.name}>{h.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowCompetition(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add Competition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
