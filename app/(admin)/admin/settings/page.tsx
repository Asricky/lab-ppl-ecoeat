"use client";

import React, { useState } from 'react';
import { Settings, Shield, Bell, User, Key, Globe, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16">
      <div className="mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">System Administration</p>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 space-y-2">
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'account' ? 'bg-[#EAF3E1] text-[#1A5632]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <User size={18} />
              <span>Account Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'security' ? 'bg-[#EAF3E1] text-[#1A5632]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Shield size={18} />
              <span>Security & Access</span>
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'notifications' ? 'bg-[#EAF3E1] text-[#1A5632]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
            <button 
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl font-bold transition-colors ${activeTab === 'preferences' ? 'bg-[#EAF3E1] text-[#1A5632]' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Settings size={18} />
              <span>System Preferences</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
            
            {activeTab === 'account' && (
              <div className="space-y-8 animate-in fade-in">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Profile</h2>
                  <p className="text-gray-500 font-medium">Manage your personal admin information.</p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden shrink-0">
                    <img src="https://ui-avatars.com/api/?name=Admin+User&background=random" alt="Admin" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-colors mb-2">Change Avatar</button>
                    <p className="text-xs text-gray-400 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" defaultValue="Alex Rivera" className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1A5632]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" defaultValue="admin@organic.eco" className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1A5632]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Role</label>
                    <input type="text" disabled defaultValue="System Administrator" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-500 font-bold cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Department</label>
                    <input type="text" defaultValue="Operations Hub" className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1A5632]" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in">
                 <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Access</h2>
                  <p className="text-gray-500 font-medium">Manage your password and 2FA settings.</p>
                </div>
                
                <div className="space-y-4 border-b border-gray-100 pb-8">
                  <h3 className="font-bold text-gray-900 flex items-center space-x-2"><Key size={18} className="text-[#1A5632]" /> <span>Change Password</span></h3>
                  <input type="password" placeholder="Current Password" className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A5632]" />
                  <input type="password" placeholder="New Password" className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A5632]" />
                  <input type="password" placeholder="Confirm New Password" className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1A5632]" />
                </div>

                <div>
                   <div className="flex justify-between items-center mb-4">
                     <div>
                       <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
                       <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                     </div>
                     <div className="w-12 h-6 bg-[#1A5632] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in fade-in">
                 <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Preferences</h2>
                  <p className="text-gray-500 font-medium">Control what alerts you receive and how.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <div>
                       <h3 className="font-bold text-gray-900">Critical System Alerts</h3>
                       <p className="text-xs text-gray-500 mt-1">Receive immediate push notifications for critical failures.</p>
                     </div>
                     <div className="w-12 h-6 bg-[#1A5632] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                     </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <div>
                       <h3 className="font-bold text-gray-900">New Verifications</h3>
                       <p className="text-xs text-gray-500 mt-1">Daily email digest of new seller applications.</p>
                     </div>
                     <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                     </div>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                     <div>
                       <h3 className="font-bold text-gray-900">Transaction Anomalies</h3>
                       <p className="text-xs text-gray-500 mt-1">Alerts for unusually large refunds or disputes.</p>
                     </div>
                     <div className="w-12 h-6 bg-[#1A5632] rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-in fade-in">
                 <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">System Preferences</h2>
                  <p className="text-gray-500 font-medium">Customize your console experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Timezone</label>
                    <select className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1A5632]">
                      <option>(GMT+07:00) Jakarta</option>
                      <option>(GMT+08:00) Singapore</option>
                      <option>(GMT+00:00) UTC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Language</label>
                    <select className="w-full bg-[#FAFCF8] border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1A5632]">
                      <option>English (US)</option>
                      <option>Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-12 pt-6 border-t border-gray-100 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm ${isSaving ? 'opacity-75' : ''}`}
              >
                {isSaving ? <span className="animate-pulse">Saving...</span> : <><Save size={18} /><span>Save Changes</span></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
