"use client";

import { useState } from 'react';
import { Plus, Edit, Search, Trash2, X } from 'lucide-react';
import { useStaff } from '@/lib/data';

const departments = ['Administration', 'Science', 'Languages', 'Mathematics', 'Social Studies', 'ICT', 'Physical Education'];

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active'
  });

  const filteredStaff = staff.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff(formData);
    }
    setShowModal(false);
    setEditingStaff(null);
    setFormData({ name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active' });
  };

  const handleEdit = (member: any) => {
    setFormData(member);
    setEditingStaff(member);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-foreground/60">{staff.length} staff members</p>
        </div>
        <button onClick={() => { setEditingStaff(null); setFormData({ name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active' }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Staff
        </button>
      </div>

      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input type="text" placeholder="Search staff..."
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Department</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Contact</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Status</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStaff.map((member) => (
              <tr key={member.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">{member.department}</td>
                <td className="px-4 py-3">
                  <p className="text-sm">{member.phone}</p>
                  <p className="text-xs text-foreground/60">{member.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => handleEdit(member)} className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(member.id)} className="p-2 rounded-lg hover:bg-muted text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingStaff ? 'Edit Staff' : 'Add New Staff'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role/Position</label>
                <input type="text" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Mathematics Teacher"
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none">
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border focus:border-primary outline-none" />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
                  {editingStaff ? 'Update' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}