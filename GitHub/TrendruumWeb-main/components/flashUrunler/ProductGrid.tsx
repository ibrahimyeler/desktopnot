"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { HeartIcon, StarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useBasket } from '@/app/context/BasketContext';
import { createProductUrl } from '@/utils/productUrl';
import toast from 'react-hot-toast';
import ProductBadge from '../ui/ProductBadge';
import ProductBadgeSVG from '../product/ProductBadgeSVG';

interface ProductImage {
  url: string;
  name: string;
  id: string;
}

interface ShippingPolicy {
  general: {
    delivery_time: number;
    shipping_fee: number;
    free_shipping_threshold: number;
    carrier: string;
  };
  custom: any[];
}

interface Seller {
  id: string;
  name: string;
  slug: string | null;
  shipping_policy: ShippingPolicy;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price?: number;
  campaign_price?: number;
  discount_percentage?: number;
  campaign_type?: string;
  campaign_settings?: {
    buy_quantity?: number;
    pay_quantity?: number;
    nth_product?: number;
    nth_discount_percentage?: number;
    discount_amount?: number;
  };
  stock?: number;
  status?: string;
  rating?: number;
  average_rating?: number;
  reviewCount?: number;
  review_count?: number;
  is_adult?: boolean;
  images: ProductImage[];
  colors?: string[];
  variants?: Array<{
    slug: string;
    name: string;
    value_name: string;
    value_slug: string;
    imageable: boolean;
  }>;
  seller: Seller;
  brand?: {
    name: string;
    id: string;
  };
  badges?: {
    fast_shipping?: boolean;
    free_shipping?: boolean;
    same_day?: boolean;
    new_product?: boolean;
    best_selling?: boolean;
  };
}

interface ProductGridProps {
  products: Product[];
  isAdultCategory?: boolean;
  isAdultVerified?: boolean;
  showAgeVerification?: boolean;
  columnsPerRow?: number; // Desktop için satır başına kolon sayısı
  hideAddToBasket?: boolean; // Örneğin arama sayfasında butonu gizlemek için
  openInNewTabOnDesktop?: boolean; // Desktop'ta yeni sekmede açma
  disablePrefetch?: boolean; // Prefetch mekanizmasını devre dışı bırak (arama sayfası için)
}

// Dinamik rating hesaplama fonksiyonu
const calculateDynamicRating = (productId: string, originalRating: number = 0, originalReviewCount: number = 0) => {
  return {
    rating: originalRating,
    reviewCount: originalReviewCount
  };
};

// Eski statik yorumlar kaldırıldı - sadece API'den gelen veriler kullanılacak
const getStaticReviewsForProduct = (productId: string) => {
  return [];
};


const getBaseSlug = (slug: string) => {
  if (!slug) return '';
  return slug.replace(/-\d+$/, '').toLowerCase();
};

const ProductGrid: React.FC<ProductGridProps> = React.memo(({ products, isAdultCategory = false, isAdultVerified = false, showAgeVerification = false, columnsPerRow = 5, hideAddToBasket = false, openInNewTabOnDesktop = false, disablePrefetch = false }) => {

  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const { addToBasket, addToGuestBasket } = useBasket();
  const router = useRouter();
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const [loadingBasket, setLoadingBasket] = useState<Set<string>>(new Set());
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [mobileVariantModal, setMobileVariantModal] = useState<{
    productName: string;
    variants: any[];
  } | null>(null);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  // Lazy loading için state - Kaldırıldı (artık kullanılmıyor)
  const [visibleProducts, setVisibleProducts] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  // Dinamik rating fetch kaldırıldı - Rating bilgisi zaten API'den geliyor
  // Her ürün için ayrı review API'si çağrısı yapmak performans sorununa yol açıyor

  // Intersection Observer setup
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const productId = entry.target.getAttribute('data-product-id');
            if (productId) {
              setVisibleProducts(prev => new Set([...prev, productId]));
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!openInNewTabOnDesktop) return;

    const updateViewportFlag = () => {
      setIsDesktopViewport(window.innerWidth >= 1024);
    };

    updateViewportFlag();
    window.addEventListener('resize', updateViewportFlag);

    return () => {
      window.removeEventListener('resize', updateViewportFlag);
    };
  }, [openInNewTabOnDesktop]);

  // Product ref callback
  const productRef = useCallback((node: HTMLDivElement | null, productId: string) => {
    if (observerRef.current && node) {
      node.setAttribute('data-product-id', productId);
      observerRef.current.observe(node);
    }
  }, []);

  // Yıldız render fonksiyonu - yarı yıldızları da gösterir
  const renderStars = (rating: number = 0) => {
    const normalizedRating = Math.max(0, Math.min(5, rating)); // 0-5 arası sınırla
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    
    return Array.from({ length: 5 }, (_, index) => {
      const isFull = index < fullStars;
      const isHalf = index === fullStars && hasHalfStar;
      
      return (
        <div key={index} className="relative inline-block w-3 h-3">
          {/* Boş yıldız arka plan */}
          <StarIcon
            className={`w-3 h-3 absolute inset-0 text-gray-300`}
          />
          {/* Dolu yıldız */}
          {isFull && (
            <StarIcon
              className="w-3 h-3 absolute inset-0 text-yellow-400 fill-current"
            />
          )}
          {/* Yarı dolu yıldız */}
          {isHalf && (
            <StarIcon
              className="w-3 h-3 absolute inset-0 text-yellow-400 fill-current"
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          )}
        </div>
      );
    });
  };

  // Ürün detay sayfasını en hızlı açmak için prefetch yardımcıları
  const prefetchIfPossible = useCallback((href: string) => {
    try {
      const r: any = router as any;
      if (r && typeof r.prefetch === 'function') {
        r.prefetch(href);
      }
    } catch (_) {
      // router.prefetch bazı Next sürümlerinde olmayabilir; Link prefetch devreye girer
    }
  }, [router]);

  // Ürün kartına tıklama - Scroll pozisyonunu kaydet
  const handleProductClick = (e: React.MouseEvent, productSlug: string, productId: string) => {
    // Scroll pozisyonunu ve ürün ID'sini sessionStorage'a kaydet
    // URL'den sayfa tipini belirle (arama sayfası, kategori sayfası, markalar sayfası veya mağaza sayfası)
    if (typeof window !== 'undefined') {
      const scrollPosition = window.scrollY || window.pageYOffset;
      const currentPath = window.location.pathname;
      const baseSlug = getBaseSlug(productSlug);
      
      // Arama sayfası mı kontrol et
      if (currentPath.startsWith('/q')) {
        sessionStorage.setItem('searchScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('searchProductId', productId);
        sessionStorage.setItem('searchProductSlug', productSlug);
        sessionStorage.setItem('searchProductBaseSlug', baseSlug);
      } else if (currentPath.startsWith('/markalar/')) {
        // Markalar sayfası
        sessionStorage.setItem('brandScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('brandProductId', productId);
        sessionStorage.setItem('brandProductSlug', productSlug);
        sessionStorage.setItem('brandProductBaseSlug', baseSlug);
      } else if (currentPath.startsWith('/magaza/')) {
        // Mağaza sayfası
        sessionStorage.setItem('storeScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('storeProductId', productId);
        sessionStorage.setItem('storeProductSlug', productSlug);
        sessionStorage.setItem('storeProductBaseSlug', baseSlug);
      } else {
        // Kategori sayfası veya diğer sayfalar
        sessionStorage.setItem('categoryScrollPosition', scrollPosition.toString());
        sessionStorage.setItem('categoryProductId', productId);
        sessionStorage.setItem('categoryProductSlug', productSlug);
        sessionStorage.setItem('categoryProductBaseSlug', baseSlug);
      }
    }
  };

  // İlk görünen ürünlerin detay sayfalarını idle anda prefetch et (üstteki birkaç ürün)
  // Prefetch devre dışı bırakılmışsa bu mekanizmayı kullanma
  useEffect(() => {
    if (disablePrefetch || !products || products.length === 0) return;
    const top = products.slice(0, 6);
    const idle = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 200));
    idle(() => {
      top.forEach(p => prefetchIfPossible(createProductUrl(p.slug)));
    });
  }, [products, prefetchIfPossible, disablePrefetch]);

  const handleLike = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart icon
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
        // Unlike
        await removeFavorite(productId);
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        // Like
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

  // Mouse hareketi ile resim değiştirme
  const handleMouseMove = (productId: string, productImages: ProductImage[], e: React.MouseEvent<HTMLDivElement>) => {
    if (!productImages || productImages.length <= 1) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    
    const imageCount = productImages.length;
    const newIndex = Math.min(Math.floor(percentage * imageCount), imageCount - 1);
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: newIndex
    }));
  };

  // Yardımcı fonksiyonlar
  const COLOR_NAMES = ['siyah', 'beyaz', 'kırmızı', 'mavi', 'yeşil', 'sarı', 'pembe', 'mor', 'turuncu', 'gri', 'kahverengi', 'bej', 'gümüş', 'lacivert', 'çok renkli'];
  const COLOR_MAP: Record<string, string> = {
    'Siyah': '#000000',
    'FİLDİŞİ': '#F5F5DC',
    'Beyaz': '#FFFFFF',
    'Kırmızı': '#FF0000',
    'Mavi': '#0000FF',
    'Yeşil': '#008000',
    'Sarı': '#FFFF00',
    'Pembe': '#FFC0CB',
    'Mor': '#800080',
    'Turuncu': '#FFA500',
    'Gri': '#808080',
    'Kahverengi': '#A52A2A',
    'Bej': '#F5F5DC',
    'Gümüş': '#C0C0C0',
    'Çok Renkli': 'linear-gradient(45deg, #FF0000, #00FF00, #0000FF)'
  };

  const getColorCode = (colorName: string) => COLOR_MAP[colorName] || '#CCCCCC';

  const normalizeProductName = (name: string) => {
    if (!name) return '';
    let normalized = name.toLowerCase();
    COLOR_NAMES.forEach(color => {
      normalized = normalized.replace(new RegExp(`\\b${color}\\b`, 'gi'), '').trim();
    });
    normalized = normalized.replace(/\s+/g, ' ').trim();
    return normalized;
  };

  const findColorVariantProducts = (currentProduct: any) => {
    const variantProducts: Record<string, any> = {};

    const currentColor = currentProduct.variants?.find((v: any) => v.slug === 'renk');
    if (currentColor && currentProduct.images && currentProduct.images.length > 0) {
      variantProducts[currentColor.value_slug] = {
        product: currentProduct,
        image: currentProduct.images[0]?.url,
        colorName: currentColor.value_name
      };
    }

    const currentBaseName = normalizeProductName(currentProduct.name);
    const currentBaseSlug = getBaseSlug(currentProduct.slug);

    products.forEach((p: any) => {
      if (p.id === currentProduct.id) return;

      const pBaseName = normalizeProductName(p.name);
      const pBaseSlug = getBaseSlug(p.slug);

      const isSameProduct = 
        (currentProduct.parent_id && p.parent_id && currentProduct.parent_id === p.parent_id) ||
        (currentProduct.product_group_id && p.product_group_id && currentProduct.product_group_id === p.product_group_id) ||
        (currentProduct.variant_group_id && p.variant_group_id && currentProduct.variant_group_id === p.variant_group_id) ||
        (currentBaseName && pBaseName && currentBaseName === pBaseName && currentBaseName.length > 10) ||
        (currentBaseSlug && pBaseSlug && currentBaseSlug === pBaseSlug && currentBaseSlug.length > 20);

      if (isSameProduct) {
        const colorVariant = p.variants?.find((v: any) => v.slug === 'renk');
        if (colorVariant && p.images && p.images.length > 0) {
          variantProducts[colorVariant.value_slug] = {
            product: p,
            image: p.images[0]?.url,
            colorName: colorVariant.value_name
          };
        }
      }
    });

    return variantProducts;
  };

  const buildColorVariantData = (currentProduct: any) => {
    const colorVariants = currentProduct.variants?.filter((v: any) => v.slug === 'renk') || [];
    const colorVariantProducts = findColorVariantProducts(currentProduct);
    const allColorVariants = new Map<string, any>();

    colorVariants.forEach((variant: any) => {
      allColorVariants.set(variant.value_slug, {
        variant,
        product: colorVariantProducts[variant.value_slug]?.product || currentProduct,
        image: colorVariantProducts[variant.value_slug]?.image || null,
        colorName: variant.value_name
      });
    });

    Object.values(colorVariantProducts).forEach((item: any) => {
      if (!allColorVariants.has(item.product.variants?.find((v: any) => v.slug === 'renk')?.value_slug)) {
        const colorVariant = item.product.variants?.find((v: any) => v.slug === 'renk');
        if (colorVariant) {
          allColorVariants.set(colorVariant.value_slug, {
            variant: colorVariant,
            product: item.product,
            image: item.image,
            colorName: item.colorName
          });
        }
      }
    });

    return { colorVariants, colorVariantProducts, allColorVariants };
  };

  const openMobileVariantModal = (product: any) => {
    const { allColorVariants } = buildColorVariantData(product);
    const variantArray = Array.from(allColorVariants.values());
    if (variantArray.length <= 1) return;
    setMobileVariantModal({
      productName: product.name,
      variants: variantArray
    });
  };

  const closeMobileVariantModal = () => setMobileVariantModal(null);

  // Mouse enter/leave handlers
  const handleMouseEnter = (productId: string) => {
    setHoveredProduct(productId);
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: 0
    }));
  };

  const handleMouseLeave = (productId: string) => {
    setHoveredProduct(null);
    setCurrentImageIndex(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        Ürün bulunamadı
      </div>
    );
  }

  // Debug: Products array'ini kontrol et

  // Debug log for Q page products
  if (products.some(p => p.id.includes('karaca'))) {
  }

  return (
    <>
    <div className={`grid grid-cols-2 md:grid-cols-3 ${columnsPerRow === 4 ? 'lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4' : 'lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-5'} gap-1.5 sm:gap-2 lg:gap-2 xl:gap-2 2xl:gap-2 mt-6 pb-4 justify-items-center`}>
      {products.map((product, index) => {
        const isOutOfStock = product.status === 'out_of_stock' || product.status === 'inactive' || (product.stock !== undefined && product.stock === 0);
        return (
        <div 
          key={`${product.id}-${index}`}
          id={`product-${product.id}`}
          data-component-id={`product-${product.id}-${index}`}
          data-product-slug={product.slug}
          className={`product-card block bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 w-full ${isOutOfStock ? 'opacity-75' : ''}`}
        >
          <Link 
            href={createProductUrl(product.slug)}
            prefetch={!disablePrefetch}
            onMouseEnter={disablePrefetch ? undefined : () => prefetchIfPossible(createProductUrl(product.slug))}
            onTouchStart={disablePrefetch ? undefined : () => prefetchIfPossible(createProductUrl(product.slug))}
            onClick={(e) => handleProductClick(e, product.slug, product.id)}
            target={openInNewTabOnDesktop && isDesktopViewport ? '_blank' : undefined}
            rel={openInNewTabOnDesktop && isDesktopViewport ? 'noopener noreferrer' : undefined}
          >
            <div 
              className="relative aspect-[2/3] overflow-hidden rounded-t-lg p-1 group"
              onMouseMove={(e) => handleMouseMove(product.id, product.images, e)}
              onMouseEnter={() => handleMouseEnter(product.id)}
              onMouseLeave={() => handleMouseLeave(product.id)}
            >
            {(() => {
              // is_adult kontrolü - hem boolean hem string değerleri kontrol et
              const isAdult = product.is_adult === true || 
                             (product.is_adult !== undefined && String(product.is_adult).toLowerCase() === 'true') ||
                             isAdultCategory;
              
              // Debug: is_adult değerini kontrol et (sadece development'ta)
              if (process.env.NODE_ENV === 'development' && product.slug === 'deri-harness-fantezi-aksesuar-661708') {
             
              }
              
              return isAdult;
            })() ? (
              <Image
                src="/18+.png"
                alt="18+ Yaş Sınırı"
                fill
                className="object-contain bg-white"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                priority={false}
              />
            ) : product.images && product.images.length > 0 ? (
              (() => {
                // Hover durumunda mouse pozisyonuna göre resim seç
                const currentIndex = hoveredProduct === product.id 
                  ? (currentImageIndex[product.id] || 0)
                  : 0;
                const currentImage = product.images[currentIndex];
                
                return currentImage && currentImage.url ? (
                  <Image
                    src={currentImage.url}
                    alt={product.name}
                    fill
                    className={`object-contain transition-all duration-150 ${isOutOfStock ? 'grayscale' : ''}`}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                    priority={false}
                    loading="lazy"
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
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
                );
              })()
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
              
              // Kampanya badge'leri kaldırıldı - sadece fiyat bölümünde gösterilecek
              
              // Diğer badge'ler
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
              return badges.slice(0, 4).map((badge, index) => {
                // Normal badge'ler için ProductBadge component'i kullan
                return (
                  <ProductBadge 
                    key={`${product.id}-badge-${index}`}
                    type={badge.type as any} 
                    className={positions[index]} 
                  />
                );
              });
            })()}
            
            {/* Resim Sayısı Göstergesi - Hover'da görünür */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {hoveredProduct === product.id 
                  ? `${(currentImageIndex[product.id] || 0) + 1}/${product.images.length}`
                  : product.images.length
                }
              </div>
            )}

            {/* SVG Badge ve Renk Variant Modal - Sadece 1'den fazla renk bulunursa göster */}
            {(() => {
              const { allColorVariants } = buildColorVariantData(product);
              const variantArray = Array.from(allColorVariants.values());
              
              if (variantArray.length <= 1) return null;
              
              return (
                <>
                  {/* SVG Badge - Sağ Alt */}
                  <div className="absolute bottom-2 right-2 z-10 flex flex-col items-end gap-2">
                    <div 
                      className="hidden md:block"
                      onMouseEnter={() => setHoveredBadge(product.id)}
                      onMouseLeave={() => setHoveredBadge(null)}
                    >
                      <ProductBadgeSVG width={50} height={24} count={variantArray.length} />
                    </div>
                    <button
                      type="button"
                      className="md:hidden shadow-lg rounded-full overflow-hidden"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openMobileVariantModal(product);
                      }}
                    >
                      <ProductBadgeSVG width={50} height={24} count={variantArray.length} />
                    </button>
                  </div>

                  {/* Renk Variant Modal - Desktop Hover - Alt Kısımda */}
                  {hoveredBadge === product.id && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-b-lg z-20 hidden md:flex items-end justify-center p-4"
                      onMouseEnter={() => setHoveredBadge(product.id)}
                      onMouseLeave={() => setHoveredBadge(null)}
                    >
                      <div className="w-full max-w-full">
                        <h3 className="text-xs font-semibold text-gray-900 mb-3 text-left">
                          Farklı Renk Seçenekleri
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                          {variantArray.map((item: any, idx: number) => {
                            const colorCode = getColorCode(item.colorName);
                            const isGradient = item.colorName === 'Çok Renkli';
                            const hasImage = item.image;
                            
                            return (
                              <div
                                key={idx}
                                className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(createProductUrl(item.product.slug));
                                }}
                              >
                                {hasImage ? (
                                  <div className="w-12 h-16 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors overflow-hidden">
                                    <Image
                                      src={item.image}
                                      alt={item.colorName}
                                      width={48}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div
                                    className="w-12 h-16 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition-colors"
                                    style={{
                                      background: isGradient 
                                        ? 'linear-gradient(45deg, #FF0000, #00FF00, #0000FF)' 
                                        : colorCode
                                    }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            {/* Renk Sayısı Badge kaldırıldı - SVG ikon kullanılıyor */}
            
            {/* Stokta Yok Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Stokta Yok
                </div>
              </div>
            )}
            
            <button
              onClick={(e) => handleLike(product.id, e)}
              disabled={loadingFavorites.has(product.id)}
              className={`bg-white rounded-full p-1.5 sm:p-2 transition-all duration-200 ${
                loadingFavorites.has(product.id) ? 'opacity-50 cursor-wait' : ''
              }`}
              style={{ 
                position: 'absolute',
                top: '8px',
                right: '8px',
                zIndex: 20,
                minWidth: '28px',
                minHeight: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isInFavorites(product.id) ? (
                <HeartSolidIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 fill-current" />
              ) : (
                <HeartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              )}
            </button>
          </div>

          <div className="p-2 pb-2 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                {(() => {
                  // Debug: brand bilgisini kontrol et
                  if (product.id === '68c0996007d476f3f61041d2') {
                
                  }
                  
                  return product.brand && product.brand.name && (
                    <span className="font-bold text-gray-800">
                      {product.brand.name}{' '}
                    </span>
                  );
                })()}
                {product.name}
              </h3>

              {/* Yıldız Değerlendirme - Her zaman görünür */}
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {renderStars(product.average_rating ?? product.rating ?? 0)}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviewCount || product.review_count || 0})
                </span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex flex-col">
                  {isOutOfStock ? (
                    <>
                      <span className="text-lg font-semibold text-gray-500 line-through">
                        {new Intl.NumberFormat('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(product.price)} TL
                      </span>
                      <span className="text-xs text-red-600 font-medium">
                        Stokta Yok
                      </span>
                    </>
                  ) : product.campaign_type === 'buy_x_pay_y' ? (
                    /* Buy X Pay Y kampanyası - sadece orijinal fiyat ve badge */
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg font-semibold text-gray-900">
                        {new Intl.NumberFormat('tr-TR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }).format(product.price)} TL
                      </span>
                      {product.campaign_settings && (
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {product.campaign_settings.buy_quantity} Al {product.campaign_settings.pay_quantity} Öde
                        </div>
                      )}
                    </div>
                  ) : product.campaign_type === 'nth_product_discount' ? (
                    /* N. Ürün İndirimi kampanyası - sadece orijinal fiyat ve badge */
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.price)} TL
                        </span>
                      </div>
                      {product.campaign_settings && (
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-0.5 rounded text-xs font-semibold w-fit">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          {product.campaign_settings.nth_product}. Ürün %{product.campaign_settings.nth_discount_percentage} İndirim
                        </div>
                      )}
                    </div>
                  ) : product.campaign_type === 'price_discount' ? (
                    /* Tutar İndirimi kampanyası - orijinal fiyat, kampanya fiyatı ve badge */
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.original_price || product.price)} TL
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.campaign_price || product.price)} TL
                        </span>
                      </div>
                      {product.campaign_settings && (
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold w-fit">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          {product.campaign_settings.discount_amount} TL İndirim
                        </div>
                      )}
                    </div>
                  ) : (product.campaign_price && product.original_price && product.campaign_price < product.original_price) || (product.discount_percentage && product.discount_percentage > 0) ? (
                    /* Yüzde indirimi kampanyası - çizili fiyat, kampanya fiyatı ve badge */
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.original_price || product.price)} TL
                        </span>
                        <span className="text-lg font-semibold text-green-600">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.campaign_price || product.price)} TL
                        </span>
                      </div>
                      {product.discount_percentage && product.discount_percentage > 0 && (
                        <div className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold w-fit">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                          %{product.discount_percentage} İndirim
                        </div>
                      )}
                    </div>
                  ) : product.original_price && product.original_price > product.price ? (
                    /* İndirimli fiyat gösterimi - Orijinal ve İndirimli Fiyat Birlikte */
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 line-through">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.original_price)} TL
                        </span>
                        <span className="text-lg font-semibold text-gray-900">
                          {new Intl.NumberFormat('tr-TR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          }).format(product.price)} TL
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-0.5 rounded text-xs font-semibold w-fit">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        %{Math.round(((product.original_price! - product.price) / product.original_price!) * 100)} İndirim
                      </div>
                    </div>
                  ) : (
                    /* Normal fiyat gösterimi */
                    <span className="text-lg font-semibold text-gray-900">
                      {new Intl.NumberFormat('tr-TR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
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
    })}
    </div>
    {mobileVariantModal && (
      <div className="fixed inset-0 z-50 flex items-end md:hidden">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={closeMobileVariantModal}
        />
        <div className="relative bg-white w-full rounded-t-3xl shadow-2xl px-4 pt-4 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Farklı Renk Seçenekleri ({mobileVariantModal.variants.length})
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {mobileVariantModal.productName}
              </p>
            </div>
            <button
              type="button"
              onClick={closeMobileVariantModal}
              className="p-2 rounded-full bg-gray-100 text-gray-600"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {mobileVariantModal.variants.map((variantItem: any, idx: number) => {
              const colorCode = getColorCode(variantItem.colorName);
              const isGradient = variantItem.colorName === 'Çok Renkli';
              const hasImage = variantItem.image;
              return (
                <button
                  key={idx}
                  type="button"
                  className="flex flex-col items-center min-w-[80px] max-w-[80px]"
                  onClick={() => {
                    router.push(createProductUrl(variantItem.product.slug));
                    closeMobileVariantModal();
                  }}
                >
                  {hasImage ? (
                    <div className="w-16 h-20 rounded-xl border border-gray-200 overflow-hidden">
                      <Image
                        src={variantItem.image}
                        alt={variantItem.colorName}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="w-16 h-20 rounded-xl border border-gray-200"
                      style={{
                        background: isGradient
                          ? 'linear-gradient(45deg, #FF0000, #00FF00, #0000FF)'
                          : colorCode
                      }}
                    />
                  )}
                  <span className="text-xs text-gray-700 mt-1 text-center line-clamp-1">
                    {variantItem.colorName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    )}
    </>
  );
});

export default ProductGrid; 
