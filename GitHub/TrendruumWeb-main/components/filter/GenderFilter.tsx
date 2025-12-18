"use client";

import React from 'react';

interface Gender {
  name: string;
  slug: string;
  count?: number;
}

interface GenderFilterProps {
  genders: Gender[];
  selectedGenders: string[];
  onGenderChange: (gender: string, checked: boolean) => void;
}

const GenderFilter: React.FC<GenderFilterProps> = ({
  genders,
  selectedGenders,
  onGenderChange
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {genders.map((gender, index) => (
          <label key={`gender-${gender.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedGenders.includes(gender.slug)}
              onChange={(e) => onGenderChange(gender.slug, e.target.checked)}
              className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
            />
            <span className="text-sm text-gray-700 flex-1">{gender.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default GenderFilter;
