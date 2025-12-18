import React from 'react';
import PageClient from './PageClient';
import { getAllMainCategories } from '@/data/categories';
import { Product } from '@/types/product';

interface ProductsData {
  products: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

// Gender mapping: slug -> gender value
const GENDER_MAP: Record<string, number> = {
  'erkek': 1,
  'kadin': 2,
  'kadın': 2,
  'kiz': 2,
  'kız': 2,
  'unisex': 0,
};

// Server-side data fetching function
async function getProductsBySlugs(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>
): Promise<ProductsData | null> {
  try {
    // Gender belirleme
    const gender = GENDER_MAP[slug.toLowerCase()] ?? undefined;
    
    // Tüm ana kategorileri al
    const mainCategories = getAllMainCategories();
    const categorySlugs = mainCategories.map(cat => cat.slug).join(',');
    
    // URL parametrelerinden filtreleri al
    const page = parseInt(searchParams.page as string || '1', 10);
    const minPrice = searchParams.min_price ? parseInt(searchParams.min_price as string, 10) : undefined;
    const maxPrice = searchParams.max_price ? parseInt(searchParams.max_price as string, 10) : undefined;
    const sortTypes = (searchParams.sort_types as string) || 'price_asc';
    
    // Attribute filtreleri (a_ ile başlayanlar)
    const attributeFilters: Record<string, string> = {};
    Object.keys(searchParams).forEach(key => {
      if (key.startsWith('a_') && key !== 'a_cinsiyet') {
        attributeFilters[key] = searchParams[key] as string;
      }
    });
    
    // Variant filtreleri (v_ ile başlayanlar)
    const variantFilters: Record<string, string> = {};
    Object.keys(searchParams).forEach(key => {
      if (key.startsWith('v_')) {
        variantFilters[key] = searchParams[key] as string;
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
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    
    // Debug: Request body'yi logla
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request Body:', JSON.stringify(requestBody, null, 2));
    }
    
    const res = await fetch('https://api.trendruum.com/api/v1/categories/products/by-slugs', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: 'no-store',
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    
    if (!res.ok) {
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', res.status, res.statusText);
      }
      return null;
    }
    
    const response = await res.json();
    
    // Debug: Response'u logla
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response?.meta?.status,
        hasData: !!response?.data,
        hasProducts: !!response?.data?.products,
        productsType: Array.isArray(response?.data?.products) ? 'array' : typeof response?.data?.products,
        productsCount: Array.isArray(response?.data?.products) ? response.data.products.length : (response?.data?.products?.data?.length || 0),
        total: response?.data?.pagination?.total || 0
      });
    }
    
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
      
      return {
        products: formattedProducts,
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
export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const slug = resolvedParams.slug || '';
  
  if (!slug) {
    return (
      <div className="min-h-[100dvh] bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sayfa Bulunamadı</h2>
              <p className="text-gray-600">Geçersiz sayfa</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const productsData = await getProductsBySlugs(slug, resolvedSearchParams || {});
  
  return (
    <PageClient 
      slug={slug}
      initialProducts={productsData?.products || []}
      initialPagination={productsData?.pagination}
    />
  );
}

