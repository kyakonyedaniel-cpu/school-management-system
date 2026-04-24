"use client";

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { useStudents, classes, generateId } from '@/lib/data';

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', class: 'P.1', gender: 'Male', parent: '', phone: '', admissionNo: '', fees: 'Pending'
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getFeesColor = (fees: string) => {
    switch (fees) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-foreground bg-muted';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent) {
      updateStudent(editingStudent.id, formData);
    } else {
      addStudent({ ...formData, status: 'Active' });
    }
    setShowAddModal(false);
    setEditingStudent(null);
    setFormData({ name: '', class: 'P.1', gender: 'Male', parent: '', phone: '', admissionNo: '', fees: 'Pending' });
  };

  const handleEdit = (student: any) => {
    setFormData(student);
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-foreground/60">{filteredStudents.length} total students</p>
        </div>
        <button onClick={() => { setEditingStudent(null); setFormData({ name: '', class: 'P.1', gender: 'Male', parent: '', phone: '', admissionNo: `ST/2024/${String(students.length + 1).padStart(3, '0')}`, fees: 'Pending' }); setShowAddModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Student
        </button>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input type="text" placeholder="Search by name or admission number..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
          </div>
          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
            {classes.map(cls => <option key={cls} value={cls}>{cls}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Class</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Gender</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Parent</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Fees</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                        {student.name.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-foreground/60">{student.admissionNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{student.class}</td>
                  <td className="px-6 py-4 text-sm">{student.gender}</td>
                  <td className="px-6 py-4 text-sm">{student.parent}</td>
                  <td className="px-6 py-4 text-sm">{student.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeesColor(student.fees)}`}>{student.fees}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(student)} className="p-1.5 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(student.id)} className="p-1.5 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border">
          <p className="text-sm text-foreground/60">Showing {filteredStudents.length} of {students.length} students</p>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Parent/Guardian Name</label>
                <input type="text" required value={formData.parent} onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Admission Number</label>
                <input type="text" required value={formData.admissionNo} onChange={(e) => setFormData({ ...formData, admissionNo: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fees Status</label>
                <select value={formData.fees} onChange={(e) => setFormData({ ...formData, fees: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  {editingStudent ? 'Update' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}