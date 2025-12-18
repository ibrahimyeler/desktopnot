"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Product } from '../types/product';

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

interface ApiProductResponse {
  id: string;
  name: string;
  price?: number;
  stock?: number;
  medias?: {
    name: string;
    fullpath: string;
    url: string;
    type: string;
    updated_at: string;
    created_at: string;
    id: {
      $oid: string;
    };
  }[];
  images?: {
    name: string;
    fullpath: string;
    url: string;
  }[];
  status?: string;
  brand?: {
    name?: string;
    slug: string;
    id?: string;
  };
  brand_v2?: {
    id: string;
    name: string;
    slug: string;
    url?: string;
  };
  slug?: string;
  colors?: string[];
  sizes?: string[];
  gender?: string;
  rating?: number;
  average_rating?: number;
  review_count?: number;
  soldCount?: string;
  badges?: {
    fast_shipping?: boolean;
    cargo_free?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
  specialTag?: string;
  discount_rate?: number;
  parent_id?: string;
  original_price?: number;
  campaign_price?: number;
  discount_percentage?: number;
  campaign_type?: string;
  campaign_settings?: {
    buy_quantity?: number;
    pay_quantity?: number;
  };
  main_product_id?: string;
  product_group_id?: string;
  variant_group_id?: string;
  seller?: {
    id: string;
    name: string;
    slug: string;
    shipping_policy?: {
      general: {
        delivery_time: number;
        shipping_fee: number;
        free_shipping_threshold: number;
        carrier: string;
      };
      custom: any[];
    };
  };
  seller_v2?: {
    id: string;
    name: string;
    slug: string;
    url?: string;
  };
  variants?: Array<{
    slug: string;
    name: string;
    value_name: string;
    value_slug: string;
    imageable: boolean;
  }>;
  attributes?: Array<{
    slug: string;
    name: string;
    value_name: string;
    value_slug: string;
  }>;
}

export const useCategoryProducts = (
  category: string, 
  initialProducts?: any,
  filters: FilterState = {},
  attributeFilters: Record<string, string[]> = {},
  categoryAttributes: any[] = [],
  searchQuery?: string
) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(!initialProducts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentSortType, setCurrentSortType] = useState<string>('recommended');
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  
  // CRITICAL FIX: initialProducts'ın sadece ilk mount'ta kullanılması için ref
  // Böylece sonradan fetch edilen ürünler override edilmeyecek
  const hasInitializedRef = useRef(false);
  const hasFetchedProductsRef = useRef(false);

  // Initialize sort type from filters
  useEffect(() => {
    if (filters.sort_types && filters.sort_types !== currentSortType) {
      setCurrentSortType(filters.sort_types);
    }
  }, [filters.sort_types, currentSortType]);

  // Initialize with server-side data if available
  // ÖNEMLİ: Bu useEffect sadece ilk mount'ta çalışmalı ve sonradan fetch edilen ürünleri override etmemeli
  useEffect(() => {
    // Eğer daha önce client-side fetch yapıldıysa, initialProducts'ı görmezden gel
    if (hasFetchedProductsRef.current) {
      return;
    }
    
    // İlk kez mi initialProducts kullanılıyor kontrol et
    if (hasInitializedRef.current) {
      return;
    }
    
    if (initialProducts && initialProducts.data && Array.isArray(initialProducts.data)) {
      hasInitializedRef.current = true;
      const formattedProducts = initialProducts.data.map((apiProduct: ApiProductResponse) => {
        let productSlug = apiProduct.slug;
        if (!productSlug) {
          productSlug = apiProduct.name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .trim();
        }
        
        return {
          id: apiProduct.id,
          name: apiProduct.name,
          slug: productSlug,
          price: apiProduct.price || 0,
          original_price: apiProduct.original_price || apiProduct.price || 0,
          campaign_price: apiProduct.campaign_price,
          discount_percentage: apiProduct.discount_percentage,
          campaign_type: apiProduct.campaign_type,
          campaign_settings: apiProduct.campaign_settings,
          stock: apiProduct.stock || 10,
          status: apiProduct.status || 'active',
          rating: apiProduct.rating || 0,
          reviewCount: apiProduct.review_count || 0,
          review_count: apiProduct.review_count || 0,
          images: (apiProduct.medias || apiProduct.images || []).map((img: any) => ({
            url: img.url,
            name: img.name,
            id: img.id || img.name
          })),
          variants: apiProduct.variants || [],
          brand: (() => {
            return apiProduct.brand_v2 ? {
              ty_id: apiProduct.brand_v2.id,
              name: apiProduct.brand_v2.name,
              slug: apiProduct.brand_v2.slug,
              url: apiProduct.brand_v2.url || `/markalar/${apiProduct.brand_v2.slug}`,
              status: 'active',
              id: apiProduct.brand_v2.id
            } : apiProduct.brand;
          })(),
          seller: apiProduct.seller_v2 ? {
            id: apiProduct.seller_v2.id,
            name: apiProduct.seller_v2.name,
            slug: apiProduct.seller_v2.slug,
            shipping_policy: apiProduct.seller?.shipping_policy || {
              general: {
                delivery_time: 3,
                shipping_fee: 0,
                free_shipping_threshold: 150,
                carrier: 'Yurtiçi Kargo'
              },
              custom: []
            }
          } : {
            id: apiProduct.seller?.id || '0',
            name: apiProduct.seller?.name || '',
            slug: apiProduct.seller?.slug || null,
            shipping_policy: apiProduct.seller?.shipping_policy || {
              general: {
                delivery_time: 3,
                shipping_fee: 0,
                free_shipping_threshold: 150,
                carrier: 'Yurtiçi Kargo'
              },
              custom: []
            }
          },
          badges: (() => {
            const apiBadges = apiProduct.badges || {};
            
            return {
              fast_shipping: apiBadges.fast_shipping || false,
              free_shipping: apiBadges.cargo_free || false,
              same_day: apiBadges.same_day || false,
              new_product: apiBadges.new_product || false,
              best_selling: apiBadges.best_selling || false
            };
          })()
        };
      });

      setAllProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
      setSortedProducts(formattedProducts);
      
      const paginationInfo = initialProducts.pagination || {};
      setTotalProducts(paginationInfo.total || formattedProducts.length);
      
      // sortedProducts set edildikten sonra loading'i false yap
      setLoading(false);
    } else if (initialProducts && (!initialProducts.data || !Array.isArray(initialProducts.data) || initialProducts.data.length === 0)) {
      // Initial products yoksa veya boşsa, loading'i false yap
      hasInitializedRef.current = true; // Boş da olsa initialized sayılır
      setLoading(false);
    }
  }, [initialProducts]);

  // API query parametrelerini oluştur
  const buildApiQueryParams = useCallback((filters: FilterState, attributeFilters: Record<string, string[]>, page: number = 1, sortType?: string, categoryAttributes: any[] = [], searchName?: string) => {
    const params = new URLSearchParams();
    params.set('page', page.toString());
    
    // Arama query parametresi (name)
    if (searchName && searchName.trim()) {
      params.set('name', searchName.trim());
    }
    
    // Sıralama parametreleri - Backend'in beklediği format
    if (sortType && sortType !== 'recommended') {
      // Backend sort_types parametresini bekliyor
      params.set('sort_types', sortType);
    }


    // Ana filtreler
    Object.entries(filters).forEach(([key, value]) => {
      if (value && Array.isArray(value) && value.length > 0) {
        if (key === 'selectedSubcategories') {
          const selectedSubs = value as string[];
          if (selectedSubs.length > 0) {
            const limitedSubs = selectedSubs.slice(0, 20);
            params.set('categories', limitedSubs.map(sub => encodeURIComponent(sub)).join(','));
          }
        } else if (key === 'colors') {
          const encodedColors = value.map(color => encodeURIComponent(color)).join(',');
          params.set('v_renk', encodedColors);
        } else if (key === 'genders') {
          const encodedGenders = value.map(gender => encodeURIComponent(gender)).join(',');
          params.set('a_cinsiyet', encodedGenders);
        } else if (key === 'product_stars') {
          const encodedStars = value.map(star => encodeURIComponent(star)).join(',');
          params.set('a_product_stars', encodedStars);
        } else if (key !== 'sort_fields' && key !== 'prices' && key !== 'categories') {
          const encodedValues = value.map(val => encodeURIComponent(val)).join(',');
          params.set(`a_${key}`, encodedValues);
        }
      } else if (value && typeof value === 'string') {
        if (key === 'sort_fields') {
          params.set('sort', value);
        } else {
          params.set(key, encodeURIComponent(value));
        }
      } else if (value && typeof value === 'object' && key === 'prices') {
        const priceValue = value as { min?: number; max?: number };
        if (typeof priceValue.min === 'number') {
          params.set('min_price', priceValue.min.toString());
        }
        if (typeof priceValue.max === 'number') {
          params.set('max_price', priceValue.max.toString());
        }
      }
    });

    // Attribute filtreleri
    Object.entries(attributeFilters).forEach(([attributeSlug, selectedValues]) => {
      if (selectedValues.length > 0) {
        const encodedValues = selectedValues.map(val => encodeURIComponent(val)).join(',');
        
        const attribute = categoryAttributes.find(attr => attr.slug === attributeSlug);
        if (attribute?.usage_key) {
          params.set(attribute.usage_key, encodedValues);
        } else {
          params.set(`a_${attributeSlug}`, encodedValues);
        }
      }
    });

    return params.toString();
  }, []);

  // Client-side sıralama fonksiyonu
  const sortProductsClientSide = useCallback((products: Product[], sortType: string) => {
    if (!products || products.length === 0) return products;
    
    const sortedProducts = [...products];
    
    switch (sortType) {
      case 'price_asc':
        return sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price_desc':
        return sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name_asc':
        return sortedProducts.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      case 'name_desc':
        return sortedProducts.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      case 'newest':
        return sortedProducts.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      default:
        return sortedProducts;
    }
  }, []);

  // Ürünleri getir
  const fetchSubcategoryProducts = useCallback(async (
    categorySlug: string, 
    page: number = 1, 
    append: boolean = false, 
    sortType?: string,
    filters: FilterState = {},
    attributeFilters: Record<string, string[]> = {},
    categoryAttributes: any[] = [],
    searchName?: string
  ) => {
    // Cancel previous request if it exists
    if (abortController) {
      abortController.abort();
    }
    
    // Create new abort controller
    const newAbortController = new AbortController();
    setAbortController(newAbortController);
    
    if (page === 1) {
      setLoading(true);
      setCurrentPage(1);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      let actualPage = page;
      
      const activeSortType = sortType || currentSortType;
      const queryParams = buildApiQueryParams(filters, attributeFilters, actualPage, activeSortType, categoryAttributes, searchName);

      // Backend'de sıralama yapıldığı için her zaman 24 ürün çek (pagination)
      const limit = 24;
      const directApiUrl = `https://api.trendruum.com/api/v1/categories/${categorySlug}/products?limit=${limit}&page=${actualPage}${queryParams ? `&${queryParams}` : ''}`;
      
      
      // Client-side fetch için timeout ekle (10 saniye - yavaş API yanıtları için)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('İstek zaman aşımına uğradı')), 10000);
      });
      
      const fetchPromise = fetch(directApiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: newAbortController.signal,
      });
      
      // Timeout veya fetch'ten hangisi önce tamamlanırsa onu kullan
      const productsResponse = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      if (!productsResponse.ok) {
        throw new Error('Ürünler yüklenirken hata oluştu');
      }
      
      const productsData = await productsResponse.json();
        
      if (productsData.data && Array.isArray(productsData.data)) {
        const filteredProducts = productsData.data.filter((apiProduct: ApiProductResponse) => {
          // Temel filtreleme
          if (!apiProduct.name || !apiProduct.id) {
            return false;
          }
          
          // Cinsiyet filtresi - client-side filtreleme
          if (filters.genders && filters.genders.length > 0) {
            const productGender = apiProduct.attributes?.find((attr: any) => attr.slug === 'cinsiyet')?.value_slug;
            if (productGender && !filters.genders.includes(productGender)) {
              return false;
            }
          }
          
          return true;
        });
          
        const formattedProducts = filteredProducts.map((apiProduct: ApiProductResponse) => {
          let productSlug = apiProduct.slug;
          if (!productSlug) {
            productSlug = apiProduct.name
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '')
              .trim();
          }
          
          return {
            id: apiProduct.id,
            name: apiProduct.name,
            slug: productSlug,
            price: apiProduct.price || 0,
            original_price: apiProduct.original_price || apiProduct.price || 0,
            campaign_price: apiProduct.campaign_price,
            discount_percentage: apiProduct.discount_percentage,
            campaign_type: apiProduct.campaign_type,
            campaign_settings: apiProduct.campaign_settings,
            stock: apiProduct.stock || 10,
            status: apiProduct.status || 'active',
            rating: apiProduct.average_rating || apiProduct.rating || 0,
            average_rating: apiProduct.average_rating || apiProduct.rating || 0,
            reviewCount: apiProduct.review_count || 0,
            review_count: apiProduct.review_count || 0,
            images: (apiProduct.images || apiProduct.medias || []).map((img: any) => ({
              url: img.url,
              name: img.name,
              id: img.id || img.name
            })),
            variants: apiProduct.variants || [],
            brand: (() => {
              return apiProduct.brand_v2 ? {
                ty_id: apiProduct.brand_v2.id,
                name: apiProduct.brand_v2.name,
                slug: apiProduct.brand_v2.slug,
                url: apiProduct.brand_v2.url || `/markalar/${apiProduct.brand_v2.slug}`,
                status: 'active',
                id: apiProduct.brand_v2.id
              } : apiProduct.brand;
            })(),
            seller: apiProduct.seller_v2 ? {
              id: apiProduct.seller_v2.id,
              name: apiProduct.seller_v2.name,
              slug: apiProduct.seller_v2.slug,
              shipping_policy: apiProduct.seller?.shipping_policy || {
                general: {
                  delivery_time: 3,
                  shipping_fee: 0,
                  free_shipping_threshold: 150,
                  carrier: 'Yurtiçi Kargo'
                },
                custom: []
              }
            } : {
              id: apiProduct.seller?.id || '0',
              name: apiProduct.seller?.name || '',
              slug: apiProduct.seller?.slug || null,
              shipping_policy: apiProduct.seller?.shipping_policy || {
                general: {
                  delivery_time: 3,
                  shipping_fee: 0,
                  free_shipping_threshold: 150,
                  carrier: 'Yurtiçi Kargo'
                },
                custom: []
              }
            },
            badges: (() => {
              const apiBadges = apiProduct.badges || {};
              
              return {
                fast_shipping: apiBadges.fast_shipping || false,
                free_shipping: apiBadges.cargo_free || false,
                same_day: apiBadges.same_day || false,
                new_product: apiBadges.new_product || false,
                best_selling: apiBadges.best_selling || false
              };
            })()
          };
        });

        const mergeProducts = (existingProducts: Product[]) => {
          const existingIds = new Set(existingProducts.map((p: Product) => p.id));
          const newProducts = formattedProducts.filter((p: Product) => !existingIds.has(p.id));
          return [...existingProducts, ...newProducts];
        };

        let nextFilteredProducts: Product[] = formattedProducts;

        if (append && page > 1) {
          setAllProducts(prev => {
            return mergeProducts(prev);
          });
          setFilteredProducts(prev => {
            const merged = mergeProducts(prev);
            nextFilteredProducts = merged;
            return merged;
          });
        } else {
          setAllProducts(formattedProducts);
          setFilteredProducts(formattedProducts);
          nextFilteredProducts = formattedProducts;
          
          // CRITICAL FIX: Client-side fetch yapıldı (page === 1), artık initialProducts'ı kullanma
          // Böylece sonradan initialProducts prop'u değişse bile eski ürünleri override etmez
          hasFetchedProductsRef.current = true;
        }

        // API'den gelen veriler zaten sıralanmış olduğu için client-side sıralama yapmıyoruz
        // Sadece 'recommended' için client-side sıralama yapılabilir
        const shouldSortClientSide = activeSortType === 'recommended';
        const sortedResult = shouldSortClientSide 
          ? sortProductsClientSide(nextFilteredProducts, activeSortType)
          : nextFilteredProducts;
        setSortedProducts(sortedResult);

        setCurrentPage(page);
        
        const paginationInfo = productsData.pagination || {};
        const total = paginationInfo.total || 0;
        const perPage = paginationInfo.per_page || limit;
        const currentPageNum = paginationInfo.current_page || page;
        const lastPage = paginationInfo.last_page || Math.ceil(total / perPage);
        
        setTotalProducts(total);
        
        if (currentPageNum >= lastPage || formattedProducts.length < perPage) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        // API yanıtı başarılı ama data yok veya boş array
        if (page === 1) {
          setAllProducts([]);
          setFilteredProducts([]);
          setSortedProducts([]);
          setTotalProducts(0);
          setHasMore(false);
        }
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      // Timeout veya network hatası durumunda graceful fallback
      let errorMessage = 'Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.';
      
      if (error instanceof Error) {
        if (error.message.includes('zaman aşımı') || error.message.includes('timeout')) {
          errorMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        } else if (error.message.includes('aborted')) {
          // Abort edilmiş istekler için hata gösterme
          return;
        }
      }
      
      if (page === 1) {
        setAllProducts([]);
        setFilteredProducts([]);
        setSortedProducts([]);
      }
      
      // Error state'i set et ve loading'i false yap
      setError(errorMessage);
      setLoading(false);
      setLoadingMore(false);
    } finally {
      // Her durumda loading'i false yap
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildApiQueryParams, currentSortType, sortProductsClientSide]);

  // Cleanup effect to abort pending requests
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, []);

  // Infinite scroll
  const loadMoreProducts = useCallback(() => {
    if (!loadingMore && hasMore && !loading && category) {
      fetchSubcategoryProducts(category, currentPage + 1, true, currentSortType, filters, attributeFilters, categoryAttributes, searchQuery);
    }
  }, [category, currentPage, hasMore, loadingMore, loading, currentSortType, fetchSubcategoryProducts, filters, attributeFilters, categoryAttributes, searchQuery]);

  // Sıralama işlemleri
  const handleSortChange = useCallback((sortType: string) => {
    setCurrentSortType(sortType);
    
    // Sıralama için API'den tüm ürünleri çek
    if (category) {
      fetchSubcategoryProducts(category, 1, false, sortType, filters, attributeFilters, categoryAttributes, searchQuery);
    }
  }, [category, filters, attributeFilters, categoryAttributes, fetchSubcategoryProducts, searchQuery]);

  // Client-side sıralama (fallback)
  const handleSortedProducts = useCallback((newSortedProducts: Product[]) => {
    setSortedProducts(newSortedProducts);
  }, []);

  useEffect(() => {
    setSortedProducts(filteredProducts);
  }, [filteredProducts]);

  // Fiyat aralığını hesapla
  const priceRange = useMemo(() => {
    if (allProducts.length === 0) return { min: 0, max: 10000 };
    
    const prices = allProducts.map(p => Number(p.price)).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [allProducts]);

  return {
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
  };
};
