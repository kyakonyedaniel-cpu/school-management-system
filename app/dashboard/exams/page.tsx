'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Download, Upload, Search, Calendar, Users, Clock, FileText, Filter, CheckCircle, AlertTriangle } from 'lucide-react';
import { useExams, useExamResults, useStudents, classes, parseCSV } from '@/lib/data';

const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'CRE', 'Art & Craft', 'Physical Education', 'Music', 'Geography', 'History', 'Biology', 'Chemistry', 'Physics', 'Computer Studies', 'French', 'Agriculture'];
const terms = ['Term I', 'Term II', 'Term III'];
const durations = ['30 mins', '1 hour', '1.5 hours', '2 hours', '2.5 hours', '3 hours'];

export default function ExamsPage() {
  const { exams, addExam, updateExam, deleteExam } = useExams();
  const { results } = useExamResults();
  const { students } = useStudents();
  const [showModal, setShowModal] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedTerm, setSelectedTerm] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [formData, setFormData] = useState({
    name: '', class: 'P.7', date: '', time: '', duration: '1 hour', status: 'Upcoming', subject: '', term: 'Term I', year: '2026', venue: '', instructions: ''
  });

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.subject || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || e.class === selectedClass;
    const matchesTerm = selectedTerm === 'All' || e.term === selectedTerm;
    const matchesStatus = selectedStatus === 'All' || e.status === selectedStatus;
    return matchesSearch && matchesClass && matchesTerm && matchesStatus;
  });

  const upcomingExams = exams.filter(e => e.status === 'Upcoming' || e.status === 'Due Soon');
  const completedExams = exams.filter(e => e.status === 'Completed' || e.status === 'Published');
  const totalResults = results.length;

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExamId) {
      updateExam(editingExamId, formData);
      setEditingExamId(null);
    } else {
      addExam(formData);
    }
    setShowModal(false);
    setFormData({ name: '', class: 'P.7', date: '', time: '', duration: '1 hour', status: 'Upcoming', subject: '', term: 'Term I', year: '2026', venue: '', instructions: '' });
  };

  const handleEdit = (exam: typeof exams[0]) => {
    setFormData({
      name: exam.name, class: exam.class, date: exam.date, time: (exam as any).time || '',
      duration: exam.duration, status: exam.status, subject: exam.subject || '',
      term: (exam as any).term || 'Term I', year: (exam as any).year || '2026',
      venue: (exam as any).venue || '', instructions: (exam as any).instructions || ''
    });
    setEditingExamId(exam.id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      deleteExam(id);
    }
  };

  const markCompleted = (id: string) => {
    updateExam(id, { status: 'Completed' });
  };

  const markPublished = (id: string) => {
    updateExam(id, { status: 'Published' });
  };

  const exportExams = () => {
    const headers = ['Exam Name', 'Subject', 'Class', 'Term', 'Date', 'Time', 'Duration', 'Venue', 'Status', 'Year'];
    const rows = filteredExams.map(e => [
      e.name, e.subject || '', e.class, (e as any).term || '', e.date,
      (e as any).time || '', e.duration, (e as any).venue || '', e.status, (e as any).year || '2026'
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exams-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importExams = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.class) {
          addExam({
            name: row.name,
            subject: row.subject || '',
            class: row.class,
            date: row.date || '',
            duration: row.duration || '1 hour',
            status: row.status || 'Upcoming',
            term: row.term || 'Term I',
            year: row.year || '2026',
          });
        }
      });
    };
    reader.readAsText(file);
  };

  const examResultsCount = (examName: string) => results.filter(r => r.examName === examName).length;

  const getInitials = (cls: string) => cls.replace('.', '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-foreground/60">Schedule and manage examinations</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} /><span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importExams} className="hidden" />
          </label>
          <button onClick={exportExams} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} /><span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => { setEditingExamId(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Schedule Exam
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{exams.length}</h3><p className="text-sm text-foreground/60">Total Exams</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{upcomingExams.length}</h3><p className="text-sm text-foreground/60">Upcoming</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{completedExams.length}</h3><p className="text-sm text-foreground/60">Completed</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-purple-600" /></div>
            <div><h3 className="text-2xl font-bold">{totalResults}</h3><p className="text-sm text-foreground/60">Results Entered</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={14} />
              <input type="text" placeholder="Search exams..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border w-48" />
            </div>
            <div className="flex items-center gap-1">
              <Filter size={14} className="text-foreground/40" />
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="text-sm rounded-lg border border-border px-2 py-1.5">
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="text-sm rounded-lg border border-border px-2 py-1.5">
                <option value="All">All Terms</option>
                {terms.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="text-sm rounded-lg border border-border px-2 py-1.5">
                <option value="All">All Status</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Due Soon">Due Soon</option>
                <option value="Completed">Completed</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>
          <span className="text-sm text-foreground/60">{filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''}</span>
        </div>

        {filteredExams.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar size={48} className="mx-auto mb-4 text-foreground/20" />
            <p className="font-medium text-foreground/60">No exams found</p>
            <p className="text-sm text-foreground/40 mt-1">Schedule your first exam or adjust filters</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredExams.map(exam => {
              const resultCount = examResultsCount(exam.name);
              const isCompleted = exam.status === 'Completed' || exam.status === 'Published';
              return (
                <div key={exam.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">{getInitials(exam.class)}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{exam.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                            exam.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-700' :
                            exam.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>{exam.status}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-foreground/60">
                          <span className="flex items-center gap-1"><FileText size={12} />{exam.subject || 'All Subjects'}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} />{exam.date}</span>
                          <span className="flex items-center gap-1"><Clock size={12} />{exam.duration}</span>
                          {(exam as any).time && <span className="flex items-center gap-1">at {(exam as any).time}</span>}
                          {(exam as any).venue && <span className="flex items-center gap-1">📍 {(exam as any).venue}</span>}
                        </div>
                        {isCompleted && resultCount > 0 && (
                          <p className="text-xs text-foreground/40 mt-1">{resultCount} results recorded</p>
                        )}
                        {isCompleted && resultCount === 0 && (
                          <p className="text-xs text-amber-600 mt-1 flex items-center gap-1"><AlertTriangle size={12} />No results entered yet</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!isCompleted && (
                        <button onClick={() => markCompleted(exam.id)} className="px-2 py-1 text-xs border border-green-200 text-green-700 rounded hover:bg-green-50">
                          Mark Complete
                        </button>
                      )}
                      {exam.status === 'Completed' && (
                        <button onClick={() => markPublished(exam.id)} className="px-2 py-1 text-xs border border-purple-200 text-purple-700 rounded hover:bg-purple-50">
                          Publish Results
                        </button>
                      )}
                      <button onClick={() => handleEdit(exam)} className="p-2 hover:bg-blue-50 rounded">
                        <Edit size={14} className="text-blue-600" />
                      </button>
                      <button onClick={() => handleDelete(exam.id)} className="p-2 hover:bg-red-50 rounded">
                        <Trash2 size={14} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingExamId ? 'Edit Exam' : 'Schedule New Exam'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleExamSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Exam Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mid-Term Exams"
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject (optional)</label>
                  <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    <option value="">All Subjects</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    {classes.filter(c => c !== 'All Classes').map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Term</label>
                  <select value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    {terms.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Year</label>
                  <input type="text" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time (optional)</label>
                  <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    {durations.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Venue (optional)</label>
                <input type="text" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="e.g. Main Hall, Room 12"
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Instructions (optional)</label>
                <textarea value={formData.instructions} onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows={2} placeholder="e.g. Bring calculator, no phones allowed"
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border focus:border-primary outline-none">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Completed">Completed</option>
                  <option value="Published">Published</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  {editingExamId ? 'Update Exam' : 'Schedule Exam'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
