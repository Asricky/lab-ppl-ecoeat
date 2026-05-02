import React from 'react';
import { ShoppingBag, Heart, ChevronRight } from 'lucide-react';

export default function AssignedDeliveryList() {
  const deliveries = [
    {
      id: '#88219',
      type: 'buy',
      pickup: 'Artisan Bakery',
      destination: 'Youth Center',
      distance: '2.4 km',
      time: '32 mins total',
      status: 'Pending',
      statusDetail: 'Ready in 15m',
      statusColor: 'text-[#388e3c]'
    },
    {
      id: '#88224',
      type: 'donation',
      pickup: 'Fresh Hub',
      destination: 'Homeless Shelter',
      distance: '1.1 km',
      time: '14 mins total',
      status: 'Scheduled',
      statusDetail: 'Starts 2:00 PM',
      statusColor: 'text-ecoeat-primary'
    }
  ];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-2xl font-bold text-ecoeat-text">Assigned Deliveries</h2>
        <button className="text-sm font-bold text-[#388e3c] hover:underline">View Schedule</button>
      </div>

      <div className="space-y-4">
        {deliveries.map((delivery, i) => (
          <div key={i} className="bg-[#f8fbf8] rounded-2xl p-4 border border-[#e5ecd6] flex items-center hover:shadow-sm transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-[#e5ecd6] shrink-0 mr-4 shadow-sm">
              {delivery.type === 'buy' ? (
                <ShoppingBag size={20} className="text-[#388e3c]" />
              ) : (
                <Heart size={20} className="text-ecoeat-primary" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  delivery.type === 'buy' ? 'bg-[#c5e6ce] text-[#125824]' : 'bg-[#e5d0d0] text-[#7a3b3b]'
                }`}>
                  {delivery.type}
                </span>
                <span className="text-xs font-semibold text-ecoeat-muted tracking-wider">ID {delivery.id}</span>
              </div>
              <h3 className="font-bold text-ecoeat-text text-base leading-tight truncate">
                {delivery.pickup} → {delivery.destination}
              </h3>
              <p className="text-xs font-medium text-ecoeat-muted mt-0.5">
                {delivery.distance} • {delivery.time}
              </p>
            </div>

            <div className="text-right flex items-center gap-3 ml-4">
              <div>
                <p className={`font-bold text-sm ${delivery.statusColor}`}>{delivery.status}</p>
                <p className="text-[10px] font-semibold text-ecoeat-muted uppercase mt-0.5">{delivery.statusDetail}</p>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
