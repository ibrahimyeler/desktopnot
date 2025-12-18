"use client";

import SearchSidebarHeader from './SearchSidebarHeader';
import SearchFilters from './SearchFilters';
import { FilterState } from '../types';

interface SearchSidebarProps {
  searchQuery: string;
  loading: boolean;
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
  onApply: () => Promise<void> | void;
}

export default function SearchSidebar({
  searchQuery,
  loading,
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
  onToggleFilterVisibility,
  onApply
}: SearchSidebarProps) {
  return (
    <div
      className="lg:col-span-3 xl:col-span-3 2xl:col-span-3 hidden lg:block"
      style={{
        maxWidth: '340px',
        flexBasis: '330px',
        minWidth: '320px',
        overflow: 'visible',
        position: 'relative',
        alignSelf: 'start'
      }}
    >
      <div
        className="sticky top-24"
        style={{
          position: 'sticky',
          top: '86px',
          zIndex: 10,
          willChange: 'transform'
        } as React.CSSProperties}
      >
        <SearchSidebarHeader searchQuery={searchQuery} loading={loading} />

        <div className="mt-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
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
    </div>
  );
}


