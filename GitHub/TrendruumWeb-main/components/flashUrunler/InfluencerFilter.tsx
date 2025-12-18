"use client";

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';

interface Influencer {
  name: string;
  count?: number;
  value: string;
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

interface InfluencerFilterProps {
  categoryId: string;
  onFilterChange?: (selectedInfluencers: string[]) => void;
}

export default function InfluencerFilter({ categoryId, onFilterChange }: InfluencerFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedInfluencers, setSelectedInfluencers] = useState<string[]>([]);

  useEffect(() => {
    const fetchInfluencers = async () => {
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
          // API yanıtından fenomen verilerini bul
          const influencerAttribute = data.data.find(
            (item: FilterField) => item.type === 'influencer'
          );

          if (influencerAttribute) {
            // API'den gelen fenomenleri dönüştür
            const influencerData: Influencer[] = influencerAttribute.values.map((value: string) => ({
              name: value,
              value: value.toLowerCase(),
              count: 0 // API count değeri vermiyorsa 0 kullan
            }));

            setInfluencers(influencerData);
          } else {
            setError('Fenomen verisi bulunamadı');
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

    fetchInfluencers();
  }, [categoryId]);

  const handleInfluencerSelect = (influencerValue: string) => {
    setSelectedInfluencers(prev => {
      const newSelected = prev.includes(influencerValue)
        ? prev.filter(i => i !== influencerValue)
        : [...prev, influencerValue];
      
      onFilterChange?.(newSelected);
      return newSelected;
    });
  };

  // Yükleme durumunda veya veri yoksa bileşeni render etme
  if (loading || error || !influencers || influencers.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2.5 rounded-lg shadow-sm w-full max-w-[220px]">
      <div className="flex items-center justify-between mb-1.5 cursor-pointer">
        <h3 className="text-sm font-semibold text-gray-800">Fenomenlerin Seçtikleri</h3>
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

      {isExpanded && influencers.length > 0 && (
        <div className="space-y-2.5">
          {influencers.map((influencer) => (
            <label 
              key={influencer.value}
              className="flex items-center justify-between hover:bg-gray-100 p-0.5 rounded cursor-pointer"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 rounded border-gray-300 text-[#F27A1A] focus:ring-[#F27A1A] focus:ring-offset-0 checked:bg-[#F27A1A] checked:hover:bg-[#F27A1A] checked:focus:bg-[#F27A1A]"
                  checked={selectedInfluencers.includes(influencer.value)}
                  onChange={() => handleInfluencerSelect(influencer.value)}
                />
                <span className="text-sm text-gray-700 ml-1.5">{influencer.name}</span>
              </div>
              {influencer.count !== undefined && influencer.count > 0 && (
                <span className="text-xs text-gray-500">({influencer.count})</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
} 