"use client";

import React, { useMemo } from 'react';
import { 
  DynamicFilter,
  AttributeFilter,
  ColorFilter,
  PriceFilter,
  StarFilter
} from '../../../components/filter';

interface FilterState {
  categories?: string[];
  brands?: string[];
  colors?: string[];
  genders?: string[];
  product_stars?: string[];
  prices?: {
    min?: number;
    max?: number;
  };
}

interface SearchFiltersProps {
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
  onToggleFilterVisibility: (filterKey: string) => void;
  onApply: () => void;
}

const VISIBLE_FILTER_COUNT = 8;
const FILTER_SECTION_ESTIMATED_HEIGHT = 62; // px, approx height per filter header

const SearchFilters: React.FC<SearchFiltersProps> = ({
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
}) => {
  const priceSelectedValues = (() => {
    const hasMin = typeof filters.prices?.min === 'number';
    const hasMax = typeof filters.prices?.max === 'number';
    if (!hasMin && !hasMax) return [];
    const minAmount = hasMin ? (filters.prices?.min as number) : undefined;
    const maxAmount = hasMax ? (filters.prices?.max as number) : undefined;
    const minLabel = minAmount !== undefined ? `${minAmount.toLocaleString('tr-TR')} TL` : '0 TL';
    const maxLabel = maxAmount !== undefined ? `${maxAmount.toLocaleString('tr-TR')} TL` : 'Limitsiz';
    return [`${minLabel} - ${maxLabel}`];
  })();

  const filteredAttributes = useMemo(() => (
    allAttributes.filter(attr => 
      attr.slug !== 'product_stars' &&
      attr.slug !== 'uretici-bilgisi' &&
      attr.slug !== 'yikama-talimati' &&
      attr.slug !== 'materyal-bileseni' &&
      attr.slug !== 'kutu-durumu' &&
      attr.slug !== 'desen' &&
      attr.slug !== 'surdurulebilirlik-detayi' &&
      attr.slug !== 'urun-guvenligi-bilgisi' &&
      attr.slug !== 'paket-gorseli-on' &&
      attr.slug !== 'paket-gorseli-arka' &&
      attr.slug !== 'kullanim-talimatiuyarilari' &&
      attr.slug !== 'cesit' &&
      attr.slug !== 'persona' &&
      attr.slug !== 'cinsiyet' &&
      attr.values && attr.values.length > 0
    )
  ), [allAttributes]);

  const filterSections: React.ReactNode[] = [];

  filterSections.push(
    <DynamicFilter
      key="brand"
      title="Marka"
      isVisible={filterVisibility.marka ?? false}
      onToggle={() => onToggleFilterVisibility('marka')}
      selectedValues={filters.brands || []}
      selectedCount={filters.brands?.length || 0}
    >
      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Marka ara..."
            value={brandSearchQuery}
            onChange={(e) => onBrandSearchChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {availableBrands.length > 0 ? (
            availableBrands.map((brand, index) => (
              <label key={`brand-${brand.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.brands?.includes(brand.slug) || false}
                  onChange={(e) => onFilterChange('brands', brand.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
                {brand.count && brand.count > 0 && (
                  <span className="text-xs text-gray-500">({brand.count})</span>
                )}
              </label>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500 text-xs">
              Bu kategoride marka bulunamadı.
            </div>
          )}
        </div>
      </div>
    </DynamicFilter>
  );

  filterSections.push(
    <DynamicFilter
      key="gender"
      title="Cinsiyet"
      isVisible={filterVisibility.cinsiyet ?? false}
      onToggle={() => onToggleFilterVisibility('cinsiyet')}
      selectedValues={filters.genders?.map(gender => 
        gender === 'kadin-kiz' ? 'Kadın/Kız' : 
        gender === 'erkek' ? 'Erkek' : 
        gender === 'unisex' ? 'Unisex' : gender
      ) || []}
      selectedCount={filters.genders?.length || 0}
    >
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {[
          { value: 'kadin-kiz', label: 'Kadın/Kız' },
          { value: 'erkek', label: 'Erkek' },
          { value: 'unisex', label: 'Unisex' }
        ].map((option) => (
          <label key={option.value} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
            <input
              type="checkbox"
              checked={filters.genders?.includes(option.value) || false}
              onChange={(e) => onFilterChange('genders', option.value, e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
            />
            <span className="text-sm text-gray-700 flex-1">{option.label}</span>
          </label>
        ))}
      </div>
    </DynamicFilter>
  );

  if (availableColors.length > 0) {
    filterSections.push(
      <DynamicFilter
        key="color"
        title="Renk"
        isVisible={filterVisibility.renk ?? false}
        onToggle={() => onToggleFilterVisibility('renk')}
        selectedValues={availableColors
          .filter(color => filters.colors?.includes(color.slug))
          .map(color => color.name)}
        selectedCount={filters.colors?.length || 0}
      >
        <div className="max-h-48 overflow-y-auto pr-1">
          <ColorFilter
            colors={availableColors}
            selectedColors={filters.colors || []}
            onColorChange={(color, checked) => onFilterChange('colors', color, checked)}
          />
        </div>
      </DynamicFilter>
    );
  }

  // Variant filtreleri (renk hariç) - renk filtresinden sonra göster
  // Özellikle beden varyantını göster
  const nonColorVariants = allVariants.filter((variant: any) => variant.slug !== 'renk');
  nonColorVariants.forEach((variant: any) => {
    if (variant.values && variant.values.length > 0) {
      const variantKey = `variant-${variant.slug}`;
      const selectedValues = filters.variants?.[variant.slug] || [];
      filterSections.push(
        <DynamicFilter
          key={variantKey}
          title={variant.name}
          isVisible={filterVisibility[variantKey] ?? false}
          onToggle={() => onToggleFilterVisibility(variantKey)}
          selectedValues={variant.values
            .filter((value: any) => selectedValues.includes(value.slug))
            .map((value: any) => value.name || value.slug)}
          selectedCount={selectedValues.length}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {variant.values.map((value: any, index: number) => (
              <label key={`variant-value-${variant.slug}-${value.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value.slug)}
                  onChange={(e) => onVariantFilterChange(variant.slug, value.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{value.name || value.slug}</span>
                {value.count !== undefined && value.count > 0 && (
                  <span className="text-xs text-gray-500">({value.count})</span>
                )}
              </label>
            ))}
          </div>
        </DynamicFilter>
      );
    }
  });

  if (subCategories.length > 0) {
    filterSections.push(
      <DynamicFilter
        key="category"
        title="Kategori"
        isVisible={filterVisibility.altKategori ?? false}
        onToggle={() => onToggleFilterVisibility('altKategori')}
        selectedValues={subCategories
          .filter(category => filters.categories?.includes(category.slug))
          .map(category => category.name)}
        selectedCount={filters.categories?.length || 0}
      >
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {subCategories.map((category, index) => (
            <label key={`category-${category.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input
                type="checkbox"
                checked={filters.categories?.includes(category.slug) || false}
                onChange={(e) => onFilterChange('categories', category.slug, e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
              />
              <span className="text-sm text-gray-700 flex-1">{category.name}</span>
            </label>
          ))}
        </div>
      </DynamicFilter>
    );
  }

  filterSections.push(
    <DynamicFilter
      key="price"
      title="Fiyat"
      isVisible={filterVisibility.fiyat ?? false}
      onToggle={() => onToggleFilterVisibility('fiyat')}
      selectedValues={priceSelectedValues}
      selectedCount={
        typeof filters.prices?.min === 'number' || typeof filters.prices?.max === 'number' ? 1 : 0
      }
    >
      <div className="max-h-48 overflow-y-auto pr-1">
        <PriceFilter
          isVisible={filterVisibility.fiyat ?? false}
          onToggle={() => onToggleFilterVisibility('fiyat')}
          priceRange={priceRange}
          filters={filters}
          onFilterChange={onPriceChange}
          onApply={onApply}
        />
      </div>
    </DynamicFilter>
  );

  filterSections.push(
    <DynamicFilter
      key="stars"
      title="Yıldız Puanı"
      isVisible={filterVisibility.yildiz ?? false}
      onToggle={() => onToggleFilterVisibility('yildiz')}
      selectedValues={filters.product_stars?.map(star => `${star} Yıldız`) || []}
      selectedCount={filters.product_stars?.length || 0}
    >
      <div className="max-h-48 overflow-y-auto pr-1">
        <StarFilter
          isVisible={filterVisibility.yildiz ?? false}
          onToggle={() => onToggleFilterVisibility('yildiz')}
          selectedStars={filters.product_stars || []}
          onStarChange={(star, checked) => onFilterChange('product_stars', star, checked)}
        />
      </div>
    </DynamicFilter>
  );

  filteredAttributes.forEach((attribute, index) => {
    filterSections.push(
      <DynamicFilter
        key={`attribute-${attribute.slug}-${index}`}
        title={attribute.name}
        isVisible={filterVisibility[attribute.slug] ?? false}
        onToggle={() => onToggleFilterVisibility(attribute.slug)}
        selectedValues={attribute.values
          ?.filter((value: any) => attributeFilters[attribute.slug]?.includes(value.slug))
          .map((value: any) => value.name || value.slug) || []}
        selectedCount={attributeFilters[attribute.slug]?.length || 0}
      >
        <div className="max-h-48 overflow-y-auto pr-1">
          <AttributeFilter
            attribute={attribute}
            selectedValues={attributeFilters[attribute.slug] || []}
            onValueChange={(value, checked) => onAttributeFilterChange(attribute.slug, value, checked)}
          />
        </div>
      </DynamicFilter>
    );
  });

  const visibleFilterSlots = Math.min(filterSections.length, VISIBLE_FILTER_COUNT);
  const scrollAreaHeight = Math.max(visibleFilterSlots, 1) * FILTER_SECTION_ESTIMATED_HEIGHT;

  return (
    <div className="bg-white rounded-lg flex flex-col">
      <div className="px-4 py-2 flex flex-col gap-3">
        <div
          className="space-y-2 overflow-y-auto pr-1"
          style={{
            maxHeight: scrollAreaHeight,
          }}
        >
          {filterSections}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <button 
            onClick={onApply}
            className="w-full bg-orange-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Uygula
          </button>
        </div>
      </div>

    </div>
  );
};

export default SearchFilters;
