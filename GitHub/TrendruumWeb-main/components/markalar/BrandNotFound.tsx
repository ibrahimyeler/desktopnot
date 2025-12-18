import React from 'react';
import Link from 'next/link';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BrandNotFoundProps {
  brandSlug: string;
}

const BrandNotFound: React.FC<BrandNotFoundProps> = ({ brandSlug }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Marka Bulunamadı
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-2">
          <span className="font-medium">"{brandSlug}"</span> markası sistemimizde kayıtlı değil.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Marka adını kontrol ederek tekrar deneyebilir veya diğer markalarımıza göz atabilirsiniz.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
          >
            <HomeIcon className="w-4 h-4" />
            Ana Sayfaya Dön
          </Link>
          
         
        </div>

        {/* Suggestions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Öneriler:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Marka adının doğru yazıldığından emin olun</li>
            <li>• Türkçe karakterler kullanmayı deneyin</li>
            <li>• Ana sayfadan popüler markalara göz atın</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandNotFound;
