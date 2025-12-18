"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Swiper CSS'lerini import et
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Brand {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
}

interface BrandSliderProps {
  brands: Brand[];
  uniqueId?: string;
}

const BrandSlider: React.FC<BrandSliderProps> = ({ brands, uniqueId = 'default' }) => {
  // Brands array'inin geçerli olup olmadığını kontrol et
  if (!brands || brands.length === 0) {
    return (
      <div className="w-full bg-white py-2 sm:py-4">
        <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
          <div className="flex items-center mb-1 sm:mb-2">
            <span className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black">Size Özel Markalar</span>
          </div>
          <div className="text-center text-gray-500 py-8">
            Marka bulunamadı
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white py-2 sm:py-4">
      <div className="max-w-7xl mx-auto px-2 sm:px-3 lg:px-4 xl:px-6 2xl:px-8">
        <div className="flex items-center mb-1 sm:mb-2">
          <span className="text-base sm:text-base lg:text-lg xl:text-xl font-normal text-black">Size Özel Markalar</span>
        </div>
        
        <Swiper
          modules={[Navigation]}
          spaceBetween={12}
          slidesPerView={2}
          navigation={{
            nextEl: `.swiper-button-next-brands-${uniqueId}`,
            prevEl: `.swiper-button-prev-brands-${uniqueId}`,
          }}
          // pagination={{
          //   clickable: true,
          //   el: '.swiper-pagination-brands',
          // }}
          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 24,
            },
            1280: {
              slidesPerView: 6,
              spaceBetween: 24,
            },
            1536: {
              slidesPerView: 8,
              spaceBetween: 28,
            },
          }}
          className={`brand-swiper-${uniqueId}`}
        >
          {brands.filter(brand => brand && brand.id && brand.name && brand.name.trim() !== '').map((brand) => (
            <SwiperSlide key={brand.id}>
              <Link href={`/markalar/${brand.slug}`} className="block">
                <div className="flex flex-col items-center p-2 rounded-lg transition-all duration-300 cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full bg-white mb-2 border border-gray-200">
                    {brand.image ? (
                      <Image
                        src={brand.image.url}
                        alt={brand.name}
                        width={80}
                        height={80}
                        className="object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full"
                      />
                    ) : (
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-600">
                        {brand.name.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination - Hidden */}
        {/* <div className="swiper-pagination-brands flex justify-center mt-4 space-x-1"></div> */}

      </div>

      <style jsx global>{`
        .brand-swiper-${uniqueId} {
          position: relative;
          padding: 0 40px;
        }
        
        .brand-swiper-${uniqueId} .swiper-slide {
          height: auto;
        }
        
        
        @media (max-width: 640px) {
          .brand-swiper-${uniqueId} {
            padding: 0 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default BrandSlider;
