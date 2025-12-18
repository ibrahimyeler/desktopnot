import React from 'react';
import StorePageClient from './StorePageClient';

interface Seller {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  point?: number;
  follower_count?: number;
  email: string;
  tax_number: string;
  phone: string;
  status: string;
  accept_terms: boolean;
  reference_code: string;
  company_type: string;
  category_sold: string;
  timeOnPlatform?: string;
  location?: string;
  corporateInvoice?: string;
  avgShippingTime?: string;
  avgResponseTime?: string;
  rating?: number;
  totalReviews?: number;
  totalComments?: number;
  ratingDistribution?: {
    [key: number]: number;
  };
  productReviews?: {
    rating: number;
    totalReviews: number;
    totalComments: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  sellerReviews?: {
    rating: number;
    totalReviews: number;
    totalComments: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  photoReviews?: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
  sampleReviews?: Array<{
    id: string;
    username: string;
    date: string;
    rating: number;
    comment: string;
    likes: number;
  }>;
  shipping_policy: {
    general: {
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
      carrier: string;
    };
    custom: Record<string, {
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
      carrier: string;
      city: {
        name: string;
        slug: string;
        country_id: string;
        updated_at: string;
        created_at: string;
        id: string;
      };
    }>;
  };
  addresses: Array<{
    country: {
      name: string;
      code: string;
      slug: string;
      id: string;
    };
    city: {
      name: string;
      slug: string;
      id: string;
    };
    district: {
      name: string;
      slug: string;
      id: string;
    };
    neighborhood: {
      name: string;
      slug: string;
      id: string;
    };
    title: string;
    details: string;
    id: string;
  }>;
}

interface Section {
  id: string;
  slug: string;
  fields: Field[];
}

interface Field {
  slug: string;
  items: Item[];
}

interface Item {
  slug: string;
  value: string;
}

interface StoreData {
  seller: Seller | null;
  sections: Section[];
  headerSection: Section | null;
  sharedProducts: any[];
}

// Server-side data fetching function
async function getStoreData(slug: string): Promise<StoreData | null> {
  const axios = require('axios');
  
  // First try the main sections API
  try {
    const response = await axios.get(`https://api.trendruum.com/api/v1/stores/sections/${slug}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.meta?.status === 'success' && response.data.data) {
      const data = response.data.data;
      
      // Seller verisi kontrolü
      const seller = data.seller || null;

      // Sections verisi kontrolü
      let sections: Section[] = [];
      let headerSection: Section | null = null;
      let sharedProducts: any[] = [];

      if (Array.isArray(data.sections)) {
        sections = data.sections;
        headerSection = data.sections.find((section: Section) => section.slug === 'header') || null;

        // Ürünleri parse et
        const productListSection = data.sections.find((section: Section) => section.slug === 'product-list');
        
        if (productListSection) {
          const productsValue = productListSection?.fields.find((f: Field) => f.slug === 'selected-products')?.items?.[0]?.value;
          
          // Eğer value bir string ise JSON parse et, değilse boş array kullan
          sharedProducts = typeof productsValue === 'string' 
            ? JSON.parse(productsValue)
            : Array.isArray(productsValue) 
              ? productsValue 
              : [];
        }
      }

      return {
        seller,
        sections,
        headerSection,
        sharedProducts
      };
    }
  } catch (error: any) {
  }
  
  // If sections API fails, try alternative approaches
  try {
    // First try to get store info
    let sellerId = null;
    try {
      const storeInfoResponse = await axios.get(`https://api.trendruum.com/api/v1/stores/${slug}`, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (storeInfoResponse.data?.meta?.status === 'success' && storeInfoResponse.data.data) {
        sellerId = storeInfoResponse.data.data.id;
      }
    } catch (storeInfoError) {
    }
    
    // If we have sellerId, try to fetch products
    if (sellerId) {
      try {
        const productResponse = await axios.get(`https://api.trendruum.com/api/v1/products?seller_id=${sellerId}&limit=50`, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        if (productResponse.data?.meta?.status === 'success' && productResponse.data.data) {
          return {
            seller: null,
            sections: [],
            headerSection: null,
            sharedProducts: productResponse.data.data.products || []
          };
        }
      } catch (productError) {
      }
    }
  } catch (fallbackError) {
  }
  
  return null;
}

// Server component
export default async function StorePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] bg-gradient-to-br from-orange-50 to-white rounded-lg sm:rounded-2xl border border-orange-100 p-4 sm:p-8 mx-2 sm:mx-0">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h2 className="text-lg sm:text-2xl font-bold text-black mb-2 text-center">Mağaza Bulunamadı</h2>
        <p className="text-sm sm:text-base text-black/80 text-center leading-relaxed px-2">Aradığınız mağaza mevcut değil veya kaldırılmış olabilir.</p>
      </div>
    );
  }

  const storeData = await getStoreData(slug);
  
  // Only show "Mağaza Bulunamadı" if we have no data at all (no products, no store info)
  if (!storeData || (storeData.sharedProducts.length === 0 && !storeData.seller)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] bg-gradient-to-br from-orange-50 to-white rounded-lg sm:rounded-2xl border border-orange-100 p-4 sm:p-8 mx-2 sm:mx-0">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h2 className="text-lg sm:text-2xl font-bold text-black mb-2 text-center">Mağaza Bulunamadı</h2>
        <p className="text-sm sm:text-base text-black/80 text-center leading-relaxed px-2">Aradığınız mağaza mevcut değil veya kaldırılmış olabilir.</p>
      </div>
    );
  }
  
  return (
    <StorePageClient 
      slug={slug}
      initialSeller={storeData.seller}
      initialSections={storeData.sections}
      initialHeaderSection={storeData.headerSection}
      initialSharedProducts={storeData.sharedProducts}
    />
  );
}