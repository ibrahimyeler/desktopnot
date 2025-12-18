"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { API_V1_URL } from '@/lib/config';
import { useBasket } from '@/app/context/BasketContext';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { createProductUrl } from '@/utils/productUrl';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  discounted_price: number | null;
  medias: {
    url: string;
    type: string;
  }[];
  images: {
    id: string;
    name: string;
    url: string;
    type: string;
  }[];
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    name: string;
    slug: string;
    shipping_policy: any;
  };
  rating?: number;
  average_rating?: number;
  reviewCount?: number;
  review_count?: number;
  stock?: number;
  status?: string;
}

interface SimilarProductsProps {
  products?: Product[];
  loading?: boolean;
  currentProductId?: string;
  currentCategoryId?: string;
}

const SimilarProducts: React.FC<SimilarProductsProps> = ({
  products: propProducts,
  loading: propLoading = false,
  currentProductId,
  currentCategoryId
}) => {
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<any>(null);
  const { addToBasket, addToGuestBasket, isGuestBasket } = useBasket();
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Ürün slug'ını gerçek ID'ye çevir
  const getProductId = async (productSlug: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_V1_URL}/products/${productSlug}`);
      const data = await response.json();
      
      if (data.meta.status === 'success' && data.data) {
        return data.data.id;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  // Kategori ürünlerini fetch et
  const fetchCategoryProducts = async (categoryId: string) => {
    setLoading(true);
    try {
      const url = `${API_V1_URL}/categories/${categoryId}/products?limit=20&page=1`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      
      if (data.meta && data.meta.status === 'success' && data.data) {
        
        const filteredProducts = data.data.filter((product: Product) => product.id !== currentProductId);
        
        const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 10);
        
        setSimilarProducts(randomProducts);
      } else {
        setSimilarProducts([]);
      }
    } catch (error) {
      setSimilarProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda kategori ürünlerini fetch et
  useEffect(() => {

    
    if (currentCategoryId && !propProducts?.length) {
      fetchCategoryProducts(currentCategoryId);
    } else if (propProducts?.length) {
      setSimilarProducts(propProducts);
    }
  }, [currentCategoryId, propProducts, currentProductId]);

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
  }, [similarProducts]);

  const renderStars = (rating: number = 0) => {
    const numRating = typeof rating === 'number' ? rating : parseFloat(String(rating)) || 0;
    if (numRating <= 0 || isNaN(numRating)) {
      return Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          className="w-3 h-3 text-gray-300"
        />
      ));
    }
    
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return (
          <StarIcon
            key={index}
            className="w-3 h-3 text-yellow-400 fill-current"
          />
        );
      } else if (index === fullStars && hasHalfStar) {
        return (
          <div key={index} className="relative w-3 h-3 inline-block">
            <StarIcon className="w-3 h-3 text-gray-300 absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        return (
          <StarIcon
            key={index}
            className="w-3 h-3 text-gray-300"
          />
        );
      }
    });
  };

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

  const handleAddToBasket = async (productId: string, e: React.MouseEvent, isOutOfStock: boolean = false) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock || loadingBasket.has(productId)) return;

    setLoadingBasket(prev => new Set(prev).add(productId));

    try {
      if (isGuestBasket) {
        await addToGuestBasket(productId, 1);
        // Toast mesajı BasketContext'te yönetiliyor
      } else {
        await addToBasket(productId, 1);
        // Toast mesajı BasketContext'te yönetiliyor
      }
    } catch (error) {
      // Hata mesajı BasketContext'te yönetiliyor
    } finally {
      setLoadingBasket(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const renderProductCard = (product: Product) => {
    const isOutOfStock = product.status === 'out_of_stock' || product.status === 'inactive' || (product.stock !== undefined && product.stock === 0);
    
    const rawRating = product.average_rating ?? product.rating ?? 0;
    let productRating = 0;
    if (rawRating !== null && rawRating !== undefined) {
      productRating = typeof rawRating === 'number' ? rawRating : parseFloat(String(rawRating)) || 0;
    }
    const productReviewCount = product.review_count ?? product.reviewCount ?? 0;
    
    return (
      <div className={`bg-white rounded-lg overflow-hidden flex flex-col relative group transition-all duration-200 border border-gray-300 ${isOutOfStock ? 'opacity-75' : ''}`}>
        {/* Favori İkonu */}
        <button 
          className={`bg-white rounded-full p-1.5 shadow-md transition-colors duration-200 ${
            isInFavorites(product.id) 
              ? 'hover:bg-red-500' 
              : 'hover:bg-orange-500'
          } ${loadingFavorites.has(product.id) ? 'opacity-50 cursor-wait' : ''}`}
          onClick={(e) => handleFavoriteClick(product.id, e)}
          disabled={loadingFavorites.has(product.id)}
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
            <HeartSolidIcon className="w-4 h-4 text-red-500 hover:text-white transition-colors duration-200" />
          ) : (
            <HeartIcon className="w-4 h-4 text-gray-600 hover:text-white transition-colors duration-200" />
          )}
        </button>
        
        {/* Ürün Resmi */}
        <Link href={createProductUrl(product.slug)} prefetch={false}>
          <div className="relative aspect-[2/3] w-full flex items-center justify-center p-2 sm:p-3 md:p-4">
            <Image
              src={product.images?.[0]?.url || product.medias?.[0]?.url || '/placeholder.png'}
              alt={product.name}
              fill
              className={`object-contain ${isOutOfStock ? 'grayscale' : ''}`}
              sizes="(max-width: 480px) 45vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
            />
            {/* Stokta Yok Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
                  Stokta Yok
                </div>
              </div>
            )}
          </div>
        </Link>
        
        {/* Ürün Bilgileri */}
        <div className="p-4 pb-2 flex-1 flex flex-col">
          <Link href={createProductUrl(product.slug)} prefetch={false} className="flex-1 flex flex-col">
            {/* Ürün Adı */}
            <h3 className="text-sm font-medium mb-2 line-clamp-2 text-black h-10 flex items-start">
              {product.name}
            </h3>
            
            {/* Yıldız Değerlendirme */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {renderStars(productRating)}
              </div>
              <span className="text-xs text-gray-500">
                ({productReviewCount})
              </span>
            </div>
            
            {/* Fiyat */}
            <div className="flex items-baseline gap-2 mb-2 h-6">
              {isOutOfStock ? (
                <>
                  <span className="text-sm font-semibold text-gray-500 line-through">
                    {(() => {
                      const price = product.discounted_price || product.price;
                      if (!price || price === 0) return '';
                      const numPrice = typeof price === 'number' ? price : (typeof price === 'string' ? parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.')) : 0);
                      if (isNaN(numPrice) || numPrice <= 0) return '';
                      return new Intl.NumberFormat('tr-TR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(Math.round(numPrice)) + ' TL';
                    })()}
                  </span>
                  <span className="text-xs text-red-600 font-medium">
                    Stokta Yok
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-black">
                    {(() => {
                      const price = (product.discounted_price && product.discounted_price > 0) ? product.discounted_price : (product.price && product.price > 0 ? product.price : null);
                      if (!price || price === 0) return '';
                      const numPrice = typeof price === 'number' ? price : (typeof price === 'string' ? parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.')) : 0);
                      if (isNaN(numPrice) || numPrice <= 0) return '';
                      return new Intl.NumberFormat('tr-TR', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(Math.round(numPrice)) + ' TL';
                    })()}
                  </span>
                  {(product.discounted_price && product.price && product.discounted_price > 0 && product.price > 0 && product.discounted_price !== product.price) ? (
                    <span className="text-gray-600 line-through text-xs">
                      {(() => {
                        const numPrice = typeof product.price === 'number' ? product.price : (typeof product.price === 'string' ? parseFloat(String(product.price).replace(/[^\d.,]/g, '').replace(',', '.')) : 0);
                        if (isNaN(numPrice) || numPrice <= 0) return '';
                        return new Intl.NumberFormat('tr-TR', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(Math.round(numPrice)) + ' TL';
                      })()}
                    </span>
                  ) : null}
                </>
              )}
            </div>
          </Link>
        </div>
      </div>
    );
  };

  // Loading state
  if (loading || propLoading) {
    return (
      <div className="mt-8 w-full bg-white pt-2 pb-2">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
          <div className="relative rounded-xl p-3 bg-white">
            <h2 className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black mb-3">
              Benzer Ürünler
            </h2>
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 w-full bg-white pt-2 pb-2">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
        <div className="relative rounded-xl p-3 bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black">
              Benzer Ürünler
            </h2>
          </div>

          <div className="px-2 sm:px-4 md:px-6 pb-2">
            <div className="relative similar-products-wrapper">
              <Swiper
                ref={swiperRef}
                className="similar-products-swiper"
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
                {similarProducts.map(product => (
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
        .similar-products-wrapper {
          overflow: hidden;
        }
        .similar-products-swiper {
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          width: 100%;
          overflow: hidden;
        }
        .similar-products-swiper .swiper-wrapper {
          display: flex;
          width: auto;
          transform: translate3d(0px, 0, 0);
        }
        .similar-products-swiper .swiper-slide {
          height: auto;
          flex-shrink: 0;
          width: auto;
        }
        @media (max-width: 1023px) {
          .similar-products-wrapper {
            overflow: hidden;
          }
          .similar-products-swiper {
            overflow: hidden;
          }
          .similar-products-swiper .swiper-wrapper {
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default SimilarProducts;
