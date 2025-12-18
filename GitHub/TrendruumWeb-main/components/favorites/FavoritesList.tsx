"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import EmptyFavorites from './EmptyFavorites';
import toast from 'react-hot-toast';
import { useFavorites } from '@/app/context/FavoriteContext';
import { createProductUrl } from '@/utils/productUrl';

interface FavoritesListProps {
  onRemove: (productId: string) => void;
  onAddToCart: (productId: string) => void;
  addedToCart: string | null;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ onRemove, onAddToCart, addedToCart }) => {
  const { favorites, loading, removeFavorite } = useFavorites();
  const [localFavorites, setLocalFavorites] = useState(favorites);

  // Yıldız rating render fonksiyonu
  const renderStars = useCallback((rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  }, []);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleRemove = async (productId: string) => {
    try {
      await removeFavorite(productId);
      setLocalFavorites((prev) => prev.filter((item) => item.id !== productId));
      onRemove(productId);
    } catch (error) {
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (localFavorites.length === 0) {
    return <EmptyFavorites />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 xl:gap-4 2xl:gap-4">
      {localFavorites.map((product) => (
        <div key={product.id} className="product-card block bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200">
          <Link href={createProductUrl(product.slug || '')} className="block">
            <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg p-1 group">
              <Image
                src={
                  (product.medias && product.medias.length > 0 && product.medias[0].url)
                    || (product.images && product.images.length > 0 && product.images[0].url)
                    || '/placeholder.webp'
                }
                alt={product.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                priority={false}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Silme ikonu - Ürün resminin sağ üstünde */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemove(product.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm z-10"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </Link>

          <div className="p-2 pb-2 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                {product.name}
              </h3>
            </div>

            {/* Fiyat Bölümü */}
            <div className="mb-2">
              <div className="text-lg font-semibold text-gray-900">
                {product.price && product.price > 0 ? new Intl.NumberFormat('tr-TR', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(product.price) + ' TL' : 'Fiyat bilgisi yok'}
              </div>
            </div>

            {/* Sepete Ekle Butonu kaldırıldı */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesList;
