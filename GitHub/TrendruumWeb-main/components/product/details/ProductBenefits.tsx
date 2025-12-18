"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBagIcon,
  HeartIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  EyeIcon,
  ClockIcon,
  TruckIcon
} from '@heroicons/react/24/outline';

export interface ProductBenefitsData {
  badges?: {
    same_day?: boolean;
    fast_shipping?: boolean;
    cargo_free?: boolean;
  };
  seller?: {
    shipping_policy?: {
      general?: {
        delivery_time?: number | string;
      };
    };
  };
  termin?: string;
}

interface ProductBenefitsProps {
  product?: ProductBenefitsData;
  variant?: 'mobile' | 'desktop';
}

interface BenefitMessage {
  icon: typeof ShoppingBagIcon;
  text: string;
  baseValue: number;
  currentValue: number;
  initialVariation?: number; // İlk seçimdeki %30 varyasyon (optional, seçildikten sonra set edilir)
  formatValue: (value: number) => string;
  iconBgColor: string; // İkon arka plan rengi
  iconColor: string; // İkon rengi
}

// Tüm mesaj şablonları - Component dışında tanımlı
const allBenefits: BenefitMessage[] = [
  {
    icon: ShoppingBagIcon,
    text: 'Son 1 haftada {value} sipariş verildi!',
    baseValue: 28,
    currentValue: 28,
    formatValue: (v) => Math.round(v).toString(),
    iconBgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    icon: HeartIcon,
    text: 'Son 1 haftada {value} ürün favorilere eklendi!',
    baseValue: 72,
    currentValue: 72,
    formatValue: (v) => Math.round(v).toLocaleString('tr-TR'),
    iconBgColor: 'bg-pink-50',
    iconColor: 'text-pink-600'
  }
];

const ProductBenefits = ({ product, variant = 'mobile' }: ProductBenefitsProps) => {
  const isDesktop = variant === 'desktop';
  const [quickShipSeconds, setQuickShipSeconds] = useState(0);
  const [hourlyMultiplier, setHourlyMultiplier] = useState(1); // Her saat artış çarpanı
  const [selectedBenefits, setSelectedBenefits] = useState<BenefitMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // İstanbul saatine göre 14:00'a kadar kalan süreyi hesapla
  const calculateTimeUntil14 = () => {
    const now = new Date();
    
    // İstanbul saatini al
    const istanbulFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
    
    const istanbulTimeStr = istanbulFormatter.format(now);
    const [hour, minute, second] = istanbulTimeStr.split(':').map(Number);
    const currentHour = hour;
    const currentMinute = minute;
    const currentSecond = second;
    
    // İstanbul saatinde bugünün tarihini al
    const istanbulDateFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Istanbul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const istanbulDateStr = istanbulDateFormatter.format(now);
    const [month, day, year] = istanbulDateStr.split('/');
    
    // İstanbul saatinde 14:00:00 için Date objesi oluştur
    // ISO string formatında İstanbul timezone'u için
    const target14ISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T14:00:00+03:00`;
    const target14Date = new Date(target14ISO);
    
    // Şu anki İstanbul zamanını Date objesi olarak oluştur
    const currentISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}+03:00`;
    const currentIstanbulDate = new Date(currentISO);
    
    // Eğer şu an 14:00'dan sonraysa, yarın 14:00'a kadar say
    let targetTime = target14Date;
    if (currentHour >= 14) {
      const tomorrow = new Date(target14Date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      targetTime = tomorrow;
    }
    
    // Farkı hesapla (milisaniye cinsinden)
    const diffMs = targetTime.getTime() - currentIstanbulDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    
    return Math.max(0, diffSeconds);
  };

  // Her ürün için ilk iki mesajı seç
  useEffect(() => {
    const randomized = allBenefits.map(benefit => {
      const variation = 0.7 + Math.random() * 0.6;
      const randomValue = benefit.baseValue * variation;
      return {
        ...benefit,
        currentValue: randomValue,
        initialVariation: variation
      };
    });
    setSelectedBenefits(randomized);
  }, []);

  // 3 saniyede bir mesaj değiştir
  useEffect(() => {
    if (selectedBenefits.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % selectedBenefits.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedBenefits]);

  // Her saat değerleri güncelle (mesajlar aynı kalır, sadece değerler artar)
  useEffect(() => {
    setSelectedBenefits(prev => prev.map(benefit => ({
      ...benefit,
      currentValue: benefit.baseValue * (benefit.initialVariation || 1) * hourlyMultiplier
    })));
  }, [hourlyMultiplier]);

  const deliveryTimeRaw = product?.seller?.shipping_policy?.general?.delivery_time;
  const deliveryTimeNumber = typeof deliveryTimeRaw === 'string' ? Number(deliveryTimeRaw) : deliveryTimeRaw;
  const hasOneDayDelivery = deliveryTimeNumber === 1;
  const hasFastDelivery =
    hasOneDayDelivery ||
    (typeof deliveryTimeNumber === 'number' && deliveryTimeNumber > 0 && deliveryTimeNumber <= 3) ||
    (product?.termin?.toLowerCase().includes('1-3') ?? false);

  // İstanbul saatine göre 14:00'a kadar geri sayım - sadece hızlı kargo ürünlerde
  useEffect(() => {
    if (!hasFastDelivery) return;
    
    // İlk hesaplama
    setQuickShipSeconds(calculateTimeUntil14());
    
    const interval = setInterval(() => {
      const remaining = calculateTimeUntil14();
      setQuickShipSeconds(remaining);
      
      // Eğer 14:00'a ulaştıysa, yeni hesaplama yapılacak (otomatik olarak yarın 14:00'a geçer)
    }, 1000);

    return () => clearInterval(interval);
  }, [hasFastDelivery]);

  // Her 1 saatte değerleri %1-5 arasında random artır
  useEffect(() => {
    const updateHourlyMultiplier = () => {
      // %1-5 arası random artış (1.01 - 1.05)
      const increase = 1 + (0.01 + Math.random() * 0.04);
      setHourlyMultiplier(prev => prev * increase);
    };

    // İlk güncelleme
    updateHourlyMultiplier();

    // Her saat güncelle
    const interval = setInterval(updateHourlyMultiplier, 3600000); // 1 saat = 3600000 ms

    return () => clearInterval(interval);
  }, []);

  const quickShipHours = Math.floor(quickShipSeconds / 3600);
  const quickShipMinutes = Math.floor((quickShipSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');

  // 14 saatten az ise "bugün kargoda", 14 saat veya daha fazla ise "yarın kargoda"
  const isTodayShipping = quickShipHours < 14;
  const shippingText = isTodayShipping ? 'bugün kargoda' : 'yarın kargoda';

  const containerClass = isDesktop
    ? 'hidden md:flex flex-col gap-0.5'
    : 'flex flex-col md:hidden gap-0.5';

  const cardClass = 'flex items-center gap-2 bg-white rounded-lg p-2 md:p-2.5 mb-0.5 w-full';
//test
  return (
    <div className={containerClass}>
      {selectedBenefits.length > 0 && (() => {
            const benefit = selectedBenefits[currentIndex];
        const roundedValue = Math.round(benefit.currentValue);
        
        // Eğer sayı 1 veya daha küçükse, hiçbir şey gösterme
        if (roundedValue <= 1) {
          return null;
        }
        
            const Icon = benefit.icon;
            const formattedValue = benefit.formatValue(benefit.currentValue);
            const highlightClass = `${benefit.iconColor} font-semibold`;
            const renderText = () => {
              const text = benefit.text.replace('{value}', formattedValue);
              const parts = text.split(/(\d[\d.,+]*)/g);
              let sonHighlighted = false;
              return parts.map((part, idx) => {
                if (/^\d/.test(part)) {
                  return (
                    <span key={idx} className={highlightClass}>
                      {part}
                    </span>
                  );
                }
                if (!sonHighlighted) {
                  const sonIndex = part.indexOf('Son');
                  if (sonIndex !== -1) {
                    sonHighlighted = true;
                    return (
                      <React.Fragment key={idx}>
                        {part.slice(0, sonIndex)}
                        <span className={highlightClass}>Son</span>
                        {part.slice(sonIndex + 3)}
                      </React.Fragment>
                    );
                  }
                }
                return <React.Fragment key={idx}>{part}</React.Fragment>;
              });
            };
            return (
          <div className={cardClass}>
                <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 ${benefit.iconBgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${benefit.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] md:text-[10px] font-medium text-gray-900 leading-tight whitespace-nowrap overflow-hidden">
                    {renderText()}
                  </div>
                </div>
          </div>
            );
          })()}
      
      {/* Hızlı Kargo Sayaç - Sadece teslimat süresi 1 gün olan ürünlerde */}
      {hasFastDelivery && (
        <div className="flex items-center gap-2 rounded-lg p-2 md:p-2.5 mb-0.5 w-full">
          <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <TruckIcon className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0 text-[9px] md:text-[10px] text-gray-800 leading-tight whitespace-nowrap overflow-hidden">
            <span className="font-semibold text-green-600">
              {`Son ${quickShipHours} saat ${quickShipMinutes} dakika`}
            </span>
            {' içinde sipariş verirsen en geç '}
            <span className="font-semibold text-green-600">{shippingText}!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductBenefits;

