import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'price_discount' | 'percentage_discount' | 'buy_x_pay_y' | 'nth_product_discount' | string;
  start_date: string;
  end_date: string;
  small_banner?: string;
  large_banner?: string;
  is_active: boolean;
  commission_rate: number;
  category_ids: string[];
}

interface CampaignListProps {
  campaigns: Campaign[];
  loading?: boolean;
}

const CampaignList: React.FC<CampaignListProps> = ({ campaigns, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
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
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Kampanya bulunamadı</div>
        <p className="text-gray-400">Arama kriterlerinize uygun kampanya bulunmamaktadır.</p>
      </div>
    );
  }

  const getCampaignTypeText = (type: string) => {
    switch (type) {
      case 'price_discount':
        return 'Fiyat İndirimi';
      case 'percentage_discount':
        return 'Yüzde İndirimi';
      case 'buy_x_pay_y':
        return 'Al X Öde Y';
      case 'nth_product_discount':
        return 'N. Ürün İndirimi';
      default:
        return 'Kampanya';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCampaignStatus = (startDate: string, endDate: string) => {
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

  const isActive = (startDate: string, endDate: string) => {
    return getCampaignStatus(startDate, endDate) === 'active';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => {
        const campaignStatus = getCampaignStatus(campaign.start_date, campaign.end_date);
        const isClickable = campaignStatus === 'active';
        
        const cardContent = (
          <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ${
            isClickable ? 'hover:shadow-lg cursor-pointer' : 'cursor-not-allowed opacity-75'
          }`}>
            <div className="relative h-48">
              {campaign.large_banner ? (
                <Image
                  src={campaign.large_banner}
                  alt={campaign.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{campaign.name.charAt(0)}</span>
                </div>
              )}
              
              {/* Overlay for non-clickable campaigns */}
              {!isClickable && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-lg font-bold mb-2">
                      {campaignStatus === 'not_started' ? 'Henüz Başlamadı' : 'Sona Erdi'}
                    </div>
                    {campaignStatus === 'not_started' && (
                      <div className="text-sm">
                        Başlangıç: {formatDate(campaign.start_date)}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Kampanya Durumu Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  campaignStatus === 'active'
                    ? 'bg-green-100 text-green-800'
                    : campaignStatus === 'not_started'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {campaignStatus === 'active' ? 'Aktif' : 
                   campaignStatus === 'not_started' ? 'Başlamadı' : 'Sona Erdi'}
                </span>
              </div>

              {/* Kampanya Tipi Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getCampaignTypeText(campaign.type)}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {campaign.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {campaign.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Başlangıç: {formatDate(campaign.start_date)}</span>
                <span>Bitiş: {formatDate(campaign.end_date)}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Komisyon: %{campaign.commission_rate}
                  </span>
                  <span className="text-sm text-gray-500">
                    {campaign.category_ids.length} kategori
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

        return isClickable ? (
          <Link key={campaign.id} href={`/kampanyalar/${campaign.slug}/urunler`}>
            {cardContent}
          </Link>
        ) : (
          <div key={campaign.id}>
            {cardContent}
          </div>
        );
      })}
    </div>
  );
};

export default CampaignList;
