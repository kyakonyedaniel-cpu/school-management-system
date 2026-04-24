'use client';

import { useState } from 'react';
import { FileText, Download, CheckCircle } from 'lucide-react';

const results = [
  { id: 1, class: 'P.7', term: 'Term I', exams: 'Mid-Term', average: 72, published: true, date: 'Mar 28, 2026' },
  { id: 2, class: 'S.4', term: 'Term I', exams: 'Mock UCE', average: 68, published: true, date: 'Mar 25, 2026' },
  { id: 3, class: 'P.5', term: 'Term I', exams: 'CA2', average: 75, published: false, date: 'Pending' },
];

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">12</h3><p className="text-sm text-foreground/60">Reports Generated</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">8</h3><p className="text-sm text-foreground/60">Published</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">4</h3><p className="text-sm text-foreground/60">Draft</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center"><Download className="w-6 h-6 text-primary" /></div>
            <div><h3 className="text-2xl font-bold">300</h3><p className="text-sm text-foreground/60">Students</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold">Exam Results</h2>
          <button className="text-sm text-primary hover:underline">View All Classes</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Term</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Exam Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class Average</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Date</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{result.class}</td>
                  <td className="px-4 py-3 text-sm">{result.term}</td>
                  <td className="px-4 py-3 text-sm">{result.exams}</td>
                  <td className="px-4 py-3 font-bold">{result.average}%</td>
                  <td className="px-4 py-3 text-sm">{result.date}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {result.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-sm text-primary hover:underline">View</button>
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
