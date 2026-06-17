import React from 'react';
import ReceiverLayout from '@/components/ReceiverLayout';
import AuthGuard from '@/components/layout/AuthGuard';

export default function LksPantiLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard expectedRole="lks-panti">
      <ReceiverLayout>
        {children}
      </ReceiverLayout>
    </AuthGuard>
  );
}
