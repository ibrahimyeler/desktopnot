import { useState, useEffect } from 'react';
import { getCategoryBySlug, CategoryData } from '../data/categories';

export const useCategoryDropdown = (categorySlug: string) => {
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;

    // Statik verilerden kategori bilgisini al
    const fetchCategoryData = () => {
      setLoading(true);
      setError(null);
      
      try {
        // Statik verilerden kategori verisini al
        const staticCategoryData = getCategoryBySlug(categorySlug);
        
        if (staticCategoryData) {
          setCategoryData(staticCategoryData);
        } else {
          setError('Kategori verisi bulunamadı');
        }
      } catch (err) {
        setError('Kategori verisi yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    // Kısa bir delay ile loading state'i göster
    const timeoutId = setTimeout(fetchCategoryData, 100);
    
    return () => clearTimeout(timeoutId);
  }, [categorySlug]);

  return { categoryData, loading, error };
};
