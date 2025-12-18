'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SingleBannerProps {
  title?: string;
  imageUrl?: string;
  link?: string;
  altText?: string;
}

const SingleBanner: React.FC<SingleBannerProps> = ({
  title = 'Banner Başlığı',
  imageUrl = '/placeholder-banner.jpg',
  link = '#',
  altText = 'Banner'
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (link && link !== '#') {
      // Eğer link bir kategori slug'ı ise, kategori sayfasına yönlendir
      if (link.startsWith('/')) {
        router.push(link);
      } else if (link.includes('=')) {
        // Eğer link query parametreleri içeriyorsa, flash-urunler sayfasına yönlendir
        router.push(`/flash-urunler?${link}`);
      } else {
        // Basit kategori slug'ı ise kategori sayfasına yönlendir
        router.push(`/${link}`);
      }
    }
  };

  return (
    <div 
      className="relative w-full h-[150px] sm:h-[180px] md:h-[200px] overflow-hidden rounded-lg shadow-md cursor-pointer"
      onClick={handleClick}
    >
        <div className="relative w-full h-full bg-gray-200 animate-pulse">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {title && (
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">{title}</h3>
            </div>
          )}
        </div>
    </div>
  );
};

export default SingleBanner; 