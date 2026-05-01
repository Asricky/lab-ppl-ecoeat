"use client";
import { useEffect, useState } from 'react';
import ProductCard from '@/components/buyer/ProductCard';

export default function SavedItemsPage() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedItems = async () => {
      try {
        const res = await fetch('/api/saved-items');
        const data = await res.json();
        setSavedItems(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedItems();

    // Auto-refresh interval for demonstration
    const intervalId = setInterval(fetchSavedItems, 2000);
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading saved items...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-10">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">YOUR FAVORITES</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Saved Items</h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#e1e8d5]">
          <p className="text-gray-500 mb-4">You haven't saved any items yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {savedItems.map((item: any) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}
