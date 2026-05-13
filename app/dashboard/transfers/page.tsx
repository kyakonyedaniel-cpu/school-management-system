'use client';

import { useState, useEffect } from 'react';
import { ArrowRightLeft, Search, Download, Printer, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Transfer {
  id: number;
  studentId: string;
  studentName: string;
  fromClass: string;
  toClass: string;
  reason: string;
  date: string;
  status: 'completed' | 'pending' | 'rejected';
  approvedBy: string;
}

interface LeavingCertificate {
  id: number;
  studentId: string;
  studentName: string;
  class: string;
  leavingDate: string;
  reason: string;
  conduct: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  remarks: string;
  status: 'active';
}

export default function TransfersPage() {
  const [activeTab, setActiveTab] = useState<'transfers' | 'certificates'>('transfers');
  const [students, setStudents] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [certificates, setCertificates] = useState<LeavingCertificate[]>([]);
  const [search, setSearch] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [toClass, setToClass] = useState('');
  const [reason, setReason] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);
  const [certReason, setCertReason] = useState('');
  const [certConduct, setCertConduct] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Good');
  const [certRemarks, setCertRemarks] = useState('');

  const classes = ['P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('school_students') || '[]');
    setStudents(storedStudents);
    const stored = JSON.parse(localStorage.getItem('school_transfers') || '[]');
    setTransfers(stored);
    const certs = JSON.parse(localStorage.getItem('school_leaving_certificates') || '[]');
    setCertificates(certs);
  }, []);

  const handleTransfer = () => {
    if (!selectedStudent || !toClass || !reason) return;
    const student = students.find((s: any) => s.id === selectedStudent);
    const transfer: Transfer = { id: Date.now(), studentId: selectedStudent, studentName: student?.name || '', fromClass: student?.class || '', toClass, reason, date: new Date().toISOString().split('T')[0], status: 'completed', approvedBy: 'Admin' };
    const updated = [...transfers, transfer];
    setTransfers(updated);
    localStorage.setItem('school_transfers', JSON.stringify(updated));
    alert(`${student?.name} transferred to ${toClass}`);
    setShowTransferModal(false);
    setSelectedStudent('');
    setToClass('');
    setReason('');
  };

  const handleIssueCertificate = () => {
    if (!selectedStudent || !certReason) return;
    const student = students.find((s: any) => s.id === selectedStudent);
    const cert: LeavingCertificate = { id: Date.now(), studentId: selectedStudent, studentName: student?.name || '', class: student?.class || '', leavingDate: new Date().toISOString().split('T')[0], reason: certReason, conduct: certConduct, remarks: certRemarks, status: 'active' };
    const updated = [...certificates, cert];
    setCertificates(updated);
    localStorage.setItem('school_leaving_certificates', JSON.stringify(updated));
    alert(`Leaving certificate issued for ${student?.name}`);
    setShowCertModal(false);
    setCertReason('');
    setCertRemarks('');
  };

  const printCertificate = (cert: LeavingCertificate) => {
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`
      <html><head><title>Leaving Certificate</title>
      <style>body{font-family:serif;padding:40px;text-align:center}.cert{border:2px solid #000;padding:40px;max-width:600px;margin:auto}h1{font-size:28px;margin-bottom:5px}.seal{margin:20px auto;width:60px;height:60px;border:3px solid #000;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold}.line{border-top:1px solid #000;margin:15px 0}.footer{margin-top:30px;display:flex;justify-content:space-between}@media print{body{margin:0;padding:20px}}</style></head>
      <body><div class="cert">
        <h1>LEAVING CERTIFICATE</h1>
        <p style="font-size:12px;color:#666">SmartSchool Pro</p>
        <div class="seal">SCHOOL SEAL</div>
        <p style="font-size:18px;margin:20px 0">This is to certify that</p>
        <h2 style="font-size:24px;margin:10px 0">${cert.studentName}</h2>
        <p>of Class <strong>${cert.class}</strong></p>
        <div class="line"></div>
        <p>Left school on <strong>${new Date(cert.leavingDate).toLocaleDateString('en-UG')}</strong></p>
        <p><strong>Reason:</strong> ${cert.reason}</p>
        <p><strong>Conduct:</strong> ${cert.conduct}</p>
        <p><strong>Remarks:</strong> ${cert.remarks}</p>
        <div class="footer"><span>Head Teacher</span><span>Date: ${new Date().toLocaleDateString('en-UG')}</span></div>
      </div>
      <script>window.print()</script></body></html>
    `);
    w.document.close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Transfers</h1>
          <p className="text-foreground/60">Manage class transfers and issue leaving certificates</p>
        </div>
      </div>

      <div className="flex gap-2 bg-background border rounded-lg p-1 w-fit">
        {(['transfers', 'certificates'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-primary text-white' : 'text-foreground/60 hover:text-foreground'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'transfers' && (
        <>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search transfers..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
            </div>
            <button onClick={() => setShowTransferModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"><ArrowRightLeft size={18} /> New Transfer</button>
          </div>

          <div className="bg-background rounded-xl border">
            <div className="divide-y">
              {(search ? transfers.filter(t => t.studentName.toLowerCase().includes(search.toLowerCase())) : transfers).length > 0 ? transfers.filter(t => !search || t.studentName.toLowerCase().includes(search.toLowerCase())).map(t => (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <ArrowRightLeft size={18} className="text-primary" />
                    <div>
                      <p className="font-medium">{t.studentName}</p>
                      <p className="text-sm text-foreground/60">{t.fromClass} → {t.toClass} • {t.date}</p>
                      <p className="text-xs text-foreground/60">Reason: {t.reason}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${t.status === 'completed' ? 'bg-green-100 text-green-600' : t.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'}`}>{t.status}</span>
                </div>
              )) : <p className="p-8 text-center text-foreground/60">No transfers recorded</p>}
            </div>
          </div>
        </>
      )}

      {activeTab === 'certificates' && (
        <>
          <button onClick={() => { setSelectedStudent(''); setShowCertModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"><FileText size={18} /> Issue Leaving Certificate</button>
          <div className="bg-background rounded-xl border">
            <div className="p-4 border-b"><h2 className="font-semibold">Issued Certificates</h2></div>
            {certificates.length > 0 ? (
              <div className="divide-y">
                {certificates.map(c => (
                  <div key={c.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                    <div>
                      <p className="font-medium">{c.studentName}</p>
                      <p className="text-sm text-foreground/60">{c.class} • Left: {new Date(c.leavingDate).toLocaleDateString('en-UG')} • Conduct: {c.conduct}</p>
                    </div>
                    <button onClick={() => printCertificate(c)} className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-sm hover:bg-muted"><Printer size={14} /> Print</button>
                  </div>
                ))}
              </div>
            ) : <p className="p-8 text-center text-foreground/60">No certificates issued</p>}
          </div>
        </>
      )}

      {showTransferModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Transfer Student</h2>
            <div className="space-y-4">
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border">
                <option value="">Select Student</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.name} - {s.class}</option>)}
              </select>
              <select value={toClass} onChange={(e) => setToClass(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border">
                <option value="">Transfer to Class</option>
                {classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for transfer" rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowTransferModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={handleTransfer} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Complete Transfer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold mb-4">Issue Leaving Certificate</h2>
            <div className="space-y-4">
              <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border">
                <option value="">Select Student</option>
                {students.map((s: any) => <option key={s.id} value={s.id}>{s.name} - {s.class}</option>)}
              </select>
              <textarea value={certReason} onChange={(e) => setCertReason(e.target.value)} placeholder="Reason for leaving" rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
              <select value={certConduct} onChange={(e) => setCertConduct(e.target.value as any)} className="w-full px-4 py-2 rounded-lg border border-border">
                <option value="Excellent">Excellent</option><option value="Good">Good</option><option value="Fair">Fair</option><option value="Poor">Poor</option>
              </select>
              <textarea value={certRemarks} onChange={(e) => setCertRemarks(e.target.value)} placeholder="Additional remarks" rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCertModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={handleIssueCertificate} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Issue Certificate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
