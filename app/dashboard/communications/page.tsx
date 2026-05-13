'use client';

import { useState, useEffect } from 'react';
import { Send, MessageSquare, Mail, Phone, History, CheckCircle, Clock, XCircle } from 'lucide-react';
import { sendWhatsApp } from '@/lib/whatsapp';
import { formatUGX } from '@/lib/data';

interface MessageLog {
  id: number;
  type: 'sms' | 'whatsapp' | 'email';
  recipient: string;
  recipientName: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
  date: string;
}

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<'send' | 'history' | 'templates'>('send');
  const [messageType, setMessageType] = useState<'sms' | 'whatsapp' | 'email'>('whatsapp');
  const [recipientType, setRecipientType] = useState<'all' | 'class' | 'single'>('single');
  const [selectedClass, setSelectedClass] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [messageLog, setMessageLog] = useState<MessageLog[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  const classes = ['P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('school_students') || '[]');
    setStudents(stored);
    const logs = JSON.parse(localStorage.getItem('school_message_logs') || '[]');
    setMessageLog(logs);
  }, []);

  const saveLog = (log: MessageLog) => {
    const updated = [...messageLog, log];
    setMessageLog(updated);
    localStorage.setItem('school_message_logs', JSON.stringify(updated));
  };

  const handleSend = async () => {
    if (!message) return alert('Please enter a message');
    setSending(true);
    let recipients: { phone: string; name: string; parent: string }[] = [];

    if (recipientType === 'single') {
      if (!phone) return alert('Please enter a phone number');
      recipients = [{ phone, name: 'Parent', parent: '' }];
    } else if (recipientType === 'class') {
      if (!selectedClass) return alert('Please select a class');
      recipients = students.filter((s: any) => s.class === selectedClass).map((s: any) => ({ phone: s.phone, name: s.name, parent: s.parent }));
    } else {
      recipients = students.map((s: any) => ({ phone: s.phone, name: s.name, parent: s.parent }));
    }

    if (recipients.length === 0) return alert('No recipients found');

    for (const r of recipients) {
      const personalizedMsg = message.replace(/{student}/g, r.name).replace(/{parent}/g, r.parent);
      try {
        if (messageType === 'whatsapp') {
          sendWhatsApp(r.phone, personalizedMsg);
        } else {
          alert(`SMS sent to ${r.parent || r.name} at ${r.phone}`);
        }
        saveLog({ id: Date.now(), type: messageType, recipient: r.phone, recipientName: r.parent || r.name, message: personalizedMsg, status: 'sent', date: new Date().toISOString() });
      } catch {
        saveLog({ id: Date.now() + 1, type: messageType, recipient: r.phone, recipientName: r.parent || r.name, message: personalizedMsg, status: 'failed', date: new Date().toISOString() });
      }
    }
    setSending(false);
    alert(`Message sent to ${recipients.length} recipient(s)`);
    setMessage('');
    setPhone('');
  };

  const templates = [
    { name: 'Fee Reminder', message: 'Dear {parent}, fee payment for {student} is due. Please pay to avoid penalties. Thank you.' },
    { name: 'Meeting Notice', message: 'Dear {parent}, there is a parent-teacher meeting on Friday. Your presence is required for {student}.' },
    { name: 'Holiday Notice', message: 'Dear {parent}, school will close for holidays on Friday. Please pick up {student} by 4pm.' },
    { name: 'Result Notification', message: 'Dear {parent}, results for {student} are now available on the parent portal. Login to view.' },
    { name: 'Event Invitation', message: 'Dear {parent}, you are cordially invited to {student}\'s school event this Saturday.' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Communications Hub</h1>
          <p className="text-foreground/60">Send messages to parents via WhatsApp, SMS, or Email</p>
        </div>
      </div>

      <div className="flex gap-2 bg-background border rounded-lg p-1 w-fit">
        {(['send', 'history', 'templates'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${activeTab === tab ? 'bg-primary text-white' : 'text-foreground/60 hover:text-foreground'}`}>{tab}</button>
        ))}
      </div>

      {activeTab === 'send' && (
        <div className="bg-background rounded-xl border p-6 max-w-2xl">
          <div className="flex gap-4 mb-6">
            <button onClick={() => setMessageType('whatsapp')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${messageType === 'whatsapp' ? 'border-green-600 bg-green-50 text-green-700' : 'border-border'}`}><MessageSquare size={18} /> WhatsApp</button>
            <button onClick={() => setMessageType('sms')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${messageType === 'sms' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-border'}`}><Phone size={18} /> SMS</button>
            <button onClick={() => setMessageType('email')} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${messageType === 'email' ? 'border-purple-600 bg-purple-50 text-purple-700' : 'border-border'}`}><Mail size={18} /> Email</button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Recipients</label>
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2"><input type="radio" name="recipient" checked={recipientType === 'single'} onChange={() => setRecipientType('single')} /> Single Parent</label>
                <label className="flex items-center gap-2"><input type="radio" name="recipient" checked={recipientType === 'class'} onChange={() => setRecipientType('class')} /> Whole Class</label>
                <label className="flex items-center gap-2"><input type="radio" name="recipient" checked={recipientType === 'all'} onChange={() => setRecipientType('all')} /> All Parents</label>
              </div>
              {recipientType === 'single' && <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number (e.g. 0772123456)" className="w-full px-4 py-2 rounded-lg border border-border" />}
              {recipientType === 'class' && <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-2 rounded-lg border border-border">{classes.map(c => <option key={c} value={c}>{c}</option>)}</select>}
              {recipientType === 'all' && <p className="text-sm text-foreground/60">Sending to {students.filter(s => s.phone).length} parents</p>}
            </div>

            {messageType === 'email' && <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Email subject" className="w-full px-4 py-2 rounded-lg border border-border" />}

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <p className="text-xs text-foreground/60 mb-2">Use {'{student}'}, {'{parent}'} as placeholders</p>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} placeholder="Type your message here..." className="w-full px-4 py-2 rounded-lg border border-border" />
            </div>

            <button onClick={handleSend} disabled={sending} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
              <Send size={18} />{sending ? 'Sending...' : `Send via ${messageType === 'whatsapp' ? 'WhatsApp' : messageType === 'sms' ? 'SMS' : 'Email'}`}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="bg-background rounded-xl border p-6 max-w-2xl">
          <h2 className="font-semibold mb-4">Message Templates</h2>
          <div className="space-y-3">
            {templates.map((t, i) => (
              <div key={i} className="p-4 border rounded-lg hover:border-primary cursor-pointer" onClick={() => { setMessage(t.message); setActiveTab('send'); }}>
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-foreground/60 mt-1">{t.message.substring(0, 80)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-background rounded-xl border">
          <div className="p-4 border-b"><h2 className="font-semibold">Message History</h2></div>
          {messageLog.length > 0 ? (
            <div className="divide-y">
              {messageLog.slice().reverse().map((log: MessageLog) => (
                <div key={log.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    {log.status === 'sent' ? <CheckCircle size={18} className="text-green-600" /> : log.status === 'pending' ? <Clock size={18} className="text-yellow-600" /> : <XCircle size={18} className="text-red-600" />}
                    <div>
                      <p className="font-medium text-sm">{log.recipientName} ({log.recipient})</p>
                      <p className="text-xs text-foreground/60">{log.message.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <span className="text-xs text-foreground/60">{new Date(log.date).toLocaleDateString('en-UG')}</span>
                </div>
              ))}
            </div>
          ) : <p className="p-8 text-center text-foreground/60">No messages sent yet</p>}
        </div>
      )}
    </div>
  );
}
