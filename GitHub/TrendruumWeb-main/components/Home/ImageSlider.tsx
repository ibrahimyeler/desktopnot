"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageSliderProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const ImageSlider: React.FC<ImageSliderProps> = ({ 
  images, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Her resim için URL belirleme fonksiyonu
  const getImageUrl = (imagePath: string) => {
    if (imagePath.includes('slider1.png')) {
      return '/markalar/arcelik_7943';
    }
    if (imagePath.includes('slider2.png')) {
      return '/markalar/lova-yatak_1054184';
    }
    if (imagePath.includes('slider3.png')) {
      return '/markalar/karaca_852';
    }
    if (imagePath.includes('slider4.png')) {
      return '/markalar/sinbo_8607';
    }
    if (imagePath.includes('slider5.png')) {
      return '/magaza/trendruum';
    }
    // Diğer resimler için varsayılan URL'ler eklenebilir
    return '#';
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden group">
      {/* Main Image - Tıklanabilir */}
      <div className="relative w-full h-full">
        <Link 
          href={getImageUrl(images[currentIndex])}
          className="block w-full h-full"
        >
          <Image
            src={images[currentIndex]}
            alt={`Slider Image ${currentIndex + 1}`}
            fill
            className="object-contain transition-opacity duration-500 cursor-pointer rounded-lg"
            priority={currentIndex === 0}
            loading={currentIndex === 0 ? "eager" : "lazy"}
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 60vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </Link>
      </div>

      {/* Navigation Arrows - Hidden on mobile, visible on hover */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}


    </div>
  );
};

export default ImageSlider;
