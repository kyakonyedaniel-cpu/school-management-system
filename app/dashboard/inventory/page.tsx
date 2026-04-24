"use client";

import { useState } from "react";
import { Package, Search, Filter, Plus, Download, AlertTriangle, CheckCircle, XCircle, Edit, Trash2, Eye, BarChart3, Tag, Calendar, MapPin } from "lucide-react";

const inventoryItems = [
  { id: "INV-001", name: "Desks (Primary)", category: "Furniture", quantity: 45, minStock: 20, condition: "good", location: "Block A", lastUpdated: "2024-02-10" },
  { id: "INV-002", name: "Chairs (Standard)", category: "Furniture", quantity: 8, minStock: 30, condition: "good", location: "Block A", lastUpdated: "2024-02-12" },
  { id: "INV-003", name: "Mathematics Set", category: "Equipment", quantity: 120, minStock: 50, condition: "good", location: "Store Room", lastUpdated: "2024-02-08" },
  { id: "INV-004", name: "Whiteboard Markers", category: "Supplies", quantity: 25, minStock: 100, condition: "good", location: "Store Room", lastUpdated: "2024-02-14" },
  { id: "INV-005", name: "Science Lab Microscopes", category: "Equipment", quantity: 15, minStock: 10, condition: "fair", location: "Lab 1", lastUpdated: "2024-02-05" },
  { id: "INV-006", name: "Textbooks P.5 Maths", category: "Books", quantity: 180, minStock: 100, condition: "good", location: "Library", lastUpdated: "2024-02-01" },
  { id: "INV-007", name: "Sports Balls (Football)", category: "Sports", quantity: 12, minStock: 15, condition: "good", location: "Sports Store", lastUpdated: "2024-02-11" },
  { id: "INV-008", name: "Computer Keyboards", category: "ICT", quantity: 5, minStock: 20, condition: "good", location: "ICT Lab", lastUpdated: "2024-02-13" },
  { id: "INV-009", name: "Laboratory Chemicals", category: "Science", quantity: 30, minStock: 20, condition: "good", location: "Chem Store", lastUpdated: "2024-02-09" },
  { id: "INV-010", name: "Office Paper (Reams)", category: "Supplies", quantity: 150, minStock: 50, condition: "good", location: "Admin Office", lastUpdated: "2024-02-14" },
];

const lowStockItems = inventoryItems.filter(item => item.quantity < item.minStock);
const categories = [...new Set(inventoryItems.map(item => item.category))];

const formatUGX = (amount: number) => {
  return `UGX ${amount.toLocaleString('en-US')}`;
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600">Track and manage school assets, equipment, and supplies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-background rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventoryItems.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Across {categories.length} categories</p>
            </div>

            <div className="bg-background rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <p className="text-sm text-red-600 mt-2">Items below minimum</p>
            </div>

            <div className="bg-background rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Tag className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Item types tracked</p>
            </div>

            <div className="bg-background rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Good Condition</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Overall condition</p>
            </div>
          </div>

          {lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
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

          <div className="bg-background rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h2 className="text-lg font-semibold text-gray-900">Inventory Items</h2>
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{item.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.category}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={item.quantity < item.minStock ? "text-red-600 font-medium" : "text-gray-900"}>
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.minStock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.condition === "good" ? "bg-green-100 text-green-700" :
                          item.condition === "fair" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.location}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
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
        </div>
      </div>
    </div>
  );
}
