"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useVisitedProducts } from '@/app/context/VisitedProductsContext';
import { createProductUrl } from '@/utils/productUrl';
import { HeartIcon, StarIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

// Swiper CSS'lerini import et
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface VisitedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  campaignPrice?: number;
  discountPercentage?: number;
  images: Array<{
    url: string;
    name: string;
    id: string;
  }>;
  brand?: {
    name: string;
    id: string;
    slug?: string;
  };
  rating?: number;
  reviewCount?: number;
  visitedAt: number;
}

interface SanaOzelUrunlerProps {
  title?: string;
  backgroundColor?: string;
  showHeader?: boolean;
  maxProducts?: number;
  uniqueId?: string;
}

const SanaOzelUrunler: React.FC<SanaOzelUrunlerProps> = ({ 
  title = "Son Gezdiğiniz Ürünler", 
  backgroundColor,
  showHeader = true,
  maxProducts = 15,
  uniqueId = 'default'
}) => {
  const { visitedProducts, removeVisitedProduct } = useVisitedProducts();
  const { favorites, addToFavorites, removeFavorite, isInFavorites } = useFavorites();
  const { isLoggedIn } = useAuth();
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());

  // Ürünleri filtrele - bilinmeyen marka ve resmi olmayanları çıkar
  const filteredProducts = visitedProducts.filter(product => {
    // Marka kontrolü
    const hasValidBrand = product.brand?.name && product.brand.name !== 'Bilinmeyen Marka';
    
    // Resim kontrolü
    const hasValidImage = product.images && product.images.length > 0 && product.images[0]?.url;
    
    return hasValidBrand && hasValidImage;
  });
  
  // Maksimum ürün sayısını sınırla
  const displayProducts = filteredProducts.slice(0, maxProducts);

  // Sadece giriş yapmış kullanıcılar için göster
  if (!isLoggedIn) {
    return null;
  }

  // Eğer geçerli ürün yoksa component'i gösterme
  if (displayProducts.length === 0) {
    return null;
  }

  // Background color ayarla - beyaz
  const gradientBg = backgroundColor
    ? `linear-gradient(to bottom, ${backgroundColor.startsWith('#') ? backgroundColor : `#${backgroundColor}`}, #ffffff)`
    : '#ffffff';

  // Favorilere ekleme/çıkarma fonksiyonu
  const handleToggleFavorite = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadingFavorites.has(productId)) return;

    setLoadingFavorites(prev => new Set(prev).add(productId));

    try {
      if (isInFavorites(productId)) {
        await removeFavorite(productId);
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        await addToFavorites(productId);
        toast.success('Ürün favorilere eklendi');
        
        // Favorilere eklendikten sonra LocalStorage'daki veri korunuyor
        // Bu sayede resim verileri kaybolmuyor
      }
    } catch (error) {
    } finally {
      setLoadingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Ürünü listeden kaldır
  const handleRemoveFromList = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeVisitedProduct(productId);
    toast.success('Ürün listeden kaldırıldı');
  };

  // Yıldız rating render fonksiyonu - dinamik
  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={`w-3 h-3 ${
            i <= Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  // Fiyat formatı
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <section className="w-full bg-white pt-2 pb-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
        <div className="relative rounded-xl p-3 sm:p-4 md:p-6" style={{ background: gradientBg }}>
        {/* Header - Sadece showHeader true ise göster */}
        {showHeader && (
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black">{title}</h2>
            </div>
          </div>
        )}

        {/* Ürün Swiper - PopularProducts gibi */}
        <div className="relative px-2 sm:px-4 md:px-6 pb-2">
          <Swiper
            className={`sana-ozel-products-swiper-${uniqueId}`}
            modules={[Navigation]}
            spaceBetween={4}
            slidesPerView={2}
            navigation={{
              nextEl: `.swiper-button-next-sana-ozel-${uniqueId}`,
              prevEl: `.swiper-button-prev-sana-ozel-${uniqueId}`,
            }}
            breakpoints={{
              480: {
                slidesPerView: 2.2,
                spaceBetween: 6,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 8,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 8,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 10,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 12,
              },
              1536: {
                slidesPerView: 5,
                spaceBetween: 14,
              },
            }}
          >
          {displayProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Link href={createProductUrl(product.slug)}>
                <div className="bg-white rounded-xl border border-gray-200 flex flex-col relative group hover:shadow-lg transition-all duration-200 overflow-hidden h-full">
                {/* Ürün Resmi - PopularProducts ile aynı yapı */}
                <div className="relative aspect-[2/3] w-full flex items-center justify-center p-2 sm:p-3 md:p-4">
                  {product.images && product.images.length > 0 && product.images[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 480px) 45vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Badge'ler - Sol üstte kaldır butonu, sağ üstte favori butonu */}
                  <div className="absolute top-2 left-2">
                    {/* Kaldır Butonu */}
                    <button
                      onClick={(e) => handleRemoveFromList(product.id, e)}
                      className="w-7 h-7 bg-white/90 hover:bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
                      title="Listeden kaldır"
                    >
                      <EyeSlashIcon className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                  
                  {/* Favori Butonu - Sağ üst köşe */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => handleToggleFavorite(product.id, e)}
                      className={`bg-white rounded-full p-1.5 shadow-md transition-colors duration-200 ${
                        isInFavorites(product.id) 
                          ? 'hover:bg-red-500' 
                          : 'hover:bg-orange-500'
                      }`}
                      title={isInFavorites(product.id) ? "Favorilerden kaldır" : "Favorilere ekle"}
                      style={{ 
                        minWidth: '32px',
                        minHeight: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {isInFavorites(product.id) ? (
                        <HeartSolidIcon className="w-4 h-4 text-red-500 hover:text-white transition-colors duration-200" />
                      ) : (
                        <HeartIcon className="w-4 h-4 text-gray-600 hover:text-white transition-colors duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Ürün Bilgileri - PopularProducts yapısı */}
                <div className="p-4 pb-2 flex-1 flex flex-col">
                  <div className="flex-1 flex flex-col">
                    {/* Ürün Adı - Sabit yükseklik */}
                    <h3 className="text-sm font-medium mb-2 line-clamp-2 text-black h-10 flex items-start">
                      {product.name}
                    </h3>

                    {/* Marka Adı - Tek satır, uzunsa kes */}
                    <p className="text-xs text-gray-600 mb-2 h-4 truncate">
                      {product.brand?.name || 'Bilinmeyen Marka'}
                    </p>

                    {/* Yıldız ve Değerlendirme - Dinamik */}
                    <div className="flex items-center gap-1 mb-2 h-5">
                      <div className="flex">
                        {renderStars((product as any).rating || 0)}
                      </div>
                      <span className="text-xs text-gray-600">
                        ({(product as any).rating ? (product as any).rating.toFixed(1) : '0'})
                      </span>
                    </div>

                    {/* Fiyat - Sabit yükseklik */}
                    <div className="flex items-baseline gap-2 mb-4 h-6">
                      {product.campaignPrice && product.campaignPrice < (product.originalPrice || product.price) ? (
                        <>
                          <span className="text-sm font-semibold text-black">
                            {formatPrice(product.campaignPrice)} TL
                          </span>
                          <span className="text-gray-600 line-through text-xs">
                            {formatPrice(product.originalPrice || product.price)} TL
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-black">
                          {formatPrice(product.price)} TL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sepete Ekle Butonu kaldırıldı */}
                </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
          </Swiper>
          
          {/* Custom Navigation Buttons - Hidden on mobile */}
          <div 
            className={`swiper-button-prev-sana-ozel-${uniqueId} hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg transition-colors duration-200 group hover:bg-orange-500 z-20 cursor-pointer`}
            data-swiper-button="prev"
          >
            <svg className="w-6 h-6 text-black group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          
          <div 
            className={`swiper-button-next-sana-ozel-${uniqueId} hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg transition-colors duration-200 group hover:bg-orange-500 z-20 cursor-pointer`}
            data-swiper-button="next"
          >
            <svg className="w-6 h-6 text-black group-hover:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>


        {/* Bilgi Mesajı (eğer maxProducts'a ulaşılmışsa) */}
        {filteredProducts.length > maxProducts && (
          <div className="text-center mt-4">
            <p className="text-xs sm:text-sm text-gray-500">
              En son ziyaret ettiğin {maxProducts} geçerli ürün gösteriliyor
            </p>
          </div>
        )}
      </div>
      </div>

      <style jsx global>{`
        .sana-ozel-products-swiper-${uniqueId} .swiper-button-next,
        .sana-ozel-products-swiper-${uniqueId} .swiper-button-prev {
          display: none !important;
        }
        
        .sana-ozel-products-swiper-${uniqueId} .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .sana-ozel-products-swiper-${uniqueId} .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
};

export default SanaOzelUrunler;
