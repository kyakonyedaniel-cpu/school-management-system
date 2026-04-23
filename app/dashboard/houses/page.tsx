'use client';

import { Heart, Users, Trophy, Plus } from 'lucide-react';

const houses = [
  { id: 1, name: 'Nile House', color: 'bg-blue-500', students: 85, points: 450, captain: 'David Ssebu' },
  { id: 2, name: 'Victoria House', color: 'bg-purple-500', students: 78, points: 420, captain: 'Sarah Nakato' },
  { id: 3, name: 'Albert House', color: 'bg-green-500', students: 72, points: 380, captain: 'John Okello' },
  { id: 4, name: 'Baker House', color: 'bg-red-500', students: 65, points: 350, captain: 'Mary Namuli' },
];

export default function HousesPage() {
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {houses.sort((a, b) => b.points - a.points).map((house, index) => (
          <div key={house.id} className="bg-white rounded-xl border-2 overflow-hidden">
            <div className={`${house.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">{house.name}</h3>
                {index === 0 && <Trophy className="w-6 h-6" />}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold">{house.students}</p>
                  <p className="text-xs text-foreground/60">Students</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{house.points}</p>
                  <p className="text-xs text-foreground/60">Points</p>
                </div>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs text-foreground/60">House Captain</p>
                <p className="font-medium">{house.captain}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Inter-House Competitions</h2>
        </div>
        <div className="divide-y divide-border">
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Athletics Meet 2026</h3>
              <p className="text-sm text-foreground/60">April 15, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-bold text-blue-500">Nile House</p>
                <p className="text-xs">Winner</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Football Tournament</h3>
              <p className="text-sm text-foreground/60">Term II, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-bold text-green-500">Victoria House</p>
                <p className="text-xs">Winner</p>
              </div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">Debate Competition</h3>
              <p className="text-sm text-foreground/60">Term I, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="font-bold text-purple-500">Albert House</p>
                <p className="text-xs">Winner</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}