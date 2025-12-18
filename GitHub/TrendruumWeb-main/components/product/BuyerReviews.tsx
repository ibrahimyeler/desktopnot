"use client";

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface Review {
  id: string;
  userName: string;
  date: string;
  rating: number;
  comment: string;
  images?: string[];
  likes: number;
  dislikes: number;
}

interface BuyerReviewsProps {
  rating: number;
  totalReviews: number;
  satisfactionRate: number;
  reviews?: Review[];
  renderActionButton?: () => React.ReactNode;
}

const BuyerReviews = ({ rating, totalReviews, satisfactionRate, reviews = [], renderActionButton }: BuyerReviewsProps) => {
  // Yıldız dağılımını hesapla
  const starDistribution = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };

  // Reviews'den yıldız dağılımını hesapla
  reviews.forEach(review => {
    const starCount = Math.floor(review.rating);
    if (starCount >= 1 && starCount <= 5) {
      starDistribution[starCount as keyof typeof starDistribution]++;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`}
        data-clarity-region="ignore"
      />
    ));
  };

  const renderStarBar = (stars: number, count: number, total: number) => {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 w-20" data-clarity-region="ignore">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-600">{stars} yıldız</span>
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-32">
          <div 
            className="bg-yellow-400 h-1.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-600 w-8">{count}</span>
      </div>
    );
  };

  const isEmptyState = totalReviews === 0;
  
  return (
    <div className={isEmptyState ? 'space-y-3' : 'space-y-6'}>
      <h3 className={`font-semibold text-gray-900 ${isEmptyState ? 'text-sm tracking-wide' : 'text-lg'} hidden md:block`}>Ürün Değerlendirmeleri</h3>
      
      {/* Genel Rating */}
      {isEmptyState ? (
        <div className="md:hidden py-3.5 bg-gradient-to-b from-gray-50/80 to-transparent rounded-lg border border-gray-100/60 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2.5 px-3">
            <div className="flex items-center gap-2.5" data-clarity-region="ignore">
            <div className="flex items-center gap-0.5 opacity-70">
              {renderStars(Math.floor(rating))}
            </div>
            <span className="text-xl font-semibold text-gray-800">{rating}</span>
          </div>
            <div className="flex items-center gap-1.5">
          <p className="text-xs text-gray-400 font-normal tracking-wide">Henüz inceleme yapılmamış</p>
              {renderActionButton && (
                <div className="flex-shrink-0">
                  {renderActionButton()}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="hidden md:block text-center space-y-2 mb-6">
            <div className="flex items-center justify-center gap-2">
              {renderStars(Math.floor(rating))}
              <span className="text-3xl font-bold text-gray-900">{rating}</span>
            </div>
            <p className="text-base text-gray-600">
              {totalReviews} inceleme
            </p>
          </div>

          {/* Yıldız Dağılımı - Sadece Desktop'ta */}
          <div className="hidden md:block space-y-2 flex flex-col items-center">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="w-full max-w-xs">
                {renderStarBar(stars, starDistribution[stars as keyof typeof starDistribution], totalReviews)}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BuyerReviews; 