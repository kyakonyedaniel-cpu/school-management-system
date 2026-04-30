'use client';

import { useState } from 'react';
import { Trophy, Users, Plus, Calendar, X, Search, Download, Upload, Edit, Trash2, Target } from 'lucide-react';
import { useSports, useSportEvents, parseCSV } from '@/lib/data';

const sportOptions = ['Football', 'Netball', 'Volleyball', 'Basketball', 'Athletics', 'Swimming', 'Rugby', 'Cricket', 'Tennis', 'Hockey', 'Multi-sport', 'Other'];

export default function SportsPage() {
  const { teams, addTeam, updateTeam, deleteTeam } = useSports();
  const { events, addEvent, updateEvent, deleteEvent } = useSportEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'teams' | 'events'>('teams');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState({
    name: '', sport: 'Football', coach: '', members: 0, wins: 0, losses: 0, draws: 0, status: 'Active'
  });
  const [eventForm, setEventForm] = useState({
    name: '', sport: 'Football', date: '', location: '', status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed', participants: 0, result: ''
  });

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.coach.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.sport.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAthletes = teams.reduce((sum, t) => sum + t.members, 0);
  const totalWins = teams.reduce((sum, t) => sum + t.wins, 0);
  const totalLosses = teams.reduce((sum, t) => sum + t.losses, 0);
  const totalDraws = teams.reduce((sum, t) => sum + t.draws, 0);
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTeamId) {
      updateTeam(editingTeamId, teamForm);
      setEditingTeamId(null);
    } else {
      addTeam({ ...teamForm, status: 'Active' });
    }
    setShowTeamModal(false);
    setTeamForm({ name: '', sport: 'Football', coach: '', members: 0, wins: 0, losses: 0, draws: 0, status: 'Active' });
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEventId) {
      updateEvent(editingEventId, eventForm);
      setEditingEventId(null);
    } else {
      addEvent(eventForm);
    }
    setShowEventModal(false);
    setEventForm({ name: '', sport: 'Football', date: '', location: '', status: 'upcoming', participants: 0, result: '' });
  };

  const handleEditTeam = (team: typeof teams[0]) => {
    setTeamForm({ name: team.name, sport: team.sport, coach: team.coach, members: team.members, wins: team.wins, losses: team.losses, draws: team.draws, status: team.status });
    setEditingTeamId(team.id);
    setShowTeamModal(true);
  };

  const handleEditEvent = (event: typeof events[0]) => {
    setEventForm({ name: event.name, sport: event.sport, date: event.date, location: event.location, status: event.status, participants: event.participants, result: event.result });
    setEditingEventId(event.id);
    setShowEventModal(true);
  };

  const exportData = () => {
    if (activeTab === 'teams') {
      const headers = ['Name', 'Sport', 'Coach', 'Members', 'Wins', 'Losses', 'Draws', 'Win Rate', 'Status'];
      const rows = filteredTeams.map(t => [
        t.name, t.sport, t.coach, t.members.toString(), t.wins.toString(),
        t.losses.toString(), t.draws.toString(),
        (t.wins + t.losses + t.draws > 0) ? ((t.wins / (t.wins + t.losses + t.draws)) * 100).toFixed(1) + '%' : 'N/A',
        t.status
      ]);
      const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      downloadCSV(csv, 'teams');
    } else {
      const headers = ['Event', 'Sport', 'Date', 'Location', 'Status', 'Participants', 'Result'];
      const rows = filteredEvents.map(e => [e.name, e.sport, e.date, e.location, e.status, e.participants.toString(), e.result]);
      const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      downloadCSV(csv, 'events');
    }
  };

  const downloadCSV = (csv: string, name: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sports-${name}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTeams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.coach) {
          addTeam({
            name: row.name,
            sport: row.sport || 'Football',
            coach: row.coach,
            members: parseInt(row.members) || 0,
            wins: parseInt(row.wins) || 0,
            losses: parseInt(row.losses) || 0,
            draws: parseInt(row.draws) || 0,
            status: row.status || 'Active',
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
          <h1 className="text-2xl font-bold">Sports</h1>
          <p className="text-foreground/60">Manage school teams and competitions</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importTeams} className="hidden" />
          </label>
          <button onClick={exportData} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => {
            if (activeTab === 'events') {
              setEditingEventId(null); setShowEventModal(true);
            } else {
              setEditingTeamId(null); setShowTeamModal(true);
            }
          }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />{activeTab === 'events' ? 'Add Event' : 'Add Team'}
          </button>
        </div>
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
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Target className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{totalWins}W - {totalLosses}L</h3><p className="text-sm text-foreground/60">Season Record</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-primary" /></div>
            <div><h3 className="text-2xl font-bold">{upcomingEvents}</h3><p className="text-sm text-foreground/60">Upcoming Events</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'teams' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
              Teams ({teams.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'events' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
              Events ({events.length})
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
            <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border w-56" />
          </div>
        </div>

        {activeTab === 'teams' && (
          <div className="divide-y divide-border">
            {filteredTeams.map((team) => {
              const total = team.wins + team.losses;
              const winRate = total > 0 ? Math.round((team.wins / total) * 100) : 0;
              return (
                <div key={team.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{team.name}</p>
                      <p className="text-sm text-foreground/60">Coach: {team.coach} - {team.members} members</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{team.wins}W - {team.losses}L</p>
                      <p className="text-xs text-foreground/60">Win rate: {winRate}%</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      team.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>{team.status}</span>
                    <button onClick={() => handleEditTeam(team)} className="p-1.5 hover:bg-blue-100 rounded"><Edit size={14} className="text-blue-600" /></button>
                    <button onClick={() => deleteTeam(team.id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 size={14} className="text-red-600" /></button>
                  </div>
                </div>
              );
            })}
            {filteredTeams.length === 0 && (
              <div className="p-8 text-center text-foreground/60">No teams found</div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="divide-y divide-border">
            {filteredEvents.map((comp) => (
              <div key={comp.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{comp.name}</p>
                    <p className="text-sm text-foreground/60">{comp.date} - {comp.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-sm">{comp.participants} participants</p>
                    {comp.result && <p className="text-xs text-green-600">{comp.result}</p>}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    comp.status === 'completed' ? 'bg-green-100 text-green-700' :
                    comp.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {comp.status.charAt(0).toUpperCase() + comp.status.slice(1)}
                  </span>
                  <button onClick={() => handleEditEvent(comp)} className="p-1.5 hover:bg-blue-100 rounded"><Edit size={14} className="text-blue-600" /></button>
                  <button onClick={() => deleteEvent(comp.id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 size={14} className="text-red-600" /></button>
                </div>
              </div>
            ))}
            {filteredEvents.length === 0 && (
              <div className="p-8 text-center text-foreground/60">No events found</div>
            )}
          </div>
        )}
      </div>

      {showTeamModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingTeamId ? 'Edit Team' : 'Add New Team'}</h2>
              <button onClick={() => { setShowTeamModal(false); setEditingTeamId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleTeamSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input type="text" required value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                  placeholder="e.g. Football - Senior"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sport</label>
                <select value={teamForm.sport} onChange={(e) => setTeamForm({ ...teamForm, sport: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  {sportOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Coach</label>
                <input type="text" required value={teamForm.coach} onChange={(e) => setTeamForm({ ...teamForm, coach: e.target.value })}
                  placeholder="e.g. Mr. Kato"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Members</label>
                  <input type="number" required min="0" value={teamForm.members} onChange={(e) => setTeamForm({ ...teamForm, members: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Wins</label>
                  <input type="number" required min="0" value={teamForm.wins} onChange={(e) => setTeamForm({ ...teamForm, wins: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Losses</label>
                  <input type="number" required min="0" value={teamForm.losses} onChange={(e) => setTeamForm({ ...teamForm, losses: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Draws</label>
                  <input type="number" required min="0" value={teamForm.draws} onChange={(e) => setTeamForm({ ...teamForm, draws: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowTeamModal(false); setEditingTeamId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingTeamId ? 'Update' : 'Add Team'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingEventId ? 'Edit Event' : 'Add New Event'}</h2>
              <button onClick={() => { setShowEventModal(false); setEditingEventId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input type="text" required value={eventForm.name} onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                  placeholder="e.g. National Schools Cup"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sport</label>
                <select value={eventForm.sport} onChange={(e) => setEventForm({ ...eventForm, sport: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  {sportOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="text" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    placeholder="e.g. May 20, 2026"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Participants</label>
                  <input type="number" required min="0" value={eventForm.participants} onChange={(e) => setEventForm({ ...eventForm, participants: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input type="text" required value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                  placeholder="e.g. Kampala"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={eventForm.status} onChange={(e) => setEventForm({ ...eventForm, status: e.target.value as 'upcoming' | 'ongoing' | 'completed' })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {eventForm.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Result</label>
                  <input type="text" value={eventForm.result} onChange={(e) => setEventForm({ ...eventForm, result: e.target.value })}
                    placeholder="e.g. 1st Place, Champion"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowEventModal(false); setEditingEventId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingEventId ? 'Update' : 'Add Event'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
