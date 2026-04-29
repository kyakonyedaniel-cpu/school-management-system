"use client";

import { useState } from 'react';
import { Plus, Edit, Search, Trash2, X, Camera, Download, Upload } from 'lucide-react';
import { useStaff, parseCSV } from '@/lib/data';

const departments = ['Administration', 'Science', 'Languages', 'Mathematics', 'Social Studies', 'ICT', 'Physical Education'];

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active', photo: ''
  });

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
    setPhotoPreview('');
    setFormData({ name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active', photo: '' });
  };

  const handleEdit = (member: any) => {
    setFormData(member);
    setPhotoPreview(member.photo || '');
    setEditingStaff(member);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this staff member?')) {
      deleteStaff(id);
    }
  };

  const exportStaff = () => {
    const headers = ['Name', 'Role', 'Department', 'Phone', 'Email', 'Status'];
    const rows = filteredStaff.map(s => [s.name, s.role, s.department, s.phone, s.email, s.status]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importStaff = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.role) {
          addStaff({
            name: row.name,
            role: row.role,
            department: row.department || 'Administration',
            phone: row.phone || '',
            email: row.email || '',
            status: row.status || 'Active',
          });
        }
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-foreground/60">{staff.length} staff members</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importStaff} className="hidden" />
          </label>
          <button onClick={exportStaff} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => { setEditingStaff(null); setPhotoPreview(''); setFormData({ name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active', photo: '' }); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add Staff
          </button>
        </div>
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
          <tbody className="divide-y divide-border">
            {filteredStaff.map((member) => (
              <tr key={member.id} className="hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{member.role}</td>
                <td className="px-4 py-3 text-sm">{member.department}</td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="text-sm">{member.phone}</p>
                    <p className="text-xs text-foreground/60">{member.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => handleEdit(member)} className="p-2 hover:bg-muted rounded">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-50 text-red-600 rounded">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">{editingStaff ? 'Edit Staff' : 'Add Staff Member'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded"><X size={20} /></button>
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
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Full Name" required />
              <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Role (e.g. Teacher)" required />
              <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border">
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Phone Number" />
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-border" placeholder="Email Address" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
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