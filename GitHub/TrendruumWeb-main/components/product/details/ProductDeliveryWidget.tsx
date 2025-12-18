"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  TruckIcon, 
  InformationCircleIcon,
  ClockIcon,
  MapPinIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

interface CargoCompany {
  deliveryOptionName: string;
  deliveryOptionId: number;
  deliveryCompanyName: string;
  logo: string;
}

interface ProductDeliveryWidgetProps {
  sellerId?: string;
  cargoCompany?: CargoCompany;
  deliveryTime?: number;
  termin?: string;
  className?: string;
}

interface SellerInfo {
  shipping_policy: {
    general: {
      carrier: string;
      delivery_time: number;
      shipping_fee: number;
      free_shipping_threshold: number;
    };
  };
}

// Kargo şirketlerinin logo eşleştirmesi
const CARRIER_LOGOS: Record<string, string> = {
  'HepsiJET': 'https://storage.googleapis.com/tryoto-public/delivery-logo/hepsijet.png',
  'Sürat Kargo': 'https://storage.googleapis.com/tryoto-public/delivery-logo/surat-kargo.png',
  'Kargoist': 'https://storage.googleapis.com/tryoto-public/delivery-logo/kargoist.png',
  'Kolay Gelsin': 'https://storage.googleapis.com/tryoto-public/delivery-logo/kolay-gelsin.png',
  'Aras Kargo': 'https://storage.googleapis.com/tryoto-public/delivery-logo/araskargo.png',
  'PTT Kargo': 'https://storage.googleapis.com/tryoto-public/delivery-logo/pttkargo.png',
  'Yurtiçi Kargo': 'https://storage.googleapis.com/tryoto-public/delivery-logo/yurtici.png'
};

// Kargo adı normalize etme
const normalizeCarrierName = (carrier: string): string => {
  const normalized = carrier.trim();
  
  if (CARRIER_LOGOS[normalized]) {
    return normalized;
  }
  
  if (normalized.toLowerCase().includes('hepsi')) return 'HepsiJET';
  if (normalized.toLowerCase().includes('sürat') || normalized.toLowerCase().includes('surat')) return 'Sürat Kargo';
  if (normalized.toLowerCase().includes('kargoist')) return 'Kargoist';
  if (normalized.toLowerCase().includes('kolay')) return 'Kolay Gelsin';
  if (normalized.toLowerCase().includes('aras')) return 'Aras Kargo';
  if (normalized.toLowerCase().includes('ptt')) return 'PTT Kargo';
  if (normalized.toLowerCase().includes('yurtiçi') || normalized.toLowerCase().includes('yurtici')) return 'Yurtiçi Kargo';
  
  return normalized;
};

// Teslimat tarihini hesapla
const calculateDeliveryDate = (deliveryDays: number): string => {
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + deliveryDays);
  
  const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  const dayName = days[deliveryDate.getDay()];
  const day = deliveryDate.getDate();
  const month = months[deliveryDate.getMonth()];
  
  return `${day} ${month} ${dayName} kapında!`;
};

// Termin veya deliveryTime'a göre gösterilecek metni üret
const formatDeliveryText = (termin?: string, deliveryTime?: number): string => {
  if (termin) {
    const trimmed = termin.trim();
    
    // Sadece sayı ise "1 iş günü içinde" şeklinde yaz
    if (/^\d+$/.test(trimmed)) {
      return `${trimmed} iş günü içinde`;
    }
    
    // Zaten "1-3 iş günü" gibi detaylı ise aynen göster
    return trimmed;
  }

  if (typeof deliveryTime === 'number') {
    return `${deliveryTime} iş günü içinde`;
  }

  return '';
};

const ProductDeliveryWidget = React.memo(function ProductDeliveryWidget({ 
  sellerId, 
  cargoCompany, 
  deliveryTime: propDeliveryTime,
  termin,
  className = "" 
}: ProductDeliveryWidgetProps) {
  const [carrier, setCarrier] = useState<string>('Yurtiçi Kargo');
  const [carrierLogo, setCarrierLogo] = useState<string | null>(null);
  const [deliveryTime, setDeliveryTime] = useState<number>(propDeliveryTime || 2);
  const [loading, setLoading] = useState(!cargoCompany);

  // Eğer cargoCompany prop'u varsa, direkt onu kullan
  useEffect(() => {
    if (cargoCompany) {
      setCarrier(cargoCompany.deliveryOptionName);
      setCarrierLogo(cargoCompany.logo);
      
      // Eğer deliveryTime prop'u yoksa, API'den çek
      if (!propDeliveryTime && sellerId) {
        const fetchDeliveryTime = async () => {
          try {
            const response = await fetch(`https://api.trendruum.com/api/v1/sellers/${sellerId}/info`);
            const data = await response.json();
            
            if (data.meta?.status === 'success' && data.data?.shipping_policy?.general?.delivery_time) {
              setDeliveryTime(data.data.shipping_policy.general.delivery_time);
            }
          } catch (error) {
          }
        };
        fetchDeliveryTime();
      }
      
      setLoading(false);
      return;
    }

    if (!sellerId) {
      setLoading(false);
      return;
    }

    // Fallback: sellerId ile API'den çek (hem kargo hem teslimat süresi)
    const fetchCarrierInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.trendruum.com/api/v1/sellers/${sellerId}/info`);
        const data = await response.json();
        
        if (data.meta?.status === 'success' && data.data?.shipping_policy?.general) {
          const shippingInfo = data.data.shipping_policy.general;
          
          if (shippingInfo.carrier) {
            const normalizedCarrier = normalizeCarrierName(shippingInfo.carrier);
            setCarrier(normalizedCarrier);
            setCarrierLogo(CARRIER_LOGOS[normalizedCarrier] || null);
          }
          
          if (shippingInfo.delivery_time && !propDeliveryTime) {
            setDeliveryTime(shippingInfo.delivery_time);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCarrierInfo();
  }, [sellerId, cargoCompany, propDeliveryTime]);

  // Logo URL'sini belirle - önce carrierLogo state'ini, sonra CARRIER_LOGOS'u kontrol et
  const logoUrl = carrierLogo || CARRIER_LOGOS[carrier];
  const deliveryDate = calculateDeliveryDate(deliveryTime);
  const deliveryText = formatDeliveryText(termin, deliveryTime);

  if (loading) {
    return (
      <div className={`bg-gray-50 rounded-lg p-2.5 ${className}`}>
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gray-50 rounded-lg border border-gray-200 ${className}`}>
      {/* Kargoya Teslim Bilgisi */}
      <div className="flex items-center justify-between gap-2 p-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-600 rounded-md">
            <TruckIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium text-gray-700">
              Tahmini Teslim:{' '}
              <span className="text-gray-900 font-semibold">
                {deliveryText}
              </span>
            </span>
          </div>
        </div>
        
        {/* Kargo Logo - Sağ üstte */}
        {/* <div className="flex-shrink-0">
          {logoUrl ? (
            <Image 
              src={logoUrl}
              alt={carrier}
              width={32}
              height={12}
              className="object-contain"
              unoptimized
            />
          ) : (
            <span className="text-[10px] font-medium text-gray-600">{carrier}</span>
          )}
        </div> */}
      </div>
    </div>
  );
});

export default ProductDeliveryWidget;
