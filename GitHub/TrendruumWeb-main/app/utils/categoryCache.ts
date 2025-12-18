// Alt kategoriler için cache sistemi
const subcategoriesCache = new Map<string, string[]>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 dakika

// Alt kategorileri API'den getir ve cache'le
export async function getSubcategoriesFromAPI(categorySlug: string): Promise<string[]> {
  try {
    const API_BASE_URL = 'https://api.trendruum.com';
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categorySlug}`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (data.meta?.status === 'success' && data.data?.children) {
      const subcategories = data.data.children.map((child: any) => child.slug);
      return subcategories;
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

// Tüm alt kategorileri (alt-alt kategoriler dahil) getir
export async function getAllSubcategoriesRecursive(categorySlug: string): Promise<string[]> {
  try {
    const API_BASE_URL = 'https://api.trendruum.com';
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categorySlug}`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (data.meta?.status === 'success' && data.data?.children) {
      const allSubcategories: string[] = [];
      
      // Ana alt kategorileri ekle
      const mainSubcategories = data.data.children.map((child: any) => child.slug);
      allSubcategories.push(...mainSubcategories);
      
      // Her alt kategori için alt-alt kategorileri de getir
      for (const subCategory of data.data.children) {
        try {
          const subResponse = await fetch(`${API_BASE_URL}/api/v1/categories/${subCategory.slug}`);
          if (subResponse.ok) {
            const subData = await subResponse.json();
            if (subData.meta?.status === 'success' && subData.data?.children) {
              const nestedSubcategories = subData.data.children.map((nestedChild: any) => nestedChild.slug);
              allSubcategories.push(...nestedSubcategories);
            }
          }
        } catch (error) {
        }
      }
      
      return allSubcategories;
    }
    
    return [];
  } catch (error) {
    return [];
  }
}

// Cache'den alt kategorileri al veya API'den getir
export async function getSubcategories(categorySlug: string): Promise<string[]> {
  const now = Date.now();
  const cached = subcategoriesCache.get(categorySlug);
  const expiry = cacheExpiry.get(categorySlug);
  
  // Cache geçerliyse kullan
  if (cached && expiry && now < expiry) {
    return cached;
  }
  
  // Cache geçersizse veya yoksa API'den getir (tüm alt kategoriler dahil)
  const subcategories = await getAllSubcategoriesRecursive(categorySlug);
  
  if (subcategories.length > 0) {
    subcategoriesCache.set(categorySlug, subcategories);
    cacheExpiry.set(categorySlug, now + CACHE_DURATION);
  }
  
  return subcategories;
}

// Cache'i temizle
export function clearCategoryCache(categorySlug?: string) {
  if (categorySlug) {
    subcategoriesCache.delete(categorySlug);
    cacheExpiry.delete(categorySlug);
  } else {
    subcategoriesCache.clear();
    cacheExpiry.clear();
  }
}

// Cache durumunu kontrol et
export function getCacheStatus() {
  const now = Date.now();
  const status: Record<string, { count: number; valid: boolean; expiresIn: number }> = {};
  
  subcategoriesCache.forEach((subcategories, categorySlug) => {
    const expiry = cacheExpiry.get(categorySlug);
    const valid = expiry ? now < expiry : false;
    const expiresIn = expiry ? expiry - now : 0;
    
    status[categorySlug] = {
      count: subcategories.length,
      valid,
      expiresIn
    };
  });
  
  return status;
}
