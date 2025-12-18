"use client";

import { useState, useEffect } from 'react';
import { ChevronUpIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';

interface Seller {
  name: string;
  count?: number;
  value: string;
}

interface SellerFilterProps {
  categoryId: string;
  onFilterChange?: (selectedSellers: string[]) => void;
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

export default function SellerFilter({ categoryId, onFilterChange }: SellerFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);

  useEffect(() => {
    const fetchSellers = async () => {
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
          // API yanıtından satıcı verilerini bul
          const sellerAttribute = data.data.find(
            (item: FilterField) => item.type === 'seller'
          );

          if (sellerAttribute) {
            // API'den gelen satıcıları dönüştür
            const sellerData: Seller[] = sellerAttribute.values.map((value: string) => ({
              name: value,
              value: value.toLowerCase(),
              count: 0 // API count değeri vermiyorsa 0 kullan
            }));

            setSellers(sellerData);
          } else {
            setError('Satıcı verisi bulunamadı');
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

    fetchSellers();
  }, [categoryId]);

  const handleSellerSelect = (sellerValue: string) => {
    setSelectedSellers(prev => {
      const newSelected = prev.includes(sellerValue)
        ? prev.filter(s => s !== sellerValue)
        : [...prev, sellerValue];
      
      onFilterChange?.(newSelected);
      return newSelected;
    });
  };

  const filteredSellers = sellers.filter(seller =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Yükleme durumunda veya veri yoksa bileşeni render etme
  if (loading || error || !sellers || sellers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2.5 rounded-lg shadow-sm w-full max-w-[220px]">
      <div className="flex items-center justify-between mb-1.5 cursor-pointer">
        <div className="flex items-center gap-1">
          <h3 className="text-sm font-semibold text-gray-800">Satıcı</h3>
          <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500 cursor-help" />
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

      {isExpanded && sellers.length > 0 && (
        <>
          <div className="mb-1.5">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tüm Satıcılarda Ara"
              className="w-full px-2 py-1 border rounded text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            />
          </div>

          <div className="mb-1.5">
            <h4 className="text-sm text-gray-700 mb-1.5 flex items-center gap-1">
              Onaylanmış ve Yetkili Satıcılar
              <QuestionMarkCircleIcon className="w-4 h-4 text-gray-500 cursor-help" />
            </h4>
          </div>

          <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1">
            {filteredSellers.map((seller) => (
              <label 
                key={seller.value}
                className="flex items-center justify-between hover:bg-gray-100 p-0.5 rounded cursor-pointer"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox h-4 w-4 rounded border-gray-300 text-[#F27A1A] focus:ring-[#F27A1A] focus:ring-offset-0 checked:bg-[#F27A1A] checked:hover:bg-[#F27A1A] checked:focus:bg-[#F27A1A]"
                    checked={selectedSellers.includes(seller.value)}
                    onChange={() => handleSellerSelect(seller.value)}
                  />
                  <span className="text-sm text-gray-700 ml-1.5">{seller.name}</span>
                </div>
                {seller.count !== undefined && seller.count > 0 && (
                  <span className="text-xs text-gray-500">({seller.count})</span>
                )}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
} 