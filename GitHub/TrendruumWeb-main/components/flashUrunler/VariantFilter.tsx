"use client";

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { API_V1_URL } from '@/lib/config';

interface VariantValue {
  name: string;
  slug: string;
  value: string;
}

interface Variant {
  id: string;
  name: string;
  slug: string;
  imageable: boolean;
  description: string;
  values: VariantValue[];
  updated_at: string;
  created_at: string;
}

interface VariantFilterProps {
  categorySlug: string;
  variantType?: string; // 'kapasite', 'boyut', etc.
  onFilterChange: (selectedVariants: string[]) => void;
}

const VariantFilter: React.FC<VariantFilterProps> = ({ 
  categorySlug, 
  variantType = 'kapasite',
  onFilterChange 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [variants, setVariants] = useState<VariantValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!categorySlug) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_V1_URL}/categories/${categorySlug}/filter-fields`);
        const data = await response.json();

        if (data.meta?.status === 'success' && data.data?.variants) {
          // Belirtilen variant tipini bul
          const targetVariant = data.data.variants.find((variant: Variant) => 
            variant.name.toLowerCase().includes(variantType.toLowerCase()) ||
            variant.slug.toLowerCase().includes(variantType.toLowerCase())
          );
          
          if (targetVariant && targetVariant.values) {
            setVariants(targetVariant.values);
          } else {
            setError(`${variantType} bilgileri bulunamadı`);
          }
        } else {
          setError('Variant bilgileri alınamadı');
        }
      } catch (error) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchVariants();
      // Kategori değiştiğinde seçili variant'ları sıfırla
      setSelectedVariants([]);
    }
  }, [categorySlug, variantType]);

  const handleVariantToggle = (variantId: string) => {
    const newSelectedVariants = selectedVariants.includes(variantId)
      ? selectedVariants.filter(id => id !== variantId)
      : [...selectedVariants, variantId];

    setSelectedVariants(newSelectedVariants);
    onFilterChange(newSelectedVariants);
  };

  const filteredVariants = variants.filter(variant =>
    variant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  if (error || variants.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span className="font-semibold text-sm text-gray-700">
          {variantType.charAt(0).toUpperCase() + variantType.slice(1)} {selectedVariants.length > 0 && `(${selectedVariants.length})`}
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
            placeholder={`${variantType} ara...`}
            className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="max-h-48 overflow-y-auto space-y-1 mt-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            {filteredVariants.map((variant) => (
              <label
                key={variant.slug}
                className={`flex items-center space-x-2 cursor-pointer group px-2 py-1 rounded-md
                  ${selectedVariants.includes(variant.slug) ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedVariants.includes(variant.slug)}
                  onChange={() => handleVariantToggle(variant.slug)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className={`text-xs ${
                  selectedVariants.includes(variant.slug) 
                    ? 'text-orange-500 font-medium' 
                    : 'text-gray-700 group-hover:text-orange-500'
                }`}>
                  {variant.name}
                </span>
              </label>
            ))}
            {filteredVariants.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-2">
                {variantType} bulunamadı
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VariantFilter; 