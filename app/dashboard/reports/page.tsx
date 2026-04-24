'use client';

import { FileText, Download, Eye, Star, TrendingUp, Users, Plus } from 'lucide-react';

const recentReports = [
  { id: 1, name: 'Term I Progress Report', class: 'P.7', date: 'Apr 15, 2026', status: 'Draft', students: 25 },
  { id: 2, name: 'Mid-Term Assessment', class: 'S.2', date: 'Mar 25, 2026', status: 'Published', students: 42 },
  { id: 3, name: 'Character Report', class: 'P.5', date: 'Mar 20, 2026', status: 'Published', students: 32 },
  { id: 4, name: 'Term I Fees Report', class: 'All', date: 'Mar 15, 2026', status: 'Published', students: 300 },
];

const gradingSystem = [
  { grade: 'A', mark: '90-100', description: 'Excellent', color: 'bg-green-500' },
  { grade: 'B', mark: '80-89', description: 'Very Good', color: 'bg-green-400' },
  { grade: 'C', mark: '70-79', description: 'Good', color: 'bg-yellow-400' },
  { grade: 'D', mark: '60-69', description: 'Satisfactory', color: 'bg-yellow-300' },
  { grade: 'E', mark: '50-59', description: 'Pass', color: 'bg-orange-300' },
  { grade: 'F', mark: '0-49', description: 'Fail', color: 'bg-red-300' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-foreground/60">Reports Generated</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">300</h3>
              <p className="text-sm text-foreground/60">Students Reported</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-yellow-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">72%</h3>
              <p className="text-sm text-foreground/60">Class Average</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Star className="w-6 h-6 text-purple-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">15</h3>
              <p className="text-sm text-foreground/60">A Grade Students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Recent Reports</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-border">
            {recentReports.map((report) => (
              <div key={report.id} className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{report.name}</h3>
                  <p className="text-sm text-foreground/60 mt-1">{report.class} • {report.date} • {report.students} students</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${report.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {report.status}
                  </span>
                  <button className="p-1.5 hover:bg-muted rounded"><Eye size={16} /></button>
                  <button className="p-1.5 hover:bg-muted rounded"><Download size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Grading System</h2>
          </div>
          <div className="p-4 space-y-3">
            {gradingSystem.map((g) => (
              <div key={g.grade} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${g.color} rounded flex items-center justify-center text-white font-bold`}>{g.grade}</div>
                  <div>
                    <p className="font-medium">{g.description}</p>
                    <p className="text-xs text-foreground/60">{g.mark}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
