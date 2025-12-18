"use client";

import { useState, useEffect } from 'react';
import AttributeFilter from './AttributeFilter';

interface FilterField {
  id: string;
  name: string;
  type: string;
  values: {
    id: string;
    name: string;
    count: number;
  }[];
}

interface FilterResponse {
  meta: {
    status: string;
    message: string;
  };
  data: {
    fields: FilterField[];
    brands: Array<{
      id: string;
      name: string;
      count: number;
    }>;
    colors: Array<{
      id: string;
      name: string;
      code: string;
      count: number;
    }>;
    sizes: Array<{
      id: string;
      name: string;
      count: number;
    }>;
    prices: {
      min: number;
      max: number;
    };
  };
}

interface FilterSectionProps {
  categoryId: string;
  onFiltersChange: (filters: Record<string, string[]>) => void;
}

export default function FilterSection({ categoryId, onFiltersChange }: FilterSectionProps) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterData, setFilterData] = useState<FilterResponse['data'] | null>(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/proxy/categories/${categoryId}/filters`);
        const data: FilterResponse = await response.json();

        if (data.meta?.status === 'success') {
          setFilterData(data.data);
        } else {
          setError(data.meta?.message || 'Failed to load filters');
        }
      } catch (error) {
        setError('Failed to load filters');
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchFilters();
    }
  }, [categoryId]);

  const handleFilterChange = (fieldId: string, selectedAttributes: string[]) => {
    const newFilters = {
      ...filters,
      [fieldId]: selectedAttributes
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Field değerlerini AttributeFilter'ın beklediği formata dönüştüren yardımcı fonksiyon
  const mapFieldValuesToAttributes = (values: FilterField['values']) => {
    return values.map(value => ({
      id: value.id,
      name: value.name,
      slug: value.id.toString(), // id'yi slug olarak kullan
      count: value.count
    }));
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!filterData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {filterData.fields.map((field) => (
        <AttributeFilter
          key={field.id}
          title={field.name}
          attributes={mapFieldValuesToAttributes(field.values)}
          onFilterChange={(selectedAttributes) => handleFilterChange(field.id, selectedAttributes)}
        />
      ))}
    </div>
  );
} 