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
    image: '/bestSellers/product1.webp',
    price: '133,81 TL',
    rating: 3.9,
    reviewCount: '(42648)'
  },
  {
    id: 2,
    name: 'Zühre Ana Karadut Özü 670 Gr',
    image: '/bestSellers/product2.webp',
    price: '262,63 TL',
    rating: 4.6,
    reviewCount: '(74481)'
  },
  {
    id: 3,
    name: 'KOREACO Leke Karşıtı & Cilt Tonu Eşitleyen Aydınlatıcı Ampul',
    image: '/bestSellers/product3.webp',
    price: '161 TL',
    rating: 4.1,
    reviewCount: '(45092)'
  },
  {
    id: 4,
    name: 'AHI SULTAN Form Kahvesi 8 Farklı Kahve Ve Spirulina İçerik',
    image: '/bestSellers/product4.webp',
    price: '499 TL',
    rating: 4.4,
    reviewCount: '(10723)'
  },
  {
    id: 5,
    name: 'Bade Natural Biberiye Suyu Güçlendirici Saç Toniği %100',
    image: '/bestSellers/product5.webp',
    price: '349,90 TL',
    rating: 4.5,
    reviewCount: '(14272)'
  },
  {
    id: 6,
    name: 'Bade Natural Biberiye Suyu Güçlendirici Saç Toniği %100',
    image: '/bestSellers/product6.webp',
    price: '349,90 TL',
    rating: 4.5,
    reviewCount: '(14272)'
  },
  {
    id: 7,
    name: 'Bade Natural Biberiye Suyu Güçlendirici Saç Toniği %100',
    image: '/bestSellers/product7.webp',
    price: '349,90 TL',
    rating: 4.5,
    reviewCount: '(14272)'
  }
];

const BestSellers = () => {
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
            <h2 className="text-2xl font-semibold text-gray-900">Çok Satan Ürünler</h2>
            {/* <Link 
              href="/cok-satanlar" 
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
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 w-56 relative group"
                  >
                    <div className="absolute top-2 right-2 z-10">
                      <button className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                        <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    <div className="flex flex-col items-center mt-8">
                      <div className="w-full aspect-[2/3] rounded-lg overflow-hidden mb-2 border border-gray-200 group-hover:border-orange-500 transition-colors p-2">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill
                          className="object-contain" 
                        />
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
}

export default BestSellers;
