"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SanaOzelUrunler from '@/components/Home/SanaOzelUrunler';

interface Banner {
  image: string;
  title?: string;
  link?: string;
}

interface MultipleBannersProps {
  banners: Banner[];
  isFirstBanner?: boolean;
}

const LoadingSpinner = () => (
  <div className="col-span-full flex justify-center items-center py-8">
    <div className="flex items-center space-x-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <span className="text-gray-600 text-sm">Daha fazla banner yükleniyor...</span>
    </div>
  </div>
);

const MultipleBanners: React.FC<MultipleBannersProps> = ({ banners, isFirstBanner = false }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const BANNERS_PER_PAGE = 9;
  
  if (!banners || banners.length === 0) return null;

  // 9'dan fazla banner varsa pagination sistemi kullan (test için 20 yerine 9)
  const shouldUsePagination = banners.length > 9;
  const totalPages = shouldUsePagination ? Math.ceil(banners.length / BANNERS_PER_PAGE) : 1;
  
  // Şu anda gösterilecek banner'ları hesapla
  const getCurrentBanners = () => {
    if (!shouldUsePagination) {
      return banners;
    }
    
    // İlk sayfa için sadece 9 banner göster
    const endIndex = currentPage * BANNERS_PER_PAGE;
    return banners.slice(0, endIndex);
  };

  const currentBanners = getCurrentBanners();

  // Scroll-based loading için useEffect
  useEffect(() => {
    if (!shouldUsePagination || currentPage >= totalPages) return;

    const handleScroll = () => {
      // Component'in alt kısmına yaklaşıldığında yeni banner'ları yükle
      const element = document.getElementById(`multiple-banners-${isFirstBanner ? 'first' : 'other'}`);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const isNearBottom = rect.bottom <= window.innerHeight + 200; // 200px önceden yükle

      if (isNearBottom && !isLoading && !hasLoaded) {
        setIsLoading(true);
        setHasLoaded(true);
        
        // 1 saniye loading göster
        setTimeout(() => {
          setCurrentPage(prev => prev + 1);
          setIsLoading(false);
          setHasLoaded(false);
        }, 1000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentPage, shouldUsePagination, totalPages, isLoading, hasLoaded, isFirstBanner]);

  const resolveBannerHref = (link?: string) => {
    if (!link) return null;

    const trimmedLink = link.trim();
    if (!trimmedLink) return null;

    if (trimmedLink.startsWith('http://') || trimmedLink.startsWith('https://')) {
      return trimmedLink;
    }

    if (trimmedLink.startsWith('/')) {
      return trimmedLink;
    }

    if (trimmedLink.includes('=')) {
      // Query parametreleri varsa flash ürünler sayfasına yönlendir
      const normalized = trimmedLink.startsWith('?')
        ? trimmedLink.slice(1)
        : trimmedLink;
      return `/flash-urunler?${normalized}`;
    }

    return `/${trimmedLink}`;
  };
  
  // Banner sayısına göre responsive grid layout belirleme
  const getGridCols = () => {
    const bannerCount = currentBanners.length;
    
    // 1 banner: Tam genişlik (orta büyük)
    if (bannerCount === 1) {
      return 'grid-cols-1 max-w-[1600px] mx-auto';
    }
    // 2 banner: Her biri yarı genişlik
    else if (bannerCount === 2) {
      return 'grid-cols-1 md:grid-cols-2';
    }
    // 3 banner: Her biri 1/3 genişlik
    else if (bannerCount === 3) {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
    // 4+ banner: Responsive grid
    else if (bannerCount <= 6) {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
    // 6+ banner: Daha küçük grid
    else {
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6';
    }
  };
  
  return (
    <div 
      id={`multiple-banners-${isFirstBanner ? 'first' : 'other'}`}
      className="w-full bg-white py-2 overflow-x-hidden"
    >
      <div
        className={`w-full px-0 ${
          currentBanners.length > 1 ? 'sm:px-4 lg:px-5 xl:px-6 2xl:px-8' : ''
        }`}
      >
        <div className={`grid ${getGridCols()} gap-[0.75px] sm:gap-1.25 md:gap-1.5`}>
          {currentBanners.map((banner, idx) => {
            const href = resolveBannerHref(banner.link);
            const commonClassName =
              'block overflow-hidden group border-0 outline-none transition-transform duration-300 ease-in-out scale-[0.99] lg:hover:scale-105';

            const bannerContent = (
              <div 
                className={`relative w-full border-0 outline-none ${
                  currentBanners.length === 1 
                    ? 'h-[180px] lg:h-[210px]' 
                  : currentBanners.length === 2 
                      ? 'h-[130px] lg:h-[160px]'
                      : 'h-auto lg:h-[185px]'
                }`}
                style={{ 
                  // 1 banner için oran 24/9, 2 banner için 16/9, 3+ banner için 21/9
                  aspectRatio: currentBanners.length === 1 
                    ? '24/9' 
                    : currentBanners.length === 2 
                      ? '16/9' 
                      : '21/9'
                }}
              >
                {banner.image && (
                  <Image
                    src={banner.image}
                    alt={banner.title || `Banner ${idx + 1}`}
                    fill
                    className="object-contain lg:object-cover border-0 outline-none"
                    sizes={
                      currentBanners.length === 1 
                        ? "(max-width: 768px) 100vw, 1200px"
                        : currentBanners.length === 2 
                        ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                        : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 400px"
                    }
                    priority={idx === 0}
                  />
                )}
                {banner.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-center py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm md:text-base font-semibold z-10">
                    {banner.title}
                  </div>
                )}
              </div>
            );

            return (
              <React.Fragment key={idx}>
                {href ? (
                  <Link
                    href={href}
                    prefetch={false}
                    className={`${commonClassName} cursor-pointer`}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {bannerContent}
                  </Link>
                ) : (
                  <div className={`${commonClassName} cursor-default`}>
                    {bannerContent}
                  </div>
                )}
              
              {/* Sadece ilk banner section'ında ve 3. banner'dan sonra SanaOzelUrunler component'ini ekle */}
              {/* {idx === 2 && isFirstBanner && (
                <div className="col-span-full mt-4">
                  <SanaOzelUrunler 
                    title="Son Gezdiğiniz Ürünler"
                    backgroundColor="#ffffff"
                    maxProducts={15}
                    showHeader={true}
                    uniqueId="multiple-banners-sana-ozel"
                  />
                </div>
              )} */}
              </React.Fragment>
            );
          })}
          
          {/* Loading spinner - sadece pagination aktifken ve yükleme durumunda göster */}
          {shouldUsePagination && isLoading && currentPage < totalPages && (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultipleBanners; 