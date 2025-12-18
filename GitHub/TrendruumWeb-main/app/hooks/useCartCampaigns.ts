'use client';

import { useState, useEffect, useMemo, useRef } from 'react';

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

interface CartCampaignInfo {
  productId: string;
  campaign: Campaign;
  quantity: number;
  originalPrice: number;
  campaignPrice: number;
  savings: number;
  discountPercentage?: number;
}

export const useCartCampaigns = (basketItems: any[]): { cartCampaigns: CartCampaignInfo[], totalCampaignSavings: number } => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  
  // basketItems'ı memoize et
  const memoizedBasketItems = useMemo(() => basketItems, [JSON.stringify(basketItems)]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        
        // Tüm aktif kampanyaları çek
        const campaignsResponse = await fetch('https://api.trendruum.com/api/v1/campaigns?is_active=true', {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          
          if (campaignsData.meta?.status === 'success' && campaignsData.data && campaignsData.data.length > 0) {
            setCampaigns(campaignsData.data);
          }
        }
      } catch (_error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const [cartCampaigns, setCartCampaigns] = useState<CartCampaignInfo[]>([]);
  const campaignProductsCacheRef = useRef<Record<string, any[]>>({});
  const campaignsSlugsRef = useRef<string>('');

  useEffect(() => {
    const fetchCartCampaigns = async () => {
      if (loading || !campaigns.length || !memoizedBasketItems.length) {
        setCartCampaigns([]);
        return;
      }

      // Önce tüm kampanyaların ürünlerini bir kez çek (cache'le)
      const validCampaigns = campaigns.filter(campaign => 
        ['buy_x_pay_y', 'percentage_discount', 'nth_product_discount', 'price_discount'].includes(campaign.type) && 
        campaign.campaign_settings
      );

      // Kampanyalar değiştiyse cache'i sıfırla
      const currentCampaignsSlugs = validCampaigns.map(c => c.slug).sort().join(',');
      if (campaignsSlugsRef.current !== currentCampaignsSlugs) {
        campaignProductsCacheRef.current = {};
        campaignsSlugsRef.current = currentCampaignsSlugs;
      }

      // Cache'de olmayan kampanyaların ürünlerini çek
      const campaignsToFetch = validCampaigns.filter(campaign => !campaignProductsCacheRef.current[campaign.slug]);
      
      if (campaignsToFetch.length > 0) {
        const fetchPromises = campaignsToFetch.map(async (campaign) => {
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
                return { campaignSlug: campaign.slug, products: productsArray };
              }
            }
          } catch (error) {
            // Hataları sessizce yakala
          }
          return { campaignSlug: campaign.slug, products: [] };
        });

        const results = await Promise.all(fetchPromises);
        results.forEach(({ campaignSlug, products }) => {
          campaignProductsCacheRef.current[campaignSlug] = products;
        });
      }

      // Cache'lenmiş verilerle kampanya kontrolü yap
      const campaignInfos: CartCampaignInfo[] = [];

      // Her sepet ürünü için kampanya kontrolü yap
      for (const item of memoizedBasketItems) {
        if (!item.product_id) continue;

        // Bu ürünün kampanyasını bul
        for (const campaign of validCampaigns) {
          // Cache'den kampanya ürünlerini al
          const productsArray = campaignProductsCacheRef.current[campaign.slug] || [];
                
                // Bu ürün bu kampanyada var mı kontrol et
                const productInCampaign = productsArray.find((product: any) => product.id === item.product_id);
                
                if (productInCampaign) {
                  // Null kontrolü
                  if (!item || item.price === null || item.price === undefined || item.quantity === null || item.quantity === undefined) {
                    continue;
                  }
                  
                  const originalPrice = (item.quantity || 0) * (item.price || 0);
                  let campaignPrice = originalPrice;
                  let savings = 0;
                  let discountPercentage = 0;

            if (campaign.type === 'buy_x_pay_y' && campaign.campaign_settings) {
                    const { buy_quantity, pay_quantity } = campaign.campaign_settings;
                    
                    // Kampanya kurallarına göre fiyat hesapla
                    if (buy_quantity && pay_quantity && item.quantity >= buy_quantity) {
                      const campaignSets = Math.floor(item.quantity / buy_quantity);
                      const remainingItems = item.quantity % buy_quantity;
                      
                      const campaignItems = campaignSets * buy_quantity;
                      const normalItems = remainingItems;
                      
                      campaignPrice = (campaignSets * pay_quantity * (item.price || 0)) + (normalItems * (item.price || 0));
                      savings = originalPrice - campaignPrice;
                    }
            } else if (campaign.type === 'percentage_discount' && campaign.campaign_settings) {
                    // Yüzde indirimi kampanyası
                    const campaignDiscount = productInCampaign.campaign_discount;
                    if (campaignDiscount && campaignDiscount.final_price !== null && campaignDiscount.final_price !== undefined) {
                      campaignPrice = (campaignDiscount.final_price || 0) * (item.quantity || 0);
                      savings = (campaignDiscount.discount_amount || 0) * (item.quantity || 0);
                      discountPercentage = campaignDiscount.original_price > 0 ? 
                        Math.round(((campaignDiscount.discount_amount || 0) / campaignDiscount.original_price) * 100) : 0;
                    } else {
                      // API'den gelen indirim bilgisi yoksa kampanya ayarlarından hesapla
                      const percentage = campaign.campaign_settings.percentage || 0;
                      if (percentage > 0 && item.price) {
                        const discountPerItem = ((item.price || 0) * percentage) / 100;
                        campaignPrice = ((item.price || 0) - discountPerItem) * (item.quantity || 0);
                        savings = discountPerItem * (item.quantity || 0);
                        discountPercentage = percentage;
                      }
                    }
            } else if (campaign.type === 'nth_product_discount' && campaign.campaign_settings) {
                    // N. Ürün İndirimi kampanyası
                    const { nth_product, nth_discount_percentage } = campaign.campaign_settings;
                    
                    if (nth_product && nth_discount_percentage && item.quantity >= nth_product && nth_discount_percentage > 0 && item.price) {
                      // N. ürün ve sonrası için indirim uygula
                      const discountedItems = item.quantity - (nth_product - 1);
                      const discountPerItem = ((item.price || 0) * nth_discount_percentage) / 100;
                      
                      campaignPrice = ((nth_product - 1) * (item.price || 0)) + (discountedItems * ((item.price || 0) - discountPerItem));
                      savings = discountedItems * discountPerItem;
                      discountPercentage = nth_discount_percentage;
                    }
                  }
                  // Tutar İndirimi kampanyası
            else if (campaign.type === 'price_discount' && campaign.campaign_settings) {
                    const { discount_amount } = campaign.campaign_settings;
                    
                    if (discount_amount && discount_amount > 0 && item.price) {
                      campaignPrice = ((item.price || 0) - discount_amount) * (item.quantity || 0);
                      savings = discount_amount * (item.quantity || 0);
                      discountPercentage = Math.round((discount_amount / (item.price || 1)) * 100);
                    }
                  }

                  if (savings > 0) {
                    campaignInfos.push({
                      productId: item.product_id,
                      campaign,
                      quantity: item.quantity,
                      originalPrice,
                      campaignPrice,
                      savings,
                      discountPercentage
                    });
                  }
                  break; // Bu ürün için kampanya bulundu, diğer kampanyalara bakma
          }
        }
      }

      setCartCampaigns(campaignInfos);
    };

    fetchCartCampaigns();
  }, [campaigns, memoizedBasketItems, loading]);

  const totalCampaignSavings = useMemo(() => {
    return cartCampaigns.reduce((total, campaignInfo) => total + campaignInfo.savings, 0);
  }, [cartCampaigns]);

  return {
    cartCampaigns,
    totalCampaignSavings
  };
};
