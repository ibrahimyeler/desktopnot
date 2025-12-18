"use client";

import React, { useState, useEffect } from 'react';
import ProductGrid from '../flashUrunler/ProductGrid';
import { Product } from '../../types/product';
import SearchLoadingSpinner from '../search/SearchLoadingSpinner';
import EmptyCategoryResults from './EmptyCategoryResults';

interface CategoryContentProps {
  loading: boolean;
  error: string | null;
  sortedProducts: Product[];
  categoryData: any;
  isAdultVerified: boolean;
  showAgeVerification: boolean;
  loadingMore: boolean;
  isAdultCheckComplete?: boolean;
  hasInitialProducts?: boolean;
  isAdultCategory?: boolean;
  loadMoreTriggerRef?: React.RefObject<HTMLDivElement | null>;
  hasMore?: boolean;
}

function CategoryContent({
  loading,
  error,
  sortedProducts,
  categoryData,
  isAdultVerified,
  showAgeVerification,
  loadingMore,
  isAdultCheckComplete = true,
  hasInitialProducts = false,
  isAdultCategory = false,
  loadMoreTriggerRef,
  hasMore = false
}: CategoryContentProps) {
  // Net state yönetimi: loading, error, empty durumlarını ayrı ayrı kontrol et
  
  // 1. Loading durumunda spinner göster
  if (loading) {
    return (
      <SearchLoadingSpinner />
    );
  }

  // 2. Error durumunda - loading false olmalı ve net error mesajı göster
  if (error && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Şu anda ürünleri getiremiyoruz
        </h3>
        <p className="text-gray-600 text-center mb-6 max-w-md">
          {error}
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }

  // 3. Initial products varsa ve sortedProducts henüz set edilmemişse, kısa bir süre bekle
  // Bu, initialProducts'tan sortedProducts'a geçiş sırasında "ürün bulunamadı" mesajının görünmesini önler
  const hasProducts = sortedProducts && Array.isArray(sortedProducts) && sortedProducts.length > 0;
  const shouldInitialize = hasInitialProducts && !hasProducts && !loading && !error;
  const [isInitializing, setIsInitializing] = useState(shouldInitialize);
  
  useEffect(() => {
    if (shouldInitialize) {
      // Initial products varsa ama sortedProducts henüz set edilmemişse, 200ms bekle
      // Bu süre içinde useCategoryProducts hook'u initialProducts'ı set edecek
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 200);
      
      return () => clearTimeout(timer);
    } else {
      // sortedProducts set edildiyse veya hasInitialProducts false ise, initializing'i hemen kapat
      setIsInitializing(false);
    }
  }, [shouldInitialize]);

  // Initializing durumunda kısa bir loading göster (initialProducts'tan sortedProducts'a geçiş)
  // Bu, "ürün bulunamadı" mesajının yanlış görünmesini önler
  if (isInitializing) {
    return (
      <SearchLoadingSpinner />
    );
  }

  // 4. Ürünler boş kontrolü - loading false, error yok, ama ürün yok
  // Kategori var mı kontrol et (categoryData varsa kategori var demektir)
  const hasCategory = categoryData && (categoryData.name || categoryData.title);
  
  if (!loading && !error && isAdultCheckComplete && !isInitializing && !hasProducts) {
    return (
      <EmptyCategoryResults 
        categoryName={categoryData?.name || categoryData?.title}
        hasCategory={!!hasCategory}
      />
    );
  }

  // 5. Ürünler varsa ProductGrid göster
  if (!sortedProducts || !Array.isArray(sortedProducts) || sortedProducts.length === 0) {
    // Ekstra güvenlik kontrolü - eğer bir şekilde buraya gelirse
    return (
      <EmptyCategoryResults 
        categoryName={categoryData?.name || categoryData?.title}
        hasCategory={!!hasCategory}
      />
    );
  }

  return (
    <div data-component-id="category-product-grid">
      <ProductGrid 
        products={sortedProducts as any}
        isAdultCategory={isAdultCategory}
        isAdultVerified={isAdultVerified}
        showAgeVerification={showAgeVerification}
        columnsPerRow={4}
        hideAddToBasket
        openInNewTabOnDesktop
        disablePrefetch
      />
      
      {/* Infinite Scroll Loading States */}
      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {/* Intersection Observer Trigger - Infinite Scroll için */}
      {hasMore && !loadingMore && (
        <div ref={loadMoreTriggerRef} className="h-1 w-full" aria-hidden="true" />
      )}
    </div>
  );
}

CategoryContent.displayName = 'CategoryContent';

// Memo'yu kaldır - React internal flag sorununu önlemek için
export default CategoryContent;
