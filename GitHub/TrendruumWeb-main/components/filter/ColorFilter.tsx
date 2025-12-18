"use client";

import React from 'react';

interface Color {
  name: string;
  slug: string;
  count?: number;
}

interface ColorFilterProps {
  colors: Color[];
  selectedColors: string[];
  onColorChange: (color: string, checked: boolean) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  colors,
  selectedColors,
  onColorChange
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {colors.map((color, index) => (
          <label key={`color-${color.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedColors.includes(color.slug)}
              onChange={(e) => onColorChange(color.slug, e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
            />
            <span className="text-sm text-gray-700 flex-1">{color.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
