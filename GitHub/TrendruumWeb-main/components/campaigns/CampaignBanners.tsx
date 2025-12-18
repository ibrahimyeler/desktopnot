import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CountdownTimer from './CountdownTimer';

interface Banner {
  id: string;
  title: string;
  description?: string;
  image: string;
  link: string;
  alt: string;
  startDate?: string;
  endDate?: string;
}

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: string;
  start_date: string;
  end_date: string;
  small_banner: string;
  large_banner: string;
  is_active: boolean;
  commission_rate: number;
  category_ids: string[];
}

interface CampaignBannersProps {
  banners?: Banner[];
  campaigns?: Campaign[];
  loading?: boolean;
}

const CampaignBanners: React.FC<CampaignBannersProps> = ({ banners, campaigns, loading = false }) => {
  // Varsayılan placeholder banner'lar - site renklerine uygun
  const defaultBanners: Banner[] = [
    {
      id: '1',
      title: 'Yaz Kampanyası',
      description: 'Tüm ürünlerde %50\'ye varan indirimler',
      image: 'https://via.placeholder.com/528x180/FF8C00/FFFFFF?text=Yaz+Kampanyası',
      link: '/kampanyalar/yaz-kampanyasi/urunler',
      alt: 'Yaz Kampanyası Banner',
      startDate: '2025-06-01',
      endDate: '2025-08-31'
    },
    {
      id: '2',
      title: 'Okula Dönüş Kampanyası',
      description: 'Eğitim malzemelerinde özel indirimler',
      image: 'https://via.placeholder.com/528x180/FFD700/000000?text=Okula+Dönüş+Kampanyası',
      link: '/kampanyalar/okula-donus-kampanyasi/urunler',
      alt: 'Okula Dönüş Kampanyası Banner',
      startDate: '2025-09-01',
      endDate: '2025-10-31'
    }
  ];

  // Alt sıra banner'lar
  const bottomBanners: Banner[] = [
    {
      id: '3',
      title: 'Kış İndirimleri',
      description: 'Soğuk havalarda sıcak fırsatlar',
      image: 'https://via.placeholder.com/528x180/FF6B35/FFFFFF?text=Kış+İndirimleri',
      link: '/kampanyalar/kis-indirimleri/urunler',
      alt: 'Kış İndirimleri Banner',
      startDate: '2025-12-01',
      endDate: '2026-02-28'
    },
    {
      id: '4',
      title: 'Sevgililer Günü',
      description: 'Aşk dolu hediyelerde özel fiyatlar',
      image: 'https://via.placeholder.com/528x180/4ECDC4/FFFFFF?text=Sevgililer+Günü',
      link: '/kampanyalar/sevgililer-gunu/urunler',
      alt: 'Sevgililer Günü Banner',
      startDate: '2025-02-01',
      endDate: '2025-02-28'
    }
  ];

  // Kampanya verilerini banner formatına dönüştür
  const convertCampaignsToBanners = (campaigns: Campaign[]): Banner[] => {
    return campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.name,
      description: campaign.description,
      image: campaign.large_banner || campaign.small_banner || 'https://via.placeholder.com/528x180/FF8C00/FFFFFF?text=' + encodeURIComponent(campaign.name),
      link: `/kampanyalar/${campaign.slug}/urunler`,
      alt: `${campaign.name} Banner`,
      startDate: campaign.start_date,
      endDate: campaign.end_date
    }));
  };

  // Hangi banner'ları göstereceğimizi belirle
  const displayBanners = campaigns && campaigns.length > 0 
    ? convertCampaignsToBanners(campaigns)
    : banners || defaultBanners;

  // Tarih formatlama fonksiyonu
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Kampanya durumunu belirle
  const getCampaignStatus = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return 'active';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
      return 'not_started';
    } else if (now > end) {
      return 'ended';
    } else {
      return 'active';
    }
  };

  // Banner render fonksiyonu
  const renderBanner = (banner: Banner) => {
    const campaignStatus = getCampaignStatus(banner.startDate, banner.endDate);
    const isClickable = campaignStatus === 'active';
    
    const bannerContent = (
      <div className="group">
        <div className={`relative overflow-hidden rounded-xl shadow-lg block bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 ${
          isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-75'
        }`}>
          <div className="relative h-32 md:h-40 lg:h-48">
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 528px"
            />
            
            {/* Gradient Overlay - Site renklerine uygun */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-yellow-500/10 to-black/30" />
            
            {/* Overlay for non-clickable campaigns */}
            {!isClickable && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                <div className="text-center text-white">
                  <div className="text-lg font-bold mb-2">
                    {campaignStatus === 'not_started' ? 'Henüz Başlamadı' : 'Sona Erdi'}
                  </div>
                  {campaignStatus === 'not_started' && banner.startDate && (
                    <div className="text-sm">
                      Başlangıç: {formatDate(banner.startDate)}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
              <h3 className="text-white font-bold text-xl md:text-2xl mb-2 drop-shadow-2xl text-shadow-lg">
                {banner.title}
              </h3>
              
              {/* Geri Sayım Timer */}
              {banner.startDate && banner.endDate && (
                <div className="mt-2">
                  <CountdownTimer 
                    startDate={banner.startDate}
                    endDate={banner.endDate}
                  />
                </div>
              )}
            </div>
          
            {/* Hover Effect - Turuncu gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-600/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400 to-orange-500 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
          </div>
          
          {/* Tarih Alanı - Site renklerine uygun */}
          {(banner.startDate || banner.endDate) && (
            <div className="px-3 py-2 bg-gradient-to-r from-white to-orange-50 border-t-2 border-orange-200">
              <div className="text-center">
                <div className="text-xs text-gray-600 font-medium">
                  {banner.startDate && (
                    <span>
                      <span className="text-orange-600 font-semibold">Başlangıç:</span> {formatDate(banner.startDate)}
                    </span>
                  )}
                  {banner.startDate && banner.endDate && (
                    <span className="mx-2 text-gray-400">•</span>
                  )}
                  {banner.endDate && (
                    <span>
                      <span className="text-orange-600 font-semibold">Bitiş:</span> {formatDate(banner.endDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    return isClickable ? (
      <Link key={banner.id} href={banner.link}>
        {bannerContent}
      </Link>
    ) : (
      <div key={banner.id}>
        {bannerContent}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-32 md:h-40 lg:h-48 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {[...Array(2)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-32 md:h-40 lg:h-48 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Üst sıra banner'lar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        {displayBanners.map(renderBanner)}
      </div>
      
      {/* Alt sıra banner'lar - sadece default banner'lar için */}
      {(!campaigns || campaigns.length === 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {bottomBanners.map(renderBanner)}
        </div>
      )}
    </div>
  );
};

export default CampaignBanners;