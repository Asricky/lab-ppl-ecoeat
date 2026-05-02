"use client";

import { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

export default function DocumentUpload({ title, description, accept = ".pdf,.jpg,.jpeg,.png", onUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
      if (onUpload) onUpload(file);
    }, 1500);
  };

  return (
    <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
          <FileText className="w-6 h-6" />
        </div>
      </div>
      
      <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group ${file ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'}`}>
        <input 
          type="file" 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
          accept={accept}
          onChange={(e) => setFile(e.target.files[0])}
        />
        
        {file ? (
          <div className="flex flex-col items-center pointer-events-none">
            <CheckCircle2 className="w-14 h-14 text-green-500 mb-3 drop-shadow-sm" />
            <p className="font-semibold text-gray-800 line-clamp-1 max-w-[200px]">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1 bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="pointer-events-none flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
              <UploadCloud className="w-8 h-8 text-blue-500" />
            </div>
            <p className="font-semibold text-gray-800 mb-1">Pilih File atau Drag & Drop</p>
            <p className="text-xs text-gray-500 max-w-xs">Mendukung file PDF, JPG, atau PNG (Maks 5MB)</p>
          </div>
        )}
      </div>
      
      {file && (
        <button 
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-6 w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              Mengunggah...
            </>
          ) : 'Unggah Dokumen'}
        </button>
      )}
    </div>
  );
}
