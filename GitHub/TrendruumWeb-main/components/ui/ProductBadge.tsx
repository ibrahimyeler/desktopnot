"use client";

import React from 'react';
import Image from 'next/image';

interface ProductBadgeProps {
  type: 'fast_shipping' | 'free_shipping' | 'same_day' | 'new_product' | 'best_selling';
  className?: string;
  size?: 'small' | 'large';
}

const ProductBadge: React.FC<ProductBadgeProps> = ({ type, className = '', size = 'small' }) => {
  const badgeConfig = {
    fast_shipping: {
      src: '/badges/quickShipment.png',
      alt: 'Hızlı Kargo',
      className: size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-9 h-9 sm:w-12 sm:h-12'
    },
    free_shipping: {
      src: '/badges/freeShipment.png',
      alt: 'Ücretsiz Kargo',
      className: size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-9 h-9 sm:w-12 sm:h-12'
    },
    same_day: {
      src: '/badges/sameDayShipping.png',
      alt: 'Aynı Gün Kargo',
      className: size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-9 h-9 sm:w-12 sm:h-12'
    },
    new_product: {
      src: '/badges/newProduct.png',
      alt: 'Yeni Ürün',
      className: size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-9 h-9 sm:w-12 sm:h-12'
    },
    best_selling: {
      src: '/badges/bestSelling.png',
      alt: 'Çok Satan',
      className: size === 'large' ? 'w-16 h-16 sm:w-20 sm:h-20' : 'w-9 h-9 sm:w-12 sm:h-12'
    }
  };

  const config = badgeConfig[type];

  // Debug: Badge render edildiğini logla

  return (
    <div 
      className={`absolute z-10 ${className}`} 
      style={{ 
        opacity: 0.8,
        pointerEvents: 'none',
        display: 'block',
        visibility: 'visible'
      }}
    >
      <Image
        src={config.src}
        alt={config.alt}
        width={size === 'large' ? 80 : 48}
        height={size === 'large' ? 80 : 48}
        className={config.className}
        priority
        style={{
          display: 'block',
          visibility: 'visible'
        }}
      />
    </div>
  );
};

export default ProductBadge;
