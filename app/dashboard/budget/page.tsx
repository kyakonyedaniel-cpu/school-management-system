"use client";

import { useState } from "react";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { FileText, TrendingUp, TrendingDown, DollarSign, Plus, Search, Download, CheckCircle, XCircle, Clock, X } from "lucide-react";
import { useBudgetRequests, formatUGX } from '@/lib/data';

const budgetData = [
  { name: "Staff Salaries", amount: 45000000, color: "#3B82F6", percentage: 55 },
  { name: "Infrastructure", amount: 15000000, color: "#10B981", percentage: 18 },
  { name: "Learning Materials", amount: 8000000, color: "#F59E0B", percentage: 10 },
  { name: "Utilities", amount: 5500000, color: "#8B5CF6", percentage: 7 },
  { name: "Maintenance", amount: 4500000, color: "#EF4444", percentage: 5 },
  { name: "Other", amount: 3000000, color: "#6B7280", percentage: 5 },
];

const monthlyExpenses = [
  { month: "Jan", actual: 6200000, budget: 6500000 },
  { month: "Feb", actual: 5800000, budget: 6500000 },
  { month: "Mar", actual: 7100000, budget: 6500000 },
  { month: "Apr", actual: 6400000, budget: 6500000 },
  { month: "May", actual: 6900000, budget: 6500000 },
  { month: "Jun", actual: 7200000, budget: 6500000 },
];

export default function BudgetPage() {
  const { requests, addRequest, updateStatus } = useBudgetRequests();
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    department: '', description: '', amount: 0
  });

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = monthlyExpenses.reduce((sum, item) => sum + item.actual, 0);
  const pendingCount = requests.filter(r => r.status === 'pending').length;

  const filteredRequests = requests.filter(r =>
    r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      department: form.department,
      description: form.description,
      amount: form.amount,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    });
    setShowNewRequest(false);
    setForm({ department: '', description: '', amount: 0 });
  };

  const exportRequests = () => {
    const headers = ['Request ID', 'Department', 'Description', 'Amount', 'Status', 'Date'];
    const rows = filteredRequests.map(r => [
      r.id, r.department, r.description, r.amount.toString(), r.status, r.date
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Budget & Finance</h1>
          <p className="text-foreground/60">Manage school budget, expenses, and financial requests</p>
        </div>
        <button onClick={() => setShowNewRequest(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Budget</p>
              <p className="text-2xl font-bold">{formatUGX(totalBudget)}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" /> Academic Year 2026
          </p>
        </div>

        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Spent</p>
              <p className="text-2xl font-bold">{formatUGX(totalSpent * 1000)}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">January - June</p>
        </div>

        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Remaining</p>
              <p className="text-2xl font-bold text-green-600">{formatUGX(totalBudget - totalSpent * 1000)}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingDown className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">32% remaining</p>
        </div>

        <div className="bg-background rounded-lg p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Pending Requests</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2">Awaiting approval</p>
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Budget Overview</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-foreground/60 mb-4">Budget Allocation by Category</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="amount"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatUGX(value as number)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground/60 mb-4">Monthly Expenses vs Budget</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyExpenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatUGX(value as number)} />
                  <Legend />
                  <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                  <Bar dataKey="actual" fill="#10B981" name="Actual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Budget Requests</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input 
                  type="text" 
                  placeholder="Search requests..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg"
                />
              </div>
              <button onClick={exportRequests} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Request ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-muted/30">
                  <td className="px-6 py-4 text-sm font-medium text-primary">{request.id}</td>
                  <td className="px-6 py-4 text-sm">{request.department}</td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{request.description}</td>
                  <td className="px-6 py-4 text-sm">{formatUGX(request.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      request.status === "approved" ? "bg-green-100 text-green-700" :
                      request.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground/60">{request.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {request.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(request.id, 'approved')}
                            className="p-1.5 hover:bg-green-100 rounded" title="Approve">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </button>
                          <button onClick={() => updateStatus(request.id, 'rejected')}
                            className="p-1.5 hover:bg-red-100 rounded" title="Reject">
                            <XCircle className="w-4 h-4 text-red-600" />
                          </button>
                        </>
                      )}
                      {request.status === "approved" && (
                        <span className="text-green-600 text-xs font-medium">Approved</span>
                      )}
                      {request.status === "rejected" && (
                        <span className="text-red-600 text-xs font-medium">Rejected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showNewRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Budget Request</h2>
              <button onClick={() => setShowNewRequest(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input type="text" required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                  placeholder="e.g. Science Lab"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input type="text" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Laboratory Equipment"
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount (UGX)</label>
                <input type="number" required min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-border" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowNewRequest(false)} className="flex-1 px-4 py-2 border border-border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-lg">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}