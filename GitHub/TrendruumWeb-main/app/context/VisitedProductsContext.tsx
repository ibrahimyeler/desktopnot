"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface VisitedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  campaignPrice?: number;
  discountPercentage?: number;
  images: Array<{
    url: string;
    name: string;
    id: string;
  }>;
  brand?: {
    name: string;
    id: string;
    slug?: string;
  };
  visitedAt: number; // timestamp
}

interface VisitedProductsContextType {
  visitedProducts: VisitedProduct[];
  addVisitedProduct: (product: Omit<VisitedProduct, 'visitedAt'>) => void;
  clearVisitedProducts: () => void;
  removeVisitedProduct: (productId: string) => void;
}

const VisitedProductsContext = createContext<VisitedProductsContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'trendruum_visited_products_';
const MAX_VISITED_PRODUCTS = 15;
const RETENTION_DAYS = 7; // 7 gün
const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000; // 7 gün milisaniye cinsinden

export const VisitedProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [visitedProducts, setVisitedProducts] = useState<VisitedProduct[]>([]);
  const { user } = useAuth();

  // Kullanıcı bazlı storage key oluştur
  const getStorageKey = (userId?: string) => {
    return userId ? `${STORAGE_KEY_PREFIX}${userId}` : `${STORAGE_KEY_PREFIX}guest`;
  };

  // 7 günden eski ürünleri filtrele
  const filterRecentProducts = (products: VisitedProduct[]): VisitedProduct[] => {
    const now = Date.now();
    return products.filter(product => {
      const daysSinceVisit = (now - product.visitedAt) / (24 * 60 * 60 * 1000);
      return daysSinceVisit <= RETENTION_DAYS;
    });
  };

  // LocalStorage'dan ziyaret edilen ürünleri yükle
  useEffect(() => {
    if (!user) {
      setVisitedProducts([]);
      return;
    }

    try {
      const storageKey = getStorageKey(user.id);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // 7 günden eski ürünleri filtrele
        const recentProducts = filterRecentProducts(parsed);
        // Tarih sırasına göre sırala (en yeni önce)
        const sorted = recentProducts.sort((a: VisitedProduct, b: VisitedProduct) => b.visitedAt - a.visitedAt);
        setVisitedProducts(sorted.slice(0, MAX_VISITED_PRODUCTS));
        
        // Eğer eski ürünler varsa, güncellenmiş listeyi kaydet
        if (recentProducts.length !== parsed.length) {
          localStorage.setItem(storageKey, JSON.stringify(recentProducts));
        }
      }
    } catch (_error) {
    }
  }, [user]);

  // LocalStorage'a kaydet
  const saveToStorage = (products: VisitedProduct[]) => {
    if (!user) return;
    
    try {
      const storageKey = getStorageKey(user.id);
      localStorage.setItem(storageKey, JSON.stringify(products));
    } catch (_error) {
    }
  };

  // Yeni ziyaret edilen ürün ekle
  const addVisitedProduct = (product: Omit<VisitedProduct, 'visitedAt'>) => {
    if (!user) return; // Sadece giriş yapmış kullanıcılar için

    const newProduct: VisitedProduct = {
      ...product,
      visitedAt: Date.now(),
    };

    setVisitedProducts(prev => {
      // Aynı ürün varsa kaldır (duplicate önleme)
      const filtered = prev.filter(p => p.id !== product.id);
      
      // Yeni ürünü başa ekle
      const updated = [newProduct, ...filtered];
      
      // 7 günden eski ürünleri filtrele
      const recentProducts = filterRecentProducts(updated);
      
      // Maksimum ürün sayısını kontrol et
      const limited = recentProducts.slice(0, MAX_VISITED_PRODUCTS);
      
      // LocalStorage'a kaydet
      saveToStorage(limited);
      
      return limited;
    });
  };

  // Tüm ziyaret edilen ürünleri temizle
  const clearVisitedProducts = () => {
    if (!user) return;
    
    setVisitedProducts([]);
    const storageKey = getStorageKey(user.id);
    localStorage.removeItem(storageKey);
  };

  // Belirli bir ürünü kaldır
  const removeVisitedProduct = (productId: string) => {
    if (!user) return;
    
    setVisitedProducts(prev => {
      const filtered = prev.filter(p => p.id !== productId);
      saveToStorage(filtered);
      return filtered;
    });
  };

  const value: VisitedProductsContextType = {
    visitedProducts,
    addVisitedProduct,
    clearVisitedProducts,
    removeVisitedProduct,
  };

  return (
    <VisitedProductsContext.Provider value={value}>
      {children}
    </VisitedProductsContext.Provider>
  );
};

export const useVisitedProducts = (): VisitedProductsContextType => {
  const context = useContext(VisitedProductsContext);
  if (context === undefined) {
    throw new Error('useVisitedProducts must be used within a VisitedProductsProvider');
  }
  return context;
};
