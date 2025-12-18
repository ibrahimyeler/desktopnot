'use client';

import React, { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  type: string;
  campaign_settings?: {
    buy_quantity?: number;
    pay_quantity?: number;
    percentage?: number;
    nth_product?: number;
    nth_discount_percentage?: number;
    discount_amount?: number;
  };
}

interface CampaignPriceBadgeProps {
  productId: string;
  categoryId?: string;
  originalPrice?: number;
}

const CampaignPriceBadge: React.FC<CampaignPriceBadgeProps> = ({ productId, categoryId, originalPrice }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignProduct, setCampaignProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        
        // Önce bu ürünün kampanya bilgilerini direkt çek (eğer endpoint varsa)
        try {
          const productCampaignResponse = await fetch(`https://api.trendruum.com/api/v1/products/${productId}/campaigns`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (productCampaignResponse.ok) {
            const productCampaignData = await productCampaignResponse.json();
            
            if (productCampaignData.meta?.status === 'success' && productCampaignData.data && productCampaignData.data.length > 0) {
              // İlk aktif kampanyayı al
              const activeCampaign = productCampaignData.data.find((campaign: any) => campaign.is_active);
              
              if (activeCampaign) {
                // Kampanya indirim bilgilerini hesapla
                const campaignDiscount = activeCampaign.campaign_discount;
                const originalPrice = campaignDiscount?.original_price || activeCampaign.price;
                const campaignPrice = campaignDiscount?.final_price || activeCampaign.price;
                const discountAmount = campaignDiscount?.discount_amount || 0;
                const discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

                // Kampanya bilgilerini set et
                setCampaign({
                  id: activeCampaign.id,
                  name: activeCampaign.name,
                  slug: activeCampaign.slug,
                  type: activeCampaign.type,
                  campaign_settings: {
                    ...activeCampaign.campaign_settings,
                    percentage: discountPercentage
                  }
                });
                
                // Kampanya ürün bilgilerini set et
                setCampaignProduct({
                  ...activeCampaign,
                  campaign_price: campaignPrice,
                  discount_percentage: discountPercentage,
                  original_price: originalPrice
                });
                return; // Kampanya bulundu, işlem tamamlandı
              }
            }
          }
        } catch (error) {
        }

        // Fallback: Tüm kampanyaları çek ve kontrol et (sadece 3 kampanya ile sınırla)
        const campaignsResponse = await fetch('https://api.trendruum.com/api/v1/campaigns?is_active=true&limit=3', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          
          if (campaignsData.meta?.status === 'success' && campaignsData.data && campaignsData.data.length > 0) {
            // Sadece ilk 3 kampanyayı kontrol et
            for (const campaign of campaignsData.data.slice(0, 3)) {
              try {
                const productsResponse = await fetch(`https://api.trendruum.com/api/v1/campaigns/${campaign.slug}/products`, {
                  headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                  },
                });

                if (productsResponse.ok) {
                  const productsData = await productsResponse.json();
                  
                  if (productsData.meta?.status === 'success' && productsData.data) {
                    const productsArray = Array.isArray(productsData.data) ? productsData.data : [];
                    const productInCampaign = productsArray.find((product: any) => product.id === productId);
                    
                    if (productInCampaign) {
                      const campaignDiscount = productInCampaign.campaign_discount;
                      const originalPrice = campaignDiscount?.original_price || productInCampaign.price;
                      const campaignPrice = campaignDiscount?.final_price || productInCampaign.price;
                      const discountAmount = campaignDiscount?.discount_amount || 0;
                      const discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

                      setCampaign({
                        id: campaign.id,
                        name: campaign.name,
                        slug: campaign.slug,
                        type: campaign.type,
                        campaign_settings: {
                          ...campaign.campaign_settings,
                          percentage: discountPercentage
                        }
                      });
                      
                      setCampaignProduct({
                        ...productInCampaign,
                        campaign_price: campaignPrice,
                        discount_percentage: discountPercentage,
                        original_price: originalPrice
                      });
                      return; // Kampanya bulundu, döngüden çık
                    }
                  }
                }
              } catch (error) {
                continue;
              }
            }
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [productId, categoryId]);

  // Loading durumunda normal fiyatı göster
  if (loading && originalPrice) {
    const originalPriceFormatted = originalPrice.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return (
      <div className="text-xl md:text-2xl font-bold text-gray-900">
        {originalPriceFormatted} TL
      </div>
    );
  }

  // Kampanya yoksa normal fiyat göster
  if (!campaign && originalPrice) {
    const originalPriceFormatted = originalPrice.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    return (
      <div className="text-xl md:text-2xl font-bold text-gray-900">
        {originalPriceFormatted} TL
      </div>
    );
  }

  // Kampanya yoksa ve fiyat da yoksa hiçbir şey gösterme
  if (!campaign) {
    return null;
  }

  // Yüzde indirimli kampanya için fiyat gösterimi
  if (campaign.type === 'percentage_discount' && campaignProduct && originalPrice) {
    const originalPriceFormatted = originalPrice.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const campaignPriceFormatted = campaignProduct.campaign_price?.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) || originalPriceFormatted;
    const discountPercentage = campaign.campaign_settings?.percentage || campaignProduct.discount_percentage || 0;

    return (
      <div className="flex items-center gap-3 flex-wrap">
        {/* Orijinal fiyat - çizili */}
        <div className="text-lg md:text-xl text-gray-400 line-through">
          {originalPriceFormatted} TL
        </div>
        
        {/* Kampanya fiyatı - sağında, büyük ve yeşil */}
        <div className="text-xl md:text-2xl font-bold text-green-600">
          {campaignPriceFormatted} TL
        </div>
        
        {/* İndirim yüzdesi badge */}
        <div className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white px-2.5 py-1 rounded-lg shadow-md">
          <div className="w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-tight">
            %{discountPercentage} İndirim
          </span>
        </div>
      </div>
    );
  }

  // Buy X Pay Y kampanya için sadece badge gösterimi
  if (campaign.type === 'buy_x_pay_y') {
    const { buy_quantity, pay_quantity } = campaign.campaign_settings || { buy_quantity: 3, pay_quantity: 2 };

    return (
      <div className="flex items-center gap-3 flex-wrap">
        {/* Normal fiyat - çizili değil */}
        <div className="text-xl md:text-2xl font-bold text-gray-900">
          {originalPrice?.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} TL
        </div>
        
        {/* Buy X Pay Y badge */}
        <div className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2.5 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          {/* Kampanya ikonu - daha küçük ve minimal */}
          <div className="w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          
          {/* Kampanya metni - daha küçük ve elegant */}
          <span className="text-xs font-semibold tracking-tight">
            {buy_quantity} Al {pay_quantity} Öde
          </span>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg opacity-50"></div>
        </div>
      </div>
    );
  }

  // N. Ürün İndirimi kampanya için sadece badge gösterimi
  if (campaign.type === 'nth_product_discount') {
    const { nth_product, nth_discount_percentage } = campaign.campaign_settings || { nth_product: 3, nth_discount_percentage: 50 };

    return (
      <div className="flex items-center gap-3 flex-wrap">
        {/* Normal fiyat - çizili değil */}
        <div className="text-xl md:text-2xl font-bold text-gray-900">
          {originalPrice?.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} TL
        </div>
        
        {/* N. Ürün İndirimi badge */}
        <div className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2.5 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          {/* Kampanya ikonu - daha küçük ve minimal */}
          <div className="w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          
          {/* Kampanya metni - daha küçük ve elegant */}
          <span className="text-xs font-semibold tracking-tight">
            {nth_product}. Ürün %{nth_discount_percentage} İndirim
          </span>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg opacity-50"></div>
        </div>
      </div>
    );
  }

  // Tutar İndirimi kampanya için fiyat ve badge gösterimi
  if (campaign.type === 'price_discount') {
    const { discount_amount } = campaign.campaign_settings || { discount_amount: 50 };
    const campaignPrice = originalPrice && discount_amount ? originalPrice - discount_amount : 0;

    return (
      <div className="flex items-center gap-3 flex-wrap">
        {/* Çizili orijinal fiyat */}
        <div className="text-lg md:text-xl text-gray-500 line-through">
          {originalPrice?.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} TL
        </div>
        
        {/* Kampanya fiyatı */}
        <div className="text-xl md:text-2xl font-bold text-gray-900">
          {campaignPrice.toLocaleString('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })} TL
        </div>
        
        {/* Tutar İndirimi badge */}
        <div className="relative inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2.5 py-1 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
          {/* Kampanya ikonu */}
          <div className="w-4 h-4 bg-white/25 rounded-full flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          
          {/* Kampanya metni */}
          <span className="text-xs font-semibold tracking-tight">
            {discount_amount} TL İndirim
          </span>
          
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-lg opacity-50"></div>
        </div>
      </div>
    );
  }

  // Diğer kampanya tipleri için null döndür
  return null;
};

export default CampaignPriceBadge;
