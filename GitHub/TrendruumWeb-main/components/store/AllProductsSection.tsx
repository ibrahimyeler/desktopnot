"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types/product';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useBasket } from '@/app/context/BasketContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import SortingButton from '../flashUrunler/SortingButton';
import SearchResultInfo from '../flashUrunler/SearchResultInfo';
import ProductGrid from '../flashUrunler/ProductGrid';
import StoreMobileHeader from './StoreMobileHeader';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  DynamicFilter
} from '../filter';
import { FilterResponse, FilterState, FilterData } from '@/types/filters';
// import AgeVerificationModal from '../category/AgeVerificationModal'; // Q sayfasındaki gibi modal kaldırıldı

interface AllProductsSectionProps {
  sellerId: string;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  selectedCategorySlug?: string | null;
  sellerName?: string;
}

// FilterState artık types/filters.ts'den import ediliyor

const VISIBLE_FILTER_COUNT = 8;
const FILTER_SECTION_ESTIMATED_HEIGHT = 62;

const AllProductsSection = ({ sellerId, onSearch, searchQuery: externalSearchQuery, selectedCategorySlug, sellerName }: AllProductsSectionProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [currentSortType, setCurrentSortType] = useState('recommended');
  
  // Filtre state'leri
  const [filters, setFilters] = useState<FilterState>({});
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({
    kategori: false,
    marka: false
  });
  
  // Filtre seçenekleri
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [availableCategories, setAvailableCategories] = useState<any[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [searchedBrands, setSearchedBrands] = useState<any[]>([]);
  const [isSearchingBrands, setIsSearchingBrands] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery || '');
  
  // Dinamik filtre verileri
  const [filterData, setFilterData] = useState<FilterData | null>(null);
  const [filtersLoading, setFiltersLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToBasket, addToGuestBasket } = useBasket();
  const router = useRouter();
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [brandsMap, setBrandsMap] = useState<Record<string, any>>({});
  
  // Q sayfasındaki gibi modal kaldırıldı - sadece filigran gösteriliyor

  // Mağaza bilgilerini getir
  const fetchSellerInfo = useCallback(async () => {
    try {
      const response = await fetch(`${API_V1_URL}/sellers/${sellerId}/info`);
      const data = await response.json();
      
      if (data.meta?.status === 'success' && data.data) {
        setSellerInfo(data.data);
      }
    } catch (_error) {
    }
  }, [sellerId]);

  // Marka bilgilerini getir
  const fetchBrandsMap = useCallback(async () => {
    try {
      const response = await fetch(`${API_V1_URL}/brands`);
      const data = await response.json();
      
      if (data.meta?.status === 'success' && data.data && data.data.length > 0) {
        const brandsMap: Record<string, any> = {};
        data.data.forEach((brand: any) => {
          brandsMap[brand.id] = {
            id: brand.id,
            name: brand.name,
            slug: brand.slug
          };
        });
        setBrandsMap(brandsMap);
      }
    } catch (_error) {
    }
  }, []);

  // Dinamik filtreleri getir
  const fetchFilters = useCallback(async () => {
    setFiltersLoading(true);
    try {
      const response = await fetch(`${API_V1_URL}/products/filters?seller_id=${sellerId}`);
      const data: FilterResponse = await response.json();
      
      if (data.meta.status === 'success' && data.data) {
        setFilterData(data.data.filters);
        
        // Toplam ürün sayısını güncelle
        setTotalProducts(data.data.total_products);
      } else {
        setFilterData(null);
      }
    } catch (_error) {
      setFilterData(null);
    } finally {
      setFiltersLoading(false);
    }
  }, [sellerId]);

  // Markaları ve kategorileri API'den getir
  const fetchBrands = useCallback(async () => {
    setBrandsLoading(true);
    try {
      const response = await fetch(`${API_V1_URL}/seller-filter-options/${sellerId}`);
      const data = await response.json();
      
      if (data.meta?.status === 'success' && data.data) {
        // Markaları işle
        if (data.data.brands && Array.isArray(data.data.brands)) {
          const brands = data.data.brands.map((brand: any) => ({
            name: brand.name,
            slug: brand.slug,
            id: brand.id,
            count: 0 // API'den gelen markalar zaten bu mağazada var
          }));
          setAvailableBrands(brands);
        } else {
          setAvailableBrands([]);
        }

        // Kategorileri işle
        if (data.data.categories && Array.isArray(data.data.categories)) {
          const categories = data.data.categories.map((category: any) => ({
            name: category.name,
            slug: category.slug,
            id: category.id,
            count: 0 // API'den gelen kategoriler zaten bu mağazada var
          }));
          setAvailableCategories(categories);
        } else {
          setAvailableCategories([]);
        }
      } else {
        setAvailableBrands([]);
        setAvailableCategories([]);
      }
    } catch (_error) {
      setAvailableBrands([]);
      setAvailableCategories([]);
    } finally {
      setBrandsLoading(false);
    }
  }, [sellerId]);

  // Marka arama fonksiyonu - API'den gelen markalar içinde arama yap
  const searchBrands = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchedBrands([]);
      setIsSearchingBrands(false);
      return;
    }

    setIsSearchingBrands(true);
    
    // API'den gelen markalar içinde arama yap
    const filteredBrands = availableBrands.filter(brand => 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setSearchedBrands(filteredBrands);
    setIsSearchingBrands(false);
  }, [availableBrands]);

  // URL'yi filtrelerle güncelle
  const updateURLWithFilters = useCallback((newFilters: FilterState) => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // Mevcut filtre parametrelerini temizle
    const keysToRemove: string[] = [];
    urlParams.forEach((value, key) => {
      if (key.startsWith('a_') || key.startsWith('v_') || 
          key === 'categories' || key === 'category' || key === 'category_slug' || key === 'brands') {
        keysToRemove.push(key);
      }
    });
    keysToRemove.forEach(key => urlParams.delete(key));
    
    // Ana filtreleri ekle (kategori ve marka)
    if (newFilters.categories && newFilters.categories.length > 0) {
      urlParams.set('category_slug', newFilters.categories.join(','));
    }
    
    if (newFilters.brands && newFilters.brands.length > 0) {
      urlParams.set('brands', newFilters.brands.join(','));
    }
    
    // Attribute filtreleri ekle
    if (newFilters.attributes) {
      Object.entries(newFilters.attributes).forEach(([key, values]) => {
        if (values && values.length > 0) {
          urlParams.set(`a_${key}`, values.join(','));
        }
      });
    }
    
    // Variant filtreleri ekle
    if (newFilters.variants) {
      Object.entries(newFilters.variants).forEach(([key, values]) => {
        if (values && values.length > 0) {
          urlParams.set(`v_${key}`, values.join(','));
        }
      });
    }
    
    // URL'yi güncelle (sayfa yenilenmesini önlemek için replaceState kullan)
    const newURL = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, '', newURL);
  }, []);

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

  // Dinamik filtre değişiklik handler'ı (attributes ve variants için)
  const handleDynamicFilterChange = useCallback((filterKey: string, valueSlug: string, checked: boolean, filterType: 'attributes' | 'variants') => {
    setFilters(prev => {
      const currentFilters = prev[filterType] || {};
      const currentValues = currentFilters[filterKey] || [];
      const newValues = checked 
        ? [...currentValues, valueSlug]
        : currentValues.filter(v => v !== valueSlug);
      
      return {
        ...prev,
        [filterType]: {
          ...currentFilters,
          [filterKey]: newValues
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

  // Seçili değerleri hesapla
  const getSelectedValues = (filterType: string) => {
    switch (filterType) {
      case 'categories':
        return availableCategories
          .filter(category => filters.categories?.includes(category.slug))
          .map(category => category.name);
      case 'brands':
        return availableBrands
          .filter(brand => filters.brands?.includes(brand.slug))
          .map(brand => brand.name);
      default:
        // Attribute ve variant filtreleri için
        if (filterType.startsWith('attr-')) {
          const attributeSlug = filterType.replace('attr-', '');
          return filterData?.attributes
            ?.find(attr => attr.slug === attributeSlug)
            ?.values
            ?.filter(value => filters.attributes?.[attributeSlug]?.includes(value.slug))
            ?.map(value => value.name) || [];
        } else if (filterType.startsWith('variant-')) {
          const variantSlug = filterType.replace('variant-', '');
          return filterData?.variants
            ?.find(variant => variant.slug === variantSlug)
            ?.values
            ?.filter(value => filters.variants?.[variantSlug]?.includes(value.slug))
            ?.map(value => value.name) || [];
        }
        return [];
    }
  };

  const getSelectedCount = (filterType: string) => {
    switch (filterType) {
      case 'categories':
        return filters.categories?.length || 0;
      case 'brands':
        return filters.brands?.length || 0;
      default:
        // Attribute ve variant filtreleri için
        if (filterType.startsWith('attr-')) {
          const attributeSlug = filterType.replace('attr-', '');
          return filters.attributes?.[attributeSlug]?.length || 0;
        } else if (filterType.startsWith('variant-')) {
          const variantSlug = filterType.replace('variant-', '');
          return filters.variants?.[variantSlug]?.length || 0;
        }
        return 0;
    }
  };


  // API query parametrelerini oluştur - useCallback kullanmadan
  const buildApiQueryParams = (filters: FilterState, currentSearchQuery: string, currentFilterData?: FilterData | null) => {
    const params = new URLSearchParams();

    // Arama sorgusu
    if (currentSearchQuery.trim()) {
      params.append('name', currentSearchQuery.trim());
    }

    // Ana filtreler (kategori ve marka)
    Object.entries(filters).forEach(([key, value]) => {
      if (value && Array.isArray(value) && value.length > 0) {
        if (key === 'categories') {
          // Sadece slug kullan - daha okunabilir ve standart
          params.append('category_slug', value.join(','));
        } else if (key === 'brands') {
          params.append('brands', value.join(','));
        }
      }
    });

    // Dinamik attributes filtreleri
    if (filters.attributes && currentFilterData?.attributes) {
      Object.entries(filters.attributes).forEach(([attributeKey, values]) => {
        if (values && values.length > 0) {
          // Attribute kullanım anahtarını bul
          const attribute = currentFilterData.attributes.find(attr => attr.slug === attributeKey);
          if (attribute) {
            params.append(attribute.usage_key, values.join(','));
            // URL için a_ prefix'i ile ekle
            params.append(`a_${attributeKey}`, values.join(','));
          }
        }
      });
    }

    // Dinamik variants filtreleri
    if (filters.variants && currentFilterData?.variants) {
      Object.entries(filters.variants).forEach(([variantKey, values]) => {
        if (values && values.length > 0) {
          // Variant kullanım anahtarını bul
          const variant = currentFilterData.variants.find(variant => variant.slug === variantKey);
          if (variant) {
            params.append(variant.usage_key, values.join(','));
            // URL için v_ prefix'i ile ekle
            params.append(`v_${variantKey}`, values.join(','));
          }
        }
      });
    }

    return params.toString();
  };

  // Ürünleri getir
  const fetchProducts = useCallback(async (page: number = 1, append: boolean = false) => {
    if (page === 1) {
      setLoading(true);
      setCurrentPage(1);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      // Query parametrelerini oluştur
      const queryParams = buildApiQueryParams(filters, searchQuery, filterData);
      
      const apiUrl = `${API_V1_URL}/products?seller_id=${sellerId}&page=${page}&limit=24${queryParams ? `&${queryParams}` : ''}`;
      
      
      const response = await fetch(apiUrl);
      const data = await response.json();
      
  

      if (data.meta.status === 'success' && data.data) {
        

        
        // Ürünleri data.data.products.data'tan al (API yapısı: products.data içinde array var)
        const productsArray = data.data.products?.data || data.data.products || data.data || [];

        
        // Fiyatı 0 TL olan ürünleri filtrele
        const filteredProducts = productsArray.filter((product: any) => product.price > 0);
        
        // Ürünleri formatla - Mağaza sayfası için özel mantık
        const formattedProducts = filteredProducts.map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          price: product.price || 0,
          discounted_price: product.discounted_price,
          stock: product.stock || 0,
          status: product.status || 'active',
          rating: product.average_rating ?? product.rating ?? 0,
          average_rating: product.average_rating ?? product.rating ?? 0,
          reviewCount: product.review_count || 0,
          review_count: product.review_count || 0,
          images: (product.medias || product.images || []).map((img: any) => ({
            url: img.url,
            name: img.name,
            id: img.id || img.name
          })),
          // Mağaza sayfası için marka bilgileri - brand_v2 kullanarak
          brand: (() => {
            // Önce product.brand_v2 objesi var mı kontrol et (API'den gelen yeni format)
            if (product.brand_v2 && product.brand_v2.name) {
              return {
                id: product.brand_v2.id || product.brand_id,
                name: product.brand_v2.name,
                slug: product.brand_v2.slug || '',
                url: product.brand_v2.url || '',
                status: product.brand_v2.status || 'active'
              };
            }
            // Sonra product.brand objesi var mı kontrol et (eski format)
            else if (product.brand && product.brand.name) {
              return {
                id: product.brand.id || product.brand_id,
                name: product.brand.name,
                slug: product.brand.slug || '',
                url: product.brand.url || '',
                status: product.brand.status || 'active'
              };
            }
            // Sonra brand_id ile brandsMap'ten arama yap
            else if (product.brand_id && brandsMap[product.brand_id]) {
              return {
                id: product.brand_id,
                name: brandsMap[product.brand_id].name,
                slug: brandsMap[product.brand_id].slug,
                url: '',
                status: 'active'
              };
            } 
            // Hiçbir marka bilgisi yoksa
            else {
              return { name: 'Bilinmeyen Marka' };
            }
          })(),
          // Mağaza sayfası için satıcı bilgileri - seller_id kullanarak
          seller: product.seller_id ? {
            id: product.seller_id,
            name: 'Satıcı', // Geçici olarak "Satıcı" koyuyoruz, gerçek satıcı adını almak için ayrı API çağrısı gerekir
            slug: '',
            url: '',
            shipping_policy: {
              general: {
                delivery_time: 3,
                shipping_fee: 0,
                free_shipping_threshold: 0,
                carrier: 'Yurtiçi Kargo'
              },
              //
              custom: {}
            }
          } : null,
          // Badges mapping - Test için free_shipping ekliyoruz
          badges: {
            ...product.badges,
            // Test için free_shipping badge'ini ekliyoruz
            free_shipping: product.badges?.fast_shipping || false
          },
          // Adult ürün kontrolü
          is_adult: product.is_adult || false
        }));

      
        if (append && page > 1) {
          setProducts(prev => {
            const existingIds = new Set(prev.map((p: Product) => p.id));
            const newProducts = formattedProducts.filter((p: Product) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
          setFilteredProducts(prev => {
            const existingIds = new Set(prev.map((p: Product) => p.id));
            const newProducts = formattedProducts.filter((p: Product) => !existingIds.has(p.id));
            return [...prev, ...newProducts];
          });
        } else {
          setProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
        }

        setCurrentPage(page);
        
        // Pagination bilgilerini kontrol et - API'den gelen yapıya göre
        const pagination = data.data.products || data.data.pagination || data.pagination || {};
        const total = pagination.total || data.data.total || data.total || 0;
        const perPage = pagination.per_page || data.data.per_page || data.per_page || 24;
        const currentPageNum = pagination.current_page || data.data.current_page || data.current_page || page;
        const lastPage = pagination.last_page || data.data.last_page || data.last_page || 1;
        
  
        
        setTotalProducts(total);
        
        // Daha fazla sayfa var mı kontrol et
        if (currentPageNum >= lastPage || formattedProducts.length < perPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setError('Ürünler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      if (page === 1) {
        setProducts([]);
        setFilteredProducts([]);
      }
      setError('Ürünler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [sellerId, filters, filterData, searchQuery]); // buildApiQueryParams'ı kaldır

  // Infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore && !loading) {
      fetchProducts(currentPage + 1, true);
    }
  }, [currentPage, hasMore, loadingMore, loading, fetchProducts]);

  // Scroll event listener - Optimized
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | undefined;
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          
          const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
          
          if (scrollPercentage > 0.7 && hasMore && !loadingMore && !loading) {
            loadMoreProducts();
          }
          
          isScrolling = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [loadMoreProducts, hasMore, loadingMore, loading]);

  // URL parametrelerinden filtreleri yükle
  const loadFiltersFromURL = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters: FilterState = {};
    const newFilterVisibility: Record<string, boolean> = {
      kategori: false,
      marka: false
    };

    // Ana filtreleri yükle (kategori, marka)
    const categories = urlParams.get('categories') || urlParams.get('category') || urlParams.get('category_slug');
    const brands = urlParams.get('brands');
    
    if (categories) {
      newFilters.categories = categories.split(',');
      newFilterVisibility.kategori = true; // Kategori filtresini görünür yap
    }
    
    if (brands) {
      newFilters.brands = brands.split(',');
      newFilterVisibility.marka = true; // Marka filtresini görünür yap
    }

    // Attributes filtrelerini URL'den yükle (a_ prefix'i ile)
    urlParams.forEach((value, key) => {
      if (key.startsWith('a_')) {
        const attributeKey = key.substring(2); // a_ prefix'ini kaldır
        const values = value.split(',');
        
        if (!newFilters.attributes) {
          newFilters.attributes = {};
        }
        newFilters.attributes[attributeKey] = values;
        newFilterVisibility[attributeKey] = true; // Attribute filtresini görünür yap
      }
    });

    // Variants filtrelerini URL'den yükle (v_ prefix'i ile)
    urlParams.forEach((value, key) => {
      if (key.startsWith('v_')) {
        const variantKey = key.substring(2); // v_ prefix'ini kaldır
        const values = value.split(',');
        
        if (!newFilters.variants) {
          newFilters.variants = {};
        }
        newFilters.variants[variantKey] = values;
        newFilterVisibility[variantKey] = true; // Variant filtresini görünür yap
      }
    });

    // Eğer URL'den filtre varsa state'leri güncelle
    if (Object.keys(newFilters).length > 0) {
      setFilters(newFilters);
      setFilterVisibility(newFilterVisibility);
    }
  }, []); // filterVisibility dependency'sini kaldır

  // İlk yükleme - sadece sellerId değiştiğinde
  useEffect(() => {
    if (sellerId) {
      loadFiltersFromURL(); // URL'den filtreleri yükle
      fetchBrands();
      fetchSellerInfo();
      fetchBrandsMap();
      fetchFilters();
      // İlk yüklemede ürünleri getir (filtreler yüklendikten sonra)
      setTimeout(() => {
        fetchProducts();
      }, 100);
    }
  }, [sellerId, loadFiltersFromURL]); // loadFiltersFromURL'i dependency'ye ekle

  // URL değişikliklerini dinle (geri/ileri butonları için)
  useEffect(() => {
    const handlePopState = () => {
      loadFiltersFromURL();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [loadFiltersFromURL]);

  // External search query değiştiğinde internal state'i güncelle
  useEffect(() => {
    setSearchQuery(externalSearchQuery || '');
  }, [externalSearchQuery]);

  // Seçili kategori değiştiğinde filtreyi güncelle
  useEffect(() => {
    if (selectedCategorySlug) {
      setFilters(prev => ({
        ...prev,
        categories: [selectedCategorySlug]
      }));
      // Kategori filtresini görünür yap
      setFilterVisibility(prev => ({
        ...prev,
        kategori: true
      }));
    }
  }, [selectedCategorySlug]);

  // Scroll pozisyonunu restore et (ürün detayından geri dönüldüğünde)
  useEffect(() => {
    if (typeof window === 'undefined' || sortedProducts.length === 0) return;

    const savedProductId = sessionStorage.getItem('storeProductId');
    const savedScrollPosition = sessionStorage.getItem('storeScrollPosition');
    const savedProductSlug = sessionStorage.getItem('storeProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('storeProductBaseSlug');
    
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
        sessionStorage.removeItem('storeProductId');
        sessionStorage.removeItem('storeScrollPosition');
        sessionStorage.removeItem('storeProductSlug');
        sessionStorage.removeItem('storeProductBaseSlug');
      }, 300); // Render tamamlanması için kısa bir gecikme

      return () => clearTimeout(timer);
    }
  }, [sortedProducts]);

  // URL değiştiğinde filtreleri yeniden yükle (programmatik navigasyon için)
  // Bu useEffect'i kaldırıyoruz çünkü window?.location?.search dependency'si sorunlu
  // Bunun yerine popstate event listener'ı kullanıyoruz

  // Filtreleri uygula fonksiyonu - Q sayfasındaki gibi
  const applyFilters = useCallback(() => {
    // URL'yi güncelle
    if (sellerId) {
      updateURLWithFilters(filters);
    }
    // API'ye istek at
    fetchProducts(1, false);
  }, [filters, sellerId, updateURLWithFilters, fetchProducts]);

  // Sıralama işlemleri
  const handleSortedProducts = useCallback((newSortedProducts: Product[]) => {
    setSortedProducts(newSortedProducts);
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
    const hasCategories = filters.categories && filters.categories.length > 0;
    const hasBrands = filters.brands && filters.brands.length > 0;
    const hasAttributes = filters.attributes && Object.values(filters.attributes).some(values => values.length > 0);
    const hasVariants = filters.variants && Object.values(filters.variants).some(values => values.length > 0);
    
    return hasCategories || hasBrands || hasAttributes || hasVariants;
  }, [filters]);

  // Sorting değiştiğinde
  const handleSortChange = useCallback((sortType: string) => {
    setCurrentSortType(sortType);
    // SortingButton component'i zaten handleSortedProducts'ı çağırıyor
  }, []);

  // Sıralama fonksiyonu (SortingButton'dan alındı)
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
    const sorted = sortProducts(filteredProducts, currentSortType);
    setSortedProducts(sorted);
  }, [filteredProducts, currentSortType, sortProducts]);

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
  }, [sellerId]); // sellerId değiştiğinde tekrar çalıştır

  // Filtre bileşenlerini render et
  const renderFilters = (showApplyButton: boolean = true) => {
    const filterSections: React.ReactNode[] = [];

    if (availableCategories.length > 0) {
      filterSections.push(
        <DynamicFilter
          key="category"
          title="Kategori"
          isVisible={filterVisibility.kategori ?? true}
          onToggle={() => toggleFilterVisibility('kategori')}
          selectedValues={getSelectedValues('categories')}
          selectedCount={getSelectedCount('categories')}
        >
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableCategories.map((category, index) => (
              <label key={`category-${category.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
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

    filterSections.push(
      <DynamicFilter
        key="brand"
        title="Marka"
        isVisible={filterVisibility.marka ?? true}
        onToggle={() => toggleFilterVisibility('marka')}
        selectedValues={getSelectedValues('brands')}
        selectedCount={getSelectedCount('brands')}
      >
        {brandsLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600 text-sm">Markalar yükleniyor...</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Marka ara..."
                value={brandSearchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setBrandSearchQuery(value);
                  searchBrands(value);
                }}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
              {isSearchingBrands && (
                <div className="absolute right-3 top-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brandSearchQuery.trim() ? (
                isSearchingBrands ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                    <span className="ml-2 text-gray-600 text-xs">Aranıyor...</span>
                  </div>
                ) : searchedBrands.length > 0 ? (
                  searchedBrands.map((brand, index) => (
                    <label key={`searched-brand-${brand.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.brands?.includes(brand.slug) || false}
                        onChange={(e) => handleFilterChange('brands', brand.slug, e.target.checked)}
                        className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                      />
                      <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="p-2 text-center text-gray-500 text-xs">
                    "{brandSearchQuery}" için marka bulunamadı.
                  </div>
                )
              ) : (
                availableBrands.length > 0 ? (
                  availableBrands.map((brand, index) => (
                    <label key={`brand-${brand.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                      <input
                        type="checkbox"
                        checked={filters.brands?.includes(brand.slug) || false}
                        onChange={(e) => handleFilterChange('brands', brand.slug, e.target.checked)}
                        className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                      />
                      <span className="text-sm text-gray-700 flex-1">{brand.name}</span>
                    </label>
                  ))
                ) : (
                  <div className="p-2 text-center text-gray-500 text-xs">
                    Bu mağazada marka bulunamadı.
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </DynamicFilter>
    );

    if (filterData?.attributes && filterData.attributes.length > 0) {
      filterData.attributes.forEach((attribute) => {
        filterSections.push(
          <DynamicFilter
            key={`attr-${attribute.slug}`}
            title={attribute.name}
            isVisible={filterVisibility[`attr-${attribute.slug}`] ?? false}
            onToggle={() => toggleFilterVisibility(`attr-${attribute.slug}`)}
            selectedValues={getSelectedValues(`attr-${attribute.slug}`)}
            selectedCount={getSelectedCount(`attr-${attribute.slug}`)}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {attribute.values.map((value, index) => (
                <label key={`attr-value-${attribute.slug}-${value.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.attributes?.[attribute.slug]?.includes(value.slug) || false}
                    onChange={(e) => handleDynamicFilterChange(attribute.slug, value.slug, e.target.checked, 'attributes')}
                    className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{value.name}</span>
                </label>
              ))}
            </div>
          </DynamicFilter>
        );
      });
    }

    if (filterData?.variants && filterData.variants.length > 0) {
      filterData.variants.forEach((variant) => {
        filterSections.push(
          <DynamicFilter
            key={`variant-${variant.slug}`}
            title={variant.name}
            isVisible={filterVisibility[`variant-${variant.slug}`] ?? false}
            onToggle={() => toggleFilterVisibility(`variant-${variant.slug}`)}
            selectedValues={getSelectedValues(`variant-${variant.slug}`)}
            selectedCount={getSelectedCount(`variant-${variant.slug}`)}
          >
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {variant.values.map((value, index) => (
                <label key={`variant-value-${variant.slug}-${value.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                  <input
                    type="checkbox"
                    checked={filters.variants?.[variant.slug]?.includes(value.slug) || false}
                    onChange={(e) => handleDynamicFilterChange(variant.slug, value.slug, e.target.checked, 'variants')}
                    className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                  />
                  <span className="text-sm text-gray-700 flex-1">{value.name}</span>
                </label>
              ))}
            </div>
          </DynamicFilter>
        );
      });
    }

    if (filtersLoading) {
      filterSections.push(
        <div key="filters-loading" className="flex justify-center items-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          <span className="ml-3 text-gray-600 text-sm">Filtreler yükleniyor...</span>
        </div>
      );
    }

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

          {showApplyButton && (
            <div className="border-t border-gray-200 pt-3">
              <button 
                onClick={applyFilters}
                className="w-full bg-orange-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Uygula
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  // Favori işlemleri
  const handleFavoriteToggle = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      toast.error('Favori eklemek için giriş yapmalısınız');
      return;
    }

    setLoadingFavorites(prev => new Set(prev).add(productId));
    
    try {
      if (isInFavorites(productId)) {
        await removeFavorite(productId);
        toast.success('Favorilerden kaldırıldı');
      } else {
        await addToFavorites(productId);
        toast.success('Favorilere eklendi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoadingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Sepete ekleme işlemleri
  const handleAddToBasket = async (productId: string, e: React.MouseEvent, isOutOfStock: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isOutOfStock) {
      toast.error('Bu ürün stokta yok');
      return;
    }

    setLoadingBasket(prev => new Set(prev).add(productId));
    
    try {
      if (isLoggedIn) {
        await addToBasket(productId, 1);
        toast.success('Sepete eklendi');
      } else {
        await addToGuestBasket(productId, 1);
        toast.success('Sepete eklendi');
      }
    } catch (error) {
      // Hata mesajı BasketContext'te yönetiliyor, burada ekstra mesaj göstermeye gerek yok
      // Stok kontrolü ve diğer hata mesajları zaten BasketContext'te gösteriliyor
    } finally {
      setLoadingBasket(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Yıldız render fonksiyonu
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <StarIcon key={i} className="w-3 h-3 text-yellow-400 fill-current" />
        );
      } else {
        stars.push(
          <StarIcon key={i} className="w-3 h-3 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        {error}
      </div>
    );
  }

  return (
    <div className="store-products-section w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 space-y-0 lg:space-y-6">
      {/* Mobile Header */}
      <StoreMobileHeader
        storeName={sellerInfo?.name || ''}
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
        hasActiveFilters={hasActiveFilters() || false}
      />

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
                    handleSortChange(option.value);
                    // SortingButton'ı tetikle
                    const sortedProducts = sortProducts(filteredProducts, option.value);
                    handleSortedProducts(sortedProducts);
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
            {renderFilters(false)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8 2xl:gap-12" style={{ overflow: 'visible', position: 'relative', alignItems: 'start' }}>
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
              {/* Desktop Header - Başlık kaldırıldı */}
              <div className="hidden lg:block bg-white rounded-lg p-3 mb-3 flex-shrink-0">
                <p className="text-xs text-gray-500">
                  {loading ? 'Yükleniyor...' : 'Ürünler gösteriliyor'}
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
          <div className="hidden lg:flex justify-between items-center mb-0 lg:mb-4">
            <SearchResultInfo 
              category={sellerName || sellerInfo?.name || ""}
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
          
          
                     {sortedProducts.length === 0 ? (
             <div className="flex justify-center items-center h-64 text-gray-500">
               Bu mağazada ürün bulunamadı
             </div>
           ) : (
             <>
              <ProductGrid 
                products={sortedProducts as any}
                isAdultCategory={false}
                isAdultVerified={true}
                showAgeVerification={false}
                columnsPerRow={4}
               hideAddToBasket
               openInNewTabOnDesktop
              />
               
               {/* Infinite Scroll Loading States */}
               {loadingMore && (
                 <div className="flex justify-center items-center py-8">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                 </div>
               )}
             </>
           )}
        </div>
      </div>
      
      {/* Age Verification Modal - Q sayfasındaki gibi kaldırıldı, sadece filigran gösteriliyor */}
    </div>
  );
};

export default AllProductsSection;
