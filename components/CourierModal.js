"use client";

import { useState } from 'react';
import { Camera, X, CheckCircle, ShieldCheck } from 'lucide-react';

export default function CourierModal({ isOpen, onClose, onConfirm }) {
  const [otp, setOtp] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6 && file) {
      onConfirm({ otp, file });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
          <div className="flex items-center text-green-800 font-bold text-lg">
            <ShieldCheck className="w-5 h-5 mr-2 text-green-600" />
            Verifikasi Handover
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-7">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Kode OTP Penerima</label>
            <p className="text-xs text-gray-500 mb-3">Masukkan 6 digit kode dari pembeli/LKS.</p>
            <input 
              type="text" 
              maxLength="6"
              className="w-full text-center text-3xl tracking-[0.75em] font-mono border-2 border-gray-200 rounded-2xl px-4 py-4 focus:ring-0 focus:border-green-500 outline-none transition-colors bg-gray-50 focus:bg-white"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Bukti Serah Terima</label>
            <div className={`mt-1 flex justify-center px-6 py-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer relative group ${file ? 'border-green-400 bg-green-50/50' : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'}`}>
              <input 
                id="file-upload" 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileChange} 
                accept="image/*" 
                required 
              />
              
              <div className="space-y-2 text-center pointer-events-none">
                {preview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm mb-3 border border-green-200">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-sm font-medium text-green-700 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Foto Terunggah
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Camera className="h-7 w-7 text-green-500" />
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Tap untuk Ambil Foto
                    </div>
                    <p className="text-xs text-gray-400">Pastikan makanan terlihat jelas</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={otp.length !== 6 || !file}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-[0.98] flex justify-center items-center"
            >
              Selesaikan Pengiriman
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
