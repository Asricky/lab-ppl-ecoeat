"use client";

import Link from "next/link";
import { Upload, Info, User, Truck, MapPin, FileCheck, CheckCircle2, AlertCircle, X } from "lucide-react";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { registerCourier } from "@/lib/courier-registration";

export default function RegisterCourierPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    vehicleType: "Motorcycle",
    plateNumber: "",
    coverageArea: "",
  });

  const [simFile, setSimFile] = useState<File | null>(null);
  const [stnkFile, setStnkFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const simInputRef = useRef<HTMLInputElement>(null);
  const stnkInputRef = useRef<HTMLInputElement>(null);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleFileChange = (type: 'sim' | 'stnk') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${type.toUpperCase()} file size must be less than 5MB`, "error");
        if (type === 'sim') setSimFile(null);
        else setStnkFile(null);
      } else {
        if (type === 'sim') setSimFile(file);
        else setStnkFile(file);
      }
    }
  };

  const handleDrop = (type: 'sim' | 'stnk') => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`${type.toUpperCase()} file size must be less than 5MB`, "error");
        if (type === 'sim') setSimFile(null);
        else setStnkFile(null);
      } else {
        if (type === 'sim') setSimFile(file);
        else setStnkFile(file);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast("Full Name is required", "error");
      return;
    }
    if (!formData.email.includes("@")) {
      showToast("Invalid email format", "error");
      return;
    }
    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }
    if (!formData.plateNumber.trim()) {
      showToast("Plate number is required", "error");
      return;
    }
    if (!formData.coverageArea.trim()) {
      showToast("Coverage Area is required", "error");
      return;
    }
    if (!simFile) {
      showToast("Please upload your Driver License (SIM)", "error");
      return;
    }
    if (!stnkFile) {
      showToast("Please upload your Vehicle Registration (STNK)", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await registerCourier(formData, simFile, stnkFile);
      setUser(user, token);
      showToast("Registration successful!", "success");
      setTimeout(() => {
        router.push(`/${user.role}`);
      }, 1000);
    } catch (error: any) {
      const msg = error?.message || "";
      if (msg.includes("Silakan periksa kotak masuk email Anda")) {
        showToast("Akun Anda berhasil dibuat! Silakan periksa kotak masuk email Anda untuk melakukan konfirmasi sebelum masuk.", "success");
      } else {
        showToast(msg || "Registration failed. Please try again.", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] flex flex-col items-center justify-center p-6 relative py-12">
      <div className="text-center mb-8">
        <div className="inline-block bg-[#ecdcd4] text-[#8e6856] px-4 py-1.5 rounded-full mb-6 font-bold text-xs uppercase tracking-wider">
          JOIN OUR NETWORK
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Register as Courier
        </h1>
        <p className="text-gray-500 text-lg">
          Deliver food safely and earn while helping reduce waste
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 max-w-3xl w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Personal Information */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-700">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Julian Rivers"
                  className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  placeholder="julian@example.com"
                  className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>

          {/* Vehicle Information */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-700">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Vehicle Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Vehicle Type</label>
                <select
                  className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow appearance-none"
                  value={formData.vehicleType}
                  onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                  required
                >
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Vehicle Plate Number</label>
                <input
                  type="text"
                  placeholder="B 1234 XYZ"
                  className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                  value={formData.plateNumber}
                  onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                  required
                />
              </div>
            </div>
          </section>

          {/* Coverage Area */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-700">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Coverage Area</h2>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">City / Region</label>
              <input
                type="text"
                placeholder="e.g. North London, Islington"
                className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                value={formData.coverageArea}
                onChange={(e) => setFormData({ ...formData, coverageArea: e.target.value })}
                required
              />
            </div>
          </section>

          {/* Document Verification */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full text-green-700">
                <FileCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Document Verification</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SIM Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Driver License (SIM)</label>
                <div 
                  className="border-2 border-dashed rounded-xl p-6 text-center transition-colors border-green-200 bg-[#f9faf9] hover:bg-green-50 cursor-pointer"
                  onClick={() => simInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop('sim')}
                >
                  <input type="file" ref={simInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange('sim')} />
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-6 h-6 text-gray-500 mb-1" />
                    {simFile ? (
                      <p className="text-gray-800 font-semibold text-sm truncate w-full px-2">{simFile.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-800 font-semibold text-sm">Upload</p>
                        <p className="text-[10px] text-gray-500">PDF OR JPG (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* STNK Upload */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Vehicle Registration (STNK)</label>
                <div 
                  className="border-2 border-dashed rounded-xl p-6 text-center transition-colors border-green-200 bg-[#f9faf9] hover:bg-green-50 cursor-pointer"
                  onClick={() => stnkInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop('stnk')}
                >
                  <input type="file" ref={stnkInputRef} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange('stnk')} />
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-6 h-6 text-gray-500 mb-1" />
                    {stnkFile ? (
                      <p className="text-gray-800 font-semibold text-sm truncate w-full px-2">{stnkFile.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-800 font-semibold text-sm">Upload</p>
                        <p className="text-[10px] text-gray-500">PDF OR JPG (MAX. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="bg-[#eef5ef] border border-green-100 rounded-xl p-4 flex items-start space-x-3 mt-6">
            <Info className="w-5 h-5 text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Your account will be reviewed before activation. This process usually takes 1-2 business days.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg flex justify-center items-center disabled:opacity-70"
            >
              {isLoading ? "Submitting..." : <>Submit Registration <span className="ml-2">→</span></>}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account? <Link href="/login" className="text-green-700 font-bold hover:underline">Login</Link>
        </p>
      </div>

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${notification.type === 'success'
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]'
              : notification.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-950'
                : 'bg-blue-50/95 border-blue-200 text-blue-950'
            }`}>
            <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />
            <p className="text-sm font-bold text-gray-800">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
              type="button"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
