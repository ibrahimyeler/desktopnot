"use client";

import { BookmarkIcon, InformationCircleIcon, TruckIcon, ChatBubbleLeftRightIcon, StarIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import AskQuestionModal from '@/components/product/AskQuestionModal';
import UnfollowConfirmModal from '@/components/common/UnfollowConfirmModal';
import CustomerReviews from '@/components/product/CustomerReviews';
import SimilarProducts from '@/components/product/SimilarProducts';
import { API_V1_URL } from '@/lib/config';
import toast from 'react-hot-toast';

interface Brand {
  ty_id: string;
  name: string;
  image: string;
  status: string;
  slug: string;
  url: string;
  updated_at: string;
  created_at: string;
  id: string;
}

interface Seller {
  name: string;
  slug: string;
  id: string;
  shipping_policy?: {
    general: {
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
      carrier: string;
    };
    custom?: Record<string, {
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
      carrier: string;
      city: {
        name: string;
        slug: string;
        id: string;
      };
    }>;
  };
}

interface ProductSidebarProps {
  campaigns: {
    title: string;
    description?: string;
  }[];
  brand?: Brand;
  seller?: Seller;
  otherSellers?: {
    name: string;
    rating: number;
    deliveryTime: string;
    price: number;
    freeShipping?: boolean;
  }[];
  productId?: string;
  productName?: string; // Ürün adı için prop eklendi
  onQuestionSubmitted?: () => void; // Soru gönderildikten sonra çağrılacak callback
  reviews?: any[]; // Added reviews prop for top review
  productSlug?: string; // Ürün slug'ı için prop
  productImage?: string; // Ürün resmi için prop
  productPrice?: number; // Ürün fiyatı için prop
  onRatingUpdate?: (rating: number, totalReviews: number) => void; // Rating güncelleme callback'i
  similarProducts?: any[]; // Benzer ürünler için prop
  similarProductsLoading?: boolean; // Benzer ürünler yükleme durumu
  currentProductId?: string; // Mevcut ürün ID'si
  currentCategoryId?: string; // Mevcut kategori ID'si
}

const DEFAULT_BRAND: Brand = {
  ty_id: "",
  name: "Mağaza",
  image: "marka-logo",
  status: "active",
  slug: "",
  url: "#",
  updated_at: "",
  created_at: "",
  id: ""
};

const ProductSidebar = ({ campaigns, brand = DEFAULT_BRAND, seller, otherSellers, productId, productName, onQuestionSubmitted, reviews = [], productSlug, productImage, productPrice, onRatingUpdate, similarProducts = [], similarProductsLoading = false, currentProductId, currentCategoryId }: ProductSidebarProps) => {
  const router = useRouter();
  const [showCollectionPopup, setShowCollectionPopup] = useState(false);
  const [showNewCollectionPopup, setShowNewCollectionPopup] = useState(false);
  const [collections, setCollections] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingFollow, setLoadingFollow] = useState(false);
  const [sellerSlug, setSellerSlug] = useState<string>('');
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [showUnfollowModal, setShowUnfollowModal] = useState(false);

  // Check follow status on mount - use seller.id instead of brand.id
  useEffect(() => {
    const checkFollowStatus = async () => {

      const token = localStorage.getItem('token');
      if (!token || !seller?.id) return;

      try {
        const response = await fetch(`${API_V1_URL}/customer/follows`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.meta?.status === 'success') {
          const isFollowed = data.data.some((store: any) => store.id === seller.id);
          setIsFollowing(isFollowed);
          
          // Get seller slug from followed stores
          const followedStore = data.data.find((store: any) => store.id === seller.id);
          if (followedStore) {
            setSellerSlug(followedStore.slug);
          } else {
            setSellerSlug(seller?.slug || '');
          }
        }
      } catch (error) {
      }
    };

    checkFollowStatus();
  }, [seller?.id]);

  useEffect(() => {
    const fetchCollections = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_V1_URL}/customer/likes/collections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      setCollections(json.data || []);
    };
    fetchCollections();
  }, []);

  if (!campaigns) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-medium rounded-full border border-orange-200">
            ✓ Onaylı
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded-full border border-gray-200">
            ⏳ Bekliyor
          </span>
        );
      default:
        return null;
    }
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

  // Mağaza slug'ını güvenli şekilde oluştur - seller name'den
  const createStoreSlug = (name: string): string => {
    if (!name) return '';
    
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire
      .replace(/\s+/g, '-') // Boşlukları tire ile değiştir
      .replace(/-+/g, '-') // Çoklu tireleri tek tire yap
      .replace(/^-|-$/g, ''); // Başta ve sonda tire varsa kaldır
  };

  // Mağaza URL'ini oluştur - önce seller.slug'ı dene, sonra seller.name'den oluştur
  const getStoreUrl = (): string => {
    // Önce seller.slug'ı dene (eğer varsa ve boş değilse)
    if (seller?.slug && seller.slug.trim() !== '') {
      const fixedSlug = fixSlug(seller.slug);
      return `/magaza/${fixedSlug}`;
    }
    
    // Seller slug yoksa veya boşsa seller name'den oluştur
    if (seller?.name && seller.name.trim() !== '') {
      const createdSlug = createStoreSlug(seller.name);
      return `/magaza/${createdSlug}`;
    }
    
    // Son çare olarak brand.slug'ı kullan
    if (brand?.slug && brand.slug.trim() !== '') {
      const fixedSlug = fixSlug(brand.slug);
      return `/magaza/${fixedSlug}`;
    }
    
    return '#';
  };


  // Add follow/unfollow logic - StoreHeader'daki gibi
  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Takip etmek için giriş yapmalısınız.');
      window.location.href = '/giris';
      return;
    }
    setLoadingFollow(true);
    try {
      const storeId = seller?.id;
      if (!storeId) {
        alert('Mağaza ID bulunamadı.');
        setLoadingFollow(false);
        return;
      }
      const res = await fetch(`${API_V1_URL}/customer/follows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ store_id: storeId })
      });
      const data = await res.json();
      if (data.meta?.status === 'success') {
        setIsFollowing(true);
        // Toast mesajı eklenebilir
      } else {
        alert(data.meta?.message || 'Bir hata oluştu');
      }
    } catch (e) {
      alert('Bir hata oluştu');
    } finally {
      setLoadingFollow(false);
    }
  };

  const handleUnfollow = async () => {
    setShowUnfollowModal(true);
  };

  const confirmUnfollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Takibi bırakmak için giriş yapmalısınız.');
      window.location.href = '/giris';
      return;
    }
    
    setLoadingFollow(true);
    try {
      const storeId = seller?.id;
      if (!storeId) {
        alert('Mağaza ID bulunamadı.');
        setLoadingFollow(false);
        return;
      }
      const res = await fetch(`${API_V1_URL}/customer/follows/${storeId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (data.meta?.status === 'success') {
        setIsFollowing(false);
        setShowUnfollowModal(false);
        // Toast mesajı eklenebilir
      } else {
        alert(data.meta?.message || 'Bir hata oluştu');
      }
    } catch (e) {
      alert('Bir hata oluştu');
    } finally {
      setLoadingFollow(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Marka Bilgileri */}
      <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
        {/* Mobil Görünüm - Yeni Tasarım */}
        <div className="md:hidden">
          {/* Üst Satır: Marka + Keşfet */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start gap-2 min-w-0 flex-1">
              {/* Marka Iconu - Turuncu Daire */}
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {(seller?.name || brand.name).charAt(0).toUpperCase()}
                </span>
              </div>
              {/* Marka İsmi */}
              <a
                href={getStoreUrl()}
                className="text-xs font-semibold text-gray-900 truncate hover:text-orange-600 transition-colors cursor-pointer mt-3"
                title={seller?.name || brand.name}
              >
                {seller?.name || brand.name}
              </a>
            </div>
            {/* Keşfet Butonu */}
            <a
              href={getStoreUrl()}
              className="flex items-center justify-center px-2 h-5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-all duration-200 whitespace-nowrap ml-2 mt-0"
            >
              Keşfet
            </a>
          </div>
          
          {/* Alt Satır: Soru Sor + Mağaza Soruları */}
          <div className="flex gap-2">
            {/* Soru Sor Butonu - Sol, Büyük */}
            <button
              onClick={() => setIsAskQuestionModalOpen(true)}
              data-ask-question
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white text-sm font-medium"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span>Soru Sor</span>
            </button>
            
            {/* Mağaza Soruları Butonu - Sağ, Beyaz */}
            <Link 
              href="#questions"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200 border border-gray-300 text-gray-900 text-sm font-medium"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-orange-500" />
              <span>Mağaza Soruları</span>
            </Link>
          </div>
        </div>

        {/* Desktop Görünüm - Eski Tasarım */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 min-w-0">
              <a
                href={getStoreUrl()}
                className="text-sm font-semibold text-gray-900 truncate hover:text-orange-600 transition-colors cursor-pointer flex items-center"
                title={seller?.name || brand.name}
              >
                {(seller?.name || brand.name).length > 10 
                  ? `${(seller?.name || brand.name).substring(0, 10)}...` 
                  : (seller?.name || brand.name)}
              </a>
              <span className="flex-shrink-0 flex items-center">
                {getStatusBadge(brand.status)}
              </span>
            </div>
            <button
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
                isFollowing 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
              onClick={isFollowing ? handleUnfollow : handleFollow}
              disabled={loadingFollow}
            >
              <BookmarkIcon className="w-2.5 h-2.5" />
              <span>{isFollowing ? 'Takipte' : 'Takip Et'}</span>
            </button>
          </div>
          
          {/* Mağaza Aksiyonları */}
          <div className="space-y-2">
            <Link 
              href="#questions"
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500 rounded-lg">
                  <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900">Mağaza Soruları</span>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            {/* Soru Sor Butonu */}
            <button
              onClick={() => setIsAskQuestionModalOpen(true)}
              data-ask-question
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-orange-500 hover:bg-orange-600 transition-all duration-200 text-white text-sm font-medium"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span>Soru Sor</span>
            </button>

            <a
              href={getStoreUrl()}
              className="block w-full text-center py-3 mt-2 text-sm font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 border border-gray-300"
            >
              MAĞAZAYA GİT
            </a>
          </div>
        </div>
      </div>

      {/* Kargo Bilgisi */}
      {seller?.shipping_policy && (
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-orange-500 rounded-lg flex-shrink-0">
              <TruckIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Kargo Bilgisi</h4>
              <div className="space-y-1">
                <p className="text-xs text-red-600 font-medium">
                  400 TL ve üzeri alışverişlerde kargo ücretsiz (Satıcı Karşılar)
                </p>
                <p className="text-xs text-gray-700">
                  400 TL altı siparişlerde sabit 125 TL kargo ücreti uygulanır.
                </p>
                {seller.shipping_policy.general.free_shipping_threshold > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    400 TL ve üzeri kargo ücretsiz (Satıcı Karşılar)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Müşteri Yorumları - Sadece Mobil Görünümde, Hızlı Teslimat'ın üstünde */}
      {productId && productSlug && (
        <div id="reviews" className="md:hidden">
          <CustomerReviews 
            productId={productId}
            productSlug={productSlug} 
            onRatingUpdate={onRatingUpdate}
            productName={productName}
            productImage={productImage}
            productPrice={productPrice}
          />
        </div>
      )}


      {/* Kargo Ücreti Bilgisi - Mavi Renk Paleti - Sadece Desktop Görünümde */}
      <div className="hidden md:block bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
            <TruckIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Kargo Ücreti</h4>
            <p className="text-xs text-gray-700 leading-relaxed">
              400 TL altı siparişlerde sabit 125 TL kargo ücreti uygulanır.
            </p>
          </div>
        </div>
      </div>

      {/* Hızlı Teslimat - Yeşil Renk Paleti - Sadece Desktop Görünümde */}
      <div className="hidden md:block bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500 rounded-lg flex-shrink-0">
            <TruckIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Hızlı Teslimat</h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              Bu mağazadan alışverişlerinizde hızlı ve güvenli teslimat avantajından yararlanın.
            </p>
          </div>
        </div>
      </div>

      {/* Güvenlik Bilgisi - Sadece Desktop Görünümde */}
      <div className="hidden md:block bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-900">Güvenli Alışveriş</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">
          256-bit SSL şifreleme ile korumalı ödeme sistemi
        </p>
      </div>

      {showCollectionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl max-w-lg w-full mx-4 p-6 relative border border-gray-200">
            <button
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowCollectionPopup(false)}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Koleksiyona Ekle</h3>
            
            <div className="space-y-3">
              {/* Yeni Koleksiyon Oluştur */}
              <button
                className="w-full border-2 border-orange-200 rounded-lg p-4 flex items-center justify-center gap-2 hover:border-orange-400 hover:bg-orange-50 transition-all duration-200"
                onClick={() => {
                  setShowCollectionPopup(false);
                  setShowNewCollectionPopup(true);
                }}
              >
                <span className="text-orange-500 text-xl">+</span>
                <span className="text-sm font-medium text-gray-900">Yeni Liste Oluştur</span>
              </button>
              
              {/* Koleksiyonlar */}
              {collections.length > 0 ? (
                <div className="space-y-2">
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      className="w-full border border-gray-200 rounded-lg p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-900 font-medium">{col.name}</span>
                      <span className="text-xs text-gray-500">{col.itemCount || 0} ürün</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-sm">Henüz koleksiyonunuz bulunmuyor</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Soru Sorma Modalı */}
      <AskQuestionModal
        isOpen={isAskQuestionModalOpen}
        onClose={() => setIsAskQuestionModalOpen(false)}
        sellerName={seller?.name || brand.name}
        productName={productName || 'Ürün'}
        productId={productId || ''}
        onQuestionSubmitted={onQuestionSubmitted}
      />

      {/* Unfollow Confirm Modal */}
      <UnfollowConfirmModal
        isOpen={showUnfollowModal}
        onClose={() => setShowUnfollowModal(false)}
        onConfirm={confirmUnfollow}
        sellerName={seller?.name || brand.name}
        isLoading={loadingFollow}
      />
    </div>
  );
};

export default ProductSidebar; 