"use client";
import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';

interface SellerProfileProps {
  seller: {
    id: string;
    name: string;
    timeOnPlatform?: string;
    location?: string;
    corporateInvoice?: string;
    avgShippingTime?: string;
    avgResponseTime?: string;
    rating?: number;
    totalReviews?: number;
    totalComments?: number;
    ratingDistribution?: {
      [key: number]: number;
    };
    [key: string]: any;
  };
  isVisible: boolean;
  onClose: () => void;
}

interface SellerStats {
  timeOnPlatform: string;
  location: string;
  corporateInvoice: string;
  avgShippingTime: string;
  avgResponseTime: string;
  rating: number;
  totalReviews: number;
  totalComments: number;
  ratingDistribution: {
    [key: number]: number;
  };
  // Değerlendirme verileri
  productReviews: {
    rating: number;
    totalReviews: number;
    totalComments: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  sellerReviews: {
    rating: number;
    totalReviews: number;
    totalComments: number;
    ratingDistribution: {
      [key: number]: number;
    };
  };
  // Fotoğraflı değerlendirmeler
  photoReviews: Array<{
    id: string;
    imageUrl: string;
    alt: string;
  }>;
  // Örnek yorumlar
  sampleReviews: Array<{
    id: string;
    username: string;
    date: string;
    rating: number;
    comment: string;
    likes: number;
  }>;
}

const SellerProfile = ({ seller, isVisible, onClose }: SellerProfileProps) => {
  const [activeTab, setActiveTab] = useState<'product' | 'seller'>('product');
  
  // Seller verileri değiştiğinde stats'ı güncelle
  useEffect(() => {
    setSellerStats({
      timeOnPlatform: seller.timeOnPlatform || '7 Yıl',
      location: seller.location || 'İstanbul',
      corporateInvoice: seller.corporateInvoice || 'Uygun',
      avgShippingTime: seller.avgShippingTime || '21 Saat',
      avgResponseTime: seller.avgResponseTime || '30-45 Dk',
      rating: seller.rating || 4.3,
      totalReviews: seller.totalReviews || 810345,
      totalComments: seller.totalComments || 230600,
      ratingDistribution: seller.ratingDistribution || {
        5: 153200,
        4: 30700,
        3: 19000,
        2: 8795,
        1: 19000
      },
      productReviews: seller.productReviews || {
        rating: 4.3,
        totalReviews: 810345,
        totalComments: 230600,
        ratingDistribution: {
          5: 153200,
          4: 30700,
          3: 19000,
          2: 8795,
          1: 19000
        }
      },
      sellerReviews: seller.sellerReviews || {
        rating: 4.1,
        totalReviews: 1250,
        totalComments: 890,
        ratingDistribution: {
          5: 850,
          4: 250,
          3: 100,
          2: 30,
          1: 20
        }
      },
      photoReviews: seller.photoReviews || [
        { id: '1', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 1' },
        { id: '2', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 2' },
        { id: '3', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 3' },
        { id: '4', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 4' },
        { id: '5', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 5' },
        { id: '6', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 6' },
        { id: '7', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 7' }
      ],
      sampleReviews: seller.sampleReviews || [
        {
          id: '1',
          username: '**** ****',
          date: '21 Ağustos 2025',
          rating: 5,
          comment: 'Ürün kalitesi çok iyi, hızlı kargo. Tavsiye ederim...',
          likes: 0
        },
        {
          id: '2',
          username: '**** ****',
          date: '20 Ağustos 2025',
          rating: 4,
          comment: 'Güzel ürün, beklentilerimi karşıladı.',
          likes: 2
        }
      ]
    });
  }, [seller]);
  const [sellerStats, setSellerStats] = useState<SellerStats>({
    timeOnPlatform: seller.timeOnPlatform || '7 Yıl',
    location: seller.location || 'İstanbul',
    corporateInvoice: seller.corporateInvoice || 'Uygun',
    avgShippingTime: seller.avgShippingTime || '21 Saat',
    avgResponseTime: seller.avgResponseTime || '30-45 Dk',
    rating: seller.rating || 4.3,
    totalReviews: seller.totalReviews || 810345,
    totalComments: seller.totalComments || 230600,
    ratingDistribution: seller.ratingDistribution || {
      5: 153200,
      4: 30700,
      3: 19000,
      2: 8795,
      1: 19000
    },
    productReviews: seller.productReviews || {
      rating: 4.3,
      totalReviews: 810345,
      totalComments: 230600,
      ratingDistribution: {
        5: 153200,
        4: 30700,
        3: 19000,
        2: 8795,
        1: 19000
      }
    },
    sellerReviews: seller.sellerReviews || {
      rating: 4.1,
      totalReviews: 1250,
      totalComments: 890,
      ratingDistribution: {
        5: 850,
        4: 250,
        3: 100,
        2: 30,
        1: 20
      }
    },
    photoReviews: seller.photoReviews || [
      { id: '1', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 1' },
      { id: '2', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 2' },
      { id: '3', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 3' },
      { id: '4', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 4' },
      { id: '5', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 5' },
      { id: '6', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 6' },
      { id: '7', imageUrl: '/placeholder.webp', alt: 'Ürün fotoğrafı 7' }
    ],
    sampleReviews: seller.sampleReviews || [
      {
        id: '1',
        username: '**** ****',
        date: '21 Ağustos 2025',
        rating: 5,
        comment: 'Ürün kalitesi çok iyi, hızlı kargo. Tavsiye ederim...',
        likes: 0
      },
      {
        id: '2',
        username: '**** ****',
        date: '20 Ağustos 2025',
        rating: 4,
        comment: 'Güzel ürün, beklentilerimi karşıladı.',
        likes: 2
      }
    ]
  });

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} className="w-5 h-5 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarOutlineIcon className="w-5 h-5 text-yellow-400" />
            <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIcon className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<StarOutlineIcon key={i} className="w-5 h-5 text-yellow-400" />);
      }
    }
    return stars;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  
  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
      {/* Kapatma Butonu */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Satıcı Profili</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 active:text-gray-700 transition-colors touch-manipulation active:scale-95 p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Satıcı Bilgileri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Trendruum'daki Süresi</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{sellerStats.timeOnPlatform}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Konum</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{sellerStats.location}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 sm:col-span-2 md:col-span-1">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Kurumsal Fatura</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{sellerStats.corporateInvoice}</div>
        </div>
      </div>

      {/* Performans Metrikleri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Ortalama Kargolama Süresi</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{sellerStats.avgShippingTime}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Soru Cevaplama Süresi</div>
          <div className="text-base sm:text-lg font-semibold text-gray-900">{sellerStats.avgResponseTime}</div>
        </div>
      </div>

      {/* Değerlendirme Sekmeleri */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-4 sm:space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('product')}
            className={`pb-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation active:scale-95 ${
              activeTab === 'product'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 active:text-gray-800'
            }`}
          >
            Ürün Değerlendirmeleri
          </button>
          <button
            onClick={() => setActiveTab('seller')}
            className={`pb-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap touch-manipulation active:scale-95 ${
              activeTab === 'seller'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 active:text-gray-800'
            }`}
          >
            Satıcı Değerlendirmeleri
          </button>
        </div>
      </div>

      {/* Değerlendirme İçeriği */}
      <div className="space-y-6">
        {/* Boş durum mesajı */}
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'product' ? 'Henüz ürün değerlendirmesi yok' : 'Henüz satıcı değerlendirmesi yok'}
          </h3>
          <p className="text-sm text-gray-500">
            {activeTab === 'product' 
              ? 'Bu satıcının ürünleri için henüz değerlendirme yapılmamış.' 
              : 'Bu satıcı için henüz değerlendirme yapılmamış.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
