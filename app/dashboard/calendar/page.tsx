'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Calendar, CheckCircle, Users, Heart, Award, UsersRound, Plus, ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { useEvents } from '@/lib/data';

const eventTypes = [
  { id: 'Exam', name: 'Exam', color: 'bg-red-100 text-red-700 border-red-200' },
  { id: 'Event', name: 'Event', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'Holiday', name: 'Holiday', color: 'bg-green-100 text-green-700 border-green-200' },
];

export default function CalendarPage() {
  const { events, addEvent, deleteEvent } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '8:00 AM',
    type: 'Event',
    description: ''
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventColor = (type: string) => {
    const found = eventTypes.find(t => t.id === type);
    return found ? found.color : 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addEvent({
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time,
      type: eventForm.type,
      description: eventForm.description
    });
    setShowAddEvent(false);
    setEventForm({ title: '', date: '', time: '8:00 AM', type: 'Event', description: '' });
  };

  const monthEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-foreground/60">School events and important dates</p>
        </div>
        <button onClick={() => setShowAddEvent(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Event
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
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
              const dayEvents = events.filter(e => e.date === format(day, 'yyyy-MM-dd'));
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
          <div className="bg-background rounded-xl border border-border">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Upcoming Events</h3>
              <button onClick={() => setShowAddEvent(true)} className="text-sm text-primary hover:underline">+ Add</button>
            </div>
            <div className="p-4 space-y-3">
              {events.slice(0, 5).map(event => (
                <div key={event.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${getEventColor(event.type)}`}>
                  <p className="font-medium text-sm">{event.title}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs opacity-80">
                    <span className="flex items-center gap-1"><CalendarIcon size={12} />{event.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{event.time}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }}
                    className="mt-2 text-xs hover:underline opacity-60">Remove</button>
                </div>
              ))}
              {events.length === 0 && (
                <div className="text-center text-foreground/60 py-4">No events yet. Add one!</div>
              )}
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border">
            <div className="p-4 border-b border-border"><h3 className="font-semibold">Quick Stats</h3></div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Events This Month</span>
                <span className="font-semibold">{monthEvents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Exams</span>
                <span className="font-semibold">{events.filter(e => e.type === 'Exam').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/70">Holidays</span>
                <span className="font-semibold">{events.filter(e => e.type === 'Holiday').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-xl border border-border p-4">
            <h3 className="font-semibold mb-3">Event Types</h3>
            <div className="space-y-2">
              {eventTypes.map(type => (
                <div key={type.id} className={`px-3 py-2 rounded-lg ${type.color}`}>
                  <span className="text-sm font-medium">{type.name}</span>
                  <span className="text-xs opacity-70 ml-2">
                    ({events.filter(e => e.type === type.id).length})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAddEvent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Event</h2>
              <button onClick={() => setShowAddEvent(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title</label>
                <input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Sports Day"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time</label>
                  <input type="text" required value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    placeholder="e.g. 8:00 AM"
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select required value={eventForm.type} onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  {eventTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddEvent(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Add Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}