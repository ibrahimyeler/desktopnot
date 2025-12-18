'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CountdownTimer from '@/components/campaigns/CountdownTimer';

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
    nth_product?: number;
    nth_discount_percentage?: number;
    discount_amount?: number;
  };
}

interface CampaignBannerProps {
  productId: string;
  categoryId?: string;
}

const CampaignBanner: React.FC<CampaignBannerProps> = ({ productId, categoryId }) => {
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
                        description: campaign.description,
                        type: campaign.type,
                        start_date: campaign.start_date,
                        end_date: campaign.end_date,
                        small_banner: campaign.small_banner,
                        large_banner: campaign.large_banner,
                        is_active: campaign.is_active,
                        commission_rate: campaign.commission_rate,
                        category_ids: campaign.category_ids,
                        campaign_settings: campaign.campaign_settings
                      });
                      return; // Kampanya bulundu, döngüden çık
                    }
                  }
                }
              } catch (error) {
                continue; // Bu kampanyada hata varsa diğerine geç
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

  // Başta tamamen gizli - sadece kampanya bulunduğunda göster
  if (loading || !campaign) {
    return null;
  }

  // Kampanya süresi dolmuş mu kontrol et
  const isExpired = new Date() > new Date(campaign.end_date);

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 rounded-lg shadow-lg border-2 border-orange-300 p-4 mb-4 relative overflow-hidden">
      {/* Arka plan deseni */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 -translate-y-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full -translate-y-8"></div>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Sol taraf - Kampanya bilgileri */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            {/* Kampanya ikonu */}
            <div className="w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            
            <div className="flex flex-col">
              <h3 className="text-white font-black text-xl md:text-2xl drop-shadow-2xl tracking-wide">
                {campaign.name}
              </h3>
              <p className="text-white/95 text-sm md:text-base font-semibold drop-shadow-lg tracking-wide">
                {campaign.type === 'buy_x_pay_y' && campaign.campaign_settings 
                  ? `${campaign.campaign_settings.buy_quantity} Al ${campaign.campaign_settings.pay_quantity} Öde`
                  : campaign.type === 'nth_product_discount' && campaign.campaign_settings
                    ? `${campaign.campaign_settings.nth_product}. Ürün %${campaign.campaign_settings.nth_discount_percentage} İndirim`
                    : campaign.type === 'price_discount' && campaign.campaign_settings
                      ? `${campaign.campaign_settings.discount_amount} TL İndirim`
                      : 'Özel kampanya fırsatı'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Orta - Geri sayım timer */}
        <div className="flex-shrink-0">
          {isExpired ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
              <span className="text-white font-bold text-xs">Kampanya Sona Erdi</span>
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
              <CountdownTimer 
                endDate={campaign.end_date}
                className="text-white"
              />
            </div>
          )}
        </div>

        {/* Sağ taraf - Kampanyaya git butonu */}
        <div className="flex-shrink-0">
          <Link
            href={`/kampanyalar/${campaign.slug}/urunler`}
            className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-3 py-1.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span className="text-xs">Kampanyaya Git</span>
          </Link>
        </div>
      </div>

      {/* Alt bilgi çubuğu */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm rounded-b-lg px-3 py-1">
        <div className="flex items-center justify-center gap-2 text-white/80 text-xs">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Başlangıç: {new Date(campaign.start_date).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Bitiş: {new Date(campaign.end_date).toLocaleDateString('tr-TR')}</span>
          </div>
          <div className="w-1 h-1 bg-white/60 rounded-full"></div>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{campaign.type === 'price_discount' ? `${campaign.campaign_settings?.discount_amount || 50} TL İndirim` : campaign.type === 'percentage_discount' ? 'Yüzde İndirimi' : campaign.type === 'free_shipping' ? 'Ücretsiz Kargo' : campaign.type === 'buy_x_pay_y' ? `${campaign.campaign_settings?.buy_quantity || 3} Al ${campaign.campaign_settings?.pay_quantity || 2} Öde` : campaign.type === 'nth_product_discount' ? `${campaign.campaign_settings?.nth_product || 3}. Ürün %${campaign.campaign_settings?.nth_discount_percentage || 50} İndirim` : campaign.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBanner;
