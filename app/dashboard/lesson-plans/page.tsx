'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, CheckCircle, XCircle, Clock, Eye, Download } from 'lucide-react';

interface LessonPlan {
  id: number;
  staffId: string;
  staffName: string;
  subject: string;
  class: string;
  term: string;
  week: number;
  topic: string;
  objectives: string;
  materials: string;
  activities: string;
  assessment: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedBy?: string;
  reviewDate?: string;
  feedback?: string;
}

export default function LessonPlansPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'submit'>('plans');
  const [plans, setPlans] = useState<LessonPlan[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewingPlan, setReviewingPlan] = useState<LessonPlan | null>(null);
  const [feedback, setFeedback] = useState('');
  const [form, setForm] = useState({ staffId: '', subject: '', class: '', term: 'Term 1', week: 1, topic: '', objectives: '', materials: '', activities: '', assessment: '' });

  const classes = ['P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];
  const terms = ['Term 1', 'Term 2', 'Term 3'];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('school_lesson_plans') || '[]');
    setPlans(stored);
    const storedStaff = JSON.parse(localStorage.getItem('school_staff') || '[]');
    setStaff(storedStaff);
  }, []);

  const savePlans = (updated: LessonPlan[]) => {
    setPlans(updated);
    localStorage.setItem('school_lesson_plans', JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!form.staffId || !form.subject || !form.topic) return alert('Please fill required fields');
    const teacher = staff.find((s: any) => s.id === form.staffId);
    const plan: LessonPlan = { id: Date.now(), ...form, staffName: teacher?.name || 'Unknown', status: 'pending', submittedDate: new Date().toISOString() };
    savePlans([...plans, plan]);
    setShowSubmitModal(false);
    setForm({ staffId: '', subject: '', class: '', term: 'Term 1', week: 1, topic: '', objectives: '', materials: '', activities: '', assessment: '' });
    alert('Lesson plan submitted for review');
  };

  const handleReview = (status: 'approved' | 'rejected') => {
    if (!reviewingPlan) return;
    const updated = plans.map(p => p.id === reviewingPlan.id ? { ...p, status, reviewedBy: 'Admin', reviewDate: new Date().toISOString(), feedback: feedback || (status === 'approved' ? 'Approved' : 'Rejected - please revise') } : p);
    savePlans(updated);
    setShowReviewModal(false);
    setReviewingPlan(null);
    setFeedback('');
    alert(`Lesson plan ${status}`);
  };

  const filtered = search ? plans.filter(p => p.topic.toLowerCase().includes(search.toLowerCase()) || p.subject.toLowerCase().includes(search.toLowerCase()) || p.staffName.toLowerCase().includes(search.toLowerCase())) : plans;
  const stats = { pending: plans.filter(p => p.status === 'pending').length, approved: plans.filter(p => p.status === 'approved').length, rejected: plans.filter(p => p.status === 'rejected').length };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lesson Plans</h1>
          <p className="text-foreground/60">Submit and review teacher lesson plans</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold text-yellow-600">{stats.pending}</p><p className="text-sm text-foreground/60">Pending Review</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold text-green-600">{stats.approved}</p><p className="text-sm text-foreground/60">Approved</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold text-red-600">{stats.rejected}</p><p className="text-sm text-foreground/60">Rejected</p></div>
      </div>

      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 bg-background border rounded-lg p-1">
          {(['plans', 'submit'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-primary text-white' : 'text-foreground/60 hover:text-foreground'}`}>{tab === 'submit' ? 'Submit Plan' : 'All Plans'}</button>
          ))}
        </div>
        {activeTab === 'plans' && <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search plans..." className="w-64 pl-10 pr-4 py-2 rounded-lg border border-border" /></div>}
      </div>

      {activeTab === 'submit' ? (
        <div className="bg-background rounded-xl border p-6 max-w-2xl">
          <h2 className="font-semibold mb-4">Submit New Lesson Plan</h2>
          <div className="space-y-4">
            <select value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border">
              <option value="">Select Teacher</option>
              {staff.filter((s: any) => s.role === 'Teacher' || !s.role).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="Subject" className="px-4 py-2 rounded-lg border border-border" />
              <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="px-4 py-2 rounded-lg border border-border"><option value="">Class</option>{classes.map(c => <option key={c} value={c}>{c}</option>)}</select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <select value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })} className="px-4 py-2 rounded-lg border border-border">{terms.map(t => <option key={t} value={t}>{t}</option>)}</select>
              <input type="number" value={form.week} onChange={(e) => setForm({ ...form, week: parseInt(e.target.value) || 1 })} min={1} max={14} placeholder="Week" className="px-4 py-2 rounded-lg border border-border" />
              <input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} placeholder="Topic *" className="px-4 py-2 rounded-lg border border-border" />
            </div>
            <textarea value={form.objectives} onChange={(e) => setForm({ ...form, objectives: e.target.value })} placeholder="Learning Objectives" rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
            <textarea value={form.materials} onChange={(e) => setForm({ ...form, materials: e.target.value })} placeholder="Materials Needed" rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
            <textarea value={form.activities} onChange={(e) => setForm({ ...form, activities: e.target.value })} placeholder="Learning Activities" rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
            <textarea value={form.assessment} onChange={(e) => setForm({ ...form, assessment: e.target.value })} placeholder="Assessment Method" rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
            <button onClick={handleSubmit} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">Submit for Review</button>
          </div>
        </div>
      ) : (
        <div className="bg-background rounded-xl border">
          <div className="divide-y">
            {filtered.length > 0 ? filtered.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                <div className="flex items-center gap-3">
                  {p.status === 'approved' ? <CheckCircle size={18} className="text-green-600" /> : p.status === 'rejected' ? <XCircle size={18} className="text-red-600" /> : <Clock size={18} className="text-yellow-600" />}
                  <div>
                    <p className="font-medium">{p.topic}</p>
                    <p className="text-sm text-foreground/60">{p.subject} • {p.class} • {p.term} Week {p.week} • {p.staffName}</p>
                    <p className="text-xs text-foreground/60">Submitted: {new Date(p.submittedDate).toLocaleDateString('en-UG')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.status === 'pending' && <button onClick={() => { setReviewingPlan(p); setFeedback(''); setShowReviewModal(true); }} className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"><Eye size={14} /> Review</button>}
                  <span className={`px-2 py-1 rounded-full text-xs ${p.status === 'approved' ? 'bg-green-100 text-green-600' : p.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{p.status}</span>
                </div>
              </div>
            )) : <p className="p-8 text-center text-foreground/60">No lesson plans found</p>}
          </div>
        </div>
      )}

      {showReviewModal && reviewingPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Review Lesson Plan</h2>
            <div className="space-y-3 mb-4">
              <p><strong>Topic:</strong> {reviewingPlan.topic}</p>
              <p><strong>Subject:</strong> {reviewingPlan.subject} • <strong>Class:</strong> {reviewingPlan.class} • <strong>Week:</strong> {reviewingPlan.week}</p>
              <p><strong>Objectives:</strong> {reviewingPlan.objectives}</p>
              <p><strong>Materials:</strong> {reviewingPlan.materials}</p>
              <p><strong>Activities:</strong> {reviewingPlan.activities}</p>
              <p><strong>Assessment:</strong> {reviewingPlan.assessment}</p>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Review feedback..." rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReviewModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={() => handleReview('rejected')} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reject</button>
              <button onClick={() => handleReview('approved')} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Approve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
