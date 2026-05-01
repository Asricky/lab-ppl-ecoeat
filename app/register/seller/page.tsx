"use client";

import Link from "next/link";
import { Upload, ShieldCheck } from "lucide-react";
import { FormEvent, useState, useRef } from "react";

export default function RegisterSellerPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    password: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size must be less than 5MB" });
        setFile(null);
      } else {
        const newErrors = { ...errors };
        delete newErrors.file;
        setErrors(newErrors);
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, file: "File size must be less than 5MB" });
        setFile(null);
      } else {
        const newErrors = { ...errors };
        delete newErrors.file;
        setErrors(newErrors);
        setFile(droppedFile);
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.email.includes("@")) newErrors.email = "Invalid email format";
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (!file) newErrors.file = "Please upload your NIB / Operating License";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Submit Seller:", { ...formData, file });
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] flex flex-col items-center justify-center p-6 relative py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-1.5 rounded-full mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Join 400+ Sustainable Partners</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Register as Seller
        </h1>
        <p className="text-gray-500 text-lg">
          Start selling or donating surplus food
        </p>
      </div>

      <div className="bg-white rounded-3xl p-10 md:p-12 max-w-3xl w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Alex Rivers"
                className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="alex@business.com"
                className={`w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Business Name
              </label>
              <input
                type="text"
                placeholder="Green Grove Deli"
                className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <div className="pt-4">
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              NIB / Operating License
            </label>
            <div 
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${errors.file ? 'border-red-400 bg-red-50' : 'border-green-200 bg-[#f9faf9] hover:bg-green-50 cursor-pointer'}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <Upload className="w-6 h-6 text-gray-600" />
                </div>
                {file ? (
                  <p className="text-gray-800 font-semibold">{file.name}</p>
                ) : (
                  <>
                    <p className="text-gray-800 font-semibold">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-500">PDF, JPG, OR PNG (MAX 5MB)</p>
                  </>
                )}
              </div>
            </div>
            {errors.file && <p className="text-red-500 text-xs mt-2">{errors.file}</p>}
          </div>

          <div className="bg-[#eef5ef] border border-green-100 rounded-xl p-4 flex items-start space-x-3 mt-6">
            <ShieldCheck className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-bold text-green-800">Status note:</span> Your account will be reviewed before activation. This manual verification ensures the safety and quality of our ecosystem.
            </p>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
            >
              Submit Registration
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500 max-w-md">
        By registering, you agree to our <Link href="#" className="underline hover:text-gray-800">Terms of Service</Link> and <Link href="#" className="underline hover:text-gray-800">Environmental Commitment Policy</Link>.
      </p>
    </div>
  );
}
