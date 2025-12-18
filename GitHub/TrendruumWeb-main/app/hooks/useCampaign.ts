'use client';

import { useState, useEffect } from 'react';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  type: string;
  campaign_settings?: {
    buy_quantity: number;
    pay_quantity: number;
  };
}

interface UseCampaignResult {
  campaign: Campaign | null;
  loading: boolean;
  isProductInCampaign: boolean;
  getCampaignQuantity: (requestedQuantity: number) => number;
}

export const useCampaign = (productId: string, categoryId?: string): UseCampaignResult => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        
        // Önce tüm aktif kampanyaları çek
        const campaignsResponse = await fetch('https://api.trendruum.com/api/v1/campaigns?is_active=true', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          
          if (campaignsData.meta?.status === 'success' && campaignsData.data && campaignsData.data.length > 0) {
            // Her kampanya için ürünlerini kontrol et
            for (const campaign of campaignsData.data) {
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
                    // API'den gelen veri yapısını kontrol et - data direkt array
                    const productsArray = Array.isArray(productsData.data) ? productsData.data : [];
                    
                    // Bu kampanyada bu ürün var mı kontrol et
                    const productInCampaign = productsArray.find((product: any) => product.id === productId);
                    
                    if (productInCampaign) {
                      // Ürün bu kampanyada bulundu, kampanya bilgilerini set et
                      setCampaign({
                        id: campaign.id,
                        name: campaign.name,
                        slug: campaign.slug,
                        type: campaign.type,
                        campaign_settings: campaign.campaign_settings
                      });
                      return; // Kampanya bulundu, döngüden çık
                    }
                  }
                }
              } catch (_error) {
                continue; // Bu kampanyada hata varsa diğerine geç
              }
            }
          }
        }
      } catch (_error) {
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchCampaign();
    }
  }, [productId, categoryId]);

  // Kampanya kurallarına göre miktar hesaplama
  const getCampaignQuantity = (requestedQuantity: number): number => {
    // Kampanya yoksa normal miktarı döndür
    if (!campaign || campaign.type !== 'buy_x_pay_y' || !campaign.campaign_settings) {
      return requestedQuantity;
    }

    // Kampanya varsa sadece istenen miktarı ekle (kampanya fiyatlandırması sepette yapılacak)
    return requestedQuantity;
  };

  return {
    campaign,
    loading,
    isProductInCampaign: !!campaign,
    getCampaignQuantity
  };
};
