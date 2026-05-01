'use client';

import { useState } from 'react';
import { FileText, Download, CheckCircle, Plus, Search, X, Edit, Trash2, Upload, Filter, Award, TrendingUp, Users, BarChart3, Star, Eye } from 'lucide-react';
import { useStudents, useExams, useExamResults, classes, parseCSV } from '@/lib/data';
import { getSchoolProfile } from '@/lib/school';

const gradingSystem = [
  { grade: 'D1', min: 90, max: 100, description: 'Distinction 1', color: 'bg-green-600' },
  { grade: 'D2', min: 80, max: 89, description: 'Distinction 2', color: 'bg-green-500' },
  { grade: 'C3', min: 70, max: 79, description: 'Credit 3', color: 'bg-green-400' },
  { grade: 'C4', min: 65, max: 69, description: 'Credit 4', color: 'bg-yellow-400' },
  { grade: 'C5', min: 60, max: 64, description: 'Credit 5', color: 'bg-yellow-300' },
  { grade: 'C6', min: 55, max: 59, description: 'Credit 6', color: 'bg-orange-300' },
  { grade: 'P7', min: 50, max: 54, description: 'Pass 7', color: 'bg-orange-400' },
  { grade: 'P8', min: 45, max: 49, description: 'Pass 8', color: 'bg-red-400' },
  { grade: 'F9', min: 0, max: 44, description: 'Fail 9', color: 'bg-red-600' },
];

const subjects = ['Mathematics', 'English', 'Science', 'Social Studies', 'CRE', 'Art & Craft', 'Physical Education', 'Music'];
const terms = ['Term I', 'Term II', 'Term III'];

function getGrade(score: number, maxScore: number): string {
  const pct = (score / maxScore) * 100;
  const g = gradingSystem.find(g => pct >= g.min && pct <= g.max);
  return g?.grade || 'F9';
}

export default function ResultsPage() {
  const { students } = useStudents();
  const { exams } = useExams();
  const { results, addResult, updateResult, deleteResult, addResultsBulk } = useExamResults();
  const [activeTab, setActiveTab] = useState<'exams' | 'results' | 'analytics'>('results');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');
  const [selectedExam, setSelectedExam] = useState('All');
  const [showResultModal, setShowResultModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [resultForm, setResultForm] = useState({
    studentName: '', class: '', examName: '', subject: '', score: 0, maxScore: 100
  });

  const filteredResults = results.filter(r => {
    const matchesSearch = r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.examName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || r.class === selectedClass;
    const matchesExam = selectedExam === 'All' || r.examName === selectedExam;
    return matchesSearch && matchesClass && matchesExam;
  });

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.class.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || e.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const examOptions = [...new Set(exams.map(e => e.name))];
  const studentOptions = selectedClass === 'All Classes' ? students : students.filter(s => s.class === selectedClass);

  const avgScore = filteredResults.length > 0 ? Math.round(filteredResults.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / filteredResults.length) : 0;
  const passRate = filteredResults.length > 0 ? Math.round((filteredResults.filter(r => (r.score / r.maxScore) * 100 >= 50).length / filteredResults.length) * 100) : 0;
  const distinctionCount = filteredResults.filter(r => (r.score / r.maxScore) * 100 >= 80).length;

  const classAnalytics = classes.slice(1).map(cls => {
    const classResults = results.filter(r => r.class === cls);
    if (classResults.length === 0) return null;
    const avg = Math.round(classResults.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / classResults.length);
    const pass = Math.round((classResults.filter(r => (r.score / r.maxScore) * 100 >= 50).length / classResults.length) * 100);
    return { class: cls, count: classResults.length, avg, pass, distinctions: classResults.filter(r => (r.score / r.maxScore) * 100 >= 80).length };
  }).filter(Boolean);

  const topPerformers = [...filteredResults]
    .sort((a, b) => (b.score / b.maxScore) - (a.score / a.maxScore))
    .slice(0, 5);

  const gradeDistribution = gradingSystem.map(g => ({
    ...g,
    count: filteredResults.filter(r => {
      const pct = (r.score / r.maxScore) * 100;
      return pct >= g.min && pct <= g.max;
    }).length,
  }));

  const handleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grade = getGrade(resultForm.score, resultForm.maxScore);
    const student = students.find(s => s.name === resultForm.studentName);
    if (editingResultId) {
      updateResult(editingResultId, {
        studentName: resultForm.studentName,
        class: resultForm.class,
        examName: resultForm.examName,
        score: resultForm.score,
        maxScore: resultForm.maxScore,
        grade,
      });
    } else {
      addResult({
        studentId: student?.id || '',
        studentName: resultForm.studentName,
        class: resultForm.class,
        examName: resultForm.examName,
        score: resultForm.score,
        maxScore: resultForm.maxScore,
        grade,
      });
    }
    setShowResultModal(false);
    setEditingResultId(null);
    setResultForm({ studentName: '', class: '', examName: '', subject: '', score: 0, maxScore: 100 });
  };

  const handleEditResult = (result: typeof results[0]) => {
    setResultForm({
      studentName: result.studentName,
      class: result.class,
      examName: result.examName,
      subject: '',
      score: result.score,
      maxScore: result.maxScore,
    });
    setEditingResultId(result.id);
    setShowResultModal(true);
  };

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bulkResults: Omit<typeof results[0], 'id'>[] = studentOptions
      .filter(s => s.class === (selectedClass === 'All Classes' ? s.class : selectedClass))
      .map(s => {
        const score = Math.floor(Math.random() * 50) + 40;
        return {
          studentId: s.id,
          studentName: s.name,
          class: s.class,
          examName: resultForm.examName,
          score,
          maxScore: resultForm.maxScore,
          grade: getGrade(score, resultForm.maxScore),
        };
      });
    if (bulkResults.length > 0) {
      addResultsBulk(bulkResults);
    }
    setShowBulkModal(false);
    setResultForm({ studentName: '', class: '', examName: '', subject: '', score: 0, maxScore: 100 });
  };

  const exportResults = () => {
    const headers = ['Student Name', 'Class', 'Exam', 'Score', 'Max Score', 'Percentage', 'Grade'];
    const rows = filteredResults.map(r => [
      r.studentName, r.class, r.examName, r.score.toString(), r.maxScore.toString(),
      ((r.score / r.maxScore) * 100).toFixed(1) + '%', r.grade
    ]);
    const csv = [headers.join(','), ...rows.map(row => row.map(cell => `"${cell}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-results-${selectedClass}-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importResults = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = parseCSV(text);
      rows.forEach(row => {
        if (row.studentName && row.examName && row.score) {
          const score = parseInt(row.score) || 0;
          const maxScore = parseInt(row.maxScore) || 100;
          addResult({
            studentId: '',
            studentName: row.studentName,
            class: row.class || '',
            examName: row.examName,
            score,
            maxScore,
            grade: row.grade || getGrade(score, maxScore),
          });
        }
      });
    };
    reader.readAsText(file);
  };

  const printReportCard = (studentName: string) => {
    const studentResults = results.filter(r => r.studentName === studentName);
    const student = students.find(s => s.name === studentName);
    if (studentResults.length === 0 || !student) return;
    const school = getSchoolProfile();
    const avg = Math.round(studentResults.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / studentResults.length);
    const position = [...new Set(results.filter(r => r.class === student.class).map(r => r.studentName))]
      .sort((a, b) => {
        const avgA = results.filter(r => r.studentName === a).reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / results.filter(r => r.studentName === a).length;
        const avgB = results.filter(r => r.studentName === b).reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / results.filter(r => r.studentName === b).length;
        return avgB - avgA;
      })
      .indexOf(studentName) + 1;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Report Card - ${student.name}</title>
<style>body{font-family:'Times New Roman',serif;padding:40px;max-width:800px;margin:0 auto}
.header{text-align:center;border-bottom:3px double #1a365d;padding-bottom:15px;margin-bottom:20px}
.header img{height:60px;margin-bottom:5px}
.header h1{margin:0;color:#1a365d;font-size:22px;text-transform:uppercase;letter-spacing:2px}
.header .motto{margin:5px 0 0;color:#666;font-style:italic;font-size:13px}
.header .contact{margin:8px 0 0;color:#888;font-size:12px}
.title{text-align:center;margin:15px 0;font-size:16px;font-weight:bold;color:#2563eb}
.box{border:2px solid #1a365d;padding:12px;margin:15px 0;border-radius:4px}
.info{display:flex;justify-content:space-between;flex-wrap:wrap}
.info div{margin:5px 0;font-size:13px}
table{width:100%;border-collapse:collapse;margin:15px 0}
th{background:#1a365d;color:white;padding:8px;text-align:center;font-size:13px;border:1px solid #1a365d}
td{padding:6px 8px;border:1px solid #ddd;text-align:center;font-size:13px}
tr:nth-child(even){background:#f0f4f8}
.summary{display:flex;justify-content:space-between;margin:15px 0;padding:12px;background:#f7fafc;border:1px solid #e2e8f0;border-radius:4px}
.summary div{text-align:center}.summary h3{margin:0;color:#1a365d;font-size:22px}.summary p{margin:4px 0 0;color:#666;font-size:11px}
.signatures{display:flex;justify-content:space-between;margin-top:50px}
.sig{text-align:center;border-top:1px solid #333;padding-top:5px;width:180px;font-size:13px}
.footer{text-align:center;font-size:10px;color:#999;margin-top:30px;border-top:1px solid #eee;padding-top:10px}
@media print{body{padding:20px}}</style></head><body>
<div class="header">
${school.logo ? `<img src="${school.logo}" alt="Logo"/>` : `<div style="width:60px;height:60px;border-radius:50%;background:#1a365d;color:white;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:bold;margin-bottom:5px">${school.name.charAt(0)}</div>`}
<h1>${school.name}</h1>
<p class="motto">"${school.motto}"</p>
<p class="contact">${school.address} &bull; ${school.phone} &bull; ${school.email}</p>
</div>
<div class="title">Student Report Card</div>
<div class="box"><div class="info">
<div><strong>Name:</strong> ${student.name}</div>
<div><strong>Class:</strong> ${student.class}</div>
<div><strong>Admission No:</strong> ${student.admissionNo}</div>
<div><strong>Gender:</strong> ${student.gender}</div>
</div></div>
<table><thead><tr><th style="text-align:left">Exam</th><th>Score</th><th>Max</th><th>Grade</th><th>Remarks</th></tr></thead><tbody>
${studentResults.map(r => `<tr><td style="text-align:left">${r.examName}</td><td>${r.score}</td><td>${r.maxScore}</td><td>${r.grade}</td><td>${(r.score/r.maxScore)*100>=70?'Excellent':(r.score/r.maxScore)*100>=50?'Good':'Needs improvement'}</td></tr>`).join('')}
</tbody></table>
<div class="summary">
<div><h3>${avg}%</h3><p>Overall Average</p></div>
<div><h3>${position}</h3><p>Position in Class</p></div>
<div><h3>${studentResults.length}</h3><p>Exams Taken</p></div>
</div>
<div class="signatures"><div class="sig">Class Teacher</div><div class="sig">${school.headTeacher}</div></div>
<div class="footer">Generated by SmartSchool Pro &bull; ${new Date().toLocaleDateString()}</div>
</body></html>`);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Results Management</h1>
          <p className="text-foreground/60">Track exam results and student performance</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer">
            <Upload size={18} /><span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={importResults} className="hidden" />
          </label>
          <button onClick={exportResults} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Download size={18} /><span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg hover:bg-muted">
            <Plus size={18} /><span className="hidden sm:inline">Bulk Entry</span>
          </button>
          <button onClick={() => { setEditingResultId(null); setShowResultModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
            <Plus size={18} />Add Result
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><FileText className="w-6 h-6 text-blue-600" /></div>
            <div><h3 className="text-2xl font-bold">{results.length}</h3><p className="text-sm text-foreground/60">Total Results</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><TrendingUp className="w-6 h-6 text-green-600" /></div>
            <div><h3 className="text-2xl font-bold">{avgScore}%</h3><p className="text-sm text-foreground/60">Average Score</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-yellow-600" /></div>
            <div><h3 className="text-2xl font-bold">{passRate}%</h3><p className="text-sm text-foreground/60">Pass Rate</p></div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center"><Star className="w-6 h-6 text-purple-600" /></div>
            <div><h3 className="text-2xl font-bold">{distinctionCount}</h3><p className="text-sm text-foreground/60">Distinctions</p></div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-4">
            {(['results', 'exams', 'analytics'] as const).map(tab => (
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
            {activeTab === 'results' && (
              <select value={selectedExam} onChange={(e) => setSelectedExam(e.target.value)} className="text-sm rounded-lg border border-border px-2 py-1.5">
                <option value="All">All Exams</option>
                {examOptions.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            )}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={14} />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border w-44" />
            </div>
          </div>
        </div>

        {activeTab === 'results' && (
          <div className="divide-y divide-border">
            {filteredResults.map(result => {
              const pct = Math.round((result.score / result.maxScore) * 100);
              return (
                <div key={result.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm">
                      {getInitials(result.studentName)}
                    </div>
                    <div>
                      <p className="font-medium">{result.studentName}</p>
                      <p className="text-sm text-foreground/60">{result.examName} &bull; {result.class}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">{result.score}/{result.maxScore}</p>
                      <p className="text-xs text-foreground/60">{pct}%</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                      gradingSystem.find(g => g.grade === result.grade)?.color || 'bg-gray-500'
                    }`}>{result.grade}</span>
                    <button onClick={() => printReportCard(result.studentName)} className="p-1.5 hover:bg-blue-100 rounded" title="Print Report Card">
                      <Eye size={14} className="text-blue-600" />
                    </button>
                    <button onClick={() => handleEditResult(result)} className="p-1.5 hover:bg-blue-100 rounded">
                      <Edit size={14} className="text-blue-600" />
                    </button>
                    <button onClick={() => deleteResult(result.id)} className="p-1.5 hover:bg-red-100 rounded">
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredResults.length === 0 && (
              <div className="p-8 text-center text-foreground/60">
                <Award size={40} className="mx-auto mb-3 text-foreground/30" />
                <p className="font-medium">No results found</p>
                <p className="text-sm">Add results or adjust filters</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="divide-y divide-border">
            {filteredExams.map(exam => (
              <div key={exam.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{exam.name}</p>
                  <p className="text-sm text-foreground/60">{exam.class}{exam.subject ? ` &bull; ${exam.subject}` : ''} &bull; {exam.date} &bull; {exam.duration}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  exam.status === 'Published' || exam.status === 'Completed' ? 'bg-green-100 text-green-700' :
                  exam.status === 'Due Soon' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{exam.status}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-6 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart3 size={18} />Grade Distribution</h3>
              <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
                {gradeDistribution.map(g => (
                  <div key={g.grade} className="text-center">
                    <div className={`w-full ${g.color} rounded-t-lg flex items-center justify-center text-white font-bold text-sm`} style={{ height: `${Math.max(g.count * 15, 30)}px` }}>
                      {g.count > 0 ? g.count : ''}
                    </div>
                    <p className="text-xs font-medium mt-1">{g.grade}</p>
                    <p className="text-xs text-foreground/50">{g.min}-{g.max}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Users size={18} />Class Performance</h3>
              <div className="space-y-3">
                {classAnalytics.map((c: any) => (
                  <div key={c.class}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{c.class}</span>
                      <span className="text-sm text-foreground/60">{c.count} results &bull; Avg: {c.avg}% &bull; Pass: {c.pass}% &bull; Distinctions: {c.distinctions}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div className="bg-primary rounded-full h-3 transition-all" style={{ width: `${c.avg}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Award size={18} />Top 5 Performers</h3>
              <div className="space-y-2">
                {topPerformers.map((result, i) => (
                  <div key={result.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700' : i === 1 ? 'bg-gray-100 text-gray-700' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-muted text-foreground/60'
                    }`}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="font-medium">{result.studentName}</p>
                      <p className="text-sm text-foreground/60">{result.class} &bull; {result.examName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{result.score}/{result.maxScore}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white ${
                        gradingSystem.find(g => g.grade === result.grade)?.color || 'bg-gray-500'
                      }`}>{result.grade}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showResultModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingResultId ? 'Edit Result' : 'Add Result'}</h2>
              <button onClick={() => setShowResultModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleResultSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Student Name</label>
                <select value={resultForm.studentName} onChange={(e) => {
                  const student = students.find(s => s.name === e.target.value);
                  setResultForm({ ...resultForm, studentName: e.target.value, class: student?.class || resultForm.class });
                }} className="w-full px-4 py-2 rounded-lg border border-border" required>
                  <option value="">Select Student</option>
                  {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.class})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Exam</label>
                <select value={resultForm.examName} onChange={(e) => setResultForm({ ...resultForm, examName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" required>
                  <option value="">Select Exam</option>
                  {examOptions.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Score</label>
                  <input type="number" min="0" max={resultForm.maxScore} value={resultForm.score}
                    onChange={(e) => setResultForm({ ...resultForm, score: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-lg border border-border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Score</label>
                  <input type="number" min="1" value={resultForm.maxScore}
                    onChange={(e) => setResultForm({ ...resultForm, maxScore: parseInt(e.target.value) || 100 })}
                    className="w-full px-4 py-2 rounded-lg border border-border" required />
                </div>
              </div>
              {resultForm.score > 0 && resultForm.maxScore > 0 && (
                <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
                  <span className="text-sm">Grade:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    gradingSystem.find(g => g.grade === getGrade(resultForm.score, resultForm.maxScore))?.color || 'bg-gray-500'
                  }`}>
                    {getGrade(resultForm.score, resultForm.maxScore)} ({Math.round((resultForm.score / resultForm.maxScore) * 100)}%)
                  </span>
                </div>
              )}
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowResultModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingResultId ? 'Update' : 'Add Result'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Bulk Result Entry</h2>
              <button onClick={() => setShowBulkModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleBulkSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Exam Name</label>
                <input type="text" value={resultForm.examName} onChange={(e) => setResultForm({ ...resultForm, examName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" placeholder="e.g. Mid-Term Exams" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Class</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border">
                  {classes.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Score</label>
                <input type="number" min="1" value={resultForm.maxScore} onChange={(e) => setResultForm({ ...resultForm, maxScore: parseInt(e.target.value) || 100 })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                <p className="font-medium">This will auto-generate results for all {studentOptions.filter(s => s.class === selectedClass).length} students in {selectedClass} with random scores (40-90%).</p>
                <p className="mt-1">You can edit individual results afterwards.</p>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setShowBulkModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Generate Results</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
