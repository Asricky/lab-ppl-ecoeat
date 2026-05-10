"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { ShoppingBasket, Store, Truck, CheckCircle2, Building2 } from "lucide-react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { selectedRole, setSelectedRole } = useAuthStore();

  const handleContinue = () => {
    if (!selectedRole) return;
    router.push(`/register/${selectedRole}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f4] flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
            Getting Started
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create Your Account
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Choose your role to get started with our sustainable food ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Buyer Card */}
          <div
            onClick={() => setSelectedRole("buyer")}
            className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === "buyer"
                ? "border-green-500 shadow-xl shadow-green-900/5 transform scale-[1.02]"
                : "border-transparent shadow-sm hover:shadow-md"
            }`}
          >
            {selectedRole === "buyer" && (
              <CheckCircle2 className="absolute top-4 right-4 text-green-600 fill-green-100 w-6 h-6" />
            )}
            <div className="bg-green-100 text-green-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Buyer</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Buy surplus food at lower prices and help reduce local environmental impact.
            </p>
          </div>

          {/* Seller Card */}
          <div
            onClick={() => setSelectedRole("seller")}
            className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === "seller"
                ? "border-green-500 shadow-xl shadow-green-900/5 transform scale-[1.02]"
                : "border-transparent shadow-sm hover:shadow-md"
            }`}
          >
            {selectedRole === "seller" && (
              <CheckCircle2 className="absolute top-4 right-4 text-green-600 fill-green-100 w-6 h-6" />
            )}
            <div className="bg-gray-100 text-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Store className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Seller</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sell or donate surplus food from your business to reach new customers and reduce waste.
            </p>
          </div>

          {/* Courier (kurir) Card */}
          <div
            onClick={() => setSelectedRole('kurir')}
            className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === 'kurir'
                ? "border-green-500 shadow-xl shadow-green-900/5 transform scale-[1.02]"
                : "border-transparent shadow-sm hover:shadow-md"
            }`}
          >
            {selectedRole === 'kurir' && (
              <CheckCircle2 className="absolute top-4 right-4 text-green-600 fill-green-100 w-6 h-6" />
            )}
            <div className="bg-gray-100 text-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Courier</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Deliver food to buyers and organizations. Join our flexible network of green logistics.
            </p>
          </div>

          {/* LKS Panti Card */}
          <div
            onClick={() => setSelectedRole('lks-panti')}
            className={`relative bg-white rounded-2xl p-8 cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === 'lks-panti'
                ? "border-green-500 shadow-xl shadow-green-900/5 transform scale-[1.02]"
                : "border-transparent shadow-sm hover:shadow-md"
            }`}
          >
            {selectedRole === 'lks-panti' && (
              <CheckCircle2 className="absolute top-4 right-4 text-green-600 fill-green-100 w-6 h-6" />
            )}
            <div className="bg-gray-100 text-gray-700 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">LKS / Panti Sosial</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Register your organization to receive surplus food donations from businesses.
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`px-12 py-4 rounded-xl font-bold text-lg transition-all ${
              selectedRole
                ? "bg-[#388e3c] hover:bg-[#2e7d32] text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>

          <p className="mt-8 text-gray-600 font-medium text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-green-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
