"use client";

import { useState } from "react";
import { Package, Search, Filter, Plus, Download, AlertTriangle, CheckCircle, Edit, Trash2, X } from "lucide-react";
import { useInventory, formatUGX } from '@/lib/data';

const categories = ['Furniture', 'Equipment', 'Supplies', 'Books', 'Sports', 'ICT', 'Science'];

export default function InventoryPage() {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<{
    name: string; category: string; quantity: number; minStock: number; condition: 'good' | 'fair' | 'poor'; location: string; lastUpdated: string
  }>({
    name: '', category: 'Equipment', quantity: 0, minStock: 10, condition: 'good', location: '', lastUpdated: new Date().toISOString().split('T')[0]
  });

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockItems = items.filter(item => item.quantity < item.minStock);
  const goodCondition = items.filter(item => item.condition === 'good').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateItem(editingId, form);
      setEditingId(null);
    } else {
      addItem(form);
    }
    setShowNew(false);
    setForm({ name: '', category: 'Equipment', quantity: 0, minStock: 10, condition: 'good', location: '', lastUpdated: new Date().toISOString().split('T')[0] });
  };

  const handleEdit = (item: typeof items[0]) => {
    setForm({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      minStock: item.minStock,
      condition: item.condition,
      location: item.location,
      lastUpdated: item.lastUpdated
    });
    setEditingId(item.id);
    setShowNew(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-foreground/60">Track and manage school assets, equipment, and supplies</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowNew(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Items</p>
              <p className="text-2xl font-bold">{items.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Across {categories.length} categories</p>
        </div>

        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-red-600 mt-2">Items below minimum</p>
        </div>

        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Categories</p>
              <p className="text-2xl font-bold">{categories.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Item types tracked</p>
        </div>

        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Good Condition</p>
              <p className="text-2xl font-bold text-green-600">{items.length > 0 ? Math.round((goodCondition / items.length) * 100) : 0}%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Overall condition</p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="font-medium text-red-700">Low Stock Alert</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="text-sm text-red-600">
                {item.name}: {item.quantity}/{item.minStock} min
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-background rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold">Inventory Items</h2>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input 
                  type="text" 
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg"
                />
              </div>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Item ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Min Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Condition</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{item.id}</td>
                  <td className="px-6 py-4 text-sm">{item.name}</td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{item.category}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={item.quantity < item.minStock ? "text-red-600 font-medium" : ""}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{item.minStock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.condition === "good" ? "bg-green-100 text-green-700" :
                      item.condition === "fair" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{item.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-muted rounded">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 hover:bg-muted rounded">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNew && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Edit Item' : 'Add New Item'}</h2>
              <button onClick={() => { setShowNew(false); setEditingId(null); }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item Name</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input type="text" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <input type="number" required min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Stock</label>
                  <input type="number" required min="0" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value as 'good' | 'fair' | 'poor' })}
                    className="w-full px-4 py-2 rounded-lg border border-border">
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowNew(false); setEditingId(null); }} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">{editingId ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}