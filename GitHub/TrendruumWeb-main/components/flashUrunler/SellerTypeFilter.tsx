"use client";

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';

interface SellerType {
  name: string;
  count?: number;
  value: string;
}

interface SellerTypeFilterProps {
  categoryId: string;
  onFilterChange?: (selectedTypes: string[]) => void;
}

interface FilterField {
  type: string;
  name: string;
  values: string[];
}

interface FilterResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: FilterField[];
}

export default function SellerTypeFilter({ categoryId, onFilterChange }: SellerTypeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sellerTypes, setSellerTypes] = useState<SellerType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchSellerTypes = async () => {
      if (!categoryId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_V1_URL}/category-products-filter-fields/${categoryId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: FilterResponse = await response.json();

        if (data.meta?.status === 'success') {
          // API yanıtından satıcı tipi verilerini bul
          const sellerTypeAttribute = data.data.find(
            (item: FilterField) => item.type === 'seller_type'
          );

          if (sellerTypeAttribute) {
            // API'den gelen satıcı tiplerini dönüştür
            const sellerTypeData: SellerType[] = sellerTypeAttribute.values.map((value: string) => ({
              name: value,
              value: value.toLowerCase(),
              count: 0 // API count değeri vermiyorsa 0 kullan
            }));

            setSellerTypes(sellerTypeData);
          } else {
            setError('Satıcı tipi verisi bulunamadı');
          }
        } else {
          setError('API yanıtı başarısız');
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerTypes();
  }, [categoryId]);

  const handleTypeSelect = (typeValue: string) => {
    setSelectedTypes(prev => {
      const newSelected = prev.includes(typeValue)
        ? prev.filter(t => t !== typeValue)
        : [...prev, typeValue];
      
      onFilterChange?.(newSelected);
      return newSelected;
    });
  };

  // Yükleme durumunda veya veri yoksa bileşeni render etme
  if (loading || error || !sellerTypes || sellerTypes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2.5 rounded-lg shadow-sm w-full max-w-[220px]">
      <div className="flex items-center justify-between mb-1.5 cursor-pointer">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-semibold text-gray-800">Satıcı Tipi</h3>
          <button className="text-gray-500 hover:text-gray-700 transition-colors">
            <span className="text-xs text-gray-500 underline">Satıcı Tipi Nedir?</span>
          </button>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronUpIcon 
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
              isExpanded ? '' : 'rotate-180'
            }`} 
          />
        </button>
      </div>

      {error && (
        <div className="text-red-500 text-sm p-2">{error}</div>
      )}

      {loading && (
        <div className="p-4 text-center text-gray-500">Yükleniyor...</div>
      )}

      {isExpanded && sellerTypes.length > 0 && (
        <div className="space-y-2.5">
          {sellerTypes.map((type) => (
            <label 
              key={type.value}
              className="flex items-center justify-between hover:bg-gray-100 p-0.5 rounded cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded border-gray-300 text-[#F27A1A] focus:ring-[#F27A1A] focus:ring-offset-0 checked:bg-[#F27A1A] checked:hover:bg-[#F27A1A] checked:focus:bg-[#F27A1A]"
                  checked={selectedTypes.includes(type.value)}
                  onChange={() => handleTypeSelect(type.value)}
                />
                <span className="text-sm text-gray-700 ml-1.5">{type.name}</span>
              </div>
              {type.count !== undefined && type.count > 0 && (
                <span className="text-xs text-gray-500">({type.count})</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
} 