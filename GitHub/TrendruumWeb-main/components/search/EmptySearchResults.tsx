import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface EmptySearchResultsProps {
  searchQuery?: string;
}

const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({
  searchQuery
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <MagnifyingGlassIcon className="w-12 h-12 text-gray-400" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Aramınıza uygun ürün bulunamadı
      </h3>
      
      {searchQuery && (
        <p className="text-gray-600 text-center mb-6 max-w-md">
          <span className="font-medium">"{searchQuery}"</span> için aramınıza uygun ürün bulunamadı.
          <br />
          Farklı anahtar kelimeler deneyebilir veya filtreleri kullanabilirsiniz.
        </p>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
        >
          Ana Sayfaya Dön
        </button>
      </div>
      
      <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-md">
        <p className="text-sm text-gray-500 text-center mb-3">
          Öneriler:
        </p>
        <ul className="text-sm text-gray-600 space-y-2 text-center">
          <li>• Yazım hatası olup olmadığını kontrol edin</li>
          <li>• Daha genel terimler kullanın</li>
          <li>• Filtreleri kullanarak arama yapın</li>
          <li>• Kategorilerden göz atın</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptySearchResults;

