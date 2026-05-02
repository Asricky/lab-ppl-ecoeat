"use client";

import React, { useState, createContext, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface CourierContextType {
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
}

export const CourierContext = createContext<CourierContextType>({
  isOnline: false,
  setIsOnline: () => {},
});

export const useCourier = () => useContext(CourierContext);

export default function CourierLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(false);

  return (
    <CourierContext.Provider value={{ isOnline, setIsOnline }}>
      <div className="flex h-screen bg-ecoeat-bg overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
    </CourierContext.Provider>
  );
}
