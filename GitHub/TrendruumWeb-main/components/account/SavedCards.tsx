"use client";

import Image from 'next/image';
import { CreditCardIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface SavedCardsProps {
  onMenuClick?: () => void;
}

const SavedCards = ({ onMenuClick }: SavedCardsProps) => {
  const router = useRouter();

  return (
    <div className="flex-1">
      {/* Üst Başlık */}
      <div className="mb-4 sm:mb-6 -mt-2 sm:mt-0">
        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.history.back()}
              aria-label="Geri"
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <CreditCardIcon className="w-6 h-6 text-orange-500" />
            <h1 className="text-xl font-semibold text-gray-900">Kayıtlı Kartlarım</h1>
          </div>
          <div className="flex items-center gap-2">
            <Image 
              src="/savedcart.svg" 
              alt="Güvenli Kart" 
              width={32} 
              height={32} 
            />
            <div>
              <div className="font-medium text-gray-900 text-sm">Kayıtlı Kartlarınız</div>
              <div className="text-xs text-green-500">Burada Güvende</div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.history.back()}
                aria-label="Geri"
                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors text-gray-600"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <CreditCardIcon className="w-5 h-5 text-orange-500" />
              <h1 className="text-base font-semibold text-gray-900">Kayıtlı Kartlarım</h1>
            </div>
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menü"
              >
                <Bars3Icon className="w-6 h-6 text-gray-600" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
            <Image 
              src="/savedcart.svg" 
              alt="Güvenli Kart" 
              width={24} 
              height={24} 
            />
            <div>
              <div className="font-medium text-gray-900 text-sm">Kayıtlı Kartlarınız</div>
              <div className="text-xs text-green-500">Burada Güvende</div>
            </div>
          </div>
        </div>
      </div>

      {/* Boş Durum */}
      <div className="bg-white rounded-lg p-4 sm:p-8 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="max-w-sm w-full">
          <div className="mb-4 sm:mb-6">
            <CreditCardIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto" />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center leading-relaxed">
            Hesabınıza kayıtlı kart bulunmamaktadır.
          </h3>
          <p className="text-sm text-gray-500 mb-4 sm:mb-6 text-center leading-relaxed">
            Kart kaydetme işlemi sadece alışveriş yaptıktan sonra karşınıza gelen onaylama ekranından yapılabilmektedir.
          </p>
          <button 
            onClick={() => {
              if (typeof window !== 'undefined') {
                router.push('/');
              }
            }}
            className="bg-[#FF6000] text-white px-6 py-3 rounded-md font-medium text-sm sm:text-base hover:bg-[#FF6000]/90 transition-colors w-full"
          >
            Alışverişe Devam Et
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedCards;
