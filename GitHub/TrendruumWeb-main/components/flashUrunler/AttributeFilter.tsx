"use client";

import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { API_V1_URL } from '@/lib/config';

// Attribute tipi için interface
interface AttributeValue {
  name: string;
  slug: string;
}

interface Attribute {
  id: string;
  name: string;
  slug: string;
  type: string;
  required: boolean;
  inputType: string;
  values: AttributeValue[];
  updated_at: string;
  created_at: string;
}

interface ApiResponse {
  meta: {
    status: string;
    message?: string;
  };
  data: {
    attributes: Attribute[];
  };
}

interface AttributeFilterProps {
  title: string;
  attributes?: AttributeValue[];
  attributeType?: string;
  categorySlug?: string;
  onFilterChange: (selected: string[]) => void;
}

const AttributeFilter: React.FC<AttributeFilterProps> = ({
  title,
  attributes: initialAttributes,
  attributeType,
  categorySlug,
  onFilterChange
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);

  useEffect(() => {
    const fetchAttributes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!categorySlug) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_V1_URL}/categories/${categorySlug}/filter-fields`);
        
        if (response.ok) {
          const data: ApiResponse = await response.json();
          
          if (data.meta?.status === 'success' && data.data?.attributes) {
            setAttributes(data.data.attributes);
          } else {
            setError('Özellik verisi bulunamadı');
          }
        } else {
          if (response.status === 404) {
            setError('Özellikler bulunamadı');
          } else {
            setError(`API yanıtı başarısız: ${response.status}`);
          }
        }
      } catch (error) {
        setError('Özellikler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [categorySlug]);

  const handleAttributeToggle = (attributeSlug: string) => {
    const newSelectedAttributes = selectedAttributes.includes(attributeSlug)
      ? selectedAttributes.filter(slug => slug !== attributeSlug)
      : [...selectedAttributes, attributeSlug];
    
    setSelectedAttributes(newSelectedAttributes);
    onFilterChange(newSelectedAttributes);
  };

  // Tüm attribute değerlerini düzleştir
  const allAttributeValues = attributes.flatMap(attr => 
    attr.values.map(value => ({
      ...value,
      attributeName: attr.name,
      attributeSlug: attr.slug
    }))
  );

  const filteredAttributes = allAttributeValues.filter(attribute =>
    attribute.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (error || attributes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-3 rounded-lg w-full max-w-[240px] font-sans border border-orange-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-2"
      >
        <span className="font-semibold text-sm text-gray-700">
          {title} {selectedAttributes.length > 0 && `(${selectedAttributes.length})`}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="space-y-2">
          {allAttributeValues.length > 5 && (
            <input
              type="text"
              placeholder="Ara..."
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-orange-500 text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <div className="max-h-48 overflow-y-auto space-y-1 mt-2 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
            {filteredAttributes.map((attribute) => (
              <label
                key={`${attribute.attributeSlug}-${attribute.slug}`}
                className={`flex items-center space-x-2 cursor-pointer group px-2 py-1 rounded-md
                  ${selectedAttributes.includes(attribute.slug) ? 'bg-orange-50' : 'hover:bg-gray-50'}`}
              >
                <input
                  type="checkbox"
                  checked={selectedAttributes.includes(attribute.slug)}
                  onChange={() => handleAttributeToggle(attribute.slug)}
                  className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                />
                <span className={`text-xs ${
                  selectedAttributes.includes(attribute.slug) 
                    ? 'text-orange-500 font-medium' 
                    : 'text-gray-700 group-hover:text-orange-500'
                }`}>
                  {attribute.name}
                </span>
              </label>
            ))}
            {filteredAttributes.length === 0 && (
              <div className="text-xs text-gray-500 text-center py-2">
                Sonuç bulunamadı
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttributeFilter; 