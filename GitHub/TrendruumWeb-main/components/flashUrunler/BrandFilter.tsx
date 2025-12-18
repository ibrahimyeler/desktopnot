"use client";

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { API_V1_URL } from '@/lib/config';

interface Brand {
  id: string;
  name: string;
  slug: string;
  status: string;
  ty_id: string;
  url: string;
}

interface BrandFilterProps {
  categorySlug: string;
  onFilterChange: (selectedBrands: string[]) => void;
  onProductsFetch?: (products: any[]) => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function BrandFilter({ 
  categorySlug, 
  onFilterChange, 
  onProductsFetch,
  onLoadingChange 
}: BrandFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_V1_URL}/categories/${categorySlug}/filter-fields`);
        const data = await response.json();

        if (data.meta?.status === 'success' && data.data?.brands) {
          // Sadece active olan markaları filtrele
          const activeBrands = data.data.brands.filter((brand: Brand) => brand.status === 'active');
          setBrands(activeBrands);
        } else {
          setError('Marka bilgileri alınamadı');
        }
      } catch (error) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchBrands();
      // Kategori değiştiğinde seçili markaları sıfırla
      setSelectedBrands([]);
    }
  }, [categorySlug]);

  const fetchProductsByBrands = async (brandIds: string[]) => {
    if (!categorySlug || brandIds.length === 0) {
      // Eğer marka seçili değilse, tüm ürünleri getir
      if (onProductsFetch) {
        try {
          onLoadingChange?.(true);
          const response = await fetch(`${API_V1_URL}/categories/${categorySlug}/products`);
          const data = await response.json();
          
          if (data.meta?.status === 'success') {
            onProductsFetch(data.data || []);
          } else {
            onProductsFetch([]);
          }
        } catch (error) {
          onProductsFetch([]);
        } finally {
          onLoadingChange?.(false);
        }
      }
      return;
    }

    try {
      onLoadingChange?.(true);
      
      // Seçili markaların slug'larını al
      const selectedBrandSlugs = brands
        .filter(brand => brandIds.includes(brand.id))
        .map(brand => brand.slug || brand.name.toLowerCase().replace(/\s+/g, '-'));
      
      // Her marka için ayrı ayrı API çağrısı yap
      const promises = selectedBrandSlugs.map(brandSlug => 
        fetch(`${API_V1_URL}/categories/${categorySlug}/products?brand=${brandSlug}`)
          .then(res => res.json())
          .then(data => data.data || [])
          .catch(() => [])
      );

      const results = await Promise.all(promises);
      const allProducts = results.flat();
      
      if (onProductsFetch) {
        onProductsFetch(allProducts);
      }
    } catch (error) {
      if (onProductsFetch) {
        onProductsFetch([]);
      }
    } finally {
      onLoadingChange?.(false);
    }
  };

  const handleBrandToggle = (brandId: string) => {
    const newSelectedBrands = selectedBrands.includes(brandId)
      ? selectedBrands.filter(id => id !== brandId)
      : [...selectedBrands, brandId];
    
    setSelectedBrands(newSelectedBrands);
    onFilterChange(newSelectedBrands); // Seçili markaları üst bileşene bildir
    
    // Yeni ürünleri getir
    fetchProductsByBrands(newSelectedBrands);
  };

  const filteredBrands = brands
    .filter(brand => 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Seçili markalar üstte gösterilsin
      if (selectedBrands.includes(a.id) && !selectedBrands.includes(b.id)) return -1;
      if (!selectedBrands.includes(a.id) && selectedBrands.includes(b.id)) return 1;
      return a.name.localeCompare(b.name);
    });

  if (loading) {
    return (
      <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || brands.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span className="font-semibold text-sm text-gray-700">
          Markalar {selectedBrands.length > 0 && `(${selectedBrands.length})`}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Marka Ara..."
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="max-h-48 overflow-y-auto space-y-1 mt-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            {filteredBrands.map((brand) => (
              <label
                key={brand.id}
                className={`flex items-center space-x-2 cursor-pointer group px-2 py-1 rounded-md
                  ${selectedBrands.includes(brand.id) ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => handleBrandToggle(brand.id)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className={`text-xs ${
                  selectedBrands.includes(brand.id) 
                    ? 'text-orange-500 font-medium' 
                    : 'text-gray-700 group-hover:text-orange-500'
                }`}>
                  {brand.name}
                </span>
              </label>
            ))}
            {filteredBrands.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-2">
                Marka bulunamadı
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
