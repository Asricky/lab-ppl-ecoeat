"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Camera, CheckCircle2, ShieldAlert } from 'lucide-react';
import CourierLayout from '@/components/CourierLayout';
import { getOrderById, updateOrderStatus, OrderData } from '@/lib/data';

export default function UploadProofView({ params }: { params: any }) {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resolvedId, setResolvedId] = useState<string | null>(null);
  const [task, setTask] = useState<OrderData | null>(null);

  useEffect(() => {
    Promise.resolve(params).then((p) => {
      setResolvedId(p.id);
    });
  }, [params]);

  useEffect(() => {
    if (resolvedId) {
      const data = getOrderById(resolvedId);
      if (data) {
        setTask(data);
      }
    }
  }, [resolvedId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    if (resolvedId) {
      // Update global state
      updateOrderStatus(resolvedId, 'completed');
      
      // Native browser alert for notification as requested
      alert('Proof uploaded successfully! Order has been marked as delivered.');
      
      // Redirect to dashboard
      router.push('/');
    }
  };

  if (!task) {
    return (
      <CourierLayout>
        <div className="flex h-screen bg-ecoeat-bg items-center justify-center">
          <p className="text-ecoeat-muted font-bold">Loading...</p>
        </div>
      </CourierLayout>
    );
  }

  return (
    <CourierLayout>
      <div className="max-w-2xl mx-auto py-8">
        <Link href={`/dashboard/kurir/${resolvedId}`} className="inline-flex items-center gap-2 text-ecoeat-text font-bold hover:text-ecoeat-primary mb-8">
          <ArrowLeft size={20} /> Back to Route
        </Link>

        <div className="mb-8">
          <span className="text-[10px] font-bold text-ecoeat-accent uppercase tracking-widest mb-1">ACTION REQUIRED</span>
          <h1 className="text-3xl font-extrabold text-ecoeat-text mb-2">Upload Delivery Proof</h1>
          <p className="text-ecoeat-muted font-medium">Order #{task.id} • {task.productName}</p>
        </div>

        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-[24px] p-8 text-center bg-white relative hover:bg-gray-50 transition-colors mb-6 cursor-pointer overflow-hidden min-h-[300px] flex flex-col items-center justify-center ${image ? 'border-transparent' : 'border-gray-300'}`}
        >
          {!image ? (
            <div className="pointer-events-none">
              <div className="w-14 h-14 bg-ecoeat-pill rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera size={24} className="text-ecoeat-accent" />
              </div>
              <p className="font-bold text-ecoeat-text mb-2">Take or upload a photo</p>
              <p className="text-sm text-ecoeat-muted px-4">Take a photo when handing over the food to ensure proof of delivery.</p>
            </div>
          ) : (
            <img src={image} alt="Delivery Proof" className="absolute inset-0 w-full h-full object-cover z-10" />
          )}

          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
          />
        </div>

        <div className="bg-[#f0e6e6] rounded-xl p-4 flex items-start gap-3 mb-8">
          <ShieldAlert size={20} className="text-[#8a5a5a] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-[#2a1a1a]">Verification Guidelines</p>
            <p className="text-xs text-[#555] mt-1">Ensure the food package and house number (if applicable) are clearly visible in the frame for instant approval.</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className={`w-full font-bold py-4 rounded-xl transition-colors shadow-sm text-lg flex items-center justify-center gap-2 ${image ? 'bg-ecoeat-accent text-white hover:bg-[#156e26]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          disabled={!image}
        >
          <CheckCircle2 size={20} /> Submit Proof
        </button>
      </div>
    </CourierLayout>
  );
}
