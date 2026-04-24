'use client';

import { useState } from 'react';
import { Trophy, Plus } from 'lucide-react';
import { useHouses } from '@/lib/data';

export default function HousesPage() {
  const { houses, updateHousePoints } = useHouses();
  const [showPoints, setShowPoints] = useState(false);
  const [pointsForm, setPointsForm] = useState({ houseId: '', points: 0, reason: '' });

  const sortedHouses = [...houses].sort((a, b) => b.points - a.points);

  const handleAddPoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (pointsForm.houseId && pointsForm.points > 0) {
      updateHousePoints(pointsForm.houseId, pointsForm.points);
      setPointsForm({ houseId: '', points: 0, reason: '' });
      setShowPoints(false);
    }
  };

  const competitions = [
    { event: 'Athletics Meet 2026', date: 'April 15, 2026', winner: 'Nile House', color: 'blue' },
    { event: 'Football Tournament', date: 'Term II, 2026', winner: 'Victoria House', color: 'purple' },
    { event: 'Debate Competition', date: 'Term I, 2026', winner: 'Albert House', color: 'green' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Houses</h1>
          <p className="text-foreground/60">Manage school houses and inter-house competitions</p>
        </div>
        <button onClick={() => setShowPoints(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Award Points
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedHouses.map((house, index) => (
          <div key={house.id} className="bg-background rounded-xl border-2 overflow-hidden">
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

      <div className="bg-background rounded-xl border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Inter-House Competitions</h2>
        </div>
        <div className="divide-y divide-border">
          {competitions.map((comp, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium">{comp.event}</h3>
                <p className="text-sm text-foreground/60">{comp.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="font-bold text-blue-600">{comp.winner}</p>
                  <p className="text-xs">Winner</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showPoints && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4">Award House Points</h3>
            <form onSubmit={handleAddPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select House</label>
                <select required value={pointsForm.houseId} onChange={(e) => setPointsForm({ ...pointsForm, houseId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select house</option>
                  {houses.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Points to Add</label>
                <input type="number" required min="1" value={pointsForm.points} onChange={(e) => setPointsForm({ ...pointsForm, points: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <input type="text" value={pointsForm.reason} onChange={(e) => setPointsForm({ ...pointsForm, reason: e.target.value })}
                  placeholder="e.g. Won football match"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowPoints(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Award Points</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}