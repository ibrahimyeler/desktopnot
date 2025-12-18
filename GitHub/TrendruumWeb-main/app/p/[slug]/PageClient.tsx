"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ProductGrid from '@/components/flashUrunler/ProductGrid';
import { Product } from '@/types/product';
import { getAllMainCategories } from '@/data/categories';

interface PageClientProps {
  slug: string;
  initialProducts: Product[];
  initialPagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

const GENDER_MAP: Record<string, { name: string; gender?: number }> = {
  'erkek': { name: 'Erkek', gender: 1 },
  'kadin': { name: 'Kadın', gender: 2 },
  'kadın': { name: 'Kadın', gender: 2 },
  'kiz': { name: 'Kız', gender: 2 },
  'kız': { name: 'Kız', gender: 2 },
  'unisex': { name: 'Unisex', gender: 0 },
};

const PageClient: React.FC<PageClientProps> = ({ slug, initialProducts, initialPagination }) => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  
  // Debug: Initial products'ı logla
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PageClient - Initial products:', initialProducts.length);
      console.log('PageClient - Initial pagination:', initialPagination);
    }
  }, [initialProducts, initialPagination]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPagination?.current_page || 1);
  const [hasMore, setHasMore] = useState((initialPagination?.current_page || 1) < (initialPagination?.last_page || 1));
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const genderInfo = GENDER_MAP[slug.toLowerCase()] || { name: slug };
  
  // Fetch products function
  const fetchProducts = useCallback(async (page: number = 1, append: boolean = false) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    if (page === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    
    try {
      // Gender belirleme
      const gender = genderInfo.gender;
      
      // Tüm ana kategorileri al
      const mainCategories = getAllMainCategories();
      const categorySlugs = mainCategories.map(cat => cat.slug).join(',');
      
      // URL parametrelerinden filtreleri al
      const minPrice = searchParams.get('min_price') ? parseInt(searchParams.get('min_price')!, 10) : undefined;
      const maxPrice = searchParams.get('max_price') ? parseInt(searchParams.get('max_price')!, 10) : undefined;
      const sortTypes = searchParams.get('sort_types') || 'price_asc';
      
      // Attribute filtreleri (a_ ile başlayanlar)
      const attributeFilters: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        if (key.startsWith('a_') && key !== 'a_cinsiyet') {
          attributeFilters[key] = value;
        }
      });
      
      // Variant filtreleri (v_ ile başlayanlar)
      const variantFilters: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        if (key.startsWith('v_')) {
          variantFilters[key] = value;
        }
      });
      
      // Request body oluştur
      const requestBody: any = {
        categories: categorySlugs,
        page: page,
        sort_types: sortTypes,
      };
      
      // Gender parametresini a_cinsiyet olarak ekle (API'nin beklediği format)
      if (gender !== undefined) {
        if (gender === 1) {
          requestBody.a_cinsiyet = 'erkek';
        } else if (gender === 2) {
          requestBody.a_cinsiyet = 'kadin-kiz';
        }
      }
      
      if (minPrice !== undefined) {
        requestBody.min_price = minPrice;
      }
      
      if (maxPrice !== undefined) {
        requestBody.max_price = maxPrice;
      }
      
      // Attribute filtrelerini ekle
      Object.entries(attributeFilters).forEach(([key, value]) => {
        requestBody[key] = value;
      });
      
      // Variant filtrelerini ekle
      Object.entries(variantFilters).forEach(([key, value]) => {
        requestBody[key] = value;
      });
      
      // Debug: Request body'yi logla
      if (process.env.NODE_ENV === 'development') {
        console.log('API Request Body:', JSON.stringify(requestBody, null, 2));
      }
      
      const response = await fetch('https://api.trendruum.com/api/v1/categories/products/by-slugs', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      });
      
      if (abortController.signal.aborted) {
        return;
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error:', response.status, response.statusText, errorText);
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Debug: Response'u logla
      if (process.env.NODE_ENV === 'development') {
        console.log('API Response:', {
          status: data?.meta?.status,
          hasData: !!data?.data,
          hasProducts: !!data?.data?.products,
          productsType: Array.isArray(data?.data?.products) ? 'array' : typeof data?.data?.products,
          productsCount: Array.isArray(data?.data?.products) ? data.data.products.length : (data?.data?.products?.data?.length || 0),
          total: data?.data?.pagination?.total || 0
        });
      }
      
      if (data?.meta?.status === 'success' && data.data) {
        const responseData = data.data;
        
        // Products array'i parse et
        let productsArray: any[] = [];
        if (responseData.products) {
          if (Array.isArray(responseData.products)) {
            productsArray = responseData.products;
          } else if (responseData.products.data && Array.isArray(responseData.products.data)) {
            productsArray = responseData.products.data;
          }
        }
        
        // Debug: Products array'i logla
        if (process.env.NODE_ENV === 'development') {
          console.log('Parsed products array length:', productsArray.length);
          if (productsArray.length > 0) {
            console.log('First product sample:', {
              id: productsArray[0].id,
              name: productsArray[0].name,
              hasMedias: !!productsArray[0].medias,
              mediasLength: productsArray[0].medias?.length || 0
            });
          }
        }
        
        // Products'ları format et
        const formattedProducts = productsArray.map((apiProduct: any) => {
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
          
          let brandInfo = null;
          if (apiProduct.brand_v2) {
            brandInfo = {
              id: apiProduct.brand_v2.id,
              name: apiProduct.brand_v2.name,
              slug: apiProduct.brand_v2.slug,
              url: apiProduct.brand_v2.url || `/markalar/${apiProduct.brand_v2.slug}`,
              status: 'active'
            };
          } else if (apiProduct.brand) {
            brandInfo = {
              id: apiProduct.brand.id || apiProduct.brand_id,
              name: apiProduct.brand.name,
              slug: apiProduct.brand.slug,
              url: `/markalar/${apiProduct.brand.slug}`,
              status: 'active'
            };
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
            reviewCount: apiProduct.review_count || 0,
            review_count: apiProduct.review_count || 0,
            like_count: 0,
            comment_count: 0,
            view_count: 0,
            point_count: 0,
            sold_count: 0,
            point_count_total: 0,
            point_count_user_total: 0,
            share_count: 0,
            tax: 0,
            is_adult: apiProduct.is_adult === true || (apiProduct.is_adult !== undefined && String(apiProduct.is_adult).toLowerCase() === 'true') || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            images: (apiProduct.medias || apiProduct.images || []).map((img: any) => ({
              url: img.url || img,
              name: img.name || img.url || '',
              id: img.id || img.name || img.url || ''
            })),
            variants: apiProduct.variants || [],
            badges: {
              fast_shipping: apiProduct.badges?.fast_shipping || false,
              free_shipping: apiProduct.badges?.cargo_free || false,
              same_day: apiProduct.badges?.same_day || false,
              new_product: apiProduct.badges?.new_product || false,
              best_selling: apiProduct.badges?.best_selling || false
            },
            brand: brandInfo || undefined,
            seller: apiProduct.seller_v2 ? {
              id: apiProduct.seller_v2.id,
              name: apiProduct.seller_v2.name,
              slug: apiProduct.seller_v2.slug,
              phone: '',
              status: 'active',
              category_sold: '',
              company_type: 'individual',
              tax_number: '',
              reference_code: '',
              accept_term: true,
              shipping_policy: apiProduct.seller?.shipping_policy || {
                general: {
                  delivery_time: 3,
                  shipping_fee: 0,
                  free_shipping_threshold: 150,
                  carrier: 'Yurtiçi Kargo'
                },
                custom: []
              },
              addresses: []
            } : {
              id: apiProduct.seller?.id || '0',
              name: apiProduct.seller?.name || '',
              slug: apiProduct.seller?.slug || null,
              phone: '',
              status: 'active',
              category_sold: '',
              company_type: 'individual',
              tax_number: '',
              reference_code: '',
              accept_term: true,
              shipping_policy: apiProduct.seller?.shipping_policy || {
                general: {
                  delivery_time: 3,
                  shipping_fee: 0,
                  free_shipping_threshold: 150,
                  carrier: 'Yurtiçi Kargo'
                },
                custom: []
              },
              addresses: []
            }
          } as Product;
        });
        
        if (append) {
          setProducts(prev => [...prev, ...formattedProducts]);
        } else {
          setProducts(formattedProducts);
        }
        
        const pagination = responseData.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 24,
          total: 0
        };
        
        setCurrentPage(pagination.current_page);
        setHasMore(pagination.current_page < pagination.last_page);
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Ürünler yüklenirken bir hata oluştu');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [slug, genderInfo, searchParams]);
  
  // URL değiştiğinde ürünleri yeniden yükle
  useEffect(() => {
    fetchProducts(1, false);
  }, [searchParams.toString()]);
  
  // Load more products
  const loadMoreProducts = useCallback(() => {
    if (loadingMore || !hasMore || loading) return;
    fetchProducts(currentPage + 1, true);
  }, [loadingMore, hasMore, loading, currentPage, fetchProducts]);
  
  // Intersection Observer ile infinite scroll
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
        rootMargin: '200px',
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
  
  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <main 
        data-page="p-page" 
        className="p-page-main w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-16 md:pt-0 pb-8 sm:pb-12 lg:py-0 xl:py-0" 
        style={{ 
          position: 'relative', 
          overflow: 'visible',
          display: 'block',
          flex: 'none'
        }}
      >
        <div className="w-full mt-0 lg:mt-5">
          {/* Products Grid */}
          {products.length > 0 && (
            <>
              <ProductGrid
                products={products as any}
                isAdultCategory={false}
                isAdultVerified={true}
                showAgeVerification={false}
                columnsPerRow={5}
                hideAddToBasket
                openInNewTabOnDesktop
                disablePrefetch
              />
              
              {/* Load More Loading */}
              {loadingMore && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              )}
              
              {/* Intersection Observer Trigger */}
              {hasMore && !loadingMore && (
                <div ref={loadMoreTriggerRef} className="h-1 w-full" aria-hidden="true" />
              )}
            </>
          )}
        </div>
      </main>
      <ScrollToTop />
    </>
  );
};

export default PageClient;

