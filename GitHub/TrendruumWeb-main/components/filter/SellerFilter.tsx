import React from 'react';

interface SellerFilterProps {
  isVisible: boolean;
  onToggle: () => void;
}

const SellerFilter: React.FC<SellerFilterProps> = ({
  isVisible,
  onToggle
}) => {
  if (!isVisible) return null;

  return (
    <div className="border-b border-gray-200">
      <div className="flex items-center justify-between p-3">
        <h3 className="font-medium text-gray-900 text-xs">Satıcı</h3>
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
        <div className="text-xs text-gray-500">
          Satıcı filtreleri yakında eklenecek
        </div>
      </div>
    </div>
  );
};

export default SellerFilter;
