"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useBasket } from '@/app/context/BasketContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';
import ProductBadge from '../ui/ProductBadge';

type Product = {
  id: string;
  name: string;
  price: number;
  oldPrice?: number; 
  slug: string;
  images: Array<{
    url: string;
    name?: string;
    id?: string;
  }>;
  rating?: number;
  review_count?: number;
  stock?: number;
  status?: string;
  brand?: {
    name: string;
    id?: string;
  };
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
};

interface Props {
  productId?: string;
  categorySlug?: string; // Kategori slug'ını ekle
  backgroundColor?: string;
  apiResponse?: any;
  relatedProducts?: Product[]; // Prop olarak geçilen ürünler
}

function RelatedPurchases({ productId, categorySlug, backgroundColor, apiResponse, relatedProducts: propRelatedProducts }: Props) {
  
  const [relatedProducts, setRelatedProducts] = useState<Product[]>(propRelatedProducts || []);
  const [loading, setLoading] = useState(!propRelatedProducts);
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<any>(null);
  
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToBasket, addToGuestBasket } = useBasket();
  const router = useRouter();
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());

  let dynamicBgColor = backgroundColor;

  if (!dynamicBgColor && apiResponse) {
    try {
      const section = apiResponse.data.sections.find((s: any) => s.slug === 'product-list');
      const field = section?.fields.find((f: any) => f.slug === 'background-color');
      const item = field?.items.find((i: any) => i.slug === 'bg-color');
      dynamicBgColor = item?.value;
    } catch (e) {}
  }

  const gradientBg = dynamicBgColor
    ? `linear-gradient(to bottom, ${dynamicBgColor.startsWith('#') ? dynamicBgColor : `#${dynamicBgColor}`}, #ffffff)`
    : 'linear-gradient(to bottom, #f5f5e6, #ffffff)';

  const fetchRelatedProducts = useCallback(async () => {
    if (!productId) return;

    try {
      setLoading(true);
      
      let apiUrl = '';
      
      // Kategori endpoint'ini kullan - sadece aynı kategoriden ürünleri çek
      if (categorySlug) {
        apiUrl = `${API_V1_URL}/categories/${categorySlug}/products?per_page=50`;
      } else {
        apiUrl = `${API_V1_URL}/products?per_page=100`;
      }
      
      const response = await fetch(apiUrl);
      

      
      // 404 veya diğer hata durumlarını handle et
      if (!response.ok) {
        if (response.status === 404) {
        } else {
        }
        setRelatedProducts([]);
        return;
      }
      
      const data = await response.json();

      // API response yapısını kontrol et - kategori endpoint'i direkt array döndürüyor
      let productsArray = null;
      
      if (data.data && Array.isArray(data.data)) {
        productsArray = data.data;
      } else if (data.data && data.data.products && Array.isArray(data.data.products)) {
        productsArray = data.data.products;
      } else if (data.data && data.data.products && data.data.products.data && Array.isArray(data.data.products.data)) {
        productsArray = data.data.products.data;
      } else if (data.data && data.data.data && Array.isArray(data.data.data)) {
        productsArray = data.data.data;
      } else {
        setRelatedProducts([]);
        return;
      }
      
      if (productsArray) {
        let filteredProducts = productsArray;
        
        // Ana ürünü ve geçersiz ürünleri filtrele

        
        filteredProducts = filteredProducts.filter((product: any) => {
          const isNotCurrentProduct = product.id !== productId;
          const hasValidPrice = product.price && product.price > 0;
          const hasValidStock = product.stock && product.stock > 0;
          const isNotOutOfStock = product.status !== 'out_of_stock';
          const isNotInactive = product.status !== 'inactive';
          
   
          
          // Sadece ana ürünü filtrele, diğer kontrolleri esnek yap
          return isNotCurrentProduct && hasValidPrice;
        });
        
        
        // Duplicate ürünleri filtrele - daha esnek filtreleme
        const uniqueProducts = filteredProducts.filter((product: any, index: number, self: any[]) => {
          const isDuplicate = self.findIndex((p: any) => 
            p.id === product.id || // Sadece ID'ye göre duplicate kontrol et
            (p.slug === product.slug && p.slug) // Slug varsa ve aynıysa duplicate
          ) !== index;
          
          return !isDuplicate;
        });

        // Random sırala ve ilk 5'i al - zaten aynı kategoriden çekiyoruz
        const shuffled = uniqueProducts.sort(() => 0.5 - Math.random());
        const selectedProducts = shuffled.slice(0, 5);

        // Ürün verilerini doğru formata dönüştür
        const formattedProducts = selectedProducts.map((product: any, index: number) => ({
          id: product.id,
          name: product.name,
          price: product.price || 0,
          slug: product.slug || product.id,
          images: product.medias || product.images || [],
          rating: product.rating || product.average_rating || 0,
          review_count: product.review_count || product.reviews_count || 0,
          oldPrice: product.oldPrice || product.original_price,
          // Stok kontrolünü kaldırıyoruz: Her zaman stokta varmış gibi göster
          stock: 1, // Her zaman pozitif bir stok değeri gönder
          status: 'active', // Her zaman 'active' statusu gönder
          brand: product.brand || product.brand_v2,
          badges: product.badges || {
            fast_shipping: product.fast_shipping || false,
            free_shipping: product.cargo_free || false,
            same_day: product.same_day || false,
            new_product: product.new_product || false,
            best_selling: product.best_selling || false
          }
        }));

        setRelatedProducts(formattedProducts);
      }
    } catch (error) {
      // 404 veya diğer hata durumlarını handle et
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productId, categorySlug]);

  useEffect(() => {
    // Eğer prop olarak relatedProducts geçildiyse fetch yapma
    if (propRelatedProducts && propRelatedProducts.length > 0) {
      setRelatedProducts(propRelatedProducts);
      setLoading(false);
      return;
    }
    
    // Prop yoksa fetch yap
    if (productId) {
      fetchRelatedProducts();
    } else {
      setLoading(false);
    }
  }, [fetchRelatedProducts, propRelatedProducts, productId]);

  // Swiper durumunu kontrol et
  useEffect(() => {
    if (!swiperRef.current) return;
    
    const timeoutId = setTimeout(() => {
      if (swiperRef.current) {
        setIsBeginning(swiperRef.current.isBeginning);
        setIsEnd(swiperRef.current.isEnd);
      }
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [relatedProducts]);

  const handleFavoriteClick = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

    if (loadingFavorites.has(productId)) return;

    setLoadingFavorites(prev => new Set(prev).add(productId));

    try {
      if (isInFavorites(productId)) {
        await removeFavorite(productId);
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        await addToFavorites(productId);
        toast.success('Ürün favorilere eklendi');
      }
    } catch (error) {
      toast.error('İşlem sırasında bir hata oluştu');
    } finally {
      setLoadingFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  
  const handleAddToBasket = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadingBasket.has(productId)) return;

    setLoadingBasket(prev => new Set(prev).add(productId));

    try {
      if (isLoggedIn) {
        await addToBasket(productId, 1);
      } else {
        // Guest kullanıcılar için guest basket kullan
        await addToGuestBasket(productId, 1);
      }
    } catch (error) {
      // Hata mesajı BasketContext'te yönetiliyor, burada ekstra mesaj göstermeye gerek yok
      // Stok kontrolü ve diğer hata mesajları zaten BasketContext'te gösteriliyor
    } finally {
      setLoadingBasket(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/3 sm:w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-32 sm:h-48 bg-gray-200 rounded"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return (
      <section className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
        <div className="text-center py-6 sm:py-8">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Buna Benzer Ürünler
          </h3>
          <p className="text-sm sm:text-base text-gray-500">Benzer ürün bulunamadı</p>
        </div>
      </section>
    );
  }

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-3 h-3 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderProductCard = (product: Product) => {
    const isOutOfStock = product.status === 'out_of_stock' || product.status === 'inactive' || (product.stock !== undefined && product.stock === 0);
    
    return (
      <div 
        className={`product-card block bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex flex-col ${isOutOfStock ? 'opacity-75' : ''}`}
      >
        <Link href={createProductUrl(product.slug)} prefetch={false}>
          <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg p-1 group">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0].url}
                alt={product.name}
                fill
                className={`object-contain transition-all duration-150 ${isOutOfStock ? 'grayscale' : ''}`}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                priority={false}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Badge'leri öncelik sırasına göre göster - maksimum 4 tane */}
            {(() => {
              const badges = [];
              
              // Öncelik sırası: fast_shipping, free_shipping, new_product, best_selling
              if (product.badges?.fast_shipping) badges.push({ type: 'fast_shipping' });
              if (product.badges?.free_shipping) badges.push({ type: 'free_shipping' });
              if (product.badges?.new_product) badges.push({ type: 'new_product' });
              if (product.badges?.best_selling) badges.push({ type: 'best_selling' });
              
              // Konumları dinamik olarak ata
              const positions = [
                'top-2 left-2',      // 1. badge: Sol üst
                'top-14 left-2',     // 2. badge: Sol üstün altında
                'bottom-2 left-2',   // 3. badge: Sol alt
                'bottom-2 left-14'   // 4. badge: Sol alttakinin yanında
              ];
              
              // Sadece ilk 4 badge'i göster ve konumları sırayla ata
              return badges.slice(0, 4).map((badge, index) => (
                <ProductBadge 
                  key={`${product.id}-badge-${index}`}
                  type={badge.type as any} 
                  className={positions[index]} 
                />
              ));
            })()}
            
            {/* Stokta Yok Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Stokta Yok
                </div>
              </div>
            )}
            
            <button
              onClick={(e) => handleFavoriteClick(product.id, e)}
              disabled={loadingFavorites.has(product.id)}
              className={`bg-white rounded-full p-2 ${
                loadingFavorites.has(product.id) ? 'opacity-50 cursor-wait' : ''
              }`}
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 20,
                minWidth: '32px',
                minHeight: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isInFavorites(product.id) ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500 fill-current" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="p-2 pb-2 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                {product.brand && product.brand.name && (
                  <span className="font-bold text-gray-800">
                    {product.brand.name}{' '}
                  </span>
                )}
                {product.name}
              </h3>

              {/* Yıldız Değerlendirme - Her zaman görünür */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.review_count || 0})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  {isOutOfStock ? (
                    <>
                      <span className="text-lg font-semibold text-gray-500 line-through">
                        {new Intl.NumberFormat('tr-TR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(product.price)} TL
                      </span>
                      <span className="text-xs text-red-600 font-medium">
                        Stokta Yok
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-semibold text-gray-900">
                      {new Intl.NumberFormat('tr-TR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(product.price)} TL
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Sepete Ekle Butonu kaldırıldı */}
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="w-full bg-white pt-2 pb-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
        <div className="relative rounded-xl p-3 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black">
              Buna Benzer Ürünler
            </h2>
          </div>

          <div className="px-2 sm:px-4 md:px-6 pb-2">
            <div className="relative related-purchases-wrapper">
              <Swiper
                ref={swiperRef}
                className="related-purchases-swiper"
                modules={[]}
                spaceBetween={4}
                slidesPerView={2}
                touchEventsTarget="container"
                allowTouchMove={true}
                watchOverflow={false}
                resistance={true}
                resistanceRatio={0}
                simulateTouch={true}
                grabCursor={true}
                onSlideChange={(swiper) => {
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  setIsBeginning(swiper.isBeginning);
                  setIsEnd(swiper.isEnd);
                }}
                breakpoints={{
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 6,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 8,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 8,
                  },
                  1024: {
                    slidesPerView: 5,
                    spaceBetween: 10,
                  },
                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 12,
                  },
                  1536: {
                    slidesPerView: 5,
                    spaceBetween: 14,
                  },
                }}
              >
                {relatedProducts.map(product => (
                  <SwiperSlide key={product.id}>
                    {renderProductCard(product)}
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Navigation Buttons - Mobil ve desktop'ta göster */}
              {!isBeginning && (
                <button 
                  className="flex items-center justify-center absolute left-1 md:left-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 md:p-2 transition-all duration-200 group hover:bg-orange-500 active:bg-orange-600 z-10 cursor-pointer shadow-md md:shadow-xl border border-gray-200/50 md:border-0"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Önceki ürünler"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 text-gray-700 group-hover:text-white group-active:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              
              {!isEnd && (
                <button 
                  className="flex items-center justify-center absolute right-1 md:right-0 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 md:p-2 transition-all duration-200 group hover:bg-orange-500 active:bg-orange-600 z-10 cursor-pointer shadow-md md:shadow-xl border border-gray-200/50 md:border-0"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Sonraki ürünler"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-6 md:h-6 text-gray-700 group-hover:text-white group-active:text-white transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Swiper CSS */}
      <style jsx global>{`
        .related-purchases-wrapper {
          overflow: hidden;
        }
        .related-purchases-swiper {
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          width: 100%;
          overflow: hidden;
        }
        .related-purchases-swiper .swiper-wrapper {
          display: flex;
          width: auto;
          transform: translate3d(0px, 0, 0);
        }
        .related-purchases-swiper .swiper-slide {
          height: auto;
          flex-shrink: 0;
          width: auto;
        }
        @media (max-width: 1023px) {
          .related-purchases-wrapper {
            overflow: hidden;
          }
          .related-purchases-swiper {
            overflow: hidden;
          }
          .related-purchases-swiper .swiper-wrapper {
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
}

export default RelatedPurchases;
