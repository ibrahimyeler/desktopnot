"use client";

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Flaş Ürün Ara (14986 Ürün)"
        className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
      />
      <MagnifyingGlassIcon className="w-5 h-5 text-orange-500 absolute right-3 top-1/2 -translate-y-1/2" />
    </div>
  );
} 