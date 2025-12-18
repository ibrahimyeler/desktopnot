"use client";

import { useState, useCallback, useEffect } from 'react';
import { API_V1_URL } from '@/lib/config';
import { STATIC_CATEGORIES } from '@/data/categories';

interface CategoryWithDetails {
  id: string;
  name: string;
  slug: string;
  children?: CategoryWithDetails[];
  shipping_policy?: string;
  breadcrumb?: CategoryWithDetails[];
  parent?: CategoryWithDetails;
  is_adult?: boolean;
}

// localStorage key ve cache süresi (24 saat)
const CATEGORIES_STORAGE_KEY = 'trendruum_categories_cache';
const CATEGORIES_CACHE_TIMESTAMP_KEY = 'trendruum_categories_cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 saat (milisaniye)

// localStorage'dan kategorileri oku (sadece geçerli cache için)
function getCategoriesFromStorage(): any[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const cachedTimestamp = localStorage.getItem(CATEGORIES_CACHE_TIMESTAMP_KEY);
    
    if (!cachedData || !cachedTimestamp) {
      return null;
    }
    
    const timestamp = parseInt(cachedTimestamp, 10);
    const now = Date.now();
    
    // Cache süresi dolmuş mu kontrol et
    if (now - timestamp > CACHE_DURATION) {
      return null;
    }
    
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Error reading categories from storage:', error);
    return null;
  }
}

// localStorage'dan kategorileri oku (expired cache dahil - hata durumunda kullanmak için)
function getCategoriesFromStorageIncludingExpired(): any[] | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    
    if (!cachedData) {
      return null;
    }
    
    return JSON.parse(cachedData);
  } catch (error) {
    console.error('Error reading categories from storage (including expired):', error);
    return null;
  }
}

// localStorage'a kategorileri kaydet
function saveCategoriesToStorage(categories: any[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
    localStorage.setItem(CATEGORIES_CACHE_TIMESTAMP_KEY, String(Date.now()));
  } catch (error) {
    console.error('Error saving categories to storage:', error);
  }
}

// Arka planda cache'i güncelle (background refresh)
async function updateCategoriesCacheInBackground(): Promise<void> {
  try {
    const response = await fetch(`${API_V1_URL}/categories`);
    const data = await response.json();

    if (data.meta?.status === 'success' && data.data) {
      saveCategoriesToStorage(data.data);
      console.log('Categories cache updated in background.');
    }
  } catch (error) {
    console.error('Background categories cache update failed:', error);
  }
}

// Basit in-memory cache: Tüm kategori ağacını aynı sekme içinde yalnızca bir kez çeker
let allCategoriesCache: any[] | null = null;
let allCategoriesPromise: Promise<any[] | null> | null = null;

async function getAllCategories(): Promise<any[] | null> {
  // Önce localStorage'dan kontrol et
  const cachedCategories = getCategoriesFromStorage();
  if (cachedCategories) {
    const now = Date.now();
    const cachedTimestamp = localStorage.getItem(CATEGORIES_CACHE_TIMESTAMP_KEY);
    const timestamp = cachedTimestamp ? parseInt(cachedTimestamp, 10) : 0;
    
    // In-memory cache'i de güncelle
    allCategoriesCache = cachedCategories;
    
    // Cache'in %80'i dolduysa arka planda güncelleme yap
    if (now > timestamp + CACHE_DURATION * 0.8) {
      console.log('Categories cache is nearing expiry, updating in background...');
      // Arka planda güncelleme yap, sonucu bekleme
      updateCategoriesCacheInBackground();
    }
    
    return cachedCategories;
  }

  // Daha önce başarıyla alınmışsa direkt cache'den dön
  if (allCategoriesCache) {
    return allCategoriesCache;
  }

  // Devam eden bir istek varsa onu bekle (parallel çağrıları birleştir)
  if (allCategoriesPromise) {
    return allCategoriesPromise;
  }

  // Eski cache'i sakla (hata durumunda kullanmak için - expired dahil)
  const expiredCache = getCategoriesFromStorageIncludingExpired();

  allCategoriesPromise = (async () => {
    try {
      console.log('Fetching categories from API...');
      const response = await fetch(`${API_V1_URL}/categories`);
      const data = await response.json();

      if (data.meta?.status === 'success' && data.data) {
        allCategoriesCache = data.data;
        
        // localStorage'a kaydet
        saveCategoriesToStorage(data.data);
        
        return allCategoriesCache;
      }

      return null;
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Hata durumunda eski cache varsa onu kullan (expired olsa bile)
      if (expiredCache) {
        console.log('Using expired cache due to API error.');
        // Expired cache'i de kaydet (bir sonraki sefere kullanmak için)
        saveCategoriesToStorage(expiredCache);
        return expiredCache;
      }
      return null;
    } finally {
      // Başarısız olursa bir sonraki isteğe izin verelim
      if (!allCategoriesCache) {
        allCategoriesPromise = null;
      }
    }
  })();

  return allCategoriesPromise;
}

export const useCategoryData = (category: string, initialCategoryData?: any, initialSubCategories?: any[]) => {
  const [categoryData, setCategoryData] = useState<CategoryWithDetails | null>(initialCategoryData || null);
  const [subCategories, setSubCategories] = useState<any[]>(initialSubCategories || []);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [availableColors, setAvailableColors] = useState<any[]>([]);
  const [availableGenders, setAvailableGenders] = useState<any[]>([]);
  const [categoryAttributes, setCategoryAttributes] = useState<any[]>([]);
  const [sortOptions, setSortOptions] = useState<any[]>([]);
  const [breadcrumbItems, setBreadcrumbItems] = useState<any[]>([]);
  const [seoData, setSeoData] = useState<{
    seo_title?: string | null;
    seo_desc?: any[] | null;
    seo_keywords?: string | null;
    keywords?: string[] | null;
  }>({});

  // Alt kategorileri getir ve ürün sayılarını hesapla
  const fetchSubcategoriesWithCounts = useCallback(async (categorySlug: string) => {
    setSubCategoriesLoading(true);
    try {
      const response = await fetch(`/api/v1/categories/${categorySlug}`);
      const data = await response.json();
      
      if (data.meta.status === 'success' && data.data) {
        const categoryData = data.data.category || data.data;
        setCategoryData(categoryData);
        
        const children = categoryData.children || [];
        if (children.length > 0) {
          // Alt kategorileri direkt set et - ürün sayısı gereksiz API çağrısı yapıyordu, kaldırıldı
          setSubCategories(children.map((subCategory: any) => ({
            ...subCategory,
            product_count: subCategory.product_count || 0 // Eğer API'den geliyorsa kullan, yoksa 0
          })));
        }
        
        // Sıralama seçeneklerini ayarla
        if (categoryData.sort_options && Array.isArray(categoryData.sort_options)) {
          const formattedSortOptions = categoryData.sort_options.map((option: any) => ({
            value: option.value,
            label: option.label,
            type: option.type
          }));
          setSortOptions(formattedSortOptions);
        }
        
        // SEO verilerini ayarla
        setSeoData({
          seo_title: categoryData.seo_title,
          seo_desc: categoryData.seo_desc,
          seo_keywords: categoryData.seo_keywords,
          keywords: categoryData.keywords
        });
      }
    } catch (error) {
      // Error handling
    } finally {
      setSubCategoriesLoading(false);
    }
  }, []);

  // Kategori filtrelerini getir
  const fetchCategoryFilters = useCallback(async (categorySlug: string) => {
    try {
      const response = await fetch(`https://api.trendruum.com/api/v1/categories/${categorySlug}/filters`);
      const data = await response.json();
      
      if (data.meta?.status === 'success' && data.data) {
        const categoryDataFromFilters = data.data.category;
        const filtersData = data.data.filters;
        
        // categoryData'yı sadece daha önce set edilmediyse set et (sonsuz döngüyü önlemek için)
        setCategoryData((prevCategoryData) => {
          // Eğer aynı kategori verisi zaten varsa güncelleme
          if (prevCategoryData?.id === categoryDataFromFilters?.id) {
            return prevCategoryData;
          }
          return categoryDataFromFilters;
        });
        
        const attributes = filtersData.attributes || [];
        const variants = filtersData.variants || [];
        
        // Hem attributes hem de variants'ı categoryAttributes'a ekle
        const allAttributes = [...attributes, ...variants];
        setCategoryAttributes(allAttributes);
        
        // Renk variant'ını bul
        const colorVariant = variants.find((v: any) => v.slug === 'renk');
        let hasValidColors = false;
        
        if (colorVariant?.values) {
          const validColors = colorVariant.values.filter((color: any) => color?.name && color?.slug);
          if (validColors.length > 0) {
            setAvailableColors(validColors);
            hasValidColors = true;
          }
        }
        
        // Eğer variant'ta renk yoksa, attributes'tan renk attribute'unu kontrol et
        if (!hasValidColors) {
          const colorAttribute = attributes.find((attr: any) => attr.slug === 'renk' || attr.slug === 'web-color');
          if (colorAttribute?.values) {
            const validColors = colorAttribute.values.filter((color: any) => color?.name && color?.slug);
            if (validColors.length > 0) {
              setAvailableColors(validColors);
              hasValidColors = true;
            }
          }
        }
        
        // Web Color attribute'ını renk olarak da kullan (eğer henüz renk bulunamadıysa)
        if (!hasValidColors) {
          const webColorAttribute = attributes.find((attr: any) => attr.slug === 'web-color');
          if (webColorAttribute?.values) {
            setAvailableColors(webColorAttribute.values);
          }
        }
        
        // Cinsiyet attribute'ını bul
        const genderAttribute = attributes.find((attr: any) => attr.slug === 'cinsiyet');
        if (genderAttribute) {
          setAvailableGenders(genderAttribute.values || []);
        }
      }
    } catch (error) {
      // Error handling
    }
  }, []);

  // Sıralama seçeneklerini getir
  const fetchSortOptions = useCallback(async (categorySlug: string) => {
    try {
      const response = await fetch(`https://api.trendruum.com/api/v1/categories/${categorySlug}`);
      const data = await response.json();
      
      if (data.meta?.status === 'success' && data.data) {
        const categoryData = data.data.category || data.data;
        
        if (categoryData.sort_options && Array.isArray(categoryData.sort_options)) {
          const formattedSortOptions = categoryData.sort_options.map((option: any) => ({
            id: option.value || option.id,
            name: option.label || option.name,
            value: option.value || option.id
          }));
          setSortOptions(formattedSortOptions);
        } else {
          // Backend'in desteklediği sıralama seçenekleri
          const defaultSortOptions = [
            { id: 'recommended', name: 'Önerilen', value: 'recommended' },
            { id: 'price_asc', name: 'En düşük fiyat', value: 'price_asc' },
            { id: 'price_desc', name: 'En yüksek fiyat', value: 'price_desc' },
            { id: 'name_asc', name: 'A-Z', value: 'name_asc' },
            { id: 'name_desc', name: 'Z-A', value: 'name_desc' }
          ];
          setSortOptions(defaultSortOptions);
        }
      }
    } catch (error) {
      // Backend'in desteklediği sıralama seçenekleri
      const defaultSortOptions = [
        { id: 'recommended', name: 'Önerilen', value: 'recommended' },
        { id: 'price_asc', name: 'En düşük fiyat', value: 'price_asc' },
        { id: 'price_desc', name: 'En yüksek fiyat', value: 'price_desc' },
        { id: 'name_asc', name: 'A-Z', value: 'name_asc' },
        { id: 'name_desc', name: 'Z-A', value: 'name_desc' }
      ];
      setSortOptions(defaultSortOptions);
    }
  }, []);

  // Parent kategorileri bulup breadcrumb'a ekleyen fonksiyon
  const findParentCategories = useCallback(async (categorySlug: string, currentCategoryData?: CategoryWithDetails | null) => {
    const parentCategories: any[] = [];
    
    // Önce mevcut categoryData'yı kontrol et (parametre olarak geçildiyse)
    const dataToUse = currentCategoryData || categoryData;
    if (dataToUse && dataToUse.breadcrumb && dataToUse.breadcrumb.length > 0) {
      // API'den gelen breadcrumb verilerini kullan
      dataToUse.breadcrumb.forEach((breadcrumbItem: any) => {
        parentCategories.push({
          name: breadcrumbItem.name,
          href: `/${breadcrumbItem.slug}`,
          isLogo: false
        });
      });
      return parentCategories;
    }
    
    // API'den tüm kategorileri çek ve kontrol et (cache'lenmiş)
    const allCategories = await getAllCategories();
    if (allCategories && Array.isArray(allCategories)) {
      // Kategori hiyerarşisini bul
      const findCategoryPath = (categories: any[], targetSlug: string, currentPath: any[] = []): any[] | null => {
        for (const category of categories) {
          const newPath = [...currentPath, category];
          
          // Bu kategori hedef kategori mi?
          if (category.slug === targetSlug) {
            return newPath;
          }
          
          // Alt kategorileri kontrol et
          if (category.children && category.children.length > 0) {
            const found = findCategoryPath(category.children, targetSlug, newPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const path = findCategoryPath(allCategories, categorySlug);
      if (path && path.length > 1) {
        // Ana kategori ve alt kategorileri ekle
        path.forEach((category: any) => {
          parentCategories.push({
            name: category.name,
            href: `/${category.slug}`,
            isLogo: false
          });
        });
        return parentCategories;
      }
    }
    
    // Fallback: Statik kategorileri kontrol et
    for (const [mainCategorySlug, mainCategory] of Object.entries(STATIC_CATEGORIES)) {
      // Ana kategori kendisi mi?
      if (mainCategorySlug === categorySlug) {
        parentCategories.push({
          name: mainCategory.name,
          href: `/${mainCategorySlug}`,
          isLogo: false
        });
        break;
      }
      
      // 1. derece alt kategorileri kontrol et
      for (const subCategory of mainCategory.children || []) {
        if (subCategory.slug === categorySlug) {
          parentCategories.push({
            name: mainCategory.name,
            href: `/${mainCategorySlug}`,
            isLogo: false
          });
          parentCategories.push({
            name: subCategory.name,
            href: `/${subCategory.slug}`,
            isLogo: false
          });
          break;
        }
        
        // 2. derece alt kategorileri kontrol et
        for (const subSubCategory of subCategory.children || []) {
          if (subSubCategory.slug === categorySlug) {
            parentCategories.push({
              name: mainCategory.name,
              href: `/${mainCategorySlug}`,
              isLogo: false
            });
            parentCategories.push({
              name: subCategory.name,
              href: `/${subCategory.slug}`,
              isLogo: false
            });
            parentCategories.push({
              name: subSubCategory.name,
              href: `/${subSubCategory.slug}`,
              isLogo: false
            });
            break;
          }
        }
      }
    }
    
    return parentCategories;
  }, [categoryData]);

  // Breadcrumb oluşturma
  const fetchBreadcrumb = useCallback(async () => {
    if (!category) return;
    
    // Trendruum ile başla
    const breadcrumbItems = [
      { name: 'Trendruum', href: '/', isLogo: true }
    ];
    
    // Parent kategorileri bul ve ekle - mevcut categoryData'yı geç
    const parentCategories = await findParentCategories(category, categoryData);
    breadcrumbItems.push(...parentCategories);
    
    setBreadcrumbItems(breadcrumbItems);
  }, [category, categoryData, findParentCategories]);

  // İlk yükleme - initialCategoryData varsa API çağrısı yapma
  useEffect(() => {
    if (category) {
      // Eğer initialCategoryData varsa ve yeterli veri içeriyorsa, API çağrısı yapma
      if (initialCategoryData && (initialCategoryData.id || initialCategoryData.slug || initialCategoryData.name)) {
        // initialCategoryData'dan gelen verileri kullan
        if (initialCategoryData.children && initialCategoryData.children.length > 0) {
          setSubCategories(initialCategoryData.children.map((subCategory: any) => ({
            ...subCategory,
            product_count: subCategory.product_count || 0
          })));
        }
        
        // Sıralama seçeneklerini ayarla
        if (initialCategoryData.sort_options && Array.isArray(initialCategoryData.sort_options)) {
          const formattedSortOptions = initialCategoryData.sort_options.map((option: any) => ({
            value: option.value,
            label: option.label,
            type: option.type
          }));
          setSortOptions(formattedSortOptions);
        }
        
        // SEO verilerini ayarla
        setSeoData({
          seo_title: initialCategoryData.seo_title,
          seo_desc: initialCategoryData.seo_desc,
          seo_keywords: initialCategoryData.seo_keywords,
          keywords: initialCategoryData.keywords
        });
      } else {
        // initialCategoryData yoksa veya eksikse API çağrısı yap
        fetchSubcategoriesWithCounts(category);
      }
      
      // Filtreler her zaman çekilmeli (farklı endpoint)
      fetchCategoryFilters(category);
      fetchBreadcrumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, initialCategoryData]);

  // categoryData değiştiğinde breadcrumb'ı yeniden oluştur (sadece categoryData değiştiğinde)
  useEffect(() => {
    if (category && categoryData) {
      fetchBreadcrumb();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryData]);

  return {
    categoryData,
    subCategories,
    subCategoriesLoading,
    availableColors,
    availableGenders,
    categoryAttributes,
    sortOptions,
    breadcrumbItems,
    seoData
  };
};
