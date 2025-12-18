'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import PopularProducts from '@/components/Home/PopularProducts';
import MultipleBanners from '@/components/store/MultipleBanners';
import PopularCategories from '@/components/Home/PopularCategories';
import axios from 'axios';
import { API_V1_URL } from '@/lib/config';
import PromotionLinks from '@/components/Home/PromotionLinks';
import BrandSlider from '@/components/Home/BrandSlider';
import HomeBanners from '@/components/Home/HomeBanners';
import BestSellers from '@/components/Home/BestSellers';

import DiscountedProducts from '@/components/Home/DiscountedProducts';

import SuggestionItems from '@/components/Home/SuggestionItems';
import TrendingInfo from '@/components/Home/TrendingInfo';
import PopularContent from '@/components/Home/PopularContent';
import QuickLinks from '@/components/Home/QuickLinks';
import DynamicQuickLinks from '@/components/Home/DynamicQuickLinks';
import FooterText from '@/components/Home/FooterText';
import TextBanner from '@/components/Home/TextBanner';
import TextSection from '@/components/Home/TextSection';
import SlidingBanner from '@/components/Home/SlidingBanner';



// API Response tipi - yeni format
interface Field {
  name: string;
  slug: string;
  items: {
    name: string;
    slug: string;
    type: string;
    value: string;
  }[];
}

interface Section {
  id: string;
  name: string;
  slug: string;
  page_id: string;
  fields: Field[];
  created_at: string;
  updated_at: string;
}

interface PageInfo {
  id: string;
  title: string;
  slug: string;
  status: string;
  layout: string;
  is_page: boolean;
  seo_tags?: string;
  seo_description?: string;
  created_at: string;
  updated_at: string;
  breadcrumb?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface PageData {
  page: PageInfo;
  sections: Section[];
}

interface ApiResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: PageData;
}

interface Item {
  name: string;
  slug: string;
  type: string;
  value: any;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
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

export default function DynamicPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Sections state (pagination kaldırıldı - tek seferde 100 ürün çekiliyor)
  const [allSections, setAllSections] = useState<Section[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Eğer homepage ise, tek seferde 100 ürün çek
        if (slug === 'homepage') {
          const response = await axios.get<ApiResponse>(
            `${API_V1_URL}/pages/homepage?page=1&per_page=100`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.meta?.status === 'success') {
            const data = response.data.data;
            setPageData(data);
            setAllSections(data.sections || []);
          } else {
            setError('Sayfa verisi yüklenemedi');
          }
        } else {
          // Diğer sayfalar için tek seferde 100 ürün çek
          const response = await axios.get<ApiResponse>(
            `${API_V1_URL}/pages/${slug}?page=1&per_page=100`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.data.meta?.status === 'success') {
            const data = response.data.data;
            setPageData(data);
            setAllSections(data.sections || []);
          } else {
            setError('Sayfa verisi yüklenemedi');
          }
        }
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          // 404 ise konsola yazma, sadece kullanıcıya ekran göster
        } else {
        }
        setError('Sayfa yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [slug]);
  
  // Pagination kaldırıldı - tek seferde 100 ürün çekiliyor

  // Scroll pozisyonunu restore et (ürün detayından geri dönüldüğünde)
  useEffect(() => {
    if (typeof window === 'undefined' || isLoading) return;

    const savedProductId = sessionStorage.getItem('sPageProductId');
    const savedScrollPosition = sessionStorage.getItem('sPageScrollPosition');
    const savedProductSlug = sessionStorage.getItem('sPageProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('sPageProductBaseSlug');
    
    if (savedProductId && savedScrollPosition) {
      // Sections render edildikten sonra scroll et
      const timer = setTimeout(() => {
        const scrollToElement = (element: HTMLElement) => {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - 100;
          
          window.scrollTo({
            top: Math.max(offsetPosition, 0),
            behavior: 'smooth'
          });
        };

        let productElement: HTMLElement | null = null;

        if (savedProductId) {
          productElement = document.getElementById(`product-${savedProductId}`);
        }

        if (!productElement && savedProductSlug) {
          productElement = document.querySelector(`[data-product-slug="${savedProductSlug}"]`) as HTMLElement | null;
        }

        if (!productElement && savedProductBaseSlug) {
          productElement = document.querySelector(`[data-product-slug^="${savedProductBaseSlug}"]`) as HTMLElement | null;
        }

        if (productElement) {
          scrollToElement(productElement);
        } else {
          // Ürün bulunamazsa kaydedilen scroll pozisyonuna git
          const scrollPos = parseInt(savedScrollPosition, 10);
          if (!isNaN(scrollPos)) {
            window.scrollTo({
              top: scrollPos,
              behavior: 'smooth'
            });
          }
        }
        
        // SessionStorage'ı temizle
        sessionStorage.removeItem('sPageProductId');
        sessionStorage.removeItem('sPageScrollPosition');
        sessionStorage.removeItem('sPageProductSlug');
        sessionStorage.removeItem('sPageProductBaseSlug');
      }, 500); // Render tamamlanması için gecikme

      return () => clearTimeout(timer);
    }
  }, [isLoading, pageData, allSections]);

  // Field'lerden değer çıkarma helper fonksiyonu
  const getFieldValue = (fields: Field[], fieldSlug: string, itemSlug: string): string => {
    const field = (fields || []).find(f => f.slug === fieldSlug);
    if (!field) return '';
    const item = (field.items || []).find(i => i.slug === itemSlug);
    return item?.value || '';
  };

  // Field'den tüm banner'ları çıkarma
  const getBanners = (fields: Field[]): any[] => {
    const banners: any[] = [];
    (fields || []).forEach(field => {
      if (field.slug === 'banner') {
        const banner = {
          link: (field.items || []).find(item => item.slug === 'banner-link')?.value || '',
          image: (field.items || []).find(item => item.slug === 'banner-image')?.value || '',
          title: (field.items || []).find(item => item.slug === 'banner-title')?.value || ''
        };
        if (banner.image) {
          banners.push(banner);
        }
      }
    });
    return banners;
  };

  // Field'den tüm kategorileri çıkarma
  const getCategories = (fields: Field[]): any[] => {
    const categories: any[] = [];
    (fields || []).forEach(field => {
      if (field.slug === 'category') {
        const category = {
          name: (field.items || []).find(item => item.slug === 'category-title')?.value || '',
          slug: (field.items || []).find(item => item.slug === 'category-slug')?.value || '',
          color: (field.items || []).find(item => item.slug === 'category-color')?.value || '',
          image: (field.items || []).find(item => item.slug === 'category-image')?.value || ''
        };
        if (category.name) {
          categories.push(category);
        }
      }
    });
    return categories;
  };

  // Field'den tüm ürünleri çıkarma
  const getProducts = (fields: Field[]): any[] => {
    const products: any[] = [];
    (fields || []).forEach(field => {
      if (field.slug === 'selected-products') {
        const selectedProductsItem = (field.items || []).find(item => item.slug === 'selected-products');
        if (selectedProductsItem && selectedProductsItem.value && Array.isArray(selectedProductsItem.value)) {
          (selectedProductsItem.value || []).forEach((product: any) => {
            const rawRating = product?.average_rating ?? product?.rating ?? 0;
            const numericRating = typeof rawRating === 'number'
              ? rawRating
              : parseFloat(String(rawRating)) || 0;
            const rawReviewCount = product?.review_count ?? product?.reviewCount ?? product?.comment_count ?? 0;
            const numericReviewCount = typeof rawReviewCount === 'number'
              ? rawReviewCount
              : parseInt(String(rawReviewCount), 10) || 0;

            const formattedProduct = {
              id: product.id,
              name: product.name,
              medias: product.medias || [],
              price: product.price,
              discounted_price: product.discounted_price,
              seller: product.seller,
              brand: product.brand,
              slug: product.slug, // Slug alanını ekle
              stock: product.stock,
              status: product.status,
              rating: numericRating,
              average_rating: numericRating,
              reviewCount: numericReviewCount,
              review_count: numericReviewCount
            };
            products.push(formattedProduct);
          });
        }
      }
    });
    
    // Stok durumuna göre sırala
    return products.sort((a: any, b: any) => {
      // Stokta olmayan ürünler üstte
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;
      
      if (stockA === 0 && stockB > 0) return -1;
      if (stockA > 0 && stockB === 0) return 1;
      
      // Aynı stok durumundaki ürünler için rastgele sıralama
      return Math.random() - 0.5;
    });
  };

  const renderSection = (section: Section, index: number) => {
    
    switch (section.slug) {
      case 'text-banner': {
        // Parse fields for text-banner
        const field = section.fields[0];
        const items = field.items.reduce((acc: any, item: any) => {
          acc[item.slug] = item.value;
          return acc;
        }, {});
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <TextBanner
              header={items["header-title"]}
              backgroundImage={items["background-image"]}
              text={items["text"]}
              headerColor={items["header-color"]}
            />
          </div>
        );
      }
      case 'text': {
        // Parse fields for text
        const field = section.fields[0];
        const text = field.items.find((item: any) => item.slug === "text")?.value || "";
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <TextSection text={text} />
          </div>
        );
      }
      case 'html': {
        // Parse fields for html
        const field = section.fields[0];
        const fullHtml = field.items.find((item: any) => item.slug === "html")?.value || "";
        
        // HTML içeriğinden sadece main content'i çıkar (header ve footer hariç)
        const extractMainContent = (htmlString: string) => {
          // Önce body içeriğini al
          const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
          let content = bodyMatch ? bodyMatch[1] : htmlString;
          
          // Header ve footer'ı kaldır
          content = content.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '');
          content = content.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '');
          
          // HTML tag'lerini temizle
          content = content.replace(/<html[^>]*>|<\/html>/gi, '');
          content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
          content = content.replace(/<body[^>]*>|<\/body>/gi, '');
          
          return content.trim();
        };
        
        const mainContent = extractMainContent(fullHtml);
        
        // CSS stillerini head'den çıkar ve scope'la
        const extractStyles = (htmlString: string) => {
          const styleMatch = htmlString.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
          if (styleMatch) {
            let styles = styleMatch[1];
            
            // Global stilleri kaldır veya scope'la
            styles = styles.replace(/body\s*{/g, `.html-content-${section.id} {`);
            styles = styles.replace(/html\s*{/g, `.html-content-${section.id} {`);
            styles = styles.replace(/^\s*(\*|html|body)\s*{/gm, `.html-content-${section.id} {`);
            
            // Diğer stilleri scope'la
            styles = styles.replace(/([^{}]+){/g, (match, selector) => {
              // Global selector'ları atla
              if (selector.trim() === '*' || selector.trim() === 'html' || selector.trim() === 'body') {
                return match;
              }
              return `.html-content-${section.id} ${selector}{`;
            });
            
            return styles;
          }
          return '';
        };
        
        const styles = extractStyles(fullHtml);
        
        // Script'leri çıkar
        const extractScripts = (htmlString: string) => {
          const scriptMatch = htmlString.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
          if (scriptMatch) {
            return scriptMatch.map(script => {
              const contentMatch = script.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
              return contentMatch ? contentMatch[1] : '';
            });
          }
          return [];
        };
        
        const scripts = extractScripts(fullHtml);
        
        return (
          <div key={section.id} className={`html-content html-content-${section.id} ${index === 0 ? "pt-0 md:pt-8" : ""}`}>
            {styles && (
              <style dangerouslySetInnerHTML={{ __html: styles }} />
            )}
            <div 
              className="html-inner-content"
              dangerouslySetInnerHTML={{ __html: mainContent }}
            />
            {scripts.map((script, index) => (
              <script 
                key={`script-${index}`}
                dangerouslySetInnerHTML={{ __html: script }}
              />
            ))}
          </div>
        );
      }
      case 'quick-links': {
        // Eğer dinamik veri varsa DynamicQuickLinks kullan, yoksa QuickLinks kullan
        const hasDynamicData = (section.fields || []).some((field: Field) => field.slug === 'link');
        
        if (hasDynamicData) {
          const links = (section.fields || [])
            .filter((field: Field) => field.slug === 'link')
            .map((field: Field) => ({
              title: (field.items || []).find((item: Item) => item.slug === 'link-title')?.value || '',
              color: (field.items || []).find((item: Item) => item.slug === 'link-color')?.value || '#ffffff',
              link: (field.items || []).find((item: Item) => item.slug === 'link-link')?.value || '',
              textColor: (field.items || []).find((item: Item) => item.slug === 'link-text-color')?.value || '#000000'
            }));
          return (
            <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
              <DynamicQuickLinks links={links} />
            </div>
          );
        } else {
          return (
            <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
              <QuickLinks />
            </div>
          );
        }
      }
      case 'promotional-links': {
        const links = (section.fields || [])
          .filter((field: Field) => field.slug === 'promotional-links')
          .map((field: Field) => ({
            title: (field.items || []).find((item: Item) => item.slug === 'link-title')?.value || '',
            color: (field.items || []).find((item: Item) => item.slug === 'link-color')?.value || '#ffffff',
            link: (field.items || []).find((item: Item) => item.slug === 'link-link')?.value || '',
            image: (field.items || []).find((item: Item) => item.slug === 'link-picture')?.value || ''
          }));
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <PromotionLinks links={links} />
          </div>
        );
      }
      case 'brand-list': {
        const brandsValue = (section.fields || [])
          .find((field: Field) => field.slug === 'selected-brands')
          ?.items?.[0]?.value;
        
        // Eğer value bir JSON string ise parse et
        let parsedBrands: any = brandsValue;
        if (typeof brandsValue === 'string') {
          try {
            parsedBrands = JSON.parse(brandsValue);
          } catch (_error) {
            parsedBrands = [];
          }
        }
        
        const brands: Brand[] = Array.isArray(parsedBrands)
          ? parsedBrands.map((brand: any) => ({
              id: brand.id,
              name: brand.name,
              slug: brand.slug,
              image: brand.image ? { url: brand.image.url } : undefined
            }))
          : [];
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <BrandSlider brands={brands} />
          </div>
        );
      }
      case 'category-list': {
        const categories = (section.fields || [])
          .filter((field: Field) => field.slug === 'category')
          .map((field: Field) => ({
            name: (field.items || []).find((item: Item) => item.slug === 'category-title')?.value || '',
            slug: (field.items || []).find((item: Item) => item.slug === 'category-slug')?.value || '',
            color: (field.items || []).find((item: Item) => item.slug === 'category-color')?.value || '',
            image: (field.items || []).find((item: Item) => item.slug === 'category-image')?.value || ''
          }))
          .filter((cat) => cat.name);
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <PopularCategories categories={categories} />
          </div>
        );
      }
      case 'multiple-banner': {
        const banners = (section.fields || [])
          .filter((field: Field) => field.slug === 'banner')
          .map((field: Field) => ({
            image: (field.items || []).find((item: Item) => item.slug === 'banner-image')?.value || '',
            title: (field.items || []).find((item: Item) => item.slug === 'banner-title')?.value || '',
            link: (field.items || []).find((item: Item) => item.slug === 'banner-link')?.value || ''
          }))
          .filter((banner) => banner.image);
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <MultipleBanners banners={banners} />
          </div>
        );
      }
      case 'product-list': {
        const products = getProducts(section.fields || []);
        const productListTitle = getFieldValue(section.fields || [], 'product-list-title', 'product-list-title');
        const backgroundColor = getFieldValue(section.fields || [], 'background-color', 'bg-color');
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <PopularProducts
              title={productListTitle || section.name || 'Ürünler'}
              products={products}
              backgroundColor={backgroundColor}
              uniqueId={`store-${section.slug || 'section'}-${section.id || index}`}
              layout="grid"
            />
          </div>
        );
      }
      case 'home-banners':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <HomeBanners />
          </div>
        );
      case 'best-sellers':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <BestSellers />
          </div>
        );
      case 'home-banners-3':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <HomeBanners />
          </div>
        );
      case 'discounted-products':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <DiscountedProducts />
          </div>
        );
      case 'home-banners-4':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <HomeBanners />
          </div>
        );
      case 'suggestion-items':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <SuggestionItems />
          </div>
        );
      case 'trending-info':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <TrendingInfo />
          </div>
        );
      case 'popular-content':
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <PopularContent />
          </div>
        );
      case 'sliding-banner': {
        // Left sliders verilerini çıkar
        const leftSlidersField = (section.fields || []).find((f: Field) => f.slug === 'left-sliders');
        const leftSliders = leftSlidersField?.items || [];
        
        // Campaign products verilerini çıkar
        const campaignProductsField = (section.fields || []).find((f: Field) => f.slug === 'campaign-products');
        const rawCampaignProducts = (campaignProductsField?.items?.[0]?.value || []) as any[];
        
        // Campaign products'ı formatla - average_rating'i ekle
        const campaignProducts: CampaignProduct[] = rawCampaignProducts.map((product: any) => {
          const rawRating = product?.average_rating ?? product?.rating ?? 0;
          const numericRating = typeof rawRating === 'number'
            ? rawRating
            : parseFloat(String(rawRating)) || 0;
          const rawReviewCount = product?.review_count ?? product?.reviewCount ?? 0;
          const numericReviewCount = typeof rawReviewCount === 'number'
            ? rawReviewCount
            : parseInt(String(rawReviewCount), 10) || 0;
          
          return {
            ...product,
            rating: numericRating,
            average_rating: numericRating,
            review_count: numericReviewCount
          };
        });
        
        // Campaign background image
        const campaignBgField = (section.fields || []).find((f: Field) => f.slug === 'campaign-background-image');
        const campaignBackgroundImage = campaignBgField?.items?.[0]?.value;
        
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <SlidingBanner 
              leftSliders={leftSliders}
              campaignProducts={campaignProducts}
              campaignBackgroundImage={campaignBackgroundImage}
            />
          </div>
        );
      }
      case 'footer': {
        const footerText = getFieldValue(section.fields || [], 'footer', 'footer-text');
        return (
          <div key={section.id} className={index === 0 ? "pt-0 md:pt-8" : ""}>
            <FooterText html={footerText} />
          </div>
        );
      }
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton={true} onBackClick={() => window.history.back()} />
        
        <main className="flex-grow pb-0 pt-16 md:pt-0">
          <div className="w-full overflow-x-hidden">
            <div className="container mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px]">
              <div className="flex flex-col space-y-0.5 sm:space-y-0.5 lg:space-y-0.5">
                <div className="w-full">
                  <div className="text-center">
                    <div className="animate-pulse">
                      <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/2 sm:w-1/3 mx-auto mb-3 sm:mb-4"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3 sm:w-1/2 mx-auto mb-6 sm:mb-8"></div>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="h-48 sm:h-64 bg-gray-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <div style={{ height: '10px' }}></div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton={true} onBackClick={() => window.history.back()} />
        
        <main className="flex-grow pb-0 pt-16 md:pt-0">
          <div className="w-full overflow-x-hidden">
            <div className="container mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px]">
              <div className="flex flex-col space-y-0.5 sm:space-y-0.5 lg:space-y-0.5">
                <div className="w-full">
                  <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[60vh] bg-gradient-to-b from-orange-50 to-white px-4 py-8 sm:py-12">
                    <div className="flex flex-col items-center max-w-md mx-auto">
                      <div className="bg-orange-100 rounded-full p-4 sm:p-6 mb-4 sm:mb-6 border border-orange-200">
                        <svg width="48" height="48" className="sm:w-16 sm:h-16" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#F27A1A" opacity="0.15"/><path d="M9.172 9.172a4 4 0 0 1 5.656 0M9 15h6m-7 4a8 8 0 1 1 14 0 8 8 0 0 1-14 0Z" stroke="#F27A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="10" r="1" fill="#F27A1A"/><circle cx="15" cy="10" r="1" fill="#F27A1A"/></svg>
                      </div>
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">
                        {error || 'Sayfa bulunamadı'}
                      </h1>
                      <p className="text-sm sm:text-base text-gray-700 mb-6 text-center leading-relaxed">
                        Aradığınız sayfa mevcut değil, kaldırılmış olabilir veya yüklenirken bir hata oluştu.
                      </p>
                      <button
                        onClick={() => window.location.href = '/'}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold border border-orange-600 text-sm sm:text-base w-full sm:w-auto"
                      >
                        Ana Sayfaya Dön
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <div style={{ height: '10px' }}></div>
      </div>
    );
  }

  if ((pageData?.sections || []).length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header showBackButton={true} onBackClick={() => window.history.back()} />
        
        <main className="flex-grow pb-0 pt-16 md:pt-0">
          <div className="w-full overflow-x-hidden">
            <div className="container mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px]">
              <div className="flex flex-col space-y-0.5 sm:space-y-0.5 lg:space-y-0.5">
                <div className="w-full">
                  {/* Coming Soon Section */}
                  <div className="bg-white min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute top-10 left-10 w-20 h-20 bg-orange-500 rounded-full"></div>
                      <div className="absolute top-32 right-20 w-16 h-16 bg-orange-500 rounded-full"></div>
                      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-orange-500 rounded-full"></div>
                      <div className="absolute bottom-32 right-1/3 w-24 h-24 bg-orange-500 rounded-full"></div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                      {/* Icon */}
                      <div className="mb-6 sm:mb-8">
                        <div className="bg-orange-100 rounded-full p-4 sm:p-6 inline-block border-2 border-orange-200">
                          <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight">
                        Yakında
                      </h1>
                      
                      {/* Subtitle */}
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-6 sm:mb-8">
                        Bu Sayfanın Ürünleri
                      </h2>
                      
                      {/* Description */}
                      <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                        Bu kategori için özel ürünlerimizi hazırlıyoruz. Çok yakında sizlerle buluşacak!
                      </p>
                      
                      {/* Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="text-gray-800 text-sm sm:text-base font-medium">🎯 Özel Seçim</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="text-gray-800 text-sm sm:text-base font-medium">⚡ Hızlı Teslimat</div>
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                          <div className="text-gray-800 text-sm sm:text-base font-medium">💎 Kaliteli Ürünler</div>
                        </div>
                      </div>
                      
                      {/* CTA Button */}
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => window.location.href = '/'}
                          className="bg-orange-500 text-white hover:bg-orange-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Ana Sayfaya Dön
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info Section */}
                  <div className="bg-black text-white py-12 sm:py-16">
                    <div className="max-w-4xl mx-auto text-center px-4">
                      <h3 className="text-2xl sm:text-3xl font-bold mb-6">
                        Neden Beklemelisiniz?
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-left">
                          <h4 className="text-orange-400 font-semibold text-lg mb-3">🚀 Yenilikçi Ürünler</h4>
                          <p className="text-gray-300 leading-relaxed">
                            En son trendleri takip eden, kaliteli ve özel ürünlerimizi sizler için hazırlıyoruz.
                          </p>
                        </div>
                        <div className="text-left">
                          <h4 className="text-orange-400 font-semibold text-lg mb-3">⚡ Hızlı Erişim</h4>
                          <p className="text-gray-300 leading-relaxed">
                            Ürünler yayınlandığında anında haberdar olun ve ilk siz sahip olun.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <div style={{ height: '10px' }}></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header showBackButton={true} onBackClick={() => window.history.back()} />
      
      <main className="flex-grow pb-0 pt-16 md:pt-0">
        <div className="w-full overflow-x-hidden">
          <div className="container mx-auto px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px]">
            <div className="flex flex-col space-y-0.5 sm:space-y-0.5 lg:space-y-0.5">
              <div className="w-full">
                {allSections.length > 0 ? (
                  allSections.map((section, index) => renderSection(section, index))
                ) : (
                  <div className="text-center text-gray-600 text-sm sm:text-base py-8">
                    Bu sayfa için henüz içerik bulunmuyor.
                  </div>
                )}
                
                {/* Pagination kaldırıldı - tek seferde 100 ürün çekiliyor */}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <div style={{ height: '10px' }}></div>
    </div>
  );
}
