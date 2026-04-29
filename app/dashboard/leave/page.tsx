"use client";

import { useState } from "react";
import { CalendarDays, Search, Plus, Download, CheckCircle, XCircle, Clock, User, X } from "lucide-react";
import { useLeaveRequests, useStaff } from "@/lib/data";
import { useMemo } from "react";

const leaveTypes = [
  { id: "annual", name: "Annual Leave", color: "bg-blue-100 text-blue-700", days: 21 },
  { id: "sick", name: "Sick Leave", color: "bg-red-100 text-red-700", days: 14 },
  { id: "maternity", name: "Maternity Leave", color: "bg-pink-100 text-pink-700", days: 60 },
  { id: "paternity", name: "Paternity Leave", color: "bg-purple-100 text-purple-700", days: 7 },
  { id: "personal", name: "Personal Leave", color: "bg-yellow-100 text-yellow-700", days: 5 },
  { id: "study", name: "Study Leave", color: "bg-green-100 text-green-700", days: 30 },
];

export default function LeavePage() {
  const { requests, addRequest, updateRequestStatus } = useLeaveRequests();
  const { staff } = useStaff();
  const [activeTab, setActiveTab] = useState("requests");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [balanceSearch, setBalanceSearch] = useState("");
  const [requestForm, setRequestForm] = useState({
    staffId: '',
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const leaveBalances = useMemo(() => {
    return staff.map(member => {
      const memberRequests = requests.filter(
        r => r.staffId === member.id && r.status === 'approved'
      );
      const usedByType: Record<string, number> = {};
      memberRequests.forEach(r => {
        const normalizedType = leaveTypes.find(
          lt => lt.name === r.type
        )?.id || r.type.toLowerCase();
        usedByType[normalizedType] = (usedByType[normalizedType] || 0) + r.days;
      });
      const balances = leaveTypes.map(lt => ({
        ...lt,
        used: usedByType[lt.id] || 0,
      }));
      const totalEntitled = leaveTypes.reduce((sum, lt) => sum + lt.days, 0);
      const totalUsed = leaveTypes.reduce((sum, lt) => sum + (usedByType[lt.id] || 0), 0);
      return {
        staff: member,
        balances,
        totalEntitled,
        totalUsed,
        totalRemaining: totalEntitled - totalUsed,
      };
    });
  }, [staff, requests]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === "pending").length;
  const approvedCount = requests.filter(r => r.status === "approved").length;

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const member = staff.find(s => s.id === requestForm.staffId);
    if (member) {
      const start = new Date(requestForm.startDate);
      const end = new Date(requestForm.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      addRequest({
        staffId: member.id,
        staffName: member.name,
        department: member.department,
        type: requestForm.type,
        startDate: requestForm.startDate,
        endDate: requestForm.endDate,
        days,
        reason: requestForm.reason,
        status: 'pending'
      });
      setShowNewRequest(false);
      setRequestForm({ staffId: '', type: 'Annual Leave', startDate: '', endDate: '', reason: '' });
    }
  };

  const exportRequests = () => {
    const headers = ['Request ID', 'Staff Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason'];
    const rows = filteredRequests.map(r => [r.id, r.staffName, r.department, r.type, r.startDate, r.endDate, r.days.toString(), r.status, r.reason]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportBalances = () => {
    const filteredBalances = leaveBalances.filter(b =>
      b.staff.name.toLowerCase().includes(balanceSearch.toLowerCase()) ||
      b.staff.department.toLowerCase().includes(balanceSearch.toLowerCase())
    );
    const headers = ['Staff Name', 'Department', 'Leave Type', 'Entitled', 'Used', 'Remaining'];
    const rows: string[][] = [];
    filteredBalances.forEach(({ staff: s, balances, totalEntitled, totalUsed, totalRemaining }) => {
      rows.push([s.name, s.department, 'TOTAL', totalEntitled.toString(), totalUsed.toString(), totalRemaining.toString()]);
      balances.forEach(b => {
        rows.push([s.name, s.department, b.name, b.days.toString(), b.used.toString(), (b.days - b.used).toString()]);
      });
    });
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave-balances-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-foreground/60">Manage staff leave requests and balances</p>
        </div>
        <button onClick={() => setShowNewRequest(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          <Plus size={18} />New Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Total Staff</p>
              <p className="text-2xl font-bold">{staff.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Active employees</p>
        </div>

        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-sm text-yellow-600 mt-2">Awaiting approval</p>
        </div>

        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">On Leave Today</p>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CalendarDays className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-green-600 mt-2">Staff currently away</p>
        </div>

        <div className="bg-background p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground/60">Approved This Month</p>
              <p className="text-2xl font-bold text-blue-600">{approvedCount}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-foreground/60 mt-2">Requests approved</p>
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Leave Types & Entitlements</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {leaveTypes.map((type) => (
              <div key={type.id} className="bg-muted/30 rounded-lg p-4">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${type.color}`}>
                  {type.name}
                </span>
                <p className="text-2xl font-bold mt-2">{type.days}</p>
                <p className="text-sm text-foreground/60">days/year</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-background rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab("requests")}
                className={`px-4 py-2 rounded-lg ${activeTab === "requests" ? "bg-primary text-white" : "text-foreground/60 hover:bg-muted"}`}
              >
                Leave Requests
              </button>
              <button
                onClick={() => setActiveTab("balance")}
                className={`px-4 py-2 rounded-lg ${activeTab === "balance" ? "bg-primary text-white" : "text-foreground/60 hover:bg-muted"}`}
              >
                Leave Balance
              </button>
            </div>
            {activeTab === "requests" && (
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
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button onClick={exportRequests} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            )}
          </div>
        </div>

        {activeTab === "requests" && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Request ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Staff Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Leave Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Start Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">End Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Days</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 text-sm font-medium text-primary">{request.id}</td>
                    <td className="px-6 py-4 text-sm">{request.staffName}</td>
                    <td className="px-6 py-4 text-sm text-foreground/60">{request.department}</td>
                    <td className="px-6 py-4 text-sm">{request.type}</td>
                    <td className="px-6 py-4 text-sm">{request.startDate}</td>
                    <td className="px-6 py-4 text-sm">{request.endDate}</td>
                    <td className="px-6 py-4 text-sm font-medium">{request.days}</td>
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
                            <button onClick={() => updateRequestStatus(request.id, 'approved')}
                              className="p-1.5 hover:bg-green-100 rounded" title="Approve">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </button>
                            <button onClick={() => updateRequestStatus(request.id, 'rejected')}
                              className="p-1.5 hover:bg-red-100 rounded" title="Reject">
                              <XCircle className="w-4 h-4 text-red-600" />
                            </button>
                          </>
                        )}
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
            <div className="flex items-center justify-between p-4 border-b">
              <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  placeholder="Search staff member..."
                  value={balanceSearch}
                  onChange={(e) => setBalanceSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-border rounded-lg w-full"
                />
              </div>
              <button onClick={exportBalances} className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                <Download className="w-4 h-4" /> Export Balances
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Staff Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Department</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Total Entitled</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Total Used</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Total Remaining</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaveBalances
                  .filter(b =>
                    b.staff.name.toLowerCase().includes(balanceSearch.toLowerCase()) ||
                    b.staff.department.toLowerCase().includes(balanceSearch.toLowerCase())
                  )
                  .map(({ staff, balances, totalEntitled, totalUsed, totalRemaining }) => (
                    <tr key={staff.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {staff.photo ? (
                            <img src={staff.photo} alt={staff.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-semibold text-primary">{staff.name.charAt(0)}</span>
                            </div>
                          )}
                          <span className="text-sm font-medium">{staff.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/60">{staff.department}</td>
                      <td className="px-6 py-4 text-sm font-semibold">{totalEntitled} days</td>
                      <td className="px-6 py-4 text-sm text-orange-600 font-medium">{totalUsed} days</td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-semibold ${totalRemaining < 10 ? 'text-red-600' : 'text-green-600'}`}>
                          {totalRemaining} days
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-primary hover:text-primary/80 list-none">
                            <span className="group-open:hidden">Show breakdown</span>
                            <span className="hidden group-open:inline">Hide breakdown</span>
                          </summary>
                          <div className="mt-2 space-y-2">
                            {balances.map(b => (
                              <div key={b.id} className="bg-muted/20 rounded p-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="font-medium">{b.name}</span>
                                  <span className="text-foreground/60">{b.used}/{b.days} days</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-1.5">
                                  <div
                                    className={`h-1.5 rounded-full ${
                                      b.used / b.days > 0.8 ? 'bg-red-500' :
                                      b.used / b.days > 0.5 ? 'bg-yellow-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min((b.used / b.days) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </details>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {leaveBalances.filter(b =>
              b.staff.name.toLowerCase().includes(balanceSearch.toLowerCase()) ||
              b.staff.department.toLowerCase().includes(balanceSearch.toLowerCase())
            ).length === 0 && (
              <div className="p-8 text-center text-foreground/60">
                No staff members found matching "{balanceSearch}"
              </div>
            )}
          </div>
        )}
      </div>

      {showNewRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl border border-border w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Leave Request</h2>
              <button onClick={() => setShowNewRequest(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Staff Member</label>
                <select required value={requestForm.staffId} onChange={(e) => setRequestForm({ ...requestForm, staffId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  <option value="">Select staff member</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Leave Type</label>
                <select required value={requestForm.type} onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border">
                  {leaveTypes.map(t => (
                    <option key={t.id} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" required value={requestForm.startDate} onChange={(e) => setRequestForm({ ...requestForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" required value={requestForm.endDate} onChange={(e) => setRequestForm({ ...requestForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea required value={requestForm.reason} onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  rows={3} className="w-full px-4 py-2 rounded-lg border border-border" />
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