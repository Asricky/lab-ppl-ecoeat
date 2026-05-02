"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Harga kini digabung di /products/create — pertahankan route untuk bookmark lama. */
export default function PricingRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/seller/products/create');
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium">
      Mengalihkan ke form produk…
    </div>
  );
}
