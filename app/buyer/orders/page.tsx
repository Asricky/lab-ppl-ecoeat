"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Leaf, Star, Truck } from "lucide-react";
import { useReviewStore } from "@/store/reviewStore";
import { useAuthStore } from "@/store/authStore";
import RefundRequestButton from "@/components/buyer/RefundRequestButton";
import { formatDisplayLineTotal, useBuyerOrdersStore } from "@/store/buyerOrdersStore";

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<
    "Active Orders" | "Completed" | "Cancelled" | "Refunded"
  >("Active Orders");
  const tabs = ["Active Orders", "Completed", "Cancelled", "Refunded"] as const;

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState({ id: "", name: "" });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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
    if (!comment) return alert("Komentar tidak boleh kosong!");
    addReview({
      productId: reviewProduct.id,
      userName: user?.name || "Anonymous User",
      rating,
      comment,
    });
    alert("Ulasan berhasil disimpan!");
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

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
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

          {activeTab === "Refunded" && (
            <div className="bg-[#eef3e8] border border-[#d4dec4] rounded-2xl p-4 flex items-start space-x-3 mb-4 shadow-sm">
              <div className="w-5 h-5 rounded-full border-2 border-green-700 flex items-center justify-center text-green-700 text-[10px] font-bold mt-0.5 shrink-0">
                i
              </div>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                Refund akan diproses otomatis jika gagal kirim atau ajukan secara manual untuk pesanan eligible.
              </p>
            </div>
          )}

          {activeTab === "Refunded" &&
            filtered.map((order) => {
              const first = order.lines[0];
              if (!first) return null;
              const total = formatDisplayLineTotal(order);
              if (order.refundEligible) {
                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-6"
                  >
                    <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-[#f4f7ed] shrink-0 border border-[#e1e8d5]">
                      <img src={first.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 w-full flex flex-col h-full min-w-0">
                      <div className="flex justify-between items-start mb-3 gap-4 flex-wrap">
                        <span className="bg-red-50 text-red-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-red-200 flex items-center shadow-sm">
                          <AlertCircle className="w-3 h-3 mr-1 shrink-0" /> ITEM NOT DELIVERED
                        </span>
                        <span className="font-extrabold text-gray-900 text-xl">{formatRp(total)}</span>
                      </div>
                      <h3 className="font-extrabold text-gray-900 text-2xl mb-1">{first.name}</h3>
                      <p className="text-xs text-gray-500 font-medium mb-4">
                        Order #{order.id} • {order.orderedAtLabel}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 w-full mt-auto flex-wrap">
                        <RefundRequestButton
                          orderId={order.id}
                          refundAmountDisplay={order.refundAmountDisplay ?? total}
                          className="flex-1 bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-md"
                        />
                        <Link
                          href={`/buyer/orders/${order.id}`}
                          className="flex-1 text-center sm:min-w-[140px] bg-[#eef3e8] text-green-800 font-bold px-6 py-3 rounded-xl text-sm border border-[#d4dec4] hover:bg-[#e1e8d5]"
                        >
                          Order Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={order.id}
                  className="bg-[#f4f7ed] rounded-3xl p-6 border border-[#d4dec4] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative mb-6"
                >
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                      <span className="bg-[#e1e8d5] text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#c3d1b0] flex items-center shadow-sm">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        REFUND COMPLETED
                      </span>
                      <span className="text-green-700 font-extrabold text-lg">
                        +
                        {formatRp(
                          order.refundAmountDisplay != null ? order.refundAmountDisplay : total,
                        )}
                      </span>
                    </div>
                    <div className="w-full h-40 rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-[#e1e8d5]">
                      <img src={first.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-xl mb-1">{first.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-4">
                      Order #{order.id} • {order.orderedAtLabel}
                    </p>
                    <p className="text-xs text-gray-500 italic font-medium pt-4 border-t border-[#d4dec4]">
                      Dana dikembalikan ke EcoPay Anda
                    </p>
                    <Link
                      href={`/buyer/orders/${order.id}`}
                      className="mt-4 inline-flex w-full justify-center rounded-xl bg-white border-2 border-[#388e3c] text-green-800 font-bold py-2.5 text-sm hover:bg-green-50 transition-colors"
                    >
                      View Detail
                    </Link>
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

          {activeTab === "Cancelled" &&
            filtered.map((order) => {
              const first = order.lines[0];
              if (!first) return null;
              const total = formatDisplayLineTotal(order);
              return (
                <div
                  key={order.id}
                  className="bg-[#f4f7ed] rounded-3xl p-6 border border-[#d4dec4] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative"
                >
                  <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 shrink-0 grayscale">
                    <img src={first.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full min-w-0">
                    <div className="flex items-center space-x-3 mb-3 flex-wrap gap-2">
                      <span className="bg-[#e1e8d5] text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#c3d1b0] shadow-sm uppercase">
                        {order.statusLabel}
                      </span>
                      <span className="text-[10px] text-gray-500 font-extrabold uppercase">{order.orderedAtLabel}</span>
                    </div>
                    <h3 className="font-extrabold text-gray-900 text-xl mb-1">{first.name}</h3>
                    <p className="font-extrabold text-gray-500 mb-4">{formatRp(total)}</p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                      <Link
                        href={`/buyer/orders/${order.id}`}
                        className="inline-block bg-white text-green-800 font-bold px-5 py-2.5 rounded-xl text-sm border border-[#d4dec4] hover:bg-[#eef3e8]"
                      >
                        View Detail
                      </Link>
                      {order.refundEligible && (
                        <RefundRequestButton
                          orderId={order.id}
                          refundAmountDisplay={order.refundAmountDisplay ?? total}
                          className="bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

          {filtered.length === 0 && activeTab !== "Refunded" && (
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
    </div>
  );
}
