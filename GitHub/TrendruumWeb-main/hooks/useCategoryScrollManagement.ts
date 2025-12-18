"use client";

import { useEffect, useCallback, useState } from 'react';

export const useCategoryScrollManagement = () => {
  const [savedScrollPosition, setSavedScrollPosition] = useState<number | null>(null);

  // Scroll pozisyonunu kaydet (optimized)
  const saveScrollPosition = useCallback(() => {
    if (typeof window !== 'undefined') {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Sadece önemli değişikliklerde kaydet (50px'den fazla)
      if (Math.abs(scrollTop - (savedScrollPosition || 0)) > 50) {
        sessionStorage.setItem('categoryScrollPosition', scrollTop.toString());
        setSavedScrollPosition(scrollTop);
      }
    }
  }, [savedScrollPosition]);

  // Scroll pozisyonunu restore et (ürün detayından geri dönüldüğünde)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedProductId = sessionStorage.getItem('categoryProductId');
    const savedScrollPosition = sessionStorage.getItem('categoryScrollPosition');
    const savedProductSlug = sessionStorage.getItem('categoryProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('categoryProductBaseSlug');
    
    if (savedProductId && savedScrollPosition) {
      // Ürünler render edildikten sonra scroll et
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
        sessionStorage.removeItem('categoryProductId');
        sessionStorage.removeItem('categoryScrollPosition');
        sessionStorage.removeItem('categoryProductSlug');
        sessionStorage.removeItem('categoryProductBaseSlug');
      }, 500); // Render tamamlanması için gecikme

      return () => clearTimeout(timer);
    }
  }, []);

  // Scroll pozisyonunu koruma için useEffect (sadece kaydetme, restore değil)
  useEffect(() => {
    // Sayfa kapatılırken scroll pozisyonunu kaydet
    const handleBeforeUnload = () => {
      saveScrollPosition();
    };

    // Click event'i (link tıklamalarında scroll pozisyonunu kaydet)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a[href*="/urunler/"]')) {
        saveScrollPosition();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleClick);
    };
  }, [saveScrollPosition]);

  // Scroll pozisyonunu kaydet (debounced) - Ayrı useEffect
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        saveScrollPosition();
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [saveScrollPosition]);

  // Next.js scroll restoration'ı devre dışı bırak
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Browser'ın otomatik scroll restoration'ını devre dışı bırak
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
    }
  }, []);

  return { saveScrollPosition };
};

