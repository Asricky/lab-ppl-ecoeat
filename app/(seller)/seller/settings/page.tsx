"use client";

import React, { useState } from 'react';
import { User, Shield, Bell, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500">Manage your store profile, business verification, and security.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-3 px-6 py-4 text-left font-bold transition-colors border-l-4 ${activeTab === 'profile' ? 'border-[#1A5632] bg-[#E8F3EB] text-[#1A5632]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
            >
              <User size={20} />
              <span>Store Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-3 px-6 py-4 text-left font-bold transition-colors border-l-4 ${activeTab === 'security' ? 'border-[#1A5632] bg-[#E8F3EB] text-[#1A5632]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
            >
              <Bell size={20} />
              <span>Security & Alerts</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Store Profile</h2>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Store Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-gray-50 mb-2">
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-500 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Store Name</label>
                  <input type="text" defaultValue="Green Valley Farms" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Store Description</label>
                  <textarea rows={4} defaultValue="Local organic farm dedicated to sustainable agriculture. We provide fresh produce directly to the community." className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors"></textarea>
                </div>
                <div className="pt-4">
                  <button className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-3 rounded-xl font-bold shadow-sm transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Security & Alerts</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-md font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                      <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors" />
                    </div>
                    <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors mt-2">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-md font-bold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">New Order Alerts</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Receive an email when a new order is placed.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" defaultChecked name="toggle" id="toggle1" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A5632] right-0" style={{ right: 0 }} />
                        <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A5632] cursor-pointer"></label>
                      </div>
                    </label>
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Stock Depletion</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Notify me when inventory falls below 10%.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" defaultChecked name="toggle" id="toggle2" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A5632] right-0" style={{ right: 0 }} />
                        <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-6 rounded-full bg-[#1A5632] cursor-pointer"></label>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
