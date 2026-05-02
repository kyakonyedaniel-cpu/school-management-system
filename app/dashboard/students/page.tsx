"use client";

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, MessageSquare, Printer, Download, Upload, CheckSquare, Square, RefreshCw, Camera, Eye, Users, Filter, Send, School, TrendingUp, DollarSign, UserCheck } from 'lucide-react';
import { useStudents, classes, generateId, parseCSV } from '@/lib/data';
import { generateStudentIdCard } from '@/lib/print';
import { sendWhatsApp, sendFeeReminder } from '@/lib/whatsapp';

export default function StudentsPage() {
  const { students, addStudent, updateStudent, deleteStudent } = useStudents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<any>(null);
  const [showBulkTransferModal, setShowBulkTransferModal] = useState(false);
  const [bulkTransferClass, setBulkTransferClass] = useState('');
  const [feesFilter, setFeesFilter] = useState<'All' | 'Paid' | 'Pending' | 'Overdue'>('All');
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');
  const [studentStats, setStudentStats] = useState({ total: 0, male: 0, female: 0, paid: 0, pending: 0, overdue: 0 });
  const [formData, setFormData] = useState({
    name: '', class: 'P.1', gender: 'Male', parent: '', phone: '', admissionNo: '', fees: 'Pending', photo: ''
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    const matchesFees = feesFilter === 'All' || student.fees === feesFilter;
    return matchesSearch && matchesClass && matchesFees;
  });

  useEffect(() => {
    const male = students.filter(s => s.gender === 'Male').length;
    const female = students.filter(s => s.gender === 'Female').length;
    const paid = students.filter(s => s.fees === 'Paid').length;
    const pending = students.filter(s => s.fees === 'Pending').length;
    const overdue = students.filter(s => s.fees === 'Overdue').length;
    setStudentStats({ total: students.length, male, female, paid, pending, overdue });
  }, [students]);

  const getFeesColor = (fees: string) => {
    switch (fees) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-foreground bg-muted';
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2000000) {
      alert('Photo must be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPhotoPreview(result);
      setFormData(prev => ({ ...prev, photo: result }));
    };
    reader.readAsDataURL(file);
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
    setPhotoPreview('');
    setFormData({ name: '', class: 'P.1', gender: 'Male', parent: '', phone: '', admissionNo: '', fees: 'Pending', photo: '' });
  };

  const handleEdit = (student: any) => {
    setFormData(student);
    setPhotoPreview(student.photo || '');
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      deleteStudent(id);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map(s => s.id));
    }
  };

  const exportStudents = () => {
    const headers = 'Name,Class,Admission No,Gender,Parent,Phone,Email,Fees,Status\n';
    const rows = filteredStudents.map(s => 
      `${s.name},${s.class},${s.admissionNo},${s.gender},${s.parent},${s.phone},${s.email || ''},${s.fees},${s.status}`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  const importStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.class) {
          addStudent({
            name: row.name,
            class: row.class,
            admissionNo: row.admissionNo || `ST/2026/${String(students.length + 1).padStart(3, '0')}`,
            gender: row.gender || 'Male',
            parent: row.parent || '',
            phone: row.phone || '',
            email: row.email || '',
            fees: row.fees || 'Pending',
            status: row.status || 'Active',
          });
        }
      });
    };
    reader.readAsText(file);
  };

  const bulkSendReminders = () => {
    const selected = students.filter(s => selectedStudents.includes(s.id));
    selected.forEach(s => sendFeeReminder(s, s.fees));
  };

  const bulkPrintIdCards = () => {
    const selected = students.filter(s => selectedStudents.includes(s.id));
    selected.forEach(s => generateStudentIdCard(s));
  };

  const viewStudentDetails = (student: any) => {
    setViewingStudent(student);
    setShowDetailsModal(true);
  };

  const executeBulkTransfer = () => {
    if (!bulkTransferClass || selectedStudents.length === 0) return;
    selectedStudents.forEach(id => {
      updateStudent(id, { class: bulkTransferClass });
    });
    setSelectedStudents([]);
    setShowBulkTransferModal(false);
    setBulkTransferClass('');
    alert(`Transferred ${selectedStudents.length} students to ${bulkTransferClass}`);
  };

  const bulkSendCustomMessage = () => {
    if (!bulkMessage || selectedStudents.length === 0) return;
    const selected = students.filter(s => selectedStudents.includes(s.id));
    selected.forEach(s => {
      const msg = bulkMessage.replace('{student}', s.name).replace('{parent}', s.parent).replace('{class}', s.class);
      sendWhatsApp(s.phone, msg);
    });
    setShowBulkMessageModal(false);
    setBulkMessage('');
    alert(`Message sent to ${selected.length} parents via WhatsApp`);
  };

  const classesList = classes.filter(c => c !== 'All Classes');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-foreground/60">{filteredStudents.length} total students</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importStudents} className="hidden" />
          </label>
          <button onClick={exportStudents} className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => { setEditingStudent(null); setPhotoPreview(''); setFormData({ name: '', class: 'P.1', gender: 'Male', parent: '', phone: '', admissionNo: `ST/2024/${String(students.length + 1).padStart(3, '0')}`, fees: 'Pending', photo: '' }); setShowAddModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add Student
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedStudents.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-wrap items-center gap-4">
          <span className="text-sm font-medium text-primary">{selectedStudents.length} selected</span>
          <button onClick={bulkSendReminders} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
            <MessageSquare size={14} />Send WhatsApp
          </button>
          <button onClick={bulkPrintIdCards} className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90">
            <Printer size={14} />Print ID Cards
          </button>
          <button onClick={() => { setBulkTransferClass(''); setShowBulkTransferModal(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
            <School size={14} />Transfer Class
          </button>
          <button onClick={() => { setBulkMessage(''); setShowBulkMessageModal(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700">
            <Send size={14} />Custom Message
          </button>
          <button onClick={() => setSelectedStudents([])} className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground">
            <X size={14} />Clear
          </button>
        </div>
      )}

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          <Users className="text-blue-600" size={24} />
          <div>
            <p className="text-2xl font-bold">{studentStats.total}</p>
            <p className="text-xs text-foreground/60">Total</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          <UserCheck className="text-indigo-600" size={24} />
          <div>
            <p className="text-2xl font-bold">{studentStats.male}</p>
            <p className="text-xs text-foreground/60">Male</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          <UserCheck className="text-pink-600" size={24} />
          <div>
            <p className="text-2xl font-bold">{studentStats.female}</p>
            <p className="text-xs text-foreground/60">Female</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          <DollarSign className="text-green-600" size={24} />
          <div>
            <p className="text-2xl font-bold">{studentStats.paid}</p>
            <p className="text-xs text-foreground/60">Paid</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          <TrendingUp className="text-yellow-600" size={24} />
          <div>
            <p className="text-2xl font-bold">{studentStats.pending}</p>
            <p className="text-xs text-foreground/60">Pending</p>
          </div>
        </div>
        <div className="bg-background border border-border rounded-lg p-4 flex items-center gap-3">
          <TrendingUp className="text-red-600" size={24} />
          <div>
            <p className="text-2xl font-bold">{studentStats.overdue}</p>
            <p className="text-xs text-foreground/60">Overdue</p>
          </div>
        </div>
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
          <select value={feesFilter} onChange={(e) => setFeesFilter(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
            <option value="All">All Fees Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium w-12">
                  <button onClick={toggleAll} className="p-1">
                    {selectedStudents.length === filteredStudents.length && filteredStudents.length > 0 ? 
                      <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">Student</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Class</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Gender</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Parent</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Fees</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStudent(student.id)} className="p-1">
                      {selectedStudents.includes(student.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {student.photo ? (
                        <img src={student.photo} alt={student.name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{student.class}</td>
                  <td className="px-4 py-3 text-sm">{student.gender}</td>
                  <td className="px-4 py-3 text-sm">{student.parent}</td>
                  <td className="px-4 py-3 text-sm">{student.phone}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${getFeesColor(student.fees)}`}>{student.fees}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => generateStudentIdCard(student)} className="p-2 hover:bg-muted rounded" title="Print ID Card">
                        <Printer size={16} />
                      </button>
                      <button onClick={() => sendFeeReminder(student, student.fees)} className="p-2 hover:bg-muted rounded" title="Send WhatsApp Reminder">
                        <MessageSquare size={16} />
                      </button>
                      <button onClick={() => handleEdit(student)} className="p-2 hover:bg-muted rounded" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(student.id)} className="p-2 hover:bg-red-50 text-red-600 rounded" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3 mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-border flex items-center justify-center overflow-hidden bg-muted/30">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-8 h-8 text-foreground/30" />
                  )}
                </div>
                <label className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg cursor-pointer text-sm hover:bg-primary/20">
                  <Camera size={14} />
                  {photoPreview ? 'Change Photo' : 'Add Photo'}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Student Name" required />
              <div className="grid grid-cols-2 gap-4">
                <select value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})}
                  className="px-3 py-2 rounded-lg border border-border">
                  {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
                </select>
                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="px-3 py-2 rounded-lg border border-border">
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <input type="text" value={formData.admissionNo} onChange={(e) => setFormData({...formData, admissionNo: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Admission Number" />
              <input type="text" value={formData.parent} onChange={(e) => setFormData({...formData, parent: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Parent Name" required />
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Phone Number" />
              <select value={formData.fees} onChange={(e) => setFormData({...formData, fees: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border">
                <option>Pending</option><option>Paid</option><option>Overdue</option>
              </select>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  {editingStudent ? 'Update' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && viewingStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Student Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-muted rounded"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                {viewingStudent.photo ? (
                  <img src={viewingStudent.photo} alt={viewingStudent.name} className="w-24 h-24 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-3xl font-medium">
                    {viewingStudent.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-lg font-semibold">{viewingStudent.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs ${getFeesColor(viewingStudent.fees)}`}>{viewingStudent.fees}</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Admission No</span>
                  <span className="text-sm font-medium">{viewingStudent.admissionNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Class</span>
                  <span className="text-sm font-medium">{viewingStudent.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Gender</span>
                  <span className="text-sm font-medium">{viewingStudent.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Parent</span>
                  <span className="text-sm font-medium">{viewingStudent.parent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Phone</span>
                  <span className="text-sm font-medium">{viewingStudent.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-foreground/60">Status</span>
                  <span className="text-sm font-medium">{viewingStudent.status || 'Active'}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { setShowDetailsModal(false); handleEdit(viewingStudent); }} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  <Edit size={16} className="inline mr-1" />Edit
                </button>
                <button onClick={() => generateStudentIdCard(viewingStudent)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  <Printer size={16} className="inline mr-1" />ID Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Transfer Modal */}
      {showBulkTransferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Bulk Transfer Students</h2>
              <button onClick={() => setShowBulkTransferModal(false)} className="p-1 hover:bg-muted rounded"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground/60">Transfer {selectedStudents.length} selected students to:</p>
              <select value={bulkTransferClass} onChange={(e) => setBulkTransferClass(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border">
                <option value="">Select Class</option>
                {classesList.map(cls => <option key={cls} value={cls}>{cls}</option>)}
              </select>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowBulkTransferModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={executeBulkTransfer} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Transfer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Message Modal */}
      {showBulkMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Send Custom Message</h2>
              <button onClick={() => setShowBulkMessageModal(false)} className="p-1 hover:bg-muted rounded"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-foreground/60">Send to {selectedStudents.length} selected students' parents. Use {'{student}'}, {'{parent}'}, {'{class}'} as placeholders.</p>
              <textarea value={bulkMessage} onChange={(e) => setBulkMessage(e.target.value)}
                placeholder="Dear {parent}, this is a message about {student} in {class}..."
                rows={4} className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowBulkMessageModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={bulkSendCustomMessage} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Send size={16} className="inline mr-1" />Send via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}