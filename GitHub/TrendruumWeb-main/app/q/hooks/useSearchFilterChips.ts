"use client";

import { useMemo } from 'react';
import { FilterState, FilterChip } from '../types';

interface UseSearchFilterChipsProps {
  appliedFilters: FilterState;
  appliedAttributeFilters: Record<string, string[]>;
  appliedSortType: string;
  availableBrands: any[];
  availableColors: any[];
  subCategories: any[];
  allAttributes: any[];
  sortOptions: any[];
  formatPriceLabel: (value: number) => string;
}

export function useSearchFilterChips({
  appliedFilters,
  appliedAttributeFilters,
  appliedSortType,
  availableBrands,
  availableColors,
  subCategories,
  allAttributes,
  sortOptions,
  formatPriceLabel
}: UseSearchFilterChipsProps): FilterChip[] {
  return useMemo(() => {
    const chips: FilterChip[] = [];

    const addChip = (key: string, label: string | null | undefined) => {
      if (!label) return;
      chips.push({ key, label });
    };

    appliedFilters.categories?.forEach((categorySlug) => {
      const categoryName = subCategories.find((category) => category.slug === categorySlug)?.name || categorySlug;
      addChip(`category-${categorySlug}`, categoryName);
    });

    appliedFilters.brands?.forEach((brandSlug) => {
      const brandName = availableBrands.find((brand) => brand.slug === brandSlug)?.name || brandSlug;
      addChip(`brand-${brandSlug}`, brandName);
    });

    appliedFilters.colors?.forEach((colorSlug) => {
      const colorName = availableColors.find((color: any) => color.slug === colorSlug)?.name || colorSlug;
      addChip(`color-${colorSlug}`, colorName);
    });

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
      addChip('price-range', priceLabel);
    }

    appliedFilters.product_stars?.forEach((star) => {
      addChip(`stars-${star}`, `${star}+ Yıldız`);
    });

    Object.entries(appliedAttributeFilters).forEach(([attrSlug, values]) => {
      if (!values || values.length === 0) return;
      const attribute = allAttributes.find((attr: any) => attr.slug === attrSlug);
      const attributeName = attribute?.name || attrSlug;
      values.forEach((valueSlug) => {
        const valueName = attribute?.values?.find((value: any) => value.slug === valueSlug)?.name || valueSlug;
        addChip(`attr-${attrSlug}-${valueSlug}`, `${attributeName}: ${valueName}`);
      });
    });

    return chips;
  }, [
    appliedFilters,
    appliedAttributeFilters,
    appliedSortType,
    availableBrands,
    availableColors,
    subCategories,
    allAttributes,
    sortOptions,
    formatPriceLabel
  ]);
}

