"use client";

import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface DynamicFilterProps {
  title: string;
  isVisible: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  selectedValues?: string[];
  selectedCount?: number;
}

const DynamicFilter: React.FC<DynamicFilterProps> = ({ 
  title, 
  isVisible, 
  onToggle, 
  children,
  selectedValues = [],
  selectedCount = 0
}) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">{title}</span>
          {selectedValues.length > 0 && !isVisible && (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedValues.slice(0, 2).map((value, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  {value}
                </span>
              ))}
              {selectedValues.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  +{selectedValues.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-orange-500 rounded-full">
              {selectedCount}
            </span>
          )}
          {isVisible ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          )}
        </div>
      </button>
      {isVisible && (
        <div className="px-3 pb-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default DynamicFilter;
