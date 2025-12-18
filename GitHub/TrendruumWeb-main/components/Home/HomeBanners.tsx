"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BannerItem {
  id: number;
  imageUrl: string;
  brandName: string;
  dateRange: string;
  link: string;
}

const bannerData: BannerItem[] = [
  {
    id: 1,
    imageUrl: "/banners/banner1.webp", 
    brandName: "",
    dateRange: "",
    link: "/brand/angelsin"
  },
  {
    id: 2,
    imageUrl: "/banners/banner2.webp", 
    brandName: "",
    dateRange: "",
    link: "/brand/karaca"
  },
  {
    id: 3,
    imageUrl: "/banners/banner3.webp", 
    brandName: "",
    dateRange: "",
    link: "/brand/hm"
  }
];




export default function HomeBanners() {
  const router = useRouter();

  const handleBannerClick = (link: string) => {
    if (link) {
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
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {bannerData.map((banner) => (
          <div
            key={banner.id}
            className="relative rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => handleBannerClick(banner.link)}
          >
            <div className="aspect-[16/9] relative">
              <Image
                src={banner.imageUrl}
                alt={`${banner.brandName} kampanyası`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col">
              <span className="text-xs sm:text-sm font-medium text-black">
                {banner.brandName}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-600">
                {banner.dateRange}
              </span>
            </div>

            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
              <span className="text-[10px] sm:text-xs text-gray-500 italic">
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
