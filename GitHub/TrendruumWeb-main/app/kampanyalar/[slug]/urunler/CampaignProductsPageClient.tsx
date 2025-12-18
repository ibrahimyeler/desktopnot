'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '@/components/flashUrunler/ProductGrid';
import { 
  DynamicFilter,
  AttributeFilter,
  BrandFilter,
  ColorFilter,
  GenderFilter,
  PriceFilter,
  StarFilter
} from '@/components/filter';

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

interface CampaignProductsPageClientProps {
  slug: string;
  initialCampaign: Campaign | null;
  initialProducts: Product[];
  initialFilterData: FilterData | null;
}

const CampaignProductsPageClient: React.FC<CampaignProductsPageClientProps> = ({
  slug,
  initialCampaign,
  initialProducts,
  initialFilterData
}) => {
  const [campaign, setCampaign] = useState<Campaign | null>(initialCampaign);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filterData, setFilterData] = useState<FilterData | null>(initialFilterData);
  const [loading, setLoading] = useState(!initialCampaign);
  const [error, setError] = useState<string | null>(null);
  
  // Filtre state'leri - kategori sayfasındaki gibi
  const [filters, setFilters] = useState<FilterState>({});
  const [attributeFilters, setAttributeFilters] = useState<Record<string, string[]>>({});
  const [filterVisibility, setFilterVisibility] = useState<Record<string, boolean>>({
    marka: false,
    renk: false,
    cinsiyet: false,
    fiyat: false,
    yildiz: false
  });
  
  // Filtre seçenekleri
  const [availableBrands, setAvailableBrands] = useState<any[]>([]);
  const [availableColors, setAvailableColors] = useState<any[]>([]);
  const [availableGenders, setAvailableGenders] = useState<any[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<any[]>([]);

  // Fiyat aralığını hesapla
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 10000 };
    
    const prices = products.map(p => Number(p.price)).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

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

  // Filtreleri temizle
  const clearFilters = useCallback(() => {
    setFilters({});
    setAttributeFilters({});
  }, []);

  // Seçili değerleri hesapla
  const getSelectedValues = (filterType: string) => {
    switch (filterType) {
      case 'brands':
        return availableBrands
          .filter(brand => filters.brands?.includes(brand.slug))
          .map(brand => brand.name);
      case 'colors':
        return availableColors
          .filter(color => filters.colors?.includes(color.slug))
          .map(color => color.name);
      case 'genders':
        return availableGenders
          .filter(gender => filters.genders?.includes(gender.slug))
          .map(gender => gender.name);
      case 'stars':
        return filters.product_stars?.map(star => `${star} Yıldız`) || [];
      default:
        if (attributeFilters[filterType]) {
          return attributeFilters[filterType];
        }
        return [];
    }
  };

  const getSelectedCount = (filterType: string) => {
    switch (filterType) {
      case 'brands':
        return filters.brands?.length || 0;
      case 'colors':
        return filters.colors?.length || 0;
      case 'genders':
        return filters.genders?.length || 0;
      case 'stars':
        return filters.product_stars?.length || 0;
      default:
        return attributeFilters[filterType]?.length || 0;
    }
  };

  // Filtreleri render et - kategori sayfasındaki gibi
  const renderFilters = () => (
    <div className="bg-white rounded-lg max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Markalar */}
      {availableBrands.length > 0 && (
        <DynamicFilter
          title="Marka"
          isVisible={filterVisibility.marka ?? false}
          onToggle={() => toggleFilterVisibility('marka')}
          selectedValues={getSelectedValues('brands')}
          selectedCount={getSelectedCount('brands')}
        >
          <BrandFilter
            brands={availableBrands}
            selectedBrands={filters.brands || []}
            onBrandChange={(brand, checked) => handleFilterChange('brands', brand, checked)}
          />
        </DynamicFilter>
      )}

      {/* Renkler */}
      {availableColors.length > 0 && (
        <DynamicFilter
          title="Renk"
          isVisible={filterVisibility.renk ?? false}
          onToggle={() => toggleFilterVisibility('renk')}
          selectedValues={getSelectedValues('colors')}
          selectedCount={getSelectedCount('colors')}
        >
          <ColorFilter
            colors={availableColors}
            selectedColors={filters.colors || []}
            onColorChange={(color, checked) => handleFilterChange('colors', color, checked)}
          />
        </DynamicFilter>
      )}

      {/* Cinsiyet */}
      {availableGenders.length > 0 && (
        <DynamicFilter
          title="Cinsiyet"
          isVisible={filterVisibility.cinsiyet ?? false}
          onToggle={() => toggleFilterVisibility('cinsiyet')}
          selectedValues={getSelectedValues('genders')}
          selectedCount={getSelectedCount('genders')}
        >
          <GenderFilter
            genders={availableGenders}
            selectedGenders={filters.genders || []}
            onGenderChange={(gender, checked) => handleFilterChange('genders', gender, checked)}
          />
        </DynamicFilter>
      )}

      {/* Fiyat Filtresi */}
      <DynamicFilter
        title="Fiyat"
        isVisible={filterVisibility.fiyat ?? false}
        onToggle={() => toggleFilterVisibility('fiyat')}
      >
        <PriceFilter
          isVisible={filterVisibility.fiyat ?? false}
          onToggle={() => toggleFilterVisibility('fiyat')}
          priceRange={priceRange}
          filters={filters}
          onFilterChange={handlePriceChange}
        />
      </DynamicFilter>

      {/* Yıldız Puanı Filtresi */}
      <DynamicFilter
        title="Yıldız Puanı"
        isVisible={filterVisibility.yildiz ?? false}
        onToggle={() => toggleFilterVisibility('yildiz')}
        selectedValues={getSelectedValues('stars')}
        selectedCount={getSelectedCount('stars')}
      >
        <StarFilter
          isVisible={filterVisibility.yildiz ?? false}
          onToggle={() => toggleFilterVisibility('yildiz')}
          selectedStars={filters.product_stars || []}
          onStarChange={(star, checked) => handleFilterChange('product_stars', star, checked)}
        />
      </DynamicFilter>

      {/* Diğer Kategori Attribute'ları */}
      {categoryAttributes
        .filter(attr => 
          attr.slug !== 'web-color' && 
          attr.slug !== 'cinsiyet' && 
          attr.values && attr.values.length > 0
        )
        .map((attribute) => (
          <DynamicFilter
            key={attribute.slug}
            title={attribute.name}
            isVisible={filterVisibility[attribute.slug] ?? false}
            onToggle={() => toggleFilterVisibility(attribute.slug)}
            selectedValues={getSelectedValues(attribute.slug)}
            selectedCount={getSelectedCount(attribute.slug)}
          >
            <AttributeFilter
              attribute={attribute}
              selectedValues={attributeFilters[attribute.slug] || []}
              onValueChange={(value, checked) => 
                handleAttributeFilterChange(attribute.slug, value, checked)
              }
            />
          </DynamicFilter>
        ))}
    </div>
  );

  // Client-side data fetching (if initial data not available)
  useEffect(() => {
    if (!initialCampaign || !initialProducts || !initialFilterData) {
      const fetchCampaignAndProducts = async () => {
        try {
          setLoading(true);
          setError(null);

          // Kampanya bilgilerini çek
          const campaignResponse = await fetch(`https://api.trendruum.com/api/v1/campaigns/${slug}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (!campaignResponse.ok) {
            throw new Error('Kampanya bulunamadı');
          }

          const campaignData = await campaignResponse.json();
          
          if (campaignData.meta?.status === 'success' && campaignData.data) {
            const campaignInfo = campaignData.data;
            
            setCampaign({
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
            });
          }

          // Kampanya ürünlerini çek
          const productsResponse = await fetch(`https://api.trendruum.com/api/v1/campaigns/${slug}/products`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            
            if (productsData.meta?.status === 'success' && productsData.data) {
              const productsArray = Array.isArray(productsData.data) ? productsData.data : [];
              
              const currentCampaign = {
                type: campaignData.data?.type || 'percentage_discount',
                campaign_settings: campaignData.data?.campaign_settings || {}
              };

              const campaignProducts = productsArray.map((product: any) => {
                const campaignDiscount = product.campaign_discount;
                const originalPrice = campaignDiscount?.original_price || product.price;
                let campaignPrice = campaignDiscount?.final_price || product.price;
                let discountAmount = campaignDiscount?.discount_amount || 0;
                let discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

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
              
              setProducts(campaignProducts);
            } else {
              setProducts([]);
            }
          } else {
            setProducts([]);
          }

          // Kampanya filtrelerini çek
          const filtersResponse = await fetch(`https://api.trendruum.com/api/v1/campaigns/${slug}/products/filters`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (filtersResponse.ok) {
            const filtersData = await filtersResponse.json();
            
            if (filtersData.meta?.status === 'success' && filtersData.data) {
              setFilterData(filtersData.data);
              
              const filtersData_processed = filtersData.data;
              
              if (filtersData_processed.filters?.brands) {
                setAvailableBrands(filtersData_processed.filters.brands);
              }
              
              const colorVariant = filtersData_processed.filters?.variants?.find((v: any) => v.slug === 'renk');
              if (colorVariant?.values) {
                setAvailableColors(colorVariant.values);
              }
              
              const genderAttribute = filtersData_processed.filters?.attributes?.find((attr: any) => attr.slug === 'cinsiyet');
              if (genderAttribute?.values) {
                setAvailableGenders(genderAttribute.values);
              }
              
              if (filtersData_processed.filters?.attributes) {
                setCategoryAttributes(filtersData_processed.filters.attributes);
              }
            }
          }

        } catch (error) {
          setError(error instanceof Error ? error.message : 'Bilinmeyen hata');
        } finally {
          setLoading(false);
        }
      };

      fetchCampaignAndProducts();
    } else {
      // Process initial filter data
      if (initialFilterData) {
        const filtersData_processed = initialFilterData;
        
        if (filtersData_processed.filters?.brands) {
          setAvailableBrands(filtersData_processed.filters.brands);
        }
        
        const colorVariant = filtersData_processed.filters?.variants?.find((v: any) => v.slug === 'renk');
        if (colorVariant?.values) {
          setAvailableColors(colorVariant.values);
        }
        
        const genderAttribute = filtersData_processed.filters?.attributes?.find((attr: any) => attr.slug === 'cinsiyet');
        if (genderAttribute?.values) {
          setAvailableGenders(genderAttribute.values);
        }
        
        if (filtersData_processed.filters?.attributes) {
          setCategoryAttributes(filtersData_processed.filters.attributes);
        }
      }
    }
  }, [slug, initialCampaign, initialProducts, initialFilterData]);

  // Geri sayım sayacını başlat
  useEffect(() => {
    if (campaign && campaign.end_date) {
      const cleanup = startCountdown(campaign.end_date);
      return cleanup;
    }
  }, [campaign]);

  // Geri sayım sayacı fonksiyonu
  const startCountdown = (endDate: string) => {
    const endTime = new Date(endDate).getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = endTime - now;
      
      if (distance < 0) {
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minutesEl) minutesEl.textContent = '0';
        if (secondsEl) secondsEl.textContent = '0';
        
        return;
      }
      
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');
      
      if (daysEl) daysEl.textContent = days.toString();
      if (hoursEl) hoursEl.textContent = hours.toString();
      if (minutesEl) minutesEl.textContent = minutes.toString();
      if (secondsEl) secondsEl.textContent = seconds.toString();
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <svg className="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Hata</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 w-full">
        {/* Kampanya Large Banner - Tam genişlik */}
        {campaign && campaign.large_banner && (
          <div className="w-full">
            <div className="relative w-full h-32 md:h-40 lg:h-48 overflow-hidden">
                <Image
                  src={campaign.large_banner}
                  alt={`${campaign.name} Banner`}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-yellow-500/10 to-black/30" />

                {/* Sağ taraf - Geri sayım sayacı */}
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border border-white/20">
                    <div className="text-center">
                      <div className="text-xs text-gray-600 font-medium mb-2">Kampanya Sona Eriyor</div>
                      <div className="flex items-center space-x-2">
                        <div className="text-center">
                          <div className="bg-orange-500 text-white rounded-lg px-2 py-1 min-w-[32px]">
                            <div className="text-sm font-bold" id="days">0</div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Gün</div>
                        </div>
                        <div className="text-orange-500 font-bold flex items-center justify-center h-8">:</div>
                        <div className="text-center">
                          <div className="bg-orange-500 text-white rounded-lg px-2 py-1 min-w-[32px]">
                            <div className="text-sm font-bold" id="hours">0</div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Saat</div>
                        </div>
                        <div className="text-orange-500 font-bold flex items-center justify-center h-8">:</div>
                        <div className="text-center">
                          <div className="bg-orange-500 text-white rounded-lg px-2 py-1 min-w-[32px]">
                            <div className="text-sm font-bold" id="minutes">0</div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Dakika</div>
                        </div>
                        <div className="text-orange-500 font-bold flex items-center justify-center h-8">:</div>
                        <div className="text-center">
                          <div className="bg-orange-500 text-white rounded-lg px-2 py-1 min-w-[32px]">
                            <div className="text-sm font-bold" id="seconds">0</div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Saniye</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        <div className="container mx-auto px-6 py-8">
          {/* Ana Layout - Sol Filtre + Sağ Ürünler */}
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sol Taraf - Filtreler - Kategori sayfasındaki gibi */}
            <div className="lg:w-1/4">
              <div className="sticky top-4">
                {/* Desktop Header */}
                <div className="hidden lg:block bg-white rounded-lg p-3 mb-3">
                  <h1 className="text-base font-bold text-gray-900 mb-1">
                    {campaign?.name || 'Kampanya'} Ürünleri
                  </h1>
                  <p className="text-xs text-gray-500">
                    {products.length} Ürün Gösteriliyor
                  </p>
                </div>

                {/* Filters */}
                {renderFilters()}
              </div>
            </div>
            
            {/* Sağ Taraf - Ürünler */}
            <div className="lg:w-3/4">

            {products.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg border-2 border-orange-200 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Henüz Ürün Bulunmuyor</h3>
                <p className="text-gray-600 mb-4 text-sm">Bu kampanyada henüz onaylanmış ürün bulunmuyor. Kampanya ürünleri yakında eklenecek.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/kampanyalar" 
                    className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm"
                  >
                    Diğer Kampanyaları Gör
                  </Link>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-white border-2 border-orange-200 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm"
                  >
                    Sayfayı Yenile
                  </button>
                </div>
              </div>
            ) : (
              <ProductGrid 
                products={products}
                isAdultCategory={false}
                isAdultVerified={false}
                showAgeVerification={false}
              />
            )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CampaignProductsPageClient;
