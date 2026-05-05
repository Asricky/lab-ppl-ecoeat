"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, CheckCircle2, Phone, Camera, X, Upload, Loader2, Image as ImageIcon, XCircle } from 'lucide-react';
import { CourierTask } from '@/lib/dashboardData';
import { useTaskStore } from '@/store/taskStore';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/components/kurir/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-semibold rounded-xl">
      Loading Live Tracking...
    </div>
  )
});

export default function CourierTrackingDetail() {
  const params = useParams();
  const router = useRouter();
  const { tasks, completeTask, failTask } = useTaskStore();
  const [task, setTask] = useState<CourierTask | null>(null);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isFailModalOpen, setIsFailModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Validation Form State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [handoverNote, setHandoverNote] = useState('');
  const [failReason, setFailReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const resolvedId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (resolvedId) {
      const foundTask = tasks.find(t => t.id === resolvedId);
      if (foundTask) setTask(foundTask);
    }
  }, [params, tasks]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleComplete = () => {
    if (!photoPreview) {
      alert("Harap unggah foto bukti terlebih dahulu sesuai standar PBI#18.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      completeTask(task!.id, photoPreview, handoverNote);
      setIsSubmitting(false);
      setIsValidationOpen(false);
      setIsCompleted(true);
      
      // Route back to home dashboard to see summary receipt
      setTimeout(() => {
        router.refresh();
        router.push('/kurir/home');
      }, 1500);
    }, 1500);
  };

  const handleFailTask = () => {
    setIsFailModalOpen(true);
  };

  const submitFailTask = () => {
    if (!failReason) return;
    setIsSubmitting(true);
    setTimeout(() => {
      failTask(task!.id, failReason);
      setIsSubmitting(false);
      setIsFailModalOpen(false);
      setIsCompleted(true);
      setTimeout(() => {
        router.refresh();
        router.push('/kurir/home');
      }, 1500);
    }, 1500);
  };

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-emerald-950 font-bold text-xl">Task Not Found</p>
        <Link href="/kurir/home" className="px-6 py-2 bg-emerald-900 text-white font-bold rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const mapPoints = [
    { lat: -6.2, lng: 106.816, type: 'seller', name: task.pickup },
    { lat: -6.206, lng: 106.822, type: 'courier', name: 'My Position' },
    { lat: -6.21, lng: 106.826, type: 'lks', name: task.destination },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Handover Validation Modal */}
      {isValidationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsValidationOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-emerald-950 text-white">
              <h3 className="font-extrabold text-lg">Photo Handover Validation</h3>
              <button onClick={() => setIsValidationOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-sm font-medium text-slate-600">
                PBI#18 Requirement: Harap unggah foto bukti serah terima makanan untuk menyelesaikan pengantaran ini.
              </p>
              
              {/* Real Upload Box */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group relative overflow-hidden ${photoPreview ? 'border-emerald-500 bg-emerald-50/50' : 'border-emerald-200 bg-[#F2F6F0] hover:bg-emerald-50'}`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  capture="environment"
                  onChange={handlePhotoChange} 
                />
                
                {photoPreview ? (
                  <>
                    <div className="absolute inset-0 w-full h-full">
                      <img src={photoPreview} alt="Proof preview" className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ImageIcon size={32} className="text-white drop-shadow-md mb-2" />
                        <span className="text-white font-bold drop-shadow-md text-sm">Ganti Foto</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-700 group-hover:scale-110 transition-transform mb-3">
                      <Camera size={28} />
                    </div>
                    <p className="font-extrabold text-emerald-950">Ambil Foto Bukti</p>
                    <p className="text-xs font-bold text-emerald-700 mt-1">atau pilih dari galeri</p>
                  </>
                )}
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Catatan Tambahan (Opsional)</label>
                <textarea 
                  value={handoverNote}
                  onChange={(e) => setHandoverNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all min-h-[80px]"
                  placeholder="Contoh: Diterima langsung oleh satpam..."
                ></textarea>
              </div>

              <button 
                onClick={handleComplete}
                disabled={isSubmitting || !photoPreview}
                className={`w-full font-extrabold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm ${!photoPreview || isSubmitting ? 'bg-emerald-800/50 text-white/70 cursor-not-allowed' : 'bg-emerald-900 text-white hover:bg-emerald-950'}`}
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Mengunggah...</>
                ) : (
                  <><Upload size={18} /> Kirim & Selesaikan Pesanan</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fail Confirmation Modal */}
      {isFailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFailModalOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-red-950 text-white">
              <h3 className="font-extrabold text-lg flex items-center gap-2"><XCircle size={20} /> Lapor Kendala / Gagal Antar</h3>
              <button onClick={() => setIsFailModalOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-sm font-medium text-slate-600">
                Tandai pesanan ini sebagai gagal. Saldo <strong className="text-red-600">tidak akan ditambahkan</strong> ke akun Anda. Silakan pilih alasan kegagalan:
              </p>

              <div className="space-y-3">
                {['Penerima tidak di tempat', 'Alamat tidak ditemukan', 'Makanan rusak / tumpah', 'Penerima menolak pesanan', 'Lainnya'].map((reason) => (
                  <label key={reason} className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${failReason === reason ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input 
                      type="radio" 
                      name="failReason" 
                      value={reason} 
                      checked={failReason === reason}
                      onChange={() => setFailReason(reason)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500"
                    />
                    <span className={`text-sm font-bold ${failReason === reason ? 'text-red-900' : 'text-slate-700'}`}>{reason}</span>
                  </label>
                ))}
              </div>

              <button 
                onClick={submitFailTask}
                disabled={isSubmitting || !failReason}
                className={`w-full font-extrabold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm ${!failReason || isSubmitting ? 'bg-red-800/50 text-white/70 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {isSubmitting ? (
                  <><Loader2 size={18} className="animate-spin" /> Memproses...</>
                ) : (
                  <><XCircle size={18} /> Konfirmasi Gagal Antar</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/kurir/tasks/${task.id}`} className="p-2 bg-white rounded-full border border-black/5 hover:bg-emerald-50 text-emerald-950 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">LIVE TRACKING</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">
            Order #{task.id}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-black/5 p-2 shadow-sm min-h-[500px] relative">
          {isCompleted && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center animate-in fade-in">
              <div className="w-24 h-24 bg-[#eaf4eb] rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4">
                <CheckCircle2 size={48} className="text-[#388e3c]" />
              </div>
              <h2 className="text-3xl font-extrabold text-emerald-950">Validation Success!</h2>
              <p className="text-emerald-700 font-bold mt-2">Redirecting to history...</p>
            </div>
          )}
          <div className="h-full rounded-2xl overflow-hidden relative">
             <MapContainer locations={mapPoints} showRoute={true} />
          </div>
        </div>
        
        {/* Info Column */}
        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2">
              <MapPin size={20} className="text-emerald-700" /> Current Route
            </h2>
          </div>
          
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            {/* Pickup Node */}
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-emerald-700"></div>
              </div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">PICKUP (SENDER)</p>
              <p className="font-bold text-emerald-950 text-sm leading-tight">{task.pickup}</p>
              
              {/* Contact Info PBI#14 */}
              <div className="mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">Kontak Pengirim</p>
                  <p className="text-xs font-bold text-emerald-950">+62 812-3456-7890</p>
                </div>
              </div>
            </div>
            
            {/* Destination Node */}
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-gray-100 border border-gray-400 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              </div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">DESTINATION (RECEIVER)</p>
              <p className="font-bold text-emerald-950 text-sm leading-tight">{task.destination}</p>
              
              {/* Contact Info PBI#17 */}
              <div className="mt-3 bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase">Kontak Penerima</p>
                  <p className="text-xs font-bold text-emerald-950">+62 898-7654-3210</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100 space-y-4">
             <div className="bg-[#F2F6F0] p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1">SISA JARAK</p>
                  <p className="font-extrabold text-emerald-950 text-xl">{task.distance}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1">ESTIMASI</p>
                  <p className="font-extrabold text-emerald-950 text-xl">{task.eta}</p>
                </div>
             </div>
             
             <div className="flex flex-col gap-3">
               <button 
                 onClick={() => setIsValidationOpen(true)}
                 disabled={isCompleted}
                 className={`w-full font-extrabold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm ${isCompleted ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-900 text-white hover:bg-emerald-950'}`}
               >
                  <CheckCircle2 size={18} /> Confirm Delivery Complete
               </button>
               
               <button 
                 onClick={handleFailTask}
                 disabled={isCompleted}
                 className={`w-full font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 border-2 ${isCompleted ? 'border-gray-200 text-gray-400 cursor-not-allowed' : 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300'}`}
               >
                  <XCircle size={18} /> Gagal Antar
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
