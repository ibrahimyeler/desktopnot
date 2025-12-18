"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const OrdersHeader = () => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 mb-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-gray-900">Siparişlerim</h1>
        
        <div className="flex items-center gap-3">
          {/* Arama Alanı */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ürün ismi veya Marka ara"
              className="w-[240px] pl-3 pr-8 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2" />
          </div>

          {/* Filtre Dropdown */}
          <select className="pl-3 pr-8 py-1.5 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-transparent appearance-none bg-white">
            <option value="">Tüm Siparişler</option>
            <option value="last-month">Son 1 Ay</option>
            <option value="last-3-months">Son 3 Ay</option>
            <option value="last-6-months">Son 6 Ay</option>
            <option value="last-year">Son 1 Yıl</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OrdersHeader; 