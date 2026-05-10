'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Pricing is collected in `/seller/products/create` — keep route for old links. */
export default function PricingRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/seller/products/create');
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium">
      Mengalihkan ke form produk…
    </div>
  );
}
