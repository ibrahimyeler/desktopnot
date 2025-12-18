"use client";

import { TruckIcon, GiftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Seller {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  price: number;
  freeShipping?: boolean;
  productUrl: string;
}

interface OtherSellersProps {
  sellers: Seller[];
}

const OtherSellers = ({ sellers }: OtherSellersProps) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <h3 className="text-xs font-medium text-gray-700">
          Ürünün Diğer Satıcıları
        </h3>
        <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.5 rounded">
          ({sellers.length})
        </span>
      </div>

      <div className="space-y-2">
        {sellers.map((seller) => (
          <div 
            key={seller.id}
            className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-2.5 border border-gray-100 hover:border-blue-100 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2 min-w-0">
                {/* Satıcı Başlığı */}
                <div className="flex items-center gap-1.5">
                  <h4 className="text-[11px] font-medium text-blue-700 truncate">
                    {seller.name}
                  </h4>
                  <span className="px-1 py-0.5 bg-emerald-500 text-white text-[9px] font-medium rounded flex-shrink-0">
                    {seller.rating}
                  </span>
                </div>

                {/* Teslimat Bilgisi */}
                <div className="flex items-center gap-1.5">
                  <TruckIcon className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  <p className="text-[10px] text-gray-600 line-clamp-1">{seller.deliveryTime}</p>
                </div>

                {/* Kargo Bedava */}
                {seller.freeShipping && (
                  <div className="flex items-center gap-1.5">
                    <GiftIcon className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <p className="text-[10px] font-medium text-emerald-600">Kargo Bedava</p>
                  </div>
                )}
              </div>

              {/* Fiyat ve Buton */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="text-sm font-bold text-gray-900">
                  {seller.price.toLocaleString('tr-TR')} TL
                </div>
                <Link
                  href={seller.productUrl}
                  className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-medium rounded transition-colors"
                >
                  Ürüne Git
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Kullanım örneği:
export default function OtherSellersWrapper() {
  const sampleSellers = [
    {
      id: '1',
      name: 'HELİS BUTİK',
      rating: 9.1,
      deliveryTime: '9 saat 33 dakika içinde sipariş verirsen en geç yarın kargoda!',
      price: 1367,
      freeShipping: true,
      productUrl: '/product/1234'
    },
    // Diğer satıcılar buraya eklenebilir
  ];

  return <OtherSellers sellers={sampleSellers} />;
} 