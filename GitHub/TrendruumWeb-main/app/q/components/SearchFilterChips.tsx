"use client";

import { FilterChip } from '../types';

interface SearchFilterChipsProps {
  searchQuery: string;
  chips: FilterChip[];
}

export default function SearchFilterChips({ searchQuery, chips }: SearchFilterChipsProps) {
  if (!searchQuery || chips.length === 0) return null;

  return (
    <div className="px-3 pb-2 mb-4 lg:hidden">
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <span
            key={chip.key}
            className="inline-flex items-center px-3 py-1 text-xs font-medium bg-orange-50 text-orange-600 border border-orange-100 rounded-full"
          >
            {chip.label}
          </span>
        ))}
      </div>
    </div>
  );
}


