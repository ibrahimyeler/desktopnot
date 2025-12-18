import React from 'react';
import Image from 'next/image';

interface Category {
  id?: string | number;
  name: string;
  slug: string;
  color?: string;
  image?: string;
}

interface CategoryListTwoColumnProps {
  categories: Category[];
  onCategoryClick?: (categorySlug: string) => void;
}

const CategoryListTwoColumn = ({
  categories = [],
  onCategoryClick,
}: CategoryListTwoColumnProps) => {
  return (
    <div className="w-full max-w-[1600px] mx-auto py-6 sm:py-8">
      {/* Mobile: Alt alta (1 sütun) */}
      <div className="grid grid-cols-1 gap-3 sm:hidden px-2">
        {categories.map((cat, i) => {
          const hasImage = !!cat.image;
          const bgColor = cat.color || '#F3F4F6'; // Fallback renk
          
          return (
            <div
              key={cat.slug || i}
              className="flex items-center rounded-xl p-4 transition-all cursor-pointer group hover:shadow-md"
              style={{ 
                backgroundColor: bgColor,
                minHeight: '80px'
              }}
              onClick={() => onCategoryClick?.(cat.slug)}
            >
              {hasImage && cat.image && (
                <div className="relative w-16 h-16 mr-3 flex items-center justify-center rounded-full bg-white/80 border border-white/50 overflow-hidden shadow-sm">
                  {cat.image.startsWith('data:') ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform"
                      sizes="64px"
                    />
                  )}
                </div>
              )}
              <span className="text-white text-base font-semibold group-hover:scale-105 transition-transform flex-1">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Desktop: Yan yana 2 tane */}
      <div className="hidden sm:grid sm:grid-cols-2 gap-4 md:gap-6 px-2 md:px-0">
        {categories.map((cat, i) => {
          const hasImage = !!cat.image;
          const bgColor = cat.color || '#F3F4F6'; // Fallback renk
          
          return (
            <div
              key={cat.slug || i}
              className="flex items-center rounded-2xl p-5 md:p-6 transition-all cursor-pointer group hover:shadow-lg"
              style={{ 
                backgroundColor: bgColor,
                minHeight: '100px'
              }}
              onClick={() => onCategoryClick?.(cat.slug)}
            >
              {hasImage && cat.image && (
                <div className="relative w-20 h-20 mr-4 flex items-center justify-center rounded-full bg-white/80 border border-white/50 overflow-hidden shadow-sm">
                  {cat.image.startsWith('data:') ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform"
                      sizes="80px"
                    />
                  )}
                </div>
              )}
              <span className="text-white text-lg md:text-xl font-semibold group-hover:scale-105 transition-transform flex-1">
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryListTwoColumn;