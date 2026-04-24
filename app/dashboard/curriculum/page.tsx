"use client";

import { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';

interface LevelData {
  level: string;
  subjects: string[];
}

interface CurriculumData {
  primary: LevelData[];
  secondary: LevelData[];
}

const initialCurriculum: CurriculumData = {
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
  const [curriculum, setCurriculum] = useState<CurriculumData>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('school_curriculum');
      return stored ? JSON.parse(stored) : initialCurriculum;
    }
    return initialCurriculum;
  });
  const [showAdd, setShowAdd] = useState(false);
  const [editingLevel, setEditingLevel] = useState<string | null>(null);
  const [form, setForm] = useState({ level: '', section: 'primary', subject: '' });

  const handleSave = () => {
    localStorage.setItem('school_curriculum', JSON.stringify(curriculum));
  };

  const handleAddLevel = (e: React.FormEvent) => {
    e.preventDefault();
    const newLevel = { level: form.level, subjects: [] };
    if (form.section === 'primary') {
      setCurriculum(prev => ({ ...prev, primary: [...prev.primary, newLevel] }));
    } else {
      setCurriculum(prev => ({ ...prev, secondary: [...prev.secondary, newLevel] }));
    }
    handleSave();
    setShowAdd(false);
    setForm({ level: '', section: 'primary', subject: '' });
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    
    if (form.section === 'primary') {
      setCurriculum(prev => ({
        ...prev,
        primary: prev.primary.map(p => 
          p.level === form.level ? { ...p, subjects: [...p.subjects, form.subject.trim()] } : p
        )
      }));
    } else {
      setCurriculum(prev => ({
        ...prev,
        secondary: prev.secondary.map(s => 
          s.level === form.level ? { ...s, subjects: [...s.subjects, form.subject.trim()] } : s
        )
      }));
    }
    handleSave();
    setForm({ ...form, subject: '' });
  };

  const handleDeleteLevel = (level: string, section: 'primary' | 'secondary') => {
    if (section === 'primary') {
      setCurriculum(prev => ({
        ...prev,
        primary: prev.primary.filter(p => p.level !== level)
      }));
    } else {
      setCurriculum(prev => ({
        ...prev,
        secondary: prev.secondary.filter(s => s.level !== level)
      }));
    }
    handleSave();
  };

  const handleDeleteSubject = (level: string, section: 'primary' | 'secondary', subjectIndex: number) => {
    if (section === 'primary') {
      setCurriculum(prev => ({
        ...prev,
        primary: prev.primary.map(p => 
          p.level === level ? { ...p, subjects: p.subjects.filter((_, i) => i !== subjectIndex) } : p
        )
      }));
    } else {
      setCurriculum(prev => ({
        ...prev,
        secondary: prev.secondary.map(s => 
          s.level === level ? { ...s, subjects: s.subjects.filter((_, i) => i !== subjectIndex) } : s
        )
      }));
    }
    handleSave();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Curriculum</h1>
          <p className="text-foreground/60">Manage subjects by class level</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Class Level
        </button>
      </div>

      {/* Primary */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Primary (P.1 - P.7)</h3>
        </div>
        <div className="divide-y">
          {curriculum.primary.map((level) => (
            <div key={level.level} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium">{level.level}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingLevel(level.level); setForm({ ...form, level: level.level, section: 'primary' }); }}
                    className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                  <button onClick={() => handleDeleteLevel(level.level, 'primary')}
                    className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-2">
                    {subject}
                    <button onClick={() => handleDeleteSubject(level.level, 'primary', idx)} className="hover:text-red-600">
                      <X size={14} />
                    </button>
                  </span>
                ))}
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
          {curriculum.secondary.map((level) => (
            <div key={level.level} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <p className="font-medium">{level.level}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingLevel(level.level); setForm({ ...form, level: level.level, section: 'secondary' }); }}
                    className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                  <button onClick={() => handleDeleteLevel(level.level, 'secondary')}
                    className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {level.subjects.map((subject, idx) => (
                  <span key={idx} className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-2">
                    {subject}
                    <button onClick={() => handleDeleteSubject(level.level, 'secondary', idx)} className="hover:text-red-600">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Class Level Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Class Level</h2>
              <button onClick={() => setShowAdd(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLevel} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section</label>
                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="primary">Primary (P.1 - P.7)</option>
                  <option value="secondary">Secondary (S.1 - S.6)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class Level</label>
                <input type="text" required value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                  placeholder="e.g. P.1 or S.1"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {editingLevel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Subject to {form.level}</h2>
              <button onClick={() => setEditingLevel(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name</label>
                <input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setEditingLevel(null)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}