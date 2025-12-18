import { useState, useCallback, useRef } from 'react';
import { Product } from '../../../types/product';
import { API_V1_URL } from '@/lib/config';
import { parseAndFormatProducts } from '../utils/productFormatter';
import { detectGenderFromSearchTerm } from '../../../utils/searchUtils';

interface UseSearchProductsReturn {
  allProducts: Product[];
  filteredProducts: Product[];
  sortedProducts: Product[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  totalProducts: number;
  setAllProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setFilteredProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setSortedProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalProducts: React.Dispatch<React.SetStateAction<number>>;
  fetchSearchResults: (query: string) => Promise<{ filters: any } | null>;
  fetchFilteredProducts: (query: string, filters: any, attributeFilters: any, sortType: string) => Promise<{ filters: any } | null>;
  loadMoreProducts: (query: string, page: number, filters: any, attributeFilters?: Record<string, string[]>, sortType?: string) => Promise<void>;
}

export function useSearchProducts(initialProducts: Product[] = [], initialTotal: number = 0): UseSearchProductsReturn {
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);
  const [sortedProducts, setSortedProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(initialTotal);
  
  // AbortController ref'i - önceki istekleri iptal etmek için
  const abortControllerRef = useRef<AbortController | null>(null);

  // Arama sonuçlarını getir
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query || query.trim() === '') {
      setLoading(false);
      setError('Arama terimi boş olamaz');
      return;
    }
    
    // Önceki isteği iptal et
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Yeni AbortController oluştur
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setLoading(true);
    setError(null);
    
    try {
      // İstisna kelimeleri çıkar (kadın, erkek vb.) ve temizlenmiş sorguyu al
      const { cleanedQuery, detectedGender } = detectGenderFromSearchTerm(query.trim());
      const finalQuery = cleanedQuery || query.trim();
      
      // API URL'ini oluştur
      let apiUrl = `${API_V1_URL}/products/search?name=${encodeURIComponent(finalQuery)}&page=1&include_filters=1`;
      
      // Cinsiyet filtresi varsa ekle
      if (detectedGender !== null) {
        const genderValue = detectedGender === 1 ? 'kadin-kiz' : 'erkek';
        apiUrl += `&a_cinsiyet=${genderValue}`;
      }
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Response'u text olarak oku ve JSON'a parse et
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // HTML veya geçersiz JSON döndü
        throw new Error('API\'den beklenmeyen yanıt alındı. Lütfen tekrar deneyin.');
      }

      // İstek iptal edildi mi kontrol et
      if (abortController.signal.aborted) {
        return null;
      }

      if (data?.meta?.status === 'success' && data.data) {
        const searchData = data.data;
        const finalProducts = parseAndFormatProducts(searchData);

        // İstek iptal edildi mi tekrar kontrol et
        if (abortController.signal.aborted) {
          return null;
        }

        setAllProducts(finalProducts);
        setFilteredProducts(finalProducts);
        setSortedProducts(finalProducts);
        setTotalProducts(searchData.pagination?.total || finalProducts.length);
        
        const currentPageNum = parseInt(searchData.pagination?.current_page || '1');
        const lastPageNum = parseInt(searchData.pagination?.last_page || '1');
        setCurrentPage(currentPageNum);
        setHasMore(currentPageNum < lastPageNum);
        
        return { filters: searchData.filters };
      } else {
        setError('Arama sonuçları bulunamadı');
        setAllProducts([]);
        setFilteredProducts([]);
        setSortedProducts([]);
        setTotalProducts(0);
        return null;
      }
    } catch (error) {
      // AbortError'ı ignore et
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      
      const errorMessage = error instanceof Error ? error.message : 'Arama yapılırken bir hata oluştu';
      setError(errorMessage);
      setAllProducts([]);
      setFilteredProducts([]);
      setSortedProducts([]);
      setTotalProducts(0);
      return null;
    } finally {
      // Sadece iptal edilmemişse loading'i false yap
      if (!abortController.signal.aborted) {
      setLoading(false);
      }
    }
  }, []);

  // Filtreli arama yap
  const fetchFilteredProducts = useCallback(async (
    query: string,
    filters: any,
    attributeFilters: any,
    sortType: string
  ) => {
    if (!query) return;
    
    // Önceki isteği iptal et
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Yeni AbortController oluştur
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    setLoading(true);
    setError(null);
    
    try {
      // İstisna kelimeleri çıkar (kadın, erkek vb.) ve temizlenmiş sorguyu al
      const { cleanedQuery } = detectGenderFromSearchTerm(query.trim());
      const finalQuery = cleanedQuery || query.trim();
      
      const params = new URLSearchParams();
      params.append('name', finalQuery);
      params.append('page', '1');
      params.append('include_filters', '1');
      
      // Cinsiyet filtresi
      if (filters?.genders && Array.isArray(filters.genders) && filters.genders.length > 0) {
        params.append('a_cinsiyet', (filters.genders as string[]).join(','));
      }
      
      // Variant filtreleri (v_beden, v_renk vb.)
      if (filters?.variants && typeof filters.variants === 'object') {
        Object.entries(filters.variants).forEach(([variantSlug, values]) => {
          if (values && Array.isArray(values) && values.length > 0) {
            params.append(`v_${variantSlug}`, (values as string[]).join(','));
          }
        });
      }
      
      // Ana filtreler
      Object.entries(filters).forEach(([key, value]) => {
        if (key === 'variants') {
          // Variant filtreleri yukarıda işlendi, atla
          return;
        }
        if (value && Array.isArray(value) && value.length > 0) {
          if (key === 'colors') {
            params.append('v_renk', (value as string[]).join(','));
          } else if (key === 'product_stars') {
            params.append('a_product_stars', (value as string[]).join(','));
          } else if (key === 'brands') {
            params.append('brands', (value as string[]).join(','));
          } else if (key === 'categories') {
            params.append('categories', (value as string[]).join(','));
          } else if (key !== 'prices' && key !== 'genders') {
            params.append(`a_${key}`, (value as string[]).join(','));
          }
        } else if (value && typeof value === 'object' && key === 'prices') {
          const priceValue = value as { min?: number; max?: number };
          if (typeof priceValue.min === 'number') {
            params.append('min_price', priceValue.min.toString());
          }
          if (typeof priceValue.max === 'number') {
            params.append('max_price', priceValue.max.toString());
          }
        }
      });
      
      // Attribute filtreleri
      Object.entries(attributeFilters).forEach(([key, values]) => {
        if (values && (values as string[]).length > 0) {
          params.append(`a_${key}`, (values as string[]).join(','));
        }
      });
      
      // Sıralama
      if (sortType && sortType !== 'recommended') {
        params.append('sort_types', sortType);
      }
      
      const apiUrl = `${API_V1_URL}/products/search?${params.toString()}`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Response'u text olarak oku ve JSON'a parse et
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // HTML veya geçersiz JSON döndü
        throw new Error('API\'den beklenmeyen yanıt alındı. Lütfen tekrar deneyin.');
      }

      // İstek iptal edildi mi kontrol et
      if (abortController.signal.aborted) {
        return null;
      }

      if (data?.meta?.status === 'success' && data.data) {
        const searchData = data.data;
        const finalProducts = parseAndFormatProducts(searchData);

        // İstek iptal edildi mi tekrar kontrol et
        if (abortController.signal.aborted) {
          return null;
        }

        setAllProducts(finalProducts);
        setFilteredProducts(finalProducts);
        setSortedProducts(finalProducts);
        setTotalProducts(searchData.pagination?.total || finalProducts.length);
        
        const currentPageNum = parseInt(searchData.pagination?.current_page || '1');
        const lastPageNum = parseInt(searchData.pagination?.last_page || '1');
        setCurrentPage(currentPageNum);
        setHasMore(currentPageNum < lastPageNum);
        
        return { filters: searchData.filters };
      } else {
        setError('Filtreli arama sonuçları bulunamadı');
        return null;
      }
    } catch (error) {
      // AbortError'ı ignore et
      if (error instanceof Error && error.name === 'AbortError') {
        return null;
      }
      
      setError('Filtreleme yapılırken bir hata oluştu');
      return null;
    } finally {
      // Sadece iptal edilmemişse loading'i false yap
      if (!abortController.signal.aborted) {
      setLoading(false);
      }
    }
  }, []);

  // Daha fazla ürün yükle
  const loadMoreProducts = useCallback(async (
    query: string,
    page: number,
    filters: any,
    attributeFilters?: Record<string, string[]>,
    sortType?: string
  ) => {
    if (!query) return;
    
    setLoadingMore(true);
    
    try {
      // İstisna kelimeleri çıkar (kadın, erkek vb.) ve temizlenmiş sorguyu al
      const { cleanedQuery } = detectGenderFromSearchTerm(query.trim());
      const finalQuery = cleanedQuery || query.trim();
      const nextPage = page + 1;
      const params = new URLSearchParams();
      params.append('name', finalQuery);
      params.append('page', String(nextPage));
      params.append('include_filters', '1');
      
      // Variant filtreleri (v_beden, v_renk vb.)
      if (filters?.variants && typeof filters.variants === 'object') {
        Object.entries(filters.variants).forEach(([variantSlug, values]) => {
          if (values && Array.isArray(values) && values.length > 0) {
            params.append(`v_${variantSlug}`, (values as string[]).join(','));
          }
        });
      }
      
      // Ana filtreler
      Object.entries(filters || {}).forEach(([key, value]) => {
        if (key === 'variants') {
          // Variant filtreleri yukarıda işlendi, atla
          return;
        }
        if (value && Array.isArray(value) && value.length > 0) {
          if (key === 'colors') {
            params.append('v_renk', (value as string[]).join(','));
          } else if (key === 'product_stars') {
            params.append('a_product_stars', (value as string[]).join(','));
          } else if (key === 'brands') {
            params.append('brands', (value as string[]).join(','));
          } else if (key === 'categories') {
            params.append('categories', (value as string[]).join(','));
          } else if (key === 'genders') {
            params.append('a_cinsiyet', (value as string[]).join(','));
          } else if (key !== 'prices') {
            params.append(`a_${key}`, (value as string[]).join(','));
          }
        } else if (value && typeof value === 'object' && key === 'prices') {
          const priceValue = value as { min?: number; max?: number };
          if (typeof priceValue.min === 'number') {
            params.append('min_price', priceValue.min.toString());
          }
          if (typeof priceValue.max === 'number') {
            params.append('max_price', priceValue.max.toString());
          }
        }
      });
      
      // Attribute filtreleri
      if (attributeFilters) {
        Object.entries(attributeFilters).forEach(([key, values]) => {
          if (values && (values as string[]).length > 0) {
            params.append(`a_${key}`, (values as string[]).join(','));
          }
        });
      }
      
      // Sıralama
      if (sortType && sortType !== 'recommended') {
        params.append('sort_types', sortType);
      }
      
      const apiUrl = `${API_V1_URL}/products/search?${params.toString()}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Response'u text olarak oku ve JSON'a parse et
      const text = await response.text();
      let data;
      
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        // HTML veya geçersiz JSON döndü
        throw new Error('API\'den beklenmeyen yanıt alındı. Lütfen tekrar deneyin.');
      }

      if (data?.meta?.status === 'success' && data.data) {
        const searchData = data.data;
        const finalProducts = parseAndFormatProducts(searchData);

        // Yeni ürünleri mevcut listeye ekle
        setAllProducts(prev => {
          const combined = [...prev, ...finalProducts];
          return combined.filter((product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
          );
        });
        setFilteredProducts(prev => {
          const combined = [...prev, ...finalProducts];
          return combined.filter((product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
          );
        });
        setSortedProducts(prev => {
          const combined = [...prev, ...finalProducts];
          return combined.filter((product, index, self) =>
            index === self.findIndex((p) => p.id === product.id)
          );
        });
        
        const lastPageNum = parseInt(searchData.pagination?.last_page || '1');
        setCurrentPage(nextPage);
        setHasMore(nextPage < lastPageNum);
      }
    } catch (_error) {
    } finally {
      setLoadingMore(false);
    }
  }, []);

  return {
    allProducts,
    filteredProducts,
    sortedProducts,
    loading,
    loadingMore,
    error,
    currentPage,
    hasMore,
    totalProducts,
    setAllProducts,
    setFilteredProducts,
    setSortedProducts,
    setLoading,
    setLoadingMore,
    setError,
    setCurrentPage,
    setHasMore,
    setTotalProducts,
    fetchSearchResults: fetchSearchResults as (query: string) => Promise<{ filters: any } | null>,
    fetchFilteredProducts: fetchFilteredProducts as (query: string, filters: any, attributeFilters: any, sortType: string) => Promise<{ filters: any } | null>,
    loadMoreProducts
  };
}
