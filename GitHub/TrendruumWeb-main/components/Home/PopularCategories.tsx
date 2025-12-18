"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export interface Category {
  image?: string;
  name: string;
  color?: string;
  slug?: string;
}

export interface PopularCategoriesProps {
  categories: Category[];
}

const PopularCategories: React.FC<PopularCategoriesProps> = ({ categories }) => {
  const router = useRouter();

  if (!categories || categories.length === 0) return null;

  const handleCategoryClick = (category: Category) => {
    if (category.slug) {
      router.push(`/${category.slug}`);
    }
  };

  // Kategori sayısına göre boyut hesaplama
  const getGridCols = (count: number) => {
    // Mobilde her zaman 1 sütun, responsive grid
    if (count <= 3) return 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4';
    if (count <= 6) return 'grid-cols-1 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6';
    return 'grid-cols-1 sm:grid-cols-8 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12'; // 6'dan fazla için
  };

  // Kategori sayısına göre boyut hesaplama - mobilde büyük, desktop'ta sayıya göre
  const getImageSize = (count: number) => {
    // Responsive image sizes
    if (count <= 3) return 'w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28';
    if (count <= 4) return 'w-16 h-16 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24';
    if (count <= 6) return 'w-16 h-16 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20';
    return 'w-16 h-16 sm:w-12 sm:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16'; // 6'dan fazla için
  };

  // Kategori sayısına göre yazı boyutu - mobilde büyük, desktop'ta sayıya göre
  const getTextSize = (count: number) => {
    // Responsive text sizes
    if (count <= 3) return 'text-lg sm:text-lg lg:text-xl xl:text-2xl';
    if (count <= 4) return 'text-lg sm:text-base lg:text-lg xl:text-xl';
    if (count <= 6) return 'text-lg sm:text-sm lg:text-base xl:text-lg';
    return 'text-lg sm:text-xs lg:text-sm xl:text-base'; // 6'dan fazla için
  };

  const gridColsClass = getGridCols(categories.length);
  const imageSizeClass = getImageSize(categories.length);
  const textSizeClass = getTextSize(categories.length);

  return (
    <div className="w-full bg-white py-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
      <div className={`grid ${gridColsClass} gap-1 sm:gap-2`}>
        {categories.map((cat, idx) => (
          <div
            key={idx}
            onClick={() => handleCategoryClick(cat)}
            className={`flex flex-row sm:flex-col items-center justify-start sm:justify-center rounded-xl py-4 sm:py-4 px-4 sm:px-2 shadow-sm cursor-pointer gap-4 sm:gap-0`}
            style={{ backgroundColor: cat.color || '#673ab7' }}
          >
            {cat.image ? (
              <div className={`relative ${imageSizeClass} rounded-full mb-0 sm:mb-2 border-2 border-white shadow-md bg-white overflow-hidden flex-shrink-0`}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 60px, 80px"
                  className="object-cover"
                  priority={idx < 2}
                />
              </div>
            ) : (
              <div className={`${imageSizeClass} rounded-full flex items-center justify-center bg-white font-bold mb-0 sm:mb-2 border-2 border-white shadow-md flex-shrink-0`}
                   style={{ color: cat.color || '#673ab7' }}>
                {cat.name.charAt(0)}
              </div>
            )}
            <div className={`text-white ${textSizeClass} font-semibold text-left sm:text-center mt-0 sm:mt-1 line-clamp-2 px-1 flex-1 sm:flex-initial`}>
              {cat.name}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default PopularCategories;
