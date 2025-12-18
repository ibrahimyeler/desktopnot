"use client";
import React from 'react';
import { createPortal } from 'react-dom';
import { BookmarkIcon } from '@heroicons/react/24/outline';

interface UnfollowConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sellerName: string;
  isLoading?: boolean;
}

const UnfollowConfirmModal = ({ isOpen, onClose, onConfirm, sellerName, isLoading = false }: UnfollowConfirmModalProps) => {
  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 p-6 mt-20 sm:mt-24 md:mt-32 relative border border-gray-200 shadow-xl">
        {/* Kapatma Butonu */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={onClose}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* İkon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
            <BookmarkIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        {/* Başlık */}
        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
          Takibi Bırak
        </h3>
        
        {/* Açıklama */}
        <p className="text-sm text-gray-600 text-center mb-6 leading-relaxed">
          <span className="font-medium text-gray-900">{sellerName}</span> mağazasını takip etmeyi bırakmak istediğinize emin misiniz?
        </p>
        
        {/* Butonlar */}
        <div className="flex gap-3">
          {/* İptal Butonu */}
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            İptal
          </button>
          
          {/* Onay Butonu */}
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-3 px-4 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>İşleniyor...</span>
              </>
            ) : (
              <>
                <BookmarkIcon className="w-4 h-4" />
                <span>Takibi Bırak</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UnfollowConfirmModal;
