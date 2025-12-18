import { NextRequest, NextResponse } from 'next/server';

// Alt kategoriler için cache sistemi
const subcategoriesCache = new Map<string, string[]>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 dakika

// Tüm alt kategorileri (alt-alt kategoriler dahil) getir
async function getAllSubcategoriesRecursive(categorySlug: string): Promise<string[]> {
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
  async function getSubcategories(categorySlug: string): Promise<string[]> {
    const now = Date.now();
    const cached = subcategoriesCache.get(categorySlug);
    const expiry = cacheExpiry.get(categorySlug);
    
    // Cache geçerliyse kullan
    if (cached && expiry && now < expiry) {
      return cached;
    }
    
    // Cache geçersizse veya yoksa API'den getir
    const subcategories = await getAllSubcategoriesRecursive(categorySlug);
    
    if (subcategories.length > 0) {
      subcategoriesCache.set(categorySlug, subcategories);
      cacheExpiry.set(categorySlug, now + CACHE_DURATION);
    }
    
    return subcategories;
  }

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    
    // API base URL'ini al
    const API_BASE_URL = 'https://api.trendruum.com';
    
    // Query parametrelerini al
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '24';
    
    // Categories parametresini özel olarak işle
    const categories = searchParams.get('categories');
    const categoriesParams: string[] = [];
    
    // Ana categories parametresi
    if (categories) {
      categoriesParams.push(categories);
    }
    
    // Ek categories parametreleri (categories_1, categories_2, etc.)
    searchParams.forEach((value, key) => {
      if (key.startsWith('categories_')) {
        categoriesParams.push(value);
      }
    });
    
    // Tüm categories'leri birleştir
    const allCategories = categoriesParams.join(',');
    
    // Diğer query parametrelerini topla (categories hariç)
    const queryParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== 'page' && key !== 'limit' && !key.startsWith('categories')) {
        queryParams.append(key, value);
      }
    });
    
    // API URL'ini oluştur
    let apiUrl = `${API_BASE_URL}/api/v1/categories/${slug}/products?page=${page}&limit=${limit}`;
    
    // Categories parametresini ekle
    if (allCategories) {
      apiUrl += `&categories=${allCategories}`;
    } else {
      // Alt kategorileri olan kategoriler için dinamik olarak alt kategorileri al
      const subcategories = await getAllSubcategoriesRecursive(slug);
      
      if (subcategories.length > 0) {
        apiUrl += `&categories=${subcategories.join(',')}`;
      }
    }
    
    // Diğer parametreleri ekle
    if (queryParams.toString()) {
      apiUrl += `&${queryParams.toString()}`;
    }
    
    
    // Kategori ürünlerini getir
    const productsResponse = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
    
    if (!productsResponse.ok) {
      const errorText = await productsResponse.text();
      return NextResponse.json(
        { error: 'Ürünler yüklenemedi', status: productsResponse.status, details: errorText },
        { status: productsResponse.status }
      );
    }
    
    const productsData = await productsResponse.json();
    
    
    return NextResponse.json(productsData);
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Ürünler alınamadı',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
