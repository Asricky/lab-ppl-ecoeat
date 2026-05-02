"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Sell/Donate split removed — commercial products start at /products/create */
export default function DecisionRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/seller/products/create');
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium">
      Mengalihkan…
    </div>
  );
}
