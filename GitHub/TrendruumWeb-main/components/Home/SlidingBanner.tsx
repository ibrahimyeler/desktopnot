"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/outline';

interface SliderItem {
  slug: string;
  value: any;
}

interface CampaignProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  discounted_price: number | null;
  medias: Array<{
    url: string;
    type: string;
  }>;
  seller: {
    id: string;
    name: string;
  };
  brand?: {
    name: string;
    slug: string;
  };
  stock?: number;
  status?: string;
  rating?: number;
  average_rating?: number;
  review_count?: number;
}

interface SlidingBannerProps {
  leftSliders: SliderItem[];
  campaignProducts: CampaignProduct[];
  campaignBackgroundImage?: string;
}

const SlidingBanner: React.FC<SlidingBannerProps> = ({
  leftSliders,
  campaignProducts,
  campaignBackgroundImage
}) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentProduct, setCurrentProduct] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
//test
  // API'den gelen verileri grupla (banner-link ve banner-image çiftleri)
  // Sadece görseli olan slider'ları göster
  const sliderGroups: Array<{link: string, image: string}> = [];
  for (let i = 0; i < leftSliders.length; i += 2) {
    const linkItem = leftSliders[i];
    const imageItem = leftSliders[i + 1];
    
    if (linkItem && imageItem && 
        linkItem.slug === 'banner-link' && 
        imageItem.slug === 'banner-image') {
      const imageValue = imageItem.value || '';
      // Görseli olan slider'ları ekle (boş string, null, undefined kontrolü)
      if (imageValue && imageValue.trim() !== '') {
      sliderGroups.push({
        link: linkItem.value || '#',
          image: imageValue
      });
      }
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || sliderGroups.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderGroups.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderGroups.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderGroups.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderGroups.length) % sliderGroups.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % campaignProducts.length);
  };

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + campaignProducts.length) % campaignProducts.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      if (isLeftSwipe) {
        nextSlide();
      }
      if (isRightSwipe) {
        prevSlide();
      }
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + ' TL';
  };

  const renderStars = (rating: number = 0) => {
    const numRating = typeof rating === 'number' ? rating : parseFloat(String(rating)) || 0;
    if (numRating <= 0 || isNaN(numRating)) {
      return Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} className="w-3 h-3 text-gray-300" />
      ));
    }
    
    const fullStars = Math.floor(numRating);
    const hasHalfStar = numRating % 1 >= 0.5;
    
    return Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return (
          <StarIcon key={index} className="w-3 h-3 text-yellow-400 fill-current" />
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
          <StarIcon key={index} className="w-3 h-3 text-gray-300" />
        );
      }
    });
  };

  return (
    <div className="w-full bg-white pt-8 sm:pt-6 lg:pt-8 -mt-2 md:mt-0">
      <div className="w-full mx-auto max-w-full pl-0 pr-0 sm:pl-6 sm:pr-0 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-[54%_44%] gap-2 lg:gap-3 items-stretch">
          {/* Sol Taraf - Slider */}
          <div className="w-full">
            <div 
              className="relative h-48 sm:h-52 md:h-56 lg:h-80 xl:h-96 2xl:h-[420px] lg:rounded-lg overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slider Images */}
              {sliderGroups.map((slider, index) => (
                <Link
                  key={index}
                  href={slider.link}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={slider.image}
                    alt={`Banner ${index + 1}`}
                    fill
                    className="object-contain"
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 60vw"
                  />
                </Link>
              ))}

              {/* Navigation Arrows - Visible on all devices */}
              {sliderGroups.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      prevSlide();
                    }}
                    className="absolute left-2 sm:left-4 lg:left-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 lg:bg-black/50 lg:hover:bg-black/70 text-white p-1.5 sm:p-2 lg:p-3 rounded-full transition-all duration-200 z-10 shadow-sm lg:shadow-lg lg:hover:shadow-xl lg:hover:scale-110 flex items-center justify-center"
                    aria-label="Önceki slide"
                  >
                    <ChevronLeftIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      nextSlide();
                    }}
                    className="absolute right-2 sm:right-4 lg:right-2 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 lg:bg-black/50 lg:hover:bg-black/70 text-white p-1.5 sm:p-2 lg:p-3 rounded-full transition-all duration-200 z-10 shadow-sm lg:shadow-lg lg:hover:shadow-xl lg:hover:scale-110 flex items-center justify-center"
                    aria-label="Sonraki slide"
                  >
                    <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                  </button>
                </>
              )}

              {/* Dots Indicator - Only show on desktop */}
              {sliderGroups.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 hidden lg:flex">
                  {sliderGroups.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                        index === currentSlide ? 'bg-white' : 'bg-white/50'
                      }`}
                      aria-label={`Slide ${index + 1}'e git`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sağ Taraf - Kampanya Ürünleri */}
          <div className="hidden lg:block">
            <div 
              className="lg:h-80 xl:h-96 2xl:h-[420px] lg:rounded-lg overflow-hidden relative"
              style={{
                backgroundImage: campaignBackgroundImage 
                  ? `url(${campaignBackgroundImage})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundSize: campaignBackgroundImage ? 'contain' : 'auto',
                backgroundPosition: 'center',
                backgroundRepeat: campaignBackgroundImage ? 'no-repeat' : 'repeat'
              }}
            >

      
              {/* Overlay */}
              <div className="absolute inset-0"></div>
              
                {/* Content */}
                <div className="relative h-full flex items-center justify-center p-2 sm:p-3 lg:p-4 pt-8 lg:pt-12">
                  {campaignProducts.length > 0 && (
                    <div className="relative w-full max-w-md px-2 lg:px-3">
                      <Link
                        href={`/urunler/${campaignProducts[currentProduct].slug}`}
                        className="flex items-center space-x-3 lg:space-x-4 bg-white/70 backdrop-blur-sm rounded-lg p-3 lg:p-4 hover:bg-white/90 transition-colors duration-200"
                      >
                        {/* Ürün Resmi - Sol tarafta */}
                        <div className="w-24 h-24 lg:w-28 lg:h-28 relative flex-shrink-0">
                          {campaignProducts[currentProduct].medias && campaignProducts[currentProduct].medias.length > 0 ? (
                            <Image
                              src={campaignProducts[currentProduct].medias[0].url}
                              alt={campaignProducts[currentProduct].name}
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 1024px) 96px, 112px"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 rounded flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Resim</span>
                            </div>
                          )}
                        </div>

                        {/* Ürün Bilgileri - Sağ tarafta */}
                        <div className="flex-1 min-w-0">
                          {/* Marka Adı */}
                          {campaignProducts[currentProduct].brand?.name && campaignProducts[currentProduct].brand?.slug && (
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const brandSlug = campaignProducts[currentProduct].brand?.slug;
                                if (brandSlug) {
                                  router.push(`/markalar/${brandSlug}`);
                                }
                              }}
                              className="text-xs text-gray-700 hover:text-gray-800 font-bold mb-0.5 truncate block transition-colors duration-200 cursor-pointer"
                            >
                              {campaignProducts[currentProduct].brand.name}
                            </div>
                          )}
                          <h4 className="text-gray-800 text-sm font-medium mb-1 line-clamp-2">
                            {campaignProducts[currentProduct].name}
                          </h4>
                          {/* Yıldız Değerlendirme */}
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {(() => {
                                const rawRating = campaignProducts[currentProduct].average_rating ?? campaignProducts[currentProduct].rating ?? 0;
                                const productRating = typeof rawRating === 'number' ? rawRating : parseFloat(String(rawRating)) || 0;
                                return renderStars(productRating);
                              })()}
                            </div>
                            <span className="text-xs text-gray-500">
                              ({campaignProducts[currentProduct].review_count || 0})
                            </span>
                          </div>
                          {/* Fiyat ve İndirim */}
                          <div className="flex items-center space-x-2 mb-1">
                            {campaignProducts[currentProduct].discounted_price ? (
                              <>
                                <span className="text-red-600 text-base font-bold">
                                  {formatPrice(campaignProducts[currentProduct].discounted_price)}
                                </span>
                                <span className="text-gray-600 text-xs line-through">
                                  {formatPrice(campaignProducts[currentProduct].price)}
                                </span>
                                {/* İndirim Yüzdesi */}
                                {(() => {
                                  const originalPrice = campaignProducts[currentProduct].price;
                                  const discountedPrice = campaignProducts[currentProduct].discounted_price;
                                  if (originalPrice && discountedPrice && originalPrice > discountedPrice) {
                                    const discountPercent = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
                                    if (discountPercent > 0) {
                                      return (
                                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                          %{discountPercent} İndirim
                                        </span>
                                      );
                                    }
                                  }
                                  return null;
                                })()}
                              </>
                            ) : (
                              <span className="text-gray-800 text-base font-bold">
                                {formatPrice(campaignProducts[currentProduct].price)}
                              </span>
                            )}
                          </div>
                          {/* Stok Durumu */}
                          {(() => {
                            const isOutOfStock = campaignProducts[currentProduct].status === 'out_of_stock' || 
                                                campaignProducts[currentProduct].status === 'inactive' || 
                                                (campaignProducts[currentProduct].stock !== undefined && campaignProducts[currentProduct].stock === 0);
                            if (isOutOfStock) {
                              return (
                                <span className="text-xs font-medium text-red-600">
                                  Stokta Yok
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </Link>

                      {/* Ürün Navigation Butonları */}
                      {campaignProducts.length > 1 && (
                        <>
                          <button
                            onClick={prevProduct}
                            className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full transition-colors duration-200 shadow-md"
                            aria-label="Önceki ürün"
                          >
                            <ChevronLeftIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={nextProduct}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 rounded-full transition-colors duration-200 shadow-md"
                            aria-label="Sonraki ürün"
                          >
                            <ChevronRightIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>   
        </div>
      </div>
    </div>
  );
};

export default SlidingBanner;
