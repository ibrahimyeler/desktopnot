"use client";

import React from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface ProductTerminProps {
  termin?: number | null;
  className?: string;
}

export default function ProductTermin({ termin, className = "" }: ProductTerminProps) {
  // API'den termin bilgisi gelmezse varsayılan 2 gün
  const terminDays = termin !== null && termin !== undefined ? termin : 2;
  
  // Termin gününe göre mesaj belirle
  const getTerminMessage = (days: number) => {
    if (days === 1) {
      return "1 gün";
    } else if (days === 2) {
      return "2 gün";
    } else if (days === 3) {
      return "3 gün";
    } else if (days <= 7) {
      return `${days} gün`;
    } else {
      return `${days} gün`;
    }
  };

  // Termin gününe göre icon rengi belirle (turuncu tonları)
  const getIconColor = (days: number) => {
    if (days <= 1) {
      return "text-orange-500";
    } else if (days <= 3) {
      return "text-orange-600";
    } else {
      return "text-orange-700";
    }
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`p-1.5 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200/50`}>
        <ClockIcon className={`w-3.5 h-3.5 ${getIconColor(terminDays)}`} />
      </div>
      <span className="text-sm text-gray-600 font-light">
        Teslim Süresi:
      </span>
      <span className={`text-sm font-semibold ${getIconColor(terminDays)}`}>
        {getTerminMessage(terminDays)}
      </span>
    </div>
  );
}
