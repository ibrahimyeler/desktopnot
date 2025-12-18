import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'price_discount' | 'percentage_discount' | 'buy_x_pay_y' | 'nth_product_discount';
  start_date: string;
  end_date: string;
  small_banner?: string;
  large_banner?: string;
  is_active: boolean;
  commission_rate: number;
  category_ids: string[];
  campaign_settings?: any;
}

interface CampaignDetailProps {
  campaign: Campaign | null;
  loading?: boolean;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ campaign, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="h-64 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">Kampanya bulunamadı</div>
        <p className="text-gray-400">Aradığınız kampanya mevcut değil veya kaldırılmış olabilir.</p>
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isActive = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Kampanya sona erdi';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days} gün ${hours} saat kaldı`;
    if (hours > 0) return `${hours} saat ${minutes} dakika kaldı`;
    return `${minutes} dakika kaldı`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Kampanya Banner */}
      <div className="relative h-64 md:h-80">
        {campaign.large_banner ? (
          <Image
            src={campaign.large_banner}
            alt={campaign.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-4xl font-bold">{campaign.name.charAt(0)}</span>
          </div>
        )}
        
        {/* Kampanya Durumu Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isActive(campaign.start_date, campaign.end_date)
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {isActive(campaign.start_date, campaign.end_date) ? 'Aktif' : 'Pasif'}
          </span>
        </div>

        {/* Kampanya Tipi Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {getCampaignTypeText(campaign.type)}
          </span>
        </div>
      </div>

      {/* Kampanya İçeriği */}
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.name}</h1>
        
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          {campaign.description}
        </p>

        {/* Kampanya Bilgileri */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kampanya Detayları</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Başlangıç:</span>
                <span className="font-medium">{formatDate(campaign.start_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bitiş:</span>
                <span className="font-medium">{formatDate(campaign.end_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Komisyon:</span>
                <span className="font-medium">%{campaign.commission_rate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kategori Sayısı:</span>
                <span className="font-medium">{campaign.category_ids.length}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kampanya Durumu</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Durum:</span>
                <span className={`font-medium ${
                  isActive(campaign.start_date, campaign.end_date)
                    ? 'text-green-600'
                    : 'text-gray-600'
                }`}>
                  {isActive(campaign.start_date, campaign.end_date) ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kalan Süre:</span>
                <span className="font-medium text-blue-600">
                  {getTimeRemaining(campaign.end_date)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kampanya Ayarları */}
        {campaign.campaign_settings && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Kampanya Ayarları</h3>
            <div className="text-sm text-gray-600">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(campaign.campaign_settings, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Kampanya Ürünlerine Git Butonu */}
        <div className="flex justify-center">
          <Link
            href={`/kampanyalar/${campaign.slug}/urunler`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Kampanya Ürünlerini Görüntüle
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetail;
