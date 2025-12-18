"use client";

import Image from 'next/image';
import { FaTruck, FaTrash } from 'react-icons/fa';
import { HiMinus, HiPlus } from 'react-icons/hi';
import Link from 'next/link';
import { STORAGE_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';

interface BasketItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

interface BasketItemsProps {
  items: BasketItem[];
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  totalItems: number;
}

export default function BasketItems({
  items = [],
  onQuantityChange,
  onRemoveItem,
  totalItems = 0,
}: BasketItemsProps) {
  const getImageUrl = (item: BasketItem) => {
    if (!item.image) return '/no-image.png';
    return item.image.startsWith('http') ? item.image : `${STORAGE_URL}/${item.image}`;
  };

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-lg">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sepetiniz Boş</h2>
        <p className="text-gray-500 text-lg mb-6">Hemen alışverişe başlayın!</p>
        <Link href="/" className="bg-[#F27A1A] text-white px-8 py-3 rounded-full hover:bg-[#e16c0e] transition-colors">
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <div className="flex items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Sepetim <span className="text-gray-500 font-normal">({totalItems} Ürün)</span>
        </h1>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div 
            key={item.id}
            className="bg-white rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-[#F27A1A] bg-orange-50 px-3 py-1 rounded-full text-sm font-medium">
                  Trendruum
                </span>
              </div>
              <button 
                onClick={() => onRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <Link href={createProductUrl(item.productId)} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative hover:opacity-80 transition-opacity">
                <Image
                  src={getImageUrl(item)}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="object-cover cursor-pointer"
                />
              </Link>

              <div className="flex-grow">
                <Link href={createProductUrl(item.productId)} className="block">
                  <h3 className="text-base font-medium text-gray-900 mb-2 hover:text-orange-500 transition-colors cursor-pointer">
                  {item.name}
                </h3>
                </Link>

                <div className="flex items-center text-sm text-green-600 mb-2">
                  <FaTruck className="mr-2" />
                  içinde sipariş verirsen <span className="font-semibold ml-1">bugün kargoda!</span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-[#F27A1A]">
                      {item.price.toLocaleString("tr-TR")} TL
                    </p>
                  </div>

                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                    <button
                      onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                      className="p-2 text-gray-600 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <HiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center py-2 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                      className="p-2 text-[#F27A1A] hover:bg-gray-100"
                    >
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 