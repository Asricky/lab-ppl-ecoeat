'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy `/seller/seller-entry` → `/seller/entry`. */
export default function SellerEntryLegacyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/seller/entry');
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium">
      Mengalihkan…
    </div>
  );
}
