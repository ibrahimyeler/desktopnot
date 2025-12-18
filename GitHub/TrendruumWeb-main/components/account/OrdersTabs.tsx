"use client";

import { useState } from 'react';

interface OrdersTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filterCounts: {
    all: number;
    ongoing: number;
    returns: number;
    cancelled: number;
  };
}

const OrdersTabs = ({ activeTab, onTabChange, filterCounts }: OrdersTabsProps) => {
  const tabs = [
    { id: 'all', name: 'Tümü', count: filterCounts.all },
    { id: 'ongoing', name: 'Devam Eden Siparişler', count: filterCounts.ongoing },
    { id: 'returns', name: 'İadeler', count: filterCounts.returns },
    { id: 'cancelled', name: 'İptaller', count: filterCounts.cancelled },
  ];

  return (
    <div className="bg-gray-100 rounded-lg mb-3">
      <div className="flex flex-row">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-2 sm:px-4 py-2 text-xs font-medium transition-colors text-center
              ${activeTab === tab.id 
                ? 'text-orange-500 border-b-2 border-orange-500 bg-white' 
                : 'text-gray-600 hover:text-orange-500'}`}
          >
            <span className="block sm:hidden">{tab.name.split(' ')[0]}</span>
            <span className="hidden sm:block">{tab.name}</span>
            <span className="ml-1">({tab.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrdersTabs; 