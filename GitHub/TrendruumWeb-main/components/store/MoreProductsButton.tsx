"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductBadge from '../ui/ProductBadge';
import { createProductUrl } from '@/utils/productUrl';
import { useBasket } from '@/app/context/BasketContext';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  slug?: string;
  medias?: {
    url: string;
    type: string;
  }[];
  price: number;
  discounted_price?: number | null;
  original_price?: number;
  campaign_price?: number;
  discount_percentage?: number;
  seller?: {
    id: string;
    name: string;
  };
  brand?: {
    name: string;
    slug: string;
    id?: string;
  } | null;
  stock?: number;
  status?: string;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
}

const getBaseSlug = (slug?: string) => {
  if (!slug) return '';
  return slug.replace(/-\d+$/, '').toLowerCase();
};

interface MoreProductsButtonProps {
  products: Product[];
  title?: string;
}

const MoreProductsButton: React.FC<MoreProductsButtonProps> = ({
  products = [],
  title = 'Daha Fazla Ürün',
}) => {
  const { addToBasket, addToGuestBasket } = useBasket();
  const { isLoggedIn } = useAuth();
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());
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

  const handleAddToBasket = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loadingBasket.has(productId)) return;

    setLoadingBasket(prev => new Set(prev).add(productId));

    try {
      if (isLoggedIn) {
        await addToBasket(productId, 1);
      } else {
        await addToGuestBasket(productId, 1);
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

  const handleProductClick = (productSlug: string | undefined, productId: string) => {
    if (typeof window === 'undefined') return;
    const scrollPosition = window.scrollY || window.pageYOffset;
    const currentPath = window.location.pathname;
    const baseSlug = getBaseSlug(productSlug);

    if (currentPath.startsWith('/magaza/')) {
      sessionStorage.setItem('storeScrollPosition', scrollPosition.toString());
      sessionStorage.setItem('storeProductId', productId);
      sessionStorage.setItem('storeProductSlug', productSlug || '');
      sessionStorage.setItem('storeProductBaseSlug', baseSlug);
    }
  };

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

  return (
    <div className="store-more-products-section w-full max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 bg-white p-0">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 sm:px-2 md:px-0">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      {products.length === 0 ? (
        <div className="text-center text-gray-400 py-6 sm:py-8 text-sm sm:text-base">Ürün bulunamadı</div>
      ) : (
        <>
          {/* Mobil Grid Layout */}
          <div className="block sm:hidden px-1">
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => {
                const productSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
                return (
                <Link 
                  key={product.id} 
                  href={createProductUrl(productSlug)}
                  onClick={() => handleProductClick(productSlug, product.id)}
                  target={isDesktopViewport ? '_blank' : undefined}
                  rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                >
                  <div 
                    className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 touch-manipulation"
                    id={`product-${product.id}`}
                    data-product-slug={productSlug}
                  >
                    <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg p-1 group">
                      {product.medias?.[0]?.url ? (
                        <Image
                          src={product.medias[0].url}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 160px"
                          loading="lazy"
                          quality={85}
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
                    </div>
                    
                    <div className="p-2 pb-2 flex-1 flex flex-col">
                      <div className="flex-1 flex flex-col">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                          {product.brand?.name && (
                            <span className="font-bold text-gray-800">
                              {product.brand.name}{' '}
                            </span>
                          )}
                          {product.name}
                        </h3>

                        <div className="flex items-center justify-between mb-3">
                          <div className="flex flex-col">
                            {product.original_price && product.original_price > product.price ? (
                              /* İndirimli fiyat gösterimi */
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-500 line-through">
                                    {new Intl.NumberFormat('tr-TR', {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0
                                    }).format(product.original_price)} TL
                                  </span>
                                  <span className="text-lg font-semibold text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', {
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0
                                    }).format(product.price)} TL
                                  </span>
                                </div>
                                <div className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold w-fit">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  %{Math.round(((product.original_price - product.price) / product.original_price) * 100)} İndirim
                                </div>
                              </div>
                            ) : (
                              /* Normal fiyat gösterimi */
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
                      
                    </div>
                  </div>
                </Link>
              )})}
            </div>
          </div>

          {/* Desktop Grid Layout - 6 ürün satırda */}
          <div className="hidden lg:block px-0">
            <div className="grid grid-cols-6 gap-1.5 xl:gap-2">
              {products.map((product) => {
                const productSlug = product.slug || product.name.toLowerCase().replace(/\s+/g, '-');
                const isOutOfStock = product.status === 'out_of_stock' || (product.stock !== undefined && product.stock <= 0);
                return (
                  <div 
                    key={product.id} 
                    className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 flex flex-col"
                    id={`product-${product.id}`}
                    data-product-slug={productSlug}
                  >
                    <Link 
                      href={createProductUrl(productSlug)}
                      onClick={() => handleProductClick(productSlug, product.id)}
                      target={isDesktopViewport ? '_blank' : undefined}
                      rel={isDesktopViewport ? 'noopener noreferrer' : undefined}
                    >
                      <div className="relative aspect-[2/3] w-full flex items-center justify-center p-2 sm:p-3 md:p-4">
                        {product.medias?.[0]?.url ? (
                          <Image
                            src={product.medias[0].url}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 480px) 45vw, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 16vw"
                            loading="lazy"
                            quality={85}
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
                      </div>
                      
                      <div className="p-4 pb-2 flex-1 flex flex-col">
                        <div className="flex-1 flex flex-col">
                          {/* Ürün Adı - Sabit yükseklik */}
                          <h3 className="text-sm font-medium mb-2 line-clamp-2 text-black h-10 flex items-start">
                            {product.name}
                          </h3>
                          
                          {/* Marka Adı - Tek satır, uzunsa kes */}
                          <p className="text-xs text-gray-600 mb-1 h-4 truncate">
                            {product.brand?.name 
                              ? product.brand.name 
                              : product.seller?.name 
                                ? product.seller.name 
                                : 'Bilinmeyen Marka'
                            }
                          </p>
                          
                          {/* Yıldız Değerlendirme - Markanın altında */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {(() => {
                                const rawRating = product.rating ?? 0;
                                let productRating = 0;
                                if (rawRating !== null && rawRating !== undefined) {
                                  productRating = typeof rawRating === 'number' ? rawRating : parseFloat(String(rawRating)) || 0;
                                }
                                return renderStars(productRating);
                              })()}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({(product.review_count || product.reviewCount || 0)})
                            </span>
                          </div>
                          
                          {/* Fiyat - Sabit yükseklik */}
                          <div className="flex items-baseline gap-2 mb-2 h-6">
                            {product.original_price && product.original_price > product.price ? (
                              /* İndirimli fiyat gösterimi */
                              <>
                                <span className="text-sm font-semibold text-black">
                                  {new Intl.NumberFormat('tr-TR', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                  }).format(product.price)} TL
                                </span>
                                <span className="text-gray-600 line-through text-xs">
                                  {new Intl.NumberFormat('tr-TR', {
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                  }).format(product.original_price)} TL
                                </span>
                              </>
                            ) : (
                              /* Normal fiyat gösterimi */
                              <span className="text-sm font-semibold text-black">
                                {new Intl.NumberFormat('tr-TR', {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0
                                }).format(product.price)} TL
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MoreProductsButton; 