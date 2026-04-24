"use client";

import { useState } from 'react';
import { Plus, Search, Filter, Edit, Mail, Phone, ChevronLeft, ChevronRight } from 'lucide-react';

const mockStudents = [
  { id: 1, name: 'John Okello', class: 'P.7', admissionNo: 'ST/2024/001', gender: 'Male', parent: 'Mr. Okello', phone: '0770XXX', fees: 'Paid', status: 'Active' },
  { id: 2, name: 'Sarah Nakato', class: 'S.1', admissionNo: 'ST/2024/002', gender: 'Female', parent: 'Mrs. Nakato', phone: '0772XXX', fees: 'Pending', status: 'Active' },
  { id: 3, name: 'David Ssebu', class: 'P.6', admissionNo: 'ST/2024/003', gender: 'Male', parent: 'Mr. Ssebu', phone: '0773XXX', fees: 'Overdue', status: 'Active' },
  { id: 4, name: 'Mary Namuli', class: 'S.2', admissionNo: 'ST/2024/004', gender: 'Female', parent: 'Mr. Namuli', phone: '0774XXX', fees: 'Paid', status: 'Active' },
  { id: 5, name: 'Peter Wasswa', class: 'P.5', admissionNo: 'ST/2024/005', gender: 'Male', parent: 'Mr. Wasswa', phone: '0775XXX', fees: 'Paid', status: 'Active' },
  { id: 6, name: 'Grace Atim', class: 'S.3', admissionNo: 'ST/2024/006', gender: 'Female', parent: 'Mrs. Atim', phone: '0776XXX', fees: 'Pending', status: 'Active' },
  { id: 7, name: 'James Mukasa', class: 'P.6', admissionNo: 'ST/2024/007', gender: 'Male', parent: 'Mr. Mukasa', phone: '0777XXX', fees: 'Paid', status: 'Active' },
  { id: 8, name: 'Faith Apio', class: 'S.1', admissionNo: 'ST/2024/008', gender: 'Female', parent: 'Mrs. Apio', phone: '0778XXX', fees: 'Paid', status: 'Active' },
];

const classes = ['All Classes', 'P.1', 'P.2', 'P.3', 'P.4', 'P.5', 'P.6', 'P.7', 'S.1', 'S.2', 'S.3', 'S.4', 'S.5', 'S.6'];

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === 'All Classes' || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const getFeesColor = (fees: string) => {
    switch (fees) {
      case 'Paid': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Students</h1>
          <p className="text-foreground/60">{filteredStudents.length} total students</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary/90">
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input
              type="text"
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border focus:border-primary outline-none"
          >
            {classes.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <Filter size={18} />
            More Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Class</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Gender</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Parent</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Fees</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-sm font-medium">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-foreground/60">{student.admissionNo}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{student.class}</td>
                  <td className="px-6 py-4 text-sm">{student.gender}</td>
                  <td className="px-6 py-4 text-sm">{student.parent}</td>
                  <td className="px-6 py-4 text-sm">{student.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeesColor(student.fees)}`}>
                      {student.fees}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted"><Mail size={16} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted"><Phone size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-foreground/60">Showing {filteredStudents.length} of {mockStudents.length} students</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50" disabled>
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 py-1 bg-primary text-white text-sm rounded-lg">1</span>
            <button className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50" disabled>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
