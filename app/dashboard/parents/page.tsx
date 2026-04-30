'use client';

import { useState, useRef, useEffect } from 'react';
import { Users, Calendar, DollarSign, Plus, Phone, Mail, X, Search, Download, Upload, Edit, Trash2, MessageCircle, MapPin, Briefcase, AlertCircle, Camera } from 'lucide-react';
import { useParents, useStudents, parseCSV } from '@/lib/data';

export default function ParentsPage() {
  const { parents, addParent, updateParent, deleteParent, meetings, addMeeting, updateMeeting, deleteMeeting } = useParents();
  const { students } = useStudents();
  const [activeTab, setActiveTab] = useState<'parents' | 'meetings'>('parents');
  const [searchTerm, setSearchTerm] = useState('');
  const [showParentModal, setShowParentModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [editingParentId, setEditingParentId] = useState<string | null>(null);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [parentForm, setParentForm] = useState<{
    name: string; email: string; phone: string; photo: string; children: string[]; address: string; emergencyContact: string; occupation: string; status: 'Active' | 'Inactive'
  }>({
    name: '', email: '', phone: '', photo: '', children: [], address: '', emergencyContact: '', occupation: '', status: 'Active'
  });
  const [meetingForm, setMeetingForm] = useState<{
    title: string; date: string; venue: string; agenda: string; minutes: string; status: 'upcoming' | 'completed' | 'cancelled'
  }>({
    title: '', date: '', venue: '', agenda: '', minutes: '', status: 'upcoming'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const studentOptions = students.filter(s => s.status === 'Active').map(s => s.name);

  const filteredParents = parents.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const filteredMeetings = meetings.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalParents = parents.filter(p => p.status === 'Active').length;
  const totalContributions = parents.length * 250000;

  useEffect(() => {
    if (!showParentModal) {
      setParentForm({ name: '', email: '', phone: '', photo: '', children: [], address: '', emergencyContact: '', occupation: '', status: 'Active' });
      setPhotoPreview('');
      setEditingParentId(null);
    }
    if (!showMeetingModal) {
      setMeetingForm({ title: '', date: '', venue: '', agenda: '', minutes: '', status: 'upcoming' });
      setEditingMeetingId(null);
    }
  }, [showParentModal, showMeetingModal]);

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
        setParentForm({ ...parentForm, photo: compressed });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleParentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingParentId) {
      updateParent(editingParentId, parentForm);
    } else {
      addParent(parentForm);
    }
    setShowParentModal(false);
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeetingId) {
      updateMeeting(editingMeetingId, meetingForm);
    } else {
      addMeeting({ ...meetingForm, attendees: 0 });
    }
    setShowMeetingModal(false);
  };

  const handleEditParent = (parent: typeof parents[0]) => {
    setParentForm({
      name: parent.name, email: parent.email, phone: parent.phone, photo: parent.photo || '',
      children: parent.children || [], address: parent.address, emergencyContact: parent.emergencyContact,
      occupation: parent.occupation, status: parent.status
    });
    setPhotoPreview(parent.photo || '');
    setEditingParentId(parent.id);
    setShowParentModal(true);
  };

  const handleEditMeeting = (meeting: typeof meetings[0]) => {
    setMeetingForm({
      title: meeting.title, date: meeting.date, venue: meeting.venue,
      agenda: meeting.agenda, minutes: meeting.minutes || '', status: meeting.status
    });
    setEditingMeetingId(meeting.id);
    setShowMeetingModal(true);
  };

  const exportData = () => {
    if (activeTab === 'parents') {
      const headers = ['Name', 'Email', 'Phone', 'Address', 'Occupation', 'Children', 'Emergency Contact', 'Status'];
      const rows = filteredParents.map(p => [
        p.name, p.email, p.phone, p.address, p.occupation,
        (p.children || []).join('; '), p.emergencyContact, p.status
      ]);
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      downloadCSV(csv, 'parents');
    } else {
      const headers = ['Title', 'Date', 'Venue', 'Agenda', 'Status', 'Attendees', 'Minutes'];
      const rows = filteredMeetings.map(m => [m.title, m.date, m.venue, m.agenda, m.status, m.attendees.toString(), m.minutes || '']);
      const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
      downloadCSV(csv, 'meetings');
    }
  };

  const downloadCSV = (csv: string, name: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pta-${name}-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importParents = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.name && row.phone) {
          addParent({
            name: row.name,
            email: row.email || '',
            phone: row.phone,
            children: row.children ? row.children.split(';').map(c => c.trim()) : [],
            address: row.address || '',
            emergencyContact: row.emergencyContact || row['Emergency Contact'] || '',
            occupation: row.occupation || '',
            status: (row.status || 'Active') as 'Active' | 'Inactive',
          });
        }
      });
    };
    reader.readAsText(file);
  };

  const sendWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    const message = `Dear ${name}, this is a message from the school administration.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendBulkWhatsApp = () => {
    const messages = filteredParents.map(p => `Dear ${p.name}, reminder: PTA meeting on ${meetings.find(m => m.status === 'upcoming')?.date || 'TBD'}.`);
    if (messages.length > 0) {
      window.open(`https://wa.me/?text=${encodeURIComponent(messages[0])}`, '_blank');
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Parent Portal</h1>
          <p className="text-foreground/60">Manage parents, PTA, and communications</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importParents} className="hidden" />
          </label>
          <button onClick={exportData} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => {
            if (activeTab === 'meetings') {
              setEditingMeetingId(null); setShowMeetingModal(true);
            } else {
              setEditingParentId(null); setShowParentModal(true);
            }
          }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />{activeTab === 'meetings' ? 'Add Meeting' : 'Add Parent'}
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{totalParents}</h3><p className="text-sm text-foreground/60">Active Parents</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{meetings.filter(m => m.status === 'upcoming').length}</h3><p className="text-sm text-foreground/60">Upcoming Meetings</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><DollarSign className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">UGX {(totalContributions / 1000000).toFixed(1)}M</h3><p className="text-sm text-foreground/60">Est. Contributions</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><MessageCircle className="w-6 h-6 text-purple-600" /></div>
            <div><h3 className="text-2xl font-bold">{parents.length}</h3><p className="text-sm text-foreground/60">Total Contacts</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('parents')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'parents' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
              Parents ({parents.length})
            </button>
            <button
              onClick={() => setActiveTab('meetings')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'meetings' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
              Meetings ({meetings.length})
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
              <input type="text" placeholder={`Search ${activeTab}...`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 pr-4 py-1.5 text-sm rounded-lg border border-border w-56" />
            </div>
            {activeTab === 'parents' && (
              <button onClick={sendBulkWhatsApp} className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                <MessageCircle size={14} />Bulk WhatsApp
              </button>
            )}
          </div>
        </div>

        {activeTab === 'parents' && (
          <div className="divide-y divide-border">
            {filteredParents.map((parent) => (
              <div key={parent.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {parent.photo ? (
                    <img src={parent.photo} alt={parent.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                      {getInitials(parent.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{parent.name}</p>
                    <p className="text-sm text-foreground/60">{parent.email}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-foreground/50">
                      <span className="flex items-center gap-1"><Phone size={12} />{parent.phone}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} />{parent.address}</span>
                      <span className="flex items-center gap-1"><Briefcase size={12} />{parent.occupation}</span>
                    </div>
                    {parent.children && parent.children.length > 0 && (
                      <p className="text-xs text-foreground/50 mt-1">Children: {parent.children.join(', ')}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    parent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>{parent.status}</span>
                  <button onClick={() => sendWhatsApp(parent.phone, parent.name)} className="p-1.5 hover:bg-green-100 rounded"><MessageCircle size={14} className="text-green-600" /></button>
                  <button onClick={() => window.location.href = `tel:${parent.phone}`} className="p-1.5 hover:bg-blue-100 rounded"><Phone size={14} className="text-blue-600" /></button>
                  <button onClick={() => window.location.href = `mailto:${parent.email}`} className="p-1.5 hover:bg-purple-100 rounded"><Mail size={14} className="text-purple-600" /></button>
                  <button onClick={() => handleEditParent(parent)} className="p-1.5 hover:bg-blue-100 rounded"><Edit size={14} className="text-blue-600" /></button>
                  <button onClick={() => deleteParent(parent.id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 size={14} className="text-red-600" /></button>
                </div>
              </div>
            ))}
            {filteredParents.length === 0 && (
              <div className="p-8 text-center text-foreground/60">No parents found</div>
            )}
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="divide-y divide-border">
            {filteredMeetings.map((meeting) => (
              <div key={meeting.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{meeting.title}</p>
                      <p className="text-sm text-foreground/60">{meeting.venue}</p>
                      <p className="text-xs text-foreground/50 mt-1">{meeting.agenda}</p>
                      {meeting.minutes && (
                        <p className="text-xs text-foreground/40 mt-1"><span className="font-medium">Minutes:</span> {meeting.minutes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                        meeting.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                      <p className="text-xs text-foreground/50 mt-1">{meeting.date}</p>
                      {meeting.attendees > 0 && (
                        <p className="text-xs text-foreground/50">{meeting.attendees} attended</p>
                      )}
                    </div>
                    <button onClick={() => handleEditMeeting(meeting)} className="p-1.5 hover:bg-blue-100 rounded"><Edit size={14} className="text-blue-600" /></button>
                    <button onClick={() => deleteMeeting(meeting.id)} className="p-1.5 hover:bg-red-100 rounded"><Trash2 size={14} className="text-red-600" /></button>
                  </div>
                </div>
              </div>
            ))}
            {filteredMeetings.length === 0 && (
              <div className="p-8 text-center text-foreground/60">No meetings found</div>
            )}
          </div>
        )}
      </div>

      {showParentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingParentId ? 'Edit Parent' : 'Add New Parent'}</h2>
              <button onClick={() => setShowParentModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleParentSubmit} className="space-y-4">
              <div className="flex flex-col items-center mb-4">
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input type="text" required value={parentForm.name} onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={parentForm.email} onChange={(e) => setParentForm({ ...parentForm, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input type="text" required value={parentForm.phone} onChange={(e) => setParentForm({ ...parentForm, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Occupation</label>
                  <input type="text" value={parentForm.occupation} onChange={(e) => setParentForm({ ...parentForm, occupation: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input type="text" value={parentForm.address} onChange={(e) => setParentForm({ ...parentForm, address: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                <input type="text" value={parentForm.emergencyContact} onChange={(e) => setParentForm({ ...parentForm, emergencyContact: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Children (select multiple)</label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 border border-border rounded-lg">
                  {studentOptions.map(name => (
                    <label key={name} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={parentForm.children.includes(name)}
                        onChange={(e) => {
                          const updated = e.target.checked ? [...parentForm.children, name] : parentForm.children.filter(c => c !== name);
                          setParentForm({ ...parentForm, children: updated });
                        }}
                        className="rounded" />
                      {name}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={parentForm.status} onChange={(e) => setParentForm({ ...parentForm, status: e.target.value as 'Active' | 'Inactive' })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowParentModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingParentId ? 'Update' : 'Add Parent'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showMeetingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingMeetingId ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
              <button onClick={() => setShowMeetingModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleMeetingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Meeting Title</label>
                <input type="text" required value={meetingForm.title} onChange={(e) => setMeetingForm({ ...meetingForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" required value={meetingForm.date} onChange={(e) => setMeetingForm({ ...meetingForm, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Venue</label>
                  <input type="text" required value={meetingForm.venue} onChange={(e) => setMeetingForm({ ...meetingForm, venue: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Agenda</label>
                <textarea value={meetingForm.agenda} onChange={(e) => setMeetingForm({ ...meetingForm, agenda: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={meetingForm.status} onChange={(e) => setMeetingForm({ ...meetingForm, status: e.target.value as 'upcoming' | 'completed' | 'cancelled' })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              {meetingForm.status === 'completed' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Meeting Minutes</label>
                  <textarea value={meetingForm.minutes} onChange={(e) => setMeetingForm({ ...meetingForm, minutes: e.target.value })}
                    rows={2} className="w-full px-4 py-2 rounded-lg border border-border" placeholder="Brief summary of decisions..." />
                </div>
              )}
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowMeetingModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingMeetingId ? 'Update' : 'Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
