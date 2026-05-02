import React, { useState } from 'react';
import { ShoppingBag, MapPin, Navigation, Clock, Heart, CheckCircle2, Leaf, X, Phone } from 'lucide-react';
import Link from 'next/link';
import { OrderData, OrderStatus } from '@/lib/data';
import ChatModal from './ChatModal';

interface OrderCardProps {
  order: OrderData;
  onViewDetails: (id: string) => void;
  onAction: (id: string) => void;
}

export default function OrderCard({ order, onViewDetails, onAction }: OrderCardProps) {
  const isCompleted = order.status === 'completed';
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <>
      <div className="bg-white rounded-[24px] p-5 shadow-sm border border-black/5 flex flex-col h-full relative">
      {order.isHighPriority && (
        <div className="absolute -top-3 right-4 bg-[#f0e6e6] text-[#8a5a5a] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          High Priority
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-ecoeat-primary font-semibold text-sm">
          {order.type === 'purchase' ? <ShoppingBag size={16} /> : <Heart size={16} className="text-gray-500" />}
          <span className={order.type === 'donation' ? 'text-gray-600' : ''}>
            {order.type === 'purchase' ? 'Purchase Delivery' : 'Donation Delivery'}
          </span>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          order.status === 'in_progress' ? 'bg-[#c5e6ce] text-[#125824]' :
          order.status === 'completed' ? 'text-[#1e8932] flex items-center gap-1' :
          'bg-[#e5e5e5] text-[#555]'
        }`}>
          {isCompleted && <CheckCircle2 size={14} />}
          {order.status === 'in_progress' ? 'IN PROGRESS' : order.status === 'completed' ? 'COMPLETED' : 'ASSIGNED'}
        </div>
      </div>

      {/* Locations Timeline */}
      <div className="relative pl-6 mb-6 space-y-4">
        {/* Vertical dotted line */}
        <div className="absolute left-[11px] top-2 bottom-2 border-l-2 border-dotted border-gray-300"></div>
        
        {/* Pickup */}
        <div className="relative">
          <div className="absolute -left-6 top-1 w-[10px] h-[10px] rounded-full bg-ecoeat-primary border-2 border-white ring-1 ring-ecoeat-primary"></div>
          <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-0.5">PICKUP</p>
          <p className="font-bold text-ecoeat-text leading-tight">{order.pickupName}</p>
        </div>

        {/* Destination */}
        <div className="relative">
          <div className="absolute -left-[27px] top-1 bg-white p-0.5 rounded-full">
            <MapPin size={14} className="text-gray-400" />
          </div>
          <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-0.5">DESTINATION</p>
          <p className="font-bold text-ecoeat-text leading-tight">{order.destinationAddress}</p>
        </div>
      </div>

      {/* Reward Display */}
      {order.reward && (
        <div className="bg-[#eaf4eb] rounded-xl p-3 mb-6 flex justify-between items-center border border-[#c5e6ce]">
          <span className="text-xs font-bold text-[#1e8932] uppercase tracking-wider">Task Reward</span>
          <span className="font-extrabold text-ecoeat-text">Rp{order.reward.toLocaleString('id-ID')}</span>
        </div>
      )}

      {/* Stats Pills */}
      {!isCompleted && (
        <div className="flex gap-3 mb-6">
          <div className="flex-1 bg-ecoeat-pill rounded-xl p-3 flex items-center gap-3">
            <Navigation size={18} className="text-ecoeat-accent" />
            <div>
              <p className="text-[10px] font-bold text-ecoeat-muted uppercase">Distance</p>
              <p className="font-bold text-ecoeat-text text-sm">{order.distance}</p>
            </div>
          </div>
          <div className="flex-1 bg-ecoeat-pill rounded-xl p-3 flex items-center gap-3">
            <Clock size={18} className="text-ecoeat-accent" />
            <div>
              <p className="text-[10px] font-bold text-ecoeat-muted uppercase">Est. Time</p>
              <p className="font-bold text-ecoeat-text text-sm">{order.time}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-auto"></div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {isCompleted ? (
          <button 
            onClick={() => setShowReceipt(true)}
            className="flex-1 bg-white text-ecoeat-primary border-2 border-ecoeat-primary font-bold py-3.5 rounded-xl hover:bg-ecoeat-primary hover:text-white transition-all shadow-[0_4px_14px_0_rgba(18,88,36,0.15)] active:scale-[0.98]"
          >
            Summary Receipt
          </button>
        ) : (
          <>
            <Link 
              href={`/dashboard/kurir/tasks/${order.id}`}
              className="flex-1 bg-[#eaf4eb] text-[#1e8932] font-bold py-3.5 rounded-xl hover:bg-[#d4ecd7] transition-colors text-center"
            >
              View Details
            </Link>
            {order.status === 'in_progress' ? (
              <Link
                href={`/dashboard/kurir/tasks/${order.id}`}
                className="flex-1 bg-ecoeat-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#025020] transition-colors shadow-sm text-center"
              >
                Start Delivery
              </Link>
            ) : (
              <Link 
                href={`/dashboard/kurir/tasks/${order.id}`}
                className="flex-1 bg-ecoeat-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#025020] transition-colors shadow-sm text-center"
              >
                Start Delivery
              </Link>
            )}
          </>
        )}
      </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-6 shadow-xl w-full max-w-sm relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setShowReceipt(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-2 text-ecoeat-primary mb-6">
              <CheckCircle2 size={24} />
              <h3 className="font-bold text-xl">Delivery Receipt</h3>
            </div>
            
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-ecoeat-muted uppercase font-bold tracking-wider mb-2">Order Details</p>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-ecoeat-text">Order ID</span>
                  <span className="text-sm font-medium text-gray-600">{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-ecoeat-text">Completed</span>
                  <span className="text-sm font-medium text-gray-600">May 2, 2026, 09:30 AM</span>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-ecoeat-muted uppercase font-bold tracking-wider mb-2">Items Delivered</p>
                <p className="text-sm font-medium text-ecoeat-text bg-ecoeat-pill p-3 rounded-xl border border-[#c5e6ce]">{order.productName}</p>
              </div>

              <div className="border-b border-gray-100 pb-4">
                <p className="text-xs text-ecoeat-muted uppercase font-bold tracking-wider mb-2">Proof of Delivery</p>
                <div className="w-full h-36 bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-100 flex items-center justify-center">
                  {order.photoProofUrl ? (
                    <img 
                      src={order.photoProofUrl} 
                      alt="Proof of handover" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 p-4">
                      <p className="text-xs font-bold uppercase">No Photo Provided</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-ecoeat-muted uppercase font-bold tracking-wider mb-2">Recipient</p>
                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <img src={order.destinationAvatar} alt={order.destinationContact} className="w-10 h-10 rounded-full border border-gray-200" />
                  <p className="text-sm font-bold text-ecoeat-text">{order.destinationContact}</p>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowReceipt(false)}
              className="w-full mt-6 bg-ecoeat-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#025020] transition-colors"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </>
  );
}
