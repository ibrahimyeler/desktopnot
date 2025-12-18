"use client"
import React, { useEffect, useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import StoreHeader from '@/components/store/StoreHeader';
import StoreNavBar from '@/components/store/StoreNavBar';
import SellerProfile from '@/components/store/SellerProfile';
import ProductListSection from '@/components/store/ProductListSection';
import AllProductsSection from '@/components/store/AllProductsSection';
import BannerWithReviews from '@/components/store/BannerWithReviews';
import VisualReviewGrid from '@/components/store/VisualReviewGrid';
import FlashProductsSection from '@/components/store/FlashProductsSection';
import CampaignListSection from '@/components/store/CampaignListSection';
import MoreProductsButton from '@/components/store/MoreProductsButton';
import CategoryListTwoColumn from '@/components/store/CategoryListTwoColumn';
import SingleBanner from '@/components/store/SingleBanner';
import MultipleBanner from '@/components/store/MultipleBanner';
import CategoryGrid from '@/components/store/CategoryGrid';
import { Product } from '@/types/product';
import { API_V1_URL } from '@/lib/config';

interface Seller {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  point?: number;
  follower_count?: number;
  email: string;
  tax_number: string;
  phone: string;
  status: string;
  accept_terms: boolean;
  reference_code: string;
  company_type: string;
  category_sold: string;
  timeOnPlatform?: string;
  location?: string;
  corporateInvoice?: string;
  avgShippingTime?: string;
  avgResponseTime?: string;
  rating?: number;
  totalReviews?: number;
  totalComments?: number;
  ratingDistribution?: {
    [key: number]: number;
  };
  productReviews?: {
    rating: number;
    totalReviews: number;
    totalComments: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  sellerReviews?: {
    rating: number;
    totalReviews: number;
    totalComments: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  photoReviews?: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
  sampleReviews?: Array<{
    id: string;
    username: string;
    date: string;
    rating: number;
    comment: string;
    likes: number;
  }>;
  shipping_policy: {
    general: {
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
      carrier: string;
    };
    custom: Record<string, {
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
      carrier: string;
      city: {
        name: string;
        slug: string;
        country_id: string;
        updated_at: string;
        created_at: string;
        id: string;
      };
    }>;
  };
  addresses: Array<{
    country: {
      name: string;
      code: string;
      slug: string;
      id: string;
    };
    city: {
      name: string;
      slug: string;
      id: string;
    };
    district: {
      name: string;
      slug: string;
      id: string;
    };
    neighborhood: {
      name: string;
      slug: string;
      id: string;
    };
    title: string;
    details: string;
    id: string;
  }>;
}

interface Section {
  id: string;
  slug: string;
  fields: Field[];
}

interface Field {
  slug: string;
  items: Item[];
}

interface Item {
  slug: string;
  value: string;
}

interface Banner {
  image: string;
  title: string;
  link: string;
}

interface StorePageClientProps {
  slug: string;
  initialSeller: Seller | null;
  initialSections: Section[];
  initialHeaderSection: Section | null;
  initialSharedProducts: Product[];
}

const API_BASE = API_V1_URL;

export default function StorePageClient({ 
  slug, 
  initialSeller, 
  initialSections, 
  initialHeaderSection, 
  initialSharedProducts 
}: StorePageClientProps) {
  const [loading, setLoading] = useState(!initialSeller);
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [seller, setSeller] = useState<Seller | null>(initialSeller);
  const [headerSection, setHeaderSection] = useState<Section | null>(initialHeaderSection);
  const [sharedProducts, setSharedProducts] = useState<Product[]>(initialSharedProducts);
  const [activeTab, setActiveTab] = useState('home');
  const [showSellerProfile, setShowSellerProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Arama çubuğu için handler
  const handleSearchClick = () => {
    // Arama modalı veya sayfası açılabilir
  };

  // fetchStore fonksiyonunu useCallback ile optimize et
  const fetchStore = useCallback(async () => {
    if (!slug) {
      setLoading(false);
      setSections([]);
      setSeller(null);
      setHeaderSection(null);
      setSharedProducts([]);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/stores/sections/${slug}`);
      const data = await res.json();
      
      if (data.meta.status === 'success' && data.data) {
        // Seller verisi kontrolü
        if (data.data.seller) {
          setSeller(data.data.seller);
        } else {
          setSeller(null);
        }

        // Sections verisi kontrolü
        if (Array.isArray(data.data.sections)) {
          setSections(data.data.sections);
          const headerSec = data.data.sections.find((section: Section) => section.slug === 'header');
          setHeaderSection(headerSec || null);

          // Ürünleri parse et
          const productListSection = data.data.sections.find((section: Section) => section.slug === 'product-list');
          
          if (productListSection) {
            const productsValue = productListSection?.fields.find((f: Field) => f.slug === 'selected-products')?.items?.[0]?.value;
            
            // Eğer value bir string ise JSON parse et, değilse boş array kullan
            const parsedProducts = typeof productsValue === 'string' 
              ? JSON.parse(productsValue) as Product[]
              : Array.isArray(productsValue) 
                ? productsValue 
                : [];
                
            setSharedProducts(parsedProducts);
          } else {
            setSharedProducts([]);
          }
        } else {
          setSections([]);
          setHeaderSection(null);
          setSharedProducts([]);
        }
      } else {
        setSections([]);
        setSeller(null);
        setHeaderSection(null);
        setSharedProducts([]);
      }
    } catch (e) {
      setSections([]);
      setSeller(null);
      setHeaderSection(null);
      setSharedProducts([]);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Client-side data fetching (if initial data not available)
  useEffect(() => {
    if (!initialSeller) {
      fetchStore();
    }
  }, [fetchStore, initialSeller]);

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] bg-gradient-to-br from-orange-50 to-white rounded-lg sm:rounded-2xl border border-orange-100 p-4 sm:p-8 mx-2 sm:mx-0">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h2 className="text-lg sm:text-2xl font-bold text-black mb-2 text-center">Mağaza Bulunamadı</h2>
        <p className="text-sm sm:text-base text-black/80 text-center leading-relaxed px-2">Aradığınız mağaza mevcut değil veya kaldırılmış olabilir.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[250px] sm:min-h-[300px] mx-2 sm:mx-0">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] sm:min-h-[300px] bg-gradient-to-br from-orange-50 to-white rounded-lg sm:rounded-2xl border border-orange-100 p-4 sm:p-8 mx-2 sm:mx-0">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-400 mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
        <h2 className="text-lg sm:text-2xl font-bold text-black mb-2 text-center">Mağaza Bulunamadı</h2>
        <p className="text-sm sm:text-base text-black/80 text-center leading-relaxed px-2">Aradığınız mağaza mevcut değil veya kaldırılmış olabilir.</p>
      </div>
    );
  }

  if (!headerSection) {
    // Mağaza tasarımı yoksa tüm ürünleri göster
    const minimalHeaderSection = {
      id: 'minimal-header',
      slug: 'header',
      fields: []
    };
    
    return (
      <div className="bg-white"> 
        <div className="md:hidden">
          <Header 
            showBackButton={true} 
            onBackClick={() => window.history.back()} 
          />
        </div>

        {/* Mobil StoreHeader - Normal flow'da, tam genişlik */}
        <div className="md:hidden w-screen relative left-1/2 right-1/2 -translate-x-1/2 pt-20">
          <StoreHeader 
            seller={seller} 
            headerSection={minimalHeaderSection} 
            onSellerProfileClick={() => setShowSellerProfile(true)}
            onSearchClick={handleSearchClick}
          />
        </div>

        {/* İçerik */}
        <div className="max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-0 md:pt-8 md:py-8 sm:py-12 lg:py-16 xl:py-20">
          {/* Desktop fallback header - Container içinde, normal StoreHeader ölçülerinde */}
          <div className="hidden md:block">
            <StoreHeader 
              seller={seller} 
              headerSection={minimalHeaderSection} 
              onSellerProfileClick={() => setShowSellerProfile(true)}
              onSearchClick={handleSearchClick}
            />
          </div>
          {showSellerProfile && (
            <SellerProfile 
              seller={seller} 
              isVisible={showSellerProfile} 
              onClose={() => setShowSellerProfile(false)} 
            />
          )}
          <div className="w-full mt-5">
            <AllProductsSection 
              sellerId={seller.id} 
              onSearch={setSearchQuery}
              searchQuery={searchQuery}
              selectedCategorySlug={selectedCategory}
            />
          </div>
        </div>
      </div>
    );
  }

  const sectionComponentMap: Record<string, (section: Section, storeForHeader?: Seller) => React.ReactNode> = {
    "header": () => <StoreHeader 
      seller={seller} 
      headerSection={headerSection} 
      onSellerProfileClick={() => {
        setShowSellerProfile(true);
      }}
      onSearchClick={handleSearchClick}
    />,
    "category-list": (section: Section) => {
      const categories = section.fields
        .filter((field: Field) => field.slug === 'category')
        .map((field: Field, i: number) => {
          return {
            id: i,
            name: field.items.find((item: Item) => item.slug === 'category-title')?.value || '',
            slug: field.items.find((item: Item) => item.slug === 'category-slug')?.value || '',
            color: field.items.find((item: Item) => item.slug === 'category-color')?.value || '#000000',
            image: field.items.find((item: Item) => item.slug === 'category-image')?.value || '',
          };
        });
      return <CategoryGrid 
        categories={categories} 
        onCategoryClick={(categorySlug) => {
          setSelectedCategory(categorySlug);
          setActiveTab('all-products');
        }}
      />;
    },
    "single-banner": (section: Section) => <SingleBanner section={section} />,
    "multiple-banner": (section: Section) => {
      const banners = section.fields
        .filter((field: Field) => field.slug === 'banner')
        .map((field: Field) => ({
          image: field.items.find((item: Item) => item.slug === 'banner-image')?.value || '',
          title: field.items.find((item: Item) => item.slug === 'banner-title')?.value || '',
          link: field.items.find((item: Item) => item.slug === 'banner-link')?.value || ''
        }))
        .filter((banner: Banner) => banner.image);
      return <MultipleBanner banners={banners} />;
    },
    "product-list": (section: Section) => {
      const title = section.fields.find((f: Field) => f.slug === 'product-list-title')?.items?.[0]?.value || 'Ürünler';
      return <ProductListSection title={title} products={sharedProducts} />;
    },
    "banner-with-reviews": () => <BannerWithReviews />,
    "visual-review-grid": () => <VisualReviewGrid />,
    "flash-products": () => <FlashProductsSection />,
    "campaign-list": () => <CampaignListSection />,
    "more-products": (section: Section) => {
      const title = section.fields.find((f: Field) => f.slug === 'more-products-title')?.items?.[0]?.value || 'Daha Fazla Ürün';
      return <MoreProductsButton title={title} products={sharedProducts} />;
    },
    "double-category-list": (section: Section) => {
      const categories = section.fields
        .filter((field: Field) => field.slug === 'category')
        .map((field: Field, i: number) => ({
          id: i,
          name: field.items.find((item: Item) => item.slug === 'category-title')?.value || '',
          slug: field.items.find((item: Item) => item.slug === 'category-slug')?.value || '',
          color: field.items.find((item: Item) => item.slug === 'category-color')?.value || '',
          image: field.items.find((item: Item) => item.slug === 'category-image')?.value || '',
        }));
      return <CategoryListTwoColumn 
        categories={categories} 
        onCategoryClick={(categorySlug) => {
          setSelectedCategory(categorySlug);
          setActiveTab('all-products');
        }}
      />;
    },
  };

  return (
    <div className="bg-white"> 
      {/* Mobil Header - Container dışında tam genişlik */}
            <div className="md:hidden">
              <Header 
                showBackButton={true} 
                onBackClick={() => window.history.back()} 
        />
      </div>
      
      {/* StoreHeader - Container dışında tam genişlik (mobilde) - Header'ın hemen altında, padding-top ile boşluk */}
      {(() => {
        const headerSection = sections.find(s => s.slug === 'header');
        // headerSection yoksa bile seller varsa fallback StoreHeader render et
        if (seller && sectionComponentMap['header']) {
          // headerSection yoksa boş bir section objesi oluştur
          const sectionToRender = headerSection || {
            id: 'fallback-header',
            slug: 'header',
            fields: []
          } as Section;
          
          // headerSection yoksa (tasarım yapılmamış) - normal StoreHeader ile aynı şekilde göster
          return (
            <div 
              className="md:hidden w-screen relative left-1/2 right-1/2 -translate-x-1/2 pt-20"
            >
              {sectionComponentMap['header'](sectionToRender)}
              <div className="mb-4">
                <StoreNavBar 
                  onTabChange={setActiveTab} 
                  activeTab={activeTab} 
                />
              </div>
            </div>
          );
        }
        return null;
      })()}
      
      <div className="max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-0 md:pt-0 pb-8 sm:pb-12 lg:pb-16 xl:pb-20 overflow-x-hidden">
        {activeTab === 'home' ? (
          <>
            <div className="space-y-0 md:space-y-4 sm:md:space-y-6 lg:space-y-8 xl:space-y-12">
            {/* Desktop'ta header section yoksa fallback StoreHeader göster */}
            {(() => {
              const headerSection = sections.find(s => s.slug === 'header');
              if (!headerSection && seller && sectionComponentMap['header']) {
                const fallbackSection = {
                  id: 'fallback-header',
                  slug: 'header',
                  fields: []
                } as Section;
                
                return (
                  <div key="fallback-header-desktop" className="hidden md:block -mt-[60px] md:-mt-[50px] lg:-mt-[55px] xl:-mt-[60px] py-4 md:py-6 lg:py-8">
                    {sectionComponentMap['header'](fallbackSection)}
                    <StoreNavBar 
                      onTabChange={setActiveTab} 
                      activeTab={activeTab} 
                    />
                  </div>
                );
              }
              return null;
            })()}
            
            {sections.map((section) => {
              // Header section'ı mobilde zaten render edildi, atla
              if (section.slug === 'header') {
                // Desktop'ta header'ı göster
                const renderFn = sectionComponentMap[section.slug];
                if (renderFn) {
                  return (
                    <div key={section.id} className="hidden md:block py-4 md:py-6 lg:py-8">
                      {renderFn(section)}
                      <StoreNavBar 
                        onTabChange={setActiveTab} 
                        activeTab={activeTab} 
                      />
                    </div>
                  );
                }
                return null;
              }
              
              const renderFn = sectionComponentMap[section.slug];
              if (renderFn) {
                return (
                  <React.Fragment key={section.id}>
                    {renderFn(section)}
                    {/* Header section'ından sonra SellerProfile'ı göster */}
                    {section.slug === 'header' && showSellerProfile && (
                      <SellerProfile 
                        seller={{
                          ...seller,
                          // Dinamik veriler (API'den gelecek, şimdilik örnek veriler)
                          timeOnPlatform: seller.timeOnPlatform || '5 Yıl',
                          location: seller.addresses?.[0]?.city?.name || 'İstanbul',
                          corporateInvoice: seller.company_type === 'corporate' ? 'Uygun' : 'Uygun Değil',
                          avgShippingTime: `${seller.shipping_policy?.general?.delivery_time || 24} Saat`,
                          avgResponseTime: '2-3 Saat',
                          rating: seller.point ? seller.point / 20 : 4.3, // point 100 üzerinden, rating 5 üzerinden
                          totalReviews: seller.totalReviews || 1250,
                          totalComments: seller.totalComments || 890,
                          ratingDistribution: seller.ratingDistribution || {
                            5: 850,
                            4: 250,
                            3: 100,
                            2: 30,
                            1: 20
                          },
                          // Ürün değerlendirmeleri
                          productReviews: seller.productReviews || {
                            rating: 4.3,
                            totalReviews: 810345,
                            totalComments: 230600,
                            ratingDistribution: {
                              5: 153200,
                              4: 30700,
                              3: 19000,
                              2: 8795,
                              1: 19000
                            }
                          },
                          // Satıcı değerlendirmeleri
                          sellerReviews: seller.sellerReviews || {
                            rating: 4.1,
                            totalReviews: 1250,
                            totalComments: 890,
                            ratingDistribution: {
                              5: 850,
                              4: 250,
                              3: 100,
                              2: 30,
                              1: 20
                            }
                          },
                          // Fotoğraflı değerlendirmeler
                          photoReviews: seller.photoReviews || [
                            { id: '1', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 1' },
                            { id: '2', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 2' },
                            { id: '3', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 3' },
                            { id: '4', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 4' },
                            { id: '5', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 5' },
                            { id: '6', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 6' },
                            { id: '7', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 7' }
                          ],
                          // Örnek yorumlar
                          sampleReviews: seller.sampleReviews || [
                            {
                              id: '1',
                              username: '**** ****',
                              date: '21 Ağustos 2025',
                              rating: 5,
                              comment: 'Ürün kalitesi çok iyi, hızlı kargo. Tavsiye ederim...',
                              likes: 0
                            },
                            {
                              id: '2',
                              username: '**** ****',
                              date: '20 Ağustos 2025',
                              rating: 4,
                              comment: 'Güzel ürün, beklentilerimi karşıladı.',
                              likes: 2
                            }
                          ]
                        }} 
                        isVisible={showSellerProfile} 
                        onClose={() => setShowSellerProfile(false)} 
                      />
                    )}
                  </React.Fragment>
                );
              }
              return null;
            })}
            </div>
          </>
        ) : null}
            </div>
      
      {/* AllProductsSection - Container içinde mobilde, Ana Sayfa ile aynı spacing */}
      {activeTab === 'all-products' && (
        <div className="max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 pt-0 md:pt-0 pb-8 sm:pb-12 lg:pb-16 xl:pb-20 overflow-x-hidden">
          <div className="space-y-0 md:space-y-4 sm:md:space-y-6 lg:space-y-8 xl:space-y-12">
            {/* Desktop'ta StoreHeader ve StoreNavBar göster */}
            {(() => {
              const headerSection = sections.find(s => s.slug === 'header');
              // headerSection yoksa bile seller varsa fallback StoreHeader render et
              if (seller && sectionComponentMap['header']) {
                const sectionToRender = headerSection || {
                  id: 'fallback-header',
                  slug: 'header',
                  fields: []
                } as Section;
                
                return (
                  <div className="hidden md:block -mt-[60px] md:-mt-[50px] lg:-mt-[55px] xl:-mt-[60px] py-4 md:py-6 lg:py-8">
                    {sectionComponentMap['header'](sectionToRender)}
                    <StoreNavBar 
                      onTabChange={setActiveTab} 
                      activeTab={activeTab} 
                    />
                  </div>
                );
              }
              return null;
            })()}
              <AllProductsSection 
                sellerId={seller.id}
                onSearch={setSearchQuery}
                searchQuery={searchQuery}
                selectedCategorySlug={selectedCategory}
              sellerName={seller.name}
              />
            </div>
      </div>
      )}
    </div>
  );
}
