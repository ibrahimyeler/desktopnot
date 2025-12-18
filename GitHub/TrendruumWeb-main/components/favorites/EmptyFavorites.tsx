import { HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function EmptyFavorites() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8">
      <div className="text-center py-6 sm:py-12">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-orange-100 mb-3 sm:mb-4">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500"
          >
            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Favorilerinizde ürün bulunmamaktadır.
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 px-2">
          Beğendiğin ürünü favorine ekle, fiyatı düştüğünde haber verelim.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 transition-colors"
        >
          Alışverişe Başla
        </a>
      </div>
    </div>
  );
} 