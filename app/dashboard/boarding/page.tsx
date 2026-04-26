'use client';

import { Users, Bed, Utensils, Home, Edit } from 'lucide-react';

const boardingStudents = [
  { id: 1, name: 'John Okello', class: 'S.2', dorm: 'Nile House', room: 'Room 12', status: 'Active', meals: 3 },
  { id: 2, name: 'Sarah Nakato', class: 'S.3', dorm: 'Victoria House', room: 'Room 8', status: 'Active', meals: 3 },
  { id: 3, name: 'David Ssebu', class: 'S.1', dorm: 'Albert House', room: 'Room 5', status: 'Active', meals: 3 },
  { id: 4, name: 'Mary Namuli', class: 'S.4', dorm: 'Victoria House', room: 'Room 15', status: 'Active', meals: 3 },
  { id: 5, name: 'Peter Wasswa', class: 'P.7', dorm: 'Baker House', room: 'Room 3', status: 'Active', meals: 3 },
];

const dormitories = [
  { name: 'Nile House', capacity: 40, occupied: 35, gender: 'Boys' },
  { name: 'Albert House', capacity: 35, occupied: 28, gender: 'Boys' },
  { name: 'Baker House', capacity: 30, occupied: 25, gender: 'Boys' },
  { name: 'Victoria House', capacity: 45, occupied: 40, gender: 'Girls' },
];

export default function BoardingPage() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><Users className="w-6 h-6 text-orange-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{boardingStudents.length}</h3>
              <p className="text-sm text-foreground/60">Total Boarders</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center"><Bed className="w-6 h-6 text-blue-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{dormitories.reduce((acc, d) => acc + d.occupied, 0)}</h3>
              <p className="text-sm text-foreground/60">Dorm Spaces Used</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><Utensils className="w-6 h-6 text-green-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-sm text-foreground/60">Meals/Day</p>
            </div>
          </div>
        </div>
        <div className="bg-background rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><Home className="w-6 h-6 text-red-600" /></div>
            <div>
              <h3 className="text-2xl font-bold">{dormitories.length}</h3>
              <p className="text-sm text-foreground/60">Dormitories</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Boarding Students</h2>
            <div className="flex items-center gap-2">
              <select className="px-3 py-1.5 text-sm border border-border rounded-lg">
                <option>All Classes</option>
                <option>P.5 - P.7</option>
                <option>S.1 - S.4</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Class</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Dormitory</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Room</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-foreground/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {boardingStudents.map((student) => (
                  <tr key={student.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{student.name}</td>
                    <td className="px-4 py-3 text-sm">{student.class}</td>
                    <td className="px-4 py-3 text-sm">{student.dorm}</td>
                    <td className="px-4 py-3 text-sm">{student.room}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 hover:bg-muted rounded"><Edit size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-background rounded-xl border border-border">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold">Dormitory Occupancy</h2>
          </div>
          <div className="p-4 space-y-4">
            {dormitories.map((dorm) => (
              <div key={dorm.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span>{dorm.name} ({dorm.gender})</span>
                  <span>{dorm.occupied}/{dorm.capacity}</span>
                </div>
                <div className="h-3 bg-muted rounded-full">
                  <div className="h-3 bg-primary rounded-full" style={{ width: `${(dorm.occupied / dorm.capacity) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
