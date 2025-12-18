"use client";

import { XMarkIcon } from '@heroicons/react/24/outline';
import CategoryFilters from './CategoryFilters';
import { FilterState } from './types';

interface MobileFiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  filterVisibility: Record<string, boolean>;
  availableColors: any[];
  availableGenders: any[];
  categoryAttributes: any[];
  subCategories: any[];
  subCategoriesLoading: boolean;
  selectedSubcategories: string[];
  priceRange: { min?: number; max?: number };
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  onAttributeFilterChange: (attributeSlug: string, value: string, checked: boolean) => void;
  onPriceChange: (priceRange: { min?: number; max?: number }) => void;
  onSubcategorySelection: (subcategorySlug: string, checked: boolean) => void;
  onSelectAllSubcategories: (selectAll: boolean) => void;
  onToggleFilterVisibility: (filterType: string) => void;
  getSelectedValues: (filterType: string) => string[];
  getSelectedCount: (filterType: string) => number;
}

export default function MobileFiltersModal({
  isOpen,
  onClose,
  onApply,
  filters,
  attributeFilters,
  filterVisibility,
  availableColors,
  availableGenders,
  categoryAttributes,
  subCategories,
  subCategoriesLoading,
  selectedSubcategories,
  priceRange,
  onFilterChange,
  onAttributeFilterChange,
  onPriceChange,
  onSubcategorySelection,
  onSelectAllSubcategories,
  onToggleFilterVisibility,
  getSelectedValues,
  getSelectedCount
}: MobileFiltersModalProps) {
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
        <CategoryFilters
          filters={filters}
          attributeFilters={attributeFilters}
          filterVisibility={filterVisibility}
          availableColors={availableColors}
          availableGenders={availableGenders}
          categoryAttributes={categoryAttributes}
          subCategories={subCategories}
          subCategoriesLoading={subCategoriesLoading}
          selectedSubcategories={selectedSubcategories}
          priceRange={priceRange}
          onFilterChange={onFilterChange}
          onAttributeFilterChange={onAttributeFilterChange}
          onPriceChange={onPriceChange}
          onSubcategorySelection={onSubcategorySelection}
          onSelectAllSubcategories={onSelectAllSubcategories}
          onToggleFilterVisibility={onToggleFilterVisibility}
          getSelectedValues={getSelectedValues}
          getSelectedCount={getSelectedCount}
        />
      </div>
    </div>
  );
}

