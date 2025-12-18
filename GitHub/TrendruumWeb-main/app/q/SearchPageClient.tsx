"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/layout/Header';
import ScrollToTop from '../../components/ui/ScrollToTop';
import { getOriginalSearchTerm, detectGenderFromSearchTerm } from '../../utils/searchUtils'
import Breadcrumb from '../../components/common/Breadcrumb';
import SearchMobileHeader from './components/SearchMobileHeader';
import SearchMobileSortModal from './components/SearchMobileSortModal';
import SearchMobileFiltersModal from './components/SearchMobileFiltersModal';
import SearchFilterChips from './components/SearchFilterChips';
import SearchSidebar from './components/SearchSidebar';
import SearchResults from './components/SearchResults';
import { useSearchProducts } from './hooks/useSearchProducts';
import { useSearchFilters } from './hooks/useSearchFilters';
import { useSearchFilterChips } from './hooks/useSearchFilterChips';
import { useSearchStickyManagement } from './hooks/useSearchStickyManagement';
import { useSearchScrollManagement } from './hooks/useSearchScrollManagement';
import { FilterState, SearchData, SearchPageClientProps } from './types';
import { Product } from '../../types/product';

const SearchPageClient: React.FC<SearchPageClientProps> = ({ initialQuery, initialSearchData }) => {
  // Products hook - API çağrıları ve product state yönetimi
  const {
    allProducts,
    filteredProducts,
    sortedProducts,
    loading,
    loadingMore,
    error,
    currentPage,
    hasMore,
    totalProducts,
    setAllProducts,
    setFilteredProducts,
    setSortedProducts,
    setLoading,
    setLoadingMore,
    setError,
    setCurrentPage,
    setHasMore,
    setTotalProducts,
    fetchSearchResults,
    fetchFilteredProducts: fetchFilteredProductsFromHook,
    loadMoreProducts: loadMoreProductsFromHook
  } = useSearchProducts(
    initialSearchData?.products || [],
    initialSearchData?.searchInfo?.total_results || 0
  );

  // Initial data yoksa loading başlat (yeni arama yapıldığında)
  const [minimumLoadingPassed, setMinimumLoadingPassed] = useState<boolean>(Boolean(initialSearchData?.products && initialSearchData.products.length > 0));
  const [maxLoadingReached, setMaxLoadingReached] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [isAdultVerified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isAdultVerified') === 'true';
    }
    return false;
  });
  
  const router = useRouter();

  const sortOptions = useMemo(() => ([
    { id: 'recommended', name: 'Önerilen', value: 'recommended' },
    { id: 'price_asc', name: 'En düşük fiyat', value: 'price_asc' },
    { id: 'price_desc', name: 'En yüksek fiyat', value: 'price_desc' },
    { id: 'name_asc', name: 'A-Z', value: 'name_asc' },
    { id: 'name_desc', name: 'Z-A', value: 'name_desc' }
  ]), []);
  
  // Filtre hook'u
  const {
    filters,
    attributeFilters,
    filterVisibility,
    currentSortType,
    setFilters,
    setAttributeFilters,
    setCurrentSortType,
    handleFilterChange: handleFilterChangeBase,
    handleVariantFilterChange,
    handlePriceChange: handlePriceChangeBase,
    handleAttributeFilterChange: handleAttributeFilterChangeBase,
    toggleFilterVisibility,
    clearFilters: clearFiltersBase,
    loadFiltersFromURL,
    updateURL
  } = useSearchFilters();

  const [appliedFilters, setAppliedFilters] = useState<FilterState>({});
  const [appliedAttributeFilters, setAppliedAttributeFilters] = useState<Record<string, string[]>>({});

  // Aktif filtre kontrolü
  const hasActiveFilters = useCallback(() => {
    const hasCategories = appliedFilters.categories && appliedFilters.categories.length > 0;
    const hasBrands = appliedFilters.brands && appliedFilters.brands.length > 0;
    const hasColors = appliedFilters.colors && appliedFilters.colors.length > 0;
    const hasGenders = appliedFilters.genders && appliedFilters.genders.length > 0;
    const hasStars = appliedFilters.product_stars && appliedFilters.product_stars.length > 0;
    const hasPrices = appliedFilters.prices && (typeof appliedFilters.prices.min === 'number' || typeof appliedFilters.prices.max === 'number');
    const hasAttributes = Object.values(appliedAttributeFilters).some(values => values && values.length > 0);
    
    return hasCategories || hasBrands || hasColors || hasGenders || hasStars || hasPrices || hasAttributes;
  }, [appliedFilters, appliedAttributeFilters]);
  const [appliedSortType, setAppliedSortType] = useState<string>('recommended');
  const filtersInitializedRef = useRef(false);

  const formatPriceLabel = useCallback((value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }, []);

 
  // Filtre seçenekleri
  const [availableBrands, setAvailableBrands] = useState<any[]>(initialSearchData?.filters?.brands || []);
  const [availableColors, setAvailableColors] = useState<any[]>([]);
  const [allAttributes, setAllAttributes] = useState<any[]>(initialSearchData?.filters?.attributes || []);
  const [allVariants, setAllVariants] = useState<any[]>(initialSearchData?.filters?.variants || []);
  const [subCategories, setSubCategories] = useState<any[]>(initialSearchData?.filters?.categories || []);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
 
  // Filter chips using hook
  const filterChips = useSearchFilterChips({
    appliedFilters,
    appliedAttributeFilters,
    appliedSortType,
    availableBrands,
    availableColors,
    subCategories,
    allAttributes,
    sortOptions,
    formatPriceLabel
  });

  // İlk yüklemeyi takip etmek için ref
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const normalizedInitialQuery = initialQuery ? initialQuery.trim() : '';
  const processedInitialQueryRef = useRef(false);
  const lastHandledQueryRef = useRef(initialSearchData ? normalizedInitialQuery : '');
  const currentQueryParam = searchParams.get('q') ?? '';

  // Wrapper for fetchSearchResults with loading states and filter updates
  const fetchSearchResultsWithLoading = useCallback(async (query: string) => {
    setMinimumLoadingPassed(false);
    setMaxLoadingReached(false);
    const result = await fetchSearchResults(query);
    if (result?.filters) {
      setAvailableBrands(result.filters?.brands || []);
      setSubCategories(result.filters?.categories || []);
      setAllAttributes(result.filters?.attributes || []);
      setAllVariants(result.filters?.variants || []);
      const colorVariant = result.filters?.variants?.find((v: any) => v.slug === 'renk');
        if (colorVariant?.values) {
          const validColors = colorVariant.values.filter((color: any) => color?.name && color?.slug);
          setAvailableColors(validColors);
        }
    }
  }, [fetchSearchResults]);

  // Get search query from URL search params and listen for changes
  useEffect(() => {
    const trimmedQuery = currentQueryParam.trim();
    const queryChanged = trimmedQuery !== lastHandledQueryRef.current;

    if (!trimmedQuery) {
      setSearchQuery('');
      setAllProducts([]);
      setFilteredProducts([]);
      setSortedProducts([]);
      setCurrentPage(1);
      setHasMore(false);
      setTotalProducts(0);
      setError(null);
      setLoading(false);
      setLoadingMore(false);
      setMinimumLoadingPassed(false);
      setMaxLoadingReached(false);
      lastHandledQueryRef.current = '';
      processedInitialQueryRef.current = true;
      return;
    }

    // İstisna kelimeleri çıkar ve temizlenmiş sorguyu al
    const genderDetection = detectGenderFromSearchTerm(trimmedQuery);
    const cleanedQueryForState = genderDetection.cleanedQuery || trimmedQuery;
    const detectedGender = genderDetection.detectedGender;
    
    // Temizlenmiş sorguyu state'e set et
    setSearchQuery(cleanedQueryForState);

    // İlk yükleme kontrolü - initialSearchData varsa ve query aynıysa API çağrısı yapma
    if (!processedInitialQueryRef.current) {
      processedInitialQueryRef.current = true;
      // Query değişmediyse ve initialSearchData varsa, API çağrısı yapma
      if (!queryChanged && initialSearchData && initialSearchData.products && initialSearchData.products.length > 0) {
        lastHandledQueryRef.current = trimmedQuery;
        // Initial data'dan gelen ürünleri set et
        setAllProducts(initialSearchData.products);
        setFilteredProducts(initialSearchData.products);
        setSortedProducts(initialSearchData.products);
        setTotalProducts(initialSearchData.searchInfo?.total_results || initialSearchData.products.length);
        setLoading(false);
        setMinimumLoadingPassed(true);
        return;
      }
    }

    // Query değişmediyse ve zaten işlendiyse, tekrar API çağrısı yapma
    if (!queryChanged) {
      return;
    }

    lastHandledQueryRef.current = trimmedQuery;

    // Yeni arama yapıldığında tüm filtreleri temizle (cinsiyet hariç)
    // Önce cinsiyet tespit et - önce URL'den, sonra query'den
    const currentGenderParam = searchParams.get('a_cinsiyet');
    
    // Tüm filtreleri temizle, sadece cinsiyet filtresini koru (eğer tespit edildiyse)
    const newFilters: FilterState = {};
    
    // Önce URL'den gelen cinsiyet parametresini kontrol et
    if (currentGenderParam) {
      newFilters.genders = [currentGenderParam];
    } else if (detectedGender !== null) {
      // URL'de yoksa query'den tespit edilen cinsiyeti kullan
      const genderValue = detectedGender === 1 ? 'kadin-kiz' : 'erkek';
      newFilters.genders = [genderValue];
    }
    
    // Filtreleri temizle
    setFilters(newFilters);
    setAttributeFilters({});
    setCurrentSortType('price_asc');
    
    // Applied filters state'lerini de temizle
    setAppliedFilters(newFilters);
    setAppliedAttributeFilters({});
    setAppliedSortType('price_asc');
    
    // URL'den tüm filtre parametrelerini temizle, sadece temizlenmiş query ve cinsiyet (varsa) kalsın
    const finalQueryForUrl = cleanedQueryForState;
    
    const currentParams = new URLSearchParams();
    currentParams.set('q', finalQueryForUrl);
    
    // URL'den gelen veya tespit edilen cinsiyet parametresini ekle
    if (currentGenderParam) {
      currentParams.set('a_cinsiyet', currentGenderParam);
    } else if (detectedGender !== null) {
      const genderValue = detectedGender === 1 ? 'kadin-kiz' : 'erkek';
      currentParams.set('a_cinsiyet', genderValue);
    }
    
    router.replace(`/q?${currentParams.toString()}`, { scroll: false });

    // Yeni arama yapıldığında eski sonuçları temizle ve loading'i başlat
    setAllProducts([]);
    setFilteredProducts([]);
    setSortedProducts([]);
    setCurrentPage(1);
    setHasMore(true);
    setTotalProducts(0);
    setError(null);
    setLoading(true);
    setMinimumLoadingPassed(false);
    setMaxLoadingReached(false);

    // Temizlenmiş query ile arama yap (fetchSearchResults içinde de temizleniyor ama burada da temizleyelim)
    fetchSearchResultsWithLoading(finalQueryForUrl);
  }, [
    fetchSearchResultsWithLoading,
    initialSearchData,
    currentQueryParam,
    setAllProducts,
    setFilteredProducts,
    setSortedProducts,
    setCurrentPage,
    setHasMore,
    setTotalProducts,
    setError,
    setLoading,
    setLoadingMore,
    setMinimumLoadingPassed,
    setMaxLoadingReached,
    router,
    searchParams,
    setFilters,
    setAttributeFilters,
    setCurrentSortType
  ]);



  // Daha fazla ürün yükle
  const loadMoreProducts = useCallback(async () => {
    if (loadingMore || !hasMore || !searchQuery) return;
    await loadMoreProductsFromHook(searchQuery, currentPage, appliedFilters, appliedAttributeFilters, appliedSortType);
  }, [loadingMore, hasMore, searchQuery, currentPage, appliedFilters, appliedAttributeFilters, appliedSortType, loadMoreProductsFromHook]);

  // IntersectionObserver ile otomatik yükleme - KALDIRILDI
  // Scroll yapınca otomatik fetch isteği atılması devre dışı bırakıldı
  // useEffect(() => {
  //   const trigger = loadMoreTriggerRef.current;
  //   if (!trigger) {
  //     return;
  //   }

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting && hasMore && !loadingMore && !loading) {
  //           loadMoreProducts();
  //         }
  //       });
  //     },
  //     {
  //       rootMargin: '200px 0px 200px 0px',
  //       threshold: 0.1,
  //     }
  //   );

  //   observer.observe(trigger);

  //   return () => {
  //     observer.disconnect();
  //   };
  // }, [hasMore, loadingMore, loading, loadMoreProducts]);

  // Fiyat aralığını hesapla - memoized
  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 10000 };
    
    const prices = allProducts.map(p => Number(p.price)).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [allProducts]);





  // Filtre değişiklik handler'ları - loading state'leri ile sarmalanmış
  const handleFilterChange = useCallback((filterType: string, value: string, checked: boolean) => {
    handleFilterChangeBase(filterType, value, checked);
  }, [handleFilterChangeBase]);

  const handlePriceChange = useCallback((priceRange: { min?: number; max?: number }) => {
    handlePriceChangeBase(priceRange);
  }, [handlePriceChangeBase]);

  const handleAttributeFilterChange = useCallback((attributeSlug: string, value: string, checked: boolean) => {
    handleAttributeFilterChangeBase(attributeSlug, value, checked);
  }, [handleAttributeFilterChangeBase]);

  const clearFilters = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
    clearFiltersBase(searchQuery, () => {
    if (searchQuery) {
        fetchSearchResultsWithLoading(searchQuery);
    }
    });
  }, [searchQuery, clearFiltersBase, fetchSearchResultsWithLoading]);

  useEffect(() => {
    if (mobileSortOpen || mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileSortOpen, mobileFiltersOpen]);

  // Scroll management hook
  useSearchScrollManagement(sortedProducts);

  // Sticky management hook
  useSearchStickyManagement();

  // Sıralama işlemleri
  const handleSortedProducts = useCallback((newSortedProducts: Product[]) => {
    setSortedProducts(newSortedProducts);
  }, []);

  // Kategori sayfasındaki gibi filtreleri düzgün clone eden fonksiyon
  const applyFiltersWithValues = useCallback(async (
    targetFilters: FilterState,
    targetAttributeFilters: Record<string, string[]>,
    sortType: string,
    options?: { closeMobileFilters?: boolean; skipURLUpdate?: boolean }
  ) => {
    if (!searchQuery) return;

    if (options?.closeMobileFilters) {
      setMobileFiltersOpen(false);
    }

    // Filtrelerin düzgün clone'unu oluştur (kategori sayfasındaki gibi)
    const filtersClone: FilterState = {
      ...targetFilters,
      categories: targetFilters.categories ? [...targetFilters.categories] : undefined,
      brands: targetFilters.brands ? [...targetFilters.brands] : undefined,
      colors: targetFilters.colors ? [...targetFilters.colors] : undefined,
      genders: targetFilters.genders ? [...targetFilters.genders] : undefined,
      product_stars: targetFilters.product_stars ? [...targetFilters.product_stars] : undefined,
      prices: targetFilters.prices ? { ...targetFilters.prices } : undefined,
    };

    const attributeFiltersClone = Object.fromEntries(
      Object.entries(targetAttributeFilters).map(([key, values]) => [key, [...values]])
    );

    // Loading state'i fetchFilteredProductsFromHook içinde yönetiliyor
    // Sadece maxLoadingReached'i sıfırla
    setMaxLoadingReached(false);
    setError(null);

    // Filtre state'lerini güncelle (kategori sayfasındaki gibi - ama kategori sayfasında yok, burada ekliyoruz)
    // Bu sayede filtreler state'te kalır ve URL güncellemesi sonrası kaybolmaz
    setFilters(filtersClone);
    setAttributeFilters(attributeFiltersClone);
    
    // Applied state'leri güncelle (kategori sayfasındaki gibi)
    setAppliedFilters(filtersClone);
    setAppliedAttributeFilters(attributeFiltersClone);
    setAppliedSortType(sortType);
    setCurrentSortType(sortType);
    filtersInitializedRef.current = true;

    // URL güncellemesini atla eğer skipURLUpdate true ise
    if (!options?.skipURLUpdate) {
      updateURL(filtersClone, attributeFiltersClone, sortType);
    }

    const result = await fetchFilteredProductsFromHook(searchQuery, filtersClone, attributeFiltersClone, sortType);

    if (result?.filters) {
      setAvailableBrands(result.filters?.brands || []);
      setSubCategories(result.filters?.categories || []);
      setAllAttributes(result.filters?.attributes || []);
      setAllVariants(result.filters?.variants || []);
      const colorVariant = result.filters?.variants?.find((v: any) => v.slug === 'renk');
      if (colorVariant?.values) {
        const validColors = colorVariant.values.filter((color: any) => color?.name && color?.slug);
        setAvailableColors(validColors);
      }
    }
    // minimumLoadingPassed kontrolü useEffect içinde yapılıyor (sortedProducts değiştiğinde)
  }, [searchQuery, fetchFilteredProductsFromHook, updateURL, setFilters, setAttributeFilters, setCurrentSortType]);

  const applyFilters = useCallback((options?: { 
    sortType?: string; 
    closeMobileFilters?: boolean;
    skipURLUpdate?: boolean;
  }) => {
    const sortToApply = options?.sortType ?? currentSortType;
    // Mevcut filtre state'lerini kullan (kategori sayfasındaki gibi)
    return applyFiltersWithValues(filters, attributeFilters, sortToApply, {
      closeMobileFilters: options?.closeMobileFilters,
      skipURLUpdate: options?.skipURLUpdate
    });
  }, [applyFiltersWithValues, filters, attributeFilters, currentSortType]);

  const handleServerSortChange = useCallback((sortType: string) => {
    // Doğrudan applyFilters çağır, currentSortType'a bağlı olmadan
    void applyFilters({ sortType });
  }, [applyFilters]);
//test
  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [filteredProducts]);

  // Infinite scroll için scroll event listener - KALDIRILDI
  // Scroll yapınca otomatik fetch isteği atılması devre dışı bırakıldı
  // useEffect(() => {
  //   let scrollTimeout: NodeJS.Timeout;
  //   
  //   const handleScroll = () => {
  //     // Debounce scroll event
  //     clearTimeout(scrollTimeout);
  //     scrollTimeout = setTimeout(() => {
  //       const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  //       const windowHeight = window.innerHeight;
  //       const documentHeight = document.documentElement.scrollHeight;
  //       
  //       const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
  //       
  //       // Sayfa ortalarına gelince (30%) yükleme başlasın - çok erken yükleme
  //       if (scrollPercentage > 0.3 && hasMore && !loadingMore && !loading) {
  //         loadMoreProducts();
  //       }
  //     }, 100); // 100ms debounce
  //   };

  //   window.addEventListener('scroll', handleScroll, { passive: true });
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //     clearTimeout(scrollTimeout);
  //   };
  // }, [hasMore, loadingMore, loading, loadMoreProducts]);

  // Process initial filter data
  useEffect(() => {
    if (initialSearchData) {
      // Renkleri set et (variants'dan)
      const colorVariant = initialSearchData.filters?.variants?.find((v: any) => v.slug === 'renk');
      if (colorVariant?.values) {
        const validColors = colorVariant.values.filter((color: any) => color?.name && color?.slug);
        setAvailableColors(validColors);
      }
      
      // Initial data varsa ve ürünler yüklendiyse loading'i false yap ve minimumLoadingPassed'i true yap
      if (initialSearchData.products && initialSearchData.products.length > 0) {
        setLoading(false);
        setMinimumLoadingPassed(true);
      } else {
        // Initial data yoksa veya ürünler yoksa, loading true olmalı
        setLoading(true);
        setMinimumLoadingPassed(false);
      }
    } else {
      // Initial data yoksa, loading true ve minimumLoadingPassed false
      setLoading(true);
      setMinimumLoadingPassed(false);
    }
  }, [initialSearchData]);


  // URL'den filtreleri yükle ve otomatik uygula
  const filtersLoadedOnce = useRef(false);
  const lastURLParamsRef = useRef<string>('');
  const urlFiltersAppliedRef = useRef<string>('');
  const pendingURLFiltersRef = useRef<string>('');
  const applyFiltersRef = useRef(applyFilters);
  
  // applyFilters ref'ini güncelle
  useEffect(() => {
    applyFiltersRef.current = applyFilters;
  }, [applyFilters]);
  
  // URL değiştiğinde filtreleri yükle
  useEffect(() => {
    const currentURLParams = searchParams.toString();
    
    // URL değiştiyse filtreleri yükle
    if (currentURLParams !== lastURLParamsRef.current) {
      loadFiltersFromURL();
      filtersLoadedOnce.current = true;
      lastURLParamsRef.current = currentURLParams;
      
      // URL'de filtre parametreleri var mı kontrol et
      const hasURLFilters = 
        searchParams.get('brands') ||
        searchParams.get('categories') ||
        searchParams.get('a_cinsiyet') ||
        searchParams.get('sort_types') ||
        searchParams.get('min_price') ||
        searchParams.get('max_price') ||
        Array.from(searchParams.keys()).some(key => key.startsWith('a_') && key !== 'a_cinsiyet');
      
      if (hasURLFilters && searchQuery) {
        // Filtreleri uygulamak için bekleyen URL'i işaretle
        pendingURLFiltersRef.current = currentURLParams;
        urlFiltersAppliedRef.current = ''; // Reset - yeni URL için uygulanacak
      } else {
        urlFiltersAppliedRef.current = currentURLParams;
        pendingURLFiltersRef.current = '';
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString(), searchQuery]);
  
  // Filtreler yüklendikten sonra otomatik uygula
  // filters ve attributeFilters state'leri değiştiğinde kontrol et
  useEffect(() => {
    if (pendingURLFiltersRef.current && 
        pendingURLFiltersRef.current !== urlFiltersAppliedRef.current &&
        searchQuery &&
        filtersLoadedOnce.current) {
      // Filtreler state'e yüklendikten sonra uygula
      // State güncellemesi için kısa bir bekleme
      const timer = setTimeout(() => {
        // Filtrelerin gerçekten yüklendiğini kontrol et
        // URL'den direkt oku ve uygula (state güncellemesini beklemeden)
        const urlFilters: FilterState = {};
        const urlAttributeFilters: Record<string, string[]> = {};
        
        // URL'den filtreleri oku
        const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
        const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
        const colors = searchParams.get('colors')?.split(',').filter(Boolean) || [];
        const stars = searchParams.get('stars')?.split(',').filter(Boolean) || [];
        const minPrice = searchParams.get('min_price');
        const maxPrice = searchParams.get('max_price');
        const sort = searchParams.get('sort_types') || searchParams.get('sort') || currentSortType;
        const genderParam = searchParams.get('a_cinsiyet');
        
        if (brands.length > 0) urlFilters.brands = brands;
        if (categories.length > 0) urlFilters.categories = categories;
        if (colors.length > 0) urlFilters.colors = colors;
        if (stars.length > 0) urlFilters.product_stars = stars;
        if (genderParam) urlFilters.genders = genderParam.split(',').filter(Boolean);
        if (minPrice || maxPrice) {
          urlFilters.prices = {
            ...(minPrice ? { min: parseInt(minPrice, 10) } : {}),
            ...(maxPrice ? { max: parseInt(maxPrice, 10) } : {})
          };
        }
        
        // Attribute filtrelerini oku
        searchParams.forEach((value, key) => {
          if (key.startsWith('a_') && key !== 'a_cinsiyet') {
            const attrKey = key.replace('a_', '');
            urlAttributeFilters[attrKey] = value.split(',').filter(Boolean);
          }
        });
        
        // URL'den okunan filtreleri direkt uygula
        if (Object.keys(urlFilters).length > 0 || Object.keys(urlAttributeFilters).length > 0 || sort !== 'price_asc') {
          applyFiltersWithValues(urlFilters, urlAttributeFilters, sort, { skipURLUpdate: true });
          urlFiltersAppliedRef.current = pendingURLFiltersRef.current;
          pendingURLFiltersRef.current = '';
        }
      }, 200); // State güncellemesi için kısa bekleme
      
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, attributeFilters, currentSortType, searchQuery, searchParams, applyFiltersWithValues]);

  useEffect(() => {
    if (filtersLoadedOnce.current && !filtersInitializedRef.current) {
      setAppliedFilters(filters);
      setAppliedAttributeFilters(attributeFilters);
      setAppliedSortType(currentSortType);
      filtersInitializedRef.current = true;
    }
  }, [filters, attributeFilters, currentSortType]);

  // Breadcrumb oluşturma
  useEffect(() => {
    if (searchQuery) {
      // Arama terimini formatla
      const formattedQuery = searchQuery
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      
      setBreadcrumbItems([
        { name: 'Trendruum', href: '/', isLogo: true },
        { name: `"${formattedQuery}" Arama Sonuçları`, href: undefined }
      ]);
    }
  }, [searchQuery]);




  // Artık filtreler otomatik uygulanmıyor; applyFilters fonksiyonu tetikliyor

  // Minimum loading süresi ve maksimum loading süresi (5 saniye)
  useEffect(() => {
    if (loading) {
      setMinimumLoadingPassed(false);
      setMaxLoadingReached(false);
      const startTime = Date.now();
      
      // Minimum 2 saniye loading
      const minTimer = setTimeout(() => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= 2000) {
          setMinimumLoadingPassed(true);
        }
      }, 2000);
      
      // Maksimum 5 saniye loading - sonra zorla durdur
      const maxTimer = setTimeout(() => {
        setMaxLoadingReached(true);
        setMinimumLoadingPassed(true);
      }, 5000); // 5 saniye maksimum loading

      return () => {
        clearTimeout(minTimer);
        clearTimeout(maxTimer);
      };
    } else {
      // Loading false olduğunda, eğer henüz 2 saniye geçmemişse bekle
      // Ama eğer ürünler varsa hemen göster
      if (sortedProducts.length > 0) {
        // Ürünler varsa minimumLoadingPassed'i hemen true yap
        const checkTimer = setTimeout(() => {
          setMinimumLoadingPassed(true);
        }, 100);
        return () => clearTimeout(checkTimer);
      } else {
        // Ürünler yoksa, minimum süreyi bekle
        const checkTimer = setTimeout(() => {
          setMinimumLoadingPassed(true);
        }, 500); // Kısa bir delay
        return () => clearTimeout(checkTimer);
      }
    }
  }, [loading, sortedProducts.length]);


  // Don't render until we have the search query
  if (!searchQuery) {
    return (
      <div className="flex justify-center items-center min-h-[100dvh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }


  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <main 
        data-page="search" 
        className="search-page-main w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-16 md:pt-0 pb-8 sm:pb-12 lg:py-0 xl:py-0" 
        style={{ 
          position: 'relative', 
          overflow: 'visible',
          display: 'block',
          flex: 'none'
        }}
      >
        <div className="w-full mt-0 lg:mt-5" style={{ position: 'relative', overflow: 'visible' }}>
          {searchQuery && (
            <>
              <SearchMobileHeader
                searchQuery={getOriginalSearchTerm(searchQuery)}
                mobileFiltersOpen={mobileFiltersOpen}
                mobileSortOpen={mobileSortOpen}
                onToggleFilters={() => {
                  setMobileSortOpen(false);
                  setMobileFiltersOpen((prev) => !prev);
                }}
                onToggleSort={() => {
                  setMobileFiltersOpen(false);
                  setMobileSortOpen((prev) => !prev);
                }}
                currentSortType={currentSortType}
                sortOptions={sortOptions}
                hasActiveFilters={hasActiveFilters()}
              />

              <SearchFilterChips
                searchQuery={searchQuery}
                chips={filterChips}
              />
            </>
          )}
          
          {/* Breadcrumb - Desktop Only */}
          <div className="hidden lg:block mb-2 lg:mb-3 p-3 -ml-1">
            <Breadcrumb 
              items={breadcrumbItems}
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 mt-2 sm:mt-3 lg:mt-4 xl:mt-6" style={{ overflow: 'visible', position: 'relative', alignItems: 'start' }}>
            <SearchSidebar
              searchQuery={getOriginalSearchTerm(searchQuery)}
              loading={loading}
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
              onBrandSearchChange={setBrandSearchQuery}
              onFilterChange={handleFilterChange}
              onVariantFilterChange={handleVariantFilterChange}
              onPriceChange={handlePriceChange}
              onAttributeFilterChange={handleAttributeFilterChange}
              onToggleFilterVisibility={toggleFilterVisibility}
              onApply={() => {
                void applyFilters();
              }}
            />
            
            {/* Main Content Area */}
            <div className="lg:col-span-9 xl:col-span-9 2xl:col-span-9 flex-1">
              <SearchResults
                searchQuery={getOriginalSearchTerm(searchQuery)}
                loading={loading}
                minimumLoadingPassed={minimumLoadingPassed}
                maxLoadingReached={maxLoadingReached}
                error={error}
                onRetry={() => {
                  if (searchQuery) {
                    setError(null);
                    setLoading(true);
                    setMaxLoadingReached(false);
                    fetchSearchResultsWithLoading(searchQuery);
                  }
                }}
                sortedProducts={sortedProducts as Product[]}
                filteredProducts={filteredProducts as Product[]}
                totalProducts={totalProducts}
                currentSortType={currentSortType}
                sortOptions={sortOptions}
                onSortChange={handleServerSortChange}
                onSortedProducts={handleSortedProducts}
                isAdultVerified={!!isAdultVerified}
                loadMoreTriggerRef={loadMoreTriggerRef}
                loadingMore={loadingMore}
                hasMore={hasMore}
              />
            </div>
          </div>
        </div>
      </main>
      <SearchMobileSortModal
        isOpen={mobileSortOpen}
        onClose={() => setMobileSortOpen(false)}
        sortOptions={sortOptions}
        currentSortType={currentSortType}
        onSortChange={handleServerSortChange}
      />

      <SearchMobileFiltersModal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        onApply={() => {
          applyFilters({ closeMobileFilters: true });
        }}
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
        onBrandSearchChange={setBrandSearchQuery}
        onFilterChange={handleFilterChange}
        onVariantFilterChange={handleVariantFilterChange}
        onPriceChange={handlePriceChange}
        onAttributeFilterChange={handleAttributeFilterChange}
        onToggleFilterVisibility={toggleFilterVisibility}
      />
      
      {/* Yaş Doğrulama Modalı - Kaldırıldı */}

      {/* Age Verification Modal */}
      {/* <AgeVerificationModal
        showAgeVerification={showAgeVerification}
        isAdultVerified={isAdultVerified}
        onVerify={handleAgeVerification}
        onCancel={handleAgeVerificationCancel}
      /> */}
      
      <ScrollToTop />
    </>
  );
};

// SearchParams kullanan component'i Suspense ile sarmalayalım
const SearchPageContent = () => {
  return (
    <Suspense fallback={
      <div className="min-h-[100dvh] bg-gray-50">
        <Header />
        <main className="header-padding">
          <div className="w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </main>
      </div>
    }>
      <SearchPageClient initialQuery="" initialSearchData={null} />
    </Suspense>
  );
};

export default SearchPageClient;
