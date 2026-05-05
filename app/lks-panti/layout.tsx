import React from 'react';
import ReceiverLayout from '@/components/kurir/ReceiverLayout';

export default function LksPantiLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReceiverLayout>
      {children}
    </ReceiverLayout>
  );
}
