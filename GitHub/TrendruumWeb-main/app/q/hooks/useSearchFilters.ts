import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterState {
  categories?: string[];
  brands?: string[];
  colors?: string[];
  genders?: string[];
  product_stars?: string[];
  variants?: Record<string, string[]>; // variant slug -> selected values
  prices?: {
    min?: number;
    max?: number;
  };
}

interface UseSearchFiltersReturn {
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  filterVisibility: Record<string, boolean>;
  currentSortType: string;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  setAttributeFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  setCurrentSortType: React.Dispatch<React.SetStateAction<string>>;
  setFilterVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  handleFilterChange: (filterType: string, value: string, checked: boolean) => void;
  handleVariantFilterChange: (variantSlug: string, value: string, checked: boolean) => void;
  handlePriceChange: (priceRange: { min?: number; max?: number }) => void;
  handleAttributeFilterChange: (attributeSlug: string, value: string, checked: boolean) => void;
  toggleFilterVisibility: (filterKey: string) => void;
  clearFilters: (searchQuery: string, onClear: () => void) => void;
  loadFiltersFromURL: () => void;
  updateURL: (newFilters: FilterState, newAttributeFilters: Record<string, string[]>, newSortType: string) => void;
}

export function useSearchFilters(): UseSearchFiltersReturn {
  const [filters, setFilters] = useState<FilterState>({});
  const [attributeFilters, setAttributeFilters] = useState<Record<string, string[]>>({});
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({
    marka: false,
    renk: false,
    fiyat: false,
    yildiz: false,
    altKategori: false
  });
  const [currentSortType, setCurrentSortType] = useState<string>('price_asc');
  const [pendingURLUpdate, setPendingURLUpdate] = useState<{
    filters: FilterState;
    attributeFilters: Record<string, string[]>;
    sortType: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'yi güncelle (state olarak kaydet)
  const updateURL = useCallback((newFilters: FilterState, newAttributeFilters: Record<string, string[]>, newSortType: string) => {
    setPendingURLUpdate({
      filters: newFilters,
      attributeFilters: newAttributeFilters,
      sortType: newSortType
    });
  }, []);

  // URL güncelleme işlemi (useEffect ile)
  useEffect(() => {
    if (pendingURLUpdate) {
      const { filters: newFilters, attributeFilters: newAttributeFilters, sortType: newSortType } = pendingURLUpdate;
      const query = searchParams.get('q');
      
      const url = new URL(window.location.href);
      // Mevcut URL parametrelerini koru (sadece query parametresini)
      const params = new URLSearchParams();
      
      // Query parametresini ekle (en önemli)
      if (query) {
        params.set('q', query);
      }
      
      // Filtreleri ekle (yalnızca varsa)
      if (newFilters.genders && newFilters.genders.length > 0) {
        params.set('a_cinsiyet', newFilters.genders.join(','));
      }
      if (newFilters.brands && newFilters.brands.length > 0) {
        params.set('brands', newFilters.brands.join(','));
      }
      if (newFilters.categories && newFilters.categories.length > 0) {
        params.set('categories', newFilters.categories.join(','));
      }
      if (newFilters.colors && newFilters.colors.length > 0) {
        params.set('colors', newFilters.colors.join(','));
      }
      if (newFilters.product_stars && newFilters.product_stars.length > 0) {
        params.set('stars', newFilters.product_stars.join(','));
      }
      // Variant filtreleri (v_beden, v_renk vb.)
      if (newFilters.variants) {
        Object.entries(newFilters.variants).forEach(([variantSlug, values]) => {
          if (values && values.length > 0) {
            params.set(`v_${variantSlug}`, values.join(','));
          }
        });
      }
      if (typeof newFilters.prices?.min === 'number') {
        params.set('min_price', newFilters.prices.min.toString());
      }
      if (typeof newFilters.prices?.max === 'number') {
        params.set('max_price', newFilters.prices.max.toString());
      }
      
      // Attribute filtreleri
      Object.entries(newAttributeFilters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params.set(`attr_${key}`, values.join(','));
        }
      });
      
      // Sıralama parametresi - price_asc, price_desc, name_asc veya name_desc ise URL'e ekle
      if (newSortType && (newSortType === 'price_asc' || newSortType === 'price_desc' || newSortType === 'name_asc' || newSortType === 'name_desc')) {
        params.set('sort_types', newSortType);
      }
      
      const newUrl = `${url.pathname}?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
      setPendingURLUpdate(null);
    }
  }, [pendingURLUpdate, searchParams, router]);

  // URL'den filtreleri oku
  const loadFiltersFromURL = useCallback(() => {
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
    const stars = searchParams.get('stars')?.split(',').filter(Boolean) || [];
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort_types') || searchParams.get('sort') || 'price_asc';
    
    const genderParam = searchParams.get('a_cinsiyet');
    let genders: string[] | undefined;
    if (genderParam) {
      genders = genderParam.split(',').filter(Boolean);
    }
    
    const attrFilters: Record<string, string[]> = {};
    const variantFilters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      // a_ prefix'li attribute filtrelerini oku (örn: a_cinsiyet, a_renk vb.)
      if (key.startsWith('a_')) {
        const attrKey = key.replace('a_', '');
        // Cinsiyet filtresini ayrı tut (genders olarak)
        if (attrKey !== 'cinsiyet') {
          attrFilters[attrKey] = value.split(',').filter(Boolean);
        }
      } else if (key.startsWith('attr_')) {
        const attrKey = key.replace('attr_', '');
        attrFilters[attrKey] = value.split(',').filter(Boolean);
      } else if (key.startsWith('v_')) {
        // v_ prefix'li variant filtrelerini oku (örn: v_beden, v_renk vb.)
        const variantKey = key.replace('v_', '');
        variantFilters[variantKey] = value.split(',').filter(Boolean);
      }
    });
    
    const prices = minPrice || maxPrice ? {
      ...(minPrice ? { min: parseInt(minPrice, 10) } : {}),
      ...(maxPrice ? { max: parseInt(maxPrice, 10) } : {})
    } : undefined;
    
    const newFilters = {
      brands: brands.length > 0 ? brands : undefined,
      categories: categories.length > 0 ? categories : undefined,
      colors: colors.length > 0 ? colors : undefined,
      genders: genders,
      product_stars: stars.length > 0 ? stars : undefined,
      variants: Object.keys(variantFilters).length > 0 ? variantFilters : undefined,
      prices
    };
    
    setFilters(newFilters);
    setAttributeFilters(attrFilters);
    setCurrentSortType(sort);
  }, [searchParams]);

  // Filtre değişiklik handler'ı
  const handleFilterChange = useCallback((filterType: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentValues = prev[filterType as keyof FilterState] as string[] || [];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      const newFilters = {
        ...prev,
        [filterType]: newValues
      };
      
      return newFilters;
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

  // Variant filtre değişiklik handler'ı
  const handleVariantFilterChange = useCallback((variantSlug: string, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentVariants = prev.variants || {};
      const currentValues = currentVariants[variantSlug] || [];
      const newValues = checked 
        ? [...currentValues, value]
        : currentValues.filter(v => v !== value);
      
      const newVariants = {
        ...currentVariants,
        [variantSlug]: newValues
      };
      
      // Eğer variant'ın değerleri boşsa, variant'ı kaldır
      if (newValues.length === 0) {
        delete newVariants[variantSlug];
      }
      
      return {
        ...prev,
        variants: Object.keys(newVariants).length > 0 ? newVariants : undefined
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
      
      const newAttributeFilters = {
        ...prev,
        [attributeSlug]: newValues
      };
      
      return newAttributeFilters;
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
  const clearFilters = useCallback((searchQuery: string, onClear: () => void) => {
    setFilters({});
    setAttributeFilters({});
    setCurrentSortType('price_asc');
    setFilterVisibility({
      marka: false,
      renk: false,
      fiyat: false,
      yildiz: false,
      altKategori: false
    });
    
    const url = new URL(window.location.href);
    url.search = `?q=${searchQuery}`;
    router.replace(url.pathname + url.search, { scroll: false });
    
    onClear();
  }, [router]);
  
  // Filtreler değiştiğinde variant filtrelerini de kontrol et
  useEffect(() => {
    setFilterVisibility(prev => {
      const newVisibility: Record<string, boolean> = { ...prev };
      if (filters.brands?.length) newVisibility.marka = true;
      if (filters.colors?.length) newVisibility.renk = true;
      if (filters.categories?.length) newVisibility.altKategori = true;
      if (filters.product_stars?.length) newVisibility.yildiz = true;
      if (filters.prices && (typeof filters.prices.min === 'number' || typeof filters.prices.max === 'number')) {
        newVisibility.fiyat = true;
      }
      // Variant filtreleri için görünürlük kontrolü
      if (filters.variants) {
        Object.keys(filters.variants).forEach(variantSlug => {
          if (filters.variants![variantSlug]?.length > 0) {
            newVisibility[`variant-${variantSlug}`] = true;
          }
        });
      }
      return newVisibility;
    });
  }, [filters]);


  return {
    filters,
    attributeFilters,
    filterVisibility,
    currentSortType,
    setFilters,
    setAttributeFilters,
    setCurrentSortType,
    setFilterVisibility,
    handleFilterChange,
    handleVariantFilterChange,
    handlePriceChange,
    handleAttributeFilterChange,
    toggleFilterVisibility,
    clearFilters,
    loadFiltersFromURL,
    updateURL
  };
}

