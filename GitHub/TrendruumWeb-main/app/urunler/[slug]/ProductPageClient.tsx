// @ts-nocheck
'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_V1_URL, PUBLIC_API_V1_URL } from '@/lib/config';
import { STATIC_CATEGORIES } from '@/data/categories';
import DOMPurify from 'dompurify';

// HTML decode fonksiyonu (hem sunucu hem istemci tarafında çalışır)
const decodeHtml = (html: string): string => {
  if (!html) return '';
  
  // Hem sunucu hem istemci tarafında çalışan decode fonksiyonu
  // HTML entity'leri decode eder
  return html
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    // Sayısal entity'leri decode et (örn: &#8217;)
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    // Hexadecimal entity'leri decode et (örn: &#x27;)
    .replace(/&#x([a-f\d]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
};

import Header from '@/components/layout/Header';
import { ArrowLeftIcon, ShoppingCartIcon, HeartIcon, TruckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Footer from '@/components/layout/Footer';
import toast from 'react-hot-toast';
import ScrollToTop from '@/components/ui/ScrollToTop';
import ProductImages from '@/components/product/ProductImages';
import ProductHeader from '@/components/product/details/ProductHeader';
import ProductSidebar from '@/components/product/details/ProductSidebar';
import ProductVariants from '@/components/product/details/ProductVariants';
import ProductActions from '@/components/product/details/ProductActions';
import ProductInfo from '@/components/product/details/ProductInfo';
import ProductHighlights from '@/components/product/details/ProductHighlights';
import ProductBenefits from '@/components/product/details/ProductBenefits';
import ProductDeliveryWidget from '@/components/product/details/ProductDeliveryWidget';
import OtherSellers from '@/components/product/OtherSellers';
import RelatedPurchases from '@/components/product/RelatedPurchases';
import ProductQuestions from '@/components/product/ProductQuestions';
import CustomerReviews from '@/components/product/CustomerReviews';
import AskQuestionModal from '@/components/product/AskQuestionModal';
import Breadcrumb from '@/components/common/Breadcrumb';
import CampaignBanner from '@/components/product/CampaignBanner';
import CampaignPriceBadge from '@/components/product/CampaignPriceBadge';
import SimilarProducts from '@/components/product/SimilarProducts';
import ComplementaryProducts from '@/components/product/ComplementaryProducts';
import { useCampaign } from '@/app/hooks/useCampaign';
import { useBasketOptional } from '@/app/context/BasketContext';
import { useFavoritesOptional } from '@/app/context/FavoriteContext';
import { useAuthOptional } from '@/app/context/AuthContext';
import { useVisitedProducts } from '@/app/context/VisitedProductsContext';

interface ProductResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    description?: string;
    price: number;
    original_price?: number;
    campaign_price?: number;
    discount_percentage?: number;
    campaign_type?: string;
    campaign_settings?: {
      buy_quantity?: number;
      pay_quantity?: number;
    };
    stock: number;
    status: string;
    rating?: number;
    review_count?: number;
    question_count?: number;
    images: Array<{
      id: string;
      name: string;
      url: string;
      fullpath: string;
    }>;
    medias?: Array<{
      id: string;
      name: string;
      url: string;
      fullpath: string;
      type: string;
    }>;
    brand?: {
      ty_id: string;
      name: string;
      slug: string;
      status: string;
      url?: string;
      image?: string;
    };
    seller?: {
      id: string;
      name: string;
      slug: string;
      shipping_policy?: {
        general: {
          delivery_time: number;
          shipping_fee: number;
          free_shipping_threshold: number;
          carrier: string;
        };
        custom: any[];
      };
      cargo_company?: {
        deliveryOptionName: string;
        deliveryOptionId: number;
        deliveryCompanyName: string;
        logo: string;
        deliveryTime?: number;
      };
    };
    brand_v2?: {
      id: string;
      name: string;
      slug: string;
    };
    brandV2?: {
      id: string;
      name: string;
      slug: string;
    };
    seller_v2?: {
      id: string;
      name: string;
      slug: string;
      cargo_company?: {
        deliveryOptionName: string;
        deliveryOptionId: number;
        deliveryCompanyName: string;
        logo: string;
        deliveryTime?: number;
      };
    };
    sellerV2?: {
      id: string;
      name: string;
      slug: string;
      pickupLocationCode?: string;
      cargo_company?: {
        deliveryOptionName: string;
        deliveryOptionId: number;
        deliveryCompanyName: string;
        logo: string;
        deliveryTime?: number;
      };
    };
    variants?: Array<{
      id: string;
      name: string;
      value_name: string;
      value_slug: string;
      imageable: boolean;
      image?: string;
    }>;
    badges?: {
      fast_shipping?: boolean;
      free_shipping?: boolean;
      same_day?: boolean;
      new_product?: boolean;
      best_selling?: boolean;
    };
    attributes?: Array<{
      name: string;
      value?: string;
      value_name?: string;
      value_slug?: string;
      slug?: string;
      updated_at?: string;
      created_at?: string;
    }>;
    category_v2?: {
      name: string;
      slug: string;
      id: string;
    };
    seo_title?: string;
    seo_desc?: string;
    seo_keywords?: string;
    keywords?: string[];
    termin?: string;
  };
}

interface ProductPageClientProps {
  productSlug: string;
  initialProductData: any;
  initialReviews: any[];
  initialQuestions: any[];
  initialRelatedProducts: any[];
  initialOtherSellers: any[];
  initialVariants?: any[];
}

// CampaignBanner bileşenine campaign prop'unu eklemek için tip tanımı
interface CampaignBannerProps {
  campaign?: any;
  productId?: any;
  productSlug?: any;
  categoryId?: any;
  [key: string]: any;
}

// OtherSellers bileşenine prop tanımı
interface OtherSellersProps {
  productId?: any;
  productSlug?: any;
  currentSeller?: any;
  otherSellers?: any[];
  [key: string]: any;
}

// RelatedPurchases bileşenine prop tanımı
interface RelatedPurchasesProps {
  productId?: any;
  productSlug?: any;
  relatedProducts?: any[];
  [key: string]: any;
}

// CustomerReviews bileşenine prop tanımı
interface CustomerReviewsProps {
  productId?: any;
  productSlug?: any;
  reviews?: any[];
  loading?: boolean;
  onRatingUpdate?: any;
  [key: string]: any;
}

// Brand tipini esnek bir şekilde güncelleme
interface Brand {
  name: string;
  slug: string;
  image?: any;
  status?: any;
  url?: any;
  id?: any;
  ty_id?: any;
}

const groupVariantsByType = (variants: any[]) => {
  const grouped: { [key: string]: any } = {};
  
  variants.forEach(variant => {
    const type = variant.name;
    if (!grouped[type]) {
      grouped[type] = {
        name: type,
        values: []
      };
    }
    grouped[type].values.push({
      id: variant.id,
      name: variant.value_name,
      slug: variant.value_slug,
      imageable: variant.imageable,
      image: variant.image
    });
  });
  
  return Object.values(grouped);
};

// Basit slugify (TR karakter desteği ile)
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s\-&>/]/g, '')
    .replace(/\s*&\s*/g, ' ')
    .replace(/\s+>/g, '>')
    .replace(/>\s+/g, '>')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Kategori bilgisini normalize eden helper fonksiyon
// categoryV2 ve category_v2 alanlarını tek bir modele indirger (categoryV2 kullanılır)
const getCategoryInfo = (productData: any) => {
  // Öncelik sırası: categoryV2 > category_v2 > category > categoryId
  if (productData?.categoryV2) {
    return productData.categoryV2;
  }
  if (productData?.category_v2) {
    return productData.category_v2;
  }
  if (productData?.category) {
    return productData.category;
  }
  if (productData?.categoryId) {
    return {
      slug: productData.categoryId,
      name: 'Kategori'
    };
  }
  return null;
};

// Parent kategorileri bulup breadcrumb'a ekleyen fonksiyon
const findParentCategories = async (categorySlug: string) => {
  const parentCategories: any[] = [];
  
  
  // API'den tüm kategorileri çek ve kontrol et
  try {
    const response = await fetch(`${API_V1_URL}/categories`);
    const data = await response.json();
    
    
    if (data.meta?.status === 'success' && data.data) {
      // Kategori hiyerarşisini bul
      const findCategoryPath = (categories: any[], targetSlug: string, currentPath: any[] = []): any[] | null => {
        for (const category of categories) {
          const newPath = [...currentPath, category];
          
          // Bu kategori hedef kategori mi?
          if (category.slug === targetSlug) {
            return newPath;
          }
          
          // Alt kategorileri kontrol et
          if (category.children && category.children.length > 0) {
            const found = findCategoryPath(category.children, targetSlug, newPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const path = findCategoryPath(data.data, categorySlug);
      
      if (path && path.length > 0) {
        // Ana kategori ve alt kategorileri ekle
        path.forEach((category: any) => {
          parentCategories.push({
            name: category.name,
            href: `/${category.slug}`,
            isLogo: false
          });
        });
        return parentCategories;
      }
    }
  } catch (error) {
  }

  // 1. Fallback: Tek kategori detayından search_word ile yol çıkar
  try {
    const detailRes = await fetch(`${API_V1_URL}/categories/${categorySlug}`);
    const detailData = await detailRes.json();
    if (detailData?.meta?.status === 'success' && detailData?.data?.search_word) {
      const parts = String(detailData.data.search_word)
        .split('>')
        .map((p: string) => p.trim())
        .filter(Boolean);
      parts.forEach((name: string) => {
        const s = slugify(name);
        parentCategories.push({
          name,
          href: `/${s}`,
          isLogo: false
        });
      });
      if (parentCategories.length > 0) {
        return parentCategories;
      }
    }
  } catch (err) {
  }
  
  // Fallback: Statik kategorileri kontrol et

  for (const [mainCategorySlug, mainCategory] of Object.entries(STATIC_CATEGORIES)) {
    
    // Ana kategori kendisi mi?
    if (mainCategorySlug === categorySlug) {
      parentCategories.push({
        name: mainCategory.name,
        href: `/${mainCategorySlug}`,
        isLogo: false
      });
      break;
    }
    
    // 1. derece alt kategorileri kontrol et
    for (const subCategory of mainCategory.children || []) {
      if (subCategory.slug === categorySlug) {
        parentCategories.push({
          name: mainCategory.name,
          href: `/${mainCategorySlug}`,
          isLogo: false
        });
        parentCategories.push({
          name: subCategory.name,
          href: `/${subCategory.slug}`,
          isLogo: false
        });
        break;
      }
      
      // 2. derece alt kategorileri kontrol et
      for (const subSubCategory of subCategory.children || []) {
        if (subSubCategory.slug === categorySlug) {
          parentCategories.push({
            name: mainCategory.name,
            href: `/${mainCategorySlug}`,
            isLogo: false
          });
          parentCategories.push({
            name: subCategory.name,
            href: `/${subCategory.slug}`,
            isLogo: false
          });
          parentCategories.push({
            name: subSubCategory.name,
            href: `/${subSubCategory.slug}`,
            isLogo: false
          });
          break;
        }
      }
    }
  }
  
  return parentCategories;
};

export default function ProductPageClient({ 
  productSlug, 
  initialProductData, 
  initialReviews, 
  initialQuestions, 
  initialRelatedProducts, 
  initialOtherSellers,
  initialVariants = []
}: ProductPageClientProps) {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductResponse['data'] | null>(initialProductData);
  const [loading, setLoading] = useState(!initialProductData);
  const [error, setError] = useState<string | null>(null);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [isAdultVerified, setIsAdultVerified] = useState(true);
  const [reviews, setReviews] = useState<any[]>(initialReviews);
  const [reviewsLoading, setReviewsLoading] = useState(!initialReviews.length);
  const [questions, setQuestions] = useState<any[]>(initialQuestions);
  const [questionsLoading, setQuestionsLoading] = useState(!initialQuestions.length);
  const [showAskQuestionModal, setShowAskQuestionModal] = useState(false);
  const [availableVariants, setAvailableVariants] = useState<any[]>(initialVariants.length > 0 ? initialVariants : []);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
  const [mobileButtonLoading, setMobileButtonLoading] = useState(false);
  
  // Benzer ürünler ve tamamlayıcı ürünler için state'ler
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [complementaryProducts, setComplementaryProducts] = useState<any[]>([]);
  const [similarProductsLoading, setSimilarProductsLoading] = useState(false);
  const [complementaryProductsLoading, setComplementaryProductsLoading] = useState(false);
  
  const { addToBasket } = useBasketOptional();
  
  const { isInFavorites, addToFavorites, removeFavorite } = useFavoritesOptional();
  const authContext = useAuthOptional();
  const isLoggedIn = authContext?.isLoggedIn || false;
  const { addVisitedProduct } = useVisitedProducts();
  const initialDataProcessed = useRef(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateViewportState = () => {
      setIsMobileViewport(window.innerWidth < 1024);
    };

    updateViewportState();
    window.addEventListener('resize', updateViewportState);

    return () => {
      window.removeEventListener('resize', updateViewportState);
    };
  }, []);
  
  // Kampanya bilgilerini al
  const { campaign, isProductInCampaign, getCampaignQuantity } = useCampaign(product?.id || '', product?.categoryId);
  
  // Dinamik rating state'i
  const [dynamicRating, setDynamicRating] = useState<{ average: number; count: number }>({
    average: 0,
    count: 0
  });

  // Rating güncelleme callback'i
  const handleRatingUpdate = (rating: number, totalReviews: number) => {
    setDynamicRating({
      average: rating,
      count: totalReviews
    });
  };

  // Seller ID'yi memoize et - varyant değişikliklerinde yeniden render edilmesini önle
  const sellerId = useMemo(() => {
    return product?.seller_v2?.id || product?.seller?.id || '';
  }, [product?.seller_v2?.id, product?.seller?.id]);

  // Favori fonksiyonu
  const handleFavoriteClick = async () => {
    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    if (!product) return;

    try {
      if (isInFavorites(product.id)) {
        await removeFavorite(product.id);
        toast.success('Ürün favorilerden kaldırıldı');
      } else {
        await addToFavorites(product.id);
        toast.success('Ürün favorilere eklendi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  // Sepete ekleme fonksiyonu
  const handleAddToBasket = async (quantity: number = 1) => {
    if (!product) return;

    try {
      const productToAdd = selectedProduct || product;
      await addToBasket(productToAdd, quantity);
      toast.success('Ürün sepete eklendi');
    } catch (error) {
      toast.error('Ürün sepete eklenirken bir hata oluştu');
    }
  };

  // Varyant seçimi
  const handleVariantSelect = (variantType: string, variantValue: string) => {
    // Seçili variant bilgilerini güncelle
    setSelectedVariants(prev => ({
      ...prev,
      [variantType]: variantValue
    }));
  };

  // Ürün değişimi (URL değişimi)
  const handleProductChange = useCallback((newSlug: string) => {
    const targetUrl = `/urunler/${newSlug}`;

    if (isMobileViewport) {
      router.replace(targetUrl);
    } else {
      router.push(targetUrl);
    }
  }, [isMobileViewport, router]);

  // Ürün güncellemesi (fiyat, stok, resimler)
  const handleProductUpdate = (updatedProduct: any) => {

    setSelectedProduct(updatedProduct);
    
    // Seçili varyant ID'sini güncelle
    if (updatedProduct.id) {
      setSelectedVariantId(updatedProduct.id);
    }
  };

  // Ürün verilerini yükle (sadece initial data yoksa)
  useEffect(() => {
    if (!initialProductData && productSlug) {
      const fetchProduct = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${API_V1_URL}/products/${productSlug}`);
          const data = await response.json();
          
          if (data.meta.status === 'success') {
            setProduct(data.data);
            
            // Varyantları set et - /variants endpoint'inden tüm kombinasyonları al
            if (data.data.variants && data.data.variants.length > 0) {
              try {
                const variantsResponse = await fetch(`${API_V1_URL}/products/${data.data.id}/variants`);
                const variantsResponseData = await variantsResponse.json();
                if (variantsResponseData?.data && variantsResponseData.data.length > 0) {
                  setAvailableVariants(variantsResponseData.data); // Tüm variant kombinasyonları
                } else {
                  setAvailableVariants([data.data]); // Fallback: tek ürün
                }
              } catch (error) {
                setAvailableVariants([data.data]); // Fallback: tek ürün
              }
            }
            
            // Breadcrumb oluştur - Trendruum logosu ile başla
            const breadcrumbItems = [
              { name: 'Trendruum', href: '/', isLogo: true }
            ];
            
            
            // Kategori bilgisini normalize et (categoryV2 kullanılır)
            const categoryInfo = getCategoryInfo(data.data);
            
            if (categoryInfo) {
              const parentCategories = await findParentCategories(categoryInfo.slug);
              if (parentCategories && parentCategories.length > 0) {
                breadcrumbItems.push(...parentCategories);
              } else {
                // Fallback: en azından yaprak kategoriyi göster
                breadcrumbItems.push({
                  name: categoryInfo.name || categoryInfo.slug,
                  href: `/${categoryInfo.slug}`,
                  isLogo: false
                });
              }
            } else {

            }
            
            
            // Ürün adını ekleme - sadece kategori yolu gösterilecek
            setBreadcrumbItems(breadcrumbItems);
            
            // Ziyaret edilen ürünlere ekle - doğru formatta
            const visitedProductData = {
              id: data.data.id,
              name: data.data.name,
              slug: data.data.slug,
              price: data.data.price || 0,
              originalPrice: data.data.original_price,
              campaignPrice: data.data.campaign_price,
              discountPercentage: data.data.discount_percentage,
              images: data.data.medias ? data.data.medias.map((media: any) => ({
                id: media.id?.$oid || media.id || '',
                name: media.name || '',
                url: media.url || ''
              })) : data.data.images || [],
              brand: (data.data.brandV2 || data.data.brand_v2) ? {
                id: (data.data.brandV2 || data.data.brand_v2).id || (data.data.brandV2 || data.data.brand_v2).ty_id,
                name: (data.data.brandV2 || data.data.brand_v2).name,
                slug: (data.data.brandV2 || data.data.brand_v2).slug
              } : data.data.brand ? {
                id: data.data.brand.id,
                name: data.data.brand.name,
                slug: data.data.brand.slug
              } : undefined,
              rating: data.data.rating,
              reviewCount: data.data.review_count
            };
            
            
            addVisitedProduct(visitedProductData);
          } else {
            setError('Ürün bulunamadı');
          }
        } catch (error) {
          setError('Ürün yüklenirken bir hata oluştu');
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    } else if (initialProductData && !initialDataProcessed.current) {
      // Initial variants SSR'dan geldiyse direkt kullan, yoksa fetch et
      if (initialVariants.length > 0) {
        setAvailableVariants(initialVariants);
      } else if (initialProductData.variants && initialProductData.variants.length > 0) {
        // SSR'da variantlar yüklenemediyse client-side'da yükle
        const fetchInitialVariants = async () => {
          try {
            const variantsResponse = await fetch(`${API_V1_URL}/products/${initialProductData.id}/variants`);
            const variantsResponseData = await variantsResponse.json();
            if (variantsResponseData?.data && variantsResponseData.data.length > 0) {
              setAvailableVariants(variantsResponseData.data); // Tüm variant kombinasyonları
            } else {
              setAvailableVariants([initialProductData]); // Fallback: tek ürün
            }
          } catch (error) {
            setAvailableVariants([initialProductData]); // Fallback: tek ürün
          }
        };
        fetchInitialVariants();
      } else {
        // Variant yoksa tek ürün olarak set et
        setAvailableVariants([initialProductData]);
      }
      
      // Breadcrumb oluştur - async olarak
      const createBreadcrumb = async () => {
        const breadcrumbItems = [
          { name: 'Trendruum', href: '/', isLogo: true }
        ];
        
        
        // Kategori bilgisini normalize et (categoryV2 kullanılır)
        const categoryInfo = getCategoryInfo(initialProductData);
        
        if (categoryInfo) {
          const parentCategories = await findParentCategories(categoryInfo.slug);
          if (parentCategories && parentCategories.length > 0) {
            breadcrumbItems.push(...parentCategories);
          } else {
            // Fallback: en azından yaprak kategoriyi göster
            breadcrumbItems.push({
              name: categoryInfo.name || categoryInfo.slug,
              href: `/${categoryInfo.slug}`,
              isLogo: false
            });
          }
        } else {
        }
        
        
        // Ürün adını ekleme - sadece kategori yolu gösterilecek
        setBreadcrumbItems(breadcrumbItems);
      };
      
      createBreadcrumb();
      
      // Ziyaret edilen ürünlere ekle - doğru formatta
      const visitedProductData = {
        id: initialProductData.id,
        name: initialProductData.name,
        slug: initialProductData.slug,
        price: initialProductData.price || 0,
        originalPrice: initialProductData.original_price,
        campaignPrice: initialProductData.campaign_price,
        discountPercentage: initialProductData.discount_percentage,
        images: initialProductData.medias ? initialProductData.medias.map((media: any) => ({
          id: media.id?.$oid || media.id || '',
          name: media.name || '',
          url: media.url || ''
        })) : initialProductData.images || [],
        brand: (initialProductData.brandV2 || initialProductData.brand_v2) ? {
          id: (initialProductData.brandV2 || initialProductData.brand_v2).id || (initialProductData.brandV2 || initialProductData.brand_v2).ty_id,
          name: (initialProductData.brandV2 || initialProductData.brand_v2).name,
          slug: (initialProductData.brandV2 || initialProductData.brand_v2).slug
        } : initialProductData.brand ? {
          id: initialProductData.brand.id,
          name: initialProductData.brand.name,
          slug: initialProductData.brand.slug
        } : undefined,
        rating: initialProductData.rating,
        reviewCount: initialProductData.review_count
      };
      
      
      addVisitedProduct(visitedProductData);
      
      // Initial data işlendi olarak işaretle
      initialDataProcessed.current = true;
    }
  }, [productSlug, addVisitedProduct]);

  // Yorumları yükle (sadece initial data yoksa)
  useEffect(() => {
    if (!initialReviews.length && (product?.id || productSlug)) {
      const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
          const reviewsEndpoint = product?.id
            ? `${API_V1_URL}/products/${product.id}/reviews?page=1&limit=10`
            : `${API_V1_URL}/products/${productSlug}/reviews?page=1&limit=10`;
          const response = await fetch(reviewsEndpoint);
          
          // 404, 500 veya diğer hata durumlarını handle et
          if (!response.ok) {
            if (response.status === 404) {
              setReviews([]);
              return;
            }
            if (response.status === 500) {
              setReviews([]);
              return;
            }
            // Diğer hata durumları için de graceful fallback
            setReviews([]);
            return;
          }
          
          const data = await response.json();
          
          if (data.meta?.status === 'success') {
            setReviews(data.data || []);
          } else {
            setReviews([]);
          }
        } catch (error) {
          // Hata durumunda boş array set et, sayfayı bozma
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
      };

      fetchReviews();
    }
  }, [productSlug, initialReviews.length, product?.id]);

  // Soruları yükle (sadece initial data yoksa)
  useEffect(() => {
    if (!initialQuestions.length && (product?.id || productSlug)) {
      const fetchQuestions = async () => {
        setQuestionsLoading(true);
        try {
          const questionsEndpoint = product?.id
            ? `${API_V1_URL}/products/${product.id}/questions?page=1&limit=10`
            : `${API_V1_URL}/products/${productSlug}/questions?page=1&limit=10`;
          const response = await fetch(questionsEndpoint);
          
          // 404, 500 veya diğer hata durumlarını handle et
          if (!response.ok) {
            if (response.status === 404) {
              setQuestions([]);
              return;
            }
            if (response.status === 500) {
              setQuestions([]);
              return;
            }
            // Diğer hata durumları için de graceful fallback
            setQuestions([]);
            return;
          }
          
          const data = await response.json();
          
          if (data.meta?.status === 'success') {
            setQuestions(data.data || []);
          } else {
            setQuestions([]);
          }
        } catch (error) {
          // Hata durumunda boş array set et, sayfayı bozma
          setQuestions([]);
        } finally {
          setQuestionsLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [productSlug, initialQuestions.length, product?.id]);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-600 mb-4">{error || 'Aradığınız ürün bulunamadı.'}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  return (
    <>
      <Header showBackButton={true} onBackClick={() => router.back()} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 pt-20 md:pt-0 pb-60 md:pb-8 overflow-x-hidden">
        {/* Mobilde ürün görsellerini header'ın hemen altında, tek satırda ve tam ekran genişliğinde göster */}
        {product && (
          <div
            className="lg:hidden mb-3 overflow-hidden"
            style={{
              position: 'relative',
              left: '50%',
              right: '50%',
              marginLeft: '-50vw',
              marginRight: '-50vw',
              width: '100vw',
              maxWidth: '100vw'
            }}
          >
            <ProductImages 
              images={product.medias || product.images} 
              productName={product.name} 
              isAdultCategory={false}
              isAdultVerified={isAdultVerified}
              showAgeVerification={showAgeVerification}
              stock={product.stock}
              status={product.status}
              badges={product.badges}
              productId={product.id}
              isInFavorites={isInFavorites(product.id)}
              onFavoriteClick={handleFavoriteClick}
            />
          </div>
        )}

        <div className="w-full mt-0 lg:mt-5">
          
          {/* Breadcrumb - sadece desktop görünümünde göster */} 
          <div className="hidden lg:block mb-2 lg:mb-3 px-3 py-1 md:p-3 -ml-1">
            <Breadcrumb 
              items={breadcrumbItems}
              className="text-xs sm:text-sm"
            />
          </div>

          {/* Kampanya Banner */}
          {campaign && isProductInCampaign && (
            <CampaignBanner
              campaign={campaign}
              productSlug={productSlug}
              categoryId={product.categoryId || ''}
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8 lg:items-start relative">
            {/* Sol Sütun - Ürün Resmi (sadece desktop) */}
            <div className="hidden lg:block lg:col-span-4">
              <ProductImages 
                images={product.medias || product.images} 
                productName={product.name} 
                isAdultCategory={false}
                isAdultVerified={isAdultVerified}
                showAgeVerification={showAgeVerification}
                stock={product.stock}
                status={product.status}
                badges={product.badges}
              />
            </div>

            {/* Orta Sütun - Ürün Bilgileri */}
            <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
              <ProductHeader 
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  categoryId: product.categoryId,
                  brand: {
                    name: (product.brandV2 || product.brand_v2 || product.brand)?.name || 'Bilinmeyen Marka',
                    slug: (product.brandV2 || product.brand_v2 || product.brand)?.slug || ''
                  },
                  rating: {
                    average: dynamicRating.average > 0 ? dynamicRating.average : (product.rating || 0),
                    count: dynamicRating.count > 0 ? dynamicRating.count : (product.review_count || 0)
                  },
                  reviews: {
                    total: product.review_count || 0,
                    questions: product.question_count || 0,
                    answers: product.review_count || 0
                  },
                }}
                questions={questions}
                productBenefitsData={{
                  badges: product.badges,
                  seller: product.seller_v2 || product.seller,
                  termin: product.termin
                }}
              />
              
              {availableVariants && availableVariants.length > 0 && (
                <ProductVariants
                  variants={[]}
                  availableVariants={availableVariants}
                  onVariantSelect={handleVariantSelect}
                  onProductChange={handleProductChange}
                  onProductUpdate={handleProductUpdate}
                  currentSlug={params.slug as string}
                />
              )}

              <ProductActions
                product={selectedProduct || product}
                selectedVariantId={selectedVariantId}
                selectedVariants={selectedVariants}
                hasSizeVariants={product.variants?.some(v => 
                  v.name.toLowerCase().includes('beden') || 
                  v.name.toLowerCase().includes('yaş') || 
                  v.name.toLowerCase().includes('yas')
                )}
                onFavoriteClick={handleFavoriteClick}
                isInFavorites={isInFavorites(product.id)}
                campaign={campaign}
                isProductInCampaign={isProductInCampaign}
                getCampaignQuantity={getCampaignQuantity}
                mobileButtonLoading={mobileButtonLoading}
                setMobileButtonLoading={setMobileButtonLoading}
              />

              {/* Öne Çıkan Özellikler - Mobilde üstte, desktop'ta altta */}
              <div className="order-1 md:order-2">
                {/* Bizde - Mobilde Öne Çıkan Özelliklerin Üstünde */}
                <ProductBenefits variant="mobile" product={{
                  badges: product.badges,
                  seller: product.seller_v2 || product.seller,
                  termin: product.termin
                }} />
                
                <ProductHighlights product={{
                  attributes: product.attributes?.filter(attr => attr.name && (attr.value_name || attr.value)).map(attr => ({
                    name: attr.name,
                    value_name: attr.value_name || attr.value,
                    value: attr.value_name || attr.value,
                    value_slug: (attr.value_name || attr.value)?.toLowerCase().replace(/\/s+/g, '-') || '',
                    slug: attr.name?.toLowerCase().replace(/\/s+/g, '-') || '',
                    updated_at: new Date().toISOString(),
                    created_at: new Date().toISOString()
                  })),
                  brand: product.brandV2 || product.brand_v2 || product.brand,
                  category: getCategoryInfo(product),
                  stock: product.stock,
                  status: product.status
                }} />
              </div>

              {/* Teslimat Bilgileri Widget - Mobilde altta, desktop'ta üstte */}
              <div className="order-2 md:order-1">
                <ProductDeliveryWidget 
                  sellerId={sellerId}
                  cargoCompany={product.seller_v2?.cargo_company || product.seller?.cargo_company}
                  deliveryTime={product.seller?.shipping_policy?.general?.delivery_time}
                  termin={product.termin}
                  className="mb-4"
                />
              </div>


              {/* Kampanya Fiyat Badge */}
              {campaign && isProductInCampaign && (
                <CampaignPriceBadge
                  productId={product.id}
                  categoryId={product.categoryId}
                />
              )}
            </div>

            {/* Sağ Sütun - Satıcı Bilgileri */}
            <div className="lg:col-span-3">
              <ProductSidebar
                campaigns={[]}
                brand={(product.brandV2 || product.brand_v2 || product.brand) ? {
                  id: product.brandV2?.id || product.brand_v2?.id || product.brand?.id || '',
                  ty_id: product.brand?.ty_id || product.brand_v2?.ty_id || product.brandV2?.ty_id || '',
                  name: (product.brandV2 || product.brand_v2 || product.brand)?.name || '',
                  image: product.brand?.image || product.brand?.url || product.brand_v2?.image || product.brand_v2?.url || product.brandV2?.image || product.brandV2?.url || '',
                  status: product.brand?.status || product.brand_v2?.status || product.brandV2?.status || 'active',
                  slug: (product.brandV2 || product.brand_v2 || product.brand)?.slug || '',
                  url: product.brand?.url || product.brand_v2?.url || product.brandV2?.url || '',
                  updated_at: '',
                  created_at: ''
                } : undefined}
                seller={product.sellerV2 || product.seller_v2 || product.seller}
                otherSellers={initialOtherSellers}
                productId={product.id}
                productName={product.name}
                productSlug={productSlug}
                productImage={product?.medias?.[0]?.url || product?.images?.[0]?.url}
                productPrice={product?.price || product?.campaign_price}
                onRatingUpdate={handleRatingUpdate}
                similarProducts={similarProducts}
                similarProductsLoading={similarProductsLoading}
                currentProductId={product.id}
                currentCategoryId={getCategoryInfo(product)?.slug}
                onQuestionSubmitted={() => {
                  // Soru gönderildikten sonra yapılacak işlemler
                }}
                reviews={reviews}
              />
            </div>
          </div>

          {/* Diğer Satıcılar */}
          {initialOtherSellers && initialOtherSellers.length > 0 && (
            <div className="mt-8">
              <OtherSellers 
                productSlug={productSlug} 
                currentSeller={product.seller_v2 || product.seller} 
                otherSellers={initialOtherSellers} 
              />
            </div>
          )}

          {/* İlgili Ürünler */}
          {initialRelatedProducts && initialRelatedProducts.length > 0 && (
            <div className="mt-8">
              <RelatedPurchases 
                productId={product.id}
                categorySlug={getCategoryInfo(product)?.slug}
                relatedProducts={initialRelatedProducts} 
              />
            </div>
          )}

          {/* Müşteri Yorumları - Sadece Desktop Görünümde */}
          <div id="reviews" className="mt-8 hidden md:block">
            <CustomerReviews 
              productId={product?.id}
              productSlug={productSlug} 
              onRatingUpdate={handleRatingUpdate}
              productName={product?.name}
              productImage={product?.medias?.[0]?.url || product?.images?.[0]?.url}
              productPrice={product?.price || product?.campaign_price}
            />
          </div>

          {/* Ürün Bilgileri - Müşteri Yorumlarının Hemen Altında */}
          <div id="product-details" className="mt-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Ürün Bilgileri</h2>
                
                {/* Öne Çıkan Özellikler */}
                {product.attributes && product.attributes.length > 0 && (
                  <div className="mb-6 md:mb-8">
                    <h3 className="text-base md:text-lg font-medium text-gray-800 mb-3 md:mb-4">Öne Çıkan Özellikler</h3>
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 md:p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {product.attributes.slice(0, 8).map((attr, index) => (
                          <div key={index} className="flex justify-between items-center py-2 md:py-3 px-3 md:px-4 bg-white rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                            <span className="text-xs md:text-sm font-medium text-gray-700">{attr.name}</span>
                            <span className="text-xs md:text-sm text-gray-900 font-medium">{attr.value_name || attr.value || '-'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Ürün Açıklaması */}
                {product.description && (
                  <div className="space-y-3 md:space-y-4">
                    <h3 className="text-base md:text-lg font-medium text-gray-800 mb-3 md:mb-4">Ürün Açıklaması</h3>
                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200">
                      <div 
                        className="text-xs md:text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none
                          prose-headings:text-gray-900 prose-headings:font-semibold
                          prose-p:text-gray-700 prose-p:leading-relaxed
                          prose-strong:text-gray-900 prose-strong:font-semibold
                          prose-ul:text-gray-700 prose-ol:text-gray-700 prose-ul:list-none prose-ol:list-none
                          prose-li:text-gray-700 prose-li:leading-relaxed prose-li:list-none
                          prose-img:rounded-lg prose-img:shadow-sm prose-img:max-w-full prose-img:h-auto
                          prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
                          prose-blockquote:border-l-orange-500 prose-blockquote:bg-orange-50
                          prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                          prose-pre:bg-gray-900 prose-pre:text-gray-100"
                        dangerouslySetInnerHTML={{ 
                          __html: product.description 
                            ? decodeHtml(product.description)
                            : ''
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bilgi Kartları - Mobil Görünümde Ürün Açıklamalarının Altında */}
          <div className="md:hidden space-y-3 mt-6">
            {/* Kargo Ücreti Bilgisi - Mavi Renk Paleti */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2.5 border border-blue-200">
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-blue-500 rounded-lg flex-shrink-0">
                  <TruckIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-semibold text-gray-900 mb-0.5">Kargo Ücreti</h4>
                  <p className="text-[9px] text-gray-700 leading-tight">
                    400 TL altı siparişlerde sabit 125 TL kargo ücreti uygulanır.
                  </p>
                </div>
              </div>
            </div>

            {/* Hızlı Teslimat - Yeşil Renk Paleti */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2.5 border border-green-200">
              <div className="flex items-start gap-2">
                <div className="p-1.5 bg-green-500 rounded-lg flex-shrink-0">
                  <TruckIcon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-semibold text-gray-900 mb-0.5">Hızlı Teslimat</h4>
                  <p className="text-[9px] text-gray-600 leading-tight">
                    Bu mağazadan alışverişlerinizde hızlı ve güvenli teslimat avantajından yararlanın.
                  </p>
                </div>
              </div>
            </div>

            {/* Güvenlik Bilgisi */}
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-[10px] font-medium text-gray-900">Güvenli Alışveriş</span>
              </div>
              <p className="text-[9px] text-gray-600 leading-tight">
                256-bit SSL şifreleme ile korumalı ödeme sistemi
              </p>
            </div>
          </div>

          {/* Ürün Soru ve Cevapları - Benzer Ürünlerin Üstünde */}
          <div id="questions" className="mt-8 mb-8">
            <ProductQuestions
              productId={product.id}
              questions={questions}
              loading={questionsLoading}
              totalQuestions={questions.length}
              sellerName={product.seller_v2?.name || product.seller?.name || 'Satıcı'}
              onAskQuestion={() => setShowAskQuestionModal(true)}
            />
          </div>

          {/* Benzer Ürünler */}
          {(() => {
            const categoryInfo = getCategoryInfo(product);
            const categoryId = categoryInfo?.slug;
        
            return (
              <SimilarProducts 
                products={similarProducts}
                loading={similarProductsLoading}
                currentProductId={product.id}
                currentCategoryId={categoryId}
              />
            );
          })()}

          {/* Tamamlayıcı Ürünler - Sonra */}
          {(() => {
            const categoryInfo = getCategoryInfo(product);
            const categoryId = categoryInfo?.slug;
         
            return (
              <ComplementaryProducts 
                products={complementaryProducts}
                loading={complementaryProductsLoading}
                isAdultCategory={false}
                isAdultVerified={isAdultVerified}
                showAgeVerification={showAgeVerification}
                currentProductId={product.id}
                currentCategoryId={categoryId}
              />
            );
          })()}
        </div>
      </main>
      
      {/* Mobil Sepete Ekle Butonu - Main Container Dışında (iOS Stacking Context Sorunu İçin) */}
      {product && (
        <ProductActions
          product={selectedProduct || product}
          selectedVariantId={selectedVariantId}
          selectedVariants={selectedVariants}
          hasSizeVariants={product.variants?.some(v => 
            v.name.toLowerCase().includes('beden') || 
            v.name.toLowerCase().includes('yaş') || 
            v.name.toLowerCase().includes('yas')
          )}
          onFavoriteClick={handleFavoriteClick}
          isInFavorites={isInFavorites(product.id)}
          campaign={campaign}
          isProductInCampaign={isProductInCampaign}
          getCampaignQuantity={getCampaignQuantity}
          mobileButtonLoading={mobileButtonLoading}
          setMobileButtonLoading={setMobileButtonLoading}
          renderMobileButtonOnly={true}
        />
      )}
      
      <ScrollToTop />
      
      {/* Ask Question Modal */}
      <AskQuestionModal
        isOpen={showAskQuestionModal}
        onClose={() => setShowAskQuestionModal(false)}
        productId={product.id}
        productName={product.name}
        sellerName={product.seller_v2?.name || product.seller?.name || 'Satıcı'}
        onQuestionSubmitted={async () => {
          // Soru gönderildikten sonra soruları yenile
          setQuestionsLoading(true);
          try {
            const response = await fetch(`${API_V1_URL}/products/${product.id}/questions?page=1&limit=10`);
            const data = await response.json();
            
            if (data.meta.status === 'success') {
              setQuestions(data.data || []);
            }
          } catch (error) {
          } finally {
            setQuestionsLoading(false);
          }
        }}
      />
    </>
  );
}
