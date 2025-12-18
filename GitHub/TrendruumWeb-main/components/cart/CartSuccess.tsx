"use client"

import Link from 'next/link';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useBasket } from '@/app/context/BasketContext';

export default function CartSuccess() {
  const { basket } = useBasket();
  const lastAddedItem = basket?.basket_groups
    .flatMap(group => group.basket_group_items)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-black mb-2">Ürün Sepete Eklendi!</h2>
        {lastAddedItem && (
          <div className="mb-4 text-left">
            <p className="text-gray-600 mb-2">Eklenen Ürün:</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{lastAddedItem.product.name}</p>
              <p className="text-sm text-gray-600">Adet: {lastAddedItem.quantity}</p>
              <p className="text-sm text-gray-600">
                Fiyat: {lastAddedItem.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
              </p>
            </div>
          </div>
        )}
        <p className="text-gray-600 mb-8">Ürün başarıyla sepetinize eklendi.</p>
        <div className="flex flex-col space-y-3">
          <Link href="/sepet" className="inline-block bg-[#F27A1A] text-white px-6 py-3 rounded-md hover:bg-[#F27A1A]/90 transition-colors">
            Sepete Git
          </Link>
          <Link href="/" className="inline-block bg-white text-black border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors">
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
} 