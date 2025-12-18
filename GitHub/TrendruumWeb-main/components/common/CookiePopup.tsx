"use client";

import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CookiePopupProps {
  onAccept?: () => void;
  onReject?: () => void;
}

const CookiePopup: React.FC<CookiePopupProps> = ({ onAccept, onReject }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // LocalStorage'dan kalıcı çerez tercihini kontrol et
    const cookieAccepted = localStorage.getItem('cookieAccepted');
    // SessionStorage'dan oturum boyunca kabul durumunu kontrol et
    const cookieAcceptedSession = sessionStorage.getItem('cookieAcceptedSession');
    
    // Eğer kullanıcı daha önce tercih yapmamışsa popup'ı göster
    if (!cookieAccepted && !cookieAcceptedSession) {
      // Biraz gecikme ile göster (sayfa yüklendikten sonra)
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Kalıcı kabul durumunu localStorage'a kaydet
    localStorage.setItem('cookieAccepted', 'true');
    // Oturum boyunca kabul edildi olarak işaretle
    sessionStorage.setItem('cookieAcceptedSession', 'true');
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    // Kalıcı red durumunu localStorage'a kaydet
    localStorage.setItem('cookieAccepted', 'false');
    setIsVisible(false);
    onReject?.();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-[60]" />
      
      {/* Popup */}
      <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md bg-white rounded-lg border border-gray-200 shadow-lg z-[60] p-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Kapat"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="pr-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            🍪 Çerez Kullanımı
          </h3>
          
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Web sitemizde size en iyi deneyimi sunabilmek için çerezler kullanıyoruz. 
            Sitemizi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.
          </p>
          
                                <div className="text-xs text-gray-500 mb-4">
                        Daha fazla bilgi için{' '}
                        <a
                          href="/s/kvkk"
                          target="_blank"
                          className="text-orange-600 hover:text-orange-700 underline"
                        >
                          KVKK Politikamızı
                        </a>
                        {', '}
                        <a
                          href="/s/gizlilik"
                          target="_blank"
                          className="text-orange-600 hover:text-orange-700 underline"
                        >
                          Gizlilik Politikamızı
                        </a>
                        {' '}ve{' '}
                        <a
                          href="/s/cerez-politikasi"
                          target="_blank"
                          className="text-orange-600 hover:text-orange-700 underline"
                        >
                          Çerez Politikamızı
                        </a>
                        {' '}inceleyebilirsiniz.
                      </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleAccept}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
            >
              Kabul Et
            </button>
            
            <button
              onClick={handleReject}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-300"
            >
              Reddet
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookiePopup;
