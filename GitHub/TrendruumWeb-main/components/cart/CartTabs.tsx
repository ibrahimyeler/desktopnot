import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useFavorites } from '@/app/context/FavoriteContext';
import { useBasket } from '@/app/context/BasketContext';
import { useAuth } from '@/app/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';

interface CartHistoryItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  added_at: string;
  removed_at?: string;
  product_image?: string;
  product_slug?: string;
}

const getBaseSlug = (slug?: string) => {
  if (!slug) return '';
  return slug.replace(/-\d+$/, '').toLowerCase();
};

const CartTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eklediklerim' | 'favoriler'>('eklediklerim');
  const { favorites, loading: favoritesLoading } = useFavorites();
  const { basketItems, loading: basketLoading, isGuestBasket, addToBasket } = useBasket();
  const { isLoggedIn } = useAuth();
  const [cartHistory, setCartHistory] = useState<CartHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setIsDesktopViewport(window.innerWidth >= 1024);
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  // Sepet geçmişini yükle
  useEffect(() => {
    fetchCartHistory();
  }, []);

  const fetchCartHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setHistoryLoading(false);
        return;
      }

      // localStorage'dan sepete eklenen ürünlerin geçmişini al
      const cartHistoryData = localStorage.getItem('cartHistory');
      
      if (cartHistoryData) {
        const history = JSON.parse(cartHistoryData);
        // Son 2 haftalık veriyi filtrele
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        
        const filteredHistory = history.filter((item: CartHistoryItem) => 
          new Date(item.added_at) >= twoWeeksAgo
        );
        
        setCartHistory(filteredHistory);
      } else {
        setCartHistory([]);
      }
    } catch (error) {
      setCartHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  // Ürün resimlerini yükle
  useEffect(() => {
    const loadProductImages = async () => {
      const newImages: Record<string, string> = {};
      
      for (const item of cartHistory) {
        // Eğer zaten resim varsa atla
        if (item.product_image && item.product_image !== '/placeholder.webp') {
          continue;
        }
        
        // Eğer product_slug varsa API'den resim al
        if (item.product_slug) {
          try {
            const response = await fetch(`${API_V1_URL}/products/${item.product_slug}`);
            const data = await response.json();
            
            if (data.meta?.status === 'success' && data.data?.medias?.[0]?.url) {
              newImages[item.product_id] = data.data.medias[0].url;
            } else if (data.meta?.status === 'success' && data.data?.images?.[0]?.url) {
              newImages[item.product_id] = data.data.images[0].url;
            }
          } catch (error) {
          }
        }
      }
      
      if (Object.keys(newImages).length > 0) {
        setProductImages(prev => ({ ...prev, ...newImages }));
      }
    };
    
    if (cartHistory.length > 0) {
      loadProductImages();
    }
  }, [cartHistory]);

  const handleProductNavigation = useCallback((productSlug: string, productId: string) => {
    if (typeof window === 'undefined') return;

    const scrollPosition = window.scrollY || window.pageYOffset;
    sessionStorage.setItem('recentlyViewedScrollPosition', scrollPosition.toString());
    sessionStorage.setItem('recentlyViewedProductId', productId);
    sessionStorage.setItem('recentlyViewedProductSlug', productSlug || '');
    sessionStorage.setItem('recentlyViewedProductBaseSlug', getBaseSlug(productSlug));
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || historyLoading || activeTab !== 'eklediklerim') return;

    const savedProductId = sessionStorage.getItem('recentlyViewedProductId');
    const savedScrollPosition = sessionStorage.getItem('recentlyViewedScrollPosition');
    const savedProductSlug = sessionStorage.getItem('recentlyViewedProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('recentlyViewedProductBaseSlug');

    if (!savedScrollPosition) return;

    const timer = setTimeout(() => {
      const scrollToElement = (element: HTMLElement) => {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100;

        window.scrollTo({
          top: Math.max(offsetPosition, 0),
          behavior: 'smooth'
        });
      };

      let targetElement: HTMLElement | null = null;

      if (savedProductId) {
        targetElement = document.getElementById(`recently-viewed-${savedProductId}`);
      }

      if (!targetElement && savedProductSlug) {
        targetElement = document.querySelector(`[data-recently-viewed-slug="${savedProductSlug}"]`) as HTMLElement | null;
      }

      if (!targetElement && savedProductBaseSlug) {
        targetElement = document.querySelector(`[data-recently-viewed-slug^="${savedProductBaseSlug}"]`) as HTMLElement | null;
      }

      if (targetElement) {
        scrollToElement(targetElement);
      } else {
        const scrollPos = parseInt(savedScrollPosition, 10);
        if (!isNaN(scrollPos)) {
          window.scrollTo({
            top: scrollPos,
            behavior: 'smooth'
          });
        }
      }

      sessionStorage.removeItem('recentlyViewedProductId');
      sessionStorage.removeItem('recentlyViewedScrollPosition');
      sessionStorage.removeItem('recentlyViewedProductSlug');
      sessionStorage.removeItem('recentlyViewedProductBaseSlug');
    }, 300);

    return () => clearTimeout(timer);
  }, [historyLoading, activeTab, cartHistory]);

  const getImageUrl = useCallback((item: CartHistoryItem): string => {
    // Önce productImages state'inden kontrol et
    if (productImages[item.product_id]) {
      return productImages[item.product_id];
    }
    
    // Eğer zaten resim URL'i varsa kullan
    if (item.product_image && item.product_image !== '/placeholder.webp') {
      return item.product_image;
    }
    
    return '/placeholder.webp';
  }, [productImages]);

  // Yıldız rating render fonksiyonu
  const renderStars = useCallback((rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  }, []);

  const handleAddToCart = useCallback(async (productId: string) => {
    try {
      await addToBasket(productId, 1);
      // Toast mesajı BasketContext'te yönetiliyor
    } catch (error) {
      // Hata mesajı da BasketContext'te yönetiliyor
    }
  }, [addToBasket]);

  return (
    <div className="w-full">
      <div className="flex border-b mb-3 sm:mb-4">
        <button
          className={`px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm border-b-2 transition-colors ${activeTab === 'eklediklerim' ? 'border-[#F27A1A] text-[#F27A1A]' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('eklediklerim')}
        >
          Önceden Gezdiklerim
        </button>
        <button
          className={`ml-2 sm:ml-4 px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm border-b-2 transition-colors ${activeTab === 'favoriler' ? 'border-[#F27A1A] text-[#F27A1A]' : 'border-transparent text-gray-500'}`}
          onClick={() => setActiveTab('favoriler')}
        >
          Favorilerim
        </button>
      </div>
      <div>
        {activeTab === 'eklediklerim' ? (
          <div className="p-1 sm:p-2">
            {historyLoading ? (
              <div className="text-gray-400 text-xs sm:text-sm py-6 sm:py-8 text-center">Ürünler yükleniyor...</div>
            ) : cartHistory && cartHistory.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
                {cartHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-gray-200 rounded-lg p-1.5 sm:p-2 flex flex-col h-full"
                    id={`recently-viewed-${item.product_id}`}
                    data-recently-viewed-slug={item.product_slug || ''}
                  >
                    {/* Ürün Resmi */}
                    <Link 
                      href={createProductUrl(item.product_slug || '')} 
                      className="w-full aspect-square relative mb-1.5 sm:mb-2 bg-gray-50 rounded overflow-hidden block hover:opacity-80 transition-opacity"
                      onClick={() => handleProductNavigation(item.product_slug || '', item.product_id)}
                      target={isDesktopViewport ? '_blank' : undefined}
                      rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                    >
                      <Image
                        src={getImageUrl(item)}
                        alt={item.product_name}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.webp';
                        }}
                      />
                    </Link>
                    
                    {/* Ürün Bilgileri */}
                    <div className="flex flex-col flex-1">
                      <Link 
                        href={createProductUrl(item.product_slug || '')} 
                        className="block"
                        onClick={() => handleProductNavigation(item.product_slug || '', item.product_id)}
                        target={isDesktopViewport ? '_blank' : undefined}
                        rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                      >
                        <h3 className="text-xs font-medium text-black text-center line-clamp-2 mb-1 min-h-[1.5rem] sm:min-h-[2rem] hover:text-orange-600 transition-colors cursor-pointer">
                          {item.product_name}
                        </h3>
                      </Link>
                      
                      <div className="text-xs sm:text-sm font-bold text-black text-center mb-1.5 sm:mb-2">
                        {item.price?.toLocaleString("tr-TR")} TL
                      </div>
                      
                      {/* Yıldız Rating */}
                      <div className="flex items-center justify-center gap-1 mb-1.5 sm:mb-2">
                        <div className="flex">
                          {renderStars(0)}
                        </div>
                        <span className="text-xs text-gray-500">(0)</span>
                      </div>
                      
                      {/* Sepete Ekle Butonu kaldırıldı */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm py-8 text-center">
                {isGuestBasket ? 'Misafir sepetinizde ürün bulunmamaktadır.' : 'Daha önce eklediğiniz ürün bulunmamaktadır.'}
              </div>
            )}
          </div>
        ) : (
          <div className="p-1 sm:p-2">
            {!isLoggedIn ? (
              <div className="text-center py-6 sm:py-8">
                <div className="text-gray-400 mb-3 sm:mb-4">
                  <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-3 sm:mb-4 text-sm">Favorilerinizi görmek için giriş yapmalısınız</p>
                <Link 
                  href="/giris"
                  className="inline-block bg-orange-500 text-white px-4 sm:px-6 py-2 rounded-md hover:bg-orange-600 transition-colors text-sm"
                >
                  Giriş Yap
                </Link>
              </div>
            ) : favoritesLoading ? (
              <div className="text-gray-400 text-xs sm:text-sm py-6 sm:py-8 text-center">Favoriler yükleniyor...</div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2">
                {favorites.map((fav) => (
                  <div 
                    key={fav.id} 
                    className="bg-white border border-gray-200 rounded-lg p-1.5 sm:p-2 flex flex-col h-full"
                    id={`favorite-${fav.id}`}
                    data-favorite-slug={fav.slug || ''}
                  >
                    {/* Ürün Resmi */}
                    <Link 
                      href={createProductUrl(fav.slug || '')} 
                      className="w-full aspect-square relative mb-1.5 sm:mb-2 bg-gray-50 rounded overflow-hidden block hover:opacity-80 transition-opacity"
                      target={isDesktopViewport ? '_blank' : undefined}
                      rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                    >
                      <Image
                        src={
                          (fav.images && fav.images.length > 0 && fav.images[0].url) ||
                          (fav.medias && fav.medias.length > 0 && fav.medias[0].url) ||
                          "/placeholder.webp"
                        }
                        alt={fav.name || 'Favori Ürün'}
                        fill
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.webp';
                        }}
                      />
                    </Link>
                    
                    {/* Ürün Bilgileri */}
                    <div className="flex flex-col flex-1">
                      <Link 
                        href={createProductUrl(fav.slug || '')} 
                        className="block"
                        target={isDesktopViewport ? '_blank' : undefined}
                        rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                      >
                        <h3 className="text-xs font-medium text-black text-center line-clamp-2 mb-1 min-h-[1.5rem] sm:min-h-[2rem] hover:text-orange-600 transition-colors cursor-pointer">
                          {fav.name}
                        </h3>
                      </Link>
                      
                      <div className="text-xs sm:text-sm font-bold text-black text-center mb-1.5 sm:mb-2">
                        {fav.price?.toLocaleString("tr-TR")} TL
                      </div>
                      
                      {/* Yıldız Rating */}
                      <div className="flex items-center justify-center gap-1 mb-1.5 sm:mb-2">
                        <div className="flex">
                          {renderStars(0)}
                        </div>
                        <span className="text-xs text-gray-500">(0)</span>
                      </div>
                      
                      {/* Ürün Detayı butonu kaldırıldı */}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm py-8 text-center">Favori ürününüz bulunmamaktadır.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CartTabs; 