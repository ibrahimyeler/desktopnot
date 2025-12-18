"use client";

import { useCallback, useRef, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FilterState } from '../components/category/types';

interface UseCategoryURLManagementProps {
  category: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  setAttributeFilters: (filters: Record<string, string[]> | ((prev: Record<string, string[]>) => Record<string, string[]>)) => void;
  appliedFilters: FilterState;
  appliedAttributeFilters: Record<string, string[]>;
  setAppliedFilters: (filters: FilterState) => void;
  setAppliedAttributeFilters: (filters: Record<string, string[]>) => void;
  appliedSortType: string;
  setAppliedSortType: (sort: string) => void;
  setCurrentSortType: (sort: string) => void;
  setError: (error: string | null) => void;
  filtersInitializedRef: React.MutableRefObject<boolean>;
  fetchSubcategoryProducts: (
    category: string,
    page: number,
    append: boolean,
    sortType: string,
    filters: FilterState,
    attributeFilters: Record<string, string[]>,
    categoryAttributes: any[],
    searchQuery: string
  ) => Promise<void>;
  categoryAttributes: any[];
  initialProducts: any;
  setMobileFiltersOpen: (open: boolean) => void;
}

export const useCategoryURLManagement = ({
  category,
  searchQuery,
  setSearchQuery,
  filters,
  attributeFilters,
  setFilters,
  setAttributeFilters,
  appliedFilters,
  appliedAttributeFilters,
  setAppliedFilters,
  setAppliedAttributeFilters,
  appliedSortType,
  setAppliedSortType,
  setCurrentSortType,
  setError,
  filtersInitializedRef,
  fetchSubcategoryProducts,
  categoryAttributes,
  initialProducts,
  setMobileFiltersOpen
}: UseCategoryURLManagementProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isUpdatingFromURLRef = useRef(false);
  const filtersLoadedFromURLRef = useRef(false);
  const isApplyingFiltersRef = useRef(false);
  const urlFiltersAppliedRef = useRef<string>('');
  const lastAppliedFiltersRef = useRef<{ filters: FilterState; attributeFilters: Record<string, string[]> } | null>(null);
  const isInitialLoadRef = useRef(true);
  const filtersRef = useRef(filters);
  const attributeFiltersRef = useRef(attributeFilters);
  
  useEffect(() => {
    filtersRef.current = filters;
    attributeFiltersRef.current = attributeFilters;
  }, [filters, attributeFilters]);

  // URL'yi güncelle (apply ile tetiklenir)
  const updateURL = useCallback((newFilters: FilterState, newAttributeFilters: Record<string, string[]>, sortType?: string) => {
    const params = new URLSearchParams();

    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const nameParam = urlParams.get('name');
      if (nameParam) {
        params.set('name', nameParam);
      } else if (searchQuery) {
        params.set('name', searchQuery);
      }
    }

    if (sortType && (sortType === 'price_asc' || sortType === 'price_desc')) {
      params.set('sort_types', sortType);
    }

    if (newFilters.genders && newFilters.genders.length > 0) {
      if (newFilters.genders.includes('kadin-kiz')) {
        params.set('g', '1');
      } else if (newFilters.genders.includes('erkek')) {
        params.set('g', '2');
      }
    }

    // Renk filtresi - variant olduğu için URL'de v_renk olarak tutuyoruz (API ile tutarlı olması için)
    // Ama kısa URL için 'c' de kullanılabilir, parse ederken her ikisini de kontrol edeceğiz
    if (newFilters.colors && newFilters.colors.length > 0) {
      params.set('c', newFilters.colors.join(',')); // Kısa URL için 'c' kullanıyoruz
      // Ayrıca v_renk olarak da ekliyoruz (API ile tutarlılık için)
      params.set('v_renk', newFilters.colors.join(','));
    }

    if (newFilters.selectedSubcategories && newFilters.selectedSubcategories.length > 0) {
      params.set('sc', newFilters.selectedSubcategories.join(','));
    }

    if (newFilters.product_stars && newFilters.product_stars.length > 0) {
      params.set('s', newFilters.product_stars.join(','));
    }

    if (newFilters.prices && typeof newFilters.prices === 'object') {
      const priceValue = newFilters.prices as { min?: number; max?: number };
      if (typeof priceValue.min === 'number') {
        params.set('min_price', priceValue.min.toString());
      }
      if (typeof priceValue.max === 'number') {
        params.set('max_price', priceValue.max.toString());
      }
    }

    Object.entries(newAttributeFilters).forEach(([key, values]) => {
      if (values && values.length > 0) {
        params.set(`a_${key}`, values.join(','));
      }
    });

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${window.location.pathname}${newURL}`, { scroll: false });
  }, [router, searchQuery]);

  const applyFiltersWithValues = useCallback(async (
    targetFilters: FilterState,
    targetAttributeFilters: Record<string, string[]>,
    sortType: string,
    options?: { closeMobileFilters?: boolean; skipURLUpdate?: boolean }
  ) => {
    if (!category) return;

    isApplyingFiltersRef.current = true;

    if (options?.closeMobileFilters) {
      setMobileFiltersOpen(false);
    }

    const filtersClone: FilterState = {
      ...targetFilters,
      categories: targetFilters.categories ? [...targetFilters.categories] : undefined,
      brands: targetFilters.brands ? [...targetFilters.brands] : undefined,
      colors: targetFilters.colors ? [...targetFilters.colors] : undefined,
      genders: targetFilters.genders ? [...targetFilters.genders] : undefined,
      product_stars: targetFilters.product_stars ? [...targetFilters.product_stars] : undefined,
      sizes: targetFilters.sizes ? [...targetFilters.sizes] : undefined,
      sellers: targetFilters.sellers ? [...targetFilters.sellers] : undefined,
      sellerTypes: targetFilters.sellerTypes ? [...targetFilters.sellerTypes] : undefined,
      selectedSubcategories: targetFilters.selectedSubcategories ? [...targetFilters.selectedSubcategories] : undefined,
      prices: targetFilters.prices ? { ...targetFilters.prices } : undefined,
    };

    const attributeFiltersClone = Object.fromEntries(
      Object.entries(targetAttributeFilters).map(([key, values]) => [key, [...values]])
    );

    // ÖNEMLİ: Önce appliedFilters'ı güncelle (useCategoryProducts bunu kullanıyor)
    // Sonra UI filtrelerini güncelle
    setAppliedFilters(filtersClone);
    setAppliedAttributeFilters(attributeFiltersClone);
    
    // Son uygulanan filtreleri ref'e kaydet - useEffect'in gereksiz çalışmasını engellemek için
    lastAppliedFiltersRef.current = {
      filters: filtersClone,
      attributeFilters: attributeFiltersClone
    };
    
    // UI filtre state'lerini de güncelle
    setFilters(filtersClone);
    setAttributeFilters(attributeFiltersClone);
    
    setAppliedSortType(sortType);
    setCurrentSortType(sortType);
    setError(null);
    filtersInitializedRef.current = true;

    // Önce ürünleri fetch et, sonra URL'yi güncelle
    // Bu sayede URL güncellendiğinde useEffect tetiklenmeden önce fetch tamamlanmış olur
    await fetchSubcategoryProducts(
      category,
      1,
      false,
      sortType,
      filtersClone,
      attributeFiltersClone,
      categoryAttributes,
      searchQuery
    );
    
    // Fetch tamamlandıktan sonra URL'yi güncelle
    if (!options?.skipURLUpdate) {
      const params = new URLSearchParams();
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const nameParam = urlParams.get('name');
        if (nameParam) {
          params.set('name', nameParam);
        } else if (searchQuery) {
          params.set('name', searchQuery);
        }
      }
      if (sortType && (sortType === 'price_asc' || sortType === 'price_desc')) {
        params.set('sort_types', sortType);
      }
      if (filtersClone.genders && filtersClone.genders.length > 0) {
        if (filtersClone.genders.includes('kadin-kiz')) {
          params.set('g', '1');
        } else if (filtersClone.genders.includes('erkek')) {
          params.set('g', '2');
        }
      }
      // Renk filtresi - variant olduğu için URL'de v_renk olarak tutuyoruz (API ile tutarlı olması için)
      if (filtersClone.colors && filtersClone.colors.length > 0) {
        params.set('c', filtersClone.colors.join(',')); // Kısa URL için 'c' kullanıyoruz
        // Ayrıca v_renk olarak da ekliyoruz (API ile tutarlılık için)
        params.set('v_renk', filtersClone.colors.join(','));
      }
      if (filtersClone.selectedSubcategories && filtersClone.selectedSubcategories.length > 0) {
        params.set('sc', filtersClone.selectedSubcategories.join(','));
      }
      if (filtersClone.product_stars && filtersClone.product_stars.length > 0) {
        params.set('s', filtersClone.product_stars.join(','));
      }
      if (filtersClone.prices && typeof filtersClone.prices === 'object') {
        const priceValue = filtersClone.prices as { min?: number; max?: number };
        if (typeof priceValue.min === 'number') {
          params.set('min_price', priceValue.min.toString());
        }
        if (typeof priceValue.max === 'number') {
          params.set('max_price', priceValue.max.toString());
        }
      }
      Object.entries(attributeFiltersClone).forEach(([key, values]) => {
        if (values && values.length > 0) {
          params.set(`a_${key}`, values.join(','));
        }
      });
      
      // ÖNEMLİ: URL güncellenmeden ÖNCE ref'i set et
      // Bu sayede useEffect tetiklendiğinde (searchParams değiştiğinde) erken return yapacak
      // Ama URL'de hem 'c' hem 'v_renk' var, bu yüzden normalize etmemiz gerekiyor
      // Önce 'v_renk' parametresini kaldır, sadece 'c' ile karşılaştır (kısa URL için)
      const normalizedParams = new URLSearchParams(params);
      normalizedParams.delete('v_renk'); // 'c' parametresini koruyoruz, 'v_renk' gereksiz
      const newURLParams = normalizedParams.toString();
      urlFiltersAppliedRef.current = newURLParams;
      
      // URL'yi güncelle - bu searchParams'ı değiştirecek ve useEffect'i tetikleyecek
      updateURL(filtersClone, attributeFiltersClone, sortType);
      
      // URL güncellendikten sonra yeterince uzun bir delay ile false yap
      // Bu sayede URL güncellemesi tamamen tamamlanana kadar useEffect görmezden gelinir
      setTimeout(() => {
        isApplyingFiltersRef.current = false;
        // urlFiltersAppliedRef.current'ı temizleme - bir sonraki manuel URL değişikliğinde (geri/ileri) kontrol edilmeli
        // Ama eğer aynı URL params ile tekrar useEffect tetiklenirse, zaten erken return yapacak
      }, 500); // 300ms'den 500ms'ye çıkardık - URL güncellemesinin tamamen tamamlanması ve React render cycle'ının bitmesi için
    } else {
      isApplyingFiltersRef.current = false;
    }
  }, [
    category,
    categoryAttributes,
    fetchSubcategoryProducts,
    setCurrentSortType,
    setError,
    updateURL,
    searchQuery,
    setFilters,
    setAttributeFilters,
    setAppliedFilters,
    setAppliedAttributeFilters,
    setAppliedSortType,
    filtersInitializedRef,
    setMobileFiltersOpen
  ]);

  const applyFilters = useCallback((currentSortType: string, options?: { sortType?: string; closeMobileFilters?: boolean }) => {
    const sortToApply = options?.sortType ?? currentSortType ?? 'price_asc';
    return applyFiltersWithValues(filtersRef.current, attributeFiltersRef.current, sortToApply, {
      ...options,
      skipURLUpdate: false
    });
  }, [applyFiltersWithValues]);

  // URL parametrelerini parse et
  const previousParamsRef = useRef<string>('');
  
  const parsedUrlParams = useMemo(() => {
    if (!category || typeof window === 'undefined') {
      return { filters: {}, attributeFilters: {}, searchQuery: '', sortType: 'price_asc' };
    }
    
    const currentParams = searchParams.toString();
    
    if (previousParamsRef.current === currentParams) {
      return previousParamsRef.current === '' 
        ? { filters: {}, attributeFilters: {}, searchQuery: '', sortType: 'price_asc' }
        : JSON.parse(sessionStorage.getItem('lastParsedUrlParams') || '{}');
    }
    
    previousParamsRef.current = currentParams;
    
    const newFilters: FilterState = {};
    const newAttributeFilters: Record<string, string[]> = {};
    
    const nameParam = searchParams.get('name');
    const searchQuery = nameParam || '';
    
    const genderParam = searchParams.get('g');
    if (genderParam === '1') {
      newFilters.genders = ['kadin-kiz'];
    } else if (genderParam === '2') {
      newFilters.genders = ['erkek'];
    }
    
    // Renk parametresini oku - hem 'c' hem de 'v_renk' parametrelerini kontrol et
    const colorParam = searchParams.get('c') || searchParams.get('v_renk');
    if (colorParam) {
      newFilters.colors = colorParam.split(',').map(c => c.trim()).filter(c => c.length > 0);
    }
    
    const subcategoryParam = searchParams.get('sc');
    if (subcategoryParam) {
      newFilters.selectedSubcategories = subcategoryParam.split(',');
    }
    
    const starParam = searchParams.get('s');
    if (starParam) {
      newFilters.product_stars = starParam.split(',');
    }
    
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    if (minPrice || maxPrice) {
      newFilters.prices = {
        min: minPrice ? Number(minPrice) : undefined,
        max: maxPrice ? Number(maxPrice) : undefined
      };
    }
    
    const sortParam = searchParams.get('sort_types');
    const sortType = sortParam || 'price_asc';
    if (sortParam) {
      newFilters.sort_types = sortParam;
    }
    
    // Attribute ve variant filtrelerini parse et
    searchParams.forEach((value, key) => {
      if (key.startsWith('a_')) {
        // Attribute filtreleri (a_ ile başlayan)
        const attributeSlug = key.substring(2);
        newAttributeFilters[attributeSlug] = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
      } else if (key.startsWith('v_')) {
        // Variant filtreleri (v_ ile başlayan) - renk ve beden gibi
        const variantSlug = key.substring(2); // v_renk -> renk, v_beden -> beden
        if (variantSlug === 'renk') {
          // Renk variant'ı filters.colors olarak tutuluyor
          newFilters.colors = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
        } else if (variantSlug === 'beden') {
          // Beden variant'ı attributeFilters.beden olarak tutuluyor
          newAttributeFilters['beden'] = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
        } else {
          // Diğer variant'lar attributeFilters içinde tutuluyor
          newAttributeFilters[variantSlug] = value.split(',').map(v => v.trim()).filter(v => v.length > 0);
        }
      }
    });
  
    const result = { filters: newFilters, attributeFilters: newAttributeFilters, searchQuery, sortType };
    sessionStorage.setItem('lastParsedUrlParams', JSON.stringify(result));
    
    return result;
  }, [category, searchParams]);
  
  // URL'den filtreleri yükle
  useEffect(() => {
    if (!category || typeof window === 'undefined') return;
    
    // Eğer filtreler uygulanıyorsa (apply butonu ile), URL güncellemesini görmezden gel
    if (isApplyingFiltersRef.current) {
      return;
    }
    
    // URL parametrelerini normalize et - hem 'c' hem 'v_renk' olabilir, sadece 'c' ile karşılaştır
    const currentURLParamsObj = new URLSearchParams(searchParams);
    const normalizedCurrentParams = new URLSearchParams();
    
    // Tüm parametreleri kopyala, ama 'v_renk' varsa atla (çünkü 'c' ile aynı şeyi temsil ediyor)
    currentURLParamsObj.forEach((value, key) => {
      if (key !== 'v_renk') {
        normalizedCurrentParams.set(key, value);
      }
    });
    
    const normalizedCurrentURLParams = normalizedCurrentParams.toString();
    
    // ÖNEMLİ: Eğer bu URL parametreleri bizim az önce uyguladığımız filtrelerle aynıysa, tekrar işleme
    // Bu kontrol çok kritik - URL güncellemesi sırasında useEffect'in çalışmasını engeller
    if (normalizedCurrentURLParams === urlFiltersAppliedRef.current && urlFiltersAppliedRef.current !== '') {
      // URL bizim uyguladığımız filtrelerle aynı, state'i değiştirme
      // Çünkü state zaten doğru (applyFiltersWithValues içinde set edildi)
      return;
    }
    
    // URL'den parse edilen filtreleri al
    const { filters: newFilters, attributeFilters: newAttributeFilters, searchQuery: parsedSearchQuery, sortType: parsedSortType } = parsedUrlParams;
    
    // Ek kontrol: Eğer URL'den parse edilen filtreler, son uygulanan filtrelerle aynıysa, tekrar işleme
    if (lastAppliedFiltersRef.current) {
      const lastFilters = lastAppliedFiltersRef.current.filters;
      const lastAttributeFilters = lastAppliedFiltersRef.current.attributeFilters;
      
      // Filtrelerin aynı olup olmadığını kontrol et
      const filtersMatch = JSON.stringify(lastFilters) === JSON.stringify(newFilters);
      const attributeFiltersMatch = JSON.stringify(lastAttributeFilters) === JSON.stringify(newAttributeFilters);
      
      if (filtersMatch && attributeFiltersMatch && normalizedCurrentURLParams === urlFiltersAppliedRef.current) {
        // Filtreler aynı ve URL de aynı, tekrar işleme yapma
        // State zaten doğru (applyFiltersWithValues içinde set edildi)
        return;
      }
    }
    
    setSearchQuery(parsedSearchQuery);
    
    isUpdatingFromURLRef.current = true;
    
    // ÖNEMLİ: Eğer filtreler uygulanıyorsa, state'i değiştirme
    // Çünkü applyFiltersWithValues zaten state'i set ediyor
    if (isApplyingFiltersRef.current) {
      return;
    }
    
    // URL'den parse edilen filtreleri state'e set et
    // TÜM state'leri senkronize et: filters, attributeFilters, appliedFilters, appliedAttributeFilters
    setFilters(newFilters);
    setAttributeFilters(newAttributeFilters);
    
    // ÖNEMLİ: appliedFilters'ı da hemen güncelle - bu useCategoryProducts'un kullandığı state
    // Ama sadece filtreler uygulanmıyorsa (apply butonu ile değil, URL'den okuma)
    setAppliedFilters(newFilters);
    setAppliedAttributeFilters(newAttributeFilters);
    
    const initialSort = parsedSortType || appliedSortType || 'price_asc';
    
    // Eğer hala filtre uygulanıyorsa, bu useEffect'i çalıştırma
    if (isApplyingFiltersRef.current) {
      return;
    }
    
    const hasFilters = Object.keys(newFilters).length > 0 || Object.keys(newAttributeFilters).length > 0;
    const hasURLParams = normalizedCurrentURLParams && normalizedCurrentURLParams.length > 0;
    
    const hasInitialProducts = initialProducts && initialProducts.data && Array.isArray(initialProducts.data) && initialProducts.data.length > 0;
    
    // Eğer filtreler uygulanıyorsa (applyFiltersWithValues çalışıyorsa), burayı çalıştırma
    // Çünkü applyFiltersWithValues zaten appliedFilters'ı set ediyor
    if (isApplyingFiltersRef.current) {
      return;
    }
    
    // Hemen fetch yap - delay yok, böylece ürünler daha hızlı görünecek
    if (isInitialLoadRef.current && hasURLParams && hasFilters && !hasInitialProducts) {
      // İlk yüklemede ve URL'de filtre varsa ve initial products yoksa, ürünleri fetch et
      void applyFiltersWithValues(newFilters, newAttributeFilters, initialSort, { skipURLUpdate: true });
      isInitialLoadRef.current = false;
    } else if (!isInitialLoadRef.current && hasURLParams && hasFilters) {
      // İlk yükleme değil ama URL'de filtre var (geri/ileri butonu veya manuel URL değişikliği)
      // Bu durumda ürünleri fetch et
      void applyFiltersWithValues(newFilters, newAttributeFilters, initialSort, { skipURLUpdate: true });
    } else if (!isInitialLoadRef.current && !hasURLParams) {
      // URL'de filtre yoksa ve ilk yükleme değilse, sadece state'leri temizle
      setAppliedFilters({});
      setAppliedAttributeFilters({});
      setAppliedSortType('price_asc');
      setCurrentSortType('price_asc');
      isInitialLoadRef.current = false;
    } else {
      // URL'den okunan filtreleri applied state'lere de yaz (zaten yukarıda yazdık ama sort type'ı da güncelleyelim)
      // Ama eğer applyFiltersWithValues çalışmadıysa (yani sadece URL değiştiyse)
      setAppliedFilters(newFilters);
      setAppliedAttributeFilters(newAttributeFilters);
      setAppliedSortType(initialSort);
      setCurrentSortType(initialSort);
      isInitialLoadRef.current = false;
    }
    
    urlFiltersAppliedRef.current = normalizedCurrentURLParams;
    isUpdatingFromURLRef.current = false;
    filtersLoadedFromURLRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedUrlParams, setFilters, setAttributeFilters, appliedSortType, applyFiltersWithValues, searchParams, setSearchQuery, setAppliedFilters, setAppliedAttributeFilters, setAppliedSortType, setCurrentSortType]);

  return {
    applyFilters,
    applyFiltersWithValues,
    isApplyingFiltersRef
  };
};

