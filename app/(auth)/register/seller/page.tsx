"use client";

import Link from "next/link";
import { Upload, ShieldCheck, CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authHandler } from "@/lib/auth-handler";

export default function RegisterSellerPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    password: "",
  });
  
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        setFile(null);
      } else {
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 5 * 1024 * 1024) {
        showToast("File size must be less than 5MB", "error");
        setFile(null);
      } else {
        setFile(droppedFile);
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
    if (!formData.businessName.trim()) {
      showToast("Business Name is required", "error");
      return;
    }
    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    if (!file) {
      showToast("Please upload your NIB / Operating License", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await authHandler.register(formData, "seller");
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
                className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
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
                className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
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
              disabled={isLoading}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg disabled:opacity-70"
            >
              {isLoading ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </form>
      </div>

      <p className="mt-8 text-center text-sm text-gray-500 max-w-md">
        By registering, you agree to our <Link href="#" className="underline hover:text-gray-800">Terms of Service</Link> and <Link href="#" className="underline hover:text-gray-800">Environmental Commitment Policy</Link>.
      </p>

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${notification.type === 'success'
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]'
              : notification.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-950'
                : 'bg-blue-50/95 border-blue-200 text-blue-950'
            }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <p className="text-sm font-bold">{notification.message}</p>
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
