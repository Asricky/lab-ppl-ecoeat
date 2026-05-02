'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Legacy wizard step — bookmarks resolve to canonical seller entry flow. */
export default function DecisionRedirectPage() {
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
