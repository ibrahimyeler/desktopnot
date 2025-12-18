"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useBasket } from '@/app/context/BasketContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  medias: Array<{
    url: string;
  }>;
  rating?: number;
  review_count?: number;
  stock?: number;
  status?: string;
}

const ProductGridBanner: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());
  
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToBasket, addToGuestBasket } = useBasket();
  const router = useRouter();

  useEffect(() => {
    // Belirli ürünü local'de tutuyoruz - API isteği atmıyoruz
    const staticProduct = {
      id: "68c19320d724eb2e3a0e4b2e",
      name: "CFM 9449 S Gurme Otomatik Çay & Filtre Kahve Makinesi Çay Makinesi",
      price: 6729,
      slug: "cfm-9449-s-gurme-otomatik-cay-filtre-kahve-makinesi-cay-makinesi-68c19320d724eb2e3a0e4b2e",
      medias: [
        {
          url: "https://tr-126.b-cdn.net/products/68c19320d724eb2e3a0e4b2e/BKQ6RHkwp1tJEs1AECeBbZUv5CUTiQEhcGoMhDuE.jpg"
        }
      ],
      rating: 0,
      review_count: 0,
      stock: 9,
      status: "active"
    };

    // Hemen ürünü set et - loading yok
    setProducts([staticProduct]);
    setLoading(false);
  }, []);

  const handleFavoriteClick = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    if (loadingFavorites.has(productId)) return;

    setLoadingFavorites(prev => new Set(prev).add(productId));

    try {
      if (isInFavorites(productId)) {
        await removeFavorite(productId);
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        await addToFavorites(productId);
        toast.success('Ürün favorilere eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
    } finally {
      setLoadingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleAddToBasket = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadingBasket.has(productId)) return;

    setLoadingBasket(prev => new Set(prev).add(productId));

    try {
      if (isLoggedIn) {
        await addToBasket(productId, 1);
      } else {
        await addToGuestBasket(productId, 1);
      }
    } catch (error) {
      // Hata mesajı BasketContext'te yönetiliyor
    } finally {
      setLoadingBasket(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="relative rounded-lg overflow-hidden h-full">
        {/* Arka Plan - Sag.png */}
        <div className="absolute inset-0">
          <Image
            src="/Sag.png"
            alt="Sağ Banner Arka Plan"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        {/* Hafif Overlay - Sag.png tasarımını bozmamak için */}
        <div className="absolute inset-0 bg-black/10"></div>
        
        {/* Loading Overlay */}
        <div className="relative z-10 h-full flex items-center md:items-end justify-center p-1 md:p-4 pt-2 md:pt-4 pb-1 md:pb-4">
          <div className="bg-white rounded-lg shadow-lg p-1.5 md:p-3 w-full max-w-xs">
            <div className="animate-pulse flex items-center gap-2 md:gap-3">
              <div className="w-12 h-12 md:w-24 md:h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-1">
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                <div className="h-1.5 bg-gray-200 rounded w-1/2"></div>
                <div className="h-2.5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // İlk ürünü al (tek ürün göstermek için)
  const product = products[0];
  
  if (!product) {
    return (
      <div className="bg-white rounded-lg p-3 h-full flex items-center justify-center">
        <p className="text-sm text-gray-500">Ürün yükleniyor...</p>
      </div>
    );
  }

  const isOutOfStock = product.status === 'out_of_stock' || product.status === 'inactive' || (product.stock !== undefined && product.stock === 0);

  return (
    <div className="relative rounded-lg overflow-hidden h-full">
      {/* Arka Plan - Sag.png */}
      <div className="absolute inset-0">
        <Image
          src="/Sag.png"
          alt="Sağ Banner Arka Plan"
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="(max-width: 768px) 100vw, 40vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      
      {/* Hafif Overlay - Sag.png tasarımını bozmamak için */}
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Ürün Overlay - Beyaz Container */}
      <div className="relative z-10 h-full flex items-center md:items-end justify-center p-1 md:p-4 pt-2 md:pt-4 pb-1 md:pb-4">
        <div className="bg-white rounded-lg shadow-lg p-1.5 md:p-3 w-full max-w-xs">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Ürün Resmi - Sol tarafta */}
            <Link href={createProductUrl(product.slug)} className="flex-shrink-0">
              <div className="relative w-12 h-12 md:w-24 md:h-24 rounded-lg overflow-hidden">
                <Image
                  src={product.medias && product.medias.length > 0 
                    ? (typeof product.medias[0] === 'string' ? product.medias[0] : product.medias[0]?.url || '/placeholder.png')
                    : '/placeholder.png'
                  }
                  alt={product.name}
                  fill
                  className={`object-contain ${isOutOfStock ? 'grayscale' : ''}`}
                  sizes="(max-width: 768px) 48px, 96px"
                  loading="lazy"
                  quality={80}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="bg-red-500 text-white px-1 py-0.5 rounded text-xs">
                      Stokta Yok
                    </div>
                  </div>
                )}
              </div>
            </Link>
            
            {/* Ürün Bilgileri - Sağda */}
            <div className="flex-1 flex flex-col justify-center">
              <Link href={createProductUrl(product.slug)} className="flex-1">
                <h4 className="text-xs font-normal text-gray-800 line-clamp-1 mb-0.5">
                  {product.name}
                </h4>
                
                {/* Yıldız ve Değerlendirme */}
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, index) => {
                      const rating = product.rating || 0;
                      const isFilled = index < Math.floor(rating);
                      
                      return (
                        <StarIcon
                          key={index}
                          className={`w-2.5 h-2.5 ${
                            isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs text-gray-500">
                    ({product.review_count || 0})
                  </span>
                </div>
                
                {/* Fiyat */}
                <div className="mb-1">
                  <span className="text-sm font-bold text-gray-800">
                    {product.price.toLocaleString('tr-TR')}₺
                  </span>
                </div>
              </Link>
              
              {/* Sepete Ekle Butonu - 0 TL ürünlerde gizli */}
              {product.price > 0 && (
                <button 
                  className={`w-full py-0.5 px-1 rounded text-xs font-normal transition-all duration-200 border ${
                    isOutOfStock 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : `bg-white text-orange-600 border-orange-600 hover:bg-orange-50 ${loadingBasket.has(product.id) ? 'opacity-50 cursor-wait' : ''}`
                  }`}
                  onClick={(e) => handleAddToBasket(product.id, e)}
                  disabled={isOutOfStock || loadingBasket.has(product.id)}
                >
                  {isOutOfStock ? 'Stokta Yok' : (loadingBasket.has(product.id) ? 'Ekleniyor...' : 'Sepete Ekle')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductGridBanner;
