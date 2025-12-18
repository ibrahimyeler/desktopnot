import React from 'react'
import axios from 'axios';
import CategoryPageClient from './CategoryPageClient';

// Server-side data fetching functions
async function getCategoryData(category: string) {
  // Category slug'ını encode et
  const encodedCategory = encodeURIComponent(category);
  const apiUrl = `https://api.trendruum.com/api/v1/categories/${encodedCategory}`;
  
  try {
    const response = await axios.get(apiUrl, {
      timeout: 10000, // SSR için timeout'u 10 saniyeye çıkar (büyük kategoriler için)
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.data?.meta?.status === 'success') {
      return response.data.data;
    }
    return null;
  } catch (_error: any) {
    return null;
  }
}

async function getCategoryProducts(category: string, page: number = 1, limit: number = 20, filters?: { sort_types?: string; a_cinsiyet?: string }) {
  // Category slug'ını encode et
  const encodedCategory = encodeURIComponent(category);
  const apiUrl = `https://api.trendruum.com/api/v1/categories/${encodedCategory}/products`;
  
  try {
    const params: any = {
      page,
      limit
    };
    
    // Filtreleri ekle
    if (filters?.sort_types) {
      params.sort_types = filters.sort_types;
    }
    if (filters?.a_cinsiyet) {
      params.a_cinsiyet = filters.a_cinsiyet;
    }
    
    const response = await axios.get(apiUrl, {
      timeout: 5000, // SSR için timeout'u 5 saniyeye çıkar
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      params
    });
    
    if (response.data?.meta?.status === 'success') {
      return {
        data: response.data.data || [],
        pagination: response.data.pagination || {
          current_page: page,
          per_page: limit,
          total: response.data.data?.length || 0,
          last_page: 1
        }
      };
    }
    return null;
  } catch (_error: any) {
    return null;
  }
}


// Server component
export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ category: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  
  // Category slug'ını decode et (eğer encode edilmişse)
  const decodedCategory = decodeURIComponent(category);
  
  // URL'den filtreleri oku
  const sortTypes = resolvedSearchParams?.sort_types as string | undefined;
  const genderParam = resolvedSearchParams?.g as string | undefined;
  let aCinsiyet: string | undefined;
  
  // g parametresini a_cinsiyet'e çevir
  if (genderParam === '1') {
    aCinsiyet = 'kadin-kiz';
  } else if (genderParam === '2') {
    aCinsiyet = 'erkek';
  }
  
  // Server-side data fetching - optimize to avoid duplicate API calls
  // URL'de filtreler varsa, filtreli ürünleri çek
  const filters = (sortTypes || aCinsiyet) ? {
    sort_types: sortTypes,
    a_cinsiyet: aCinsiyet
  } : undefined;
  
  const categoryData = await getCategoryData(decodedCategory);
  const initialProducts = categoryData 
    ? await getCategoryProducts(decodedCategory, 1, 24, filters) // limit'i 24'e çıkar (client-side ile aynı)
    : null;

  // Extract subcategories from categoryData to avoid duplicate API call
  const subCategories = categoryData?.children || [];

  // Eğer kategori verisi yoksa, CategoryPageClient'a null gönder
  // Client-side'da hata yönetimi yapılacak
  return (
    <CategoryPageClient 
      category={decodedCategory}
      initialCategoryData={categoryData}
      initialProducts={initialProducts}
      initialSubCategories={subCategories}
      categoryExists={!!categoryData}
    />
  );
}
