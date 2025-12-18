"use client";

import React from 'react';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { createProductUrl } from '@/utils/productUrl';

interface FlashProductsProps {
  category: string;
}

const FlashProducts = ({ category }: FlashProductsProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const products = [
    {
      id: 1,
      name: 'Clasy Care Face Up Skin Sivilce Kremi 40',
      image: '/flashProducts/product1.webp',
      price: '175,16 TL',
      rating: 4.2,
      reviewCount: '(9085)',
      soldCount: '172 adet satıldı'
    },
    {
      id: 2, 
      name: 'Vita Ceel Cilt Vitamini Çiğnenebilir Vegan Gummy',
      image: '/flashProducts/product2.webp',
      price: '336,20 TL',
      rating: 4.2,
      reviewCount: '(7098)',
      soldCount: '516 adet satıldı'
    },
    {
      id: 3,
      name: 'Vita Ceel Saç Tırnak Vitamini Çiğnenebilir Vegan Gummy',
      image: '/flashProducts/product3.webp',
      price: '342,06 TL',
      rating: 4.3,
      reviewCount: '(4793)',
      soldCount: '321 adet satıldı'
    },
    {
      id: 4,
      name: 'dedektifia Akıl Hastanesi Dedektiflik Oyunu',
      image: '/flashProducts/product4.webp',
      price: '336,20 TL',
      rating: 4.5,
      reviewCount: '(4418)',
      soldCount: '170 adet satıldı'
    },
    {
      id: 5,
      name: 'RİOMİ Ipl Buz Lazer Epilasyon 999.999 Atım Otomatik',
      image: '/flashProducts/product5.webp',
      price: '2.367,11 TL',
      rating: 4.4,
      reviewCount: '(30712)',
      soldCount: '118 adet satıldı'
    },
    {
      id: 6,
      name: 'Xiaomi Redmi Watch 3 Active Akıllı Saat',
      image: '/flashProducts/product6.webp',
      price: '1.299,90 TL',
      rating: 4.6,
      reviewCount: '(2156)',
      soldCount: '89 adet satıldı'
    },
    {
      id: 7,
      name: 'Philips Series 3000 Saç Kesme Makinesi',
      image: '/flashProducts/product7.webp',
      price: '799,90 TL',
      rating: 4.7,
      reviewCount: '(1893)',
      soldCount: '234 adet satıldı'
    }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      let endTime = localStorage.getItem('flashSaleEndTime');
      
      if (!endTime) {
        const now = new Date();
        endTime = new Date(now.getTime() + (50 * 60 * 60 * 1000)).toString();
        localStorage.setItem('flashSaleEndTime', endTime);
      }

      const now = new Date();
      const end = new Date(endTime);
      const difference = end.getTime() - now.getTime();

      if (difference <= 0) {
        const newEndTime = new Date(now.getTime() + (50 * 60 * 60 * 1000)).toString();
        localStorage.setItem('flashSaleEndTime', newEndTime);
        return calculateTimeLeft();
      }
      
      setTimeLeft({
        hours: Math.floor(difference / (1000 * 60 * 60)),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-white font-bold text-xl">Flaş Ürünler</span>
              </div>
              
              <div className="flex items-center gap-1">
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="text-white font-bold">{formatNumber(timeLeft.hours)}</span>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="text-white font-bold">{formatNumber(timeLeft.minutes)}</span>
                </div>
                <span className="text-white font-bold">:</span>
                <div className="bg-white/20 rounded px-2 py-1">
                  <span className="text-white font-bold">{formatNumber(timeLeft.seconds)}</span>
                </div>
              </div>
            </div>
            
            {/* <Link 
              href="/flash-urunler"
              className="flex items-center text-white hover:text-gray-100 font-medium"
            >
              Tümünü Gör
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link> */}
          </div>

          <div className="relative">
            {!isAtStart && (
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-orange-500 text-black hover:text-white rounded-full p-2 shadow-md transition-all duration-300"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}

            {!isAtEnd && (
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-orange-500 text-black hover:text-white rounded-full p-2 shadow-md transition-all duration-300"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            )}

            <div className="overflow-x-auto scrollbar-hide" ref={scrollContainerRef}>
              <div className="flex gap-6 min-w-max">
                {products.map((product) => (
                  <Link 
                    key={product.id} 
                    href={createProductUrl(product.slug || product.id)}
                    className="bg-white rounded-lg shadow-md p-4 w-56 relative group"
                  >
                    <div className="absolute top-2 right-2 z-10">
                                              <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                        <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center mt-8">
                      <div className="w-28 rounded-lg overflow-hidden mb-2 border border-gray-200 group-hover:border-orange-500 transition-colors p-2" style={{ width: '100%' }}>
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          width={189}
                          height={189}
                          className="w-full h-full object-contain" 
                          style={{ height: '189px' }}
                          priority={false}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex items-center gap-1 mb-1 w-full">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-sm text-gray-500">{product.soldCount}</span>
                      </div>
                      
                      <span className="text-sm text-gray-900 font-semibold group-hover:text-orange-500 transition-colors">
                        {product.name}
                      </span>

                      <div className="flex items-center mt-1.5 mb-1">
                        <div className="flex items-center">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1.5">{product.reviewCount}</span>
                      </div>

                      <div className="flex items-center justify-between w-full" style={{ marginTop: '15px', marginBottom: '25px' }}>
                        <span className="text-lg font-bold text-orange-500">{product.price}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashProducts;
