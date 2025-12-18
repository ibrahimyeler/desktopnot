"use client";

import React from 'react';
import SearchResultInfo from '../flashUrunler/SearchResultInfo';
import SortingButton from '../flashUrunler/SortingButton';
import { Product } from '../../types/product';

interface CategoryHeaderProps {
  category: string;
  categoryData: any;
  sortedProducts: Product[];
  totalProducts: number;
  loading: boolean;
  filteredProducts: Product[];
  sortOptions: any[];
  onSortChange: (sortType: string) => void;
  onSortedProducts: (products: Product[]) => void;
  onCopyXmlFeed: (event: React.MouseEvent) => void;
  isMobile?: boolean;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  category,
  categoryData,
  sortedProducts,
  totalProducts,
  loading,
  filteredProducts,
  sortOptions,
  onSortChange,
  onSortedProducts,
  onCopyXmlFeed,
  isMobile = false
}) => {
  if (isMobile) {
    return null;
  }

  return (
    <div className="hidden lg:flex justify-between items-center mb-4">
      <SearchResultInfo 
        category={category}
        resultCount={sortedProducts.length}
        totalCount={totalProducts}
        loading={loading}
      />
      <div className="flex items-center space-x-3">
        {/* XML Feed Copy Button - Görünmez ama Tıklanabilir */}
        <button
          onClick={onCopyXmlFeed}
          className="opacity-0 w-8 h-8 cursor-pointer absolute -left-2 top-1/2 transform -translate-y-1/2 z-10"
          title={`${category} XML Feed Linkini Kopyala`}
        >
          .
        </button>
        
        <SortingButton 
          products={filteredProducts}
          onSortedProducts={onSortedProducts}
          sortOptions={sortOptions}
          onSortChange={onSortChange}
          useServerSorting={true}
        />
      </div>
    </div>
  );
};

export default CategoryHeader;
