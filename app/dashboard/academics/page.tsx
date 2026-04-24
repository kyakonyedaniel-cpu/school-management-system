'use client';

import { Plus } from 'lucide-react';

const academicTerms = [
  { term: 1, name: 'Term I', startDate: 'Feb 2, 2026', endDate: 'Apr 24, 2026', status: 'Current', progress: 75 },
  { term: 2, name: 'Term II', startDate: 'May 4, 2026', endDate: 'Aug 7, 2026', status: 'Upcoming', progress: 0 },
  { term: 3, name: 'Term III', startDate: 'Sep 7, 2026', endDate: 'Nov 27, 2026', status: 'Upcoming', progress: 0 },
];

const importantDates = [
  { event: 'Mid-Term Exams', date: 'Mar 20 - Mar 27, 2026', type: 'Exam' },
  { event: 'Parent-Teacher Meeting', date: 'Mar 28, 2026', type: 'Event' },
  { event: 'End of Term Exams', date: 'Apr 14 - Apr 21, 2026', type: 'Exam' },
  { event: 'Term I Ends', date: 'Apr 24, 2026', type: 'Holiday' },
  { event: 'Holiday Begins', date: 'Apr 25, 2026', type: 'Holiday' },
];

export default function AcademicsPage() {
  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {academicTerms.map((term) => (
          <div key={term.term} className={`bg-background rounded-xl border-2 p-6 ${term.status === 'Current' ? 'border-primary' : 'border-border'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">{term.name}</h3>
                <p className="text-sm text-foreground/60">{term.startDate} - {term.endDate}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${term.status === 'Current' ? 'bg-primary text-white' : 'bg-muted text-foreground/60'}`}>
                {term.status}
              </span>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{term.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: `${term.progress}%` }} />
              </div>
            </div>
            {term.status === 'Current' && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-foreground/60">Weeks remaining: <span className="font-medium text-foreground">4</span></p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Important Academic Dates - Term I</h2>
        </div>
        <div className="divide-y divide-border">
          {importantDates.map((item, index) => (
            <div key={index} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${item.type === 'Exam' ? 'bg-red-500' : item.type === 'Holiday' ? 'bg-green-500' : 'bg-blue-500'}`} />
                <div>
                  <h3 className="font-medium">{item.event}</h3>
                  <p className="text-sm text-foreground/60">{item.date}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${item.type === 'Exam' ? 'bg-red-100 text-red-700' : item.type === 'Holiday' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                {item.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
