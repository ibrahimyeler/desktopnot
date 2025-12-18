"use client";
//test
import { useEffect } from 'react';

export const useSearchScrollManagement = (sortedProducts: any[]) => {
  // Scroll pozisyonunu restore et (ürün detayından geri dönüldüğünde)
  useEffect(() => {
    if (typeof window === 'undefined' || sortedProducts.length === 0) return;

    const savedProductId = sessionStorage.getItem('searchProductId');
    const savedScrollPosition = sessionStorage.getItem('searchScrollPosition');
    const savedProductSlug = sessionStorage.getItem('searchProductSlug');
    const savedProductBaseSlug = sessionStorage.getItem('searchProductBaseSlug');
    
    if (savedProductId && savedScrollPosition) {
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
          const scrollPos = parseInt(savedScrollPosition, 10);
          if (!isNaN(scrollPos)) {
            window.scrollTo({
              top: scrollPos,
              behavior: 'smooth'
            });
          }
        }
        
        sessionStorage.removeItem('searchProductId');
        sessionStorage.removeItem('searchScrollPosition');
        sessionStorage.removeItem('searchProductSlug');
        sessionStorage.removeItem('searchProductBaseSlug');
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [sortedProducts]);
};

