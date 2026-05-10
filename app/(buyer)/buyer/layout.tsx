"use client";

import { useCallback, useState } from "react";
import Sidebar from "@/components/buyer/Sidebar";
import Header from "@/components/buyer/Header";

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
