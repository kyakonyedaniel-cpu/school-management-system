"use client";

import { useState } from "react";
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { FileText, TrendingUp, TrendingDown, DollarSign, Plus, Search, Filter, Download, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

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

const pendingRequests = [
  { id: "BR-001", department: "Science Lab", description: "Laboratory Equipment", amount: 4500000, status: "pending", date: "2024-02-15" },
  { id: "BR-002", department: "Library", description: "Textbooks Restocking", amount: 2800000, status: "approved", date: "2024-02-14" },
  { id: "BR-003", department: "Sports", description: "Sports Equipment", amount: 1500000, status: "pending", date: "2024-02-13" },
  { id: "BR-004", department: "Administration", description: "Office Furniture", amount: 3800000, status: "rejected", date: "2024-02-12" },
  { id: "BR-005", department: "ICT", description: "Computer Repairs", amount: 950000, status: "approved", date: "2024-02-11" },
];

const formatUGX = (amount: number) => {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(amount);
};

export default function BudgetPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewRequest, setShowNewRequest] = useState(false);

  const totalBudget = budgetData.reduce((sum, item) => sum + item.amount, 0);
  const totalSpent = monthlyExpenses.reduce((sum, item) => sum + item.actual, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Budget & Finance</h1>
            <p className="text-gray-600">Manage school budget, expenses, and financial requests</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-900">{formatUGX(81600000)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> Academic Year 2024
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">{formatUGX(totalSpent * 1000)}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">January - June</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-2xl font-bold text-green-600">{formatUGX(81600000 - totalSpent * 1000)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <TrendingDown className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">32% remaining</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-yellow-600 mt-2">Awaiting approval</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Budget Overview</h2>
                <button 
                  onClick={() => setShowNewRequest(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" /> New Request
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Budget Allocation by Category</h3>
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
                  <h3 className="text-sm font-medium text-gray-600 mb-4">Monthly Expenses vs Budget</h3>
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

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Budget Requests</h2>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search requests..." 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" /> Export
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {pendingRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{request.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{request.department}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.description}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatUGX(request.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          request.status === "approved" ? "bg-green-100 text-green-700" :
                          request.status === "rejected" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.date}</td>
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