import React from 'react';
import ReceiverLayout from '@/app/components/ReceiverLayout';

export default function LksPantiLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReceiverLayout>
      {children}
    </ReceiverLayout>
  );
}
