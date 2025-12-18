"use client";

import React from 'react';
import CategoryFilters from './CategoryFilters';
import { Product } from '../../types/product';

interface FilterState {
  categories?: string[];
  brands?: string[];
  colors?: string[];
  genders?: string[];
  product_stars?: string[];
  sort_fields?: string;
  sort_types?: string;
  gender?: string;
  stars?: string;
  prices?: {
    min?: number;
    max?: number;
  };
  sizes?: string[];
  sellers?: string[];
  sellerTypes?: string[];
  selectedSubcategories?: string[];
}

interface CategorySidebarProps {
  categoryData: any;
  category: string;
  sortedProducts: Product[];
  loading: boolean;
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  filterVisibility: Record<string, boolean>;
  availableColors: any[];
  availableGenders: any[];
  categoryAttributes: any[];
  subCategories: any[];
  subCategoriesLoading: boolean;
  selectedSubcategories: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  onAttributeFilterChange: (attributeSlug: string, value: string, checked: boolean) => void;
  onPriceChange: (priceRange: { min?: number; max?: number }) => void;
  onSubcategorySelection: (subcategorySlug: string, checked: boolean) => void;
  onSelectAllSubcategories: (selectAll: boolean) => void;
  onToggleFilterVisibility: (filterKey: string) => void;
  getSelectedValues: (filterType: string) => string[];
  getSelectedCount: (filterType: string) => number;
  mobileFiltersOpen: boolean;
  onApply?: () => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categoryData,
  category,
  sortedProducts,
  loading,
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
  getSelectedCount,
  mobileFiltersOpen,
  onApply
}) => {
  return (
    <div 
      className={`lg:col-span-3 xl:col-span-3 2xl:col-span-3 hidden lg:block ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}
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
        {/* Desktop Header */}
        <div className="hidden lg:block bg-white rounded-lg p-3 mb-3">
          <h1 className="text-base font-bold text-gray-900 mb-1">
            {categoryData?.name || category || 'Kategori'}
          </h1>
          <p className="text-xs text-gray-500">
          </p>
        </div>

        <div className="mt-3">
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
            category={category}
            categoryData={categoryData}
            onApply={onApply}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;
