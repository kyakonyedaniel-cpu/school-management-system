'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building, BookOpen, FileText, Bed, Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';

const mockEvents = [
  { id: 1, title: 'First Term Examinations', date: '2026-04-25', time: '8:00 AM', type: 'Exam' },
  { id: 2, title: 'Parents Teachers Meeting', date: '2026-04-28', time: '10:00 AM', type: 'Event' },
  { id: 3, title: 'Sport Day', date: '2026-05-05', time: '7:00 AM', type: 'Event' },
  { id: 4, title: 'Career Day', date: '2026-05-12', time: '9:00 AM', type: 'Event' },
  { id: 5, title: 'Second Term Begins', date: '2026-05-15', time: '8:00 AM', type: 'Holiday' },
];

export default function CalendarPage() {
  const [schoolName, setSchoolName] = useState('Your School');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('schoolName');
    if (stored) setSchoolName(stored);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventColor = (type: string) => {
    switch (type) {
      case 'Exam': return 'bg-red-100 text-red-700 border-red-200';
      case 'Event': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Holiday': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="hidden lg:block w-64 bg-white border-r border-border p-4">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-sm">{schoolName}</span>
        </div>
        <nav className="space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Dashboard</Link>
          <Link href="/dashboard/features" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Features</Link>
          <Link href="/dashboard/students" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Students</Link>
          <Link href="/dashboard/fees" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm">Fees</Link>
          <Link href="/dashboard/attendance" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><CheckCircle size={14} /> Attendance</Link>
          <Link href="/dashboard/calendar" className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm"><CalendarIcon size={14} /> Calendar</Link>
          <div className="pt-3 mt-3 border-t border-border">
            <p className="px-3 py-1 text-xs font-medium text-foreground/40">African Features</p>
            <Link href="/dashboard/curriculum" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><BookOpen size={14} /> Curriculum</Link>
            <Link href="/dashboard/exams" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Exams</Link>
            <Link href="/dashboard/academics" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Calendar size={14} /> Academics</Link>
            <Link href="/dashboard/boarding" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Bed size={14} /> Boarding</Link>
            <Link href="/dashboard/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><FileText size={14} /> Reports</Link>
            <Link href="/dashboard/staff" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Users size={14} /> Staff</Link>
            <Link href="/dashboard/houses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Heart size={14} /> Houses</Link>
            <Link href="/dashboard/parents" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><UsersRound size={14} /> PTA</Link>
            <Link href="/dashboard/admissions" className="flex items-center gap-2 px-3 py-2 rounded-lg text-foreground/70 hover:bg-muted text-sm"><Award size={14} /> Admissions</Link>
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Calendar</h1>
              <p className="text-sm text-foreground/60">School events and schedule</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">
              <Plus size={18} /> Add Event
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl border border-border">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="text-lg font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-muted"><ChevronLeft size={20} /></button>
                  <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm border border-border rounded-lg hover:bg-muted">Today</button>
                  <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-lg hover:bg-muted"><ChevronRight size={20} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-foreground/60 border-b border-border">{day}</div>
                ))}
                {days.map((day, index) => {
                  const dayEvents = mockEvents.filter(e => e.date === format(day, 'yyyy-MM-dd'));
                  return (
                    <div key={index} className={`min-h-24 p-2 border-b border-r border-border ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`}>
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm ${isToday(day) ? 'bg-primary text-white' : ''}`}>{format(day, 'd')}</span>
                      {dayEvents.slice(0, 2).map(event => (
                        <div key={event.id} className={`mt-1 px-2 py-1 text-xs rounded truncate cursor-pointer ${getEventColor(event.type)}`}>{event.title}</div>
                      ))}
                      {dayEvents.length > 2 && <div className="mt-1 text-xs text-foreground/60">+{dayEvents.length - 2} more</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-border">
                <div className="p-4 border-b border-border"><h3 className="font-semibold">Upcoming Events</h3></div>
                <div className="p-4 space-y-3">
                  {mockEvents.map(event => (
                    <div key={event.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${getEventColor(event.type)}`}>
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs opacity-80">
                        <span className="flex items-center gap-1"><CalendarIcon size={12} />{event.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-border">
                <div className="p-4 border-b border-border"><h3 className="font-semibold">Quick Stats</h3></div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/70">Events This Month</span>
                    <span className="font-semibold">{mockEvents.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/70">Exams</span>
                    <span className="font-semibold">{mockEvents.filter(e => e.type === 'Exam').length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/70">Holidays</span>
                    <span className="font-semibold">{mockEvents.filter(e => e.type === 'Holiday').length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}