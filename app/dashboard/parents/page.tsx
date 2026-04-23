'use client';

import { Users, Calendar, DollarSign, Plus, Phone, Mail } from 'lucide-react';

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
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">300</h3>
              <p className="text-sm text-foreground/60">Registered Parents</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">4</h3>
              <p className="text-sm text-foreground/60">Meetings This Year</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
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
        <div className="bg-white rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">PTA Executive Committee</h2>
            <button className="text-sm text-primary hover:underline">View All Parents</button>
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
                    <p className="text-sm text-foreground/60">{member.role} • Parent of {member.child}</p>
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

        <div className="bg-white rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Upcoming Meetings</h2>
            <button className="text-sm text-primary hover:underline">Schedule New</button>
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
                    <span>•</span>
                    <span>UGX {meeting.contributions.toLocaleString()} raised</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}