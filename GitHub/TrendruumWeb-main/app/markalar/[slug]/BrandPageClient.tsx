"use client";

import Link from 'next/link'
import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Header from '../../../components/layout/Header';
import ScrollToTop from '../../../components/ui/ScrollToTop';
import SortingButton from '../../../components/flashUrunler/SortingButton'
import SearchResultInfo from '../../../components/flashUrunler/SearchResultInfo'
import ProductGrid from '../../../components/flashUrunler/ProductGrid'
import BrandNotFound from '../../../components/markalar/BrandNotFound'
import NoProductsFound from '../../../components/markalar/NoProductsFound'
import BrandMobileHeader from '../../../components/markalar/BrandMobileHeader'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { 
  DynamicFilter,
  AttributeFilter,
  ColorFilter,
  GenderFilter,
  PriceFilter,
  StarFilter
} from '../../../components/filter';
import { Product } from '../../../types/product';
import { TruckIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';
import AgeVerificationModal from '../../../components/category/AgeVerificationModal';

export interface Color {
  id: string;
  name: string;
  value: string;
  code: string;
  count: number;
}

interface FilterState {
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
  categories?: string[];
}

interface BrandData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: {
    url: string;
  };
  product_count?: number;
  is_adult?: boolean;
}

interface BrandPageClientProps {
  brandSlug: string;
  initialProductsData: any;
  initialFiltersData: any;
  initialBrandData: BrandData | null;
  brandNotFound: boolean;
}

const VISIBLE_FILTER_COUNT = 8;
const FILTER_SECTION_ESTIMATED_HEIGHT = 62;

const BrandPageClient: React.FC<BrandPageClientProps> = ({
  brandSlug,
  initialProductsData,
  initialFiltersData,
  initialBrandData,
  brandNotFound
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(initialBrandData);
  const [brandNotFoundState, setBrandNotFoundState] = useState(brandNotFound);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [currentSortType, setCurrentSortType] = useState('recommended');
  
  // Age verification state'leri
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAdultVerified, setIsAdultVerified] = useState(() => {
    // SSR-safe: İlk render'da sessionStorage kontrolü
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('isAdultVerified') === 'true';
    }
    return false;
  });
  const [isAdultCheckComplete, setIsAdultCheckComplete] = useState(!initialBrandData?.is_adult);
  
  // Infinite scroll state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Intersection Observer için ref
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const urlFiltersLoadedRef = useRef(false);
  
  // Filtre state'leri
  const [filters, setFilters] = useState<FilterState>({});
  const [attributeFilters, setAttributeFilters] = useState<Record<string, string[]>>({});
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({
    kategori: false,
    renk: false,
    cinsiyet: false,
    yas: false,
    paket: false,
    fiyat: false,
    yildiz: false,
    beden: false
  });
  
  // Filtre seçenekleri
  const [availableColors, setAvailableColors] = useState<any[]>([]);
  const [availableGenders, setAvailableGenders] = useState<any[]>([]);
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [availableAttributes, setAvailableAttributes] = useState<any[]>([]);
  const [availableAges, setAvailableAges] = useState<any[]>([]);
  const [availablePackageContents, setAvailablePackageContents] = useState<any[]>([]);
  const [filtersLoading, setFiltersLoading] = useState(false);

  // Initialize with server data
  useEffect(() => {
    if (initialProductsData) {
      // Format products from server data
      if (initialProductsData.data && Object.keys(initialProductsData.data).length > 0) {
        const productsArray = Object.values(initialProductsData.data);
        const formattedProducts = productsArray.map((apiProduct: any) => {
          const formattedProduct = {
            id: apiProduct.parent_id || apiProduct.slug || apiProduct.model_code,
            name: apiProduct.name,
            slug: apiProduct.slug,
            price: apiProduct.price,
            stock: apiProduct.stock,
            status: apiProduct.status,
            rating: apiProduct.average_rating ?? apiProduct.point_count ?? 0,
            average_rating: apiProduct.average_rating ?? apiProduct.point_count ?? 0,
            reviewCount: apiProduct.review_count ?? apiProduct.comment_count ?? 0,
            review_count: apiProduct.review_count ?? apiProduct.comment_count ?? 0,
            brand: apiProduct.brand?.name || '',
            category: apiProduct.category?.name || '',
            gender: apiProduct.attributes?.find((attr: any) => attr.slug === 'cinsiyet')?.value_slug || 'unisex',
            images: [] as any[],
            medias: [] as any[],
            seller: {
              id: '',
              name: brandData?.name || brandSlug,
              slug: brandSlug,
              shipping_policy: {
                general: {
                  delivery_time: 3,
                  shipping_fee: 0,
                  free_shipping_threshold: 150,
                  carrier: 'Yurtiçi Kargo'
                },
                custom: []
              }
            }
          };

          if (apiProduct.medias && apiProduct.medias.length > 0) {
            formattedProduct.images = apiProduct.medias.map((media: any) => {
              return {
                url: media.url || media.fullpath || '/placeholder-product.jpg',
                name: media.name || '',
                id: media.name || media.id?.$oid || ''
              };
            });
            formattedProduct.medias = formattedProduct.images;
          } else {
            formattedProduct.images = [{
              url: '/placeholder-product.jpg',
              name: apiProduct.name,
              id: 'placeholder'
            }];
            formattedProduct.medias = formattedProduct.images;
          }

          return formattedProduct;
        });

        setAllProducts(formattedProducts as any);
        setFilteredProducts(formattedProducts as any);
        setTotalProducts(initialProductsData.pagination?.total || 0);
        setTotalPages(initialProductsData.pagination?.last_page || 0);
        setHasMorePages(initialProductsData.pagination?.current_page < initialProductsData.pagination?.last_page);
      }
    }

    if (initialFiltersData) {
      // Process filters from server data
      if (initialFiltersData.categories && Array.isArray(initialFiltersData.categories)) {
        const categories = initialFiltersData.categories.map((category: any) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          count: category.product_count || 0
        }));
        setAvailableCategories(categories);
      }
      
      if (initialFiltersData.filters?.attributes && Array.isArray(initialFiltersData.filters.attributes)) {
        const attributes = initialFiltersData.filters.attributes.map((attr: any) => ({
          id: attr.id,
          name: attr.name,
          slug: attr.slug,
          type: attr.type,
          values: attr.values || []
        }));
        setAvailableAttributes(attributes);
      }
    }
  }, [initialProductsData, initialFiltersData, brandData, brandSlug]);

  const uniqueColors: Color[] = useMemo(() => {
    if (!allProducts) return [];
    
    const colorCounts = allProducts.flatMap(product => product.colors || [])
      .reduce((acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const uniqueColorStrings = [...new Set(Object.keys(colorCounts))];
    
    return uniqueColorStrings.map(color => ({
      id: color,
      name: color,
      value: color,
      code: color,
      count: colorCounts[color]
    }));
  }, [allProducts]);

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
  useEffect(() => {
    const isAdultCategory = brandData?.is_adult || false;
    

    if (isAdultCategory) {
      const verified = sessionStorage.getItem('isAdultVerified') === 'true';
      if (!verified) {
        setShowAgeVerification(true);
        setIsAdultVerified(false);
      } else {
        // Daha önce doğrulanmışsa modalı gösterme
        setShowAgeVerification(false);
        setIsAdultVerified(true);
      }
      // Adult kontrol tamamlandı, ürünleri göster
      setIsAdultCheckComplete(true);
    } else {
      setShowAgeVerification(false);
      setIsAdultVerified(false);
      // Normal kategori, direkt göster
      setIsAdultCheckComplete(true);
    }
  }, [brandData?.is_adult]);

  const uniqueSizes = useMemo(() => {
    if (!allProducts) return [];
    return [...new Set(allProducts.flatMap(product => product.sizes || []))];
  }, [allProducts]);

  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 10000 };
    
    return {
      min: allProducts.reduce((min, p) => Math.min(min, Number(p.price)), Number(allProducts[0].price)),
      max: allProducts.reduce((max, p) => Math.max(max, Number(p.price)), Number(allProducts[0].price))
    };
  }, [allProducts]);

  // URL'yi güncelle
  const updateURL = useCallback((newFilters: FilterState, newAttributeFilters: Record<string, string[]>) => {
    const params = new URLSearchParams();
    
    // Cinsiyet filtresi
    if (newFilters.genders?.includes('kadin-kiz')) {
      params.set('g', '1'); // Kadın/Kız
    } else if (newFilters.genders?.includes('erkek')) {
      params.set('g', '2'); // Erkek
    }
    
    // Renk filtresi - v_renk prefix ile
    if (newFilters.colors && newFilters.colors.length > 0) {
      params.set('v_renk', newFilters.colors.join(','));
    }
    
    // Fiyat filtresi
    if (typeof newFilters.prices?.min === 'number') {
      params.set('min', newFilters.prices.min.toString());
    }
    if (typeof newFilters.prices?.max === 'number') {
      params.set('max', newFilters.prices.max.toString());
    }
    
    // Yıldız filtresi - a_product_stars prefix ile
    if (newFilters.product_stars && newFilters.product_stars.length > 0) {
      params.set('a_product_stars', newFilters.product_stars.join(','));
    }
    
    // Kategori filtresi
    if (newFilters.categories && newFilters.categories.length > 0) {
      params.set('categories', newFilters.categories.join(','));
    }
    
    // Attribute filtreleri
    Object.entries(newAttributeFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    
    // URL'yi güncelle
    const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    router.push(newURL, { scroll: false });
  }, [router]);

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

  // Filtre görünürlüğü toggle
  const toggleFilterVisibility = useCallback((filterKey: string) => {
    setFilterVisibility(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  }, []);

  // Scroll pozisyonunu restore et (ürün detayından geri dönüldüğünde)
  useEffect(() => {
    if (typeof window === 'undefined' || sortedProducts.length === 0) return;

    const savedProductId = sessionStorage.getItem('brandProductId');
    const savedScrollPosition = sessionStorage.getItem('brandScrollPosition');
    const savedProductSlug = sessionStorage.getItem('brandProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('brandProductBaseSlug');
    
    if (savedProductId && savedScrollPosition) {
      // Ürünler render edildikten sonra scroll et
      const timer = setTimeout(() => {
        const scrollToElement = (element: HTMLElement) => {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100;
          
          window.scrollTo({
            top: Math.max(offsetPosition, 0),
            behavior: 'smooth'
          });
        };

        let productElement: HTMLElement | null = null;

        if (savedProductId) {
          productElement = document.getElementById(`product-${savedProductId}`);
        }

        if (!productElement && savedProductSlug) {
          productElement = document.querySelector(`[data-product-slug="${savedProductSlug}"]`) as HTMLElement | null;
        }

        if (!productElement && savedProductBaseSlug) {
          productElement = document.querySelector(`[data-product-slug^="${savedProductBaseSlug}"]`) as HTMLElement | null;
        }

        if (productElement) {
          scrollToElement(productElement);
        } else {
          // Ürün bulunamazsa kaydedilen scroll pozisyonuna git
          const scrollPos = parseInt(savedScrollPosition, 10);
          if (!isNaN(scrollPos)) {
            window.scrollTo({
              top: scrollPos,
              behavior: 'smooth'
            });
          }
        }
        
        // SessionStorage'ı temizle
        sessionStorage.removeItem('brandProductId');
        sessionStorage.removeItem('brandScrollPosition');
        sessionStorage.removeItem('brandProductSlug');
        sessionStorage.removeItem('brandProductBaseSlug');
      }, 300); // Render tamamlanması için kısa bir gecikme

      return () => clearTimeout(timer);
    }
  }, [sortedProducts]);

  // Sticky için TÜM parent container'ları override et - DEBOUNCED
  useEffect(() => {
    let isFixed = false;
    let fixTimeout: NodeJS.Timeout;
    
    const fixStickyParents = () => {
      // Eğer zaten düzeltildiyse tekrar çalıştırma
      if (isFixed) return;
      
      const stickyElement = document.querySelector('.sticky.top-24') as HTMLElement;
      if (!stickyElement) {
        // Sticky element henüz render edilmemiş, tekrar dene
        fixTimeout = setTimeout(fixStickyParents, 200);
        return;
      }
      
      // Header yüksekliğini al (CSS variable'dan veya direkt ölç)
      const headerHeight = typeof window !== 'undefined' 
        ? getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '96px'
        : '96px';
      
      // Header element'ini bul ve yüksekliğini ölç
      const headerElement = document.querySelector('header, [role="banner"], .header') as HTMLElement;
      let actualHeaderHeight = 96; // Default 96px
      
      if (headerElement) {
        const headerRect = headerElement.getBoundingClientRect();
        actualHeaderHeight = headerRect.height;
      } else if (headerHeight && headerHeight !== '') {
        const heightMatch = headerHeight.match(/(\d+)/);
        if (heightMatch) {
          actualHeaderHeight = parseInt(heightMatch[1]);
        }
      }
      
      // Header yüksekliğinden 10px çıkararak sticky'yi biraz yukarı taşı (minimum 80px)
      const stickyTop = Math.max(80, actualHeaderHeight - 10);
      
      // Sticky element'e direkt style uygula
      stickyElement.style.setProperty('position', 'sticky', 'important');
      stickyElement.style.setProperty('top', `${stickyTop}px`, 'important');
      stickyElement.style.setProperty('z-index', '10', 'important');
      stickyElement.style.setProperty('will-change', 'transform', 'important');
      
      // Grid column parent'ını bul ve yüksekliğini ayarla
      const gridColumn = stickyElement.closest('.lg\\:col-span-3') as HTMLElement;
      const gridContainerElement = gridColumn?.parentElement as HTMLElement;
      
      if (gridColumn) {
        // Grid column'un yüksekliğini içeriğe göre ayarla
        gridColumn.style.setProperty('align-self', 'start', 'important');
        gridColumn.style.setProperty('overflow', 'visible', 'important');
        gridColumn.style.setProperty('position', 'relative', 'important');
        // Grid column'un yüksekliğini sağ kolonun yüksekliğine eşitle - STICKY İÇİN KRİTİK
        const rightColumn = gridContainerElement?.querySelector('.lg\\:col-span-9') as HTMLElement;
        if (rightColumn) {
          const rightColumnHeight = rightColumn.scrollHeight || rightColumn.offsetHeight;
          if (rightColumnHeight > 0) {
            // Grid column'un yüksekliğini sağ kolonun yüksekliğine eşitle
            gridColumn.style.setProperty('height', `${rightColumnHeight}px`, 'important');
            gridColumn.style.setProperty('min-height', `${rightColumnHeight}px`, 'important');
          }
        }
      }
      
      // Grid container'ın yüksekliğini ayarla - sticky için kritik
      if (gridContainerElement) {
        gridContainerElement.style.setProperty('overflow', 'visible', 'important');
        gridContainerElement.style.setProperty('position', 'relative', 'important');
        // Grid container'ın yüksekliğini içeriğe göre ayarla
        const rightColumn = gridContainerElement.querySelector('.lg\\:col-span-9') as HTMLElement;
        if (rightColumn) {
          // Sağ kolonun yüksekliğine göre grid container'ın yüksekliğini ayarla
          const rightColumnHeight = rightColumn.scrollHeight || rightColumn.offsetHeight;
          if (rightColumnHeight > 0) {
            gridContainerElement.style.setProperty('min-height', `${rightColumnHeight}px`, 'important');
          }
        }
      }
      
      // Sticky element'ten body'ye kadar TÜM parent'ları kontrol et
      let parent = stickyElement.parentElement;
      const parentsToFix: HTMLElement[] = [];
      
      while (parent && parent !== document.body && parent !== document.documentElement) {
        parentsToFix.push(parent as HTMLElement);
        parent = parent.parentElement;
      }
      
      // #__next, main, html, body'yi de ekle
      const nextContainer = document.getElementById('__next');
      const mainElement = document.querySelector('main');
      const gridContainer = document.querySelector('.grid.grid-cols-1');
      const htmlElement = document.documentElement;
      const bodyElement = document.body;
      
      if (nextContainer) parentsToFix.push(nextContainer);
      if (mainElement) parentsToFix.push(mainElement as HTMLElement);
      if (gridContainer) parentsToFix.push(gridContainer as HTMLElement);
      if (htmlElement) parentsToFix.push(htmlElement);
      if (bodyElement) parentsToFix.push(bodyElement);
      
      // Tüm parent'ları düzelt - sadece gerektiğinde
      parentsToFix.forEach(el => {
        const computed = window.getComputedStyle(el);
        
        // Overflow kontrolü ve düzeltme - sadece gerektiğinde
        if (computed.overflow !== 'visible' || computed.overflowX !== 'visible' || computed.overflowY !== 'visible') {
          el.style.setProperty('overflow', 'visible', 'important');
          el.style.setProperty('overflow-x', 'visible', 'important');
          el.style.setProperty('overflow-y', 'visible', 'important');
        }
        
        // Display ve flex düzeltme (#__next ve main için)
        if (el.id === '__next' && computed.display !== 'block') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('flex-direction', 'column', 'important');
        }
        
        if (el.tagName === 'MAIN' && computed.flex !== 'none') {
          el.style.setProperty('display', 'block', 'important');
          el.style.setProperty('flex', 'none', 'important');
        }
        
        // Grid container için
        if (el.classList.contains('grid') && computed.overflow !== 'visible') {
          el.style.setProperty('overflow', 'visible', 'important');
          el.style.setProperty('align-items', 'start', 'important');
        }
      });
      
      isFixed = true;
    };
    
    // İlk çalıştırma - biraz gecikme ile
    fixTimeout = setTimeout(fixStickyParents, 100);
    
    // Resize event'inde de çalıştır (debounced)
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        isFixed = false; // Reset flag to allow re-fixing
        fixStickyParents();
      }, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(fixTimeout);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [brandSlug]); // brandSlug değiştiğinde tekrar çalıştır

  // Filtreleri temizle
  const clearFilters = useCallback(() => {
    setFilters({});
    setAttributeFilters({});
    // URL'yi de temizle
    router.push(window.location.pathname, { scroll: false });
  }, [router]);

  // Filtreleri uygula (category ve q sayfası gibi)
  const applyFilters = useCallback((skipURLUpdate = false) => {
    let filtered = [...allProducts];

    // Renk filtresi
    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && filters.colors!.some(color => 
          product.colors!.includes(color)
        )
      );
    }

    // Cinsiyet filtresi
    if (filters.genders && filters.genders.length > 0) {
      filtered = filtered.filter(product => 
        product.gender && filters.genders!.includes(product.gender)
      );
    }

    // Fiyat filtresi
    if (filters.prices && (typeof filters.prices.min === 'number' || typeof filters.prices.max === 'number')) {
      filtered = filtered.filter(product => {
        const meetsMin = typeof filters.prices?.min === 'number' ? product.price >= (filters.prices?.min as number) : true;
        const meetsMax = typeof filters.prices?.max === 'number' ? product.price <= (filters.prices?.max as number) : true;
        return meetsMin && meetsMax;
      });
    }

    // Yıldız filtresi
    if (filters.product_stars && filters.product_stars.length > 0) {
      filtered = filtered.filter(product => 
        product.rating && filters.product_stars!.some(star => 
          product.rating! >= parseInt(star)
        )
      );
    }

    // Beden filtresi
    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && filters.sizes!.some(size => 
          product.sizes!.includes(size)
        )
      );
    }

    // Attribute filtreleri
    Object.entries(attributeFilters).forEach(([attributeSlug, selectedValues]) => {
      if (selectedValues.length > 0) {
        filtered = filtered.filter(product => {
          // Bu kısım product'ın attribute'larına göre ayarlanmalı
          return true; // Şimdilik tüm ürünleri geçir
        });
      }
    });

    setFilteredProducts(filtered);
    
    // URL'yi güncelle (sadece skipURLUpdate false ise)
    if (!skipURLUpdate) {
      updateURL(filters, attributeFilters);
    }
  }, [allProducts, filters, attributeFilters, updateURL]);

  // URL'den filtreleri oku ve state'e yükle (sadece mount olduğunda)
  useEffect(() => {
    // Sadece ilk yüklemede çalış
    if (urlFiltersLoadedRef.current) return;
    
    const urlFilters: FilterState = {};
    const urlAttributeFilters: Record<string, string[]> = {};
    
    // Cinsiyet filtresi
    const genderParam = searchParams.get('g');
    if (genderParam === '1') {
      urlFilters.genders = ['kadin-kiz'];
    } else if (genderParam === '2') {
      urlFilters.genders = ['erkek'];
    }
    
    // Renk filtresi - v_renk prefix ile
    const colorParam = searchParams.get('v_renk');
    if (colorParam) {
      urlFilters.colors = colorParam.split(',');
    }
    
    // Fiyat filtresi
    const minPrice = searchParams.get('min');
    const maxPrice = searchParams.get('max');
    if (minPrice && maxPrice) {
      urlFilters.prices = {
        min: parseInt(minPrice),
        max: parseInt(maxPrice)
      };
    }
    
    // Yıldız filtresi - a_product_stars prefix ile
    const starsParam = searchParams.get('a_product_stars');
    if (starsParam) {
      urlFilters.product_stars = starsParam.split(',');
    }
    
    // Kategori filtresi
    const categoriesParam = searchParams.get('categories');
    if (categoriesParam) {
      urlFilters.categories = categoriesParam.split(',');
    }
    
    // Diğer attribute filtreleri
    searchParams.forEach((value, key) => {
      if (key.startsWith('a_')) {
        urlAttributeFilters[key] = value.split(',');
      }
    });
    
    // State'leri güncelle
    setFilters(urlFilters);
    setAttributeFilters(urlAttributeFilters);
    
    // URL'den filtreler varsa, ilk yüklemede uygula
    if (Object.keys(urlFilters).length > 0 || Object.keys(urlAttributeFilters).length > 0) {
      urlFiltersLoadedRef.current = true;
      // Filtreleri uygula (URL güncellemesi olmadan)
      setTimeout(() => {
        // applyFilters'ı doğrudan çağırmak yerine, filtreleme mantığını burada uygula
        let filtered = [...allProducts];

        // Renk filtresi
        if (urlFilters.colors && urlFilters.colors.length > 0) {
          filtered = filtered.filter(product => 
            product.colors && urlFilters.colors!.some(color => 
              product.colors!.includes(color)
            )
          );
        }

        // Cinsiyet filtresi
        if (urlFilters.genders && urlFilters.genders.length > 0) {
          filtered = filtered.filter(product => 
            product.gender && urlFilters.genders!.includes(product.gender)
          );
        }

        // Fiyat filtresi
        if (urlFilters.prices && (typeof urlFilters.prices.min === 'number' || typeof urlFilters.prices.max === 'number')) {
          filtered = filtered.filter(product => {
            const meetsMin = typeof urlFilters.prices?.min === 'number' ? product.price >= (urlFilters.prices?.min as number) : true;
            const meetsMax = typeof urlFilters.prices?.max === 'number' ? product.price <= (urlFilters.prices?.max as number) : true;
            return meetsMin && meetsMax;
          });
        }

        // Yıldız filtresi
        if (urlFilters.product_stars && urlFilters.product_stars.length > 0) {
          filtered = filtered.filter(product => 
            product.rating && urlFilters.product_stars!.some(star => 
              product.rating! >= parseInt(star)
            )
          );
        }

        // Beden filtresi
        if (urlFilters.sizes && urlFilters.sizes.length > 0) {
          filtered = filtered.filter(product => 
            product.sizes && urlFilters.sizes!.some(size => 
              product.sizes!.includes(size)
            )
          );
        }

        setFilteredProducts(filtered);
      }, 100);
    } else {
      urlFiltersLoadedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sıralama işlemleri
  const handleSortedProducts = useCallback((newSortedProducts: Product[]) => {
    // Duplicate ID'leri kaldır
    const uniqueProducts = newSortedProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    setSortedProducts(uniqueProducts);
  }, []);

  // SortingButton'dan gelen sort değişikliği
  const handleSortFromButton = useCallback((sortType: string) => {
    setCurrentSortType(sortType);
  }, []);

  // Sorting seçenekleri
  const sortOptions = [
    { id: 'recommended', name: 'Önerilen', value: 'recommended' },
    { id: 'price_asc', name: 'En düşük fiyat', value: 'price_asc' },
    { id: 'price_desc', name: 'En yüksek fiyat', value: 'price_desc' },
    { id: 'name_asc', name: 'A-Z', value: 'name_asc' },
    { id: 'name_desc', name: 'Z-A', value: 'name_desc' }
  ];

  // Aktif filtre kontrolü
  const hasActiveFilters = useCallback(() => {
    const hasColors = filters.colors && filters.colors.length > 0;
    const hasGenders = filters.genders && filters.genders.length > 0;
    const hasStars = filters.product_stars && filters.product_stars.length > 0;
    const hasPrices = filters.prices && (typeof filters.prices.min === 'number' || typeof filters.prices.max === 'number');
    const hasCategories = filters.categories && filters.categories.length > 0;
    const hasAttributes = Object.values(attributeFilters).some(values => values.length > 0);
    
    return hasColors || hasGenders || hasStars || hasPrices || hasCategories || hasAttributes;
  }, [filters, attributeFilters]);

  // Sıralama fonksiyonu
  const sortProducts = useCallback((productsToSort: Product[], sortType: string): Product[] => {
    if (!productsToSort || productsToSort.length === 0) {
      return [];
    }

    const sortedProducts = [...productsToSort];

    // Önce stok durumuna göre sırala (stokta olmayanlar üstte)
    const sortByStock = (a: Product, b: Product) => {
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;
      
      // Stokta olmayan ürünler üstte
      if (stockA === 0 && stockB > 0) return -1;
      if (stockA > 0 && stockB === 0) return 1;
      
      return 0;
    };

    switch (sortType) {
      case 'price_asc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return a.price - b.price;
        });
      
      case 'price_desc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return b.price - a.price;
        });
      
      case 'name_asc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return (a.name || '').localeCompare(b.name || '');
        });
      
      case 'name_desc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return (b.name || '').localeCompare(a.name || '');
        });
      
      case 'recommended':
      default:
        // Önerilen sıralama: Önce stok durumu, sonra fiyat ve kargo ücreti kombinasyonu
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          
          const shippingFeeA = a.seller?.shipping_policy?.general?.shipping_fee || 0;
          const shippingFeeB = b.seller?.shipping_policy?.general?.shipping_fee || 0;
          const scoreA = a.price + shippingFeeA;
          const scoreB = b.price + shippingFeeB;
          return scoreA - scoreB;
        });
    }
  }, []);

  useEffect(() => {
    // Filtrelenmiş ürünler değiştiğinde, mevcut sıralama tipine göre sırala
    const uniqueProducts = filteredProducts.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );
    const sorted = sortProducts(uniqueProducts, currentSortType);
    setSortedProducts(sorted);
  }, [filteredProducts, currentSortType, sortProducts]);

  // Filtre bileşenlerini render et
  const renderFilters = () => {
    const filterSections: React.ReactNode[] = [];

    if (availableCategories.length > 0) {
      filterSections.push(
        <DynamicFilter
          key="category"
          title="Kategori"
          isVisible={filterVisibility.kategori ?? true}
          onToggle={() => toggleFilterVisibility('kategori')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableCategories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.categories?.includes(category.slug) || false}
                  onChange={(e) => handleFilterChange('categories', category.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{category.name}</span>
              </label>
            ))}
          </div>
        </DynamicFilter>
      );
    }

    if (availableColors.length > 0) {
      filterSections.push(
        <DynamicFilter
          key="color"
          title="Renk"
          isVisible={filterVisibility.renk ?? true}
          onToggle={() => toggleFilterVisibility('renk')}
        >
          <ColorFilter
            colors={availableColors}
            selectedColors={filters.colors || []}
            onColorChange={(color, checked) => handleFilterChange('colors', color, checked)}
          />
        </DynamicFilter>
      );
    }

    filterSections.push(
      <DynamicFilter
        key="gender"
        title="Cinsiyet"
        isVisible={filterVisibility.cinsiyet ?? true}
        onToggle={() => toggleFilterVisibility('cinsiyet')}
      >
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {[
            { id: 'unisex', name: 'Unisex', slug: 'unisex' },
            { id: 'kadin-kiz', name: 'Kadın / Kız', slug: 'kadin-kiz' },
            { id: 'erkek', name: 'Erkek', slug: 'erkek' }
          ].map((gender) => (
            <label key={gender.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
              <input
                type="checkbox"
                checked={filters.genders?.includes(gender.slug) || false}
                onChange={(e) => handleFilterChange('genders', gender.slug, e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
              />
              <span className="text-sm text-gray-700 flex-1">{gender.name}</span>
            </label>
          ))}
        </div>
      </DynamicFilter>
    );

    if (availableAges.length > 0) {
      filterSections.push(
        <DynamicFilter
          key="age"
          title="Yaş"
          isVisible={filterVisibility.yas ?? true}
          onToggle={() => toggleFilterVisibility('yas')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableAges.map((age) => (
              <label key={age.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={attributeFilters['a_yas']?.includes(age.slug) || false}
                  onChange={(e) => handleAttributeFilterChange('a_yas', age.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{age.name}</span>
              </label>
            ))}
          </div>
        </DynamicFilter>
      );
    }

    if (availablePackageContents.length > 0) {
      filterSections.push(
        <DynamicFilter
          key="package"
          title="Paket İçeriği"
          isVisible={filterVisibility.paket ?? true}
          onToggle={() => toggleFilterVisibility('paket')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availablePackageContents.map((pkg) => (
              <label key={pkg.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={attributeFilters['a_paket-icerigi']?.includes(pkg.slug) || false}
                  onChange={(e) => handleAttributeFilterChange('a_paket-icerigi', pkg.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{pkg.name}</span>
              </label>
            ))}
          </div>
        </DynamicFilter>
      );
    }

    if (availableSizes.length > 0) {
      filterSections.push(
        <DynamicFilter
          key="size"
          title="Beden"
          isVisible={filterVisibility.beden ?? true}
          onToggle={() => toggleFilterVisibility('beden')}
        >
          <div className="space-y-2">
            {availableSizes.map((size) => (
              <label key={size.id} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={filters.sizes?.includes(size.slug) || false}
                  onChange={(e) => handleFilterChange('sizes', size.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{size.name}</span>
                <span className="text-xs text-gray-500">({size.count})</span>
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
        isVisible={filterVisibility.fiyat ?? true}
        onToggle={() => toggleFilterVisibility('fiyat')}
      >
        <PriceFilter
          isVisible={filterVisibility.fiyat ?? true}
          onToggle={() => toggleFilterVisibility('fiyat')}
          priceRange={priceRange}
          filters={filters}
          onFilterChange={handlePriceChange}
          onApply={() => applyFilters()}
        />
      </DynamicFilter>
    );

    filterSections.push(
      <DynamicFilter
        key="stars"
        title="Yıldız Puanı"
        isVisible={filterVisibility.yildiz ?? true}
        onToggle={() => toggleFilterVisibility('yildiz')}
      >
        <StarFilter
          isVisible={filterVisibility.yildiz ?? true}
          onToggle={() => toggleFilterVisibility('yildiz')}
          selectedStars={filters.product_stars || []}
          onStarChange={(star, checked) => handleFilterChange('product_stars', star, checked)}
        />
      </DynamicFilter>
    );

    availableAttributes.forEach((attr) => {
      const skipAttributes = ['renk', 'cinsiyet', 'yas', 'paket-icerigi'];
      if (skipAttributes.includes(attr.slug) || attr.values.length > 50) {
        return;
      }

      filterSections.push(
        <DynamicFilter
          key={attr.id}
          title={attr.name}
          isVisible={filterVisibility[attr.slug] ?? false}
          onToggle={() => toggleFilterVisibility(attr.slug)}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {attr.values.slice(0, 20).map((value: any) => (
              <label key={value.slug} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={attributeFilters[`a_${attr.slug}`]?.includes(value.slug) || false}
                  onChange={(e) => handleAttributeFilterChange(`a_${attr.slug}`, value.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{value.name}</span>
              </label>
            ))}
            {attr.values.length > 20 && (
              <div className="text-xs text-gray-500 text-center py-2">
                +{attr.values.length - 20} daha fazla seçenek
              </div>
            )}
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
            style={{ maxHeight: scrollAreaHeight }}
          >
            {filterSections}
          </div>

          <div className="border-t border-gray-200 pt-3">
            <button 
              onClick={() => applyFilters()}
              className="w-full bg-orange-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Uygula
            </button>
          </div>
        </div>
      </div>
    );
  };


  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <main 
        data-page="brand" 
        className="brand-page-main w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-12 md:pt-0 pb-8 sm:pb-12 lg:py-0 xl:py-0"
        style={{ 
          position: 'relative', 
          overflow: 'visible',
          display: 'block',
          flex: 'none'
        }}
      >
        <div className="w-full mt-0 lg:mt-5">
          
          {/* Mobile Brand Header */}
          <BrandMobileHeader
            brandData={brandData}
            brandSlug={brandSlug}
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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 mt-2 sm:mt-3 lg:mt-4 xl:mt-6" style={{ overflow: 'visible', position: 'relative', alignItems: 'start' }}>
            {/* Filter Sidebar */}
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
                    {brandData?.name || brandSlug || 'Marka'}
                  </h1>
                  <p className="text-xs text-gray-500">
                    Ürünler gösteriliyor
                  </p>
                </div>

                <div className="mt-3">
                  {renderFilters()}
                </div>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="lg:col-span-9 xl:col-span-9 2xl:col-span-9 flex-1">
              {/* Desktop Header */}
              <div className="hidden lg:flex justify-between items-center mb-4">
                <SearchResultInfo 
                  category={brandData?.name || brandSlug || 'Marka'}
                  resultCount={sortedProducts.length}
                  totalCount={totalProducts}
                  loading={loading}
                />
                <SortingButton 
                  products={filteredProducts}
                  onSortedProducts={handleSortedProducts}
                  onSortChange={handleSortFromButton}
                />
              </div>
              
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : brandNotFoundState ? (
                <BrandNotFound brandSlug={brandSlug} />
              ) : sortedProducts.length === 0 && brandData ? (
                <NoProductsFound 
                  brandName={brandData.name} 
                  brandSlug={brandSlug} 
                />
              ) : (
                <>
                  <ProductGrid 
                    products={sortedProducts as any}
                    isAdultCategory={brandData?.is_adult || false} // Marka adult kontrolü
                    isAdultVerified={isAdultVerified} // Age verification durumu
                    showAgeVerification={showAgeVerification} // Age modal gösterimi
                    columnsPerRow={4}
                    hideAddToBasket
                    openInNewTabOnDesktop
                  />
                  
                  {/* End of Products */}
                  {!hasMorePages && sortedProducts.length > 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Tüm ürünler yüklendi ({totalProducts} ürün)
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Mobile Sort Modal - Q sayfasındaki gibi */}
      {mobileSortOpen && (
        <div className="fixed inset-0 z-[2147483000] md:hidden bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button
              onClick={() => setMobileSortOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Sıralama modalını kapat"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Sırala</h2>
            <div className="w-6" />
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-4 py-4 space-y-2">
              {sortOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    handleSortFromButton(option.value);
                    // Duplicate ID'leri kaldır ve sırala
                    const uniqueProducts = filteredProducts.filter((product, index, self) => 
                      index === self.findIndex(p => p.id === product.id)
                    );
                    const sorted = sortProducts(uniqueProducts, option.value);
                    handleSortedProducts(sorted);
                    setMobileSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-150 text-sm font-medium ${
                    currentSortType === option.value
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-200 bg-white text-gray-800 hover:border-orange-300 hover:bg-orange-50'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Filter Modal - Q sayfasındaki gibi */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[2147483000] md:hidden bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700"
              aria-label="Filtre modalını kapat"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-base font-semibold text-gray-900">Filtrele</h2>
            <button
              onClick={() => {
                applyFilters();
                setMobileFiltersOpen(false);
              }}
              className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-semibold shadow hover:bg-orange-600 transition-colors"
            >
              Uygula
            </button>
          </div>
          <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-4">
            {renderFilters()}
          </div>
        </div>
      )}
      
      {/* Age Verification Modal */}
      <AgeVerificationModal
        showAgeVerification={showAgeVerification}
        isAdultVerified={isAdultVerified}
        onVerify={handleAgeVerification}
        onCancel={handleAgeVerificationCancel}
      />
      
      <ScrollToTop />
    </>
  );
};

export default BrandPageClient;
