import axios from 'axios';
import { API_V1_URL } from '@/lib/config';
import { searchStores } from '@/app/data/stores';

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  type: 'product' | 'brand' | 'category' | 'store' | 'keyword';
  image?: string;
  price?: number;
  discounted_price?: number;
  brand?: string;
  seller?: string;
  category?: string;
  rating?: number;
  review_count?: number;
}

export interface SmartSearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
}

export class SmartSearchService {
  private static instance: SmartSearchService;
  
  public static getInstance(): SmartSearchService {
    if (!SmartSearchService.instance) {
      SmartSearchService.instance = new SmartSearchService();
    }
    return SmartSearchService.instance;
  }

  /**
   * Akıllı arama - tek endpoint'ten tüm türleri alır ve sonuçları birleştirir
   */
  async searchAll(query: string, limit: number = 10): Promise<SmartSearchResponse> {
    if (!query.trim()) {
      return { results: [], total: 0, hasMore: false };
    }

    try {
      // Yeni search-custom endpoint'ini kullan
      const response = await axios.get(
        `https://api.trendruum.com/api/v1/products/search?include_filters=1&name=${encodeURIComponent(query)}&page=1`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 saniye timeout
        }
      );

      if (response.data.meta?.status === 'success') {
        const data = response.data.data;
        
        // Tüm sonuçları al (sınır yok)
        const allBrands = data.filters?.brands || [];
        const allCategories = data.filters?.categories || [];
        // API yapısında products array'i var (data.products veya data.products.data)
        const allProducts = Array.isArray(data.products) ? data.products : (data.products?.data || []);
        const allSellers = data.filters?.sellers || [];
        // Keywords'leri al
        const keywords = data.suggestions?.keywords || [];
        
        // Debug: API'den gelen ürün sayısını logla

        // Mağazalar statik listeden ve API'den alınıyor
        const staticStores = searchStores(query, 50); // Daha fazla mağaza
        const apiStores = allSellers.map((s: any) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          image: s.image?.url
        }));
        
        // Statik ve API mağazalarını birleştir, duplikasyonları kaldır
        const allStores = [...staticStores];
        apiStores.forEach((apiStore: any) => {
          if (!allStores.some(store => store.id === apiStore.id || store.name.toLowerCase() === apiStore.name.toLowerCase())) {
            allStores.push(apiStore);
          }
        });

        // Sonuçları birleştir - Önce keywords, sonra diğerleri
        const allResults = [
          // Keywords en başta
          ...keywords.map((keyword: string, index: number) => ({
            id: `keyword-${index}-${keyword}`,
            name: keyword,
            slug: keyword.toLowerCase().replace(/\s+/g, '-'),
            type: 'keyword' as const
          })),
          ...allBrands.map((b: any) => ({
            id: b.id,
            name: b.name,
            slug: b.slug,
            image: b.image?.url,
            type: 'brand' as const
          })),
          ...allCategories.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            image: c.image?.url,
            type: 'category' as const
          })),
          ...allStores.map(s => ({ ...s, type: 'store' as const }))
          // Ürünler gösterilmiyor - sadece keywords, brands, categories ve stores gösteriliyor
        ];

        // Öncelik sırası: Keyword > Marka > Kategori > Mağaza > Ürün, sonra tam eşleşme > başlangıç eşleşmesi > içinde geçme
        const sortedResults = this.prioritizeResults(allResults, query);

        return {
          results: sortedResults,
          total: allResults.length,
          hasMore: false // Artık limit yok
        };
      }
      
      return { results: [], total: 0, hasMore: false };
    } catch (_error) {
      // Return empty results instead of throwing error to prevent UI crashes
      return { results: [], total: 0, hasMore: false };
    }
  }



  /**
   * Array'den random seçim yap
   */
  private randomSelect<T>(array: T[], count: number): T[] {
    if (array.length <= count) {
      return array;
    }
    
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  /**
   * Sonuçları öncelik sırasına göre sırala
   */
  private prioritizeResults(results: SearchResult[], query: string): SearchResult[] {
    const queryLower = query.toLowerCase();
    
    return results.sort((a, b) => {
      const aNameLower = a.name.toLowerCase();
      const bNameLower = b.name.toLowerCase();
      
      // Tür önceliği: Keyword > Marka > Kategori > Mağaza > Ürün
      const typePriority = { keyword: 0, brand: 1, category: 2, store: 3, product: 4 };
      const aTypePriority = typePriority[a.type] ?? 5;
      const bTypePriority = typePriority[b.type] ?? 5;
      
      if (aTypePriority !== bTypePriority) {
        return aTypePriority - bTypePriority;
      }
      
      // Aynı türde ise, tam eşleşme öncelikli
      const aExactMatch = aNameLower === queryLower;
      const bExactMatch = bNameLower === queryLower;
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      // Başlangıç eşleşmesi
      const aStartsWith = aNameLower.startsWith(queryLower);
      const bStartsWith = bNameLower.startsWith(queryLower);
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      // İçinde geçme
      const aIncludes = aNameLower.includes(queryLower);
      const bIncludes = bNameLower.includes(queryLower);
      
      if (aIncludes && !bIncludes) return -1;
      if (!aIncludes && bIncludes) return 1;
      
      // Aynı öncelik seviyesindeyse alfabetik sırala
      return a.name.localeCompare(b.name, 'tr');
    });
  }

  /**
   * Arama türünü tespit et (marka, kategori, mağaza mı?)
   */
  async detectSearchType(query: string): Promise<'product' | 'brand' | 'category' | 'store' | 'unknown'> {
    if (!query.trim()) return 'unknown';

    try {
      // Yeni search-custom endpoint'ini kullan
      const response = await axios.get(
        `https://api.trendruum.com/api/v1/products/search?include_filters=1&name=${encodeURIComponent(query)}&page=1`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 saniye timeout
        }
      );

      if (response.data.meta?.status === 'success') {
        const data = response.data.data;
        const queryLower = query.toLowerCase();

        // Tam eşleşme varsa türü döndür
        const brands = data.filters?.brands || [];
        const categories = data.filters?.categories || [];
        const staticStores = searchStores(query, 1);
        const apiSellers = data.filters?.sellers || [];
        
        // API seller'larını da kontrol et
        const allStores = [...staticStores];
        apiSellers.forEach((s: any) => {
          if (!allStores.some(store => store.id === s.id || store.name.toLowerCase() === s.name.toLowerCase())) {
            allStores.push({
              id: s.id,
              name: s.name,
              slug: s.slug,
              image: s.image?.url
            });
          }
        });
        
        if (brands.length > 0 && brands[0].name.toLowerCase() === queryLower) {
          return 'brand';
        }
        
        if (categories.length > 0 && categories[0].name.toLowerCase() === queryLower) {
          return 'category';
        }
        
        if (allStores.length > 0 && allStores[0].name.toLowerCase() === queryLower) {
          return 'store';
        }

        // Tam eşleşme yoksa ürün araması olarak kabul et
        return 'product';
      }
      
      return 'unknown';
    } catch (_error) {
      return 'unknown';
    }
  }
}

export const smartSearchService = SmartSearchService.getInstance();
