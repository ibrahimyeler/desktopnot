"use client";

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/layout/Header';
import ScrollToTop from '@/components/ui/ScrollToTop';
import PromotionLinks from '@/components/Home/PromotionLinks';
import PopularCategories from '@/components/Home/PopularCategories';
import { useAuthOptional } from './context/AuthContext';
import QuickLinks from '@/components/Home/QuickLinks';
import CookiePopup from '@/components/common/CookiePopup';
import SeoContentSection from '@/components/Home/SeoContentSection';

const PopularProducts = dynamic(() => import('@/components/Home/PopularProducts'), {
  loading: () => <div className="h-[320px] w-full rounded-2xl bg-gray-100 animate-pulse" />,
});

const MultipleBanners = dynamic(() => import('@/components/store/MultipleBanners'), {
  loading: () => <div className="h-[280px] w-full rounded-2xl bg-gray-100 animate-pulse" />,
});

const BrandSlider = dynamic(() => import('@/components/Home/BrandSlider'), {
  loading: () => <div className="h-[180px] w-full rounded-2xl bg-gray-100 animate-pulse" />,
});

const SlidingBanner = dynamic(() => import('@/components/Home/SlidingBanner'), {
  loading: () => <div className="h-[420px] w-full rounded-2xl bg-gray-100 animate-pulse" />,
});

interface Item {
  slug: string;
  value: any;
}

interface Field {
  slug: string;
  items: Item[];
}

interface Section {
  id: string;
  slug: string;
  fields: Field[];
}

interface HomeClientProps {
  sections: Section[];
}

function HomeClient({ sections: initialSections }: HomeClientProps) {
  // useAuthOptional kullan - AuthProvider yoksa undefined döner
  const authContext = useAuthOptional();
  const { showNotificationModal = false, setShowNotificationModal = () => {} } = authContext || {};

  const uniqueInitialSections = useMemo(() => {
    const seen = new Set<string>();
    return (initialSections || []).filter((section) => {
      if (!section?.id || seen.has(section.id)) return false;
      seen.add(section.id);
      return true;
    });
  }, [initialSections]);

  const sectionIdSetRef = useRef<Set<string>>(new Set(uniqueInitialSections.map((section) => section.id)));

  // Sections state (pagination kaldırıldı - tek seferde 100 ürün çekiliyor)
  const [allSections, setAllSections] = useState<Section[]>(uniqueInitialSections);

  useEffect(() => {
    setAllSections(uniqueInitialSections);
    sectionIdSetRef.current = new Set(uniqueInitialSections.map((section) => section.id));
  }, [uniqueInitialSections]);

  // Next.js scroll restoration'ı devre dışı bırak
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Browser'ın otomatik scroll restoration'ını devre dışı bırak
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    }
  }, []);

  // Scroll pozisyonunu koruma için useEffect - Mobilde devre dışı
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) return;

    const restoreScrollPosition = () => {
      const logoClickScrollToTop = sessionStorage.getItem('logoClickScrollToTop');
      if (logoClickScrollToTop === 'true') {
        sessionStorage.removeItem('logoClickScrollToTop');
        window.scrollTo({ top: 0, behavior: 'auto' });
        return;
      }

      const savedScrollData = sessionStorage.getItem('homeScrollData');
      if (savedScrollData) {
        try {
          const { componentId } = JSON.parse(savedScrollData);
          const targetComponent = componentId
            ? document.querySelector(`[data-component-id="${componentId}"]`)
            : null;
          if (targetComponent) {
            const rect = targetComponent.getBoundingClientRect();
            const scrollTop = window.pageYOffset + rect.top - 100;
            window.scrollTo({ top: scrollTop, behavior: 'auto' });
            return;
          }
        } catch (_error) {
          // ignore
        }
      }

      const savedScrollPosition = sessionStorage.getItem('homeScrollPosition');
      if (savedScrollPosition) {
        window.scrollTo({
          top: parseInt(savedScrollPosition, 10),
          behavior: 'auto',
        });
      }
    };

    const scheduleRestore = () => {
      requestAnimationFrame(() => {
        setTimeout(restoreScrollPosition, 250);
      });
    };

    const handleBeforeUnload = () => {
      sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
    };

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const componentContainer = target?.closest('[data-component-id]');
      const componentId = componentContainer?.getAttribute('data-component-id');

      if (componentId) {
        const scrollData = {
          position: window.scrollY,
          componentId,
          timestamp: Date.now(),
        };
        sessionStorage.setItem('homeScrollData', JSON.stringify(scrollData));
      }

      const link = target?.closest('a');
      if (link && link.getAttribute('href') && !link.getAttribute('href')!.includes('#')) {
        sessionStorage.setItem('homeScrollPosition', window.scrollY.toString());
      }
    };

    scheduleRestore();

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const [showCookiePopup, setShowCookiePopup] = useState(false);

  // Çerez tercihlerini kontrol et
  useEffect(() => {
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    const cookieAcceptedSession = sessionStorage.getItem('cookieAcceptedSession');
    
    // Eğer kullanıcı daha önce tercih yapmamışsa popup'ı göster
    if (!cookieAccepted && !cookieAcceptedSession) {
      setShowCookiePopup(true);
    }
  }, []);

  // Pagination kaldırıldı - tek seferde 100 ürün çekiliyor

  const normalizeProduct = useCallback((product: any) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    discounted_price: product.discounted_price,
    stock: product.stock,
    status: product.status,
    rating: product.rating,
    average_rating: product.average_rating,
    review_count: product.review_count,
    medias: product.medias?.slice(0, 3),
    seller: product.seller
      ? {
          id: product.seller.id,
          name: product.seller.name,
        }
      : null,
    brand: product.brand
      ? {
          name: product.brand.name,
          slug: product.brand.slug,
        }
      : null,
    badges: product.badges
      ? {
          ...product.badges,
          free_shipping:
            product.badges.free_shipping ??
            product.badges.cargo_free ??
            product.badges.freeShipping ??
            false,
          cargo_free:
            product.badges.cargo_free ??
            product.badges.free_shipping ??
            product.badges.freeShipping ??
            false,
        }
      : undefined,
  }), []);

  const processSelectedProducts = useCallback(
    (value: any[]) => {
      if (!Array.isArray(value)) return [];
      return value
        .slice(0, 70)
        .map(normalizeProduct)
        .sort((a, b) => {
          const stockA = a.stock || 0;
          const stockB = b.stock || 0;
          if (stockA === 0 && stockB > 0) return -1;
          if (stockA > 0 && stockB === 0) return 1;
          return a.id.localeCompare(b.id);
        });
    },
    [normalizeProduct]
  );

  // sectionComponentMap'i useMemo ile oluştur - allSections'a erişim için
  const sectionComponentMap: Record<string, (section: Section, index?: number) => React.ReactNode> = React.useMemo(() => ({
    "sliding-banner": (section: Section, index?: number) => {
      // Left sliders verilerini çıkar
      const leftSlidersField = (section.fields || []).find((f: Field) => f.slug === 'left-sliders');
      const leftSliders = leftSlidersField?.items || [];
      
      // Campaign products verilerini çıkar
      const campaignProductsField = (section.fields || []).find((f: Field) => f.slug === 'campaign-products');
      const campaignProducts = campaignProductsField?.items?.[0]?.value || [];
      
      // Campaign background image
      const campaignBgField = (section.fields || []).find((f: Field) => f.slug === 'campaign-background-image');
      const campaignBackgroundImage = campaignBgField?.items?.[0]?.value;
      
      return (
        <SlidingBanner 
          leftSliders={leftSliders}
          campaignProducts={campaignProducts}
          campaignBackgroundImage={campaignBackgroundImage}
        />
      );
    },
    "quick-links": (section: Section) => {
      const links = (section.fields || [])
        .filter((field: Field) => field.slug === 'link')
        .map((field: Field) => ({
          title: (field.items || []).find((item: Item) => item.slug === 'link-title')?.value || '',
          color: (field.items || []).find((item: Item) => item.slug === 'link-color')?.value || '#ffffff',
          link: (field.items || []).find((item: Item) => item.slug === 'link-link')?.value || '',
          textColor: (field.items || []).find((item: Item) => item.slug === 'link-text-color')?.value || '#000000'
        }))
        .filter((link) => link.title && link.link);
      return <QuickLinks links={links} />;
    },
    "promotional-links": (section: Section) => {
      const links = (section.fields || []).filter((field: Field) => field.slug === 'promotional-links')
        .map((field: Field) => ({
          title: (field.items || []).find((item: Item) => item.slug === 'link-title')?.value || '',
          color: (field.items || []).find((item: Item) => item.slug === 'link-color')?.value || '#ffffff',
          link: (field.items || []).find((item: Item) => item.slug === 'link-link')?.value || '',
          image: (field.items || []).find((item: Item) => item.slug === 'link-picture')?.value || ''
        }));
      return <PromotionLinks links={links} />;
    },
    "product-list": (section: Section, index?: number) => {
      const title = (section.fields || []).find((f: Field) => f.slug === 'product-list-title')
        ?.items?.[0]?.value || 'Ürün Listesi';
      
      const products = (section.fields || []).find((f: Field) => f.slug === 'selected-products')
        ?.items?.[0]?.value || [];
      
      const bgColor = (section.fields || []).find((f: Field) => f.slug === 'background-color')
        ?.items?.find((item: any) => item.slug === 'bg-color')?.value;
      
      // API'den gelen ürünleri işle
      const processedProducts = products.map((product: any) => ({
        ...product,
        badges: product.badges
          ? {
              ...product.badges,
              free_shipping:
                product.badges.free_shipping ??
                product.badges.cargo_free ??
                product.badges.freeShipping ??
                false,
              cargo_free:
                product.badges.cargo_free ??
                product.badges.free_shipping ??
                product.badges.freeShipping ??
                false,
            }
          : undefined,
        // API'den gelen gerçek değerleri kullan
        stockProgress: product.stockProgress || 0,
        stock: product.stock,
        status: product.status,
        // API'den average_rating ve review_count geliyor, bunları öncelikli kullan
        rating: product.average_rating ?? product.rating ?? 0,
        average_rating: product.average_rating ?? 0,
        reviewCount: product.review_count ?? product.reviewCount ?? 0,
        review_count: product.review_count ?? 0
      }))
      .sort((a: any, b: any) => {
        // Stokta olmayan ürünler üstte
        const stockA = a.stock || 0;
        const stockB = b.stock || 0;
        
        if (stockA === 0 && stockB > 0) return -1;
        if (stockA > 0 && stockB === 0) return 1;
        
        // Deterministik sıralama için ürün ID'sine göre sırala
        return a.id.localeCompare(b.id);
      });
      
      const uniqueId = `product-list-${index || 0}`;
      
      return (
        <div className="mb-2">
          <PopularProducts 
            title={title}
            products={processedProducts}
            backgroundColor={bgColor}
            apiResponse={{ data: { sections: [section] } }}
            uniqueId={uniqueId}
          />
        </div>
      );
    },
    "category-list": (section: Section) => {
      const categories = (section.fields || [])
        .filter((field: Field) => field.slug === 'category')
        .map((field: Field) => ({
          name: (field.items || []).find((item: Item) => item.slug === 'category-title')?.value || '',
          slug: (field.items || []).find((item: Item) => item.slug === 'category-slug')?.value || '',
          color: (field.items || []).find((item: Item) => item.slug === 'category-color')?.value || '',
          image: (field.items || []).find((item: Item) => item.slug === 'category-image')?.value || ''
        }))
        .filter((cat) => cat.name);
      return <PopularCategories categories={categories} />;
    },
    "multiple-banner": (section: Section, index?: number) => {
      const banners = (section.fields || [])
        .filter((field: Field) => field.slug === 'banner')
        .map((field: Field) => ({
          image: (field.items || []).find((item: Item) => item.slug === 'banner-image')?.value || '',
          title: (field.items || []).find((item: Item) => item.slug === 'banner-title')?.value || '',
          link: (field.items || []).find((item: Item) => item.slug === 'banner-link')?.value || ''
        }))
        .filter((banner) => banner.image);
      
      // İlk multiple-banner section'ını tespit et
      const isFirstBanner = index === 0 || !allSections.some((s: Section, i: number) => i < (index || 0) && s.slug === 'multiple-banner');
      
      return <MultipleBanners banners={banners} isFirstBanner={isFirstBanner} />;
    },
    "brand-list": (section: Section, index?: number) => {
      const brandsValue = (section.fields || [])
        .find((field: Field) => field.slug === 'selected-brands')
        ?.items?.[0]?.value;
      
      // Eğer value bir JSON string ise parse et
      let parsedBrands = brandsValue;
      if (typeof brandsValue === 'string') {
        try {
          parsedBrands = JSON.parse(brandsValue);
        } catch (_error) {
          parsedBrands = [];
        }
      }
      
      const brands = Array.isArray(parsedBrands)
        ? parsedBrands.map((brand: any) => ({
            id: brand.id,
            name: brand.name,
            slug: brand.slug,
            image: brand.image ? { url: brand.image.url } : undefined
          }))
        : [];
      return <BrandSlider brands={brands} uniqueId={`brands-${index || 0}`} />;
    },
    // "sana-ozel-urunler": (section: Section, index?: number) => {
    //   const title = (section.fields || []).find((f: Field) => f.slug === 'sana-ozel-title')
    //     ?.items?.[0]?.value || 'Son Gezdiğiniz Ürünler';
      
    //   const bgColor = (section.fields || []).find((f: Field) => f.slug === 'background-color')
    //     ?.items?.find((item: any) => item.slug === 'bg-color')?.value;
      
    //   const maxProducts = (section.fields || []).find((f: Field) => f.slug === 'max-products')
    //     ?.items?.[0]?.value || 15;
      
    //   return (
    //     <div className="mb-2">
    //       <SanaOzelUrunler 
    //         title={title}
    //         backgroundColor={bgColor}
    //         maxProducts={maxProducts}
    //         showHeader={true}
    //         uniqueId={`sana-ozel-${index || 0}`}
    //       />
    //     </div>
    //   );
    // }
  }), [allSections]);

  const handlePreferencesSet = () => {
    setShowNotificationModal(false);
  };

  const handleCookieAccept = () => {
    // LocalStorage'a kabul durumunu kaydet
    localStorage.setItem('cookieAccepted', 'true');
    setShowCookiePopup(false);
  };

  const handleCookieReject = () => {
    // LocalStorage'a red durumunu kaydet
    localStorage.setItem('cookieAccepted', 'false');
    setShowCookiePopup(false);
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Header onPreferencesSet={handlePreferencesSet} showBackButton={true} />
      
      <main 
        className="flex-grow pb-16 sm:pb-0 overflow-x-hidden pt-24 md:pt-0"
      >
        <div className="w-full overflow-x-hidden">
          {/* Ana İçerik */}
          <div className="w-full mx-auto px-0 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 max-w-full sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] pt-0 sm:pt-6 md:pt-8 overflow-x-hidden">
            <div className="flex flex-col space-y-0 sm:space-y-3 md:space-y-4 lg:space-y-5">
              <div className="w-full">
                {(allSections || []).map((section, index) => {
                  const renderFn = sectionComponentMap[section.slug];
                  // Unique key oluştur (section.id + index)
                  const uniqueKey = `${section.id}-${index}`;
                  
                  // SlidingBanner, MultipleBanner ve PromotionLinks için özel işlem - container dışında render et (tam genişlik)
                  if ((section.slug === 'sliding-banner' || section.slug === 'multiple-banner' || section.slug === 'promotional-links') && renderFn) {
                    return (
                      <div
                        key={uniqueKey}
                        data-component-id={`section-${section.slug}-${index}`}
                        className={section.slug === 'sliding-banner' ? "-mt-4 sm:mt-0 lg:-mt-16 lg:-mb-8" : ""}
                      >
                        {renderFn(section, index)}
                      </div>
                    );
                  }

                  if (renderFn) {
                    return (
                      <div
                        key={uniqueKey}
                        data-component-id={`section-${section.slug}-${index}`}
                      >
                        {renderFn(section, index)}
                      </div>
                    );
                  }

                  return null;
                })}

                {/* Pagination kaldırıldı - tek seferde 100 ürün çekiliyor */}

                {/* Eğer hiç banner yoksa, en üste ekle */}
                {/* {(!sections || sections.length === 0 || !sections.some(s => s.slug === 'multiple-banner')) && (
                  <div data-component-id="fallback-sana-ozel">
                    <SanaOzelUrunler 
                      title="Son Gezdiğiniz Ürünler"
                      backgroundColor="#ffffff"
                      maxProducts={15}
                      showHeader={true}
                      uniqueId="fallback-sana-ozel"
                    />
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* SEO Content Section - Footer Üstü */}
      <SeoContentSection />
      
      {/* Footer Öncesi Boşluk - Mobil Optimizasyonu */}
      <div className="h-4 sm:h-6 md:h-8 lg:h-10"></div>
      <ScrollToTop />
      
      {/* Çerez Popup */}
      {showCookiePopup && (
        <CookiePopup 
          onAccept={handleCookieAccept}
          onReject={handleCookieReject}
        />
      )}

    </div>
  );
}

export default HomeClient; 
