'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, X, Download, Upload, Printer, Copy, Search, Calendar, Clock, FileText, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTimetable, useStaff, classes as allClassesList, parseCSV } from '@/lib/data';
import { getSchoolProfile } from '@/lib/school';

const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'CRE', 'Art & Craft', 'Physical Education', 'Music', 'Geography', 'History', 'Biology', 'Chemistry', 'Physics', 'Computer', 'French', 'Agriculture', 'Literature', 'Entrepreneurship'];

const subjectColors: Record<string, string> = {
  'Mathematics': 'bg-blue-100 text-blue-800 border-blue-200',
  'English': 'bg-purple-100 text-purple-800 border-purple-200',
  'Science': 'bg-green-100 text-green-800 border-green-200',
  'Social Studies': 'bg-amber-100 text-amber-800 border-amber-200',
  'CRE': 'bg-cyan-100 text-cyan-800 border-cyan-200',
  'Art & Craft': 'bg-pink-100 text-pink-800 border-pink-200',
  'Physical Education': 'bg-orange-100 text-orange-800 border-orange-200',
  'PE': 'bg-orange-100 text-orange-800 border-orange-200',
  'Music': 'bg-rose-100 text-rose-800 border-rose-200',
  'Geography': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'History': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Biology': 'bg-teal-100 text-teal-800 border-teal-200',
  'Chemistry': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Physics': 'bg-violet-100 text-violet-800 border-violet-200',
  'Computer': 'bg-sky-100 text-sky-800 border-sky-200',
  'French': 'bg-red-100 text-red-800 border-red-200',
  'Agriculture': 'bg-lime-100 text-lime-800 border-lime-200',
  'Literature': 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
  'Entrepreneurship': 'bg-stone-100 text-stone-800 border-stone-200',
  'Break': 'bg-yellow-50 text-yellow-600 border-yellow-200',
  'Lunch': 'bg-orange-50 text-orange-600 border-orange-200',
  'Assembly': 'bg-gray-100 text-gray-600 border-gray-200',
  'Library': 'bg-slate-100 text-slate-800 border-slate-200',
};

const days = ['mon', 'tue', 'wed', 'thu', 'fri'] as const;
const dayLabels: Record<string, string> = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday' };

type TabType = 'timetable' | 'exams';

export default function TimetablePage() {
  const { timetable, schedules, updateTimetable, addSchedule, updateSchedule, deleteSchedule } = useTimetable();
  const { staff } = useStaff();
  const [selectedClass, setSelectedClass] = useState('P.7');
  const [activeTab, setActiveTab] = useState<TabType>('timetable');
  const [editingCell, setEditingCell] = useState<{ time: string; day: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddSlotModal, setShowAddSlotModal] = useState(false);
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyTargetClass, setCopyTargetClass] = useState('');
  const [slotForm, setSlotForm] = useState({ time: '', mon: '', tue: '', wed: '', thu: '', fri: '' });
  const [scheduleForm, setScheduleForm] = useState({ name: '', class: 'All', date: '', duration: 'Week' });
  const [searchTerm, setSearchTerm] = useState('');

  const classTimetable = timetable[selectedClass] || [];

  const filteredSchedules = schedules.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjectCount = classTimetable.reduce((acc: Record<string, number>, row) => {
    days.forEach(day => {
      const subject = row[day];
      if (subject && subject !== 'Break' && subject !== 'Lunch') {
        acc[subject] = (acc[subject] || 0) + 1;
      }
    });
    return acc;
  }, {});

  const totalPeriods = classTimetable.reduce((sum, row) => {
    return sum + days.filter(day => row[day] && row[day] !== 'Break' && row[day] !== 'Lunch').length;
  }, 0);

  const handleCellClick = (time: string, day: string, currentValue: string) => {
    setEditingCell({ time, day });
    setEditValue(currentValue);
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    const { time, day } = editingCell;
    const rowIndex = classTimetable.findIndex(r => r.time === time);
    if (rowIndex === -1) return;
    const updatedRow = { ...classTimetable[rowIndex], [day]: editValue };
    const updatedTimetable = { ...timetable, [selectedClass]: [...classTimetable] };
    updatedTimetable[selectedClass][rowIndex] = updatedRow;
    updateTimetable(updatedTimetable);
    setEditingCell(null);
    setEditValue('');
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot = {
      id: Math.random().toString(36).substring(2, 15),
      class: selectedClass,
      ...slotForm,
    };
    const existing = timetable[selectedClass] || [];
    const updated = { ...timetable, [selectedClass]: [...existing, newSlot] };
    updateTimetable(updated);
    setShowAddSlotModal(false);
    setSlotForm({ time: '', mon: '', tue: '', wed: '', thu: '', fri: '' });
  };

  const handleDeleteSlot = (time: string) => {
    if (!confirm(`Delete the ${time} period?`)) return;
    const updated = { ...timetable, [selectedClass]: classTimetable.filter(r => r.time !== time) };
    updateTimetable(updated);
  };

  const handleCopyTimetable = () => {
    if (!copyTargetClass) return;
    const sourceSlots = classTimetable.map(slot => ({
      ...slot,
      id: Math.random().toString(36).substring(2, 15),
      class: copyTargetClass,
    }));
    const updated = { ...timetable, [copyTargetClass]: sourceSlots };
    updateTimetable(updated);
    setShowCopyModal(false);
    setCopyTargetClass('');
  };

  const handleAddSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    addSchedule(scheduleForm);
    setShowAddScheduleModal(false);
    setScheduleForm({ name: '', class: 'All', date: '', duration: 'Week' });
  };

  const exportTimetable = () => {
    const headers = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const rows = classTimetable.map(row => [row.time, row.mon, row.tue, row.wed, row.thu, row.fri]);
    const csv = [headers.join(','), ...rows.map(r => r.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timetable-${selectedClass}-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importTimetable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      const slots = rows.map((row, i) => ({
        id: Math.random().toString(36).substring(2, 15),
        class: selectedClass,
        time: row.Time || row.time || '',
        mon: row.Monday || row.mon || '',
        tue: row.Tuesday || row.tue || '',
        wed: row.Wednesday || row.wed || '',
        thu: row.Thursday || row.thu || '',
        fri: row.Friday || row.fri || '',
      })).filter(r => r.time);
      const existing = timetable[selectedClass] || [];
      const updated = { ...timetable, [selectedClass]: [...existing, ...slots] };
      updateTimetable(updated);
    };
    reader.readAsText(file);
  };

  const printTimetable = () => {
    const school = getSchoolProfile();
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Timetable - ${selectedClass}</title>
<style>body{font-family:'Times New Roman',serif;padding:40px;max-width:1000px;margin:0 auto}
.header{text-align:center;border-bottom:3px double #1a365d;padding-bottom:15px;margin-bottom:20px}
.header img{height:60px;margin-bottom:5px}
.header h1{margin:0;color:#1a365d;font-size:22px;text-transform:uppercase;letter-spacing:2px}
.header .motto{margin:5px 0 0;color:#666;font-style:italic;font-size:13px}
.header .contact{margin:8px 0 0;color:#888;font-size:12px}
h2{text-align:center;color:#2563eb;font-weight:bold;margin:15px 0}
table{width:100%;border-collapse:collapse;margin:20px 0}
th{background:#1a365d;color:white;padding:10px;text-align:center;font-size:14px;border:1px solid #1a365d}
td{padding:10px;border:1px solid #ddd;text-align:center;font-size:13px}
.time{font-weight:bold;background:#f0f4f8;width:130px}
.break{background:#fef9c3;color:#854d0e;font-style:italic}
.footer{text-align:center;font-size:10px;color:#999;margin-top:30px;border-top:1px solid #eee;padding-top:10px}
@media print{body{padding:20px}}</style></head><body>
<div class="header">
${school.logo ? `<img src="${school.logo}" alt="Logo"/>` : `<div style="width:60px;height:60px;border-radius:50%;background:#1a365d;color:white;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;margin-bottom:5px">${school.name.charAt(0)}</div>`}
<h1>${school.name}</h1>
<p class="motto">"${school.motto}"</p>
<p class="contact">${school.address} &bull; ${school.phone} &bull; ${school.email}</p>
</div>
<h2>Weekly Timetable — ${selectedClass}</h2>
<table><thead><tr><th>Time</th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr></thead><tbody>
${classTimetable.map(row => `<tr><td class="time">${row.time}</td>${days.map(d => `<td class="${row[d]==='Break'||row[d]==='Lunch'?'break':''}">${row[d]}</td>`).join('')}</tr>`).join('')}
</tbody></table>
<div class="footer">Generated by SmartSchool Pro &bull; ${school.name} &bull; ${new Date().toLocaleDateString()}</div>
</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const navigateClass = (direction: 'prev' | 'next') => {
    const idx = allClassesList.slice(1).indexOf(selectedClass);
    const newIdx = direction === 'prev' ? Math.max(0, idx - 1) : Math.min(allClassesList.length - 2, idx + 1);
    setSelectedClass(allClassesList.slice(1)[newIdx]);
  };

  const getTeacherForSubject = (subject: string) => {
    const teacher = staff.find(s => s.subject?.toLowerCase() === subject.toLowerCase() || s.role.toLowerCase().includes(subject.toLowerCase()));
    return teacher?.name || '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Timetable</h1>
          <p className="text-foreground/60">Manage class schedules and exam calendar</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} /><span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importTimetable} className="hidden" />
          </label>
          <button onClick={exportTimetable} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} /><span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={printTimetable} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Printer size={18} /><span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{Object.keys(timetable).length}</h3><p className="text-sm text-foreground/60">Classes with Timetable</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Clock className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{totalPeriods}</h3><p className="text-sm text-foreground/60">Periods/Week</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-purple-600" /></div>
            <div><h3 className="text-2xl font-bold">{Object.keys(subjectCount).length}</h3><p className="text-sm text-foreground/60">Subjects</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Calendar className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{schedules.length}</h3><p className="text-sm text-foreground/60">Exam Schedules</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4">
            <button onClick={() => setActiveTab('timetable')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'timetable' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
              Class Timetable
            </button>
            <button onClick={() => setActiveTab('exams')}
              className={`px-4 py-2 rounded-lg ${activeTab === 'exams' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
              Exam Schedules
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateClass('prev')} className="p-1.5 hover:bg-muted rounded"><ChevronLeft size={16} /></button>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="text-sm rounded-lg border border-border px-3 py-1.5 font-medium min-w-[80px] text-center">
              {allClassesList.filter(c => c !== 'All Classes').map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={() => navigateClass('next')} className="p-1.5 hover:bg-muted rounded"><ChevronRight size={16} /></button>
            <button onClick={() => setShowCopyModal(true)} className="flex items-center gap-1 px-2 py-1.5 text-sm border border-border rounded-lg hover:bg-muted">
              <Copy size={14} />Copy to...
            </button>
            <button onClick={() => setShowAddSlotModal(true)} className="flex items-center gap-1 px-2 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
              <Plus size={14} />Add Period
            </button>
          </div>
        </div>

        {activeTab === 'timetable' && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70 w-32">Time</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Monday</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Tuesday</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Wednesday</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Thursday</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-foreground/70">Friday</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {classTimetable.map((row) => (
                    <tr key={row.id} className={`border-t border-border ${row.mon === 'Break' || row.mon === 'Lunch' ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock size={14} className="text-foreground/50" />
                          {row.time}
                        </div>
                      </td>
                      {days.map(day => {
                        const value = row[day] || '';
                        const isEditing = editingCell?.time === row.time && editingCell?.day === day;
                        const colorClass = subjectColors[value] || 'bg-gray-50 text-gray-700 border-gray-200';
                        return (
                          <td key={day} className="px-2 py-2 text-center">
                            {isEditing ? (
                              <select value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={handleCellSave} autoFocus
                                className="w-full text-sm px-2 py-1 rounded border border-primary outline-none">
                                <option value="">-- Empty --</option>
                                <option value="Break">Break</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Assembly">Assembly</option>
                                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            ) : (
                              <div onClick={() => handleCellClick(row.time, day, value)}
                                className={`inline-block px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity min-w-[80px] ${colorClass}`}>
                                {value || '—'}
                              </div>
                            )}
                          </td>
                        );
                      })}
                      <td className="px-2 py-2">
                        <button onClick={() => handleDeleteSlot(row.time)} className="p-1 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={12} className="text-red-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {classTimetable.length === 0 && (
                <div className="p-12 text-center">
                  <Calendar size={48} className="mx-auto mb-4 text-foreground/20" />
                  <p className="font-medium text-foreground/60">No timetable for {selectedClass}</p>
                  <p className="text-sm text-foreground/40 mt-1">Add periods or copy from another class</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border">
              <h3 className="font-semibold text-sm mb-3">Subject Distribution — {selectedClass}</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(subjectCount).sort((a, b) => (b[1] as number) - (a[1] as number)).map(([subject, count]) => (
                  <div key={subject} className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${subjectColors[subject] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                    {subject}: {count} periods/week
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'exams' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={14} />
                <input type="text" placeholder="Search schedules..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border w-56" />
              </div>
              <button onClick={() => setShowAddScheduleModal(true)} className="flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary/90">
                <Plus size={14} />Add Schedule
              </button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSchedules.map(schedule => (
                <div key={schedule.id} className="p-4 border border-border rounded-lg hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-sm text-foreground/60 mt-1">Class: {schedule.class}</p>
                      <p className="text-sm text-foreground/60 mt-1">{schedule.date}</p>
                      <p className="text-sm text-foreground/60">Duration: {schedule.duration}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => {
                        setScheduleForm({ name: schedule.name, class: schedule.class, date: schedule.date, duration: schedule.duration });
                        setShowAddScheduleModal(true);
                      }} className="p-1.5 hover:bg-blue-50 rounded"><Edit size={14} className="text-blue-600" /></button>
                      <button onClick={() => deleteSchedule(schedule.id)} className="p-1.5 hover:bg-red-50 rounded"><Trash2 size={14} className="text-red-600" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filteredSchedules.length === 0 && (
              <div className="p-8 text-center text-foreground/60">
                <Calendar size={40} className="mx-auto mb-3 text-foreground/30" />
                <p className="font-medium">No exam schedules found</p>
                <p className="text-sm">Add a new exam schedule</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showAddSlotModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Period — {selectedClass}</h2>
              <button onClick={() => setShowAddSlotModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time Slot</label>
                <input type="text" value={slotForm.time} onChange={(e) => setSlotForm({ ...slotForm, time: e.target.value })}
                  placeholder="e.g. 2:00 - 3:00" className="w-full px-3 py-2 rounded-lg border border-border" required />
              </div>
              {days.map(day => (
                <div key={day}>
                  <label className="block text-sm font-medium mb-1">{dayLabels[day]}</label>
                  <select value={slotForm[day]} onChange={(e) => setSlotForm({ ...slotForm, [day]: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border">
                    <option value="">-- Select --</option>
                    <option value="Break">Break</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Assembly">Assembly</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddSlotModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2"><Save size={14} />Add Period</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCopyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Copy Timetable</h2>
              <button onClick={() => setShowCopyModal(false)}><X size={20} /></button>
            </div>
            <p className="text-sm text-foreground/60 mb-4">Copy {selectedClass} timetable to another class</p>
            <select value={copyTargetClass} onChange={(e) => setCopyTargetClass(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border mb-4">
              <option value="">Select target class</option>
              {allClassesList.filter(c => c !== 'All Classes' && c !== selectedClass).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowCopyModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
              <button onClick={handleCopyTimetable} disabled={!copyTargetClass} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50">Copy</button>
            </div>
          </div>
        </div>
      )}

      {showAddScheduleModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Exam Schedule</h2>
              <button onClick={() => setShowAddScheduleModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddSchedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Name</label>
                <input type="text" value={scheduleForm.name} onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                  placeholder="e.g. Mid-Term Exams" className="w-full px-3 py-2 rounded-lg border border-border" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select value={scheduleForm.class} onChange={(e) => setScheduleForm({ ...scheduleForm, class: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border">
                  <option value="All">All Classes</option>
                  {allClassesList.filter(c => c !== 'All Classes').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <input type="text" value={scheduleForm.date} onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  placeholder="e.g. May 5 - May 12, 2026" className="w-full px-3 py-2 rounded-lg border border-border" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input type="text" value={scheduleForm.duration} onChange={(e) => setScheduleForm({ ...scheduleForm, duration: e.target.value })}
                  placeholder="e.g. 1 Week" className="w-full px-3 py-2 rounded-lg border border-border" required />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddScheduleModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
