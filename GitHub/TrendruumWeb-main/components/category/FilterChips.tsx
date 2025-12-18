import { useMemo } from 'react';
import { FilterState } from './types';

export interface FilterChip {
  key: string;
  label: string;
}

interface UseFilterChipsProps {
  appliedFilters: FilterState;
  appliedAttributeFilters: Record<string, string[]>;
  appliedSortType: string;
  availableGenders?: any[];
  subCategories?: any[];
  availableColors?: any[];
  categoryAttributes?: any[];
  sortOptions?: any[];
  formatPriceLabel: (value: number) => string;
}

export function useFilterChips({
  appliedFilters,
  appliedAttributeFilters,
  appliedSortType,
  availableGenders,
  subCategories,
  availableColors,
  categoryAttributes,
  sortOptions,
  formatPriceLabel
}: UseFilterChipsProps): FilterChip[] {
  return useMemo(() => {
    const chips: FilterChip[] = [];

    const addChip = (key: string, label?: string | null) => {
      if (!label) return;
      chips.push({ key, label });
    };

    if (appliedSortType && (appliedSortType === 'price_asc' || appliedSortType === 'price_desc')) {
      const sortLabel = (sortOptions || []).find((option) => option.value === appliedSortType)?.name;
      addChip(`sort-${appliedSortType}`, sortLabel);
    }

    appliedFilters.genders?.forEach((gender) => {
      const genderLabel = availableGenders?.find((item: any) => item.slug === gender)?.name
        || (gender === 'kadin-kiz' ? 'Kadın/Kız' : gender === 'erkek' ? 'Erkek' : gender === 'unisex' ? 'Unisex' : gender);
      addChip(`gender-${gender}`, genderLabel);
    });

    appliedFilters.selectedSubcategories?.forEach((subcategorySlug) => {
      const subcategoryName = subCategories?.find((sub: any) => sub.slug === subcategorySlug)?.name || subcategorySlug;
      addChip(`subcategory-${subcategorySlug}`, subcategoryName);
    });

    appliedFilters.colors?.forEach((colorSlug) => {
      const colorName = availableColors?.find((color: any) => color.slug === colorSlug)?.name || colorSlug;
      addChip(`color-${colorSlug}`, colorName);
    });

    // Fiyat filtresi
    const priceFilter = appliedFilters.prices;
    if (priceFilter && (typeof priceFilter.min === 'number' || typeof priceFilter.max === 'number')) {
      const minLabel = typeof priceFilter.min === 'number' ? `${formatPriceLabel(priceFilter.min)} TL` : null;
      const maxLabel = typeof priceFilter.max === 'number' ? `${formatPriceLabel(priceFilter.max)} TL` : null;
      let priceLabel: string | null = null;
      if (minLabel && maxLabel) {
        priceLabel = `Fiyat: ${minLabel} - ${maxLabel}`;
      } else if (minLabel) {
        priceLabel = `Fiyat: ${minLabel}+`;
      } else if (maxLabel) {
        priceLabel = `Fiyat: ≤ ${maxLabel}`;
      }
      if (priceLabel) {
        addChip('price-range', priceLabel);
      }
    }

    appliedFilters.product_stars?.forEach((star) => {
      addChip(`stars-${star}`, `${star}+ Yıldız`);
    });

    Object.entries(appliedAttributeFilters).forEach(([attributeSlug, values]) => {
      if (!values || values.length === 0) return;
      const attribute = categoryAttributes?.find((attr: any) => attr.slug === attributeSlug);
      const attributeName = attribute?.name || attributeSlug;
      values.forEach((valueSlug) => {
        const valueName = attribute?.values?.find((value: any) => value.slug === valueSlug)?.name || valueSlug;
        addChip(`attr-${attributeSlug}-${valueSlug}`, `${attributeName}: ${valueName}`);
      });
    });

    return chips;
  }, [
    appliedFilters,
    appliedAttributeFilters,
    appliedSortType,
    availableGenders,
    subCategories,
    availableColors,
    categoryAttributes,
    sortOptions,
    formatPriceLabel
  ]);
}

