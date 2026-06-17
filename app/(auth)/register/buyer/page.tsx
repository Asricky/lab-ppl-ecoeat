"use client";

import Link from "next/link";
import { Leaf, CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { registerBuyer } from "@/lib/buyer-registration";

export default function RegisterBuyerPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

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
    if (!formData.terms) {
      showToast("You must accept the terms", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { user, token } = await registerBuyer(formData);
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
    <div className="min-h-screen bg-[#f5f7f4] flex items-center justify-center p-6 relative">
      <div className="bg-white rounded-3xl p-10 md:p-12 max-w-xl w-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-10">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.15em] mb-3">
          Join the Movement
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Create Buyer Account
        </h1>
        <p className="text-gray-500 mb-8">
          Access fresh food surplus and join a community dedicated to zero-waste living.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              placeholder="E.g. Julian Rivers"
              className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="julian@example.com"
              className="w-full bg-[#eef1ed] border-transparent rounded-lg px-4 py-3.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
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

          <div className="flex items-start pt-2">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 text-green-600 bg-[#eef1ed] border-transparent rounded focus:ring-green-500"
              checked={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
              I agree to the <span className="font-bold text-green-700">Terms of Service</span> and <span className="font-bold text-green-700">Privacy Policy</span>.
            </label>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 font-medium">
          Already have an account? <Link href="/login" className="text-green-700 font-bold hover:underline">Login</Link>
        </p>
      </div>

      {/* Live Impact Widget */}
      <div className="hidden md:flex absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-4 items-center space-x-4 border border-green-100 z-20">
        <div className="bg-green-100 rounded-full p-2.5 text-green-600">
          <Leaf className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-bold text-green-800 tracking-wider">LIVE IMPACT</p>
          <p className="text-gray-900 font-bold"><span className="text-xl">1,420kg CO2</span> saved today</p>
        </div>
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
