"use client";

import React from 'react';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ClearBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ClearBasketModal: React.FC<ClearBasketModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm p-4 pb-20">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <TrashIcon className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Sepeti Temizle</h3>
                <p className="text-xs text-gray-500">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="px-4 py-4">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-50 rounded-full flex items-center justify-center">
              <TrashIcon className="w-6 h-6 text-orange-600" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?
            </h3>
            
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Bu işlem sepetinizdeki tüm ürünleri kalıcı olarak kaldıracaktır. 
              Bu işlem geri alınamaz.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-orange-800">
                <strong>Uyarı:</strong> Sepetinizdeki tüm ürünler silinecek ve bu işlem geri alınamaz.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 pb-16 bg-gray-50 rounded-b-2xl flex gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-2 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Vazgeç
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-2 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Temizleniyor...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4" />
                Sepeti Temizle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClearBasketModal;
