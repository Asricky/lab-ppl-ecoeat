import React, { useState } from 'react';
import { X, Send, User } from 'lucide-react';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: string;
  recipientName?: string;
  recipientAvatar?: string;
}

export default function ChatModal({ isOpen, onClose, orderId, recipientName, recipientAvatar }: ChatModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-4 sm:bottom-6 sm:right-6 w-[320px] sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-black/10 z-50 overflow-hidden flex flex-col h-[400px] animate-in fade-in slide-in-from-bottom-10">
      {/* Header */}
      <div className="bg-ecoeat-primary text-white p-4 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center overflow-hidden border border-white/30">
            {recipientAvatar ? (
              <img src={recipientAvatar} alt={recipientName} className="w-full h-full object-cover" />
            ) : (
              <User size={16} />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold leading-tight truncate max-w-[150px]">
              {recipientName || 'Customer Support'}
            </h3>
            <p className="text-[10px] font-medium opacity-80">
              {orderId ? `Order #${orderId}` : 'Usually replies in 5 mins'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages Area (Structural Placeholder) */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
        <div className="self-end bg-ecoeat-primary text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
          Hello {recipientName ? recipientName.split(' ')[0] : ''}, I am on my way with your order!
          <span className="text-[10px] text-white/70 block mt-1">10:00 AM</span>
        </div>
        
        <div className="self-start bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-sm text-sm text-ecoeat-text shadow-sm max-w-[85%]">
          Great, thank you! Please leave it at the lobby.
          <span className="text-[10px] text-gray-400 block mt-1">10:02 AM</span>
        </div>
        
        <div className="self-end bg-ecoeat-primary text-white p-3 rounded-2xl rounded-tr-sm text-sm shadow-sm max-w-[85%]">
          Will do!
          <span className="text-[10px] text-white/70 block mt-1">10:03 AM</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ecoeat-primary/20 text-ecoeat-text"
        />
        <button className="w-10 h-10 bg-ecoeat-primary text-white rounded-xl flex items-center justify-center hover:bg-ecoeat-accent transition-colors shadow-sm shrink-0">
          <Send size={16} className="ml-0.5" />
        </button>
      </div>
    </div>
  );
}
