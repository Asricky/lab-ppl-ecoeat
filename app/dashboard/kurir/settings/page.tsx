"use client";

import React, { useState } from 'react';
import CourierLayout, { useCourier } from '@/app/components/CourierLayout';
import { User, Truck, MapPin, Settings as SettingsIcon, Globe, Map, Moon, Power, Camera, Edit2 } from 'lucide-react';

export default function Settings() {
  const { isOnline, setIsOnline } = useCourier();
  const [radius, setRadius] = useState(5); // Service radius in km
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Johnson',
    phone: '+62 812 3456 7890',
    emergency: 'Sarah Johnson (Wife) - +62 811 1111 2222'
  });

  return (
    <CourierLayout>
      <div className="max-w-4xl mx-auto py-2">
        <div className="mb-8">
          <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">PREFERENCES</p>
          <h1 className="text-3xl font-extrabold text-ecoeat-text">Courier Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <User className="text-ecoeat-primary" size={24} />
                  <h2 className="text-xl font-bold text-ecoeat-text">Profile Management</h2>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${
                    isEditingProfile ? 'bg-ecoeat-primary text-white' : 'text-ecoeat-primary bg-ecoeat-primary/10 hover:bg-ecoeat-primary/20'
                  }`}
                >
                  {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6">
                <div className="relative">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
                    alt="Courier" 
                    className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-sm"
                  />
                  <button className="absolute bottom-0 right-0 bg-ecoeat-primary text-white p-2 rounded-full shadow-md hover:bg-ecoeat-accent transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-ecoeat-muted uppercase mb-1">Full Name</label>
                    <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                      {isEditingProfile ? (
                        <input 
                          type="text" 
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="flex-1 text-sm font-semibold text-ecoeat-text bg-transparent outline-none"
                        />
                      ) : (
                        <span className="flex-1 text-sm font-semibold text-ecoeat-text">{profile.name}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-ecoeat-muted uppercase mb-1">Phone Number</label>
                      <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                        {isEditingProfile ? (
                          <input 
                            type="text" 
                            value={profile.phone}
                            onChange={(e) => setProfile({...profile, phone: e.target.value})}
                            className="flex-1 text-sm font-semibold text-ecoeat-text bg-transparent outline-none"
                          />
                        ) : (
                          <span className="flex-1 text-sm font-semibold text-ecoeat-text">{profile.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-ecoeat-muted uppercase mb-1">Emergency Contact</label>
                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-100">
                  {isEditingProfile ? (
                    <input 
                      type="text" 
                      value={profile.emergency}
                      onChange={(e) => setProfile({...profile, emergency: e.target.value})}
                      className="flex-1 text-sm font-semibold text-ecoeat-text bg-transparent outline-none"
                    />
                  ) : (
                    <span className="flex-1 text-sm font-semibold text-ecoeat-text">{profile.emergency}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <Truck className="text-ecoeat-primary" size={24} />
                <h2 className="text-xl font-bold text-ecoeat-text">Vehicle Information</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-ecoeat-muted uppercase mb-1">Vehicle Type</label>
                  <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 opacity-80 cursor-not-allowed">
                    <span className="flex-1 text-sm font-bold text-ecoeat-text">Motorcycle</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-ecoeat-muted uppercase mb-1">License Plate</label>
                  <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 opacity-80 cursor-not-allowed">
                    <span className="flex-1 text-sm font-bold text-ecoeat-text">B 1234 XYZ</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>

          <div className="space-y-6">
            
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <MapPin className="text-ecoeat-primary" size={24} />
                <h2 className="text-xl font-bold text-ecoeat-text">Work Preferences</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-ecoeat-muted uppercase">Service Radius</label>
                    <span className="text-sm font-bold text-ecoeat-primary bg-ecoeat-primary/10 px-2 py-0.5 rounded-md">{radius} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="15" 
                    value={radius} 
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-ecoeat-primary h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                    <span>1 km</span>
                    <span>15 km</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-xs font-bold text-ecoeat-muted uppercase mb-3">Availability Status</label>
                  <button 
                    onClick={() => setIsOnline(!isOnline)}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all shadow-sm ${
                      isOnline 
                        ? 'bg-[#e5ddd5] text-[#b03021] hover:bg-[#d6ccc2]' 
                        : 'bg-ecoeat-primary text-white hover:bg-ecoeat-accent'
                    }`}
                  >
                    <Power size={18} /> 
                    <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
                  </button>
                  <p className="text-[10px] font-medium text-ecoeat-muted mt-2 text-center">
                    {isOnline ? 'You are currently receiving automated tasks.' : 'You will not receive any new tasks.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CourierLayout>
  );
}
