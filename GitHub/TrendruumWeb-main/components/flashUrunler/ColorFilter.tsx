"use client";

import { useEffect, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { API_V1_URL } from '@/lib/config';

interface Color {
  id: string;
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
  values: Color[];
  updated_at: string;
  created_at: string;
}

interface ColorFilterProps {
  categorySlug: string;
  onFilterChange: (selectedColors: string[]) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({ categorySlug, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColors = async () => {
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
          // Renk variant'ını bul
          const colorVariant = data.data.variants.find((variant: Variant) => 
            variant.name.toLowerCase().includes('renk') || variant.imageable === true
          );
          
          if (colorVariant && colorVariant.values) {
            setColors(colorVariant.values);
          } else {
            setError('Renk bilgileri bulunamadı');
          }
        } else {
          setError('Renk bilgileri alınamadı');
        }
      } catch (error) {
        setError('Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      fetchColors();
      // Kategori değiştiğinde seçili renkleri sıfırla
      setSelectedColors([]);
    }
  }, [categorySlug]);

  const handleColorClick = (colorId: string) => {
    const newSelectedColors = selectedColors.includes(colorId)
      ? selectedColors.filter(id => id !== colorId)
      : [...selectedColors, colorId];

    setSelectedColors(newSelectedColors);
    onFilterChange(newSelectedColors);
  };

  const filteredColors = colors.filter(color =>
    color.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="w-6 h-6 bg-gray-200 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || colors.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span className="font-semibold text-sm text-gray-700">
          Renkler {selectedColors.length > 0 && `(${selectedColors.length})`}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-2">
          {colors.length > 8 && (
            <input
              type="text"
              placeholder="Renk ara..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <div className="grid grid-cols-4 gap-2">
            {filteredColors.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorClick(color.id)}
                className={`flex flex-col items-center space-y-1 p-1 rounded-lg transition-all ${
                  selectedColors.includes(color.id) ? 'bg-orange-50 ring-2 ring-orange-500' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-[10px] text-gray-700 truncate w-full text-center">
                  {color.name}
                </span>
              </button>
            ))}
          </div>

          {filteredColors.length === 0 && (
            <div className="text-xs text-gray-500 text-center py-2">
              Renk bulunamadı
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ColorFilter; 