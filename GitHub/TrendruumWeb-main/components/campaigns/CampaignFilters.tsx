import React from 'react';

interface CampaignFiltersProps {
  onFilterChange: (filters: CampaignFilterState) => void;
  filters: CampaignFilterState;
  loading?: boolean;
}

interface CampaignFilterState {
  type: string;
  status: string;
  category_id: string;
  sort: string;
}

const CampaignFilters: React.FC<CampaignFiltersProps> = ({ 
  onFilterChange, 
  filters, 
  loading = false 
}) => {
  const campaignTypes = [
    { value: '', label: 'Tüm Kampanya Tipleri' },
    { value: 'price_discount', label: 'Fiyat İndirimi' },
    { value: 'percentage_discount', label: 'Yüzde İndirimi' },
    { value: 'buy_x_pay_y', label: 'Al X Öde Y' },
    { value: 'nth_product_discount', label: 'N. Ürün İndirimi' }
  ];

  const statusOptions = [
    { value: '', label: 'Tüm Durumlar' },
    { value: 'active', label: 'Aktif' },
    { value: 'inactive', label: 'Pasif' },
    { value: 'upcoming', label: 'Yaklaşan' },
    { value: 'expired', label: 'Süresi Dolmuş' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'En Yeni' },
    { value: 'oldest', label: 'En Eski' },
    { value: 'name_asc', label: 'İsim A-Z' },
    { value: 'name_desc', label: 'İsim Z-A' },
    { value: 'start_date_asc', label: 'Başlangıç Tarihi (Eski)' },
    { value: 'start_date_desc', label: 'Başlangıç Tarihi (Yeni)' },
    { value: 'end_date_asc', label: 'Bitiş Tarihi (Eski)' },
    { value: 'end_date_desc', label: 'Bitiş Tarihi (Yeni)' }
  ];

  const handleFilterChange = (key: keyof CampaignFilterState, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      type: '',
      status: '',
      category_id: '',
      sort: 'newest'
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== 'newest');

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-lg border-2 border-orange-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <svg className="h-5 w-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtreler
        </h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-800 font-medium bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-lg transition-colors"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Kampanya Tipi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kampanya Tipi
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 disabled:bg-orange-100 disabled:cursor-not-allowed bg-white hover:border-orange-300 transition-colors"
          >
            {campaignTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Durum */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 disabled:bg-orange-100 disabled:cursor-not-allowed bg-white hover:border-orange-300 transition-colors"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 disabled:bg-orange-100 disabled:cursor-not-allowed bg-white hover:border-orange-300 transition-colors"
          >
            <option value="">Tüm Kategoriler</option>
            {/* Kategoriler buraya dinamik olarak eklenecek */}
          </select>
        </div>

        {/* Sıralama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sıralama
          </label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 disabled:bg-orange-100 disabled:cursor-not-allowed bg-white hover:border-orange-300 transition-colors"
          >
            {sortOptions.map((sort) => (
              <option key={sort.value} value={sort.value}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aktif Filtreler */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {campaignTypes.find(t => t.value === filters.type)?.label}
                <button
                  onClick={() => handleFilterChange('type', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-500"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {statusOptions.find(s => s.value === filters.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category_id && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Kategori Filtresi
                <button
                  onClick={() => handleFilterChange('category_id', '')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-500"
                >
                  ×
                </button>
              </span>
            )}
            {filters.sort && filters.sort !== 'newest' && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {sortOptions.find(s => s.value === filters.sort)?.label}
                <button
                  onClick={() => handleFilterChange('sort', 'newest')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignFilters;
