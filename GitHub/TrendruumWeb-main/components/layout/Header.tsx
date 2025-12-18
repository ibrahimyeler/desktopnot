"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthOptional } from '@/app/context/AuthContext';
import { useBasket } from '@/app/context/BasketContext';
import { useFavorites } from '@/app/context/FavoriteContext';
import { useMenu } from '@/app/context/MenuContext';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import { API_V1_URL } from '@/lib/config';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
  HomeIcon,
  TagIcon,
  BookmarkIcon,
  PhoneIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import NotificationPreferencesModal from '@/components/common/NotificationPreferencesModal';

// Import the new header components
import TopHeader from './header/TopHeader';
import MiddleHeader from './header/MiddleHeader';
import BottomHeader from './header/BottomHeader';
import Portal from '@/components/common/Portal';
import { buildCategoryTree, type CategoryNode } from './header/menuUtils';
import type { MenuItem } from '@/app/context/MenuContext';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  medias: {
    url: string;
    type: string;
  }[];
  images?: {
    url: string;
    type: string;
  }[];
  brand: {
    name: string;
    slug: string;
  };
}

interface SearchResponse {
  meta: {
    status: string;
    message: string;
    code: number;
  };
  data: SearchResult[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface HeaderProps {
  onPreferencesSet?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  hideSearchAndProfile?: boolean;
  mobileSpacerHeight?: number;
}

// Kategori ikonlarını siyah renkte tanımlayalım
const categoryIcons: { [key: string]: React.ReactElement } = {
  'kadin': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'erkek': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'elektronik': <ComputerDesktopIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'araba-parcalari': <ShoppingBagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'ev-yasam': <HomeIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'anne-cocuk': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'kozmetik': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'ayakkabi-canta': <ShoppingBagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'supermarket': <ShoppingBagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  // Eski kategoriler için fallback
  'erkek-giyim': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'bilgisayarlar': <ComputerDesktopIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  't-shirt': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'moda-ve-giyim': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'ev-ve-yasam': <HomeIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'spor-ve-outdoor': <ShoppingBagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'giyim': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'taki': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
  'altin-pirlanta': <TagIcon className="w-4 h-4 mr-2 transition-colors duration-200 group-hover:text-orange-500" />,
};

const normalizeHref = (href?: string) => {
  if (!href) {
    return '/';
  }
  const trimmed = href.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/([^:]\/)\/+/g, '$1');
  }
  let cleaned = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  cleaned = cleaned.replace(/^\/+/, '/');
  cleaned = cleaned.replace(/\/{2,}/g, '/');
  return cleaned;
};

const isExternalHref = (href: string) => /^https?:\/\//i.test(href);

const Header = React.forwardRef<HTMLDivElement, HeaderProps>(({ onPreferencesSet, showBackButton = false, onBackClick, hideSearchAndProfile = false, mobileSpacerHeight }, ref) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState<'main' | 'categories' | 'subcategories' | 'account'>('main');
  const [selectedCategory, setSelectedCategory] = useState<MenuItem | null>(null);
  const [selectedCategoryTree, setSelectedCategoryTree] = useState<CategoryNode | null>(null);
  const [selectedSubcategoryNode, setSelectedSubcategoryNode] = useState<CategoryNode | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLDivElement | null>(null);
  
  // Desktop kontrolü - mobilde BottomHeader'ı render etmemek için
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);
  
  const authContext = useAuthOptional();
  const { 
    isLoggedIn = false, 
    user = null, 
    logout = () => {},
    showNotificationModal = false,
    setShowNotificationModal = () => {}
  } = authContext || {};

  const { navigationLinks, categories, topNavLinks, megaMenuItems, menuSections } = useMenu();
  const { basket, totalQuantity } = useBasket();
  const { favoritesCount } = useFavorites();
  const pathname = usePathname();
  const router = useRouter();

  const itemCount = totalQuantity;

  // Statik kategori sıralaması: Erkek, Kadın, Ev ve Yaşam, Elektronik (mobil menü için - sadece megaMenuItems kullan)
  const sortedMobileCategories = React.useMemo(() => {
    // Mobil menüde sadece megaMenuItems kullan, navigationLinks kullanma
    if (!megaMenuItems || megaMenuItems.length === 0) return [];
    
    // Öncelikli kategorilerin slug'ları (istenen sırayla)
    const prioritySlugs = ['erkek', 'kadin', 'ev-ve-yasam', 'ev-yasam', 'elektronik'];
    
    // Öncelikli kategorileri bul
    const priorityCategories: typeof megaMenuItems = [];
    const otherCategories: typeof megaMenuItems = [];
    
    megaMenuItems.forEach(item => {
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
      .filter(Boolean) as typeof megaMenuItems;
    
    // Öncelikli kategoriler + diğerleri
    return [...sortedPriority, ...otherCategories];
  }, [megaMenuItems]);
  const scheduledSearchRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchExecutedAt = useRef<number>(0);

  // Search products function
  const searchProducts = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`https://api.trendruum.com/api/v1/products/search?name=${encodeURIComponent(query)}&page=1&include_filters=1`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (response.data.meta?.status === 'success') {
        const data = response.data.data;
        const productsArray = data.childrenProducts ? Object.values(data.childrenProducts) : [];
        const products = productsArray.slice(0, 5).map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          medias: product.medias,
          brand: product.brand_v2
        }));
        setSearchResults(products);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce ile arama - minimum 2 karakter, 500ms bekleme
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    // Minimum 2 karakter kontrolü
    if (trimmedQuery.length < 2) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    // Debounce: 500ms bekle, sonra arama yap
    const timeoutId = setTimeout(() => {
      let isCancelled = false;

      const performSearch = async () => {
        if (isCancelled) return;
        
        setIsSearching(true);
        try {
          await searchProducts(trimmedQuery);
        } finally {
          if (!isCancelled) {
            setIsSearching(false);
          }
        }
      };

      performSearch();
    }, 500); // 500ms debounce

    // Cleanup: Her yeni yazımda önceki timeout'u iptal et
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchQuery, searchProducts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | PointerEvent) => {
      // Sadece desktop için click-outside; mobilde (iOS/Android) modal açıkken kapatma yapma
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return;
      }

      const target = event.target as HTMLElement;

      // Interactive elementlerde kapanma tetikleme
      if (target.closest('button') || target.closest('a')) {
        return;
      }

      // Arama dropdown kapsayıcılarını (desktop) yoksay
      if (
        target.closest('.dropdown-container') ||
        target.closest('.desktop-dropdown') ||
        target.closest('.desktop-scroll')
      ) {
        return;
      }

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, []);

  const resetMobileMenuState = () => {
    setMobileMenuView('main');
    setSelectedCategory(null);
    setSelectedCategoryTree(null);
    setSelectedSubcategoryNode(null);
  };

  const handleLogout = async () => {
    try {
      // API'ye logout isteği gönder
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/api/v1/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Logout işlemini tamamla
      await logout();
      
      // Ana sayfaya yönlendir
      window.location.href = '/';
      
      toast.success('Başarıyla çıkış yapıldı');
    } catch (error) {
      
      // API hatası olsa bile local logout yap
      await logout();
      window.location.href = '/';
      
      toast.error('Çıkış yapılırken bir hata oluştu');
    }
  };

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategoryTree(null);
      setSelectedSubcategoryNode(null);
      return;
    }

    const tree = buildCategoryTree({
      categorySlug: selectedCategory.slug,
      menuSections,
      navigationLinks,
      categories,
    });
    setSelectedCategoryTree(tree);
    setSelectedSubcategoryNode(null);
  }, [selectedCategory, menuSections, navigationLinks, categories]);

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

  // Custom event listener for opening mobile menu from SearchMobileHeader
  useEffect(() => {
    const handleOpenMobileMenu = () => {
      setMobileMenuOpen(true);
    };

    window.addEventListener('openMobileMenu', handleOpenMobileMenu);
    return () => {
      window.removeEventListener('openMobileMenu', handleOpenMobileMenu);
    };
  }, []);

  const [webviewUrl, setWebviewUrl] = useState<string | null>(null);

  const mobileHeaderWrapperClass =
    `fixed top-0 left-0 right-0 ${isCookiePopupOpen ? 'z-40' : 'z-[1300]'} bg-white md:static md:top-auto md:left-auto md:right-auto md:z-auto`;

  // Header'ın gerçek yüksekliğini otomatik ölç ve CSS variable'a yaz
  useEffect(() => {
    const measureHeaderHeight = () => {
      if (headerRef.current && typeof window !== 'undefined') {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // İlk ölçüm
    measureHeaderHeight();

    // Resize ve orientation change'de tekrar ölç
    window.addEventListener('resize', measureHeaderHeight);
    window.addEventListener('orientationchange', measureHeaderHeight);

    // MutationObserver ile header içeriği değiştiğinde ölç
    let observer: MutationObserver | null = null;
    if (headerRef.current) {
      observer = new MutationObserver(measureHeaderHeight);
      observer.observe(headerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }

    return () => {
      window.removeEventListener('resize', measureHeaderHeight);
      window.removeEventListener('orientationchange', measureHeaderHeight);
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <>
      <div ref={(node) => {
        headerRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }} className={mobileHeaderWrapperClass}>
        {/* Top Header */}
        <TopHeader />

        {/* Middle Header */}
        <div
          className={`relative ${isCookiePopupOpen ? 'z-40' : 'z-[1200]'} bg-white md:bg-transparent ${
            showBackButton ? 'shadow-sm md:shadow-none' : ''
          }`}
        >
          <MiddleHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            searchResults={searchResults}
            isSearching={isSearching}
            searchContainerRef={searchContainerRef}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            onOpenAccountPanel={() => { setMobileMenuOpen(true); setMobileMenuView('account'); }}
            showBackButton={showBackButton}
            onBackClick={onBackClick}
            hideSearchAndProfile={hideSearchAndProfile}
          />
        </div>
      </div>

      {/* Bottom Header - Sadece desktop'ta render et */}
      {isDesktop && (
      <div className="hidden md:block">
        <BottomHeader />
      </div>
      )}

      {/* Mobile Menu via Portal to escape any stacking contexts */}
      {mobileMenuOpen && (
        <Portal id="mobile-menu-portal-root">
          <div className={`fixed inset-0 z-[2147483000] md:hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}></div>
            <div className="absolute left-0 top-0 h-[100dvh] w-80 bg-white shadow-xl overflow-y-auto overscroll-contain transform transition-transform duration-300 ease-in-out z-[2147483001]">
              <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <svg width="120" height="42" viewBox="0 0 184 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
                  <path d="M108.645 47.4155V50.4336C107.367 50.3665 106.26 50.618 105.323 51.1881C104.386 51.7582 103.909 52.7139 103.909 54.0385V60.5274H100.57V47.6503H103.909V49.8132C104.744 48.2204 106.328 47.4155 108.645 47.4155Z" fill="black"/>
                  <path d="M147.473 47.6838V54.5583C147.473 55.799 147.166 56.738 146.535 57.3416C145.922 57.9452 145.104 58.247 144.099 58.247C143.094 58.247 142.447 57.9955 141.918 57.4757C141.39 56.956 141.118 56.235 141.118 55.2625V47.667H138.255V55.5308C138.255 57.1739 138.733 58.465 139.67 59.404C140.607 60.3429 141.833 60.8124 143.367 60.8124C144.9 60.8124 146.621 60.1585 147.49 58.8339V60.4771H150.352V47.667H147.49L147.473 47.6838Z" fill="black"/>
                  <path d="M125.699 47.6838V54.5583C125.699 55.799 125.393 56.738 124.762 57.3416C124.149 57.9452 123.331 58.247 122.326 58.247C121.321 58.247 120.673 57.9955 120.145 57.4757C119.617 56.956 119.344 56.235 119.344 55.2625V47.667H116.482V55.5308C116.482 57.1739 116.959 58.465 117.896 59.404C118.833 60.3429 120.06 60.8124 121.593 60.8124C123.127 60.8124 124.847 60.1585 125.716 58.8339V60.4771H128.578V47.667H125.716L125.699 47.6838Z" fill="black"/>
                  <path d="M179.553 48.6732C178.582 47.7175 177.287 47.248 175.686 47.248C174.084 47.248 172.313 47.9355 171.358 49.2936C170.49 47.9355 169.161 47.248 167.355 47.248C165.549 47.248 164.22 47.8852 163.317 49.1427V47.5834H160.267V60.5108H163.317V53.2674C163.317 52.144 163.607 51.3057 164.186 50.7188C164.765 50.1488 165.532 49.8469 166.452 49.8469C167.372 49.8469 167.951 50.0985 168.411 50.5847C168.871 51.0709 169.11 51.7752 169.11 52.6638V60.4941H172.159V53.2507C172.159 52.1105 172.432 51.2554 172.994 50.6853C173.556 50.1152 174.306 49.8302 175.243 49.8302C176.18 49.8302 176.759 50.0817 177.253 50.5679C177.747 51.0542 177.986 51.7584 177.986 52.6471V60.4773H181.035V52.4626C181.035 50.853 180.541 49.5787 179.57 48.6397L179.553 48.6732Z" fill="black"/>
                  <path d="M23.2385 49.8469V47.684H20.5978V60.5108H23.2385V53.7033C23.2385 52.2949 23.6985 51.2889 24.6356 50.6517C25.5726 50.0146 26.68 49.7295 27.9748 49.7798V47.4492C25.6919 47.4492 24.1244 48.2373 23.2556 49.8301L23.2385 49.8469Z" fill="black"/>
                  <path d="M67.5518 48.7737C66.5636 47.8347 65.2348 47.3652 63.5992 47.3652C61.9636 47.3652 60.0385 48.0862 59.0503 49.5282V47.7006H56.614V60.4268H59.0503V53.6864C59.0503 52.2612 59.4251 51.2049 60.1748 50.5174C60.9244 49.83 61.9125 49.4947 63.1222 49.4947C64.3318 49.4947 65.0644 49.7797 65.6777 50.3498C66.2911 50.9199 66.5977 51.7247 66.5977 52.7642V60.4603H69.034V52.6469C69.034 51.0372 68.5399 49.7629 67.5518 48.8072V48.7737Z" fill="black"/>
                  <path d="M88.5073 42.5197V49.8637C87.434 48.1702 85.8666 47.3151 83.8051 47.3151C81.7436 47.3151 80.5851 47.969 79.3584 49.2768C78.1318 50.5847 77.5184 52.1775 77.5184 54.0722C77.5184 55.9669 78.1318 57.5598 79.3584 58.8676C80.5851 60.1754 82.0673 60.8294 83.8051 60.8294C85.5429 60.8294 87.434 59.9742 88.5073 58.2808V60.494H90.671V42.5029H88.5073V42.5197ZM87.2466 57.3586C86.3947 58.2472 85.3555 58.6832 84.0947 58.6832C82.834 58.6832 81.8118 58.2472 80.9599 57.3586C80.1081 56.4867 79.6821 55.3801 79.6821 54.089C79.6821 52.7979 80.1081 51.6913 80.9599 50.8194C81.8118 49.9308 82.851 49.4948 84.0947 49.4948C85.3384 49.4948 86.4118 49.9308 87.2466 50.8194C88.0984 51.7081 88.5244 52.7979 88.5244 54.089C88.5244 55.3801 88.0984 56.4867 87.2466 57.3586Z" fill="black"/>
                  <path d="M45.7274 56.4867C45.5911 56.822 45.4208 57.1406 45.1993 57.4089C44.4496 58.3311 43.3422 58.8005 41.9111 58.8005C40.48 58.8005 39.7133 58.482 38.9126 57.8616C38.4356 57.4927 38.0437 57.0232 37.7711 56.4532C37.4815 55.8663 37.3622 55.1956 37.3622 54.5417V54.1896H47.9593C47.9593 52.3284 47.38 50.7523 46.2045 49.4277C45.0289 48.1031 43.5296 47.4492 41.6896 47.4492C39.8496 47.4492 38.163 48.0864 36.9363 49.3607C35.7096 50.635 35.0963 52.2446 35.0963 54.1561C35.0963 56.0675 35.7267 57.7107 36.9704 58.9682C38.2141 60.2425 39.8326 60.8797 41.8259 60.8797C43.8193 60.8797 46.1363 59.9239 47.363 57.9957C47.9082 57.258 47.9422 56.4028 47.9422 56.4028H45.7274C45.7274 56.4196 45.7104 56.4531 45.6934 56.4699L45.7274 56.4867ZM38.7933 50.5511C39.56 49.8804 40.5311 49.5451 41.7067 49.5451C42.8822 49.5451 43.5978 49.8637 44.3474 50.4841C44.9608 50.9871 45.3867 51.6913 45.6252 52.58H37.5156C37.7541 51.7584 38.18 51.0709 38.7933 50.5344V50.5511Z" fill="black"/>
                  <path d="M8.38219 49.4779V56.671C8.38219 57.3249 8.51848 57.7943 8.80811 58.0626C9.0807 58.3309 9.52367 58.4818 10.1029 58.4818C10.6822 58.4818 11.3977 58.4818 12.2496 58.4315V60.5106C10.0518 60.7789 8.4333 60.6112 7.39404 60.0244C6.37182 59.4375 5.8607 58.3141 5.8607 56.6542V49.4611H2.98145V47.2311H5.8607V43.5088H8.38219V47.2311H12.2496V49.4611H8.38219V49.4779Z" fill="black"/>
                  <path d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z" fill="#EC6D04"/>
                  <path d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z" fill="#F9AF02"/>
                  <path d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z" fill="black"/>
                </svg>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* User Section */}
            <div className="px-4 py-4 border-b border-gray-200">
              {isLoggedIn && user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{user.name || localStorage.getItem('userEmail')}</div>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-orange-500 font-medium hover:underline"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                  
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    href="/giris" 
                    className="w-full py-3 rounded-lg bg-orange-500 text-white text-center font-semibold text-sm hover:bg-orange-600 block" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    href="/kayit-ol" 
                    className="w-full py-3 rounded-lg border border-gray-300 text-gray-900 text-center font-semibold text-sm hover:bg-gray-50 block" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Üye Ol
                  </Link>
                </div>
              )}
            </div>
            {/* Body Section */}
            <div className="flex-1 overflow-y-auto">
              {mobileMenuView === 'main' && (
                <div className="px-4 py-3">
                  <div className="mb-3 text-sm font-semibold text-gray-900">Kategoriler</div>
                  
                  {/* Kategoriler */}
                  <div className="space-y-1">
                    {sortedMobileCategories.slice(0, 12).map((item) => {
                      // buildCategoryTree kullanarak kategori ağacını oluştur ve children kontrolü yap
                      const categoryTree = buildCategoryTree({
                        categorySlug: item.slug,
                        menuSections,
                        navigationLinks: megaMenuItems,
                      });
                      
                      const hasChildren = !!(categoryTree?.children && categoryTree.children.length > 0);
                      
                      // Desktop'taki gibi dinamik href kullan
                      let href = item.url || '';
                      
                      if (!hasChildren) {
                        // Alt kategori yoksa direkt navigasyon - href yoksa slug'dan oluştur
                        if (!href) {
                          const categorySlug = item.slug || '';
                          if (categorySlug) {
                            // Erkek/kadın kategorileri için cinsiyet parametresi ekle
                            if (categorySlug.toLowerCase() === 'erkek') {
                              href = `/${categorySlug}?g=2`;
                            } else if (categorySlug.toLowerCase() === 'kadin') {
                              href = `/${categorySlug}?g=1`;
                            } else {
                              href = `/s/${categorySlug}`;
                            }
                          } else {
                            href = normalizeHref(item.url);
                          }
                        } else {
                          href = normalizeHref(href);
                        }
                        
                        return (
                          <Link
                            key={`mobile-category-${item.slug}`}
                            href={href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              resetMobileMenuState();
                            }}
                            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group w-full text-left"
                          >
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                              <span data-clarity-region="ignore">
                                {categoryIcons[item.slug] || <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />}
                              </span>
                            </div>
                            <span className="flex-1">{item.name}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-clarity-region="ignore">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={`mobile-category-${item.slug}`}
                          onClick={() => {
                            setSelectedCategory(item);
                            setSelectedSubcategoryNode(null);
                            setMobileMenuView('categories');
                          }}
                          className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group w-full text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <span data-clarity-region="ignore">
                              {categoryIcons[item.slug] || <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />}
                            </span>
                          </div>
                          <span className="flex-1">{item.name}</span>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-clarity-region="ignore">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {mobileMenuView === 'account' && (
                <div className="h-full">
                  {/* Mobile Account Panel */}
                  {(() => {
                    const MobileAccountPanel = require('../account/MobileAccountPanel').default;
                    return (
                      <MobileAccountPanel
                        onBack={() => setMobileMenuView('main')}
                        onClose={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                      />
                    );
                  })()}
                </div>
              )}

              {mobileMenuView === 'categories' && selectedCategory && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setMobileMenuView('main')}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="text-sm font-semibold text-gray-900">{selectedCategory.name}</h2>
                  </div>
                  <div className="space-y-1">
                    {(() => {
                      if (!selectedCategoryTree) {
                        return null;
                      }

                      const children = selectedCategoryTree.children || [];

                      if (children.length === 0) {
                        // Desktop'taki gibi dinamik href kullan
                        let href = selectedCategoryTree.href || selectedCategory?.url || '';
                        
                        // Eğer href yoksa, slug'dan oluştur ve kategoriye göre cinsiyet parametresi ekle
                        if (!href) {
                          const categorySlug = selectedCategory?.slug || selectedCategoryTree.slug || '';
                          if (categorySlug) {
                            // Ana kategoriye göre cinsiyet parametresi ekle
                            const parentCategorySlug = selectedCategory?.slug?.toLowerCase() || '';
                            if (parentCategorySlug === 'erkek') {
                              // Erkek kategorisi için g=2 parametresi ekle
                              href = `/${categorySlug}?g=2`;
                            } else if (parentCategorySlug === 'kadin') {
                              // Kadın kategorisi için g=1 parametresi ekle
                              href = `/${categorySlug}?g=1`;
                            } else {
                              // Diğer kategoriler için /s/slug formatında
                              href = `/s/${categorySlug}`;
                            }
                          } else {
                            href = normalizeHref(selectedCategory?.slug);
                          }
                        } else {
                          // href varsa normalize et
                          href = normalizeHref(href);
                        }
                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                              <span data-clarity-region="ignore">
                                {selectedCategory
                                  ? categoryIcons[selectedCategory.slug] || (
                                      <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                                    )
                                  : <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />}
                              </span>
                            </div>
                            <span className="flex-1">
                              Tüm {selectedCategoryTree.name || selectedCategory?.name} Ürünleri
                            </span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-clarity-region="ignore">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        );

                        if (isExternalHref(href)) {
                          return (
                            <a
                              key="mobile-category-all"
                              href={href}
                              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                              onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key="mobile-category-all"
                            href={href}
                            prefetch={false}
                            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                            onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                          >
                            {content}
                          </Link>
                        );
                      }

                      return children.map((child) => {
                        // Desktop'taki gibi dinamik href kullan - önce child.href varsa onu kullan
                        let href = child.href || '';
                        
                        // Eğer href yoksa, slug'dan oluştur ve kategoriye göre cinsiyet parametresi ekle
                        if (!href) {
                          const childSlug = child.slug || '';
                          if (childSlug) {
                            // Ana kategoriye göre cinsiyet parametresi ekle
                            const parentCategorySlug = selectedCategory?.slug?.toLowerCase() || '';
                            if (parentCategorySlug === 'erkek') {
                              // Erkek kategorisi için g=2 parametresi ekle
                              href = `/${childSlug}?g=2`;
                            } else if (parentCategorySlug === 'kadin') {
                              // Kadın kategorisi için g=1 parametresi ekle
                              href = `/${childSlug}?g=1`;
                            } else {
                              // Diğer kategoriler için /s/slug formatında
                              href = `/s/${childSlug}`;
                            }
                          } else {
                            href = normalizeHref(child.slug);
                          }
                        } else {
                          // href varsa normalize et
                          href = normalizeHref(href);
                        }
                        
                        const hasChildren = !!child.children && child.children.length > 0;

                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                              <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                            </div>
                            <span className="flex-1">{child.name}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        );

                        if (hasChildren) {
                          return (
                            <button
                              key={`mobile-subcategory-${child.id}`}
                              onClick={() => {
                                setSelectedSubcategoryNode(child);
                                setMobileMenuView('subcategories');
                              }}
                              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group w-full text-left"
                            >
                              {content}
                            </button>
                          );
                        }

                        if (isExternalHref(href)) {
                          return (
                            <a
                              key={`mobile-subcategory-${child.id}`}
                              href={href}
                              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                              onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={`mobile-subcategory-${child.id}`}
                            href={href}
                            prefetch={false}
                            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                            onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                          >
                            {content}
                          </Link>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {mobileMenuView === 'subcategories' && selectedSubcategoryNode && (
                <div className="px-4 py-3">
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => {
                        setSelectedSubcategoryNode(null);
                        setMobileMenuView('categories');
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <h2 className="text-sm font-semibold text-gray-900">{selectedSubcategoryNode.name}</h2>
                  </div>
                  <div className="space-y-1">
                    {(() => {
                      const children = selectedSubcategoryNode.children || [];

                      if (children.length === 0) {
                        // En alt kategoriye girince /s/slug formatında category sayfası açılsın
                        // Desktop'taki gibi dinamik href kullan
                        let href = selectedSubcategoryNode.href || '';
                        
                        // Eğer href yoksa, slug'dan oluştur ve kategoriye göre cinsiyet parametresi ekle
                        if (!href) {
                          const deepCategorySlug = selectedSubcategoryNode.slug || '';
                          if (deepCategorySlug) {
                            // Ana kategoriye göre cinsiyet parametresi ekle
                            const parentCategorySlug = selectedCategory?.slug?.toLowerCase() || '';
                            if (parentCategorySlug === 'erkek') {
                              // Erkek kategorisi için g=2 parametresi ekle
                              href = `/${deepCategorySlug}?g=2`;
                            } else if (parentCategorySlug === 'kadin') {
                              // Kadın kategorisi için g=1 parametresi ekle
                              href = `/${deepCategorySlug}?g=1`;
                            } else {
                              // Diğer kategoriler için /s/slug formatında
                              href = `/s/${deepCategorySlug}`;
                            }
                          } else {
                            href = normalizeHref(selectedSubcategoryNode.slug);
                          }
                        } else {
                          // href varsa normalize et
                          href = normalizeHref(href);
                        }
                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                              <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                            </div>
                            <span className="flex-1">Tüm {selectedSubcategoryNode.name} Ürünleri</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        );

                        if (isExternalHref(href)) {
                          return (
                            <a
                              key={`mobile-deepcategory-${selectedSubcategoryNode.id}`}
                              href={href}
                              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                              onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={`mobile-deepcategory-${selectedSubcategoryNode.id}`}
                            href={href}
                            prefetch={false}
                            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                            onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                          >
                            {content}
                          </Link>
                        );
                      }

                      return children.map((child) => {
                        // Desktop'taki gibi dinamik href kullan - önce child.href varsa onu kullan
                        let href = child.href || '';
                        
                        // Eğer href yoksa, slug'dan oluştur ve kategoriye göre cinsiyet parametresi ekle
                        if (!href) {
                          const deepChildSlug = child.slug || '';
                          if (deepChildSlug) {
                            // Ana kategoriye göre cinsiyet parametresi ekle
                            const parentCategorySlug = selectedCategory?.slug?.toLowerCase() || '';
                            if (parentCategorySlug === 'erkek') {
                              // Erkek kategorisi için g=2 parametresi ekle
                              href = `/${deepChildSlug}?g=2`;
                            } else if (parentCategorySlug === 'kadin') {
                              // Kadın kategorisi için g=1 parametresi ekle
                              href = `/${deepChildSlug}?g=1`;
                            } else {
                              // Diğer kategoriler için /s/slug formatında
                              href = `/s/${deepChildSlug}`;
                            }
                          } else {
                            href = normalizeHref(child.slug);
                          }
                        } else {
                          // href varsa normalize et
                          href = normalizeHref(href);
                        }
                        
                        const hasChildren = !!child.children && child.children.length > 0;

                        const content = (
                          <>
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                              <Bars3Icon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                            </div>
                            <span className="flex-1">{child.name}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        );

                        if (hasChildren) {
                          return (
                            <button
                              key={`mobile-deepcategory-${child.id}`}
                              onClick={() => setSelectedSubcategoryNode(child)}
                              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group w-full text-left"
                            >
                              {content}
                            </button>
                          );
                        }

                        if (isExternalHref(href)) {
                          return (
                            <a
                              key={`mobile-deepcategory-${child.id}`}
                              href={href}
                              className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                              onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                              rel="noopener noreferrer"
                            >
                              {content}
                            </a>
                          );
                        }

                        return (
                          <Link
                            key={`mobile-deepcategory-${child.id}`}
                            href={href}
                            prefetch={false}
                            className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                            onClick={() => { setMobileMenuOpen(false); resetMobileMenuState(); }}
                          >
                            {content}
                          </Link>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="mb-3 text-sm font-semibold text-gray-900">Menü</div>
                <div className="space-y-1">
                  <Link
                    href={isLoggedIn ? "/hesabim" : "/giris"}
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      resetMobileMenuState();
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <UserIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="flex-1">Hesabım</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/sepet"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <ShoppingBagIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="flex-1">Sepetim</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/hesabim/favoriler"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <HeartIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="flex-1">Favorilerim</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                    <Link
                    href="/hesabim/koleksiyonlarim"
                      className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <BookmarkIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                    </div>
                    <span className="flex-1">Koleksiyonlarım</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                  </Link>
                  <Link
                    href="/iletisim"
                    className="flex items-center gap-3 py-3 px-3 rounded-lg hover:bg-orange-50 text-gray-900 text-sm font-medium transition-colors group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                      <PhoneIcon className="w-5 h-5 text-gray-600 group-hover:text-orange-600" />
                      </div>
                    <span className="flex-1">İletişim</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                </div>
              </div>
            </div>
                        {/* Bottom Actions */}
            <div className="p-4 bg-white">
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="w-full py-3 px-4 rounded-lg bg-orange-500 text-white text-center text-sm font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setWebviewUrl('https://seller.trendruum.com/onboarding/satici-formu/pazaryeri');
                  }}
                >
                  <BanknotesIcon className="w-5 h-5 text-white" />
                  Satıcı Ol
                </button>

              <Link 
                href="/s/iletisim"
                prefetch={false} 
                  className="w-full py-3 px-4 rounded-lg border border-orange-200 bg-orange-50 text-orange-600 text-center text-sm font-semibold hover:bg-orange-100 transition-colors flex items-center justify-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-clarity-region="ignore">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                İletişim
              </Link>
              </div>
            </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {webviewUrl && (
        <Portal id="seller-webview-root">
          <div className="fixed inset-0 z-[2147484000] bg-black/70 flex flex-col">
            <button
              className="absolute top-4 right-4 bg-white rounded-full p-2 shadow text-gray-600 hover:text-gray-800 z-[2147484001]"
              onClick={() => setWebviewUrl(null)}
              aria-label="Kapat"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <iframe
              src={webviewUrl}
              title="Satıcı Ol"
              className="w-full h-full border-0 bg-white"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
            />
          </div>
        </Portal>
      )}

      {showNotificationModal && (
        <NotificationPreferencesModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          onPreferencesSet={onPreferencesSet}
        />
      )}
    </>
  );
});

Header.displayName = 'Header';

export default React.memo(Header);
