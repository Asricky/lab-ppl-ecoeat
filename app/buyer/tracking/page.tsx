"use client";
import dynamic from 'next/dynamic';
import { Clock, MessageSquare, CheckCircle2, Circle, Phone, QrCode } from 'lucide-react';
import { useState } from 'react';

const TrackingMap = dynamic(() => import('@/components/buyer/TrackingMap'), { ssr: false });

export default function TrackingPage() {
  // Toggle between delivery and pickup for demonstration
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [showChat, setShowChat] = useState(false);
  
  return (
    <div className="max-w-[1400px] mx-auto pb-12 flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-8">
      
      {/* Left side Map */}
      <div className="w-full lg:w-2/3 h-[50vh] lg:h-full relative rounded-3xl overflow-hidden shadow-sm border border-[#e1e8d5]">
        <TrackingMap deliveryMethod={method} />
        
        {/* Toggle float for demo */}
        <div className="absolute top-6 right-6 z-[1000] flex space-x-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-[#e1e8d5]">
          <button onClick={() => setMethod('delivery')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${method === 'delivery' ? 'bg-green-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Delivery</button>
          <button onClick={() => setMethod('pickup')} className={`px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${method === 'pickup' ? 'bg-green-800 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}>Pickup</button>
        </div>

        {/* Sustainability Impact float */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-[#f4f7ed]/95 backdrop-blur-sm rounded-2xl p-4 flex items-center space-x-3 shadow-lg border border-[#d4dec4] min-w-[250px]">
          <div className="bg-[#eef3e8] p-2 rounded-full text-green-700 border border-[#d4dec4]">
             <svg className="w-5 h-5 text-green-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">Sustainability Impact</h4>
            <p className="text-[10px] text-gray-500 font-medium">This delivery saved 2.4kg of CO2 today.</p>
          </div>
        </div>
      </div>

      {/* Right side Info */}
      <div className="w-full lg:w-1/3 flex flex-col h-full overflow-y-auto pr-2">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ORDER #OP-28491-X</p>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1 leading-tight">Artisan Sourdough<br/>Bundle</h1>
            </div>
            <span className="bg-[#eef3e8] text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#d4dec4] whitespace-nowrap">On Delivery</span>
          </div>
        </div>

        {method === 'delivery' ? (
          <div className="bg-[#eef3e8] rounded-3xl p-6 mb-8 border border-[#d4dec4] flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-green-800 mb-1">Estimated Arrival</p>
              <p className="text-4xl font-extrabold text-gray-900">12 <span className="text-lg font-medium text-gray-600">mins</span></p>
            </div>
            <div className="bg-white p-3.5 rounded-full text-green-700 shadow-sm border border-[#e1e8d5]">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        ) : (
          <div className="bg-[#eef3e8] rounded-3xl p-6 mb-8 border border-[#d4dec4] flex items-center justify-between shadow-sm">
            <div>
              <p className="text-xs font-bold text-green-800 mb-1">Pickup Code</p>
              <p className="text-3xl font-extrabold text-gray-900 tracking-widest">ECO-8892</p>
            </div>
            <div className="bg-white p-3.5 rounded-xl text-gray-900 shadow-sm border border-[#e1e8d5]">
              <QrCode className="w-8 h-8" />
            </div>
          </div>
        )}

        <div className="mb-8 flex-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">DELIVERY PROGRESS</p>
          <div className="relative border-l-2 border-[#c3d1b0] ml-3 space-y-8">
            <div className="relative pl-6">
              <div className="absolute -left-[11px] top-0 bg-green-700 rounded-full w-5 h-5 flex items-center justify-center border-4 border-[#f4f7ed] shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Order Confirmed</h4>
              <p className="text-[10px] text-gray-500 font-medium">Today, 10:30 AM</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[11px] top-0 bg-green-700 rounded-full w-5 h-5 flex items-center justify-center border-4 border-[#f4f7ed] shadow-sm">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">Preparing</h4>
              <p className="text-[10px] text-gray-500 font-medium">Today, 10:45 AM</p>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[11px] top-0 bg-white border-2 border-green-700 rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 bg-green-700 rounded-full"></div>
              </div>
              <h4 className="font-bold text-green-700 text-sm">{method === 'delivery' ? 'On Delivery' : 'Ready for Pickup'}</h4>
              <p className="text-[10px] text-gray-500 font-medium">{method === 'delivery' ? 'In transit since 11:12 AM' : 'Available at EcoEat Hub'}</p>
            </div>
            <div className="relative pl-6 opacity-40">
              <div className="absolute -left-[11px] top-0 bg-[#d4dec4] rounded-full w-5 h-5 flex items-center justify-center border-4 border-[#f4f7ed]">
                <Circle className="w-2 h-2 text-transparent" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{method === 'delivery' ? 'Delivered' : 'Picked Up'}</h4>
              <p className="text-[10px] text-gray-500 font-medium">Estimated by 11:35 AM</p>
            </div>
          </div>
        </div>

        {method === 'delivery' ? (
          <div className="bg-[#eef3e8] rounded-3xl p-6 border border-[#d4dec4] mt-auto shadow-sm">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">YOUR COURIER</p>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center space-x-3">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" alt="Marco S." className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                <div>
                  <h4 className="font-extrabold text-gray-900 text-lg">Marco S.</h4>
                  <p className="text-[10px] font-bold text-green-700 flex items-center mt-0.5">★ 4.9 <span className="text-gray-500 font-medium ml-1">(2,140 deliveries)</span></p>
                </div>
              </div>
              <button onClick={() => setShowChat(true)} className="bg-white p-3 rounded-xl border border-[#d4dec4] text-gray-600 hover:text-green-700 transition-colors shadow-sm">
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
            <button onClick={() => setShowChat(true)} className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center">
              <Phone className="w-4 h-4 mr-2" /> Contact Marco
            </button>
          </div>
        ) : (
          <div className="bg-[#eef3e8] rounded-3xl p-6 border border-[#d4dec4] mt-auto shadow-sm">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">PICKUP INSTRUCTIONS</p>
            <h4 className="font-extrabold text-gray-900 mb-1 text-lg">EcoEat Downtown Hub</h4>
            <p className="text-xs text-gray-600 leading-relaxed font-medium mb-4">123 Green Ave, Block B<br/>Show your pickup code to the staff at the surplus counter.</p>
            <p className="text-xs font-bold text-green-700 flex items-center"><Clock className="w-3 h-3 mr-1"/> Open until 20:00</p>
          </div>
        )}
      </div>

      {showChat && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-[#e1e8d5] z-[1001] flex flex-col overflow-hidden">
          <div className="bg-[#15803d] text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border border-white/50" />
              <span className="font-bold">Chat with Marco</span>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white/80 hover:text-white">✕</button>
          </div>
          <div className="p-4 h-48 overflow-y-auto bg-[#f4f7ed] text-sm flex flex-col gap-2">
            <div className="bg-white p-2 rounded-lg rounded-tl-none self-start shadow-sm border border-[#e1e8d5] max-w-[80%] text-gray-800">
              Hello, I'm arriving in 12 mins.
            </div>
          </div>
          <div className="p-3 bg-white border-t border-[#e1e8d5] flex items-center">
            <input type="text" placeholder="Type a message..." className="flex-1 bg-[#eef3e8] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600" />
          </div>
        </div>
      )}
    </div>
  );
}
