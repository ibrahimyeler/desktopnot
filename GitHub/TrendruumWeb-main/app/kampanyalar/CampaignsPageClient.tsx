'use client';

import React, { Suspense, useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CampaignBanners from '@/components/campaigns/CampaignBanners';
import CampaignList from '@/components/campaigns/CampaignList';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Campaign {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: 'price_discount' | 'percentage_discount' | 'buy_x_pay_y' | 'nth_product_discount' | string;
  start_date: string;
  end_date: string;
  small_banner: string;
  large_banner: string;
  is_active: boolean;
  commission_rate: number;
  category_ids: string[];
}

interface CampaignsPageClientProps {
  initialCampaigns: Campaign[] | null;
}

const CampaignsPageContent: React.FC<CampaignsPageClientProps> = ({ initialCampaigns }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [bannerCampaigns, setBannerCampaigns] = useState<Campaign[]>(initialCampaigns || []);
  const [loading, setLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(!initialCampaigns);
  const [hasSearched, setHasSearched] = useState(false);

  // Banner kampanyalarını yükle (eğer server-side'da yüklenmemişse)
  useEffect(() => {
    if (!initialCampaigns) {
      const fetchBannerCampaigns = async () => {
        try {
          setBannerLoading(true);
          
          // Aktif kampanyaları çek
          const response = await fetch('https://api.trendruum.com/api/v1/campaigns?is_active=true', {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.meta?.status === 'success' && data.data) {
              const apiCampaigns = data.data.map((campaign: any) => ({
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
                category_ids: campaign.category_ids
              }));
              
              setBannerCampaigns(apiCampaigns);
            }
          }
        } catch (error) {
        } finally {
          setBannerLoading(false);
        }
      };

      fetchBannerCampaigns();
    }
  }, [initialCampaigns]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Lütfen arama terimi girin');
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true);
      
      // Tüm aktif kampanyaları çek ve client-side filtreleme yap
      // (API'de search endpoint'i çalışmadığı için)
      const response = await fetch('https://api.trendruum.com/api/v1/campaigns?is_active=true', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('API isteği başarısız');
      }
      
      const data = await response.json();
      
      if (data.meta?.status === 'success' && data.data) {
        // Client-side filtreleme yap
        const filteredCampaigns = data.data.filter((campaign: any) => 
          campaign.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
        
        // API'den gelen veriyi component formatına dönüştür
        const apiCampaigns = filteredCampaigns.map((campaign: any) => ({
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
          category_ids: campaign.category_ids
        }));
        
        setCampaigns(apiCampaigns);
        
        if (apiCampaigns.length === 0) {
          toast.success('Arama tamamlandı, ancak sonuç bulunamadı');
        } else {
          toast.success(`${apiCampaigns.length} kampanya bulundu`);
        }
      } else {
        setCampaigns([]);
        toast.error('Kampanya bulunamadı');
      }
      
    } catch (error) {
      toast.error('Arama sırasında bir hata oluştu');
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCampaigns([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="container mx-auto px-6 py-8">

        {/* Arama Çubuğu - Geçici olarak yorum satırına alındı */}
        {/* <div className="mb-6">
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kampanya ara..."
                  className="w-full px-3 py-2 pl-10 pr-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-sm"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center gap-1">
                  {hasSearched && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded transition-colors duration-200 font-medium text-xs"
                    >
                      Temizle
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-3 py-1 rounded transition-colors duration-200 font-medium text-xs"
                  >
                    {loading ? 'Aranıyor...' : 'Ara'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div> */}

        {/* Arama Sonuçları veya Banner'lar */}
        {hasSearched ? (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Arama Sonuçları
              </h2>
              <span className="text-sm text-gray-500">
                "{searchQuery}" için {campaigns.length} sonuç
              </span>
            </div>
            <CampaignList campaigns={campaigns} loading={loading} />
          </div>
        ) : (
          <CampaignBanners campaigns={bannerCampaigns} loading={bannerLoading} />
        )}
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

const CampaignsPageClient: React.FC<CampaignsPageClientProps> = ({ initialCampaigns }) => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 w-full">
          <div className="container mx-auto px-6 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              
              {/* Banner Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="h-32 md:h-40 lg:h-48 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
              
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
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CampaignsPageContent initialCampaigns={initialCampaigns} />
    </Suspense>
  );
};

export default CampaignsPageClient;
