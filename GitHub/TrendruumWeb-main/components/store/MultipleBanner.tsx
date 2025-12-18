"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Banner {
  image: string;
  title?: string;
  link?: string;
}

interface MultipleBannerProps {
  banners: Banner[];
}

const MultipleBanner: React.FC<MultipleBannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextBanner = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  }, [banners.length]);

  const prevBanner = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, [nextBanner]);

  if (!banners || banners.length === 0) return null;

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.image + index}
          className={`absolute w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="relative w-full h-full cursor-pointer">
              <Image
                src={banner.image}
                alt={banner.title || 'Banner'}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === currentIndex}
                unoptimized
              />
            </div>
        </div>
      ))}
      {/* Sola kaydırma butonu - PopularProducts gibi */}
      {currentIndex > 0 && (
        <button
          onClick={prevBanner}
          className="flex items-center justify-center absolute left-1 md:left-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 md:p-2 transition-all duration-200 group hover:bg-orange-500 active:bg-orange-600 z-10 cursor-pointer shadow-md md:shadow-xl border border-gray-200/50 md:border-0"
          aria-label="Önceki banner"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:w-4 md:w-6 md:h-6 text-gray-700 group-hover:text-white group-active:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      {/* Sağa kaydırma butonu - PopularProducts gibi */}
      {currentIndex < banners.length - 1 && (
        <button
          onClick={nextBanner}
          className="flex items-center justify-center absolute right-1 md:right-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 md:p-2 transition-all duration-200 group hover:bg-orange-500 active:bg-orange-600 z-10 cursor-pointer shadow-md md:shadow-xl border border-gray-200/50 md:border-0"
          aria-label="Sonraki banner"
        >
          <svg className="w-3.5 h-3.5 sm:w-4 sm:w-4 md:w-6 md:h-6 text-gray-700 group-hover:text-white group-active:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Dot indicators - Hidden */}
      {/* <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {banners.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div> */}
      </div>
    </div>
  );
};

export default MultipleBanner;
