"use client";

import React, { useState, useEffect } from 'react';
import { Star, Filter, MessageSquare, ThumbsUp, MoreHorizontal, CheckCircle2, ArrowLeft, AlertCircle, X, Info } from 'lucide-react';

// Dummy Review Data
const REVIEWS = [
  {
    id: 1,
    buyer: "Sarah J.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    date: "2 hours ago",
    rating: 5,
    product: "Nasi Goreng Spesial",
    type: "Sale",
    comment: "Absolutely delicious and great portion size! The food was still warm when I picked it up. Very happy to help reduce food waste while getting such a great meal.",
    replied: false
  },
  {
    id: 2,
    buyer: "Michael T.",
    avatar: "https://i.pravatar.cc/150?u=michael",
    date: "1 day ago",
    rating: 4,
    product: "Roti Gandum (Sisa)",
    type: "Sale",
    comment: "Bread was slightly hard on the edges but still perfectly fine for toast. For the discounted price, it's a steal. Will buy again.",
    replied: true,
    sellerReply: "Hi Michael, thank you for the feedback! We recommend popping it in the microwave for 15 seconds with a damp paper towel to soften it up. See you next time!"
  },
  {
    id: 3,
    buyer: "Panti Asuhan Kasih",
    avatar: "https://i.pravatar.cc/150?u=panti",
    date: "3 days ago",
    rating: 5,
    product: "Sayur Sop Ayam (20 Porsi)",
    type: "Donation",
    comment: "Terima kasih banyak atas donasinya! Anak-anak sangat menikmati sayur sopnya. Makanannya masih sangat layak dan bergizi. Semoga berkah selalu.",
    replied: false
  }
];

export default function ReviewsPage() {
  const [filter, setFilter] = useState('All');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

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

  const handleReplySubmit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    showToast(`Reply submitted for review #${id}: ${replyText}`, "success");
    setReplyingTo(null);
    setReplyText('');
  };

  const filteredReviews = filter === 'All' 
    ? REVIEWS 
    : filter === 'Donation' 
      ? REVIEWS.filter(r => r.type === 'Donation')
      : REVIEWS.filter(r => r.rating === parseInt(filter[0]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Feedback</h1>
        <p className="text-sm font-medium text-gray-500">Manage your ratings, read reviews, and build trust with your community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Overall Rating */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Overall Rating</h2>
            <div className="flex justify-center items-end space-x-2 mb-2">
              <span className="text-6xl font-extrabold text-gray-900 leading-none">4.8</span>
              <span className="text-xl font-bold text-gray-400 mb-1">/ 5</span>
            </div>
            <div className="flex justify-center space-x-1 mb-4 text-amber-400">
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" />
              <Star size={24} fill="currentColor" className="text-amber-200" /> {/* Simulate 4.8 */}
            </div>
            <p className="text-sm font-medium text-gray-500 mb-8">Based on 124 reviews</p>

            <div className="space-y-3">
              {[
                { stars: 5, pct: 85 },
                { stars: 4, pct: 10 },
                { stars: 3, pct: 3 },
                { stars: 2, pct: 1 },
                { stars: 1, pct: 1 },
              ].map((row) => (
                <div key={row.stars} className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center w-12 shrink-0">
                    <span className="font-bold text-gray-700 mr-1">{row.stars}</span>
                    <Star size={12} className="text-gray-400" fill="currentColor" />
                  </div>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }}></div>
                  </div>
                  <div className="w-8 text-right font-medium text-gray-500">{row.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1A5632] to-[#0F351F] rounded-3xl p-6 text-white shadow-sm border border-[#144226]">
            <h3 className="font-bold text-lg mb-2">Why Reviews Matter</h3>
            <p className="text-sm text-gray-300 font-medium leading-relaxed mb-4">
              Sellers with an average rating above 4.5 see a 60% increase in profile visibility and food rescue rates.
            </p>
            <div className="flex items-center space-x-2 text-sm font-bold text-[#A3D9B5]">
              <CheckCircle2 size={16} />
              <span>You are a Top Rated Seller!</span>
            </div>
          </div>
        </div>

        {/* Right Column: Review List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', '5 Stars', '4 Stars', 'Donation'].map((f) => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors shadow-sm border ${
                  filter === f 
                    ? 'bg-[#1A5632] text-white border-[#1A5632]' 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Reviews */}
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={review.avatar} alt={review.buyer} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{review.buyer}</h4>
                      <p className="text-xs font-medium text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                      review.type === 'Donation' ? 'bg-[#E8F3EB] text-[#1A5632]' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {review.type}
                    </span>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex space-x-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className={i < review.rating ? '' : 'text-gray-200'} />
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100 inline-block">
                  <p className="text-xs font-bold text-gray-600">Product: <span className="text-gray-900">{review.product}</span></p>
                </div>

                <p className="text-gray-700 font-medium text-sm leading-relaxed mb-4">
                  "{review.comment}"
                </p>

                {/* Seller Reply Section */}
                {review.replied ? (
                  <div className="ml-8 bg-[#F3F8F2] rounded-2xl p-4 border border-[#D1E8D7] relative">
                    <div className="absolute -left-3 top-4 w-3 h-px bg-[#D1E8D7]"></div>
                    <div className="absolute -left-3 top-0 bottom-0 w-px bg-[#D1E8D7]"></div>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="bg-[#1A5632] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Seller Reply</div>
                    </div>
                    <p className="text-sm font-medium text-[#1A5632] leading-relaxed">
                      {review.sellerReply}
                    </p>
                  </div>
                ) : replyingTo === review.id ? (
                  <div className="ml-8 mt-4 relative">
                     <div className="absolute -left-3 top-0 bottom-0 w-px bg-gray-200"></div>
                     <form onSubmit={(e) => handleReplySubmit(e, review.id)}>
                        <textarea 
                          className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[#1A5632] focus:border-transparent outline-none resize-none bg-gray-50"
                          rows={3}
                          placeholder="Write a public reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          autoFocus
                        ></textarea>
                        <div className="flex justify-end space-x-2 mt-2">
                          <button type="button" onClick={() => setReplyingTo(null)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancel</button>
                          <button type="submit" className="bg-[#1A5632] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#0F351F] shadow-sm">Post Reply</button>
                        </div>
                     </form>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center space-x-1.5 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">
                      <ThumbsUp size={16} />
                      <span>Helpful</span>
                    </button>
                    <button 
                      onClick={() => { setReplyingTo(review.id); setReplyText(''); }}
                      className="flex items-center space-x-1.5 text-sm font-bold text-gray-500 hover:text-[#1A5632] transition-colors"
                    >
                      <MessageSquare size={16} />
                      <span>Reply to Buyer</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            {filteredReviews.length === 0 && (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center">
                <Star size={40} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">No reviews found</h3>
                <p className="text-sm font-medium text-gray-500">Try changing your filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]' 
              : notification.type === 'error'
              ? 'bg-red-50/95 border-red-200 text-red-955'
              : 'bg-blue-50/95 border-blue-200 text-blue-955'
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
