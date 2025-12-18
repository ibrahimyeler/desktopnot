"use client";

import { useState, useEffect } from 'react';
import { IoWarningOutline } from "react-icons/io5";
import { useBasket } from "@/app/context/BasketContext";

interface TabsProps {
  activeTab: string;
  setActiveTab: (word: string) => void;
  selectedAddress?: {
    title: string;
    addressDetail: string;
    district: string;
    city: string;
  };
}

interface GuestCustomer {
  address: {
    address_title: string;
    address_detail: string;
    district: string;
    city: string;
  };
}

export default function Tabs({
  activeTab,
  setActiveTab,
  selectedAddress
}: TabsProps) {
  const { basket } = useBasket();
  const cartItems = basket?.basket_groups?.[0]?.items || [];
  const [showWarning, setShowWarning] = useState(false);
  const [localAddress, setLocalAddress] = useState<GuestCustomer | null>(null);

  useEffect(() => {
    // localStorage'dan adres bilgilerini al
    const storedData = localStorage.getItem('guestCustomer');
    if (storedData) {
      setLocalAddress(JSON.parse(storedData));
    }
  }, []);

  const renderAddressInfo = () => {
    // Önce localStorage'daki adresi kontrol et
    if (localAddress?.address) {
      return (
        <p className="text-[12px] text-gray-600">
          {localAddress.address.address_detail}, {localAddress.address.district}/{localAddress.address.city}
        </p>
      );
    }
    // Eğer props'tan gelen adres varsa onu göster
    if (selectedAddress) {
      return (
        <p className="text-[12px] text-gray-600">
          {selectedAddress.addressDetail}, {selectedAddress.district}/{selectedAddress.city}
        </p>
      );
    }
    // Hiç adres yoksa varsayılan mesajı göster
    return (
      <p className="text-[12px] text-gray-600">
        Teslimat için adres bilgilerinizi giriniz
      </p>
    );
  };

  const handlePaymentClick = () => {
    // localStorage'da adres varsa ödeme sekmesine geçiş yap
    if (localAddress?.address) {
      setActiveTab("payment");
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000); // 3 saniye sonra uyarıyı kaldır
    }
  };

  return (
    <div className="relative">
      {showWarning && (
        <div className="absolute -top-16 left-0 right-0 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2 animate-fade-in">
          <IoWarningOutline className="text-xl" />
          <span className="text-sm">Lütfen önce adres bilgilerini giriniz</span>
        </div>
      )}
      
      <div className="flex h-24 sm:h-32">
        <div
          onClick={() => setActiveTab("address")}
          className={`border cursor-pointer flex-1 p-3 sm:p-5 border-r-0 rounded-md rounded-r-none border-b-4 transition-colors duration-300 ${
            activeTab === "address" 
              ? "border-b-orange-500 bg-white" 
              : "border-b-gray-300 bg-gray-100 hover:bg-gray-50"
          }`}
        >
          <h1
            className={`text-sm sm:text-[13px] font-bold mb-1 sm:mb-2 ${
              activeTab === "address" ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Adres Bilgileri
          </h1>
          <div className="text-sm sm:text-[13px] text-gray-600">
            {renderAddressInfo()}
          </div>
        </div>
        <div
          onClick={handlePaymentClick}
          className={`border border-b-4 flex-1 cursor-pointer p-3 sm:p-5 rounded-md rounded-l-none transition-colors duration-300 ${
            activeTab === "payment" 
              ? "border-b-orange-500 bg-white" 
              : "border-b-gray-300 bg-gray-100 hover:bg-gray-50"
          }`}
        >
          <h1
            className={`text-sm sm:text-[13px] font-bold mb-1 sm:mb-2 ${
              activeTab === "payment" ? "text-orange-500" : "text-gray-600"
            }`}
          >
            Ödeme Seçenekleri
          </h1>
          <div className="text-[10px] sm:text-[12px] text-gray-600">
            <span className="font-[500]">Banka/Kredi Kartı</span>{" "}
            <span className="font-[500]"></span> ile ödemenizi güvenle yapabilirsiniz.
            {cartItems.length > 0 && (
              <span className="block mt-1">
                Toplam {cartItems.length} ürün için ödeme yapılacak
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
