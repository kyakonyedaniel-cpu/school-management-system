'use client';

import { useState } from 'react';
import { Users, Bed, Utensils, Home, Edit, Plus, X } from 'lucide-react';
import { useStudents } from '@/lib/data';

interface Boarder {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  dorm: string;
  room: string;
  status: string;
  meals: number;
}

const initialDorms = [
  { name: 'Nile House', capacity: 40, occupied: 35, gender: 'Boys' },
  { name: 'Albert House', capacity: 35, occupied: 28, gender: 'Boys' },
  { name: 'Baker House', capacity: 30, occupied: 25, gender: 'Boys' },
  { name: 'Victoria House', capacity: 45, occupied: 40, gender: 'Girls' },
];

export default function BoardingPage() {
  const { students } = useStudents();
  const [boardingStudents, setBoardingStudents] = useState<Boarder[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('school_boarders');
      if (stored) return JSON.parse(stored);
    }
    return [
      { id: '1', studentId: '1', studentName: 'John Okello', class: 'S.2', dorm: 'Nile House', room: 'Room 12', status: 'Active', meals: 3 },
      { id: '2', studentId: '2', studentName: 'Sarah Nakato', class: 'S.3', dorm: 'Victoria House', room: 'Room 8', status: 'Active', meals: 3 },
    ];
  });
  const [dorms] = useState(initialDorms);
  const [showNew, setShowNew] = useState(false);
  const [filterClass, setFilterClass] = useState('all');
  const [form, setForm] = useState({ studentId: '', dorm: '', room: '' });

  const handleSave = () => {
    localStorage.setItem('school_boarders', JSON.stringify(boardingStudents));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === form.studentId);
    if (student) {
      const newBoarder: Boarder = {
        id: Date.now().toString(),
        studentId: student.id,
        studentName: student.name,
        class: student.class,
        dorm: form.dorm,
        room: form.room,
        status: 'Active',
        meals: 3
      };
      setBoardingStudents(prev => [...prev, newBoarder]);
      handleSave();
      setShowNew(false);
      setForm({ studentId: '', dorm: '', room: '' });
    }
  };

  const handleRemove = (id: string) => {
    setBoardingStudents(prev => prev.filter(b => b.id !== id));
    handleSave();
  };

  const filteredStudents = filterClass === 'all' 
    ? boardingStudents 
    : boardingStudents.filter(b => {
        if (filterClass === 'primary') return b.class.startsWith('P');
        if (filterClass === 'secondary') return b.class.startsWith('S');
        return b.class === filterClass;
      });

  const classes = ['all', 'primary', 'secondary', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Boarding</h1>
          <p className="text-foreground/60">Manage boarding students and dormitories</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Boarder
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-orange-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{boardingStudents.length}</h3>
              <p className="text-sm text-foreground/60">Total Boarders</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Bed className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{dorms.reduce((acc, d) => acc + d.occupied, 0)}</h3>
              <p className="text-sm text-foreground/60">Dorm Spaces Used</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Utensils className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-sm text-foreground/60">Meals/Day</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Home className="w-6 h-6 text-red-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{dorms.length}</h3>
              <p className="text-sm text-foreground/60">Dormitories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Boarding Students</h2>
            <div className="flex items-center gap-2">
              <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}
                className="px-3 py-1.5 text-sm border border-border rounded-lg">
                <option value="all">All Classes</option>
                <option value="primary">P.5 - P.7</option>
                <option value="secondary">S.1 - S.4</option>
                <option value="P.5">P.5</option>
                <option value="P.6">P.6</option>
                <option value="P.7">P.7</option>
                <option value="S.1">S.1</option>
                <option value="S.2">S.2</option>
                <option value="S.3">S.3</option>
                <option value="S.4">S.4</option>
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
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{student.studentName}</td>
                    <td className="px-4 py-3 text-sm">{student.class}</td>
                    <td className="px-4 py-3 text-sm">{student.dorm}</td>
                    <td className="px-4 py-3 text-sm">{student.room}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleRemove(student.id)} className="p-1.5 hover:bg-muted rounded text-red-600">
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">No boarders found</td>
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
            {dorms.map((dorm) => (
              <div key={dorm.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{dorm.name} ({dorm.gender})</span>
                  <span>{dorm.occupied}/{dorm.capacity}</span>
                </div>
                <div className="h-3 bg-muted rounded-full">
                  <div className="h-3 bg-primary rounded-full" style={{ width: `${(dorm.occupied / dorm.capacity) * 100}%` }} />
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
              <h2 className="text-lg font-semibold">Add Boarding Student</h2>
              <button onClick={() => setShowNew(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
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
                  <label className="block text-sm font-medium mb-1">Dormitory</label>
                  <select required value={form.dorm} onChange={(e) => setForm({ ...form, dorm: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    <option value="">Select dorm</option>
                    {dorms.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Room</label>
                  <input type="text" required value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                    placeholder="e.g. Room 12"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}