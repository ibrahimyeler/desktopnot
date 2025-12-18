"use client";

import React from 'react';
import Image from 'next/image';

interface AgeVerificationModalProps {
  showAgeVerification: boolean;
  isAdultVerified: boolean;
  onVerify: () => void;
  onCancel: () => void;
}

const AgeVerificationModal: React.FC<AgeVerificationModalProps> = ({
  showAgeVerification,
  isAdultVerified,
  onVerify,
  onCancel
}) => {
  if (!showAgeVerification || isAdultVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <Image
              src="/18+.png"
              alt="18+ Yaş Sınırı"
              width={60}
              height={60}
              className="object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Yaş Doğrulaması Gerekli
          </h2>
          <p className="text-gray-600 mb-6">
            Bu kategori yetişkin içerik içermektedir. Devam etmek için yaşınızı doğrulamanız gerekmektedir.
          </p>
          <div className="space-y-3">
            <button
              onClick={onVerify}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              18 Yaşından Büyüğüm
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              18 Yaşından Küçüğüm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;
