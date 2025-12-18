"use client";

import React from 'react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { API_V1_URL } from '@/lib/config';

interface LinkItem {
  title: string;
  color: string;
  link: string;
  textColor?: string;
  image?: string;
}

interface PromotionLinksProps {
  links?: LinkItem[];
}

const PromotionLinks: React.FC<PromotionLinksProps> = ({ links }) => {
  const router = useRouter();
  const [linksState, setLinksState] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false); // Başlangıçta false, cache varsa hemen göster
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const processData = (data: any) => {
    if (data.meta.status === 'success' && data.data) {
      const promotionalSection = data.data.sections.find((section: any) => section.slug === 'promotional-links');
      
      if (promotionalSection) {
      
      
        // Arka plan rengini al
        const bgColorField = promotionalSection.fields.find((field: any) => field.slug === 'background-color');
        if (bgColorField) {
          const bgColor = bgColorField.items.find((item: any) => item.slug === 'bg-color')?.value;
          if (bgColor) {
            setBackgroundColor(bgColor);
          }
        }

        const formattedLinks = promotionalSection.fields
          .filter((field: any) => field.slug === 'promotional-links')
          .map((field: any) => ({
            title: field.items.find((item: any) => item.slug === 'link-title')?.value || '',
            color: field.items.find((item: any) => item.slug === 'link-color')?.value || '#ffffff',
            link: field.items.find((item: any) => item.slug === 'link-link')?.value || '',
            image: field.items.find((item: any) => item.slug === 'link-picture')?.value || '',
            textColor: field.items.find((item: any) => item.slug === 'link-text-color')?.value || '#000000'
          }))
          .filter((link: LinkItem) => link.title && link.image);
        
        setLinksState(formattedLinks);
        
        // İlk 2 resmi preload et
        if (formattedLinks.length > 0) {
          const preloadImages = formattedLinks.slice(0, 2);
          preloadImages.forEach((link: LinkItem) => {
            if (link.image) {
              const img = new window.Image();
              img.src = link.image;
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    // Props olarak gelen links'i kullan
    if (links && links.length > 0) {
      setLinksState(links.filter((link: LinkItem) => link.title && link.image));
      setLoading(false);
      
      // İlk 2 resmi preload et - lazy loading ile (layout shift'i önlemek için)
      if (links.length > 0 && typeof window !== 'undefined') {
        // RequestIdleCallback ile preload (mobilde layout shift'i önlemek için)
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            links.slice(0, 2).forEach((link: LinkItem) => {
              if (link.image) {
                const img = new window.Image();
                img.src = link.image;
              }
            });
          }, { timeout: 2000 });
        } else {
          // Fallback: setTimeout ile gecikmeli preload
          setTimeout(() => {
            links.slice(0, 2).forEach((link: LinkItem) => {
              if (link.image) {
                const img = new window.Image();
                img.src = link.image;
              }
            });
          }, 500);
        }
      }
    } else {
      // Fallback: API'den veri çek (sadece links prop'u yoksa)
      const fetchPromotionalLinks = async () => {
        try {
          setLoading(true);
          
          // 3 saniye timeout ile API çağrısı
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const res = await fetch(`${API_V1_URL}/pages/homepage`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          
          const data = await res.json();
          processData(data);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      };

      fetchPromotionalLinks();
    }
  }, [links]);

  

  const handleLinkClick = (link: string) => {
    if (link) {
      // Eğer link bir kategori slug'ı ise, kategori sayfasına yönlendir
      if (link.startsWith('/')) {
        router.push(link);
      } else if (link.includes('=')) {
        // Eğer link query parametreleri içeriyorsa, flash-urunler sayfasına yönlendir
        router.push(`/flash-urunler?${link}`);
      } else {
        // Basit kategori slug'ı ise kategori sayfasına yönlendir
        router.push(`/${link}`);
      }
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="flex items-center pb-2 sm:justify-start gap-[25.6px] sm:gap-[20px]">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="flex flex-col items-center flex-shrink-0">
          <div className="w-[74.4px] h-[74.4px] mb-2 sm:w-[115px] sm:h-[115px] bg-gray-200 rounded-none animate-pulse"></div>
          <div className="w-[12.8px] sm:w-16 h-[3.2px] sm:h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );

  const renderPromotionItem = (link: LinkItem, index: number) => (
    <div 
      className="flex flex-col items-center cursor-pointer flex-shrink-0"
      onClick={() => handleLinkClick(link.link)}
    >
      <div
        className="flex items-center justify-center mb-2 border-2 border-gray-200 rounded-none overflow-hidden w-[74.4px] h-[74.4px] sm:w-[115px] sm:h-[115px]"
        style={{
          background: link.color
        }}
      >
        {link.image && link.image.trim() !== '' ? (
          <img
            src={link.image}
            alt={link.title}
            className="w-full h-full object-cover"
            loading={index < 2 ? "eager" : "lazy"} // İlk 2 resim hemen, diğerleri lazy
            decoding="async"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-sm sm:text-lg font-bold text-gray-600"
            style={{ backgroundColor: link.color }}
          >
            {link.title.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <span 
        className="font-semibold text-center mt-0.5 whitespace-nowrap text-[10px] sm:text-xs sm:font-bold" 
        style={{ color: '#111' }} 
        title={link.title}
      >
        {link.title}
      </span>
    </div>
  );

  return (
    <div className="w-full flex justify-center items-center mb-5 pt-4">
      <div className="w-full px-0 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 mx-auto" style={{ maxWidth: 'min(1600px, 95vw)' }}>
        {/* Tek Satır Slider - Tüm Ekranlar */}
        <div 
          className="overflow-x-auto scrollbar-hide w-full"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: 'smooth',
            scrollSnapType: 'x mandatory',
            touchAction: 'pan-x',
            msOverflowStyle: '-ms-autohiding-scrollbar'
          }}
        >
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div 
              className="flex items-center justify-center pb-2 gap-[25.6px] sm:gap-[20px]" 
              style={{ width: 'max-content', margin: '0 auto' }}
            >
              {linksState.map((link: LinkItem, index: number) => (
                <div 
                  key={index} 
                  className="flex-shrink-0"
                  style={{
                    scrollSnapAlign: 'start'
                  }}
                >
                  {renderPromotionItem(link, index)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromotionLinks; 