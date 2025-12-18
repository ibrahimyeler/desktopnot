import React from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

interface NoProductsFoundProps {
  brandName: string;
  brandSlug: string;
}

const NoProductsFound: React.FC<NoProductsFoundProps> = ({ brandName, brandSlug }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
          <ShoppingBagIcon className="w-8 h-8 text-gray-400" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ürün Bulunamadı
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-2">
          <span className="font-medium">{brandName}</span> markasında şu anda satışta ürün bulunmuyor.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Bu marka yakında ürünlerini satışa sunabilir. Diğer markalarımıza göz atabilirsiniz.
        </p>

        {/* Action Buttons */}
      

        {/* Ana Sayfa Butonu */}
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-orange-500 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            Ana Sayfa
          </Link>
        </div>

        {/* Info Box */}
   
      </div>
    </div>
  );
};

export default NoProductsFound;
