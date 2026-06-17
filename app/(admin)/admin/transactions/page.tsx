"use client";

import React, { useState } from 'react';
import { Download, Filter, ChevronDown, MoreVertical, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export default function AdminTransactionsPage() {
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [isExporting, setIsExporting] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const transactions = [
    { id: '#TXN-94021', user: 'Julian Casablancas', type: 'Purchase', date: 'Mar 15, 2024', amount: '+Rp 420.000', status: 'Completed', icon: ArrowUpRight, iconColor: 'text-emerald-500', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#TXN-94020', user: 'Elena Rodriguez', type: 'Payout', date: 'Mar 15, 2024', amount: '-Rp 125.500', status: 'Pending', icon: ArrowDownRight, iconColor: 'text-amber-500', statusColor: 'bg-amber-100 text-amber-700' },
    { id: '#TXN-93882', user: 'Thomas Haze', type: 'Purchase', date: 'Mar 08, 2024', amount: '+Rp 125.500', status: 'Completed', icon: ArrowUpRight, iconColor: 'text-emerald-500', statusColor: 'bg-emerald-100 text-emerald-700' },
    { id: '#TXN-92104', user: 'Sarah Jenkins', type: 'Refund', date: 'Feb 28, 2024', amount: '-Rp 890.000', status: 'Refunded', icon: RefreshCw, iconColor: 'text-gray-500', statusColor: 'bg-gray-200 text-gray-600' },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      // Create CSV content from filtered transactions
      const headers = "ID,User,Type,Date,Amount,Status\n";
      const rows = filteredTx.map(e => `${e.id},${e.user},${e.type},${e.date},"${e.amount}",${e.status}`).join("\n");
      const csvContent = headers + rows;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions_ledger.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 1500); // Simulate network delay
  };

  const filteredTx = transactions.filter(t => {
    if (filterType !== 'All Types' && t.type !== filterType) return false;
    if (filterStatus !== 'All Status' && t.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Financial Oversight</p>
          <div className="flex items-center space-x-4 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Transactions</h1>
            <span className="bg-[#EAF3E1] text-[#1A5632] text-xs font-bold px-3 py-1 rounded-full border border-[#D1E8D7]">v.4.2 Ledger</span>
          </div>
          <p className="text-gray-500 font-medium">Real-time oversight of every purchase and surplus donation within the ecological network.</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`flex items-center space-x-2 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm ${isExporting ? 'bg-[#0F351F] opacity-75 cursor-not-allowed' : 'bg-[#1A5632] hover:bg-[#0F351F]'}`}
        >
          {isExporting ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />}
          <span>{isExporting ? 'Exporting...' : 'Export Excel'}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-end space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-grow w-full md:w-auto">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Transaction Type</label>
          <div className="relative">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full appearance-none bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A5632] pr-10"
            >
              <option>All Types</option>
              <option>Purchase</option>
              <option>Payout</option>
              <option>Refund</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
        
        <div className="flex-grow w-full md:w-auto">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Lifecycle Status</label>
          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full appearance-none bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A5632] pr-10"
            >
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAFCF8] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-5">Txn Hash</th>
                <th className="px-6 py-5">Entity</th>
                <th className="px-6 py-5">Timestamp</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5">State</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredTx.length > 0 ? filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 font-mono text-xs bg-gray-100 px-2 py-1 rounded">{tx.id}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1A5632]">{tx.user}</td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{tx.date}</p>
                    <p className="text-[11px] text-gray-400">{tx.type}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 font-black text-lg text-gray-900 tracking-tight">
                      <tx.icon size={16} className={tx.iconColor} strokeWidth={3} />
                      <span>{tx.amount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${tx.statusColor}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setOpenMenuId(openMenuId === tx.id as any ? null : tx.id as any)}
                      className="p-2 text-gray-400 hover:text-[#1A5632] hover:bg-green-50 rounded-lg transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === tx.id as any && (
                      <div className="absolute right-8 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden text-left">
                        <button className="w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1A5632] text-left">View Receipt</button>
                        <button className="w-full px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[#1A5632] text-left">Send Notification</button>
                        {tx.status === 'Completed' && (
                          <button className="w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 text-left border-t border-gray-50">Issue Refund</button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No transactions found matching the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <p className="text-gray-500 font-medium">Showing 1 to {filteredTx.length} of 458 transactions</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg font-medium hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1.5 bg-[#1A5632] text-white rounded-lg font-bold">1</button>
            <button className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg font-medium hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1.5 border border-gray-200 text-gray-500 rounded-lg font-medium hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
