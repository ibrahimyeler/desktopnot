"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { XMarkIcon, HeartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_V1_URL } from '@/lib/config';

interface ProductImage {
  url: string;
  name: string;
  id: string;
}

interface Seller {
  id: string;
  name: string;
  slug: string | null;
  rating?: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock?: number;
  status?: string;
  rating?: number;
  reviewCount?: number;
  review_count?: number;
  images: ProductImage[];
  seller: Seller;
  brand?: {
    name: string;
    id: string;
  };
  description?: string;
  variants?: any[];
  attributes?: any[];
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productSlug?: string;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({ isOpen, onClose, productId, productSlug }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  
  const { isInFavorites, addToFavorites, removeFavorite } = useFavorites();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  // Ürün detaylarını getir
  useEffect(() => {
    if (isOpen && productId) {
      fetchProductDetails();
    }
  }, [isOpen, productId]);

  // iOS Safari için body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const body = document.body;
      const html = document.documentElement;
      
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
      (body.style as any).webkitOverflowScrolling = 'none';
      
      html.style.overflow = 'hidden';
      html.style.height = '100%';

      return () => {
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.touchAction = '';
        (body.style as any).webkitOverflowScrolling = '';
        
        html.style.overflow = '';
        html.style.height = '';
        
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
    
      
      let response;
      let data;
      
      // Önce productId ile dene
      try {
        response = await fetch(`${API_V1_URL}/products/${productId}`);
        
        if (response.ok) {
          data = await response.json();
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        
        // ProductId başarısız olursa, productSlug ile dene
        if (productSlug) {
          response = await fetch(`${API_V1_URL}/products/${productSlug}`);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          data = await response.json();
        } else {
          throw error;
        }
      }
      
      if (data.meta?.status === 'success' && data.data) {
        const productData = data.data;
        
        // API'den gelen medias'ı images olarak dönüştür
        const images = productData.medias?.map((media: any) => ({
          id: media.id?.$oid || media.id,
          url: media.url,
          name: media.name || productData.name
        })) || [];
        
        setProduct({
          id: productData.id,
          name: productData.name,
          slug: productData.slug,
          price: productData.price || 0,
          stock: productData.stock || 0,
          status: productData.status || 'active',
          rating: productData.rating || 0,
          reviewCount: productData.review_count || 0,
          review_count: productData.review_count || 0,
          images: images,
          seller: {
            id: productData.seller?.id || '0',
            name: productData.seller?.name || '',
            slug: productData.seller?.slug || null,
            rating: productData.seller?.rating || 0
          },
          brand: productData.brand_v2 || productData.brand,
          description: productData.description,
          variants: productData.variants || [],
          attributes: productData.attributes || []
        });
      } else {

        toast.error(`Ürün bulunamadı. Status: ${data.meta?.status || 'unknown'}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      toast.error(`Ürün detayları yüklenirken bir hata oluştu: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!isLoggedIn) {
      toast.error('Favorilere eklemek için giriş yapmalısınız');
      router.push('/giris');
      return;
    }

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
    }
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, index) => (
      <StarIcon
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-2 sm:p-4 overflow-y-auto"
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
        touchAction: 'pan-y',
        overscrollBehavior: 'contain'
      }}
    >
      <div 
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90dvh] overflow-hidden my-2 sm:my-4"
        style={{
          maxHeight: '90dvh',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          paddingBottom: 'env(safe-area-inset-bottom, 0)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Hızlı Bakış</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : product ? (
          <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[calc(90vh-80px)] pb-4 sm:pb-0">
            {/* Sol taraf - Resimler */}
            <div className="lg:w-1/2 p-2 sm:p-4">
              <div className="relative aspect-square mb-4">
                {product.images && product.images[currentImageIndex] ? (
                  <Image
                    src={product.images[currentImageIndex].url}
                    alt={product.name}
                    fill
                    className="object-contain rounded-lg"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Thumbnail'lar */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex ? 'border-orange-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sağ taraf - Ürün bilgileri */}
            <div className="lg:w-1/2 p-2 sm:p-4 space-y-4">
              {/* Satıcı - API'den gelmiyor, yorum satırına alındı */}
              {/* <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Satıcı:</span>
                <span className="text-sm font-medium text-blue-600">{product.seller.name}</span>
                {product.seller.rating && (
                  <div className="flex items-center gap-1">
                    <div className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {product.seller.rating.toFixed(1)}
                    </div>
                  </div>
                )}
              </div> */}

              {/* Ürün adı */}
              <h1 className="text-xl font-semibold text-gray-900">{product.name}</h1>

              {/* Değerlendirme */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(product.rating || 0)}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount || product.review_count || 0} değerlendirme)
                </span>
              </div>

              {/* Fiyat */}
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </div>

         
              {/* Beden seçimi - API'den gelmiyor, yorum satırına alındı */}
              {/* {product.variants && product.variants.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Beden:</label>
                  <div className="flex gap-2">
                    {product.variants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSize(variant.value)}
                        className={`px-3 py-2 border rounded-lg text-sm ${
                          selectedSize === variant.value
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {variant.value}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}



              {/* Butonlar */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    onClose();
                    router.push(`/urunler/${product.slug}`);
                  }}
                  className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                >
                  Ürün Detayına Git
                </button>
                <button
                  onClick={handleAddToFavorites}
                  className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isInFavorites(productId) ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Ürün bulunamadı
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickViewModal;
