'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Plus, AlertTriangle, Clock, Wrench } from 'lucide-react';

interface Asset {
  id: number;
  name: string;
  category: string;
  serialNo: string;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
  condition: 'Good' | 'Fair' | 'Poor' | 'Under Repair';
  assignedTo: string;
  notes: string;
  lastMaintenance: string;
  nextMaintenance: string;
  status: 'active' | 'retired';
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', serialNo: '', location: '', purchaseDate: '', purchaseCost: 0, condition: 'Good' as Asset['condition'], assignedTo: '', notes: '', lastMaintenance: '', nextMaintenance: '' });
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceAsset, setMaintenanceAsset] = useState<Asset | null>(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('school_assets') || '[]');
    setAssets(stored.length > 0 ? stored : [
      { id: 1, name: 'HP Laptop', category: 'Electronics', serialNo: 'HP2024001', location: 'Staff Room', purchaseDate: '2024-01-15', purchaseCost: 3500000, condition: 'Good', assignedTo: 'Admin Office', notes: '', lastMaintenance: '2024-06-01', nextMaintenance: '2024-12-01', status: 'active' },
      { id: 2, name: 'Projector', category: 'Electronics', serialNo: 'EPS2024001', location: 'Assembly Hall', purchaseDate: '2024-02-20', purchaseCost: 2500000, condition: 'Fair', assignedTo: 'Assembly Hall', notes: 'Bulb needs replacement', lastMaintenance: '2024-08-01', nextMaintenance: '2024-11-01', status: 'active' },
      { id: 3, name: 'Whiteboard', category: 'Furniture', serialNo: 'WB2024001', location: 'Classroom P.5', purchaseDate: '2023-05-10', purchaseCost: 450000, condition: 'Good', assignedTo: 'P.5 Classroom', notes: '', lastMaintenance: '2024-03-01', nextMaintenance: '2025-03-01', status: 'active' },
    ]);
  }, []);

  const categories = ['Electronics', 'Furniture', 'Sports Equipment', 'Library Books', 'Laboratory', 'Musical Instruments', 'Vehicles', 'Kitchen', 'Other'];

  const saveAssets = (data: Asset[]) => {
    setAssets(data);
    localStorage.setItem('school_assets', JSON.stringify(data));
  };

  const handleAdd = () => {
    if (!form.name || !form.category) return;
    const newAsset: Asset = { id: Date.now(), ...form, lastMaintenance: form.lastMaintenance || new Date().toISOString().split('T')[0], nextMaintenance: form.nextMaintenance || '', status: 'active' };
    saveAssets([...assets, newAsset]);
    setShowAddModal(false);
    setForm({ name: '', category: '', serialNo: '', location: '', purchaseDate: '', purchaseCost: 0, condition: 'Good', assignedTo: '', notes: '', lastMaintenance: '', nextMaintenance: '' });
  };

  const handleMaintenance = () => {
    if (!maintenanceAsset || !maintenanceNotes) return;
    const updated = assets.map(a => a.id === maintenanceAsset.id ? { ...a, condition: 'Under Repair' as const, notes: (a.notes ? a.notes + '; ' : '') + maintenanceNotes, lastMaintenance: new Date().toISOString().split('T')[0] } : a);
    saveAssets(updated);
    setShowMaintenanceModal(false);
    setMaintenanceAsset(null);
    setMaintenanceNotes('');
    alert('Maintenance record added');
  };

  const toggleStatus = (asset: Asset) => {
    if (confirm(`${asset.status === 'active' ? 'Retire' : 'Reactivate'} this asset?`)) {
      const updated = assets.map(a => a.id === asset.id ? { ...a, status: a.status === 'active' ? 'retired' as const : 'active' as const } : a);
      saveAssets(updated);
    }
  };

  const totalValue = assets.reduce((sum, a) => sum + (a.status === 'active' ? a.purchaseCost : 0), 0);
  const needsMaintenance = assets.filter(a => a.status === 'active' && a.nextMaintenance && new Date(a.nextMaintenance) <= new Date());
  const filtered = search ? assets.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase())) : assets;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assets & Equipment</h1>
          <p className="text-foreground/60">{assets.filter(a => a.status === 'active').length} active assets</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"><Plus size={18} /> Add Asset</button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold">{assets.length}</p><p className="text-sm text-foreground/60">Total Assets</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold">UGX {(totalValue / 1000000).toFixed(1)}M</p><p className="text-sm text-foreground/60">Total Value</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold text-yellow-600">{needsMaintenance.length}</p><p className="text-sm text-foreground/60">Needs Maintenance</p></div>
        <div className="bg-background border rounded-lg p-4"><p className="text-2xl font-bold text-red-600">{assets.filter(a => a.condition === 'Poor' || a.condition === 'Under Repair').length}</p><p className="text-sm text-foreground/60">Needs Attention</p></div>
      </div>

      {needsMaintenance.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-yellow-600" />
          <p className="text-sm text-yellow-800"><strong>{needsMaintenance.length} asset(s)</strong> due for maintenance</p>
        </div>
      )}

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assets..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-border" />
      </div>

      <div className="bg-background rounded-xl border">
        <div className="divide-y">
          {filtered.map(a => (
            <div key={a.id} className="p-4 flex items-center justify-between hover:bg-muted/30">
              <div className="flex items-center gap-3 flex-1">
                <Package size={20} className="text-foreground/40" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${a.status === 'retired' ? 'line-through text-foreground/40' : ''}`}>{a.name}</p>
                    {a.nextMaintenance && new Date(a.nextMaintenance) <= new Date() && a.status === 'active' && <Clock size={14} className="text-yellow-600" />}
                  </div>
                  <p className="text-sm text-foreground/60">{a.category} • {a.serialNo} • {a.location}</p>
                  <p className="text-xs text-foreground/60">
                    UGX {(a.purchaseCost || 0).toLocaleString()} • {a.assignedTo ? `Assigned: ${a.assignedTo}` : 'Unassigned'}
                    {a.lastMaintenance && ` • Last maint: ${new Date(a.lastMaintenance).toLocaleDateString('en-UG')}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setMaintenanceAsset(a); setMaintenanceNotes(''); setShowMaintenanceModal(true); }} className="p-2 hover:bg-muted rounded" title="Log Maintenance"><Wrench size={16} /></button>
                <span className={`px-2 py-1 rounded-full text-xs ${a.condition === 'Good' ? 'bg-green-100 text-green-600' : a.condition === 'Fair' ? 'bg-yellow-100 text-yellow-600' : a.condition === 'Poor' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{a.condition}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${a.status === 'active' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{a.status}</span>
                <button onClick={() => toggleStatus(a)} className="p-2 text-red-600 hover:bg-red-50 rounded">{a.status === 'active' ? 'Retire' : 'Activate'}</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="p-8 text-center text-foreground/60">No assets found</p>}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">Add Asset</h2>
            <div className="space-y-3">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Asset Name *" className="w-full px-4 py-2 rounded-lg border border-border" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border"><option value="">Category *</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
              <input type="text" value={form.serialNo} onChange={(e) => setForm({ ...form, serialNo: e.target.value })} placeholder="Serial Number" className="w-full px-4 py-2 rounded-lg border border-border" />
              <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} className="px-4 py-2 rounded-lg border border-border" />
                <input type="number" value={form.purchaseCost || ''} onChange={(e) => setForm({ ...form, purchaseCost: parseInt(e.target.value) || 0 })} placeholder="Purchase Cost (UGX)" className="px-4 py-2 rounded-lg border border-border" />
              </div>
              <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value as Asset['condition'] })} className="w-full px-4 py-2 rounded-lg border border-border"><option value="Good">Good</option><option value="Fair">Fair</option><option value="Poor">Poor</option><option value="Under Repair">Under Repair</option></select>
              <input type="text" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} placeholder="Assigned To (Person/Room)" className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-foreground/60">Last Maintenance</label><input type="date" value={form.lastMaintenance} onChange={(e) => setForm({ ...form, lastMaintenance: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border mt-1" /></div>
                <div><label className="text-xs text-foreground/60">Next Maintenance</label><input type="date" value={form.nextMaintenance} onChange={(e) => setForm({ ...form, nextMaintenance: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-border mt-1" /></div>
              </div>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes" rows={2} className="w-full px-4 py-2 rounded-lg border border-border" />
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
                <button onClick={handleAdd} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Add Asset</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMaintenanceModal && maintenanceAsset && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Log Maintenance - {maintenanceAsset.name}</h2>
            <textarea value={maintenanceNotes} onChange={(e) => setMaintenanceNotes(e.target.value)} placeholder="Describe maintenance performed..." rows={4} className="w-full px-4 py-2 rounded-lg border border-border" />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowMaintenanceModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-muted">Cancel</button>
              <button onClick={handleMaintenance} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">Log Maintenance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
