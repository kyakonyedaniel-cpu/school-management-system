'use client';

import { useState } from 'react';
import { FileText, Download, Eye, Star, TrendingUp, Users, Plus, X, BarChart3, PieChart, Calendar, Filter, FileBarChart, Award, ClipboardList, Printer } from 'lucide-react';
import { useStudents, useStaff, usePayments, useAttendance, useExams, classes, parseCSV } from '@/lib/data';

const gradingSystem = [
  { grade: 'D1', mark: '90-100', description: 'Distinction 1', color: 'bg-green-600' },
  { grade: 'D2', mark: '80-89', description: 'Distinction 2', color: 'bg-green-500' },
  { grade: 'C3', mark: '70-79', description: 'Credit 3', color: 'bg-green-400' },
  { grade: 'C4', mark: '65-69', description: 'Credit 4', color: 'bg-yellow-400' },
  { grade: 'C5', mark: '60-64', description: 'Credit 5', color: 'bg-yellow-300' },
  { grade: 'C6', mark: '55-59', description: 'Credit 6', color: 'bg-orange-300' },
  { grade: 'P7', mark: '50-54', description: 'Pass 7', color: 'bg-orange-400' },
  { grade: 'P8', mark: '45-49', description: 'Pass 8', color: 'bg-red-400' },
  { grade: 'F9', mark: '0-44', description: 'Fail 9', color: 'bg-red-600' },
];

const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'CRE', 'Art & Craft', 'Physical Education', 'Music'];
const terms = ['Term I', 'Term II', 'Term III'];

type ReportType = 'academic' | 'attendance' | 'fees' | 'performance' | 'discipline' | 'health';

export default function ReportsPage() {
  const { students } = useStudents();
  const { staff } = useStaff();
  const { payments } = usePayments();
  const { attendance } = useAttendance();
  const { exams } = useExams();
  const [activeTab, setActiveTab] = useState<ReportType>('academic');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedTerm, setSelectedTerm] = useState('Term I');
  const [selectedYear] = useState('2026');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({ reportType: 'academic' as ReportType, class: 'All Classes', student: '', term: 'Term I' });

  const filteredStudents = selectedClass === 'All Classes' ? students : students.filter(s => s.class === selectedClass);

  const attendanceRate = attendance.length > 0 ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) : 0;
  const totalPaid = payments.filter(p => p.status === 'Confirmed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0);

  const classPerformance = classes.slice(1).map(cls => {
    const classStudents = students.filter(s => s.class === cls);
    return { class: cls, count: classStudents.length, feesPaid: classStudents.filter(s => s.fees === 'Paid').length };
  }).filter(c => c.count > 0);

  const feesCollection = {
    paid: payments.filter(p => p.status === 'Confirmed').length,
    pending: payments.filter(p => p.status === 'Pending').length,
    overdue: payments.filter(p => p.status === 'Overdue').length,
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (generateForm.reportType === 'academic') {
      const mockResults = subjects.map(s => ({
        subject: s,
        score: Math.floor(Math.random() * 40) + 60,
        grade: getGrade(Math.floor(Math.random() * 40) + 60),
      }));
      const student = students.find(s => s.name === generateForm.student) || students[0];
      if (student) {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        printWindow.document.write(`
<!DOCTYPE html><html><head><title>Report Card - ${student.name}</title>
<style>body{font-family:Arial,sans-serif;padding:40px;max-width:800px;margin:0 auto}
h1{text-align:center;color:#2563eb;margin-bottom:5px}h2{text-align:center;color:#666;font-weight:normal;font-size:14px;margin-top:0}
.box{border:2px solid #2563eb;padding:15px;margin:20px 0;border-radius:8px}
.info{display:flex;justify-content:space-between;flex-wrap:wrap}
.info div{margin:5px 0;font-size:14px}
table{width:100%;border-collapse:collapse;margin:20px 0}
th{background:#2563eb;color:white;padding:10px;text-align:left}
td{padding:8px 10px;border-bottom:1px solid #ddd}
tr:nth-child(even){background:#f9fafb}
.summary{display:flex;justify-content:space-between;margin:20px 0;padding:15px;background:#f0f9ff;border-radius:8px}
.summary div{text-align:center}
.summary h3{margin:0;color:#2563eb;font-size:24px}
.summary p{margin:5px 0 0;color:#666;font-size:12px}
.signatures{display:flex;justify-content:space-between;margin-top:60px}
.sig{text-align:center;border-top:1px solid #333;padding-top:5px;width:200px}
@media print{body{padding:20px}}</style></head><body>
<h1>STUDENT REPORT CARD</h1>
<h2>SmartSchool Pro</h2>
<div class="box"><div class="info">
<div><strong>Name:</strong> ${student.name}</div>
<div><strong>Class:</strong> ${student.class}</div>
<div><strong>Admission No:</strong> ${student.admissionNo}</div>
<div><strong>Term:</strong> ${generateForm.term} ${selectedYear}</div>
</div></div>
<table><thead><tr><th>Subject</th><th>Score</th><th>Grade</th></tr></thead><tbody>
${mockResults.map(r => `<tr><td>${r.subject}</td><td>${r.score}</td><td>${r.grade}</td></tr>`).join('')}
<tr style="font-weight:bold;background:#e0f2fe"><td><strong>Total</strong></td><td><strong>${mockResults.reduce((s,r)=>s+r.score,0)}</strong></td><td></td></tr>
</tbody></table>
<div class="summary">
<div><h3>${Math.round(mockResults.reduce((s,r)=>s+r.score,0)/mockResults.length)}%</h3><p>Average</p></div>
<div><h3>72%</h3><p>Class Average</p></div>
<div><h3>${Math.floor(Math.random()*10)+1}/${filteredStudents.length}</h3><p>Position</p></div>
</div>
<div class="signatures"><div class="sig">Class Teacher</div><div class="sig">Headteacher</div></div>
<p style="text-align:center;font-size:10px;color:#999;margin-top:40px">Generated by SmartSchool Pro</p>
</body></html>`);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
      }
    }
    setShowGenerateModal(false);
    setGenerateForm({ reportType: 'academic', class: 'All Classes', student: '', term: 'Term I' });
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'D1';
    if (score >= 80) return 'D2';
    if (score >= 70) return 'C3';
    if (score >= 65) return 'C4';
    if (score >= 60) return 'C5';
    if (score >= 55) return 'C6';
    if (score >= 50) return 'P7';
    if (score >= 45) return 'P8';
    return 'F9';
  };

  const exportReport = () => {
    let csv = '';
    let filename = '';
    if (activeTab === 'academic') {
      const headers = ['Student Name', 'Class', 'Admission No', 'Fees Status', 'Gender'];
      const rows = filteredStudents.map(s => [s.name, s.class, s.admissionNo, s.fees, s.gender]);
      csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      filename = `academic-report-${selectedClass}-${selectedYear}`;
    } else if (activeTab === 'attendance') {
      const headers = ['Student Name', 'Class', 'Date', 'Status'];
      const rows = attendance.map(a => [a.studentName, a.class, a.date, a.status]);
      csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      filename = `attendance-report-${selectedYear}`;
    } else if (activeTab === 'fees') {
      const headers = ['Student Name', 'Class', 'Amount', 'Date', 'Method', 'Status'];
      const rows = payments.map(p => [p.studentName, p.class, p.amount.toString(), p.date, p.method, p.status]);
      csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      filename = `fees-report-${selectedYear}`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-foreground/60">Generate reports and view school analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={printReport} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button onClick={exportReport} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Generate Report
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{exams.length}</h3><p className="text-sm text-foreground/60">Exams This Term</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{students.length}</h3><p className="text-sm text-foreground/60">Students Enrolled</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{attendanceRate}%</h3><p className="text-sm text-foreground/60">Attendance Rate</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Award className="w-6 h-6 text-purple-600" /></div>
            <div><h3 className="text-2xl font-bold">{staff.length}</h3><p className="text-sm text-foreground/60">Teaching Staff</p></div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-background rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div className="flex gap-4">
                {(['academic', 'attendance', 'fees', 'performance'] as ReportType[]).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg capitalize ${activeTab === tab ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-muted'}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-foreground/40" />
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="text-sm rounded-lg border border-border px-2 py-1.5">
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {activeTab === 'academic' && (
              <div className="divide-y divide-border">
                <div className="p-4 bg-muted/30 grid grid-cols-4 text-sm font-medium text-foreground/60">
                  <span>Student</span><span>Class</span><span>Fees</span><span>Status</span>
                </div>
                {filteredStudents.map(student => (
                  <div key={student.id} className="p-4 grid grid-cols-4 items-center">
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
                    <span className="text-sm">{student.class}</span>
                    <span className={`text-sm font-medium ${
                      student.fees === 'Paid' ? 'text-green-600' : student.fees === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                    }`}>{student.fees}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>{student.status}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-green-600">{attendance.filter(a => a.status === 'present').length}</h3>
                    <p className="text-sm text-green-700">Present</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-red-600">{attendance.filter(a => a.status === 'absent').length}</h3>
                    <p className="text-sm text-red-700">Absent</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-yellow-600">{attendance.filter(a => a.status === 'late').length}</h3>
                    <p className="text-sm text-yellow-700">Late</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {attendance.map(record => (
                    <div key={record.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{record.studentName}</p>
                        <p className="text-sm text-foreground/60">{record.class} • {record.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        record.status === 'present' ? 'bg-green-100 text-green-700' :
                        record.status === 'absent' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>{record.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'fees' && (
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-green-600">UGX {(totalPaid / 1000000).toFixed(1)}M</h3>
                    <p className="text-sm text-green-700">Collected ({feesCollection.paid} payments)</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-yellow-600">UGX {(totalPending / 1000000).toFixed(1)}M</h3>
                    <p className="text-sm text-yellow-700">Pending ({feesCollection.pending} payments)</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <h3 className="text-2xl font-bold text-red-600">{feesCollection.overdue}</h3>
                    <p className="text-sm text-red-700">Overdue Accounts</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {payments.slice(0, 10).map(payment => (
                    <div key={payment.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{payment.studentName}</p>
                        <p className="text-sm text-foreground/60">{payment.class} • {payment.method} • {payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">UGX {payment.amount.toLocaleString()}</p>
                        <span className={`text-xs font-medium ${
                          payment.status === 'Confirmed' ? 'text-green-600' : payment.status === 'Pending' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{payment.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="p-6">
                <h3 className="font-semibold mb-4">Class Performance Overview</h3>
                <div className="space-y-4">
                  {classPerformance.map(cls => {
                    const feeRate = Math.round((cls.feesPaid / cls.count) * 100);
                    return (
                      <div key={cls.class}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{cls.class}</span>
                          <span className="text-sm text-foreground/60">{cls.count} students • {feeRate}% fees paid</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-3">
                          <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${feeRate}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-background rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              <h2 className="font-semibold">Grading System</h2>
            </div>
            <div className="p-4 space-y-2">
              {gradingSystem.map(g => (
                <div key={g.grade} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${g.color} rounded flex items-center justify-center text-white font-bold text-sm`}>{g.grade}</div>
                    <div>
                      <p className="font-medium text-sm">{g.description}</p>
                      <p className="text-xs text-foreground/60">{g.mark}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center gap-2">
              <ClipboardList size={18} className="text-primary" />
              <h2 className="font-semibold">Quick Reports</h2>
            </div>
            <div className="p-4 space-y-2">
              {[
                { label: 'Student Report Cards', type: 'academic', icon: FileBarChart },
                { label: 'Attendance Summary', type: 'attendance', icon: Calendar },
                { label: 'Fee Collection Report', type: 'fees', icon: TrendingUp },
                { label: 'Class Performance', type: 'performance', icon: BarChart3 },
              ].map(report => (
                <button key={report.type} onClick={() => { setActiveTab(report.type as ReportType); }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors">
                  <report.icon size={16} className="text-primary" />
                  <span className="text-sm font-medium">{report.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Generate Report</h2>
              <button onClick={() => setShowGenerateModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Report Type</label>
                <select value={generateForm.reportType} onChange={(e) => setGenerateForm({ ...generateForm, reportType: e.target.value as ReportType })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="academic">Academic Report Card</option>
                  <option value="attendance">Attendance Summary</option>
                  <option value="fees">Fee Collection Report</option>
                  <option value="performance">Class Performance Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select value={generateForm.class} onChange={(e) => setGenerateForm({ ...generateForm, class: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  {classes.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {generateForm.reportType === 'academic' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Student (optional - leave blank for all)</label>
                  <select value={generateForm.student} onChange={(e) => setGenerateForm({ ...generateForm, student: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    <option value="">All Students</option>
                    {filteredStudents.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Term</label>
                <select value={generateForm.term} onChange={(e) => setGenerateForm({ ...generateForm, term: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  {terms.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowGenerateModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center gap-2">
                  <Download size={16} />Generate & Download
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
