import React from 'react';
import SearchPageClient from './SearchPageClient';
import { detectGenderFromSearchTerm } from '@/utils/searchUtils';

import { Product } from '@/types/product';

interface SearchData {
  products: Product[];
  filters: {
    brands: Array<{
      name: string;
      slug: string;
      id: string;
      count: number;
    }>;
    categories: Array<{
      name: string;
      slug: string;
      id: string;
      count: number;
    }>;
    variants: Array<{
      slug: string;
      name: string;
      values: Array<{
        name: string;
        slug: string;
        count?: number;
      }>;
    }>;
    attributes: Array<{
      slug: string;
      name: string;
      values: Array<{
        name: string;
        slug: string;
        count?: number;
      }>;
    }>;
  };
  searchInfo: {
    total_results: number;
  };
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Server-side data fetching function
async function getSearchData(query: string): Promise<SearchData | null> {
  try {
    // İstisna kelimeleri çıkar (kadın, erkek vb.) ve temizlenmiş sorguyu al
    const { cleanedQuery, detectedGender } = detectGenderFromSearchTerm(query.trim());
    const finalQuery = cleanedQuery || query.trim();
    
    // API URL'ini oluştur
    let apiUrl = `https://api.trendruum.com/api/v1/products/search?name=${encodeURIComponent(finalQuery)}&page=1&include_filters=1`;
    
    // Cinsiyet filtresi varsa ekle
    if (detectedGender !== null) {
      const genderValue = detectedGender === 1 ? 'kadin-kiz' : 'erkek';
      apiUrl += `&a_cinsiyet=${genderValue}`;
    }
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // Avoid caching SSR result; rely on SWR in client if needed
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return null;
    }

    const response = await res.json();

    if (response?.meta?.status === 'success' && response.data) {
      const data = response.data;
      
      // Products array'i parse et
      let productsArray: any[] = [];
      if (data.products) {
        if (Array.isArray(data.products)) {
          productsArray = data.products;
        } else if (data.products.data && Array.isArray(data.products.data)) {
          productsArray = data.products.data;
        }
      }

      // Products'ları format et
      const formattedProducts = productsArray.map((apiProduct: any) => {
        // Slug oluştur
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

        // Marka bilgisini al
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
            url: img.url,
            name: img.name,
            id: img.id || img.name
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

      return {
        products: formattedProducts,
        filters: {
          brands: data.filters?.brands || [],
          categories: data.filters?.categories || [],
          variants: data.filters?.variants || [],
          attributes: data.filters?.attributes || []
        },
        searchInfo: data.search_info || { total_results: 0 },
        pagination: data.pagination || {
          current_page: 1,
          last_page: 1,
          per_page: 24,
          total: 0
        }
      };
    }
    
    return null;
  } catch (_error: any) {
    return null;
  }
}

// Server component
export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const query = (resolvedSearchParams?.q || '').toString();
  
  if (!query || query.trim().length < 1) {
    return (
      <div className="min-h-[100dvh] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Arama Yapın</h2>
              <p className="text-gray-600">Arama terimi girin</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // İstisna kelimeleri çıkar ve temizlenmiş sorguyu al
  const { cleanedQuery } = detectGenderFromSearchTerm(query.trim());
  const finalQuery = cleanedQuery || query.trim();
  
  // Server-side'da da temizlenmiş query ile arama yap
  const searchData = await getSearchData(finalQuery);
  
  return (
    <SearchPageClient 
      initialQuery={finalQuery}
      initialSearchData={searchData}
    />
  );
}
