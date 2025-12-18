"use client";

import { useState, useEffect } from 'react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';

interface Gender {
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
  };
  data: FilterField[];
}

interface GenderFilterProps {
  categoryId: string;
  onFilterChange?: (selectedGenders: string[]) => void;
}

export default function GenderFilter({ categoryId, onFilterChange }: GenderFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [genders, setGenders] = useState<Gender[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenders = async () => {
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

        const data = await response.json() as FilterResponse;

        if (data.meta?.status === 'success') {
          // API yanıtından cinsiyet verilerini bul
          const genderAttribute = data.data.find(
            (item: FilterField) => item.type === 'attribute' && item.name === 'Cinsiyet'
          );

          if (genderAttribute) {
            // Values dizisini Gender[] formatına dönüştür
            const genderData: Gender[] = genderAttribute.values.map((value: string) => ({
              name: value,
              value: value.toLowerCase(), // value için küçük harfli versiyonu kullan
              count: 0 // API count değeri vermediği için 0 kullanıyoruz
            }));

            setGenders(genderData);
          } else {
            setError('Cinsiyet verisi bulunamadı');
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

    fetchGenders();
  }, [categoryId]);

  const handleGenderChange = (genderValue: string) => {
    setSelectedGenders(prev => {
      const newSelected = prev.includes(genderValue)
        ? prev.filter(g => g !== genderValue)
        : [...prev, genderValue];
      
      // Parent komponente seçili cinsiyetleri bildir
      onFilterChange?.(newSelected);
      
      return newSelected;
    });
  };

  // Yükleme durumunda veya veri yoksa bileşeni render etme
  if (loading || error || !genders || genders.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-2.5 rounded-lg shadow-sm w-full max-w-[220px]">
      <div className="flex items-center justify-between mb-1.5 cursor-pointer">
        <h3 className="text-sm font-semibold text-gray-800">Cinsiyet</h3>
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

      {isExpanded && genders.length > 0 && (
        <div className="space-y-2.5">
          {genders.map((gender) => (
            <label 
              key={gender.value} 
              className="flex items-center hover:bg-gray-100 p-0.5 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 rounded border-gray-300 text-[#F27A1A] focus:ring-[#F27A1A] focus:ring-offset-0 checked:bg-[#F27A1A] checked:hover:bg-[#F27A1A] checked:focus:bg-[#F27A1A]"
                checked={selectedGenders.includes(gender.value)}
                onChange={() => handleGenderChange(gender.value)}
              />
              <span className="text-sm text-gray-700 ml-1.5">{gender.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
} 