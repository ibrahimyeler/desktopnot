"use client";

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import FavoritesTabs from '@/components/favorites/FavoritesTabs';
import CollectionsTabs from '@/components/collections/CollectionsTabs';
import NewCollectionPopup from '@/components/collections/NewCollectionPopup';
import CollectionCard from '@/app/koleksiyonlar/components/CollectionCard';
import AccountSidebar from '@/components/account/AccountSidebar';
import { Bars3Icon, XMarkIcon, ArrowLeftIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface Collection {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  products: any[];
  created_at: string;
  updated_at: string;
}

interface CollectionsPageClientProps {
  initialCollections: Collection[] | null;
}

export default function CollectionsPageClient({ initialCollections }: CollectionsPageClientProps) {
  const [activeTab, setActiveTab] = useState('collections');
  const [showNewCollectionPopup, setShowNewCollectionPopup] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collections, setCollections] = useState<Collection[]>(initialCollections || []);
  const [loading, setLoading] = useState(!initialCollections);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { isLoggedIn, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (!token) {
        const currentPath = window.location.pathname;
        router.replace(`/giris?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      try {
        await checkAuth();
        if (!isLoggedIn) {
          const currentPath = window.location.pathname;
          router.replace(`/giris?redirect=${encodeURIComponent(currentPath)}`);
        }
      } catch (error) {
        const currentPath = window.location.pathname;
        router.replace(`/giris?redirect=${encodeURIComponent(currentPath)}`);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Koleksiyonları API'den getir
  const fetchCollections = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_V1_URL}/customer/likes/collections`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data?.meta?.status === 'success') {
        setCollections(response.data.data || []);
      }
    } catch (error) {
      toast.error('Koleksiyonlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda koleksiyonları getir
  useEffect(() => {
    if (isLoggedIn && !initialCollections && !isCheckingAuth) {
      fetchCollections();
    } else if (!isLoggedIn && !isCheckingAuth) {
      setLoading(false);
    }
  }, [isLoggedIn, initialCollections, isCheckingAuth]);

  const handleEditCollection = async (id: string, newName: string, newDescription?: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/giris');
        return;
      }

      const updateData: any = { name: newName };
      if (newDescription) {
        updateData.description = newDescription;
      }

      const response = await axios.put(
        `${API_V1_URL}/customer/likes/collections/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.meta?.status === 'success') {
        await fetchCollections();
        toast.success('Koleksiyon güncellendi');
      }
    } catch (error) {
      toast.error('Koleksiyon güncellenirken bir hata oluştu');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/giris');
        return;
      }

      const response = await axios.delete(`${API_V1_URL}/customer/likes/collections/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.data?.meta?.status === 'success') {
        await fetchCollections();
        toast.success('Koleksiyon başarıyla silindi');
      } else {
        toast.error(response.data?.meta?.message || 'Koleksiyon silinirken bir hata oluştu');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/giris');
      } else if (error.response?.status === 404) {
        toast.error('Koleksiyon bulunamadı');
      } else if (error.response?.status === 403) {
        toast.error('Bu koleksiyonu silme yetkiniz yok');
      } else {
        toast.error(error.response?.data?.message || 'Koleksiyon silinirken bir hata oluştu');
      }
    }
  };

  const handleCreateCollection = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Koleksiyon oluşturmak için giriş yapmalısınız');
        router.push('/giris');
        return;
      }

      const response = await axios.post(
        `${API_V1_URL}/customer/likes/collections`,
        {
          name: collectionName,
          description: `${collectionName} koleksiyonu`
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.meta?.status === 'success') {
        // Koleksiyonları yeniden yükle
        await fetchCollections();
        setShowNewCollectionPopup(false);
        setCollectionName('');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
        router.push('/giris');
      } else {
        toast.error(error.response?.data?.message || 'Koleksiyon oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewCollectionClick = () => {
    if (!isLoggedIn) {
      toast.error('Koleksiyon oluşturmak için giriş yapmalısınız');
      router.push('/giris');
      return;
    }
    setShowNewCollectionPopup(true);
  };

  const suggestedCollections = [
    { name: 'Favorilerim', emoji: '❤️' },
    { name: 'Alışveriş Listem', emoji: '🛒' },
    { name: 'İncelemek İstediklerim', emoji: '👀' },
    { name: 'Siparişlerim', emoji: '📦' }
  ];

  if (isCheckingAuth || isLoggedIn === undefined) {
    return (
      <>
        <Header showBackButton={true} onBackClick={() => window.history.back()} />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (isLoggedIn === false) {
    return null;
  }

  if (loading) {
    return (
      <>
        <Header showBackButton={true} onBackClick={() => window.history.back()} />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-8">
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-16 md:pt-0 pb-8 sm:py-12 lg:py-16 xl:py-20">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              aria-label="Geri"
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <BookmarkIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Koleksiyonlarım</h1>
          </div>
        </div>


        <div className="lg:grid lg:grid-cols-5 lg:gap-8">
          {/* Desktop Sidebar */}
        

          {/* Mobile Sidebar Overlay - Enhanced */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300" 
                onClick={() => setSidebarOpen(false)} 
              />
              
              {/* Sidebar */}
              <div className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden">
                {/* Sidebar Header */}
                <div className="bg-white border-b border-gray-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Koleksiyonlarım</h2>
                      <p className="text-gray-600 text-sm mt-1">Menüyü keşfedin</p>
                    </div>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      <XMarkIcon className="w-6 h-6 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4">
                    <AccountSidebar onItemClick={() => setSidebarOpen(false)} />
                  </div>
                </div>
                
                {/* Sidebar Footer */}
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Trendruum hesap yönetimi</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="lg:col-span-5">
            <FavoritesTabs activeTab="collections" />
            
            <div className="mt-4 sm:mt-6">
              <CollectionsTabs
                activeTab={activeTab}
                collectionsCount={collections.length}
                followingCount={0}
                onNewCollectionClick={handleNewCollectionClick}
              />
            </div>

            {/* Collections Grid */}
            {collections.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {collections.map(collection => (
                  <CollectionCard 
                    key={collection.id} 
                    name={collection.name}
                    description={collection.description}
                    productCount={collection.products.length}
                    collectionId={collection.id}
                    onEdit={(newName, newDescription) => handleEditCollection(collection.id, newName, newDescription)}
                    onDelete={() => handleDeleteCollection(collection.id)}
                    onProductAdded={fetchCollections}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 border rounded-lg min-h-[500px] mt-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-6 bg-[#FFF8F3] rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#F27A1A]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Koleksiyonunuz Yok</h3>
                  <p className="text-sm text-gray-500">Koleksiyonları takip edebilir, sevdiklerinizle paylaşabilirsiniz!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <NewCollectionPopup
        open={showNewCollectionPopup}
        onClose={() => setShowNewCollectionPopup(false)}
        collectionName={collectionName}
        setCollectionName={setCollectionName}
        onCreate={handleCreateCollection}
        suggestedCollections={suggestedCollections}
      />
      </div>
    </>
  );
}
