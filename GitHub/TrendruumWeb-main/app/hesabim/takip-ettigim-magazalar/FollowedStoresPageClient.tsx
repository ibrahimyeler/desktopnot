"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import { BuildingStorefrontIcon, TrashIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import AccountSidebar from '@/components/account/AccountSidebar';
import { API_V1_URL } from '@/lib/config';

interface FollowedStore {
  id: string;
  name: string;
  slug: string;
  follow_count: number;
  updated_at: string;
  created_at: string;
}

interface FollowedStoresPageClientProps {
  initialFollowedStores: FollowedStore[] | null;
}

export default function FollowedStoresPageClient({ initialFollowedStores }: FollowedStoresPageClientProps) {
  const [followedStores, setFollowedStores] = useState<FollowedStore[]>(initialFollowedStores || []);
  const [loading, setLoading] = useState(!initialFollowedStores);
  const [unfollowingId, setUnfollowingId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!initialFollowedStores) {
      fetchFollowedStores();
    }
  }, [initialFollowedStores]);

  const fetchFollowedStores = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_V1_URL}/customer/follows`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.meta?.status === 'success') {
        const stores = data.data || [];
        setFollowedStores(stores);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (storeId: string, storeName: string) => {
    if (!window.confirm(`${storeName} mağazasının takibini bırakmayı onaylıyor musunuz?`)) {
      return;
    }

    try {
      setUnfollowingId(storeId);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Giriş yapmalısınız.');
        return;
      }

      const response = await fetch(`${API_V1_URL}/customer/follows/${storeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.meta?.status === 'success') {
        // Remove the store from the list
        setFollowedStores(prev => prev.filter(store => store.id !== storeId));
        alert('Mağaza takibi başarıyla kaldırıldı');
      } else {
        alert(data.meta?.message || 'Bir hata oluştu');
      }
    } catch (error) {
      alert('Bir hata oluştu');
    } finally {
      setUnfollowingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Slug'ı düzelt - Türkçe karakterleri ve format düzelt
  const fixSlug = (slug: string): string => {
    if (!slug) return '';
    
    // Türkçe karakterleri düzelt
    const turkishCharMap: { [key: string]: string } = {
      'ı': 'i', 'İ': 'i',
      'ğ': 'g', 'Ğ': 'g', 
      'ü': 'u', 'Ü': 'u',
      'ş': 's', 'Ş': 's',
      'ö': 'o', 'Ö': 'o',
      'ç': 'c', 'Ç': 'c'
    };
    
    let fixedSlug = slug;
    
    // Türkçe karakterleri değiştir
    Object.keys(turkishCharMap).forEach(turkishChar => {
      fixedSlug = fixedSlug.replace(new RegExp(turkishChar, 'g'), turkishCharMap[turkishChar]);
    });
    
    // Sonundaki -1, -2, -3 gibi sayıları kaldır
    fixedSlug = fixedSlug.replace(/-\d+$/, '');
    
    // Eğer slug'da tire yoksa ve camelCase/PascalCase formatındaysa kebab-case'e çevir
    if (!fixedSlug.includes('-')) {
      fixedSlug = fixedSlug
        .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase -> kebab-case
        .toLowerCase();
    }
    
    return fixedSlug.toLowerCase();
  };

  return (
    <>
      <Header showBackButton={false} />
      <div className="min-h-screen bg-gray-50">
        <div className="header-padding pt-0 sm:pt-0">
          <main className="w-full max-w-[88rem] xl:max-w-[96rem] 2xl:max-w-[110rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-20 pt-20 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">

        <div className="flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-12 items-start">
          {/* Desktop Sidebar - Sticky positioned */}
          <div className="hidden lg:block flex-shrink-0">
            <AccountSidebar />
          </div>

          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
              <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-gray-200 overflow-y-auto">
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Hesabım</h2>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100 "
                    >
                      <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
                </div>
              </div>
            </div>
          )}
          
          {/* Ana İçerik - Biraz daraltılmış */}
          <div className="flex-1 w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6 -mt-2 sm:mt-0">
                {/* Desktop Header */}
                <div className="hidden sm:flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <BuildingStorefrontIcon className="w-6 h-6 text-orange-500" />
                    <h1 className="text-xl font-semibold text-gray-900">Tüm Takip Ettiğim Mağazalar</h1>
                  </div>
                </div>

                {/* Mobile Header */}
                <div className="sm:hidden flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                      aria-label="Menü"
                    >
                      <Bars3Icon className="w-6 h-6 text-gray-600" />
                    </button>
                    <BuildingStorefrontIcon className="w-5 h-5 text-orange-500" />
                    <h1 className="text-base font-semibold text-gray-900">Tüm Takip Ettiğim Mağazalar</h1>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : followedStores.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <BuildingStorefrontIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Henüz mağaza takip etmiyorsunuz</h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed px-4">Beğendiğiniz mağazaları takip ederek yeni ürünlerinden haberdar olabilirsiniz.</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600  text-sm sm:text-base"
                  >
                    Mağazaları Keşfet
                  </a>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {followedStores.map((store) => (
                    <div 
                      key={store.id} 
                      className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 "
                    >
                      {/* Desktop Layout */}
                      <div className="hidden sm:flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <BuildingStorefrontIcon className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{store.name}</h3>
                            <p className="text-sm text-gray-500">
                              {store.follow_count} takipçi • {formatDate(store.created_at)} tarihinden beri takip ediliyor
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <a 
                            href={`/magaza/${fixSlug(store.slug)}`}
                            className="px-3 py-1.5 text-sm text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50 "
                          >
                            Mağazaya Git
                          </a>
                          <button
                            onClick={() => handleUnfollow(store.id, store.name)}
                            disabled={unfollowingId === store.id}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50  disabled:opacity-50"
                          >
                            <TrashIcon className="w-4 h-4" />
                            {unfollowingId === store.id ? 'Kaldırılıyor...' : 'Takibi Bırak'}
                          </button>
                        </div>
                      </div>

                      {/* Mobile Layout */}
                      <div className="sm:hidden">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <BuildingStorefrontIcon className="w-5 h-5 text-orange-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm">{store.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              {store.follow_count} takipçi
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(store.created_at)} tarihinden beri takip ediliyor
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a 
                            href={`/magaza/${fixSlug(store.slug)}`}
                            className="flex-1 text-center px-3 py-2 text-xs text-orange-600 border border-orange-300 rounded-md hover:bg-orange-50 "
                          >
                            Mağazaya Git
                          </a>
                          <button
                            onClick={() => handleUnfollow(store.id, store.name)}
                            disabled={unfollowingId === store.id}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs text-red-600 border border-red-300 rounded-md hover:bg-red-50  disabled:opacity-50"
                          >
                            <TrashIcon className="w-3 h-3" />
                            {unfollowingId === store.id ? 'Kaldırılıyor...' : 'Takibi Bırak'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
        </div>
      </div>
      <ScrollToTop />
    </>
  );
}
