"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const banners = [
  {
    id: 1,
    image: '/banner1.jpg',
    review: 'Ürün harika, çok memnun kaldım!',
    user: {
      name: 'Ayşe Y.',
      avatar: '/avatar1.png',
    },
  },
  {
    id: 2,
    image: '/banner2.jpg',
    review: 'Kargo hızlıydı, paketleme çok iyiydi.',
    user: {
      name: 'Mehmet K.',
      avatar: '/avatar2.png',
    },
  },
  {
    id: 3,
    image: '/banner3.jpg',
    review: 'Fiyat/performans ürünü, tavsiye ederim.',
    user: {
      name: 'Zeynep T.',
      avatar: '/avatar3.png',
    },
  },
];

const BannerWithReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextBanner, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-[1600px] mx-auto">
      {/* Banner alanı */}
      <div className="relative w-full h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden bg-gray-200">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute w-full h-full transition-opacity duration-500 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={banner.image}
              alt={banner.user.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
        <button
          onClick={prevBanner}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={nextBanner}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
        {/* Dot indicators - Hidden */}
        {/* <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, idx) => (
            <span
              key={idx}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div> */}
      </div>
      {/* Yorumlar alanı */}
      <div className="w-full flex justify-center gap-6 mt-6">
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`flex flex-col items-center bg-gray-200 rounded-xl p-6 w-56 transition-all duration-300 ${
              idx === currentIndex ? 'scale-105 shadow-lg border-2 border-blue-600' : 'opacity-60'
            }`}
          >
            <div className="relative w-16 h-16 mb-3">
              <Image
                src={banner.user.avatar}
                alt={banner.user.name}
                fill
                className="rounded-full object-cover"
                sizes="64px"
              />
            </div>
            <div className="text-center text-gray-600 text-base mb-2">
              &ldquo;{banner.review}&rdquo;
            </div>
            <div className="text-gray-500 text-sm font-semibold">{banner.user.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BannerWithReviews; 