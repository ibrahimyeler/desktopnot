import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface BreadcrumbItem {
  name: string;
  href?: string;
  slug?: string;
  isLogo?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Swiper
        modules={[Navigation, FreeMode]}
        spaceBetween={4}
        slidesPerView="auto"
        freeMode={true}
        navigation={{
          nextEl: '.breadcrumb-next',
          prevEl: '.breadcrumb-prev',
        }}
        className="breadcrumb-swiper"
      >
        {/* Breadcrumb Items */}
        {items.map((item, index) => (
          <React.Fragment key={`breadcrumb-${index}`}>
            {index > 0 && (
              <SwiperSlide className="!w-auto" key={`chevron-${index}`}>
                <ChevronRightIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 flex items-center justify-center" />
              </SwiperSlide>
            )}
            <SwiperSlide className="!w-auto" key={`item-${index}`}>
              {item.isLogo ? (
                <Link
                  href={item.href || '/'}
                  className="text-gray-500 hover:text-orange-500 transition-colors whitespace-nowrap flex items-center justify-center h-4 sm:h-5 font-semibold"
                  title={item.name}
                >
                  {item.name}
                </Link>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-500 hover:text-orange-500 transition-colors whitespace-nowrap flex items-center justify-center h-4 sm:h-5"
                  title={item.name}
                >
                  {item.name}
                </Link>
              ) : (
                <span 
                  className="text-gray-900 font-medium whitespace-nowrap flex items-center justify-center h-4 sm:h-5"
                  title={item.name}
                >
                  {item.name}
                </span>
              )}
            </SwiperSlide>
          </React.Fragment>
        ))}
      </Swiper>

      {/* Navigation Buttons - Hidden on mobile, visible on desktop */}
      <div className="breadcrumb-prev hidden md:block absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRightIcon className="w-3 h-3 text-gray-600 rotate-180" />
      </div>
      <div className="breadcrumb-next hidden md:block absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRightIcon className="w-3 h-3 text-gray-600" />
      </div>

      <style jsx global>{`
        .breadcrumb-swiper {
          padding: 0 8px;
        }
        
        @media (min-width: 768px) {
          .breadcrumb-swiper {
            padding: 0 24px;
          }
        }
        
        .breadcrumb-swiper .swiper-slide {
          width: auto !important;
          flex-shrink: 0;
        }
        
        .breadcrumb-swiper .swiper-wrapper {
          align-items: center;
        }
        
        .breadcrumb-swiper .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .breadcrumb-swiper:hover .breadcrumb-prev,
        .breadcrumb-swiper:hover .breadcrumb-next {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default Breadcrumb;
