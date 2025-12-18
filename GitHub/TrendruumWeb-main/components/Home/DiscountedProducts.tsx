"use client";

import { HeartIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { createProductUrl } from '@/utils/productUrl';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';

const products = [
  {
    id: 1,
    name: 'STOP Forte Leke Çıkarıcı',
    image: '/discounted/product1.webp',
    price: '133,81 TL',
    rating: 3.9,
    reviewCount: '(42648)'
  },
  {
    id: 2,
    name: 'Moon Shine Candle Yılbaşı Temalı Anahtarlık',
    image: '/discountedProducts/product2.webp',
    price: '33 TL',
    rating: 4.1,
    reviewCount: '(104)'
  },
  {
    id: 3,
    name: 'Vitlife Magwell Magnezyum ve Vitamin B6 İçeren Gündüz&Gece',
    image: '/discountedProducts/product3.webp',
    price: '359 TL',
    oldPrice: '365 TL',
    rating: 5.0,
    reviewCount: '(43)'
  },
  {
    id: 4,
    name: 'Velavit Viva Ceramide 30 Kapsül',
    image: '/discountedProducts/product4.webp',
    price: '990 TL',
    rating: 4.5,
    reviewCount: '(323)'
  },
  {
    id: 5,
    name: 'STOP Forte Leke Çıkarıcı',
    image: '/discountedProducts/product5.webp',
    price: '133,81 TL',
    rating: 3.9,
    reviewCount: '(42648)'
  },
  {
    id: 6,
    name: 'STOP Forte Leke Çıkarıcı',
    image: '/discountedProducts/product6.webp',
    price: '133,81 TL',
    rating: 3.9,
    reviewCount: '(42648)'
  },
  {
    id: 7,
    name: 'STOP Forte Leke Çıkarıcı',
    image: '/discountedProducts/product7.webp',
    price: '133,81 TL',
    rating: 3.9,
    reviewCount: '(42648)'
  }
];

export default function DiscountedProducts() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

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
        <div style={{
          background: 'linear-gradient(180deg, #efefef, #fff)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">İndirimli Ürünler</h2>
            {/* <Link 
              href="/indirimli-urunler" 
              className="flex items-center text-black hover:text-gray-800 font-medium"
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
                    href={createProductUrl(product.id.toString())}
                    className="bg-white rounded-lg shadow-md p-4 w-56 relative group"
                  >
                    <div className="absolute top-2 right-2 z-10">
                                              <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md">
                        <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center mt-8">
                                              <div className="w-28 rounded-lg overflow-hidden mb-2 border border-gray-200 p-2" style={{ width: '100%' }}>
                        <div className="relative aspect-[2/3]">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill
                            sizes="(max-width: 224px) 100vw, 224px"
                            className="object-contain" 
                            priority={product.id <= 4}
                          />
                        </div>
                      </div>
                      
                                              <span className="text-sm text-gray-900 font-semibold">
                        {product.name}
                      </span>

                      <div className="flex items-center mt-1.5 mb-1">
                        <div className="flex items-center">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1.5">{product.reviewCount}</span>
                      </div>

                      <div className="flex items-center justify-between w-full" style={{ marginTop: '15px', marginBottom: '25px' }}>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-500 line-through mr-2">{product.oldPrice}</span>
                        )}
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
}
