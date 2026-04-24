'use client';

import { useState } from 'react';
import { Trophy, Users, Plus, Calendar, X } from 'lucide-react';
import { useSports } from '@/lib/data';

const competitions = [
  { id: '1', name: 'East African Games 2026', date: 'Jul 15-25, 2026', participants: 12, status: 'Upcoming' },
  { id: '2', name: 'National Schools Cup', date: 'May 20, 2026', participants: 8, status: 'Preparing' },
  { id: '3', name: 'District Athletics', date: 'Apr 30, 2026', participants: 15, status: 'Completed' },
];

export default function SportsPage() {
  const { teams, addTeam, updateTeam } = useSports();
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '', coach: '', members: 0, wins: 0, losses: 0, status: 'Active'
  });

  const totalAthletes = teams.reduce((sum, t) => sum + t.members, 0);
  const totalWins = teams.reduce((sum, t) => sum + t.wins, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateTeam(editingId, form);
      setEditingId(null);
    } else {
      addTeam(form);
    }
    setShowNew(false);
    setForm({ name: '', coach: '', members: 0, wins: 0, losses: 0, status: 'Active' });
  };

  const handleEdit = (team: typeof teams[0]) => {
    setForm({
      name: team.name,
      coach: team.coach,
      members: team.members,
      wins: team.wins,
      losses: team.losses,
      status: team.status
    });
    setEditingId(team.id);
    setShowNew(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sports</h1>
          <p className="text-foreground/60">Manage school teams and competitions</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Team
        </button>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{teams.length}</h3><p className="text-sm text-foreground/60">Active Teams</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{totalAthletes}</h3><p className="text-sm text-foreground/60">Total Athletes</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Trophy className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{totalWins}</h3><p className="text-sm text-foreground/60">Wins This Season</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-primary" /></div>
            <div><h3 className="text-2xl font-bold">{competitions.filter(c => c.status === 'Upcoming').length}</h3><p className="text-sm text-foreground/60">Upcoming Events</p></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border"><h2 className="font-semibold">School Teams</h2></div>
          <div className="divide-y divide-border">
            {teams.map((team) => (
              <div key={team.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-foreground/60">Coach: {team.coach} - {team.members} members</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-green-600">{team.wins}W - {team.losses}L</p>
                  </div>
                  <button onClick={() => handleEdit(team)} className="text-sm text-primary hover:underline">Edit</button>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="p-8 text-center text-foreground/60">No teams yet. Add one!</div>
            )}
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border"><h2 className="font-semibold">Upcoming Competitions</h2></div>
          <div className="divide-y divide-border">
            {competitions.map((comp) => (
              <div key={comp.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{comp.name}</p>
                  <p className="text-sm text-foreground/60">{comp.date}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  comp.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                  comp.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {comp.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Team' : 'Add New Team'}</h2>
              <button onClick={() => { setShowNew(false); setEditingId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Football - Senior"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coach</label>
                <input type="text" required value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })}
                  placeholder="e.g. Mr. Kato"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Members</label>
                  <input type="number" required min="0" value={form.members} onChange={(e) => setForm({ ...form, members: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Wins</label>
                  <input type="number" required min="0" value={form.wins} onChange={(e) => setForm({ ...form, wins: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Losses</label>
                  <input type="number" required min="0" value={form.losses} onChange={(e) => setForm({ ...form, losses: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
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