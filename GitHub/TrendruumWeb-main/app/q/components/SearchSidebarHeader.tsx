"use client";

import React from 'react';

interface SearchSidebarHeaderProps {
  searchQuery: string;
  loading: boolean;
}

const SearchSidebarHeader: React.FC<SearchSidebarHeaderProps> = ({
  searchQuery,
  loading
}) => {
  return (
    <div className="hidden lg:block bg-white rounded-lg p-3 mb-3">
      <h1 className="text-base font-bold text-gray-900 mb-1">
        {searchQuery || 'Arama'}
      </h1>
      <p className="text-xs text-gray-500">
      </p>
    </div>
  );
};

export default SearchSidebarHeader;

