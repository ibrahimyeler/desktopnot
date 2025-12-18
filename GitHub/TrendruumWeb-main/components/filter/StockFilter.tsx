import React from 'react';

interface StockFilterProps {
  isVisible: boolean;
  onToggle: () => void;
  stockStatus: boolean;
  onStockStatusChange: (checked: boolean) => void;
}

const StockFilter: React.FC<StockFilterProps> = ({
  isVisible,
  onToggle,
  stockStatus,
  onStockStatusChange
}) => {
  if (!isVisible) return null;

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-3">
        <h3 className="font-medium text-gray-900 text-xs">Stok Durumu</h3>
        <button 
          onClick={onToggle}
          className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center transition-transform duration-200"
        >
          <svg 
            className="w-2 h-2 text-white transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
      <div className="px-3 pb-3">
        <div className="space-y-1">
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="w-3 h-3 bg-orange-500 border-orange-500 rounded text-white" 
              checked={stockStatus}
              onChange={(e) => onStockStatusChange(e.target.checked)}
            />
            <span className="ml-2 text-xs text-gray-700">Var</span>
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="w-3 h-3 border-gray-300 rounded" 
              checked={!stockStatus}
              onChange={(e) => onStockStatusChange(!e.target.checked)}
            />
            <span className="ml-2 text-xs text-gray-700">Yok</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default StockFilter;
