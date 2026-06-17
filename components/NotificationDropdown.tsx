import React from 'react';
import { Package, XCircle, BellRing, CheckCircle2 } from 'lucide-react';
import { dummyNotifications, NotificationData } from '@/lib/data';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  if (!isOpen) return null;

  const renderIcon = (type: string) => {
    switch(type) {
      case 'new_order':
        return <div className="w-8 h-8 rounded-full bg-[#eaf4eb] text-[#1e8932] flex items-center justify-center shrink-0"><Package size={16} /></div>;
      case 'cancelled':
        return <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0"><XCircle size={16} /></div>;
      case 'system':
        return <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><CheckCircle2 size={16} /></div>;
      default:
        return <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0"><BellRing size={16} /></div>;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-black/5 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-ecoeat-text">Notifications</h3>
          <button className="text-xs font-bold text-ecoeat-primary hover:underline">Mark all as read</button>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {dummyNotifications.map((notif) => (
            <div 
              key={notif.id} 
              className={`p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                !notif.isRead ? 'bg-ecoeat-primary/5' : ''
              }`}
            >
              {renderIcon(notif.type)}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm font-bold truncate pr-2 ${!notif.isRead ? 'text-ecoeat-text' : 'text-gray-600'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] font-bold text-gray-400 shrink-0 mt-0.5">{notif.time}</span>
                </div>
                <p className="text-xs font-medium text-ecoeat-muted line-clamp-2">{notif.message}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2 h-2 bg-ecoeat-primary rounded-full mt-1.5 shrink-0"></div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3 text-center border-t border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer text-xs font-bold text-gray-500">
          View all notifications
        </div>
      </div>
    </>
  );
}
