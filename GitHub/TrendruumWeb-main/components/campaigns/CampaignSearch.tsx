import React, { useState, useCallback } from 'react';
import { useDebounce } from '@/app/hooks/useDebounce';

interface CampaignSearchProps {
  onSearch: (query: string) => void;
  loading?: boolean;
  placeholder?: string;
}

const CampaignSearch: React.FC<CampaignSearchProps> = ({ 
  onSearch, 
  loading = false,
  placeholder = "Kampanya ara..." 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Debounced search query değiştiğinde arama yap
  React.useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={loading}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        
        {searchQuery && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Arama Sonuçları Bilgisi */}
      {searchQuery && (
        <div className="mt-2 text-sm text-gray-600">
          <span className="font-medium">"{searchQuery}"</span> için arama yapılıyor...
        </div>
      )}

      {/* Popüler Arama Terimleri */}
      {!searchQuery && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Popüler aramalar:</p>
          <div className="flex flex-wrap gap-2">
            {['Yaz Kampanyası', 'İndirim', 'Al X Öde Y', 'Yüzde İndirimi'].map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSearch;
