'use client';

import { Plus, Heart as HealthIcon, CheckCircle } from 'lucide-react';

const healthRecords = [
  { id: 1, student: 'John Okello', class: 'P.7', condition: 'Asthma', medication: 'Inhaler', allergies: 'Dust', lastCheckup: 'Mar 2026', notes: 'Regular checkups required' },
  { id: 2, student: 'Sarah Nakato', class: 'S.1', condition: 'None', medication: 'None', allergies: 'Peanuts', lastCheckup: 'Jan 2026', notes: 'Avoid all nut products' },
  { id: 3, student: 'David Ssebu', class: 'P.6', condition: 'Sickle Cell', medication: 'Folic Acid', allergies: 'None', lastCheckup: 'Feb 2026', notes: 'Stay hydrated' },
];

export default function HealthPage() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">300</h3><p className="text-sm text-foreground/60">Total Students</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">8</h3><p className="text-sm text-foreground/60">With Conditions</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><HealthIcon className="w-6 h-6 text-red-600" /></div>
            <div><h3 className="text-2xl font-bold">15</h3><p className="text-sm text-foreground/60">With Allergies</p></div>
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
          <h2 className="font-semibold">Student Health Records</h2>
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
              </tr>
            </thead>
            <tbody>
              {healthRecords.map((record) => (
                <tr key={record.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{record.student}</td>
                  <td className="px-4 py-3 text-sm">{record.class}</td>
                  <td className="px-4 py-3 text-sm">{record.condition}</td>
                  <td className="px-4 py-3 text-sm">{record.medication}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${record.allergies === 'None' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {record.allergies}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{record.lastCheckup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
