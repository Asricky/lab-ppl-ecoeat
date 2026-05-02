"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CourierLayout from '@/app/components/CourierLayout';
import Sidebar from '@/app/components/Sidebar';
import { ArrowLeft, Phone, Navigation, CheckCircle2, Leaf, MoreVertical, Search, Bell, Settings, AlertTriangle, MapPin } from 'lucide-react';
import { getOrderById, OrderData, updateOrderStatus } from '@/lib/data';

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import('@/app/components/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-ecoeat-bg animate-pulse flex items-center justify-center text-ecoeat-muted font-semibold">
      Loading Map...
    </div>
  )
});

export default function RouteView({ params }: { params: any }) {
  const router = useRouter();
  const [task, setTask] = useState<OrderData | null>(null);
  const [state, setState] = useState('assigned'); // 'assigned', 'on_delivery', 'failed', 'completed'
  const [loading, setLoading] = useState(true);
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  
  // Real-time tracking state
  const [courierLocation, setCourierLocation] = useState<[number, number] | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Safely unwrap params which might be a Promise in Next.js 15+
    Promise.resolve(params).then((p) => {
      setResolvedId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (resolvedId) {
      const data = getOrderById(resolvedId);
      if (data) {
        setTask(data);
        setState(data.status); // set initial state from DB
      }
      setLoading(false);
    }
  }, [resolvedId]);

  // Geolocation Watcher
  useEffect(() => {
    if (state === 'on_delivery' && 'geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCourierLocation([lat, lng]);
          
          // Mock Axios call to Laravel backend to sync DB
          console.log(`[Real-Time Sync] Sent to Laravel DB: Lat ${lat}, Lng ${lng}`);
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    }

    // Cleanup when unmounting or status changes
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [state]);

  const handleStartDelivery = () => {
    setState('on_delivery');
    if (resolvedId) {
        updateOrderStatus(resolvedId, 'on_delivery' as any);
    }
  };

  const handleMarkDelivered = () => {
    router.push(`/kurir/${resolvedId}/upload-proof`);
  };

  const handleReportIssue = () => {
    if (resolvedId) {
      updateOrderStatus(resolvedId, 'failed');
      setState('failed');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-ecoeat-bg items-center justify-center">
        <p className="text-ecoeat-muted font-bold">Loading Task Data...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col h-screen bg-ecoeat-bg items-center justify-center gap-4">
        <AlertTriangle size={48} className="text-gray-400" />
        <p className="text-ecoeat-text font-bold text-xl">Task Not Found</p>
        <Link href="/kurir" className="px-6 py-2 bg-ecoeat-primary text-white font-bold rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-ecoeat-bg">
      <Sidebar isOpen={false} setIsOpen={() => {}} />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 border-b border-ecoeat-border flex items-center justify-between px-6 bg-ecoeat-bg/80 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-6">
            <Link href="/kurir" className="text-ecoeat-text font-bold hover:text-ecoeat-primary flex items-center gap-2">
              <ArrowLeft size={20} /> Back to Dashboard
            </Link>
            <span className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest pl-6 border-l border-gray-300">
              CURRENT TASK ID: #{task.id}
            </span>
          </div>

          <div className="flex items-center gap-4">
             <button className="text-ecoeat-muted hover:text-ecoeat-text"><Bell size={20} /></button>
             <button className="text-ecoeat-muted hover:text-ecoeat-text"><Settings size={20} /></button>
             <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
               <div className="text-right">
                 <p className="font-bold text-sm text-ecoeat-text leading-none">Alex J.</p>
                 <p className="text-[10px] font-bold text-ecoeat-muted uppercase">Eco-Courier</p>
               </div>
               <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white shadow-sm overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Alex" />
               </div>
             </div>
          </div>
        </header>

        <div className="flex-1 flex p-6 gap-6 relative overflow-hidden">
          
          <div className="flex-1 bg-gray-200 rounded-[32px] overflow-hidden relative shadow-sm border border-black/5 flex flex-col">
            {state === 'completed' ? (
              <div className="flex-1 bg-[#f2f6ef] flex items-center justify-center p-8">
                 <div className="text-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                      <CheckCircle2 size={48} className="text-[#1e8932]" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Delivery Completed</h2>
                    <p className="text-gray-500 max-w-sm mx-auto">This order has been successfully delivered and proof has been verified.</p>
                    {task.carbonSaved && (
                      <div className="mt-8 bg-white px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-sm border border-gray-100">
                        <Leaf size={16} className="text-[#1e8932]" />
                        <span className="font-bold text-sm text-[#026829]">{task.carbonSaved}</span>
                      </div>
                    )}
                 </div>
              </div>
            ) : (
              <>
                <RouteMap status={state} currentLocation={courierLocation} />

                {state !== 'failed' && (
                  <div className="absolute bottom-6 left-6 right-6 lg:right-auto flex items-center gap-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg z-[1000] animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="w-12 h-12 bg-[#eaf4eb] text-[#388e3c] rounded-xl flex items-center justify-center">
                      <Navigation size={24} />
                    </div>
                    <div className="mr-8">
                      <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-widest mb-1">ESTIMATED TIME</p>
                      <p className="font-extrabold text-ecoeat-text text-xl">{task.time} <span className="text-sm font-semibold text-ecoeat-muted ml-1">({task.distance})</span></p>
                    </div>
                    <div className="bg-[#eaf4eb] text-[#388e3c] px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
                      <Leaf size={14} /> LOW EMISSIONS ROUTE
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="w-[420px] shrink-0 bg-white rounded-[32px] shadow-sm border border-black/5 flex flex-col overflow-y-auto">
            <div className="p-8 pb-6 flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gray-100 text-ecoeat-muted px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {task.type === 'purchase' ? 'Purchase Delivery' : 'Donation Delivery'}
                </span>
                
                {state === 'assigned' && (
                  <span className="bg-[#eaf4eb] text-[#388e3c] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in">
                    <div className="w-1.5 h-1.5 bg-[#388e3c] rounded-full"></div> Assigned
                  </span>
                )}
                {state === 'in_progress' && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in">
                    <div className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-pulse"></div> Ready to Start
                  </span>
                )}
                {state === 'on_delivery' && (
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in">
                    <div className="w-1.5 h-1.5 bg-blue-700 rounded-full animate-pulse"></div> On Delivery
                  </span>
                )}
                {state === 'failed' && (
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in">
                    <AlertTriangle size={12} /> FAILED
                  </span>
                )}
                {state === 'completed' && (
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-extrabold text-ecoeat-text leading-tight mb-8">
                {task.productName}
              </h2>

              {state === 'failed' && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="flex items-center gap-2 text-red-700 mb-2">
                    <AlertTriangle size={20} />
                    <span className="font-bold">Delivery Halted</span>
                  </div>
                  <p className="text-xs text-red-800 leading-relaxed">
                    Delivery not completed. The system has automatically notified the administrator and the recipient. Please wait for further instructions or return to the dashboard.
                  </p>
                </div>
              )}

              <div className="relative pl-8 mb-8 space-y-8">
                <div className="absolute left-[15px] top-3 bottom-8 border-l-2 border-ecoeat-border"></div>
                
                <div className="relative">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-md bg-[#026829] flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                    <span className="text-[10px] font-bold">A</span>
                  </div>
                  <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">PICKUP FROM</p>
                  <p className="font-bold text-lg text-ecoeat-text leading-tight">{task.pickupName}</p>
                  <p className="text-sm font-medium text-ecoeat-muted mt-1">{task.pickupAddress}</p>
                  
                  <div className="mt-4 bg-[#f8fbf8] border border-[#e5ecd6] p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <img src={task.pickupAvatar} alt={task.pickupContact} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-ecoeat-text leading-none">{task.pickupContact}</p>
                        <p className="text-xs text-ecoeat-muted mt-0.5">{task.pickupPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white ring-4 ring-white shadow-sm">
                    <MapPin size={12} />
                  </div>
                  <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">DESTINATION</p>
                  <p className="font-bold text-lg text-ecoeat-text leading-tight">{task.destinationName}</p>
                  <p className="text-sm font-medium text-ecoeat-muted mt-1">{task.destinationAddress}</p>

                  <div className="mt-4 bg-[#f8fbf8] border border-[#e5ecd6] p-3 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <img src={task.destinationAvatar} alt={task.destinationContact} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-ecoeat-text leading-none">{task.destinationContact}</p>
                        <p className="text-xs text-ecoeat-muted mt-0.5">{task.destinationPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-8 pt-0 mt-auto bg-white relative z-10 transition-all duration-300">
              
              {(state === 'assigned' || state === 'in_progress') && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <button onClick={handleStartDelivery} className="w-full bg-[#388e3c] text-white font-bold py-4 rounded-2xl hover:bg-[#2e7d32] transition-colors shadow-lg shadow-green-900/20 text-lg flex items-center justify-center gap-2 mb-3">
                    <Navigation size={20} /> Start Delivery
                  </button>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-[#dceddd] text-[#388e3c] font-bold py-3.5 rounded-xl hover:bg-[#c9e4cb] transition-colors shadow-sm">
                      Mark as Picked Up
                    </button>
                    <button className="flex-1 bg-[#e5e5e5] text-gray-500 font-bold py-3.5 rounded-xl transition-colors shadow-sm cursor-not-allowed">
                      Mark as On Delivery
                    </button>
                  </div>
                </div>
              )}

              {state === 'on_delivery' && (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <button onClick={handleMarkDelivered} className="w-full bg-[#388e3c] text-white font-bold py-4 rounded-2xl hover:bg-[#2e7d32] transition-colors shadow-lg shadow-green-900/20 text-lg flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} /> Mark as Delivered
                  </button>
                  <button onClick={handleReportIssue} className="w-full bg-gray-100 text-red-600 font-bold py-3.5 rounded-xl hover:bg-red-50 transition-colors shadow-sm">
                    Report Issue / Failed
                  </button>
                </div>
              )}

              {(state === 'failed' || state === 'completed') && (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                  <Link href="/kurir" className="w-full bg-ecoeat-text text-white font-bold py-4 rounded-2xl hover:bg-black transition-colors shadow-lg shadow-gray-900/20 text-lg flex items-center justify-center gap-2">
                    <ArrowLeft size={20} /> Return to Dashboard
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
