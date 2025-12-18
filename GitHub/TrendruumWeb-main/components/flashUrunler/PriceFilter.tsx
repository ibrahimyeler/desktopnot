"use client";

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';

interface PriceRange {
  min: number;
  max: number;
}

interface PriceFilterProps {
  categorySlug: string;
  onFilterChange: (range: PriceRange) => void;
  initialPriceRange: PriceRange;
}

export default function PriceFilter({ 
  onFilterChange,
  initialPriceRange
}: PriceFilterProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [minPrice, setMinPrice] = useState<number>(initialPriceRange.min);
  const [maxPrice, setMaxPrice] = useState<number>(initialPriceRange.max);
  const [tempMin, setTempMin] = useState(initialPriceRange.min.toString());
  const [tempMax, setTempMax] = useState(initialPriceRange.max.toString());

  useEffect(() => {
    setMinPrice(initialPriceRange.min);
    setMaxPrice(initialPriceRange.max);
    setTempMin(initialPriceRange.min.toString());
    setTempMax(initialPriceRange.max.toString());
  }, [initialPriceRange]);

  const handleApply = () => {
    const newMin = Math.max(Number(tempMin) || 0, initialPriceRange.min);
    const newMax = Math.min(Number(tempMax) || initialPriceRange.max, initialPriceRange.max);

    // Minimum değer maximum değerden büyük olamaz
    if (newMin > newMax) {
      setTempMin(newMax.toString());
      setMinPrice(newMax);
      setMaxPrice(newMax);
      onFilterChange({ min: newMax, max: newMax });
      return;
    }

    setMinPrice(newMin);
    setMaxPrice(newMax);
    onFilterChange({ min: newMin, max: newMax });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (value: string, type: 'min' | 'max') => {
    // Sadece sayıları kabul et
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (type === 'min') {
      setTempMin(numericValue);
    } else {
      setTempMax(numericValue);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span className="font-semibold text-sm text-gray-700">Fiyat Aralığı</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Min"
                value={tempMin}
                onChange={(e) => handleInputChange(e.target.value, 'min')}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-700"
              />
            </div>
            <span className="text-gray-400">-</span>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Max"
                value={tempMax}
                onChange={(e) => handleInputChange(e.target.value, 'max')}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-700"
              />
            </div>
          </div>

          <button
            onClick={handleApply}
            className="w-full bg-orange-500 text-white text-xs font-medium py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Uygula
          </button>

          <div className="text-xs text-gray-500 text-center">
            Fiyat Aralığı: {formatPrice(minPrice)} - {formatPrice(maxPrice)}
          </div>
        </div>
      )}
    </div>
  );
}
