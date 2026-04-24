"use client";

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

const curriculumData = {
  primary: [
    { level: 'P.1', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Art & Craft', 'Music', 'Hygiene'] },
    { level: 'P.2', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Art & Craft', 'Music', 'Science'] },
    { level: 'P.3', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies'] },
    { level: 'P.4', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies'] },
    { level: 'P.5', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies', 'Agriculture'] },
    { level: 'P.6', subjects: ['English', 'Mathematics', 'Literacy', 'Religious Education', 'Physical Education', 'Science & Technology', 'Social Studies', 'Agriculture'] },
    { level: 'P.7', subjects: ['English', 'Mathematics', 'Science', 'Social Studies', 'Religious Education', 'Physical Education', 'Agriculture', 'Technology'] },
  ],
  secondary: [
    { level: 'S.1', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer'] },
    { level: 'S.2', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer'] },
    { level: 'S.3', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer', 'Elective Maths'] },
    { level: 'S.4', subjects: ['English', 'Mathematics', 'Biology', 'Physics', 'Chemistry', 'Geography', 'History', 'CRE', 'Computer'] },
    { level: 'S.5', subjects: ['English', 'Literature', 'Mathematics', 'Economics', 'Geography', 'History', 'CRE', 'Entrepreneurship'] },
    { level: 'S.6', subjects: ['English', 'Literature', 'Advanced Mathematics', 'Economics', 'Geography', 'History', 'CRE', 'Entrepreneurship'] },
  ],
};

export default function CurriculumPage() {
  const [selectedLevel, setSelectedLevel] = useState('All Levels');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Curriculum</h1>
          <p className="text-foreground/60">Manage subjects by class level</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Subject
        </button>
      </div>

      {/* Primary */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Primary (P.1 - P.7)</h3>
        </div>
        <div className="divide-y">
          {curriculumData.primary.map((level) => (
            <div key={level.level} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{level.level}</p>
                <p className="text-sm text-foreground/60">{level.subjects.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                <button className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secondary */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Secondary (S.1 - S.6)</h3>
        </div>
        <div className="divide-y">
          {curriculumData.secondary.map((level) => (
            <div key={level.level} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{level.level}</p>
                <p className="text-sm text-foreground/60">{level.subjects.join(', ')}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                <button className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
