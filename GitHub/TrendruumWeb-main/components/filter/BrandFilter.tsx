"use client";

import React from 'react';

interface Brand {
  name: string;
  slug: string;
  count?: number;
}

interface BrandFilterProps {
  brands: Brand[];
  selectedBrands: string[];
  onBrandChange: (brand: string, checked: boolean) => void;
}

const BrandFilter: React.FC<BrandFilterProps> = ({
  brands,
  selectedBrands,
  onBrandChange
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {brands.map((brand, index) => (
          <label key={`brand-${brand.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBrands.includes(brand.slug)}
              onChange={(e) => onBrandChange(brand.slug, e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
            />
            <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default BrandFilter;
