"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Heart, LayoutDashboard, Leaf, ShoppingBag, Truck, User, X } from "lucide-react";

type SidebarProps = {
  desktopCollapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export default function Sidebar({ desktopCollapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/buyer" },
    { name: "Explore", icon: ShoppingBag, path: "/buyer/explore" },
    { name: "Orders", icon: ClipboardList, path: "/buyer/orders" },
    { name: "Saved Items", icon: Heart, path: "/buyer/saved" },
    { name: "Tracking", icon: Truck, path: "/buyer/tracking" },
    { name: "Profile", icon: User, path: "/buyer/profile" },
  ];

  const rail = desktopCollapsed;

  return (
    <>
      {mobileOpen && (
        <div
          role="presentation"
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40 lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          "fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col shrink-0",
          "bg-[#eef3e8] border-r border-[#d4dec4]",
          "transition-[transform,width,padding] duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          rail ? "lg:w-[4.75rem] lg:px-0" : "lg:w-64",
          "w-64 max-lg:shadow-xl",
        ].join(" ")}
      >
        <div
          className={`p-4 flex justify-between items-center border-b border-[#d4dec4]/60 shrink-0 ${
            rail ? "lg:flex-col lg:gap-4 lg:border-0 lg:py-6" : ""
          }`}
        >
          <Link
            href="/buyer"
            className={`flex items-center gap-2 text-green-800 font-extrabold tracking-tight ${
              rail ? "lg:flex-col lg:justify-center w-full lg:gap-1" : ""
            }`}
            title="EcoEat"
          >
            {rail ? (
              <Leaf className="w-10 h-10 text-green-600 shrink-0" strokeWidth={2} />
            ) : (
              <>
                <Leaf className="w-8 h-8 text-green-600 shrink-0" strokeWidth={2} />
                <div className="flex flex-col min-w-0">
                  <span className="text-lg leading-none">EcoEat</span>
                  <span className="text-[10px] font-medium text-gray-500 mt-0.5 truncate">Buyer</span>
                </div>
              </>
            )}
          </Link>
          <button
            type="button"
            className="lg:hidden text-gray-600 hover:text-green-700 p-1 rounded-lg hover:bg-white/60"
            onClick={onCloseMobile}
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className={`flex-1 overflow-y-auto py-3 px-2 space-y-1 ${rail ? "lg:px-1.5 lg:py-4" : "px-2"}`}>
          {links.map((link) => {
            const active =
              link.path === "/buyer"
                ? pathname === "/buyer"
                : pathname === link.path || pathname.startsWith(`${link.path}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                href={link.path}
                title={rail ? link.name : undefined}
                onClick={() => onCloseMobile()}
                className={[
                  "flex items-center rounded-xl transition-all duration-200",
                  rail ? "justify-center lg:px-2 lg:py-3" : "space-x-3 px-4 py-3",
                  active
                    ? "bg-green-800 text-white font-bold shadow-md"
                    : "text-gray-600 hover:bg-white/70 hover:text-green-900 font-semibold",
                ].join(" ")}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? "text-white" : ""}`} />
                {!rail && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
