"use client";

import React, { useState } from 'react';
import { StarIcon, ChevronLeftIcon, ChevronRightIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';

interface Review {
  id: string;
  rating: number;
  date: string;
  comment: string;
  userName: string;
  size?: string;
  height?: number;
  weight?: number;
  likes: number;
  dislikes: number;
  seller: {
    name: string;
    id: string;
  };
}

interface ProductReviewsProps {
  rating: number;
  totalReviews: number;
  totalComments: number;
  reviews: Review[];
}

const ProductReviews = ({ rating, totalReviews, totalComments, reviews }: ProductReviewsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev === Math.max(0, reviews.length - 3) ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? Math.max(0, reviews.length - 3) : prev - 1
    );
  };


  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
      <div className="space-y-6">
        {/* Başlık ve Genel Değerlendirme */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-black">
              Ürün Değerlendirmeleri
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {renderStars(rating)}
                <span className="text-xl font-bold text-black">{rating}</span>
              </div>
              <div className="text-black text-sm">
                <span className="font-medium">{totalReviews}</span> Değerlendirme
                <span className="mx-2">•</span>
                <span className="font-medium">{totalComments}</span> Yorum
              </div>
            </div>
          </div>

          {/* Kullanıcı Önerisi */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-orange-200">
            <LightBulbIcon className="w-4 h-4 text-orange-500" />
            <span className="text-xs text-orange-700">
              Kullanıcıların çoğu kendi bedeninizi almanızı öneriyor.
            </span>
          </div>
        </div>

        {/* Yorumlar Slider */}
        <div className="relative">
          {/* Slider Kontrolleri */}
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex gap-1 z-10">
            <button
              onClick={prevSlide}
              className="p-1.5 rounded-full bg-white shadow-md hover:bg-orange-50 transition-colors border border-orange-200"
            >
              <ChevronLeftIcon className="w-4 h-4 text-orange-600" />
            </button>
            <button
              onClick={nextSlide}
              className="p-1.5 rounded-full bg-white shadow-md hover:bg-orange-50 transition-colors border border-orange-200"
            >
              <ChevronRightIcon className="w-4 h-4 text-orange-600" />
            </button>
          </div>

          {/* Yorumlar */}
          <div className="overflow-hidden">
            <div 
              className="flex gap-4 transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 33.33}%)` }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="min-w-[calc(33.33%-1rem)] bg-white rounded-xl p-4 border border-orange-200 shadow-sm"
                >
                  {/* Yıldızlar */}
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Kullanıcı Bilgisi ve Tarih */}
                  <div className="flex items-center gap-2 text-xs text-black mt-2">
                    <span className="font-medium">{review.userName}</span>
                    <span>•</span>
                    <span>{review.date}</span>
                  </div>

                  {/* Beden Bilgileri */}
                  {(review.size || review.height || review.weight) && (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-black mt-2">
                      {review.size && <span>Beden: {review.size}</span>}
                      {review.height && <span>Boy: {review.height}</span>}
                      {review.weight && <span>Kilo: {review.weight}</span>}
                    </div>
                  )}

                  {/* Yorum */}
                  <p className="text-black text-sm mt-3 line-clamp-3">{review.comment}</p>

                  {/* Alt Bilgiler */}
                  <div className="mt-4 pt-3 border-t border-orange-200">
                    <div className="flex items-center justify-between">
                      {/* Satıcı */}
                      <div className="text-xs text-black">
                        {review.seller.name}
                      </div>
                      
                      {/* Beğeni Butonları */}
                      <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 text-xs text-black hover:text-orange-600">
                          <HandThumbUpIcon className="w-3 h-3" />
                          <span>{review.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 text-xs text-black hover:text-orange-600">
                          <HandThumbDownIcon className="w-3 h-3" />
                          <span>{review.dislikes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;