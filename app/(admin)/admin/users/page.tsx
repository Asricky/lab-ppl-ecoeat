"use client";

import React, { useState } from 'react';
import { Download, Search, ChevronDown, Filter, Eye, Ban, Shield, Truck, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [isExporting, setIsExporting] = useState(false);

  const [users, setUsers] = useState([
    { id: 1, name: 'Julian Casablancas', email: 'julian.c@eco-net.org', role: 'Seller', roleIcon: Shield, status: 'ACTIVE', statusColor: 'bg-emerald-100 text-emerald-700 dot-emerald', date: 'Oct 12, 2023', avatar: 'https://ui-avatars.com/api/?name=Julian+Casablancas&background=random' },
    { id: 2, name: 'Elena Rodriguez', email: 'e.rodriguez@greenway.com', role: 'Courier', roleIcon: Truck, status: 'SUSPENDED', statusColor: 'bg-gray-100 text-gray-600 dot-gray', date: 'Nov 04, 2023', avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random' },
    { id: 3, name: 'Thomas Haze', email: 't.haze@harvest.market', role: 'Buyer', roleIcon: ShoppingBag, status: 'ACTIVE', statusColor: 'bg-emerald-100 text-emerald-700 dot-emerald', date: 'Jan 15, 2024', avatar: 'https://ui-avatars.com/api/?name=Thomas+Haze&background=random' },
    { id: 4, name: 'Sarah Jenkins', email: 'sarah.j@freshly.com', role: 'Seller', roleIcon: Shield, status: 'ACTIVE', statusColor: 'bg-emerald-100 text-emerald-700 dot-emerald', date: 'Feb 02, 2024', avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random' },
    { id: 5, name: 'Michael Chang', email: 'm.chang@logistics.com', role: 'Courier', roleIcon: Truck, status: 'ACTIVE', statusColor: 'bg-emerald-100 text-emerald-700 dot-emerald', date: 'Feb 10, 2024', avatar: 'https://ui-avatars.com/api/?name=Michael+Chang&background=random' },
  ]);

  // Apply filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All Statuses' || 
                         (statusFilter === 'Active' && user.status === 'ACTIVE') || 
                         (statusFilter === 'Suspended' && user.status === 'SUSPENDED');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = (id: number) => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
        const newColor = newStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 dot-emerald' : 'bg-gray-100 text-gray-600 dot-gray';
        return { ...user, status: newStatus, statusColor: newColor };
      }
      return user;
    }));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8,ID,Name,Email,Role,Status,Date\n" 
        + filteredUsers.map(u => `${u.id},${u.name},${u.email},${u.role},${u.status},${u.date}`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "user_ledger.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Operations Hub</p>
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full">{filteredUsers.length} Nodes</span>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-2">Updated just now</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className={`flex items-center space-x-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm ${isExporting ? 'bg-gray-100 opacity-75 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}`}
          >
            {isExporting ? <Download size={18} className="animate-pulse" /> : <Download size={18} />}
            <span>{isExporting ? 'Exporting...' : 'Export Ledger'}</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-end space-x-4">
        <div className="flex-grow">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F3F8F2] border border-transparent rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A5632]"
            />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Role Type</label>
          <div className="relative">
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A5632] pr-10"
            >
              <option>All Roles</option>
              <option>Seller</option>
              <option>Buyer</option>
              <option>Courier</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="w-48">
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Lifecycle Status</label>
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A5632] pr-10"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div>
          <button className="bg-[#EAF3E1] text-[#1A5632] hover:bg-[#1A5632] hover:text-white p-2.5 rounded-xl transition-colors shadow-sm">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#FAFCF8] text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-5">Identity</th>
                <th className="px-6 py-5">Ecosystem Role</th>
                <th className="px-6 py-5">Lifecycle State</th>
                <th className="px-6 py-5">Nexus Date</th>
                <th className="px-6 py-5 text-right">Interactions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{user.name}</p>
                          <p className="text-[11px] font-medium text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 font-bold text-[#1A5632]">
                        <user.roleIcon size={16} className="text-[#1A5632]" />
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${user.statusColor}`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-600">{user.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <button className="p-2 text-gray-400 hover:text-[#1A5632] hover:bg-green-50 rounded-lg transition-colors">
                            <Eye size={20} />
                          </button>
                        </Link>
                        <button onClick={() => handleToggleStatus(user.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          {user.status === 'ACTIVE' ? <Ban size={20} /> : <span className="w-5 h-5 block border-2 border-emerald-500 rounded-full flex items-center justify-center"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span></span>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm">
          <p className="text-gray-500 font-medium">Showing <span className="font-bold text-gray-900">1 - {filteredUsers.length}</span> entities</p>
          <div className="flex space-x-1">
            <button className="px-3 py-1.5 bg-[#1A5632] text-white rounded-lg font-bold">1</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
