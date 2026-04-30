'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Search, Trash2, X, Camera, Download, Upload, Phone, Mail, MessageCircle, Users, Building2, Calendar, AlertCircle, Filter } from 'lucide-react';
import { useStaff, parseCSV } from '@/lib/data';

const departments = ['Administration', 'Science', 'Languages', 'Mathematics', 'Social Studies', 'ICT', 'Physical Education', 'Art & Music', 'Support Staff'];

export default function StaffPage() {
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff();
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active', photo: '', subject: '', joinDate: ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!showModal) {
      setEditingStaff(null);
      setPhotoPreview('');
      setFormData({ name: '', role: '', department: 'Administration', phone: '', email: '', status: 'Active', photo: '', subject: '', joinDate: '' });
    }
  }, [showModal]);

  const compressPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, 100, 100);
        const compressed = canvas.toDataURL('image/jpeg', 0.6);
        setPhotoPreview(compressed);
        setFormData(prev => ({ ...prev, photo: compressed }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || member.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const activeStaff = staff.filter(s => s.status === 'Active').length;
  const onLeave = staff.filter(s => s.status === 'On Leave').length;
  const deptCount = [...new Set(staff.map(s => s.department))].length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStaff) {
      updateStaff(editingStaff.id, formData);
    } else {
      addStaff({ ...formData, joinDate: formData.joinDate || new Date().toISOString().split('T')[0] });
    }
    setShowModal(false);
  };

  const handleEdit = (member: any) => {
    setFormData({
      name: member.name, role: member.role, department: member.department,
      phone: member.phone, email: member.email, status: member.status || 'Active',
      photo: member.photo || '', subject: member.subject || '', joinDate: member.joinDate || ''
    });
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
    const headers = ['Name', 'Role', 'Department', 'Subject', 'Phone', 'Email', 'Join Date', 'Status'];
    const rows = filteredStaff.map(s => [s.name, s.role, s.department, s.subject || '', s.phone, s.email, s.joinDate || '', s.status || 'Active']);
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `staff-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            subject: row.subject || '',
            joinDate: row.joinDate || new Date().toISOString().split('T')[0],
            status: row.status || 'Active',
          });
        }
      });
    };
    reader.readAsText(file);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const sendWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const message = `Dear ${name}, this is a message from the school administration.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const deptStats = staff.reduce((acc: Record<string, number>, s) => {
    acc[s.department] = (acc[s.department] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-foreground/60">Manage teachers, admin, and support staff</p>
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
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add Staff
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{staff.length}</h3><p className="text-sm text-foreground/60">Total Staff</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{activeStaff}</h3><p className="text-sm text-foreground/60">Active Today</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Building2 className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{deptCount}</h3><p className="text-sm text-foreground/60">Departments</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><AlertCircle className="w-6 h-6 text-red-600" /></div>
            <div><h3 className="text-2xl font-bold">{onLeave}</h3><p className="text-sm text-foreground/60">On Leave</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
              <input type="text" placeholder="Search staff..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border w-56" />
            </div>
            <div className="flex items-center gap-1">
              <Filter size={14} className="text-foreground/40" />
              <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className="text-sm rounded-lg border border-border px-2 py-1.5">
                <option value="All">All Departments</option>
                {departments.filter(d => deptStats[d]).map(d => <option key={d} value={d}>{d} ({deptStats[d]})</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-4">
          {filteredStaff.map((member) => (
            <div key={member.id} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-14 h-14 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary font-semibold text-lg">
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-base">{member.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        member.status === 'Active' ? 'bg-green-100 text-green-700' :
                        member.status === 'On Leave' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{member.status || 'Active'}</span>
                    </div>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-foreground/50">
                      <span className="flex items-center gap-1"><Building2 size={12} />{member.department}</span>
                      {member.subject && <span className="flex items-center gap-1"><BookIcon size={12} />{member.subject}</span>}
                      {member.joinDate && <span className="flex items-center gap-1"><Calendar size={12} />Joined {member.joinDate}</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => window.location.href = `tel:${member.phone}`} className="flex items-center gap-1 text-xs text-foreground/60 hover:text-blue-600 transition-colors">
                        <Phone size={12} />{member.phone}
                      </button>
                      <button onClick={() => window.location.href = `mailto:${member.email}`} className="flex items-center gap-1 text-xs text-foreground/60 hover:text-purple-600 transition-colors">
                        <Mail size={12} />{member.email}
                      </button>
                      <button onClick={() => sendWhatsApp(member.phone, member.name)} className="flex items-center gap-1 text-xs text-foreground/60 hover:text-green-600 transition-colors">
                        <MessageCircle size={12} />WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleEdit(member)} className="p-2 hover:bg-blue-50 rounded transition-colors">
                    <Edit size={16} className="text-blue-600" />
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="p-2 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredStaff.length === 0 && (
            <div className="p-8 text-center text-foreground/60">
              <Users size={40} className="mx-auto mb-3 text-foreground/30" />
              <p className="font-medium">No staff members found</p>
              <p className="text-sm">Try adjusting your search or filter</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-lg">{editingStaff ? 'Edit Staff' : 'Add Staff Member'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-muted rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="flex flex-col items-center gap-3 mb-4">
                {photoPreview ? (
                  <div className="relative">
                    <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover border-2 border-primary/20" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-primary rounded-full p-1"><Camera size={12} className="text-white" /></button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-20 h-20 bg-muted rounded-full flex items-center justify-center border-2 border-dashed border-border hover:border-primary">
                    <Camera size={24} className="text-foreground/40" />
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && compressPhoto(e.target.files[0])} className="hidden" />
                <p className="text-xs text-foreground/40">Click to upload photo</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border" placeholder="e.g. Mr. John" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input type="text" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border" placeholder="e.g. Teacher" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <select value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border">
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <input type="text" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border" placeholder="e.g. Mathematics" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border" placeholder="+256 7XX" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border" placeholder="email@school.ug" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Join Date</label>
                  <input type="date" value={formData.joinDate} onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-border">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

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

function BookIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}
