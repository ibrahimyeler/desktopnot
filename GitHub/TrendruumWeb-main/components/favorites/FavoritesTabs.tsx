"use client";

import Link from 'next/link';

interface FavoritesTabsProps {
  activeTab: 'favorites' | 'collections';
}

export default function FavoritesTabs({ activeTab }: FavoritesTabsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border-0 sm:border border-gray-200">
      <div className="px-4 sm:px-6">
        <nav className="flex space-x-6 sm:space-x-10 overflow-x-auto">
          <Link
            href="/hesabim/favoriler"
            className={`${
              activeTab === 'favorites'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex items-center whitespace-nowrap border-b-2 py-4 px-2 text-base font-medium flex-shrink-0`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={activeTab === 'favorites' ? 'currentColor' : 'none'}
              stroke="currentColor"
              className="w-5 h-5 mr-2"
              strokeWidth={activeTab === 'favorites' ? '0' : '2'}
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            Favorilerim
          </Link>

          <Link
            href="/hesabim/koleksiyonlarim"
            className={`${
              activeTab === 'collections'
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } flex items-center whitespace-nowrap border-b-2 py-4 px-2 text-base font-medium flex-shrink-0`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5 mr-2"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
            Koleksiyonlarım
          </Link>
        </nav>
      </div>
    </div>
  );
} 