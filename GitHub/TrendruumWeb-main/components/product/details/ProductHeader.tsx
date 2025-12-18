"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CameraIcon, ChatBubbleLeftRightIcon, ShoppingBagIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import CampaignPriceBadge from '@/components/product/CampaignPriceBadge';
import ProductBenefits, { ProductBenefitsData } from './ProductBenefits';

interface Brand {
  name: string;
  slug: string;
  image: string;
  status: string;
  url: string;
  id: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  brand: Brand;
  categoryId?: string;
  rating?: {
    average: number;
    count: number;
  };
  reviews?: {
    total: number;
    questions: number;
    answers: number;
  };
}

interface ProductHeaderProps {
  product: Product;
  questions?: any[]; // Added questions prop
  productBenefitsData?: ProductBenefitsData;
}

const DEFAULT_VALUES = {
  rating: {
    average: 4.5,
    count: 128
  },
  reviews: {
    total: 84,
    questions: 24,
    answers: 86
  }
};

export default function ProductHeader({ product, questions = [], productBenefitsData }: ProductHeaderProps) {
  const [showReturnPolicyModal, setShowReturnPolicyModal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // iOS Safari için body scroll lock
  useEffect(() => {
    if (showReturnPolicyModal) {
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
  }, [showReturnPolicyModal]);
  
  if (!product) return null;

  // Varsayılan değerlerle birleştir
  const productWithDefaults = {
    ...product,
    rating: product.rating || DEFAULT_VALUES.rating,
    reviews: product.reviews || DEFAULT_VALUES.reviews
  };

  // Dinamik soru sayısını hesapla
  const dynamicQuestionsCount = questions.length;
  const dynamicAnswersCount = questions.filter(q => q.isAnswered).length;

  // Taksit bilgisi kaldırıldı

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Marka Bilgisi ve Rating/Soru-Cevap - Mobilde yan yana */}
      <div className="flex items-center justify-between gap-2 md:block">
        {/* Marka Bilgisi */}
        {product.brand && (
          <Link 
            href={product.brand.slug ? `/markalar/${product.brand.slug}` : '#'}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ShoppingBagIcon className="w-3.5 h-3.5" />
            {product.brand.name}
          </Link>
        )}

        {/* Rating ve İstatistikler - Mobilde markanın sağında */}
        <div className="flex items-center gap-2 md:hidden text-xs">
        <button 
          onClick={() => {
            const questionsSection = document.getElementById('questions');
            if (questionsSection) {
              questionsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium">{dynamicQuestionsCount} Soru & {dynamicAnswersCount} Cevap</span>
        </button>

        <span className="w-px h-3 bg-gray-200" />

        <div className="flex items-center gap-1.5">
          <span className="font-medium text-orange-600">
            {productWithDefaults.rating.average}
          </span>
          <button 
            onClick={() => {
              const reviewsSection = document.getElementById('reviews');
              if (reviewsSection) {
                reviewsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="flex items-center hover:opacity-80 transition-opacity cursor-pointer touch-manipulation"
            type="button"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 pointer-events-none ${
                  star <= Math.floor(productWithDefaults.rating.average) 
                    ? 'text-amber-400' 
                    : star - productWithDefaults.rating.average <= 0.5
                      ? 'text-amber-400'
                      : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </button>
          {productWithDefaults.rating.count > 0 && (
            <span className="text-gray-900">({productWithDefaults.rating.count})</span>
          )}
        </div>
      </div>
      </div>

      {/* Ürün Başlığı */}
      <h1 className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed">
        {product.name}
      </h1>

      {/* Rating ve İstatistikler - Desktop'ta ayrı satırda */}
      <div className="hidden md:flex flex-wrap items-center gap-2 md:gap-3 text-xs">
        <button 
          onClick={() => {
            const reviewsSection = document.getElementById('reviews');
            if (reviewsSection) {
              reviewsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <span className="font-medium text-orange-600">
            {productWithDefaults.rating.average}
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= Math.floor(productWithDefaults.rating.average) 
                    ? 'text-amber-400' 
                    : star - productWithDefaults.rating.average <= 0.5
                      ? 'text-amber-400'
                      : 'text-gray-200'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {productWithDefaults.rating.count > 0 && (
            <span className="text-gray-900">({productWithDefaults.rating.count})</span>
          )}
        </button>

        <span className="w-px h-3 bg-gray-200" />

        <button 
          onClick={() => {
            const questionsSection = document.getElementById('questions');
            if (questionsSection) {
              questionsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium">{dynamicQuestionsCount} Soru & {dynamicAnswersCount} Cevap</span>
        </button>
      </div>

      {productBenefitsData && (
        <ProductBenefits product={productBenefitsData} variant="desktop" />
      )}

      {/* Fiyat Bilgisi */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Kampanya Badge - Kampanya varsa fiyat bilgisi ile birlikte, yoksa sadece normal fiyat */}
          <CampaignPriceBadge 
            productId={product.id} 
            categoryId={product.categoryId}
            originalPrice={product.price}
          />
          
          {/* İade Güvencesi Link - En sağda */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              setShowReturnPolicyModal(true);
            }}
            className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity"
          >
            {/* Güven İkonu - Yeşil */}
            <svg 
              className="w-4 h-4 text-green-500 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
              />
            </svg>
            <span>
              <span className="text-orange-500">Trendruum</span>{' '}
              <span className="text-gray-900 font-semibold">iade güvencesi</span>
            </span>
          </button>
        </div>
      </div>

      {/* İade Politikası Modal */}
      {isClient && showReturnPolicyModal && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[999999] p-4"
          onClick={() => setShowReturnPolicyModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100dvh',
            touchAction: 'pan-y',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
            isolation: 'isolate'
          }}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl sm:max-w-2xl max-h-[88vh] h-[88vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            style={{
              paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)'
            }}
          >
            {/* Modal Header */}
            <div 
              className="px-5 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between"
              style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)' }}
            >
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">İADE POLİTİKASI</h2>
              <button
                onClick={() => setShowReturnPolicyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Kapat"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-5 sm:px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
                  TRENDRUUM İade Şartları nelerdir?
                </h3>
                
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>İade süresi ürün elinize ulaştığından itibaren 15 gündür.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>Ürünlerinizi ÜCRETSİZ iade edebilmek için "Trendruum İade" adımlarını takip ederek iade kodu almanız gerekir.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>İade edeceğiniz ürünün hasar görmemiş, kullanılmamış ve kullanım hatası sonucu zarar görmemiş olması gerekmektedir.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>İade etmek istediğiniz ürün/ürünleri tüm aksesuarları ve orijinal kutusu ile faturasıyla beraber iade etmeniz gerekmektedir.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>Tek kullanımlık ürünler ile hızlı bozulan veya son kullanma tarihi geçme ihtimali olan ürünlerin iadesi kabul edilmez.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>Kozmetik ve kişisel bakım ürünleri, iç giyim ürünleri, mayo, bikini, kitap, kopyalanabilir yazılım ve programlar, DVD, CD ve kasetler ile kırtasiye sarf malzemeleri (toner, kartuş, şerit vb.) ambalajı açılmamış, denenmemiş, bozulmamış, kullanılmamış olmaları halinde iade edilebilir.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>Beyaz eşya [buzdolabı, bulaşık makinesi, çamaşır makinesi, fırınlar (gaz, elektrik, mikrodalga), set üstü ocaklar, aspiratörler, ütüler, vantilatörler, ısıtıcılar, soğutucular], televizyon vb. kurulum gerektiren ürünler; yetkili servis bilgisi olmadan açılırsa iade kapsamı dışında kalır.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>Ürün yetkili servis çalışanları tarafından açıldıktan sonra üründe hasar/kusur/ayıp tespit edilmesi halinde yetkili servis çalışanlarına detaylı olarak sorunun not edildiği bir durum tespit tutanağı/servis formu/servis raporu doldurtmanız gerekir. İade kodu alarak raporla birlikte ürünü adresinize gelen kargo görevlisine teslim edebilirsiniz.</span>
                  </li>
                  
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1 text-lg leading-none">●</span>
                    <span>Finansal piyasalardaki dalgalanmalara bağlı olan ve satıcının kontrolünde olmayan, fiyatı değişiklik gösteren mal veya hizmetler için cayma hakkı kullanılamaz.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
} 