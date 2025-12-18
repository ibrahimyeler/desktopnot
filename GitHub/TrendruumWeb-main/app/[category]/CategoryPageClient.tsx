"use client";

import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '../../components/layout/Header';
import ScrollToTop from '../../components/ui/ScrollToTop';
import Breadcrumb from '../../components/common/Breadcrumb';

// Category Components
import CategoryHeader from '../../components/category/CategoryHeader';
import CategoryMobileHeader from '../../components/category/CategoryMobileHeader';
import CategorySidebar from '../../components/category/CategorySidebar';
import CategoryContent from '../../components/category/CategoryContent';
import CategorySEO from '../../components/category/CategorySEO';
import CategoryLoading from '../../components/category/CategoryLoading';
import CategoryNotFound from '../../components/category/CategoryNotFound';
import MobileSortModal from '../../components/category/MobileSortModal';
import MobileFiltersModal from '../../components/category/MobileFiltersModal';

// Types
import { FilterState, CategoryPageClientProps } from '../../components/category/types';

// Custom Hooks
import { useCategoryFilters } from '../../hooks/useCategoryFilters';
import { useCategoryData } from '../../hooks/useCategoryData';
import { useCategoryProducts } from '../../hooks/useCategoryProducts';
import { useCategoryScrollManagement } from '../../hooks/useCategoryScrollManagement';
import { useCategoryURLManagement } from '../../hooks/useCategoryURLManagement';
import { useCategoryAutoFilters } from '../../hooks/useCategoryAutoFilters';
import { useCategoryStickyManagement } from '../../hooks/useCategoryStickyManagement';

// Hooks
import { useFilterChips } from '../../components/category/FilterChips';

const CategoryPageClient = ({ 
  category, 
  initialCategoryData, 
  initialProducts, 
  initialSubCategories,
  categoryExists
}: CategoryPageClientProps) => {
  const router = useRouter();
  const params = useParams();

  const hasInitialCategoryData = Boolean(
    initialCategoryData &&
    (initialCategoryData.id || initialCategoryData.slug || initialCategoryData.name)
  );
  const isCategoryAvailable = typeof categoryExists === 'boolean' ? categoryExists : hasInitialCategoryData;
  const effectiveCategorySlug = isCategoryAvailable ? category : '';
  const normalizedInitialProducts = isCategoryAvailable ? initialProducts : { data: [] };
  const normalizedInitialCategoryData = isCategoryAvailable ? initialCategoryData : null;
  const normalizedInitialSubCategories = isCategoryAvailable ? initialSubCategories : [];
  
  // Server + client'ta tutarlı olması için başlangıç ürün listesini normalize et
  const initialProductArray = Array.isArray(initialProducts?.data)
    ? initialProducts.data
    : Array.isArray(initialProducts)
      ? initialProducts
      : [];

  const hasInitialProducts = initialProductArray.length > 0;
  
  // State for UI
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAdultVerified, setIsAdultVerified] = useState(() => {
    // SSR-safe: İlk render'da sessionStorage kontrolü
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isAdultVerified') === 'true';
    }
    return false;
  });
  const [isAdultCheckComplete, setIsAdultCheckComplete] = useState(!initialCategoryData?.is_adult);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const filtersInitializedRef = useRef(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({});
  const [appliedAttributeFilters, setAppliedAttributeFilters] = useState<Record<string, string[]>>({});
  const [appliedSortType, setAppliedSortType] = useState<string>('price_asc');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const previousOverflow = document.body.style.overflow;

    if (mobileFiltersOpen || mobileSortOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileFiltersOpen, mobileSortOpen]);

  // Scroll management hook
  useCategoryScrollManagement();

  // Sticky management hook
  useCategoryStickyManagement(category);

  // Custom hooks
  const {
    filters,
    setFilters,
    attributeFilters,
    setAttributeFilters,
    filterVisibility,
    setFilterVisibility,
    handleFilterChange: handleFilterChangeBase,
    handleAttributeFilterChange: handleAttributeFilterChangeBase,
    handlePriceChange: handlePriceChangeBase,
    toggleFilterVisibility,
    clearFilters,
    getSelectedValues,
    getSelectedCount,
    hasActiveFilters
  } = useCategoryFilters();

  // Filtre değişikliklerinde URL'yi otomatik güncelle (Q sayfasındaki gibi)
  const handleFilterChange = useCallback((filterType: string, value: string, checked: boolean) => {
    handleFilterChangeBase(filterType, value, checked);
  }, [handleFilterChangeBase]);

  const handleAttributeFilterChange = useCallback((attributeSlug: string, value: string, checked: boolean) => {
    handleAttributeFilterChangeBase(attributeSlug, value, checked);
  }, [handleAttributeFilterChangeBase]);

  const handlePriceChange = useCallback((priceRange: { min?: number; max?: number }) => {
    handlePriceChangeBase(priceRange);
  }, [handlePriceChangeBase]);

  const {
    categoryData,
    subCategories,
    subCategoriesLoading,
    availableColors,
    availableGenders,
    categoryAttributes,
    sortOptions,
    breadcrumbItems,
    seoData
  } = useCategoryData(category, initialCategoryData, initialSubCategories);

  const fallbackSortOptions = useMemo(() => (
    [
      { id: 'price_asc', name: 'En düşük fiyat', value: 'price_asc' },
      { id: 'price_desc', name: 'En yüksek fiyat', value: 'price_desc' },
      { id: 'name_asc', name: 'A-Z', value: 'name_asc' },
      { id: 'name_desc', name: 'Z-A', value: 'name_desc' }
    ]
  ), []);

  // Fiyat ve isim sıralama seçeneklerini filtrele
  const filteredSortOptions = useMemo(() => {
    if (!sortOptions || sortOptions.length === 0) {
      return fallbackSortOptions;
    }
    // price_asc, price_desc, name_asc ve name_desc seçeneklerini al
    return sortOptions.filter((option: any) => 
      option.value === 'price_asc' || option.value === 'price_desc' || 
      option.value === 'name_asc' || option.value === 'name_desc'
    );
  }, [sortOptions, fallbackSortOptions]);

  const mobileSortOptions = filteredSortOptions.length > 0 ? filteredSortOptions : fallbackSortOptions;

  const formatPriceLabel = useCallback((value: number) => {
    return new Intl.NumberFormat('tr-TR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Filter chips using hook
  const filterChips = useFilterChips({
    appliedFilters,
    appliedAttributeFilters,
    appliedSortType,
    availableGenders,
    subCategories,
    availableColors,
    categoryAttributes,
    sortOptions: mobileSortOptions,
    formatPriceLabel
  });

  const hasAppliedFilters = filterChips.length > 0;

  // Adult kategori kontrolü - initialCategoryData'dan al
  const isAdultCategory = initialCategoryData?.is_adult || categoryData?.is_adult || false;

  // Kategori yoksa ürün aramayı durdur
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
    currentSortType,
    priceRange,
    fetchSubcategoryProducts,
    loadMoreProducts,
    handleSortChange,
    handleSortedProducts,
    setError,
    setCurrentSortType
  } = useCategoryProducts(
    isCategoryAvailable ? category : '', 
    isCategoryAvailable ? normalizedInitialProducts : null, 
    appliedFilters, 
    appliedAttributeFilters, 
    categoryAttributes, 
    searchQuery
  );

  // Get categoryId from URL search params on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      setCategoryId(searchParams.get('id'));
    }
  }, []);

  // Alt kategori seçimi handler'ı
  const handleSubcategorySelection = useCallback((subcategorySlug: string, checked: boolean) => {
    setSelectedSubcategories(prev => {
      const newSelection = checked 
        ? [...prev, subcategorySlug]
        : prev.filter(slug => slug !== subcategorySlug);
      
      // Performans için maksimum 20 alt kategori seçimine izin ver
      const maxSelection = 20;
      if (newSelection.length > maxSelection) {
        alert(`Performans nedeniyle maksimum ${maxSelection} alt kategori seçebilirsiniz.`);
        return prev;
      }
      
      // Filtreleri güncelle
      setFilters(prevFilters => ({
        ...prevFilters,
        selectedSubcategories: newSelection
      }));
      
      return newSelection;
    });
  }, [setFilters]);

  // Tüm alt kategorileri seç/kaldır
  const handleSelectAllSubcategories = useCallback((selectAll: boolean) => {
    if (selectAll) {
      // Performans için maksimum 20 alt kategori seçimine izin ver
      const maxSelection = 20;
      const allSubcategorySlugs = subCategories.map(sub => sub.slug).slice(0, maxSelection);
      
      if (subCategories.length > maxSelection) {
        alert(`Performans nedeniyle sadece ilk ${maxSelection} alt kategori seçildi.`);
      }
      
      setSelectedSubcategories(allSubcategorySlugs);
      setFilters(prev => ({
        ...prev,
        selectedSubcategories: allSubcategorySlugs
      }));
    } else {
      setSelectedSubcategories([]);
      setFilters(prev => ({
        ...prev,
        selectedSubcategories: []
      }));
    }
  }, [subCategories, setFilters]);

  // XML feed linkini kopyala
  const copyXmlFeedLink = useCallback(async (event: React.MouseEvent) => {
    if (!category) return;
    
    const xmlFeedUrl = `https://api.trendruum.com/api/feed/${category}/products.xml`;
    
    try {
      await navigator.clipboard.writeText(xmlFeedUrl);
      
      // Tıklanan yerde "." işareti göster
      const button = event.currentTarget as HTMLButtonElement;
      if (button) {
        button.textContent = '.';
        button.style.opacity = '1';
        button.style.color = 'green';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        
        setTimeout(() => {
          if (button) {
            button.style.opacity = '0';
          }
        }, 1000);
      }
      
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = xmlFeedUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      // Tıklanan yerde "." işareti göster
      const button = event.currentTarget as HTMLButtonElement;
      if (button) {
        button.textContent = '.';
        button.style.opacity = '1';
        button.style.color = 'green';
        button.style.fontSize = '16px';
        button.style.fontWeight = 'bold';
        
        setTimeout(() => {
          if (button) {
            button.style.opacity = '0';
          }
        }, 1000);
      }
    }
  }, [category]);

  // Age verification handlers
  const handleAgeVerification = useCallback(() => {
    setIsAdultVerified(true);
    setShowAgeVerification(false);
    sessionStorage.setItem('isAdultVerified', 'true');
  }, []);

  const handleAgeVerificationCancel = useCallback(() => {
    window.location.href = '/';
  }, []);

  // +18 kategori kontrolü - İlk yükleme ve kategori değişiminde
  // Adult kategori kontrolü - Modal kaldırıldı, sadece filigran için hazırla
  useEffect(() => {
    // Modal gösterme, sadece filigran için hazırla
    setShowAgeVerification(false);
    setIsAdultVerified(true);
    setIsAdultCheckComplete(true);
  }, [isAdultCategory]);

  // URL Management hook
  const { applyFilters: applyFiltersFromHook, applyFiltersWithValues } = useCategoryURLManagement({
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
  });

  // Auto Filters hook
  const { setAutoFilters, setAutoFiltersSet } = useCategoryAutoFilters({
    filters,
    attributeFilters,
    setFilters,
    appliedSortType,
    applyFiltersWithValues
  });
  
  // Kategori değiştiğinde state'leri sıfırla
  useEffect(() => {
    setAutoFiltersSet(false);
    setIsAdultCheckComplete(false);
  }, [category, setAutoFiltersSet]);

  // İlk yükleme - sadece kategori değiştiğinde
  useEffect(() => {
    if (category) {
      const urlParams = new URLSearchParams(window.location.search);
      const hasGenderParam = urlParams.get('g');
      
      if (category.toLowerCase().includes('ayakkabi')) {
        return;
      }
      
      if (!hasGenderParam) {
        setAutoFilters(category);
      }
    }
  }, [category, setAutoFilters]);


  // Intersection Observer ile infinite scroll - Daha performanslı
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!hasMore || loadingMore || loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
            loadMoreProducts();
          }
      },
      {
        root: null,
        rootMargin: '200px', // 200px önceden yükle
        threshold: 0.1
      }
    );

    const currentTrigger = loadMoreTriggerRef.current;
    if (currentTrigger) {
      observer.observe(currentTrigger);
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger);
      }
    };
  }, [hasMore, loadingMore, loading, loadMoreProducts]);

  // Filtreler değiştiğinde işaretli olanları otomatik aç
  useEffect(() => {
    setFilterVisibility(prev => {
      const newVisibility: Record<string, boolean> = { ...prev };
    
    // Ana filtreler kontrol et
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        if (key === 'colors') {
          newVisibility.renk = true;
        } else if (key === 'genders') {
          newVisibility.cinsiyet = true;
        } else if (key === 'product_stars') {
          newVisibility.yildiz = true;
        } else if (key === 'selectedSubcategories') {
          newVisibility.altKategori = true;
        }
      }
      else if (key === 'prices' && value && typeof value === 'object') {
        const priceValue = value as { min?: number; max?: number };
        if (typeof priceValue.min === 'number' || typeof priceValue.max === 'number') {
          newVisibility.fiyat = true;
        }
      }
    });
    
    // Attribute filtreler kontrol et - sadece işaretli olanları aç
    Object.entries(attributeFilters).forEach(([attributeSlug, selectedValues]) => {
      if (selectedValues.length > 0) {
        newVisibility[attributeSlug] = true;
      } else {
        // Eğer hiç değer seçilmemişse kapat
        newVisibility[attributeSlug] = false;
      }
    });
    
      return newVisibility;
    });
  }, [filters, attributeFilters, setFilterVisibility]);

  // URL'yi güncelle - yukarı taşındı

  // Filtreler artık yalnızca Uygula ile gönderiliyor

  // Seçili değerleri hesapla - hooks'tan gelen fonksiyonları kullan
  const getSelectedValuesForFilters = useCallback((filterType: string) => {
    return getSelectedValues(filterType);
  }, [getSelectedValues]);

  const getSelectedCountForFilters = useCallback((filterType: string) => {
    return getSelectedCount(filterType);
  }, [getSelectedCount]);

  // Sıralama handler'ı - URL güncelleme ile
  const handleSortChangeWithURL = useCallback((sortType: string) => {
    void applyFiltersWithValues(filters, attributeFilters, sortType);
  }, [applyFiltersWithValues, filters, attributeFilters]);

  // Apply filters wrapper
  // NOT: appliedFilters state'i applyFiltersWithValues içinde set ediliyor, burada set etmeye gerek yok
  // Çünkü applyFiltersFromHook -> applyFiltersWithValues çağrılıyor ve orada zaten set ediliyor
  const applyFilters = useCallback((options?: { sortType?: string; closeMobileFilters?: boolean }) => {
    // applyFiltersFromHook içinde applyFiltersWithValues çağrılıyor
    // ve orada appliedFilters zaten set ediliyor, burada tekrar set etmeye gerek yok
    return applyFiltersFromHook(currentSortType, options);
  }, [applyFiltersFromHook, currentSortType]);

  // Don't render until we have the category slug
  if (!category) {
    return <CategoryLoading />;
  }

  // Kategori yoksa özel mesaj göster
  if (!isCategoryAvailable) {
    return <CategoryNotFound category={category} />;
  }

  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <main 
        data-page="category" 
        className="category-page-main w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-16 md:pt-0 pb-8 sm:pb-12 lg:py-0 xl:py-0" 
        style={{ 
          position: 'relative', 
          overflow: 'visible',
          display: 'block',
          flex: 'none'
        }}
      >
        <div className="w-full mt-0 sm:mt-2 lg:mt-5">
          
          {/* Breadcrumb - Desktop Only */}
          <div className="hidden lg:block mb-2 lg:mb-3 p-3 -ml-1">
            <Breadcrumb 
              items={breadcrumbItems}
              className="text-xs sm:text-sm"
            />
          </div>
          
          {/* Mobile Category Header */}
          <CategoryMobileHeader
            categoryData={categoryData}
            category={category}
            sortedProducts={sortedProducts}
            loading={loading}
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
            sortOptions={mobileSortOptions}
            hasActiveFilters={hasActiveFilters()}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 mt-2 sm:mt-3 lg:mt-4 xl:mt-6" style={{ overflow: 'visible', position: 'relative', alignItems: 'start' }}>
            {/* Filter Sidebar */}
            <CategorySidebar
              categoryData={categoryData}
              category={category}
              sortedProducts={sortedProducts}
              loading={loading}
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
              onFilterChange={handleFilterChange}
              onAttributeFilterChange={handleAttributeFilterChange}
              onPriceChange={handlePriceChange}
              onSubcategorySelection={handleSubcategorySelection}
              onSelectAllSubcategories={handleSelectAllSubcategories}
              onToggleFilterVisibility={toggleFilterVisibility}
              getSelectedValues={getSelectedValuesForFilters}
              getSelectedCount={getSelectedCountForFilters}
              mobileFiltersOpen={mobileFiltersOpen}
              onApply={() => {
                void applyFilters();
              }}
            />
            
            {/* Main Content Area */}
            <div className="lg:col-span-9 xl:col-span-9 2xl:col-span-9 flex-1">
              {/* Desktop Header */}
              <CategoryHeader
                  category={category}
                categoryData={categoryData}
                sortedProducts={sortedProducts}
                totalProducts={totalProducts}
                  loading={loading}
                filteredProducts={filteredProducts}
                    sortOptions={filteredSortOptions}
                    onSortChange={handleSortChangeWithURL}
                onSortedProducts={handleSortedProducts}
                onCopyXmlFeed={copyXmlFeedLink}
                isMobile={false}
                  />
              
              {/* Mobile Header */}
              <CategoryHeader
                    category={category}
                categoryData={categoryData}
                sortedProducts={sortedProducts}
                totalProducts={totalProducts}
                    loading={loading}
                filteredProducts={filteredProducts}
                    sortOptions={filteredSortOptions}
                    onSortChange={handleSortChangeWithURL}
                onSortedProducts={handleSortedProducts}
                onCopyXmlFeed={copyXmlFeedLink}
                isMobile={true}
              />
              
              <CategoryContent
                loading={loading}
                error={error}
                sortedProducts={sortedProducts}
                categoryData={categoryData}
                    isAdultVerified={isAdultVerified}
                    showAgeVerification={showAgeVerification}
                loadingMore={loadingMore}
                isAdultCheckComplete={isAdultCheckComplete}
                hasInitialProducts={hasInitialProducts}
                isAdultCategory={isAdultCategory}
                loadMoreTriggerRef={loadMoreTriggerRef}
                hasMore={hasMore}
              />
            </div>
          </div>
        </div>
      </main>
      
      <MobileSortModal
        isOpen={mobileSortOpen}
        onClose={() => setMobileSortOpen(false)}
        sortOptions={mobileSortOptions}
        currentSortType={currentSortType}
        onSortChange={handleSortChangeWithURL}
      />

      <MobileFiltersModal
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        onApply={() => {
                void applyFilters({ closeMobileFilters: true });
              }}
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
              onFilterChange={handleFilterChange}
              onAttributeFilterChange={handleAttributeFilterChange}
              onPriceChange={handlePriceChange}
              onSubcategorySelection={handleSubcategorySelection}
              onSelectAllSubcategories={handleSelectAllSubcategories}
              onToggleFilterVisibility={toggleFilterVisibility}
              getSelectedValues={getSelectedValuesForFilters}
              getSelectedCount={getSelectedCountForFilters}
            />

      {/* Age Verification Modal - Kaldırıldı */}
      
      {/* Category SEO Section */}
      <CategorySEO
        seoTitle={seoData.seo_title}
        seoDesc={seoData.seo_desc}
        seoKeywords={seoData.seo_keywords}
        keywords={seoData.keywords}
        categoryName={categoryData?.name}
      />
      
      <ScrollToTop />
    </>
  );
};

export default CategoryPageClient;
