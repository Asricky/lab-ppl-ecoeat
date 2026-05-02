import React from 'react';
import { ShoppingBag, MapPin, Navigation, Clock, Heart, CheckCircle2, Leaf } from 'lucide-react';
import Link from 'next/link';
import { OrderData, OrderStatus } from '@/lib/data';

interface OrderCardProps {
  order: OrderData;
  onViewDetails: (id: string) => void;
  onAction: (id: string) => void;
}

export default function OrderCard({ order, onViewDetails, onAction }: OrderCardProps) {
  const isCompleted = order.status === 'completed';

  return (
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

      {isCompleted && order.carbonSaved && (
        <div className="bg-ecoeat-pill rounded-xl p-3 flex items-center gap-2 text-ecoeat-accent font-semibold text-sm mb-6 border border-[#c5e6ce]">
          <Leaf size={16} />
          {order.carbonSaved}
        </div>
      )}

      <div className="mt-auto"></div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        {isCompleted ? (
          <button className="flex-1 bg-[#eaf4eb] text-[#1e8932] font-bold py-3.5 rounded-xl hover:bg-[#d4ecd7] transition-colors">
            Summary Receipt
          </button>
        ) : (
          <>
            <Link 
              href={`/kurir/${order.id}`}
              className="flex-1 bg-[#eaf4eb] text-[#1e8932] font-bold py-3.5 rounded-xl hover:bg-[#d4ecd7] transition-colors text-center"
            >
              View Details
            </Link>
            {order.status === 'in_progress' ? (
              <Link
                href={`/kurir/${order.id}`}
                className="flex-1 bg-ecoeat-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#025020] transition-colors shadow-sm text-center"
              >
                Start Delivery
              </Link>
            ) : (
              <Link 
                href={`/kurir/${order.id}`}
                className="flex-1 bg-ecoeat-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#025020] transition-colors shadow-sm text-center"
              >
                Finish Delivery
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
}
