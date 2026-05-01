"use client";

import { useAuthStore } from "@/store/authStore";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <p className="text-lg">Welcome, <strong>{user?.name}</strong>!</p>
        <p className="text-gray-600">Role: {user?.role}</p>
        <p className="text-gray-600 mt-4">EcoPay Balance: Rp {(user?.ecoPayBalance || 0).toLocaleString()}</p>
      </div>
    </div>
  );
}
