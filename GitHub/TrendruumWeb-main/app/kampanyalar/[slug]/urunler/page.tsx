import React from 'react';
import CampaignProductsPageClient from './CampaignProductsPageClient';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  small_banner?: string;
  large_banner?: string;
  is_active: boolean;
  commission_rate: number;
  category_ids: string[];
  campaign_settings?: {
    buy_quantity?: number;
    pay_quantity?: number;
    percentage?: number;
    nth_product?: number;
    nth_discount_percentage?: number;
    discount_amount?: number;
  };
}

interface FilterValue {
  name: string;
  slug: string;
}

interface Filter {
  id: string;
  name: string;
  slug: string;
  type: string;
  usage_key: string;
  values: FilterValue[];
  imageable?: boolean;
}

interface FilterData {
  campaign: {
    id: string;
    name: string;
    slug: string;
  };
  filters: {
    attributes: Filter[];
    variants: Filter[];
    brands: Array<{
      id: string;
      name: string;
      slug: string;
      count: number;
    }>;
  };
}

interface ProductImage {
  url: string;
  name: string;
  id: string;
}

interface ShippingPolicy {
  general: {
    delivery_time: number;
    shipping_fee: number;
    free_shipping_threshold: number;
    carrier: string;
  };
  custom: any[];
}

interface Seller {
  id: string;
  name: string;
  slug: string | null;
  shipping_policy: ShippingPolicy;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  campaign_price?: number;
  discount_percentage?: number;
  campaign_type?: string;
  campaign_settings?: {
    buy_quantity?: number;
    pay_quantity?: number;
    nth_product?: number;
    nth_discount_percentage?: number;
    discount_amount?: number;
  };
  stock?: number;
  status?: string;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  images: ProductImage[];
  colors?: string[];
  variants?: Array<{
    slug: string;
    name: string;
    value_name: string;
    value_slug: string;
    imageable: boolean;
  }>;
  seller: Seller;
  brand?: {
    name: string;
    id: string;
  };
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
}

// Server-side data fetching functions
async function getCampaign(slug: string): Promise<Campaign | null> {
  try {
    const axios = require('axios');
    
    const response = await axios.get(`https://api.trendruum.com/api/v1/campaigns/${slug}`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.meta?.status === 'success' && response.data.data) {
      const campaignInfo = response.data.data;
      return {
        id: campaignInfo.id,
        name: campaignInfo.name,
        slug: campaignInfo.slug,
        description: campaignInfo.description,
        type: campaignInfo.type,
        start_date: campaignInfo.start_date,
        end_date: campaignInfo.end_date,
        small_banner: campaignInfo.small_banner,
        large_banner: campaignInfo.large_banner,
        is_active: campaignInfo.is_active,
        commission_rate: campaignInfo.commission_rate,
        category_ids: campaignInfo.category_ids || [],
        campaign_settings: campaignInfo.campaign_settings || {}
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

async function getCampaignProducts(slug: string, campaignData: Campaign | null): Promise<Product[]> {
  try {
    const axios = require('axios');
    
    const response = await axios.get(`https://api.trendruum.com/api/v1/campaigns/${slug}/products`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.meta?.status === 'success' && response.data.data) {
      const productsArray = Array.isArray(response.data.data) ? response.data.data : [];
      
      const currentCampaign = {
        type: campaignData?.type || 'percentage_discount',
        campaign_settings: campaignData?.campaign_settings || {}
      };

      return productsArray.map((product: any) => {
        // Kampanya indirim bilgilerini hesapla
        const campaignDiscount = product.campaign_discount;
        const originalPrice = campaignDiscount?.original_price || product.price;
        let campaignPrice = campaignDiscount?.final_price || product.price;
        let discountAmount = campaignDiscount?.discount_amount || 0;
        let discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

        // Eğer kampanya tipi yüzde indirimi ise ve final_price yoksa, manuel hesapla
        if (currentCampaign.type === 'percentage_discount' && currentCampaign.campaign_settings?.percentage) {
          const percentage = currentCampaign.campaign_settings.percentage;
          discountPercentage = percentage;
          discountAmount = (originalPrice * percentage) / 100;
          campaignPrice = originalPrice - discountAmount;
        }

        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: originalPrice,
          original_price: originalPrice,
          campaign_price: campaignPrice,
          discount_percentage: discountPercentage,
          campaign_type: currentCampaign.type || 'percentage_discount',
          campaign_settings: currentCampaign.campaign_settings || {},
          stock: product.stock || 0,
          status: product.status || 'active',
          rating: product.rating || 0,
          reviewCount: product.review_count || 0,
          review_count: product.review_count || 0,
          images: (product.medias || product.images || []).map((img: any) => ({
            url: img.url,
            name: img.name || img.fullpath || 'image',
            id: img.id || img.name || 'img'
          })),
          variants: product.variants || [],
          seller: {
            id: product.seller_v2?.id || product.seller?.id || '0',
            name: product.seller_v2?.name || product.seller?.name || 'Bilinmeyen Satıcı',
            slug: product.seller_v2?.slug || product.seller?.slug || null,
            shipping_policy: product.seller?.shipping_policy || {
              general: {
                delivery_time: 3,
                shipping_fee: 0,
                free_shipping_threshold: 150,
                carrier: 'Yurtiçi Kargo'
              },
              custom: []
            }
          },
          brand: product.brand_v2 ? {
            name: product.brand_v2.name,
            id: product.brand_v2.id
          } : product.brand ? {
            name: product.brand.name,
            id: product.brand.id || product.brand.slug
          } : undefined,
          badges: (() => {
            const apiBadges = product.badges || {};
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
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

async function getCampaignFilters(slug: string): Promise<FilterData | null> {
  try {
    const axios = require('axios');
    
    const response = await axios.get(`https://api.trendruum.com/api/v1/campaigns/${slug}/products/filters`, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (response.data?.meta?.status === 'success' && response.data.data) {
      return response.data.data;
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Server component
export default async function CampaignProductsPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  // Parallel data fetching
  const [campaign, products, filterData] = await Promise.all([
    getCampaign(slug),
    getCampaignProducts(slug, null), // We'll pass campaign data in client component
    getCampaignFilters(slug)
  ]);

  // If campaign not found, return error
  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="container mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-red-800 mb-2">Kampanya Bulunamadı</h3>
            <p className="text-red-700 mb-4">Aradığınız kampanya bulunamadı veya artık aktif değil.</p>
          </div>
        </div>
      </div>
    );
  }

  // Re-fetch products with campaign data for proper pricing
  const finalProducts = await getCampaignProducts(slug, campaign);
  
  return (
    <CampaignProductsPageClient 
      slug={slug}
      initialCampaign={campaign}
      initialProducts={finalProducts}
      initialFilterData={filterData}
    />
  );
}