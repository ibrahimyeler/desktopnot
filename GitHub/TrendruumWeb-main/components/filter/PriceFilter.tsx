import React from 'react';

interface PriceFilterProps {
  isVisible: boolean;
  onToggle: () => void;
  priceRange: { min: number; max: number };
  filters: { prices?: { min?: number; max?: number } };
  onFilterChange: (priceRange: { min?: number; max?: number }) => void;
  onApply?: () => void;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  isVisible,
  onToggle,
  priceRange,
  filters,
  onFilterChange,
  onApply
}) => {
  if (!isVisible) return null;

  const minValue = filters.prices?.min ?? '';
  const maxValue = filters.prices?.max ?? '';

  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^\d]/g, '');
    const parsedValue = numericValue ? Number(numericValue) : undefined;
    onFilterChange({
      min: parsedValue,
      max: filters.prices?.max
    });
  };

  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = event.target.value.replace(/[^\d]/g, '');
    const parsedValue = numericValue ? Number(numericValue) : undefined;
    onFilterChange({
      min: filters.prices?.min,
      max: parsedValue
    });
  };

  return (
    <div className="px-3 pb-3">
      <div className="flex space-x-2 mb-2">
        <input 
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="₺ Min"
          value={minValue}
          onChange={handleMinChange}
          className="w-[96px] sm:w-[86px] px-2 py-1 border border-gray-300 rounded text-xs text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:text-black"
        />
        <input 
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="₺ Max"
          value={maxValue}
          onChange={handleMaxChange}
          className="w-[96px] sm:w-[86px] px-2 py-1 border border-gray-300 rounded text-xs text-black placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white focus:text-black"
        />
      </div>
      <p className="text-xs text-gray-500">
        En düşük: {priceRange.min.toLocaleString('tr-TR')} TL - En yüksek: {priceRange.max.toLocaleString('tr-TR')} TL
      </p>
    </div>
  );
};

export default PriceFilter;
