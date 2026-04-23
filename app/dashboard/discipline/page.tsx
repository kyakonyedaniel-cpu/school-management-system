'use client';

import { Plus, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

const incidents = [
  { id: 1, student: 'John Okello', class: 'P.7', type: 'Late Coming', date: 'Apr 20, 2026', action: 'Warning Letter', status: 'Pending' },
  { id: 2, student: 'Sarah Nakato', class: 'S.1', type: 'Uniform Violation', date: 'Apr 19, 2026', action: 'Warning Letter', status: 'Resolved' },
  { id: 3, student: 'David Ssebu', class: 'P.6', type: 'Fighting', date: 'Apr 18, 2026', action: 'Suspension', status: 'Under Review' },
  { id: 4, student: 'Peter Wasswa', class: 'S.2', type: 'Homework Default', date: 'Apr 17, 2026', action: 'Community Service', status: 'Resolved' },
];

export default function DisciplinePage() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">12</h3><p className="text-sm text-foreground/60">Pending Cases</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div><h3 className="text-2xl font-bold">3</h3><p className="text-sm text-foreground/60">Under Review</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">45</h3><p className="text-sm text-foreground/60">Total Incidents</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">38</h3><p className="text-sm text-foreground/60">Resolved</p></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Recent Discipline Cases</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Incident Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Action Taken</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((incident) => (
                <tr key={incident.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{incident.student}</td>
                  <td className="px-4 py-3 text-sm">{incident.class}</td>
                  <td className="px-4 py-3 text-sm">{incident.type}</td>
                  <td className="px-4 py-3 text-sm">{incident.date}</td>
                  <td className="px-4 py-3 text-sm">{incident.action}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${incident.status === 'Resolved' ? 'bg-green-100 text-green-700' : incident.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {incident.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}