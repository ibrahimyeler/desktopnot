"use client";

import { TrashIcon } from '@heroicons/react/24/outline';

interface ClearBasketButtonProps {
  onClear: () => void;
}

export default function ClearBasketButton({ onClear }: ClearBasketButtonProps) {
  return (
    <div className="flex justify-end mb-4 sm:mb-6">
      <button
        onClick={onClear}
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
      >
        <TrashIcon className="w-4 h-4" />
        Sepeti Temizle
      </button>
    </div>
  );
}

