"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { createProductUrl } from '@/utils/productUrl';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  isSponsored?: boolean;
  coupon?: string;
}

const RelatedProducts: React.FC = () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Gold Çelik Halka Küpe',
      brand: 'stainless steel',
      price: 94.99,
      rating: 4,
      reviewCount: 1168,
      image: '/relatedProducts/product1.webp'
    },
    {
      id: '2',
      name: 'Kadın Çelik Renk Atmaz Garantili Faturalı Küpe JFRCH2034',
      brand: 'Richard Jewell',
      price: 124.90,
      rating: 4.5,
      reviewCount: 279,
      image: '/relatedProducts/product2.webp'
    },
    {
      id: '3',
      name: 'Gold Çelik Halka Küpe',
      brand: 'stainless steel',
      price: 94.99,
      rating: 4,
      reviewCount: 1168,
      image: '/relatedProducts/product3.webp'
    },
    {
      id: '4',
      name: 'Kadın Çelik Renk Atmaz Garantili Faturalı Küpe JFRCH2034',
      brand: 'Richard Jewell',
      price: 124.90,
      rating: 4.5,
      reviewCount: 279,
      image: '/relatedProducts/product4.webp'
    },
    {
      id: '5',
      name: 'Gold Çelik Halka Küpe',
      brand: 'stainless steel',
      price: 94.99,
      rating: 4,
      reviewCount: 1168,
      image: '/relatedProducts/product5.webp'
    },
    {
      id: '6',
      name: 'Kadın Çelik Renk Atmaz Garantili Faturalı Küpe JFRCH2034',
      brand: 'Richard Jewell',
      price: 124.90,
      rating: 4.5,
      reviewCount: 279,
      image: '/relatedProducts/product6.webp'
    }
  ];

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

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div style={{
          background: 'linear-gradient(180deg, #efefef, #fff)',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <h2 className="text-xl font-medium mb-6 text-gray-900">Bu Ürünü Alanlar Bunları da Aldı</h2>

          <div className="relative">
            {!isAtStart && (
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-900 text-gray-600 hover:text-white transition-all duration-200"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
            )}

            {!isAtEnd && (
              <button 
                onClick={() => scroll('right')}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-900 text-gray-600 hover:text-white transition-all duration-200"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            )}

            <div className="overflow-hidden" ref={scrollContainerRef}>
              <div className="flex gap-6" style={{ width: 'calc(5 * (224px + 1.5rem))' }}>
                {products.map((product) => (
                  <Link 
                    key={product.id}
                    href={createProductUrl(product.slug || product.id)}
                    className="flex-shrink-0 w-56 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 relative group"
                  >
                    <button className="absolute right-4 top-4 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center group-hover:bg-gray-50">
                      <HeartIcon className="w-5 h-5 text-gray-600" />
                    </button>

                    {product.isSponsored && (
                      <span className="absolute left-4 top-4 z-10 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        Sponsorlu
                      </span>
                    )}

                    <div className="w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group-hover:border-orange-500 transition-colors duration-200">
                      <div className="relative aspect-square">
                        <Image 
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    {product.coupon && (
                      <div className="absolute top-32 left-0 right-0 bg-[#FF3366] text-white text-center py-1">
                        <span className="text-xs">{product.coupon}</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">{product.brand}</div>
                      <div className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2">
                        {product.name}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span key={idx} className={`text-sm ${idx < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-gray-500">({product.reviewCount})</span>
                      </div>

                      {product.badge && (
                        <div className="text-xs text-[#FF1B9D]">{product.badge}</div>
                      )}
                      
                      <div className="text-lg font-bold text-orange-500">
                        {product.price.toFixed(2)} TL
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

export default RelatedProducts; 