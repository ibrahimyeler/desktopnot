"use client";

import { useState, useEffect } from 'react';
import { ClockIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useVisitedProducts } from '@/app/context/VisitedProductsContext';
import ProductGrid from '@/components/flashUrunler/ProductGrid';
import { API_V1_URL } from '@/lib/config';

interface PreviouslyAddedProductsProps {
  onMenuClick?: () => void;
}

const PreviouslyAddedProducts = ({ onMenuClick }: PreviouslyAddedProductsProps) => {
  const { visitedProducts } = useVisitedProducts();
  const [productsWithRealIds, setProductsWithRealIds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // ID -> slug mapping'i sakla (stok kontrolü için)
  const [productSlugMap, setProductSlugMap] = useState<Record<string, string>>({});

  // Slug'dan gerçek ürün ID'lerini çek
  useEffect(() => {
    const fetchRealProductIds = async () => {
      if (visitedProducts.length === 0) {
        setProductsWithRealIds([]);
        setLoading(false);
        return;
      }

      try {
        // Tüm ürünler için paralel olarak gerçek ID'leri çek
        const productPromises = visitedProducts.map(async (visitedProduct) => {
          try {
            const response = await fetch(`${API_V1_URL}/products/${visitedProduct.slug}`, {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });

            if (response.ok) {
              const data = await response.json();
              if (data.meta?.status === 'success' && data.data) {
                const productSlug = data.data.slug || visitedProduct.slug;
                const productId = data.data.id;
                
                // ID -> slug mapping'ini sakla
                setProductSlugMap(prev => ({ ...prev, [productId]: productSlug }));
                
                return {
                  id: productId, // Gerçek ürün ID'si
                  name: data.data.name || visitedProduct.name,
                  slug: productSlug,
                  price: data.data.price || visitedProduct.price,
                  original_price: data.data.original_price || visitedProduct.originalPrice || visitedProduct.price,
                  campaign_price: data.data.campaign_price || visitedProduct.campaignPrice,
                  discount_percentage: data.data.discount_percentage || visitedProduct.discountPercentage,
                  stock: data.data.stock ?? 10,
                  status: data.data.status || 'active',
                  rating: data.data.average_rating || data.data.rating || 0,
                  reviewCount: data.data.review_count || 0,
                  review_count: data.data.review_count || 0,
                  is_adult: data.data.is_adult || false,
                  images: (data.data.images || data.data.medias || visitedProduct.images || []).map((img: any) => ({
                    url: img.url,
                    name: img.name || '',
                    id: img.id || img.name || ''
                  })),
                  brand: data.data.brand_v2 || data.data.brand || (visitedProduct.brand ? {
                    name: visitedProduct.brand.name,
                    id: visitedProduct.brand.id
                  } : undefined),
                  seller: data.data.seller_v2 || data.data.seller || {
                    id: '0',
                    name: '',
                    slug: null,
                    shipping_policy: {
                      general: {
                        delivery_time: 3,
                        shipping_fee: 0,
                        free_shipping_threshold: 150,
                        carrier: 'Yurtiçi Kargo'
                      },
                      custom: []
                    }
                  },
                  badges: {
                    fast_shipping: data.data.badges?.fast_shipping || false,
                    free_shipping: data.data.badges?.cargo_free || false,
                    same_day: data.data.badges?.same_day || false,
                    new_product: data.data.badges?.new_product || false,
                    best_selling: data.data.badges?.best_selling || false
                  }
                };
              }
            }
          } catch (error) {
          }
          // Hata durumunda fallback olarak visitedProduct'ı kullan
          return null;
        });

        const results = await Promise.all(productPromises);
        const validProducts = results.filter((product): product is any => product !== null);
        setProductsWithRealIds(validProducts);
      } catch (error) {
        setProductsWithRealIds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRealProductIds();
  }, [visitedProducts]);

  const products = productsWithRealIds;

  if (loading) {
    return (
      <div className="flex-1">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Tüm Önceden Gezdiklerim</h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Üst Başlık */}
      <div className="mb-4 sm:mb-6 -mt-2 sm:mt-0">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ClockIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Tüm Önceden Gezdiklerim</h1>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menü"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <ClockIcon className="w-5 h-5 text-orange-500" />
            <h1 className="text-base font-semibold text-gray-900">Tüm Önceden Gezdiklerim</h1>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
            <p className="text-sm text-gray-600">
              Daha önce gezdiğiniz ürünler
            </p>
          </div>
          
          {/* Q sayfasındaki gibi ProductGrid kullan, Sepete Ekle butonunu gizle */}
          <ProductGrid 
            products={products}
            isAdultCategory={false}
            isAdultVerified={true}
            showAgeVerification={false}
            hideAddToBasket
          />
        </div>
      ) : (
        /* Boş Durum */
        <div className="bg-white rounded-lg p-6 sm:p-8 text-center">
          <div className="max-w-sm mx-auto">
            <div className="bg-gray-50 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ClockIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
              Henüz Ürün Gezmediniz
            </h3>
            <p className="text-sm text-gray-500 mb-4 sm:mb-6 leading-relaxed">
              Gezdiğiniz ürünler burada listelenecek
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-orange-600 transition-colors"
            >
              Alışverişe Başla
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviouslyAddedProducts; 