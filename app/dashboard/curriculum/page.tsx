"use client";

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

interface LevelData {
  level: string;
  subjects: string[];
}

interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'addSubject';
  section: 'primary' | 'secondary';
  levelIndex: number | null;
  level: string;
  subjects: string;
  newSubject: string;
}

const initialCurriculum = {
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
  const [curriculum, setCurriculum] = useState(initialCurriculum);
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [deleteConfirm, setDeleteConfirm] = useState<{section: 'primary' | 'secondary', index: number} | null>(null);
  const [editingLevel, setEditingLevel] = useState<{section: 'primary' | 'secondary', index: number} | null>(null);
  const [newSubjectInput, setNewSubjectInput] = useState('');
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    mode: 'add',
    section: 'primary',
    levelIndex: null,
    level: '',
    subjects: '',
    newSubject: ''
  });

  const allLevels = [
    { value: 'All Levels', label: 'All Levels' },
    ...curriculum.primary.map(l => ({ value: l.level, label: l.level })),
    ...curriculum.secondary.map(l => ({ value: l.level, label: l.level })),
  ];

  const openAddModal = (section: 'primary' | 'secondary') => {
    setModal({ isOpen: true, mode: 'add', section, levelIndex: null, level: '', subjects: '', newSubject: '' });
  };

  const openEditModal = (section: 'primary' | 'secondary', index: number) => {
    const levelData = curriculum[section][index];
    setModal({
      isOpen: true,
      mode: 'edit',
      section,
      levelIndex: index,
      level: levelData.level,
      subjects: levelData.subjects.join(', '),
      newSubject: ''
    });
  };

  const closeModal = () => {
    setModal({ isOpen: false, mode: 'add', section: 'primary', levelIndex: null, level: '', subjects: '', newSubject: '' });
  };

  const handleSave = () => {
    if (!modal.level.trim()) return;
    
    const subjectsArray = modal.subjects.split(',').map(s => s.trim()).filter(Boolean);
    const newLevel: LevelData = { level: modal.level, subjects: subjectsArray };

    setCurriculum(prev => {
      const updated = { ...prev };
      if (modal.mode === 'add') {
        updated[modal.section] = [...updated[modal.section], newLevel];
      } else if (modal.levelIndex !== null) {
        updated[modal.section] = [...updated[modal.section]];
        updated[modal.section][modal.levelIndex] = newLevel;
      }
      return updated;
    });

    closeModal();
  };

  const handleDelete = (section: 'primary' | 'secondary', index: number) => {
    setCurriculum(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
    setDeleteConfirm(null);
  };

  const addSubject = (section: 'primary' | 'secondary', levelIndex: number) => {
    if (!newSubjectInput.trim()) return;
    
    setCurriculum(prev => {
      const updated = { ...prev };
      const level = { ...updated[section][levelIndex] };
      if (!level.subjects.includes(newSubjectInput.trim())) {
        level.subjects = [...level.subjects, newSubjectInput.trim()];
        updated[section] = [...updated[section]];
        updated[section][levelIndex] = level;
      }
      return updated;
    });
    setNewSubjectInput('');
  };

  const removeSubject = (section: 'primary' | 'secondary', levelIndex: number, subject: string) => {
    setCurriculum(prev => {
      const updated = { ...prev };
      const level = { ...updated[section][levelIndex] };
      level.subjects = level.subjects.filter(s => s !== subject);
      updated[section] = [...updated[section]];
      updated[section][levelIndex] = level;
      return updated;
    });
  };

  const filterLevels = (levels: LevelData[]) => {
    if (selectedLevel === 'All Levels') return levels;
    return levels.filter(l => l.level === selectedLevel);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Curriculum</h1>
          <p className="text-foreground/60">Manage subjects by class level</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-background"
          >
            {allLevels.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => openAddModal('primary')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            <Plus size={18} />Add Level
          </button>
        </div>
      </div>

      {/* Primary */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Primary (P.1 - P.7)</h3>
          <button
            onClick={() => openAddModal('primary')}
            className="flex items-center gap-1 text-sm px-3 py-1 border rounded-lg hover:bg-muted"
          >
            <Plus size={14} />Add
          </button>
        </div>
        <div className="divide-y">
          {filterLevels(curriculum.primary).map((level, idx) => {
            const originalIndex = curriculum.primary.indexOf(level);
            const isEditing = editingLevel?.section === 'primary' && editingLevel?.index === originalIndex;
            return (
              <div key={level.level} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{level.level}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isEditing) setEditingLevel(null);
                        else setEditingLevel({ section: 'primary', index: originalIndex });
                      }}
                      className="p-2 rounded-lg hover:bg-muted"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ section: 'primary', index: originalIndex })}
                      className="p-2 rounded-lg hover:bg-muted text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {level.subjects.map(subject => (
                    <span key={subject} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                      {subject}
                      {isEditing && (
                        <button
                          onClick={() => removeSubject('primary', originalIndex, subject)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newSubjectInput}
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSubject('primary', originalIndex);
                        }
                      }}
                      placeholder="Add subject..."
                      className="flex-1 px-3 py-1 text-sm border rounded-lg bg-background"
                    />
                    <button
                      onClick={() => addSubject('primary', originalIndex)}
                      className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Secondary (S.1 - S.6)</h3>
          <button
            onClick={() => openAddModal('secondary')}
            className="flex items-center gap-1 text-sm px-3 py-1 border rounded-lg hover:bg-muted"
          >
            <Plus size={14} />Add
          </button>
        </div>
        <div className="divide-y">
          {filterLevels(curriculum.secondary).map((level, idx) => {
            const originalIndex = curriculum.secondary.indexOf(level);
            const isEditing = editingLevel?.section === 'secondary' && editingLevel?.index === originalIndex;
            return (
              <div key={level.level} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{level.level}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isEditing) setEditingLevel(null);
                        else setEditingLevel({ section: 'secondary', index: originalIndex });
                      }}
                      className="p-2 rounded-lg hover:bg-muted"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ section: 'secondary', index: originalIndex })}
                      className="p-2 rounded-lg hover:bg-muted text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {level.subjects.map(subject => (
                    <span key={subject} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                      {subject}
                      {isEditing && (
                        <button
                          onClick={() => removeSubject('secondary', originalIndex, subject)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newSubjectInput}
                      onChange={(e) => setNewSubjectInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          addSubject('secondary', originalIndex);
                        }
                      }}
                      placeholder="Add subject..."
                      className="flex-1 px-3 py-1 text-sm border rounded-lg bg-background"
                    />
                    <button
                      onClick={() => addSubject('secondary', originalIndex)}
                      className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {modal.mode === 'add' ? 'Add New Level' : 'Edit Level'}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-muted">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Level</label>
                <input
                  type="text"
                  value={modal.level}
                  onChange={(e) => setModal({ ...modal, level: e.target.value })}
                  placeholder="e.g., P.1 or S.1"
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subjects (comma-separated)</label>
                <textarea
                  value={modal.subjects}
                  onChange={(e) => setModal({ ...modal, subjects: e.target.value })}
                  placeholder="English, Mathematics, Science"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                <Save size={16} />Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="text-foreground/60 mb-4">
              Are you sure you want to delete this level? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.section, deleteConfirm.index)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
