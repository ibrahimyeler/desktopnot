"use client";

import { useCallback, useState } from 'react';
import { FilterState } from '../components/category/types';

interface UseCategoryAutoFiltersProps {
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  appliedSortType: string;
  applyFiltersWithValues: (
    targetFilters: FilterState,
    targetAttributeFilters: Record<string, string[]>,
    sortType: string,
    options?: { closeMobileFilters?: boolean; skipURLUpdate?: boolean }
  ) => Promise<void>;
}

export const useCategoryAutoFilters = ({
  filters,
  attributeFilters,
  setFilters,
  appliedSortType,
  applyFiltersWithValues
}: UseCategoryAutoFiltersProps) => {
  const [autoFiltersSet, setAutoFiltersSet] = useState(false);

  const setAutoFilters = useCallback((categorySlug: string) => {
    if (autoFiltersSet) return;

    const categoryName = categorySlug.toLowerCase();

    const applyAuto = (updates: FilterState) => {
      const newFilters = {
        ...filters,
        ...updates,
      };
      setFilters(newFilters);
      void applyFiltersWithValues(newFilters, attributeFilters, appliedSortType || 'price_asc');
      setAutoFiltersSet(true);
    };

    if (categoryName.includes('erkek') || categoryName.includes('gömlek') ||
        categoryName.includes('pantolon') ||
        (categoryName.includes('ayakkabi') && categoryName.includes('erkek'))) {
      applyAuto({ genders: ['erkek'] });
      return;
    }

    if (categoryName.includes('kadin') || categoryName.includes('kiz') ||
        categoryName.includes('elbise') ||
        categoryName.includes('canta') || categoryName.includes('takı') ||
        categoryName.includes('pijama')) {
      applyAuto({ genders: ['kadin-kiz'] });
      return;
    }

    if (categoryName.includes('kozmetik') || categoryName.includes('kisisel-bakim')) {
      setAutoFiltersSet(true);
      return;
    }

    if (categoryName.includes('ayakkabi') && !categoryName.includes('erkek') && !categoryName.includes('kadin')) {
      setAutoFiltersSet(true);
      return;
    }
  }, [
    autoFiltersSet,
    filters,
    attributeFilters,
    appliedSortType,
    setFilters,
    applyFiltersWithValues
  ]);

  return {
    setAutoFilters,
    autoFiltersSet,
    setAutoFiltersSet
  };
};

