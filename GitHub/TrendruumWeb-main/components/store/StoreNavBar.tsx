"use client";
import React, { useState } from 'react';

interface StoreNavBarProps {
  onTabChange?: (tabId: string) => void;
  activeTab?: string;
}

const StoreNavBar = ({ onTabChange, activeTab: externalActiveTab }: StoreNavBarProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState('home');
  
  const activeTab = externalActiveTab || internalActiveTab;

  const tabs = [
    { id: 'home', name: 'Ana Sayfa' },
    { id: 'all-products', name: 'Tüm Ürünler' }
  ];

  const handleTabClick = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };


  return (
    <div className="w-full bg-white border-t border-gray-200 md:border-t-0">
      <div className="w-full max-w-none mx-auto px-0">
        {/* Mobil: Alt navigasyon çubuğu - görseldeki gibi */}
        <div className="block sm:hidden pb-0 mb-4">
          <div className="flex items-center justify-around border-t border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex-1 py-3 text-xs font-medium transition-all touch-manipulation active:scale-95 relative ${
                  activeTab === tab.id 
                    ? 'text-orange-500' 
                    : 'text-gray-600'
                }`}
              >
                {tab.name}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </button>
            ))}
          </div>
          </div>

        {/* Desktop: Üst navigasyon */}
        <div className="hidden sm:block">
          <div className="w-full max-w-none mx-auto px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-0 sm:py-0">
              {/* Sol: Tab Navigation */}
              <div className="flex gap-6 sm:gap-8 overflow-x-auto pb-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`text-base md:text-lg font-bold pb-2 transition-all whitespace-nowrap flex-shrink-0 touch-manipulation active:scale-95 ${
                      activeTab === tab.id 
                        ? 'text-orange-500' 
                        : 'text-gray-600 hover:text-orange-500'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreNavBar;
