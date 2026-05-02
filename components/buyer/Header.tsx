"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Bell, Menu, Search, ShoppingCart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useEcoPayStore } from "@/store/ecoPayStore";
import { useNotificationStore } from "@/store/notificationStore";

function HeaderShell({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  return (
    <header className="bg-[#f4f7ed] sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center gap-4 border-b border-[#e1e8d5]">
      <button
        type="button"
        onClick={onMenuClick}
        className="shrink-0 text-gray-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-white/80 border border-transparent hover:border-[#d4dec4]"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      <div className="hidden sm:flex flex-1 justify-start min-w-0">
        <div className="w-full max-w-xl h-11 rounded-xl bg-[#eef3e8] border border-[#d4dec4]/80 animate-pulse" aria-hidden />
      </div>
    </header>
  );
}

function HeaderWithSearch({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const balance = useEcoPayStore((s) => s.balance);

  const notifItems = useNotificationStore((s) => s.items);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [notifOpen, setNotifOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [searchDraft, setSearchDraft] = useState("");
  const isBuyerDashboard = pathname === "/buyer";

  const qp = searchParams.get("q")?.trim() ?? "";
  useEffect(() => {
    if (isBuyerDashboard) setSearchDraft(qp);
    else setSearchDraft("");
  }, [isBuyerDashboard, qp]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!isBuyerDashboard) return;
      const next = searchDraft.trim();
      if (next === qp) return;
      router.replace(next ? `/buyer?q=${encodeURIComponent(next)}` : "/buyer");
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchDraft, isBuyerDashboard, qp, router]);

  const unreadCount = useMemo(() => notifItems.filter((n) => !n.read).length, [notifItems]);

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, []);

  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const formatRp = (amount: number) => {
    return "Rp" + amount.toLocaleString("id-ID");
  };

  const badgeForKind = (kind: string) => {
    if (kind === "order") return "Order";
    if (kind === "review") return "Review";
    return "Seller";
  };

  const submitSearchAway = () => {
    const next = searchDraft.trim();
    if (!next) {
      router.push("/buyer");
      return;
    }
    router.push(`/buyer?q=${encodeURIComponent(next)}`);
  };

  return (
    <header className="bg-[#f4f7ed] sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center gap-3 sm:gap-5 border-b border-[#e1e8d5]">
      <button
        type="button"
        onClick={onMenuClick}
        className="shrink-0 text-gray-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-white/80 border border-transparent hover:border-[#d4dec4] transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      <form
        className="flex-1 flex justify-start min-w-0"
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submitSearchAway();
        }}
      >
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-green-700/70 pointer-events-none" />
          <input
            type="search"
            value={searchDraft}
            placeholder="Search food"
            aria-label="Search surplus food"
            onChange={(e) => setSearchDraft(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border border-[#d4dec4] bg-white/90 text-gray-900 text-sm font-semibold placeholder:text-gray-400 shadow-sm outline-none focus:ring-2 focus:ring-green-700/30 focus:border-green-700 transition-shadow"
          />
        </div>
      </form>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <Link
          href="/buyer/profile?tab=ecopay"
          className="flex items-center bg-white px-2 sm:px-4 py-1.5 rounded-full shadow-sm border border-[#e1e8d5] hover:bg-green-50 transition-colors cursor-pointer max-w-[9rem] sm:max-w-none"
        >
          <span className="text-xs font-bold text-gray-500 mr-2 uppercase tracking-wider hidden sm:block truncate">EcoPay</span>
          <span className="text-xs sm:text-sm font-extrabold text-green-700 truncate">{formatRp(balance)}</span>
        </Link>

        <div className="relative" ref={panelRef}>
          <button
            type="button"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((o) => !o)}
            className="relative text-gray-500 hover:text-green-700 transition-colors p-1 rounded-lg hover:bg-white/80"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-[10px] font-extrabold text-white flex items-center justify-center border-2 border-[#f4f7ed]">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[min(calc(100vw-3rem),20rem)] max-h-[min(70vh,24rem)] overflow-y-auto rounded-2xl border border-[#d4dec4] bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-[#eef3e8] px-4 py-3 sticky top-0 bg-white rounded-t-2xl">
                <span className="text-sm font-extrabold text-gray-900">Notifications</span>
                <button type="button" onClick={() => markAllRead()} className="text-[11px] font-bold text-green-800 hover:underline">
                  Mark all read
                </button>
              </div>
              <ul className="py-2">
                {notifItems.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        markRead(n.id);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-[#f4f7ed] transition-colors border-l-4 ${
                        n.read ? "border-transparent opacity-85" : "border-red-500 bg-green-50/40"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wide text-green-900/70">{badgeForKind(n.kind)}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />}
                      </div>
                      <p className="text-sm font-extrabold text-gray-900 leading-snug">{n.title}</p>
                      <p className="text-xs text-gray-600 font-medium mt-1 leading-relaxed">{n.body}</p>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="border-t border-[#eef3e8] px-4 py-2 text-[10px] text-gray-500 font-medium">
                Order updates, review reminders & seller picks
              </div>
            </div>
          )}
        </div>

        <Link href="/buyer/cart" className="relative text-gray-500 hover:text-green-700 transition-colors p-1 rounded-lg hover:bg-white/80">
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f4f7ed]">
              {cartItemCount}
            </span>
          )}
        </Link>
        <Link href="/buyer/profile" className="hidden sm:flex items-center space-x-2 pl-3 sm:pl-5 border-l border-[#d4dec4] hover:opacity-80 transition-opacity">
          <span className="text-sm font-bold text-green-900 max-w-[96px] truncate">{user?.name || "Guest"}</span>
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-[#e1e8d5]">
            <UserIcon className="w-5 h-5 text-gray-600" />
          </div>
        </Link>
      </div>
    </header>
  );
}

export default function Header(props: { onMenuClick: () => void }) {
  return (
    <Suspense fallback={<HeaderShell onMenuClick={props.onMenuClick} />}>
      <HeaderWithSearch onMenuClick={props.onMenuClick} />
    </Suspense>
  );
}
