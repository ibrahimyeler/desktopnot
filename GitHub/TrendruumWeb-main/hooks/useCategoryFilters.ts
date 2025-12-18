"use client";

import { useState, useCallback, useMemo } from 'react';

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

export const useCategoryFilters = () => {
  const [filters, setFilters] = useState<FilterState>({});
  const [attributeFilters, setAttributeFilters] = useState<Record<string, string[]>>({});
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({
    marka: false,
    renk: false,
    cinsiyet: false,
    fiyat: false,
    yildiz: false,
    altKategori: false
  });

  // Filtre değişiklik handler'ı
  const handleFilterChange = useCallback((filterType: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[filterType as keyof FilterState] as string[] || [];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      return {
        ...prev,
        [filterType]: newValues
      };
    });
  }, []);

  // Attribute filtre değişiklik handler'ı
  const handleAttributeFilterChange = useCallback((attributeSlug: string, value: string, checked: boolean) => {
    setAttributeFilters(prev => {
      const currentValues = prev[attributeSlug] || [];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      return {
        ...prev,
        [attributeSlug]: newValues
      };
    });
  }, []);

  // Fiyat filtresi değişiklik handler'ı
  const handlePriceChange = useCallback((priceRange: { min?: number; max?: number }) => {
    setFilters(prev => {
      const hasMin = typeof priceRange.min === 'number';
      const hasMax = typeof priceRange.max === 'number';
      if (!hasMin && !hasMax) {
        const updated = { ...prev };
        delete updated.prices;
        return updated;
      }
      return {
        ...prev,
        prices: {
          ...(hasMin ? { min: priceRange.min } : {}),
          ...(hasMax ? { max: priceRange.max } : {})
        }
      };
    });
  }, []);

  // Filtre görünürlüğü toggle
  const toggleFilterVisibility = useCallback((filterKey: string) => {
    setFilterVisibility(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  }, []);

  // Filtreleri temizle
  const clearFilters = useCallback(() => {
    setFilters({});
    setAttributeFilters({});
  }, []);

  // Seçili değerleri hesapla
  const getSelectedValues = useCallback((filterType: string, availableOptions: any[] = []) => {
    switch (filterType) {
      case 'colors':
        return availableOptions
          .filter(color => filters.colors?.includes(color.slug))
          .map(color => color.name);
      case 'genders':
        return availableOptions
          .filter(gender => filters.genders?.includes(gender.slug))
          .map(gender => gender.name);
      case 'subcategories':
        return filters.selectedSubcategories || [];
      case 'stars':
        return filters.product_stars?.map(star => `${star} Yıldız`) || [];
      default:
        // Attribute filtreleri için
        if (attributeFilters[filterType]) {
          return attributeFilters[filterType];
        }
        return [];
    }
  }, [filters, attributeFilters]);

  const getSelectedCount = useCallback((filterType: string) => {
    switch (filterType) {
      case 'colors':
        return filters.colors?.length || 0;
      case 'genders':
        return filters.genders?.length || 0;
      case 'subcategories':
        return filters.selectedSubcategories?.length || 0;
      case 'stars':
        return filters.product_stars?.length || 0;
      default:
        // Attribute filtreleri için
        return attributeFilters[filterType]?.length || 0;
    }
  }, [filters, attributeFilters]);

  // Aktif filtre kontrolü
  const hasActiveFilters = useCallback(() => {
    // Ana filtreleri kontrol et
    const hasMainFilters = Object.entries(filters).some(([key, value]) => {
      if (key === 'prices') {
        // Fiyat filtresi için özel kontrol
        const priceValue = value as { min?: number; max?: number } | undefined;
        return priceValue && (typeof priceValue.min === 'number' || typeof priceValue.max === 'number');
      }
      if (Array.isArray(value) && value.length > 0) return true;
      return false;
    });
    
    // Attribute filtreleri kontrol et
    const hasAttributeFilters = Object.values(attributeFilters).some(values => values.length > 0);
    
    return hasMainFilters || hasAttributeFilters;
  }, [filters, attributeFilters]);

  return {
    filters,
    setFilters,
    attributeFilters,
    setAttributeFilters,
    filterVisibility,
    setFilterVisibility,
    handleFilterChange,
    handleAttributeFilterChange,
    handlePriceChange,
    toggleFilterVisibility,
    clearFilters,
    getSelectedValues,
    getSelectedCount,
    hasActiveFilters
  };
};
