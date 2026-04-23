"use client";

import { useState } from 'react';
import { Plus, MapPin } from 'lucide-react';

const routes = [
  { id: 1, name: 'Route A - Ntinda', driver: 'Mr. Kato', students: 25, status: 'Active' },
  { id: 2, name: 'Route B - Kampala', driver: 'Mr. Ssebu', students: 30, status: 'Active' },
  { id: 3, name: 'Route C - Kira', driver: 'Mr. Muwonge', students: 20, status: 'Active' },
];

export default function TransportPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Transport</h1>
          <p className="text-foreground/60">Manage transport routes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg">
          <Plus size={18} />Add Route
        </button>
      </div>

      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              <th className="text-left px-4 py-3">Route</th>
              <th className="text-left px-4 py-3">Driver</th>
              <th className="text-right px-4 py-3">Students</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {routes.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3"><MapPin size={16} className="inline mr-2" />{r.name}</td>
                <td className="px-4 py-3">{r.driver}</td>
                <td className="px-4 py-3 text-right">{r.students}</td>
                <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-600">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}