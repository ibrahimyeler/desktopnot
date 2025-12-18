"use client";

import React from 'react';
import SearchResultInfo from '../../../components/flashUrunler/SearchResultInfo';
import SortingButton from '../../../components/flashUrunler/SortingButton';
import { Product } from '../../../types/product';

interface SearchDesktopHeaderProps {
  searchQuery: string;
  loading: boolean;
  sortedProducts: Product[];
  totalProducts: number;
  filteredProducts: Product[];
  currentSortType: string;
  sortOptions?: Array<{ id: string; name: string; value: string }>;
  onSortedProducts?: (products: Product[]) => void;
  onSortChange: (sortType: string) => void;
}

const SearchDesktopHeader: React.FC<SearchDesktopHeaderProps> = ({
  searchQuery,
  loading,
  sortedProducts,
  totalProducts,
  filteredProducts,
  currentSortType,
  sortOptions,
  onSortedProducts,
  onSortChange
}) => {
  return (
    <div className="hidden lg:flex justify-between items-center mb-4">
      <SearchResultInfo 
        category={searchQuery}
        resultCount={sortedProducts.length}
        totalCount={totalProducts}
        loading={loading}
      />
      <div className="flex items-center space-x-3">
        <SortingButton 
          products={filteredProducts}
          onSortedProducts={onSortedProducts || (() => {})}
          sortOptions={sortOptions}
          onSortChange={onSortChange}
          useServerSorting={true}
          currentSortType={currentSortType}
        />
      </div>
    </div>
  );
};

export default SearchDesktopHeader;

