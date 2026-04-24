'use client';

import { useState } from 'react';
import { Users, Calendar, DollarSign, Plus, Phone, Mail, X } from 'lucide-react';
import { useStudents } from '@/lib/data';

const ptaMembers = [
  { id: 1, name: 'Mr. James Okello', role: 'Chairman', child: 'John Okello P.7', phone: '0770XXX', email: 'james@gmail.com' },
  { id: 2, name: 'Mrs. Grace Namutowe', role: 'Secretary', child: 'Sarah Nakato S.1', phone: '0772XXX', email: 'grace@gmail.com' },
  { id: 3, name: 'Mr. David Kigozi', role: 'Treasurer', child: 'David Ssebu P.6', phone: '0773XXX', email: 'david@gmail.com' },
];

const meetings = [
  { id: 1, title: 'Term I PTA Meeting', date: 'Mar 28, 2026', venue: 'School Hall', attendance: 85, contributions: 2500000 },
  { id: 2, title: 'End of Term Meeting', date: 'Apr 25, 2026', venue: 'School Hall', attendance: 0, contributions: 0 },
];

export default function ParentsPage() {
  const { students } = useStudents();
  const [showNew, setShowNew] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', date: '', venue: '' });

  const handleAddMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNew(false);
    setNewMeeting({ title: '', date: '', venue: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Parent Portal</h1>
          <p className="text-foreground/60">Manage PTA and parent communications</p>
        </div>
        <button onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Schedule Meeting
        </button>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{students.length}</h3>
              <p className="text-sm text-foreground/60">Registered Parents</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{meetings.length}</h3>
              <p className="text-sm text-foreground/60">Meetings This Year</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><DollarSign className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">UGX 5.2M</h3>
              <p className="text-sm text-foreground/60">Total Contributions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">PTA Executive Committee</h2>
          </div>
          <div className="divide-y divide-border">
            {ptaMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-foreground/60">{member.role} - Parent of {member.child}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-muted rounded"><Phone size={16} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Mail size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Upcoming Meetings</h2>
          </div>
          <div className="divide-y divide-border">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{meeting.title}</h3>
                    <p className="text-sm text-foreground/60">{meeting.venue}</p>
                  </div>
                  <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded">{meeting.date}</span>
                </div>
                {meeting.attendance > 0 && (
                  <div className="flex items-center gap-4 mt-2 text-sm text-foreground/60">
                    <span>{meeting.attendance} parents attended</span>
                    <span>-</span>
                    <span>UGX {meeting.contributions.toLocaleString()} raised</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Schedule Meeting</h2>
              <button onClick={() => setShowNew(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddMeeting} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Title</label>
                <input type="text" required value={newMeeting.title} onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input type="date" required value={newMeeting.date} onChange={(e) => setNewMeeting({ ...newMeeting, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Venue</label>
                <input type="text" required value={newMeeting.venue} onChange={(e) => setNewMeeting({ ...newMeeting, venue: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}