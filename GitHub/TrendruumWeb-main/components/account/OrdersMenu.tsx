"use client";

import Link from 'next/link';
import { ShoppingBagIcon, ChatBubbleLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const OrdersMenu = () => {
  const menuItems = [
    { name: 'Tüm Siparişlerim', href: '/hesabim/siparislerim', icon: ShoppingBagIcon },
    { name: 'Değerlendirmelerim', href: '/hesabim/reviews', icon: ChatBubbleLeftIcon },
    { name: 'Satıcı Mesajlarım', href: '/hesabim/messages', icon: ChatBubbleLeftIcon },
    { name: 'Tekrar Satın Al', href: '/hesabim/repurchase', icon: ArrowPathIcon },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Siparişlerim</h3>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors"
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default OrdersMenu; 