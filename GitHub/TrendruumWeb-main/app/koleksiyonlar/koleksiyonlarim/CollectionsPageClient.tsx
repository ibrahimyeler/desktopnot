"use client";

import { useState, useEffect } from "react";
import { BookmarkIcon, HeartIcon, PlusIcon, XMarkIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import CollectionCard from '../components/CollectionCard';
import NewCollectionPopup from '@/components/collections/NewCollectionPopup';
import CollectionsTabs from '@/components/collections/CollectionsTabs';
import EmptyCollections from '@/components/collections/EmptyCollections';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_V1_URL } from '@/lib/config';

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
  const [activeTab, setActiveTab] = useState<'collections' | 'following'>('collections');
  const [showNewCollectionPopup, setShowNewCollectionPopup] = useState(false);
  const [showNoFavoritesPopup, setShowNoFavoritesPopup] = useState(false);
  const [collectionName, setCollectionName] = useState('');
  const [collections, setCollections] = useState<Collection[]>(initialCollections || []);
  const [loading, setLoading] = useState(!initialCollections);
  const router = useRouter();
  const { favorites } = useFavorites();
  const { isLoggedIn } = useAuth();

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

  // Component mount olduğunda koleksiyonları getir (eğer initial data yoksa)
  useEffect(() => {
    if (isLoggedIn && !initialCollections) {
      fetchCollections();
    } else if (!isLoggedIn) {
      setLoading(false);
    }
  }, [isLoggedIn, initialCollections]);

  // Sayfa focus olduğunda koleksiyonları yenile
  useEffect(() => {
    const handleFocus = () => {
      if (isLoggedIn) {
        fetchCollections();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isLoggedIn]);

  // Loading tamamlandığında koleksiyonlar boşsa yeniden dene
  useEffect(() => {
    if (!loading && collections.length === 0 && isLoggedIn) {
      setTimeout(() => {
        fetchCollections();
      }, 1000);
    }
  }, [loading, collections.length, isLoggedIn]);

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
        await fetchCollections();
        toast.success('Koleksiyon başarıyla oluşturuldu');
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
    { name: 'Bahar Koleksiyonum', emoji: '🌞' },
    { name: 'Güzel Evim', emoji: '🏠' },
    { name: 'Makyaj', emoji: '💋' },
    { name: 'Elektronik', emoji: '🍰' },
    { name: 'Aksesuar', emoji: '💍' },
    { name: 'Yemek Malzemeleri', emoji: '🌭' },
  ];

  if (loading) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20">
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F27A1A]"></div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="flex-1">
          {/* Tab Navigation */}
          <div className="border-b mb-8">
            <div className="flex justify-between items-center">
              <div className="flex gap-8">
                <button 
                  onClick={() => router.push('/hesabim/favoriler')}
                  className="pb-4"
                >
                  <span className="font-medium flex items-center gap-2 text-gray-500">
                    <HeartIcon className="w-5 h-5" />
                    Favorilerim
                  </span>
                </button>
                <button 
                  onClick={() => setActiveTab('collections')}
                  className={`pb-4 ${activeTab === 'collections' ? 'border-b-2 border-[#F27A1A]' : ''}`}
                >
                  <span className={`font-medium flex items-center gap-2 ${activeTab === 'collections' ? 'text-[#F27A1A]' : 'text-gray-500'}`}>
                    <BookmarkIcon className="w-5 h-5" />
                    Koleksiyonlarım
                    <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded">YENİ</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <CollectionsTabs
            activeTab={activeTab}
            collectionsCount={collections.length}
            followingCount={0}
            onNewCollectionClick={handleNewCollectionClick}
          />

          {/* Content */}

          {collections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <EmptyCollections />
          )}
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

      {/* No Favorites Popup */}
      {showNoFavoritesPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4 relative">
            <button 
              onClick={() => setShowNoFavoritesPopup(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="p-5">
              <div className="w-14 h-14 mx-auto mb-5 bg-[#FFF8F3] rounded-full flex items-center justify-center">
                <HeartIcon className="w-7 h-7 text-[#F27A1A]" />
              </div>
              <h2 className="text-xl font-semibold text-center text-gray-900 mb-4">
                Favorilerinizde Ürün Yok
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Koleksiyonunuza ürün eklemek için önce favorilerinize ürün eklemelisiniz.
              </p>
              <button
                onClick={() => {
                  setShowNoFavoritesPopup(false);
                  router.push('/');
                }}
                className="w-full py-2.5 rounded-md text-white text-base font-medium bg-[#F27A1A] hover:bg-[#F27A1A]/90"
              >
                Alışverişe Başla
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
