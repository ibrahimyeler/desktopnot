"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_V1_URL } from '@/lib/config';

interface ProductShippingProps {
  sellerId?: string;
  className?: string;
}

interface SellerInfo {
  shipping_policy: {
    general: {
      carrier: string;
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

// Kargo adı normalize etme (API'den farklı formatlar gelebilir)
const normalizeCarrierName = (carrier: string): string => {
  const normalized = carrier.trim();
  
  // Exact match kontrolü
  if (CARRIER_LOGOS[normalized]) {
    return normalized;
  }
  
  // Partial match kontrolü
  if (normalized.toLowerCase().includes('hepsi')) return 'HepsiJET';
  if (normalized.toLowerCase().includes('sürat') || normalized.toLowerCase().includes('surat')) return 'Sürat Kargo';
  if (normalized.toLowerCase().includes('kargoist')) return 'Kargoist';
  if (normalized.toLowerCase().includes('kolay')) return 'Kolay Gelsin';
  if (normalized.toLowerCase().includes('aras')) return 'Aras Kargo';
  if (normalized.toLowerCase().includes('ptt')) return 'PTT Kargo';
  if (normalized.toLowerCase().includes('yurtiçi') || normalized.toLowerCase().includes('yurtici')) return 'Yurtiçi Kargo';
  
  return normalized;
};

export default function ProductShipping({ sellerId, className = "" }: ProductShippingProps) {
  const [carrier, setCarrier] = useState<string>('Yurtiçi Kargo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) {
      setLoading(false);
      return;
    }

    const fetchCarrierInfo = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_V1_URL}/sellers/${sellerId}/info`);
        const data = await response.json();
        
        if (data.meta?.status === 'success' && data.data?.cargo_company?.deliveryOptionName) {
          const normalizedCarrier = normalizeCarrierName(data.data.cargo_company.deliveryOptionName);
          setCarrier(normalizedCarrier);
        } else if (data.meta?.status === 'success' && data.data?.shipping_policy?.general?.carrier) {
          // Fallback: Eski alan yapısı
          const normalizedCarrier = normalizeCarrierName(data.data.shipping_policy.general.carrier);
          setCarrier(normalizedCarrier);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchCarrierInfo();
  }, [sellerId]);

  const logoUrl = CARRIER_LOGOS[carrier];

  if (loading) {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <span className="text-sm text-gray-600 font-light">Kargo:</span>
        <div className="w-12 h-5 bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse rounded-md"></div>
      </div>
    );
  }

  if (!logoUrl) {
    // Logo bulunamazsa text olarak göster
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <span className="text-sm text-gray-600 font-light">Kargo:</span>
        <span className="text-xs text-gray-600 font-medium px-2.5 py-1 bg-gradient-to-r from-gray-100 to-gray-50 rounded-md border border-gray-200">
          {carrier}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <span className="text-sm text-gray-600 font-light">Kargo:</span>
      <div className="px-2 py-1 bg-white/50 rounded-md border border-orange-100/50">
        <Image 
          src={logoUrl}
          alt={carrier}
          width={48}
          height={18}
          className="object-contain"
          unoptimized
        />
      </div>
    </div>
  );
}
