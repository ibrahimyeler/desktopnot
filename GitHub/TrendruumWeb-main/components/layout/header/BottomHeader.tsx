"use client";

import Link from 'next/link';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useMenu } from '@/app/context/MenuContext';
import { usePathname } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import CategoryDropdown from './CategoryDropdown';
import MegaMenu from './MegaMenu';

// Dropdown menü için kategori slug'ları
const CATEGORY_SLUGS: { [key: string]: string } = {
  'Ev & Mobilya': 'ev-mobilya',
  'Giyim': 'giyim',
  'Elektronik': 'elektronik',
  'Anne & Bebek & Çocuk': 'anne-bebek-cocuk',
  'Kozmetik & Kişisel Bakım': 'kozmetik-kisisel-bakim',
  'Spor & Outdoor': 'spor-outdoor',
  'Süpermarket & Petshop': 'supermarket',
  'Otomobil & Motosiklet': 'otomobil-motosiklet',
  'Aksesuar': 'aksesuar',
  'Ayakkabı': 'ayakkabi'
};

const BottomHeader = () => {
  // Cookie popup açık mı kontrol et
  const [isCookiePopupOpen, setIsCookiePopupOpen] = useState(false);

  useEffect(() => {
    const checkCookiePopup = () => {
      const cookieAccepted = localStorage.getItem('cookieAccepted');
      const cookieAcceptedSession = sessionStorage.getItem('cookieAcceptedSession');
      // Cookie popup açık değilse (yani kullanıcı henüz tercih yapmamışsa)
      setIsCookiePopupOpen(!cookieAccepted && !cookieAcceptedSession);
    };

    checkCookiePopup();
    // Her 500ms'de bir kontrol et (cookie popup açıldığında/ kapandığında algılamak için)
    const interval = setInterval(checkCookiePopup, 500);
    return () => clearInterval(interval);
  }, []);
  const { navigationLinks, categories, menuSections } = useMenu();
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [hoveredCategory, setHoveredCategory] = useState<string>('');
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Cache for processed categories with localStorage
  useMemo(() => {
    if (!categories.length) return new Map();
    
    // Check localStorage first
    if (typeof window !== 'undefined') {
      const cachedData = localStorage.getItem('megaMenuCache');
      const cacheTimestamp = localStorage.getItem('megaMenuCacheTimestamp');
      const now = Date.now();
      
      // Cache is valid for 1 hour (3600000 ms)
      if (cachedData && cacheTimestamp && (now - parseInt(cacheTimestamp)) < 3600000) {
        try {
          const parsedCache = new Map(JSON.parse(cachedData));
          return parsedCache;
        } catch (error) {
        }
      }
    }
    
    // Build new cache
    const cache = new Map();
    categories.slice(0, 20).forEach(cat => {
      const processedSubcategories = (cat.children || []).slice(0, 10).map(child => ({
        title: child.name,
        children: (child.children || []).slice(0, 8),
        id: child.id,
        slug: child.slug
      }));
      cache.set(cat.slug, processedSubcategories);
    });
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('megaMenuCache', JSON.stringify(Array.from(cache.entries())));
        localStorage.setItem('megaMenuCacheTimestamp', Date.now().toString());
      } catch (error) {
      }
    }
    
    return cache;
  }, [categories]);

  // URL'den aktif kategoriyi belirle
  React.useEffect(() => {
    const currentPath = pathname;
    // pages/ ile başlayan path'i kontrol et
    const pageSlug = currentPath?.split('/s/')?.[1];
    
    if (pageSlug) {
      const currentNavItem = navigationLinks.find(link => link.slug === pageSlug);
      if (currentNavItem) {
        setActiveCategory(currentNavItem.name);
      }
    } else {
      // Eğer pages/ ile başlamıyorsa active category'i temizle
      setActiveCategory('');
    }
  }, [pathname, navigationLinks]);

  // Statik kategori sıralaması: Erkek, Kadın, Ev ve Yaşam, Elektronik
  const sortedNavigationLinks = useMemo(() => {
    if (!navigationLinks || navigationLinks.length === 0) return [];
    
    // Öncelikli kategorilerin slug'ları (istenen sırayla)
    const prioritySlugs = ['erkek', 'kadin', 'ev-ve-yasam', 'ev-yasam', 'elektronik'];
    
    // Öncelikli kategorileri bul
    const priorityCategories: typeof navigationLinks = [];
    const otherCategories: typeof navigationLinks = [];
    
    navigationLinks.forEach(item => {
      const slug = item.slug.toLowerCase();
      if (prioritySlugs.includes(slug)) {
        priorityCategories.push(item);
      } else {
        otherCategories.push(item);
      }
    });
    
    // Öncelikli kategorileri istenen sıraya göre sırala
    const sortedPriority = prioritySlugs
      .map(slug => priorityCategories.find(item => item.slug.toLowerCase() === slug))
      .filter(Boolean) as typeof navigationLinks;
    
    // Öncelikli kategoriler + diğerleri
    return [...sortedPriority, ...otherCategories];
  }, [navigationLinks]);

  // Scroll kontrolü
  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [sortedNavigationLinks]);

  // Scroll fonksiyonları - Her zaman bir kategori kadar kaydır
  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const allItems = Array.from(container.querySelectorAll('div[data-category-item]')) as HTMLElement[];
    
    // Görünür alan içindeki ilk kategoriyi bul
    let firstVisibleItem: HTMLElement | null = null;
    for (const item of allItems) {
      const itemRect = item.getBoundingClientRect();
      if (itemRect.left >= containerRect.left && itemRect.right <= containerRect.right) {
        firstVisibleItem = item;
        break;
      }
    }
    
    // Eğer görünür item yoksa, container'ın sol kenarından sonraki ilk item'ı al
    if (!firstVisibleItem) {
      for (const item of allItems) {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.left >= containerRect.left) {
          firstVisibleItem = item;
          break;
        }
      }
    }
    
    if (firstVisibleItem) {
      const itemWidth = firstVisibleItem.getBoundingClientRect().width;
      // space-x-3 sm:space-x-4 lg:space-x-6 için ortalama spacing kullan
      const spacing = window.innerWidth >= 1024 ? 24 : window.innerWidth >= 640 ? 16 : 12;
      const scrollAmount = itemWidth + spacing;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      // Fallback: container genişliğinin bir kısmı kadar kaydır
      container.scrollBy({ left: -container.clientWidth * 0.8, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();
    const allItems = Array.from(container.querySelectorAll('div[data-category-item]')) as HTMLElement[];
    
    // Görünür alan içindeki son kategoriyi bul
    let lastVisibleItem: HTMLElement | null = null;
    for (let i = allItems.length - 1; i >= 0; i--) {
      const item = allItems[i];
      const itemRect = item.getBoundingClientRect();
      if (itemRect.left >= containerRect.left && itemRect.right <= containerRect.right) {
        lastVisibleItem = item;
        break;
      }
    }
    
    // Eğer görünür item yoksa, container'ın sağ kenarından önceki ilk item'ı al
    if (!lastVisibleItem) {
      for (let i = 0; i < allItems.length; i++) {
        const item = allItems[i];
        const itemRect = item.getBoundingClientRect();
        if (itemRect.right > containerRect.right) {
          lastVisibleItem = item;
          break;
        }
      }
    }
    
    if (lastVisibleItem) {
      const itemWidth = lastVisibleItem.getBoundingClientRect().width;
      // space-x-3 sm:space-x-4 lg:space-x-6 için ortalama spacing kullan
      const spacing = window.innerWidth >= 1024 ? 24 : window.innerWidth >= 640 ? 16 : 12;
      const scrollAmount = itemWidth + spacing;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      // Fallback: container genişliğinin bir kısmı kadar kaydır
      container.scrollBy({ left: container.clientWidth * 0.8, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className={`hidden md:block w-full bg-gray-100 text-gray-700 relative py-2 ${isCookiePopupOpen ? 'z-40' : 'z-[100]'}`}>
        <div className="w-full mx-auto max-w-full sm:max-w-full md:max-w-full lg:max-w-full pl-[41px] pr-[35px] sm:pl-[39px] sm:pr-[35px] md:pl-[39px] md:pr-[44px] lg:pl-[47px] lg:pr-[52px] xl:pl-[55px] xl:pr-[60px] 2xl:pl-[63px] 2xl:pr-[68px] h-full flex items-center gap-6">
          {/* Left - All Categories Button (Hidden on mobile) */}
          <div className="relative flex-shrink-0">
            <div 
              className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-all duration-300 bg-white/95 border border-orange-100/70 px-4 pr-5 py-2 rounded-full -ml-2 relative cursor-pointer group" 
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 transition-all duration-300 group-hover:scale-110">
                <defs>
                  <linearGradient id="categoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F9AF02" />
                    <stop offset="50%" stopColor="#EC6D04" />
                    <stop offset="100%" stopColor="#F9AF02" />
                  </linearGradient>
                </defs>
                <rect x="0.5" y="0.5" width="6.5" height="6.5" rx="1.5" fill="url(#categoryGradient)" className="group-hover:opacity-90 transition-opacity"/>
                <rect x="11.5" y="0.5" width="6.5" height="6.5" rx="1.5" fill="url(#categoryGradient)" className="group-hover:opacity-90 transition-opacity"/>
                <rect x="0.5" y="11.5" width="6.5" height="6.5" rx="1.5" fill="url(#categoryGradient)" className="group-hover:opacity-90 transition-opacity"/>
                <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.5" fill="url(#categoryGradient)" className="group-hover:opacity-90 transition-opacity"/>
              </svg>
              <span className="text-sm font-semibold tracking-wide text-gray-800 transition-colors duration-300 group-hover:text-gray-900">
                TÜM KATEGORİLER
              </span>
            </div>
            <MegaMenu
              isVisible={showMegaMenu}
              categories={categories.slice(0, 20)}
              navigationLinks={navigationLinks}
              menuSections={menuSections}
              onMouseEnter={() => setShowMegaMenu(true)}
              onMouseLeave={() => setShowMegaMenu(false)}
            />
          </div>

          {/* Center - Category Links with Scroll Buttons */}
          <div className="flex items-center flex-1 relative ml-2 sm:ml-4 lg:ml-6 min-w-0">
            {/* Left Scroll Button - Always visible at the start */}
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`flex-shrink-0 z-10 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-600 p-1.5 rounded-lg transition-all duration-200 mr-2 shadow-sm hover:shadow-md ${
                !canScrollLeft ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              aria-label="Sola kaydır"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            
            {/* Category Links Container - Scrollbar hidden */}
            <div 
              ref={scrollContainerRef}
              className="flex items-center space-x-2 sm:space-x-2.5 lg:space-x-3 flex-1 justify-start overflow-x-auto overflow-y-hidden min-w-0 pr-12 sm:pr-14 lg:pr-16 scrollbar-hide"
              style={{ 
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {sortedNavigationLinks.map((item) => (
                <div
                  key={item.url}
                  data-category-item
                  className="relative group whitespace-nowrap flex-shrink-0"
                  onMouseEnter={() => setHoveredCategory(item.name)}
                  onMouseLeave={() => setHoveredCategory('')}
                >
                  <Link 
                    href={`/s/${item.slug}`}
                    prefetch={false}
                    className={`relative text-[11px] sm:text-xs font-semibold tracking-wide transition-all duration-300 px-2 py-1 rounded-md ${
                      activeCategory === item.name 
                        ? 'text-orange-600 bg-orange-50' 
                        : 'text-gray-800 hover:text-orange-600 hover:bg-orange-50/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                  {/* <CategoryDropdown
                    categorySlug={CATEGORY_SLUGS[item.name] || item.slug}
                    isVisible={hoveredCategory === item.name}
                    onMouseEnter={() => setHoveredCategory(item.name)}
                    onMouseLeave={() => setHoveredCategory('')}
                  /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Scroll Button - Fixed at the right edge, extending to cart position */}
        <div className="absolute right-[10px] top-0 bottom-0 flex items-center pr-[19px] sm:pr-[11px] md:pr-[14px] lg:pr-[18px] xl:pr-[20px] 2xl:pr-[23px] pointer-events-none">
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`flex-shrink-0 z-10 bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-300 text-gray-600 hover:text-orange-600 p-1.5 rounded-lg transition-all duration-200 pointer-events-auto shadow-sm hover:shadow-md ${
              !canScrollRight ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            aria-label="Sağa kaydır"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      
    </>
  );
};

export default BottomHeader; 