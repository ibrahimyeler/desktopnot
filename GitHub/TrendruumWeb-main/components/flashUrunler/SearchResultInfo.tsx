"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_V1_URL } from '@/lib/config';

interface SearchResultInfoProps {
  category?: string;
  resultCount?: number;
  totalCount?: number;
  loading?: boolean;
}

export default function SearchResultInfo({ 
  category: propCategory, 
  resultCount: propResultCount,
  totalCount: propTotalCount,
  loading: propLoading = false
}: SearchResultInfoProps) {
  // Başlangıçta hemen gösterilecek değerler
  const params = useParams();
  const categorySlug = params.category as string;
  
  // URL'den kategori adını hemen formatla (eğer varsa)
  const initialCategory = categorySlug
    ? categorySlug
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
    : propCategory || 'Arama';
  
  // State'leri başlangıç değerleriyle başlat
  const [category, setCategory] = useState(propCategory || initialCategory);
  const [resultCount, setResultCount] = useState(propResultCount || 0);
  const [totalCount, setTotalCount] = useState(propTotalCount || 0);
  const [loading, setLoading] = useState(propLoading);

  // Gerçek verileri arka planda yükle
  useEffect(() => {
    // Props'tan gelen değerler varsa onları kullan
    if (propCategory !== undefined) {
      setCategory(propCategory);
    }
    
    if (propResultCount !== undefined) {
      setResultCount(propResultCount);
    }
    
    if (propTotalCount !== undefined) {
      setTotalCount(propTotalCount);
    }
    
    // Props'tan değer gelmiyorsa ve categorySlug varsa API'den çek
    if ((!propCategory || propResultCount === undefined) && categorySlug) {
      const fetchCategoryData = async () => {
        try {
          // Kategori bilgisini çek
          const categoryResponse = await fetch(
            `${API_V1_URL}/categories/${categorySlug}`
          );
          const categoryData = await categoryResponse.json();
          
          if (categoryData.meta.status === 'success') {
            setCategory(categoryData.data.name);
          }
          
          // Ürün sayısını çek
          const productsResponse = await fetch(
            `${API_V1_URL}/category-products/${categorySlug}`
          );
          const productsData = await productsResponse.json();
          
          if (productsData.meta.status === 'success') {
            setResultCount(productsData.data.length);
          }
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };
      
      fetchCategoryData();
    } else {
      setLoading(propLoading);
    }
  }, [propCategory, propResultCount, categorySlug, propLoading]);

  // Kategori adını formatlama
  const formatCategoryName = (name: string) => {
    if (!name) return 'Arama';
    return name.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  // Yükleme durumunda bile estetik bir görünüm
  return (
    <div className="bg-white p-2.5 rounded-lg shadow-sm w-full">
      <div className="flex items-center whitespace-nowrap">
        <span className="font-semibold text-gray-800 text-xs sm:text-sm">&ldquo;{formatCategoryName(category)}&rdquo;</span>
        <span className="text-gray-600 mx-1 text-xs sm:text-sm">araması için sonuç listeleniyor</span>
      </div>
    </div>
  );
} 