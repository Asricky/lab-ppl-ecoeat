"use client";

import { useCallback, useState, useEffect } from "react";
import Sidebar from "@/components/buyer/Sidebar";
import Header from "@/components/buyer/Header";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // 1. Cek Zustand store
    if (user && user.role === "buyer") {
      setAuthorized(true);
      return;
    }

    // 2. Cek localStorage
    const localUserStr = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (localUserStr && isLoggedIn) {
      try {
        const localUser = JSON.parse(localUserStr);
        if (localUser.role === "buyer") {
          // Sinkronkan ke Zustand agar tidak kosong
          setUser({
            id: localUser.id,
            name: localUser.full_name || localUser.name || "User",
            email: localUser.email,
            role: localUser.role,
            ecoPayBalance: localUser.ecoPayBalance || 0,
          }, "mock-token-from-supabase");

          setAuthorized(true);
          return;
        }
      } catch (e) {
        console.error("Gagal memproses session user dari localStorage:", e);
      }
    }

    // 3. Jika tidak ketemu data session, redirect ke /login
    // NOTE: Sesuai instruksi untuk kebutuhan testing, kita comment out redirect-nya sementara
    // router.push("/login");
    
    // Tetap setAuthorized(true) untuk testing agar halaman tidak nge-blank/stuck checking authorization
    setAuthorized(true);
  }, [user, setUser, router]);

  const toggleSidebar = useCallback(() => {
    const isNarrow =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 1023px)").matches;
    if (isNarrow) {
      setMobileSidebarOpen((o) => !o);
    } else {
      setDesktopCollapsed((c) => !c);
    }
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#f4f7ed] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7ed] text-gray-900 flex">
      <Sidebar
        desktopCollapsed={desktopCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 max-w-[100vw]">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
