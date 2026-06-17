"use client";

import React, { useState } from 'react';
import ReceiverNavbar from './ReceiverNavbar';
import ReceiverSidebar from './ReceiverSidebar';

export default function ReceiverLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-ecoeat-bg overflow-hidden">
      <ReceiverSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ReceiverNavbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto px-6 pt-2 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
}
