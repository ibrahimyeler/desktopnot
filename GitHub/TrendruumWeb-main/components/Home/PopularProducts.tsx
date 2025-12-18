"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, StarIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { useFavorites } from '@/app/context/FavoriteContext'
import { useAuth } from '@/app/context/AuthContext'
import { useBasket } from '@/app/context/BasketContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import ProductBadge from '../ui/ProductBadge'

// Swiper CSS'lerini import et
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { createProductUrl } from '@/utils/productUrl'

interface Product {
  id: string;
  name: string;
  medias: {
    url: string;
    type: string;
  }[];
  price: number;
  discounted_price: number | null;
  seller: {
    id: string;
    name: string;
  };
  brand: {
    ty_id?: string;
    name: string;
    status?: string;
    slug: string;
    url?: string;
    id?: string;
  };
  
  slug: string;
  stock?: number;
  status?: string;
  rating?: number;
  average_rating?: number; // API'den gelen alan
  reviewCount?: number;
  review_count?: number; // API'den gelen alan
  stockProgress?: number;
  // API'den gelen ek alanlar
  category?: any;
  variants?: any[];
  attributes?: any[];
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    cargo_free?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
    same_day?: boolean;
    [key: string]: any;
  };
}

interface PopularProductsProps {
  title: string;
  products: Product[];
  backgroundColor?: string;
  apiResponse?: any;
  uniqueId?: string;
  layout?: 'swiper' | 'grid';
}

const getBaseSlug = (slug: string) => {
  if (!slug) return '';
  return slug.replace(/-\d+$/, '').toLowerCase();
};

const PopularProducts = ({ title, products, backgroundColor, apiResponse, uniqueId = 'default', layout = 'swiper' }: PopularProductsProps) => {
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToBasket, addToGuestBasket, isGuestBasket } = useBasket();
  const router = useRouter();
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const swiperRef = useRef<any>(null);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);

  // Swiper durumunu kontrol et - mobilde layout shift'i önlemek için debounce
  useEffect(() => {
    if (!swiperRef.current) return;
    
    // Mobilde layout shift'i önlemek için küçük bir gecikme
    const timeoutId = setTimeout(() => {
      if (swiperRef.current) {
        setIsBeginning(swiperRef.current.isBeginning);
        setIsEnd(swiperRef.current.isEnd);
      }
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [products]); // products değiştiğinde tekrar kontrol et

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

  const renderStars = (rating: number = 0) => {
    // Rating değerini number olarak garantile
    const numRating = typeof rating === 'number' ? rating : parseFloat(String(rating)) || 0;
    // Rating 0'dan büyükse ve geçerli bir sayıysa yıldızları göster
    if (numRating <= 0 || isNaN(numRating)) {
      // Rating 0 veya geçersizse tüm yıldızları boş göster
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
        // Tam dolu yıldız
        return (
          <StarIcon
            key={index}
            className="w-3 h-3 text-yellow-400 fill-current"
          />
        );
      } else if (index === fullStars && hasHalfStar) {
        // Yarım yıldız - SVG gradient ile
        return (
          <div key={index} className="relative w-3 h-3 inline-block">
            <StarIcon className="w-3 h-3 text-gray-300 absolute inset-0" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        // Boş yıldız
        return (
          <StarIcon
            key={index}
            className="w-3 h-3 text-gray-300"
          />
        );
      }
    });
  };

  const renderProductBadges = (product: Product) => {
    const badgeData = product.badges;
    if (!badgeData) return null;

    const badgeList: Array<'fast_shipping' | 'free_shipping' | 'new_product' | 'best_selling'> = [];
    if (badgeData.fast_shipping) badgeList.push('fast_shipping');
    if (badgeData.free_shipping || (!badgeData.free_shipping && badgeData.cargo_free)) badgeList.push('free_shipping');
    if (badgeData.new_product) badgeList.push('new_product');
    if (badgeData.best_selling) badgeList.push('best_selling');

    if (badgeList.length === 0) return null;

    const positions = [
      'top-2 left-2',
      'top-14 left-2',
      'bottom-2 left-2',
      'bottom-2 left-14',
    ];

    return badgeList.slice(0, 4).map((type, index) => (
      <ProductBadge
        key={`${product.id}-${type}-${index}`}
        type={type}
        className={positions[index]}
      />
    ));
  };

  const renderProductCard = (product: Product) => {
    const isOutOfStock = product.status === 'out_of_stock' || product.status === 'inactive' || (product.stock !== undefined && product.stock === 0);
    
    // Rating değerini kontrol et - HomeClient'te average_rating rating'e map ediliyor
    // Önce average_rating'i kontrol et, sonra rating'i, son olarak 0
    const rawRating = product.average_rating ?? product.rating ?? 0;
    // Number olarak parse et - string gelebilir veya null/undefined olabilir
    let productRating = 0;
    if (rawRating !== null && rawRating !== undefined) {
      productRating = typeof rawRating === 'number' ? rawRating : parseFloat(String(rawRating)) || 0;
    }
    // Review count - API'den review_count geliyor
    const productReviewCount = product.review_count ?? product.reviewCount ?? 0;
    
    return (
      <div 
        id={`product-${product.id}`}
        data-product-slug={product.slug}
        className={`bg-white overflow-hidden flex flex-col relative group hover:shadow-lg transition-all duration-200 border border-gray-300 ${isOutOfStock ? 'opacity-75' : ''}`}
      >
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
        
        {/* Ürün Resmi - Aspect ratio */}
        <Link 
          href={createProductUrl(product.slug)} 
          prefetch={false}
          onClick={(e) => handleProductClick(e, product.slug, product.id)}
          target={isDesktopViewport ? '_blank' : undefined}
          rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
        >
          <div className="relative aspect-[2/3] w-full flex items-center justify-center p-2 sm:p-3 md:p-4">
            <Image
              src={product.medias[0]?.url || '/placeholder.png'}
              alt={product.name}
              fill
              className={`object-contain ${isOutOfStock ? 'grayscale' : ''}`}
              sizes="(max-width: 480px) 45vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
              loading="lazy"
              priority={false}
            />
            {renderProductBadges(product)}
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
        
        {/* Ürün Bilgileri - Sabit yükseklik */}
        <div className="p-4 pb-2 flex-1 flex flex-col">
          <Link 
            href={createProductUrl(product.slug)} 
            prefetch={false} 
            className="flex-1 flex flex-col"
            onClick={(e) => handleProductClick(e, product.slug, product.id)}
            target={isDesktopViewport ? '_blank' : undefined}
            rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
          >
            {/* Ürün Adı - Sabit yükseklik */}
            <h3 className="text-sm font-medium mb-2 line-clamp-2 text-black h-10 flex items-start">
              {product.name}
            </h3>
            
            {/* Marka Adı - Tek satır, uzunsa kes */}
            <p className="text-xs text-gray-600 mb-1 h-4 truncate">
              {product.brand && product.brand.name 
                ? product.brand.name 
                : product.seller && product.seller.name 
                  ? product.seller.name 
                  : 'Bilinmeyen Marka'
              }
            </p>
            
            {/* Yıldız Değerlendirme - Markanın altında, ProductGrid tasarımı gibi */}
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {renderStars(productRating)}
              </div>
              <span className="text-xs text-gray-500">
                ({productReviewCount})
              </span>
            </div>
            
            {/* Fiyat - Sabit yükseklik */}
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
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(numPrice) + ' TL';
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
                      // discounted_price varsa ve 0'dan büyükse onu kullan, yoksa price'ı kullan
                      const price = (product.discounted_price && product.discounted_price > 0) ? product.discounted_price : (product.price && product.price > 0 ? product.price : null);
                      if (!price || price === 0) return '';
                      const numPrice = typeof price === 'number' ? price : (typeof price === 'string' ? parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.')) : 0);
                      if (isNaN(numPrice) || numPrice <= 0) return '';
                      return new Intl.NumberFormat('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      }).format(numPrice) + ' TL';
                    })()}
                  </span>
                  {/* Eğer discounted_price varsa ve price'dan farklıysa eski fiyatı göster */}
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

    // Stokta olmayan ürünler için sepete ekleme işlemini engelle
    if (isOutOfStock) {
      return;
    }

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

  // Ürün kartına tıklama - Scroll pozisyonunu kaydet
  const handleProductClick = (e: React.MouseEvent, productSlug: string, productId: string) => {
    // Scroll pozisyonunu ve ürün ID'sini sessionStorage'a kaydet
    // URL'den sayfa tipini belirle
    if (typeof window !== 'undefined') {
      const scrollPosition = window.scrollY || window.pageYOffset;
      const currentPath = window.location.pathname;
      const baseSlug = getBaseSlug(productSlug);
      
      // S sayfası kontrolü
      if (currentPath.startsWith('/s/')) {
        sessionStorage.setItem('sPageScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('sPageProductId', productId);
        sessionStorage.setItem('sPageProductSlug', productSlug);
        sessionStorage.setItem('sPageProductBaseSlug', baseSlug);
      }
    }
  };

  return (
    <div className="w-full bg-white pt-2 pb-2">
      <div className="w-full mx-auto px-0 sm:px-3 lg:px-4 xl:px-6 2xl:px-8 max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px]">
      <div className="relative p-3" style={{ background: gradientBg }}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black">{title}</h2>
          {/* <Link 
            href="/sana-ozel"
            className="text-sm sm:text-sm lg:text-base xl:text-lg text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
          >
            Tümünü Gör
          </Link> */}
        </div>

        <div className="px-2 sm:px-4 md:px-6 pb-2">
          {layout === 'grid' ? (
            // Grid Layout
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-1.5 sm:gap-2 md:gap-2">
              {products.map(product => (
                <div key={product.id}>
                  {renderProductCard(product)}
                </div>
              ))}
            </div>
          ) : (
            // Swiper Layout
            <div className={`relative popular-products-wrapper-${uniqueId}`}>
              <Swiper
                ref={swiperRef}
                className={`popular-products-swiper-${uniqueId}`}
                modules={[]}
                spaceBetween={8}
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
                    spaceBetween: 8,
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
                    slidesPerView: 6,
                    spaceBetween: 8,
                  },
                  1280: {
                    slidesPerView: 6,
                    spaceBetween: 10,
                  },
                  1536: {
                    slidesPerView: 6,
                    spaceBetween: 12,
                  },
                }}
              >
                {products.map(product => (
                  <SwiperSlide key={product.id}>
                    {renderProductCard(product)}
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Navigation Buttons - Mobil ve desktop'ta göster */}
              {/* Sola kaydırma butonu - sadece başlangıçta değilse göster */}
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
              
              {/* Sağa kaydırma butonu - sadece sonda değilse göster */}
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
          )}
        </div>

      </div>
    </div>

    {/* Swiper CSS - Only apply for swiper layout */}
    {layout === 'swiper' && (
      <style jsx global>{`
        .popular-products-wrapper-${uniqueId} {
          overflow: hidden;
        }
        .popular-products-swiper-${uniqueId} {
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          width: 100%;
          overflow: hidden;
        }
        .popular-products-swiper-${uniqueId} .swiper-wrapper {
          display: flex;
          width: auto;
          transform: translate3d(0px, 0, 0);
        }
        .popular-products-swiper-${uniqueId} .swiper-slide {
          height: auto;
          flex-shrink: 0;
          width: calc((100% - 8px) / 2);
        }
        @media (max-width: 1023px) {
          .popular-products-wrapper-${uniqueId} {
            overflow: hidden;
          }
          .popular-products-swiper-${uniqueId} {
            overflow: hidden;
          }
          .popular-products-swiper-${uniqueId} .swiper-wrapper {
            overflow: visible;
          }
          .popular-products-swiper-${uniqueId} .swiper-slide {
            width: calc((100% - 8px) / 2);
          }
        }
        @media (min-width: 1024px) {
          .popular-products-swiper-${uniqueId} .swiper-slide {
            width: auto;
          }
        }
      `}</style>
    )}
    </div>
  );
};

export default PopularProducts;

//test