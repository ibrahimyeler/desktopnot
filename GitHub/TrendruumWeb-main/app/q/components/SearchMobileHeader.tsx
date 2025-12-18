"use client";

import React from 'react';
import { ArrowsUpDownIcon, FunnelIcon } from '@heroicons/react/24/outline';

interface SortOption {
  id?: string;
  value: string;
  name?: string;
  label?: string;
}

interface SearchMobileHeaderProps {
  searchQuery?: string;
  mobileFiltersOpen: boolean;
  mobileSortOpen: boolean;
  onToggleFilters: () => void;
  onToggleSort: () => void;
  currentSortType: string;
  sortOptions: SortOption[];
  hasActiveFilters: boolean;
}

const SearchMobileHeader: React.FC<SearchMobileHeaderProps> = ({
  searchQuery,
  mobileFiltersOpen,
  mobileSortOpen,
  onToggleFilters,
  onToggleSort,
  currentSortType,
  sortOptions,
  hasActiveFilters
}) => {
  const activeSortOption = React.useMemo(() => {
    const found = sortOptions?.find((option) => option.value === currentSortType);
    return found?.name || found?.label || 'Önerilen Sıralama';
  }, [sortOptions, currentSortType]);

  return (
    <div className="lg:hidden mb-0 space-y-3">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h1 className="text-lg font-bold text-gray-900 mb-1 text-center">
          {searchQuery || 'Arama'}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white rounded-lg border shadow-sm">
        <button
            onClick={onToggleSort}
            className="w-full flex items-center justify-center gap-2 py-2 text-gray-800 font-semibold text-sm"
            aria-label="Sıralama seçeneklerini aç"
        >
            <ArrowsUpDownIcon className={`w-5 h-5 ${mobileSortOpen ? 'text-orange-600' : 'text-orange-500'}`} />
            <span>{activeSortOption}</span>
        </button>
        </div>

        <div className="flex-1 bg-white rounded-lg border shadow-sm relative">
        <button
            onClick={onToggleFilters}
            className="w-full flex items-center justify-center gap-2 py-2 text-gray-800 font-semibold text-sm"
            aria-label="Filtre modalını aç"
        >
            <FunnelIcon className={`w-5 h-5 ${mobileFiltersOpen ? 'text-orange-600' : 'text-orange-500'}`} />
          <span>Filtrele</span>
            {hasActiveFilters && (
              <span className="inline-flex w-2 h-2 rounded-full bg-orange-500" aria-hidden="true" />
            )}
        </button>
        </div>
      </div>
    </div>
  );
};

export default SearchMobileHeader;

