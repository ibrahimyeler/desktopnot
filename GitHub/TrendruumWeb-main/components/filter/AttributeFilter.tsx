"use client";

import React from 'react';

interface AttributeValue {
  name: string;
  slug: string;
  count?: number;
}

interface AttributeFilterProps {
  attribute: {
    name: string;
    slug: string;
    values: AttributeValue[];
  };
  selectedValues: string[];
  onValueChange: (value: string, checked: boolean) => void;
}

const AttributeFilter: React.FC<AttributeFilterProps> = ({
  attribute,
  selectedValues,
  onValueChange
}) => {
  return (
    <div className="space-y-2">
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {attribute.values && attribute.values.length > 0 ? (
          attribute.values.map((value, index) => (
            <label key={`${attribute.slug}-${value.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValues.includes(value.slug)}
                onChange={(e) => onValueChange(value.slug, e.target.checked)}
                className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
              />
              <span className="text-sm text-gray-700 flex-1">{value.name || value.slug}</span>
            </label>
          ))
        ) : null}
      </div>
    </div>
  );
};

export default AttributeFilter;
