import React from 'react';
import Image from 'next/image';

export interface Category {
  id?: string | number;
  name: string;
  slug: string;
  color: string;
  image?: string;
}

export interface CategoryGridProps {
  categories?: Category[];
  onCategoryClick?: (categorySlug: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories = [], onCategoryClick }) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-4 sm:py-8">
      {/* Mobile: Grid layout */}
      <div className="grid grid-cols-2 gap-3 px-2 sm:hidden">
        {categories.map((cat, index) => (
          <div
            key={cat.slug || index}
            className="flex flex-col items-center bg-gray-100 rounded-lg p-3 transition-all cursor-pointer group touch-manipulation active:scale-95"
            style={{ 
              backgroundColor: `${cat.color}15`,
              borderColor: cat.color,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            onClick={() => onCategoryClick?.(cat.slug)}
          >
            {cat.image ? (
              <div className="relative w-12 h-12 mb-2 flex items-center justify-center rounded-full overflow-hidden" style={{ backgroundColor: cat.color }}>
                {cat.image.startsWith('data:') ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                )}
              </div>
            ) : (
              <div className="w-12 h-12 mb-2 flex items-center justify-center rounded-full text-white text-lg font-bold" style={{ backgroundColor: cat.color }}>
                {cat.name.charAt(0)}
              </div>
            )}
            <span className="text-gray-700 text-sm font-semibold group-hover:text-orange-500 transition-colors text-center leading-tight">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop: Grid layout - max 6 columns */}
      <div className="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 max-w-[1600px] mx-auto px-4">
        {categories.map((cat, index) => (
          <div
            key={cat.slug || index}
            className="flex flex-col items-center bg-gray-100 rounded-xl p-6 transition-all cursor-pointer group hover:shadow-lg"
            style={{ 
              backgroundColor: `${cat.color}15`,
              borderColor: cat.color,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
            onClick={() => onCategoryClick?.(cat.slug)}
          >
            {cat.image ? (
              <div className="relative w-16 h-16 mb-3 flex items-center justify-center rounded-full overflow-hidden" style={{ backgroundColor: cat.color }}>
                {cat.image.startsWith('data:') ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain"
                    sizes="64px"
                  />
                )}
              </div>
            ) : (
              <div className="w-16 h-16 mb-3 flex items-center justify-center rounded-full text-white text-2xl font-bold" style={{ backgroundColor: cat.color }}>
                {cat.name.charAt(0)}
              </div>
            )}
            <span className="text-gray-700 text-base font-semibold group-hover:text-orange-500 transition-colors text-center leading-tight">
              {cat.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid; 