import React from 'react';
import { FolderIcon } from '@heroicons/react/24/outline';

interface EmptyCategoryResultsProps {
  categoryName?: string;
  hasCategory?: boolean;
}

const EmptyCategoryResults: React.FC<EmptyCategoryResultsProps> = ({
  categoryName,
  hasCategory = false
}) => {
  // Kategori var ama ürün yoksa farklı mesaj göster
  if (hasCategory && categoryName) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4">
            <FolderIcon className="w-12 h-12 text-orange-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          "{categoryName}" kategorisinde henüz ürün bulunmuyor
        </h3>
        
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Bu kategori mevcut ancak şu anda bu kategoride ürün bulunmamaktadır.
          <br />
          En kısa sürede bu kategoriye ürünler eklenecektir.
          <br />
          Diğer kategorilere göz atabilirsiniz.
        </p>
        
        <div className="flex justify-center gap-3">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Ana Sayfaya Dön
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Geri Dön
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 w-full max-w-md">
          <p className="text-sm text-gray-500 text-center mb-3">
            Öneriler:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 text-center">
            <li>• Diğer kategorilere göz atabilirsiniz</li>
            <li>• Ana sayfadan popüler ürünleri keşfedebilirsiniz</li>
            <li>• Arama yaparak istediğiniz ürünü bulabilirsiniz</li>
            <li>• Filtreleri kullanarak daha spesifik arama yapabilirsiniz</li>
          </ul>
        </div>
      </div>
    );
  }

  // Kategori yoksa veya arama sonucu boşsa eski mesajı göster
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6">
        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Ürün bulunamadı
      </h3>
      
      {categoryName && (
        <p className="text-gray-600 text-center mb-6 max-w-md">
          <span className="font-medium">"{categoryName}"</span> aramanıza uygun ürün bulunamadı.
          <br />
          Farklı kategorilere göz atabilir veya filtreleri kullanabilirsiniz.
        </p>
      )}
      
      {!categoryName && (
        <p className="text-gray-600 text-center mb-6 max-w-md">
          Aramanıza uygun ürün bulunamadı.
          <br />
          Farklı kategorilere göz atabilir veya filtreleri kullanabilirsiniz.
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
          <li>• Farklı kategorilere göz atın</li>
          <li>• Filtreleri kullanarak arama yapın</li>
          <li>• Ana sayfadan popüler ürünleri keşfedin</li>
          <li>• Arama yaparak istediğiniz ürünü bulun</li>
        </ul>
      </div>
    </div>
  );
};

export default EmptyCategoryResults;

