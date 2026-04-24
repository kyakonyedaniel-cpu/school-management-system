"use client";

import { useState } from 'react';
import { Plus, Edit, Search, Phone, Mail } from 'lucide-react';

const staffMembers = [
  { id: 1, name: 'Mr. John Kamulegeya', role: 'Headteacher', department: 'Administration', phone: '0772XXX', email: 'john@school.ug' },
  { id: 2, name: 'Mrs. Grace Namutowe', role: 'Deputy Head', department: 'Administration', phone: '0773XXX', email: 'grace@school.ug' },
  { id: 3, name: 'Mr. Peter Ssegujja', role: 'Mathematics Teacher', department: 'Science', phone: '0774XXX', email: 'peter@school.ug' },
  { id: 4, name: 'Mrs. Faith Mbabazi', role: 'English Teacher', department: 'Languages', phone: '0775XXX', email: 'faith@school.ug' },
  { id: 5, name: 'Mr. David Kigozi', role: 'Science Teacher', department: 'Science', phone: '0776XXX', email: 'david@school.ug' },
  { id: 6, name: 'Ms. Sarah Nakayiza', role: 'Secretary', department: 'Administration', phone: '0777XXX', email: 'sarah@school.ug' },
];

const formatUGX = (amount: number) => `UGX ${amount.toLocaleString('en-US')}`;

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = staffMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-foreground/60">{staffMembers.length} staff members</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Staff
        </button>
      </div>

      {/* Staff List */}
      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={20} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border"
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Role</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Department</th>
              <th className="text-left px-4 py-3 text-sm font-medium">Contact</th>
              <th className="text-right px-4 py-3 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredStaff.map((member) => (
              <tr key={member.id}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{member.role}</td>
                <td className="px-4 py-3">{member.department}</td>
                <td className="px-4 py-3">
                  <p className="text-sm">{member.phone}</p>
                  <p className="text-xs text-foreground/60">{member.email}</p>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="p-2 rounded-lg hover:bg-muted"><Edit size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
