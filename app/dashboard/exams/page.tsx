"use client";

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Download } from 'lucide-react';
import { useExams, classes } from '@/lib/data';

export default function ExamsPage() {
  const { exams, addExam, deleteExam } = useExams();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', class: 'P.7', date: '', duration: '1 hour', status: 'Upcoming', subject: ''
  });

  const upcomingExams = exams.filter(e => e.status === 'Upcoming' || e.status === 'Due Soon');
  const pastExams = exams.filter(e => e.status === 'Completed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExam(formData);
    setShowModal(false);
    setFormData({ name: '', class: 'P.7', date: '', duration: '1 hour', status: 'Upcoming', subject: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      deleteExam(id);
    }
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Exams</h1>
          <p className="text-foreground/60">Manage exams and assessments</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Schedule Exam
        </button>
      </div>

      {/* Upcoming Exams */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Upcoming Exams ({upcomingExams.length})</h3>
        </div>
        {upcomingExams.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">No upcoming exams scheduled</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">Exam Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Duration</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {upcomingExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{exam.name}</td>
                  <td className="px-4 py-3">{exam.class}</td>
                  <td className="px-4 py-3">{exam.date}</td>
                  <td className="px-4 py-3">{exam.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${exam.status === 'Upcoming' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Past Exams */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Past Exams ({pastExams.length})</h3>
        </div>
        {pastExams.length === 0 ? (
          <div className="p-8 text-center text-foreground/60">No past exams recorded</div>
        ) : (
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium">Exam Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Class</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Date</th>
                <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pastExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{exam.name}</td>
                  <td className="px-4 py-3">{exam.class}</td>
                  <td className="px-4 py-3">{exam.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">{exam.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-2 rounded-lg hover:bg-muted"><Download size={16} /></button>
                      <button onClick={() => handleDelete(exam.id)} className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Schedule New Exam</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. CA1 - Mathematics"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Mathematics"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Class</label>
                  <select value={formData.class} onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    <option value="30 mins">30 mins</option>
                    <option value="1 hour">1 hour</option>
                    <option value="2 hours">2 hours</option>
                    <option value="3 hours">3 hours</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Due Soon">Due Soon</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Schedule Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}