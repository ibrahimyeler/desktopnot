"use client";

import Header from '../layout/Header';
import ScrollToTop from '../ui/ScrollToTop';

interface CategoryNotFoundProps {
  category: string;
}

export default function CategoryNotFound({ category }: CategoryNotFoundProps) {
  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <main className="max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-16 md:pt-0 pb-8 sm:pb-12 lg:py-0 xl:py-0">
        <div className="flex flex-col items-center justify-center py-16 px-4 min-h-[60vh]">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Kategori bulunamadı
          </h3>
          
          <p className="text-gray-600 text-center mb-6 max-w-md">
            <span className="font-medium">"{category}"</span> adında bir kategori bulunmamaktadır.
            <br />
            Lütfen geçerli bir kategori adı girin veya ana sayfaya dönün.
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
              <li>• Ana sayfadan kategorilere göz atabilirsiniz</li>
              <li>• Arama yaparak istediğiniz ürünü bulabilirsiniz</li>
              <li>• Üst menüden kategorilere erişebilirsiniz</li>
            </ul>
          </div>
        </div>
      </main>
      <ScrollToTop />
    </>
  );
}

