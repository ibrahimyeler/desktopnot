"use client";

import { XMarkIcon } from '@heroicons/react/24/outline';
import SearchFilters from './SearchFilters';
import { FilterState } from '../types';

interface SearchMobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  filterVisibility: Record<string, boolean>;
  availableBrands: any[];
  availableColors: any[];
  subCategories: any[];
  allAttributes: any[];
  allVariants: any[];
  priceRange: { min: number; max: number };
  brandSearchQuery: string;
  onBrandSearchChange: (query: string) => void;
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  onVariantFilterChange: (variantSlug: string, value: string, checked: boolean) => void;
  onPriceChange: (priceRange: { min?: number; max?: number }) => void;
  onAttributeFilterChange: (attributeSlug: string, value: string, checked: boolean) => void;
  onToggleFilterVisibility: (filterType: string) => void;
}

export default function SearchMobileFiltersModal({
  isOpen,
  onClose,
  onApply,
  filters,
  attributeFilters,
  filterVisibility,
  availableBrands,
  availableColors,
  subCategories,
  allAttributes,
  allVariants,
  priceRange,
  brandSearchQuery,
  onBrandSearchChange,
  onFilterChange,
  onVariantFilterChange,
  onPriceChange,
  onAttributeFilterChange,
  onToggleFilterVisibility
}: SearchMobileFiltersModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483000] md:hidden bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Filtre modalını kapat"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-gray-900">Filtrele</h2>
        <button
          onClick={onApply}
          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-orange-600 transition-colors"
        >
          Uygula
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4">
        <SearchFilters
          filters={filters}
          attributeFilters={attributeFilters}
          filterVisibility={filterVisibility}
          availableBrands={availableBrands}
          availableColors={availableColors}
          subCategories={subCategories}
          allAttributes={allAttributes}
          allVariants={allVariants}
          priceRange={priceRange}
          brandSearchQuery={brandSearchQuery}
          onBrandSearchChange={onBrandSearchChange}
          onFilterChange={onFilterChange}
          onVariantFilterChange={onVariantFilterChange}
          onPriceChange={onPriceChange}
          onAttributeFilterChange={onAttributeFilterChange}
          onToggleFilterVisibility={onToggleFilterVisibility}
          onApply={onApply}
        />
      </div>
    </div>
  );
}

