"use client";

import { useState } from "react";
import { CalendarDays, Search, Filter, Plus, Download, CheckCircle, XCircle, Clock, AlertTriangle, User, FileText, Plane, Thermometer, Heart } from "lucide-react";

const leaveTypes = [
  { id: "annual", name: "Annual Leave", color: "bg-blue-100 text-blue-700", days: 21 },
  { id: "sick", name: "Sick Leave", color: "bg-red-100 text-red-700", days: 14 },
  { id: "maternity", name: "Maternity Leave", color: "bg-pink-100 text-pink-700", days: 60 },
  { id: "paternity", name: "Paternity Leave", color: "bg-purple-100 text-purple-700", days: 7 },
  { id: "personal", name: "Personal Leave", color: "bg-yellow-100 text-yellow-700", days: 5 },
  { id: "study", name: "Study Leave", color: "bg-green-100 text-green-700", days: 30 },
];

const leaveRequests = [
  { id: "LR-001", staffName: "Mr. Ochieng David", department: "Science", type: "Annual Leave", startDate: "2024-02-19", endDate: "2024-02-25", days: 5, status: "pending", reason: "Family vacation", appliedDate: "2024-02-10" },
  { id: "LR-002", staffName: "Ms. Akello Faith", department: "Mathematics", type: "Sick Leave", startDate: "2024-02-14", endDate: "2024-02-16", days: 3, status: "approved", reason: "Medical appointment", appliedDate: "2024-02-13" },
  { id: "LR-003", staffName: "Mr. Kato Joseph", department: "English", type: "Study Leave", startDate: "2024-03-01", endDate: "2024-03-15", days: 15, status: "pending", reason: "Workshop attendance", appliedDate: "2024-02-12" },
  { id: "LR-004", staffName: "Mrs. Namatovu Sarah", department: "Social Studies", type: "Maternity Leave", startDate: "2024-02-20", endDate: "2024-04-20", days: 60, status: "approved", reason: "Maternity", appliedDate: "2024-02-01" },
  { id: "LR-005", staffName: "Mr. Wasswa John", department: "ICT", type: "Personal Leave", startDate: "2024-02-18", endDate: "2024-02-18", days: 1, status: "rejected", reason: "Personal matter", appliedDate: "2024-02-15" },
  { id: "LR-006", staffName: "Ms. Amongi Grace", department: "Religious Education", type: "Paternity Leave", startDate: "2024-02-22", endDate: "2024-02-28", days: 7, status: "pending", reason: "New baby", appliedDate: "2024-02-14" },
];

const staffLeaveBalance = [
  { name: "Mr. Ochieng David", annual: 18, sick: 14, personal: 5, used: { annual: 3, sick: 0, personal: 1 } },
  { name: "Ms. Akello Faith", annual: 21, sick: 14, personal: 5, used: { annual: 5, sick: 3, personal: 0 } },
  { name: "Mr. Kato Joseph", annual: 21, sick: 14, personal: 5, used: { annual: 7, sick: 1, personal: 2 } },
  { name: "Mrs. Namatovu Sarah", annual: 21, sick: 14, personal: 5, used: { annual: 0, sick: 0, personal: 0 } },
  { name: "Mr. Wasswa John", annual: 21, sick: 14, personal: 5, used: { annual: 10, sick: 2, personal: 3 } },
];

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-UG", { day: "numeric", month: "short", year: "numeric" });
};

export default function LeavePage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredRequests = leaveRequests.filter(request => {
    const matchesSearch = request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = leaveRequests.filter(r => r.status === "pending").length;
  const approvedCount = leaveRequests.filter(r => r.status === "approved").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-gray-600">Manage staff leave requests and balances</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900">45</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Active employees</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="text-sm text-yellow-600 mt-2">Awaiting approval</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">On Leave Today</p>
                  <p className="text-2xl font-bold text-green-600">3</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CalendarDays className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-green-600 mt-2">Staff currently away</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved This Month</p>
                  <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Requests approved</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Leave Types & Entitlements</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {leaveTypes.map((type) => (
                  <div key={type.id} className="bg-gray-50 rounded-lg p-4">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${type.color}`}>
                      {type.name}
                    </span>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{type.days}</p>
                    <p className="text-sm text-gray-500">days/year</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("requests")}
                    className={`px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Leave Requests
                  </button>
                  <button
                    onClick={() => setActiveTab("balance")}
                    className={`px-4 py-2 rounded-lg ${activeTab === "balance" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    Leave Balance
                  </button>
                </div>
                {activeTab === "requests" && (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                      <Plus className="w-4 h-4" /> New Request
                    </button>
                  </div>
                )}
              </div>
            </div>

            {activeTab === "requests" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredRequests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-blue-600">{request.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{request.staffName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.department}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{request.type}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(request.startDate)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(request.endDate)}</td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{request.days}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            request.status === "approved" ? "bg-green-100 text-green-700" :
                            request.status === "rejected" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {request.status === "pending" && (
                              <>
                                <button className="p-1 hover:bg-green-100 rounded">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </button>
                                <button className="p-1 hover:bg-red-100 rounded">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                </button>
                              </>
                            )}
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <FileText className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "balance" && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Staff Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Days</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remaining</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {staffLeaveBalance.map((staff, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium" rowSpan={3}>
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">Annual Leave</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.annual}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{staff.used.annual}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-medium">{staff.annual - staff.used.annual}</td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(staff.used.annual / staff.annual) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {staffLeaveBalance.slice(1).map((staff, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-600">Sick Leave</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{staff.sick}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{staff.used.sick}</td>
                        <td className="px-6 py-4 text-sm text-green-600 font-medium">{staff.sick - staff.used.sick}</td>
                        <td className="px-6 py-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-600 h-2 rounded-full" 
                              style={{ width: `${(staff.used.sick / staff.sick) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}