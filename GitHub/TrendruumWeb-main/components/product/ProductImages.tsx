"use client";

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { HeartIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon, ShareIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductBadge from '../ui/ProductBadge';
import toast from 'react-hot-toast';

interface ProductImagesProps {
  images?: Array<string | { url: string }>;
  productName: string;
  isAdultCategory?: boolean;
  isAdultVerified?: boolean;
  showAgeVerification?: boolean;
  stock?: number;
  status?: string;
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
  productId?: string;
  isInFavorites?: boolean;
  onFavoriteClick?: () => void;
}

const ProductImages = ({ images, productName, isAdultCategory = false, isAdultVerified = true, showAgeVerification = false, stock, status, badges, productId, isInFavorites = false, onFavoriteClick }: ProductImagesProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const mainSwiperRef = useRef<any>(null);
  const thumbnailSwiperRef = useRef<any>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchCurrentYRef = useRef<number | null>(null);
  const isSwipingRef = useRef(false);
  const isVerticalScrollRef = useRef(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(3/4); // Varsayılan 3:4
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Mobil kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // iOS Safari için share modal body scroll lock
  useEffect(() => {
    if (showShareModal && isMobile) {
      // iOS Safari için body scroll'u kilitle
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      // iOS için özel handling
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      (body.style as any).webkitOverflowScrolling = 'none';
      
      html.style.overflow = 'hidden';
      html.style.height = '100%';
      
      // iOS için safe area support
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }

      return () => {
        // Scroll pozisyonunu geri yükle
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.touchAction = '';
        (body.style as any).webkitOverflowScrolling = '';
        
        html.style.overflow = '';
        html.style.height = '';
        
        // Viewport meta'yı geri yükle
        if (metaViewport) {
          metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, viewport-fit=cover');
        }
        
        window.scrollTo(0, scrollY);
      };
    }
  }, [showShareModal, isMobile]);

  // Görüntü URL'sini almak için yardımcı fonksiyon
  const getImageUrl = (image: string | Record<string, any>) => {
    if (typeof image === 'string') return image;

    // API farklı alan isimleriyle URL döndürebiliyor
    return (
      image?.url ||
      image?.fullpath ||
      image?.fullPath ||
      image?.full_path ||
      image?.path ||
      image?.secure_url ||
      image?.src ||
      image?.image ||
      ''
    );
  };

  // Eğer resim yoksa varsayılan bir resim göster
  const imageUrls = images && Array.isArray(images) && images.length > 0 
    ? images
        .map(img => getImageUrl(img))
        .filter((url): url is string => Boolean(url && typeof url === 'string'))
    : ['/no-image.png'];

  // Resim yüklendiğinde oranını al
  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    // NaN kontrolü ekle
    if (!isNaN(aspectRatio) && isFinite(aspectRatio) && aspectRatio > 0) {
      setImageAspectRatio(aspectRatio);
    }
  };

  // Stok durumu kontrolü
  const isOutOfStock = status === 'out_of_stock' || status === 'inactive' || (stock !== undefined && stock === 0);

  // Ana görsel için mobil swipe handler'ları
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchCurrentXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchCurrentYRef.current = touch.clientY;
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;
    
    // Dikey kaydırma mı yatay kaydırma mı kontrol et
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isVerticalScrollRef.current = true;
      isSwipingRef.current = false;
    } else if (Math.abs(deltaX) > 10) {
      isSwipingRef.current = true;
      isVerticalScrollRef.current = false;
    }
    
    touchCurrentXRef.current = touch.clientX;
    touchCurrentYRef.current = touch.clientY;
  };

  const handleTouchEnd = () => {
    if (!isMobile || touchStartXRef.current === null || touchCurrentXRef.current === null) {
      touchStartXRef.current = null;
      touchCurrentXRef.current = null;
      touchStartYRef.current = null;
      touchCurrentYRef.current = null;
      isSwipingRef.current = false;
      isVerticalScrollRef.current = false;
      return;
    }

    const deltaX = touchCurrentXRef.current - touchStartXRef.current;
    const threshold = 40; // Kaydırma eşiği (px)

    // Sadece yatay kaydırma ise resim değiştir
    if (isSwipingRef.current && !isVerticalScrollRef.current && Math.abs(deltaX) > threshold && images && Array.isArray(images) && images.length > 1) {
      // Sol kaydırma -> sonraki görsel
      if (deltaX < 0) {
        setSelectedImage(prev => prev < imageUrls.length - 1 ? prev + 1 : 0);
      } else {
        // Sağ kaydırma -> önceki görsel
        setSelectedImage(prev => prev > 0 ? prev - 1 : imageUrls.length - 1);
      }
    } else if (!isSwipingRef.current && !isVerticalScrollRef.current) {
      // Kaydırma değil, tap ise modal aç
      setIsModalOpen(true);
    }

    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
    touchStartYRef.current = null;
    touchCurrentYRef.current = null;
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
  };

  // Modal içindeki touch handler'ları
  const handleModalTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartXRef.current = touch.clientX;
    touchCurrentXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    touchCurrentYRef.current = touch.clientY;
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
  };

  const handleModalTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile || touchStartXRef.current === null || touchStartYRef.current === null) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartXRef.current;
    const deltaY = touch.clientY - touchStartYRef.current;
    
    // Dikey kaydırma mı yatay kaydırma mı kontrol et
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      isVerticalScrollRef.current = true;
      isSwipingRef.current = false;
    } else if (Math.abs(deltaX) > 10) {
      isSwipingRef.current = true;
      isVerticalScrollRef.current = false;
      // Yatay kaydırma yapılıyorsa sayfa scroll'unu engelle
      e.preventDefault();
    }
    
    touchCurrentXRef.current = touch.clientX;
    touchCurrentYRef.current = touch.clientY;
  };

  const handleModalTouchEnd = () => {
    if (!isMobile || touchStartXRef.current === null || touchCurrentXRef.current === null) {
      touchStartXRef.current = null;
      touchCurrentXRef.current = null;
      touchStartYRef.current = null;
      touchCurrentYRef.current = null;
      isSwipingRef.current = false;
      isVerticalScrollRef.current = false;
      return;
    }

    const deltaX = touchCurrentXRef.current - touchStartXRef.current;
    const threshold = 40; // Kaydırma eşiği (px)

    // Sadece yatay kaydırma ise resim değiştir
    if (isSwipingRef.current && !isVerticalScrollRef.current && Math.abs(deltaX) > threshold && images && Array.isArray(images) && images.length > 1) {
      // Sol kaydırma -> sonraki görsel
      if (deltaX < 0) {
        setSelectedImage(prev => prev < imageUrls.length - 1 ? prev + 1 : 0);
      } else {
        // Sağ kaydırma -> önceki görsel
        setSelectedImage(prev => prev > 0 ? prev - 1 : imageUrls.length - 1);
      }
    }

    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
    touchStartYRef.current = null;
    touchCurrentYRef.current = null;
    isSwipingRef.current = false;
    isVerticalScrollRef.current = false;
  };

  // ESC tuşu ile modal kapatma ve keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;
      
      switch (e.key) {
        case 'Escape':
          setIsModalOpen(false);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (images && Array.isArray(images) && images.length > 1) {
            setSelectedImage(prev => {
              const next = prev > 0 ? prev - 1 : imageUrls.length - 1;
              if (mainSwiperRef.current) {
                mainSwiperRef.current.slideTo(next);
              }
              return next;
            });
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (images && Array.isArray(images) && images.length > 1) {
            setSelectedImage(prev => {
              const next = prev < imageUrls.length - 1 ? prev + 1 : 0;
              if (mainSwiperRef.current) {
                mainSwiperRef.current.slideTo(next);
              }
              return next;
            });
          }
          break;
      }
    };
    //tesrt

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Body scroll'u engelle ama touch event'leri engelleme
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.backgroundColor = 'white';
      
      // HTML elementini de sıfırla
      document.documentElement.style.margin = '0';
      document.documentElement.style.padding = '0';
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.backgroundColor = 'white';
      
      // Modal'a focus ver
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.backgroundColor = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
      document.documentElement.style.margin = '';
      document.documentElement.style.padding = '';
      document.documentElement.style.overflow = '';
      document.documentElement.style.backgroundColor = '';
    };
  }, [isModalOpen, images?.length]);

  return (
    <div className="space-y-2 md:space-y-4 pt-0 w-full h-auto">
      {/* Ana resim */}
      <div 
        className="relative w-full group bg-white rounded-none md:rounded-lg md:min-h-0 overflow-hidden" 
        style={{ 
          // Mobilde tam genişlik ve daha dar oran kullanarak görseli yanlardan daha fazla kırp ve daha büyük göster
          aspectRatio: isNaN(imageAspectRatio) || !isFinite(imageAspectRatio) 
            ? (isMobile ? '3/4' : '3/4')
            : (isMobile ? '3/4' : imageAspectRatio),
          minHeight: isMobile ? '70vh' : 'auto'
        }}
      >
        <div 
          onClick={() => {
            // Desktop'ta tıklayınca modal aç, mobilde touch handler'ı kullan
            if (isMobile) return;
            setIsModalOpen(true);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="cursor-pointer h-full w-full"
        >
          <Image
            src={imageUrls[selectedImage]}
            alt={productName}
            fill
            className="object-cover rounded-none md:rounded-lg"
            sizes="100vw"
            priority
            onLoad={handleImageLoad}
          />
        </div>

        {/* Ana resimde sağ-sol butonları - sadece desktop'ta */}
        {images && Array.isArray(images) && images.length > 1 && (
          <>
            {/* Desktop navigation buttons */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(prev => prev > 0 ? prev - 1 : images.length - 1);
              }}
              className="hidden md:block absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-700 hover:text-gray-900" />
            </button>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(prev => prev < images.length - 1 ? prev + 1 : 0);
              }}
              className="hidden md:block absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-700 hover:text-gray-900" />
            </button>
          </>
        )}

        {/* Beğeni İkonu - Sağ Üstte */}
        {productId && onFavoriteClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteClick();
            }}
            className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
            aria-label={isInFavorites ? 'Favorilerden kaldır' : 'Favorilere ekle'}
          >
            {isInFavorites ? (
              <HeartSolidIcon className="w-6 h-6 text-red-500" />
            ) : (
              <HeartIcon className="w-6 h-6 text-gray-700 hover:text-red-500" />
            )}
          </button>
        )}

        {/* Paylaş İkonu - Favori İkonunun Altında - Sadece Mobil */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowShareModal(true);
          }}
          className="md:hidden absolute top-20 right-4 z-20 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200"
          aria-label="Paylaş"
        >
          <ShareIcon className="w-6 h-6 text-gray-700 hover:text-orange-500" />
        </button>

        {/* Badge'leri öncelik sırasına göre göster - maksimum 4 tane */}
        {(() => {
          const badgeList = [];
          
          // Öncelik sırası: fast_shipping, free_shipping, new_product, best_selling
          if (badges?.fast_shipping) badgeList.push({ type: 'fast_shipping' });
          if (badges?.free_shipping) badgeList.push({ type: 'free_shipping' });
          if (badges?.new_product) badgeList.push({ type: 'new_product' });
          if (badges?.best_selling) badgeList.push({ type: 'best_selling' });
          
          // Konumları dinamik olarak ata (2.25 kat badge'ler için uygun alan)
          const positions = [
            'top-4 left-4',      // 1. badge: Sol üst
            'top-20 left-4',     // 2. badge: Sol üstün altında
            'bottom-4 left-4',   // 3. badge: Sol alt
            'bottom-4 left-20'   // 4. badge: Sol alttakinin yanında
          ];
          
          // Sadece ilk 4 badge'i göster ve konumları sırayla ata
          return badgeList.slice(0, 4).map((badge, index) => (
            <ProductBadge 
              key={`badge-${index}`}
              type={badge.type as any} 
              className={positions[index]}
              size="large"
            />
          ));
        })()}

        {/* Mobil için nav dot'lar - resim container'ı içinde, ayrı ayrı */}
        {imageUrls.length > 1 && (
          <>
            {imageUrls.map((_, index) => {
              const totalDots = imageUrls.length;
              const dotWidth = 8; // Aktif dot genişliği
              const dotGap = 3; // Dot'lar arası boşluk
              const totalWidth = (totalDots - 1) * (dotWidth + dotGap) + dotWidth;
              const startX = -totalWidth / 2;
              const dotX = startX + index * (dotWidth + dotGap) + dotWidth / 2;
              
              return (
                <button
                  key={`dot-${index}`}
                  onClick={() => setSelectedImage(index)}
                  className={`
                    absolute bottom-1.5 left-1/2 md:hidden
                    rounded-full transition-all duration-200 
                    touch-none appearance-none !p-0 !m-0 
                    pointer-events-auto
                    ${selectedImage === index
                      ? "w-[8px] h-[8px] bg-black"
                      : "w-[6px] h-[6px] bg-black/40"
                    }
                  `}
                  style={{
                    transform: `translate(calc(-50% + ${dotX}px), 0)`,
                    minWidth: 0,
                    minHeight: 0,
                    touchAction: 'none'
                  }}
                  aria-label={`${index + 1}. ürün görseli`}
                />
              );
            })}
          </>
        )}

      </div>

      {/* Küçük resimler - Slider (sadece desktop) */}
      {images && Array.isArray(images) && images.length > 1 && (
        <div className="relative hidden md:block">
          <Swiper
            modules={[Navigation]}
            spaceBetween={isMobile ? 4 : 6}
            slidesPerView="auto"
            centeredSlides={false}
            initialSlide={selectedImage}
            navigation={!isMobile ? {
              nextEl: '.swiper-button-next-thumbnails',
              prevEl: '.swiper-button-prev-thumbnails',
            } : false}
            onSwiper={(swiper) => {
              thumbnailSwiperRef.current = swiper;
              // İlk yüklemede seçili resme kaydır
              if (selectedImage > 0) {
                setTimeout(() => {
                  swiper.slideTo(selectedImage, 0);
                }, 100);
              }
            }}
            className="product-thumbnails-swiper"
            style={{ 
              paddingTop: isMobile ? '8px' : '12px', 
              paddingLeft: isMobile ? '8px' : '12px', 
              paddingRight: isMobile ? '8px' : '12px', 
              paddingBottom: isMobile ? '8px' : '32px' 
            }}
          >
            {images.map((image, index) => (
              <SwiperSlide key={`thumb-${index}-${getImageUrl(image)}`} style={{ width: 'auto' }}>
                <button
                  onClick={() => {
                    setSelectedImage(index);
                    if (mainSwiperRef.current) {
                      mainSwiperRef.current.slideTo(index);
                    }
                  }}
                  className={`flex-shrink-0 ${isMobile ? 'w-12 h-14' : 'w-16 h-20 md:w-20 md:h-24'} rounded-md overflow-hidden bg-white border-2 ${
                    selectedImage === index 
                      ? 'border-orange-500 ring-2 ring-orange-500 shadow-md' 
                      : 'border-gray-400 md:border-gray-200 hover:border-gray-400 hover:ring-2 hover:ring-gray-300 hover:shadow-sm'
                  }`}
                >
                  <Image
                    src={getImageUrl(image)}
                    alt={`${productName} - ${index + 1}`}
                    width={isMobile ? 48 : 80}
                    height={isMobile ? 56 : 96}
                    className="w-full h-full object-contain p-1"
                  />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Buttons - Sadece Desktop */}
          {!isMobile && (
            <>
              <button className="swiper-button-prev-thumbnails absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
                <ChevronLeftIcon className="w-4 h-4 text-gray-700" />
              </button>
              <button className="swiper-button-next-thumbnails absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md">
                <ChevronRightIcon className="w-4 h-4 text-gray-700" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Modal */}
      {isClient && isModalOpen && createPortal(
        <div 
          className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/50 backdrop-blur-sm md:bg-black/70"
          onClick={() => setIsModalOpen(false)}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label="Ürün resmi görüntüleyici"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            isolation: 'isolate',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            touchAction: 'pan-y pinch-zoom',
            overscrollBehavior: 'contain'
          }}
        >
          <div 
            ref={modalRef}
            className="relative w-full h-full flex items-center justify-center outline-none" 
            tabIndex={0}
          >
            {/* Kapatma butonu - sağ üstte */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute z-20 bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-all duration-300 border border-gray-300 hover:border-gray-400 shadow-lg hover:shadow-xl"
              style={{
                top: 'calc(env(safe-area-inset-top, 0px) + 16px)',
                right: 'calc(env(safe-area-inset-right, 0px) + 16px)'
              }}
            >
              <XMarkIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Resim container - tam ekran */}
            <div className="relative w-full h-full flex items-center justify-center bg-transparent">
              {/* Üst tıklanabilir alan - resmin üstündeki boş alan */}
              <div 
                className="absolute top-0 left-0 right-0 z-[5]"
                onClick={() => setIsModalOpen(false)}
                style={{
                  height: '20%',
                  top: 0
                }}
              />

              {/* Resim container - ortada */}
              <div 
                className="relative w-full h-full flex items-center justify-center z-[1]" 
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleModalTouchStart}
                onTouchMove={handleModalTouchMove}
                onTouchEnd={handleModalTouchEnd}
                style={{
                  touchAction: 'pan-y pinch-zoom',
                  WebkitOverflowScrolling: 'touch',
                  overscrollBehavior: 'contain'
                }}
              >
                <Image
                  src={imageUrls[selectedImage]}
                  alt={productName}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                  onLoad={handleImageLoad}
                  style={{
                    touchAction: 'pan-y pinch-zoom'
                  }}
                />
                
                {/* Navigation buttons - resmin hemen sağında ve solunda */}
                {images && Array.isArray(images) && images.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(prev => {
                          const next = prev > 0 ? prev - 1 : imageUrls.length - 1;
                          if (mainSwiperRef.current) {
                            mainSwiperRef.current.slideTo(next);
                          }
                          return next;
                        });
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 md:hover:bg-orange-500 backdrop-blur-sm rounded-full shadow-lg md:hover:shadow-xl transition-all duration-300 z-10 md:hover:scale-110 border border-orange-200 md:hover:border-orange-400 flex items-center justify-center w-10 h-10 md:w-11 md:h-11"
                    >
                      <ChevronLeftIcon className="w-4 h-4 md:w-5 md:h-5 text-orange-600 md:hover:text-white transition-colors duration-300" />
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(prev => {
                          const next = prev < imageUrls.length - 1 ? prev + 1 : 0;
                          if (mainSwiperRef.current) {
                            mainSwiperRef.current.slideTo(next);
                          }
                          return next;
                        });
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 md:hover:bg-orange-500 backdrop-blur-sm rounded-full shadow-lg md:hover:shadow-xl transition-all duration-300 z-10 md:hover:scale-110 border border-orange-200 md:hover:border-orange-400 flex items-center justify-center w-10 h-10 md:w-11 md:h-11"
                    >
                      <ChevronRightIcon className="w-4 h-4 md:w-5 md:h-5 text-orange-600 md:hover:text-white transition-colors duration-300" />
                    </button>
                  </>
                )}
                
              </div>

              {/* Alt tıklanabilir alan - resmin altındaki boş alan */}
              <div 
                className="absolute bottom-0 left-0 right-0 z-[5]"
                onClick={() => setIsModalOpen(false)}
                style={{
                  height: '20%',
                  bottom: 0
                }}
              />

              {/* Thumbnail'lar - alt kısımda */}
              {images && Array.isArray(images) && images.length > 1 && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-[15] max-w-[90vw] overflow-x-auto px-4 scrollbar-hide"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
                    WebkitOverflowScrolling: 'touch',
                    overscrollBehaviorX: 'contain',
                    scrollSnapType: 'x proximity'
                  }}
                >
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImage(index);
                        if (mainSwiperRef.current) {
                          mainSwiperRef.current.slideTo(index);
                        }
                      }}
                      className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-orange-500 ring-2 ring-orange-500 shadow-md'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <Image
                        src={getImageUrl(image)}
                        alt={`${productName} - ${index + 1}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Paylaşım Modal - Aşağıdan Açılan */}
      {isClient && showShareModal && createPortal(
        <div 
          className="fixed inset-0 z-[9999] md:hidden"
          onClick={() => setShowShareModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh', // iOS için dynamic viewport height
            WebkitOverflowScrolling: 'touch',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            isolation: 'isolate',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            willChange: 'transform'
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              height: '100dvh',
              touchAction: 'none'
            }}
          />
          
          {/* Modal Content - Aşağıdan */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 'env(safe-area-inset-bottom, 0)',
              maxHeight: '90dvh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehavior: 'contain',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              willChange: 'transform'
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900">Ürün Linkini Paylaş</h2>
                  <button
                    onClick={async () => {
                      try {
                        if (typeof window !== 'undefined') {
                          await navigator.clipboard.writeText(window.location.href);
                          setLinkCopied(true);
                          toast.success('Link kopyalandı!');
                          setTimeout(() => setLinkCopied(false), 2000);
                        }
                      } catch (error) {
                        toast.error('Link kopyalanamadı');
                      }
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Linki Kopyala"
                  >
                    <ClipboardDocumentIcon className="w-5 h-5 text-gray-600" />
                  </button>
                  {linkCopied && (
                    <span className="text-xs text-green-600 font-medium">Kopyalandı</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    setLinkCopied(false);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Kapat"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="px-4 py-4 pb-14">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-8 shadow-sm">
                <div className="grid grid-cols-4 gap-4">
                {/* WhatsApp */}
                <button
                  onClick={() => {
                    const url = `https://wa.me/?text=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`;
                    window.open(url, '_blank');
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 w-full bg-white rounded-2xl border border-gray-100 shadow-[0_10px_18px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                  aria-label="WhatsApp'ta Paylaş"
                >
                  <svg className="w-8 h-8 flex-shrink-0" fill="#25D366" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </button>

                {/* Facebook */}
                <button
                  onClick={() => {
                    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`;
                    window.open(url, '_blank');
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 w-full bg-white rounded-2xl border border-gray-100 shadow-[0_10px_18px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                  aria-label="Facebook'ta Paylaş"
                >
                  <svg className="w-8 h-8 flex-shrink-0" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                {/* X (Twitter) */}
                <button
                  onClick={() => {
                    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(typeof document !== 'undefined' ? document.title : '')}`;
                    window.open(url, '_blank');
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 w-full bg-white rounded-2xl border border-gray-100 shadow-[0_10px_18px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                  aria-label="X'te Paylaş"
                >
                  <svg className="w-8 h-8 flex-shrink-0" fill="#000000" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>

                {/* Instagram */}
                <button
                  onClick={() => {
                    // Instagram web'de direkt paylaşım yok, link kopyalama göster
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success('Link kopyalandı! Instagram\'da yapıştırabilirsiniz.');
                    }
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center justify-center p-4 w-full bg-white rounded-2xl border border-gray-100 shadow-[0_10px_18px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_28px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
                  aria-label="Instagram'da Paylaş"
                >
                  <svg className="w-8 h-8 flex-shrink-0" fill="#E4405F" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
                </div>
              </div>

              {/* Kopyala Butonu */}
              <button
                onClick={async () => {
                  try {
                    if (typeof window !== 'undefined') {
                      await navigator.clipboard.writeText(window.location.href);
                      toast.success('Link kopyalandı!');
                    }
                    setShowShareModal(false);
                  } catch (error) {
                    toast.error('Link kopyalanamadı');
                  }
                }}
                className="w-full flex items-center justify-center gap-3 bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-2xl font-semibold transition-colors shadow-[0_16px_32px_rgba(249,115,22,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200"
              >
                <ClipboardDocumentIcon className="w-6 h-6" />
                <span>Linki Kopyala</span>
              </button>
            </div>

            {/* Bottom Padding */}
            <div className="h-6" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductImages;
