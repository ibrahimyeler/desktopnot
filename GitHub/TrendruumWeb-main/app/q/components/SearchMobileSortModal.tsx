"use client";

import { XMarkIcon } from '@heroicons/react/24/outline';

interface SortOption {
  id: string;
  name: string;
  value: string;
}

interface SearchMobileSortModalProps {
  isOpen: boolean;
  onClose: () => void;
  sortOptions: SortOption[];
  currentSortType: string;
  onSortChange: (sortType: string) => void;
}

export default function SearchMobileSortModal({
  isOpen,
  onClose,
  sortOptions,
  currentSortType,
  onSortChange
}: SearchMobileSortModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2147483000] md:hidden bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Sıralama modalını kapat"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h2 className="text-base font-semibold text-gray-900">Sırala</h2>
        <div className="w-6" />
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 py-4 space-y-2">
          {sortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onSortChange(option.value);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors duration-150 text-sm font-medium ${
                currentSortType === option.value
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 bg-white text-gray-800 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

