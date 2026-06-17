"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { AlertCircle, Leaf, Star, Truck, CheckCircle2, X, Info } from "lucide-react";
import { useReviewStore } from "@/store/reviewStore";
import { useAuthStore } from "@/store/authStore";
import { formatDisplayLineTotal, useBuyerOrdersStore } from "@/store/buyerOrdersStore";

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<
    "Active Orders" | "Completed"
  >("Active Orders");
  const tabs = ["Active Orders", "Completed"] as const;

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState({ id: "", name: "" });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const addReview = useReviewStore((s) => s.addReview);
  const user = useAuthStore((s) => s.user);
  const orders = useBuyerOrdersStore((s) => s.orders);

  const openReviewModal = (id: string, name: string) => {
    setReviewProduct({ id, name });
    setRating(5);
    setComment("");
    setIsReviewOpen(true);
  };

  const submitReview = () => {
    if (!comment) return showToast("Komentar tidak boleh kosong!", "error");
    addReview({
      productId: reviewProduct.id,
      userName: user?.name || "Anonymous User",
      rating,
      comment,
    });
    showToast("Ulasan berhasil disimpan!", "success");
    setIsReviewOpen(false);
  };

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount * 10000);
  };

  const filtered = orders.filter((o) => o.tab === activeTab);

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">ACCOUNT ACTIVITY</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Order History</h1>
        </div>

        <div className="bg-[#eef3e8] rounded-2xl p-4 flex items-center space-x-4 border border-[#d4dec4]">
          <div className="bg-green-700 p-2.5 rounded-xl text-white shadow-sm">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">IMPACT SCORE</p>
            <p className="font-extrabold text-gray-900 text-sm mt-0.5">12.4kg of food waste saved</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${
              activeTab === tab ? "bg-[#388e3c] text-white shadow-md" : "bg-[#eef3e8] text-gray-600 hover:bg-[#d4dec4]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "Active Orders" &&
            filtered.map((order) => {
              const first = order.lines[0];
              if (!first) return null;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative"
                >
                  <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-[#f4f7ed] shrink-0 border border-[#e1e8d5]">
                    <img src={first.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                      <span className="bg-[#eef3e8] text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#d4dec4] flex items-center">
                        <Truck className="w-3 h-3 mr-1" /> {order.statusLabel}
                      </span>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase">{order.orderedAtLabel}</span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-2xl mb-1">{first.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-6">Order #{order.id}</p>
                    <div className="flex items-center justify-between w-full flex-wrap gap-3">
                      <span className="font-extrabold text-gray-900 text-xl">{formatRp(formatDisplayLineTotal(order))}</span>
                      <div className="flex space-x-3">
                        <Link
                          href={`/buyer/orders/${order.id}`}
                          className="bg-[#eef3e8] text-green-800 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm border border-[#d4dec4] hover:bg-[#e1e8d5]"
                        >
                          View Detail
                        </Link>
                        <Link
                          href="/buyer/tracking"
                          className="bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md"
                        >
                          Track Order
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {activeTab === "Completed" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((order) => {
                const first = order.lines[0];
                if (!first) return null;
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <img
                        src={first.image}
                        alt=""
                        className="w-24 h-24 rounded-2xl object-cover border border-[#e1e8d5]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                          <h4 className="font-extrabold text-gray-900 text-sm">{first.name}</h4>
                          <span className="bg-[#e1e8d5] text-gray-600 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                            Processed
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-3 font-medium">
                          Quantity: {first.quantity} {first.quantity === 1 ? "unit" : "units"}
                        </p>
                        <p className="text-green-700 font-extrabold text-base">{formatRp(formatDisplayLineTotal(order))}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/buyer/orders/${order.id}`}
                        className="w-full text-center bg-[#eef3e8] text-green-800 font-bold py-2.5 rounded-xl text-sm border border-[#d4dec4] hover:bg-[#e1e8d5] transition-colors"
                      >
                        View Detail
                      </Link>
                      <button
                        type="button"
                        onClick={() => openReviewModal(first.productId, first.name)}
                        className="w-full bg-white border-2 border-green-700 text-green-700 font-bold py-2 rounded-xl text-sm hover:bg-green-50 transition-colors"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-gray-500 font-medium py-12 text-center">Tidak ada pesanan di tab ini.</p>
          )}
        </div>

        <div className="w-full">
          <div className="bg-gradient-to-br from-[#eef3e8] to-[#e1e8d5] rounded-3xl p-10 border border-[#d4dec4] flex flex-col items-center text-center shadow-sm">
            <Leaf className="w-14 h-14 text-green-800 mb-5 drop-shadow-sm" />
            <h3 className="font-extrabold text-gray-900 text-2xl mb-3">Impact Summary</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-8">
              By choosing surplus boxes, you&apos;ve diverted <span className="font-extrabold text-green-800">12kg</span>{" "}
              of food from waste this month.
            </p>
            <div className="w-full bg-[#d4dec4] rounded-full h-2.5 mb-3 shadow-inner overflow-hidden">
              <div className="bg-green-700 h-2.5 rounded-full" style={{ width: "75%" }} />
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">75% OF MONTHLY GOAL</p>
          </div>
        </div>
      </div>

      {isReviewOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsReviewOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Leave a Review</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">
              How was the <span className="text-green-700 font-bold">{reviewProduct.name}</span>?
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none transform transition hover:scale-110">
                  <Star className={`w-10 h-10 ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full bg-[#f4f7ed] border border-[#d4dec4] rounded-2xl p-4 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-green-600 mb-6 min-h-[120px]"
            />

            <button
              type="button"
              onClick={submitReview}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}

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
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
