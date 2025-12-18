'use client';
import React, {JSX} from 'react';

interface FilterBadge {
  icon: string | JSX.Element;
  text: string;
  bgColor: string;
  textColor: string;
}

export default function FilterBadges() {
  const filterBadges: FilterBadge[] = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "Flash Ürünler",
      bgColor: "bg-pink-50",
      textColor: "text-pink-800"
    },{
      icon: "⭐",
      text: "Yüksek Puanlı Ürünler",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800"
    },
    {
      icon: "🏪",
      text: "Yüksek Puanlı Satıcılar",
      bgColor: "bg-blue-50",
      textColor: "text-blue-800"
    },
    {
      icon: "📦",
      text: "Kargo Bedava",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800"
    },
    {
      icon: "🚚",
      text: "Hızlı Teslimat",
      bgColor: "bg-green-50",
      textColor: "text-green-800"
    }
   
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filterBadges.map((badge, index) => (
        <button
          key={index}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${badge.bgColor} ${badge.textColor} text-sm font-medium hover:opacity-90 transition-opacity`}
        >
          <span>{badge.icon}</span>
          <span>{badge.text}</span>
        </button>
      ))}
    </div>
  );
}
