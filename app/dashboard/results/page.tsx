'use client';

import { useState } from 'react';
import { FileText, Download, CheckCircle, Plus, Search, X } from 'lucide-react';
import { useStudents, useExams, formatUGX } from '@/lib/data';

export default function ResultsPage() {
  const { students } = useStudents();
  const { exams } = useExams();
  const [searchTerm, setSearchTerm] = useState('');

  const publishedCount = exams.filter(e => e.status === 'Published' || e.status === 'Completed').length;

  const filteredExams = exams.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{exams.length}</h3><p className="text-sm text-foreground/60">Exams Tracked</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{publishedCount}</h3><p className="text-sm text-foreground/60">Published</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{exams.filter(e => e.status === 'Due Soon' || e.status === 'Upcoming').length}</h3><p className="text-sm text-foreground/60">Upcoming</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-primary" /></div>
            <div><h3 className="text-2xl font-bold">{students.length}</h3><p className="text-sm text-foreground/60">Students</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Exam Results</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-border rounded-lg"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Exam Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{exam.name}</td>
                  <td className="px-4 py-3 text-sm">{exam.class}</td>
                  <td className="px-4 py-3 text-sm">{exam.date}</td>
                  <td className="px-4 py-3 text-sm">{exam.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'Published' || exam.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      exam.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {exam.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredExams.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-foreground/60">
                    No exams found. Add exams from the Exams page.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Quick Stats</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-foreground/60">Average Performance</p>
            <p className="text-2xl font-bold text-primary">72%</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-foreground/60">Top Performer</p>
            <p className="text-sm font-medium">P.7 Class</p>
            <p className="text-xs text-foreground/60">78% average</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm text-foreground/60">Needs Improvement</p>
            <p className="text-sm font-medium">S.4 Class</p>
            <p className="text-xs text-foreground/60">65% average</p>
          </div>
        </div>
      </div>
    </div>
  );
}