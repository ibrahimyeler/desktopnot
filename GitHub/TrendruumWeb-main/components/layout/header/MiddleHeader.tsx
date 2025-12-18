"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import type { MutableRefObject } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/app/context/AuthContext";
import { useBasket } from "@/app/context/BasketContext";
import { useFavorites } from "@/app/context/FavoriteContext";
import SmartSearchDropdown from "../SmartSearchDropdown";
import { smartSearchService } from "@/app/services/smartSearchService";
import { API_V1_URL } from "@/lib/config";
import axios from "axios";
import toast from "react-hot-toast";

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

interface MiddleHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  onMobileMenuToggle?: () => void;
  onOpenAccountPanel?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
  hideSearchAndProfile?: boolean;
}

const MiddleHeader = ({
  searchQuery,
  setSearchQuery,
  isSearchFocused,
  setIsSearchFocused,
  searchResults,
  isSearching,
  searchContainerRef,
  onMobileMenuToggle,
  onOpenAccountPanel,
  showBackButton = false,
  onBackClick,
  hideSearchAndProfile = false,
}: MiddleHeaderProps) => {
  const { isLoggedIn, user } = useAuth();
  const { basket, totalQuantity } = useBasket();
  const { favoritesCount } = useFavorites();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountAnchorRef = useRef<HTMLDivElement | null>(null);
  const desktopSearchContainerRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement | null>(null);
  const [accountDropdownPosition, setAccountDropdownPosition] = useState<{
    top: number;
    right: number;
  } | null>(null);
  const pathname = usePathname();
  const isHomepage = pathname === "/";
  const isAccountPage = pathname?.startsWith("/hesabim");
  const isStorePage = pathname?.startsWith("/magaza");
  const isBrandPage = pathname?.startsWith("/markalar");
  const isSearchPage = pathname?.startsWith("/q");
  // Category sayfası kontrolü - özel sayfalar dışındaki sayfalar category sayfası olabilir
  const isCategoryPage = pathname && 
    !pathname.startsWith("/hesabim") && 
    !pathname.startsWith("/magaza") && 
    !pathname.startsWith("/markalar") && 
    !pathname.startsWith("/q") && 
    !pathname.startsWith("/sepet") && 
    !pathname.startsWith("/giris") && 
    !pathname.startsWith("/kayit-ol") && 
    !pathname.startsWith("/urunler") && 
    !pathname.startsWith("/flash-urunler") && 
    !pathname.startsWith("/s") && 
    pathname !== "/" && 
    pathname.split("/").length === 2; // Sadece bir segment (örn: /kadin)
  const isFavoritesPage = pathname === "/hesabim/favoriler";
  const isCollectionsPage = pathname === "/hesabim/koleksiyonlarim";
  const isMessagesPage = pathname === "/hesabim/mesajlarim";
  const isOrdersPage = pathname === "/hesabim/siparislerim";
  const isReviewsPage = pathname === "/hesabim/degerlendirmelerim";
  const isReorderPage = pathname === "/hesabim/tekrar-al";
  const isVisitedPage = pathname === "/hesabim/onceden-gezdiklerim";
  const isFollowedStoresPage = pathname === "/hesabim/takip-ettigim-magazalar";
  const isUserInfoPage = pathname === "/hesabim/kullanici-bilgilerim";
  const isAddressPage = pathname === "/hesabim/adres-bilgilerim";
  const isSavedCardsPage = pathname === "/hesabim/kayitli-kartlarim";
  const isNotificationPreferencesPage = pathname === "/hesabim/duyuru-tercihlerim";
  const isOrderDetailPage = pathname?.startsWith("/hesabim/siparislerim/") && pathname !== "/hesabim/siparislerim";
  const isHesabimPage = pathname === "/hesabim";
  const isProductPage = pathname?.startsWith("/urunler/");
  const isAccountPageWithSearch = isHesabimPage || isFavoritesPage || isCollectionsPage || isMessagesPage || isOrdersPage || isReviewsPage || isReorderPage || isVisitedPage || isFollowedStoresPage || isUserInfoPage || isAddressPage || isSavedCardsPage || isNotificationPreferencesPage || isOrderDetailPage;
  const isAccountPageExceptFavorites = isAccountPage && !isHesabimPage && !isFavoritesPage && !isCollectionsPage && !isMessagesPage && !isOrdersPage && !isReviewsPage && !isReorderPage && !isVisitedPage && !isFollowedStoresPage && !isUserInfoPage && !isAddressPage && !isSavedCardsPage && !isNotificationPreferencesPage && !isOrderDetailPage;
  // Mağaza sayfası ve diğer sayfalarda showBackButton true ise geri butonu göster
  // Mağaza sayfası ve hesabım sayfası için özel kontrol ekle
  const isMobileBackLayout = (showBackButton === true && !isHomepage) || isStorePage || isAccountPage;

  const router = useRouter();
  const itemCount = totalQuantity;

  const handleBackButtonClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ana sayfada zaten isek, sadece scroll yap
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Başka sayfadan ana sayfaya gidiyorsak, router.push kullan ve scroll pozisyonunu sıfırla
      e.preventDefault();
      // Scroll pozisyonunu sıfırlamak için sessionStorage'ı temizle
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('homeScrollPosition');
        sessionStorage.removeItem('homeScrollData');
        // Ana sayfaya gidildiğini belirten bir flag ekle
        sessionStorage.setItem('logoClickScrollToTop', 'true');
      }
      router.push("/");
      // Sayfa yüklendikten sonra scroll yap (birkaç kez deneyerek)
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 0);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 100);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
      }, 300);
    }
  };

  const updateAccountDropdownPosition = useCallback(() => {
    if (!accountAnchorRef.current) {
      return;
    }

    const rect = accountAnchorRef.current.getBoundingClientRect();
    const verticalOffset = 8;

    setAccountDropdownPosition({
      top: rect.bottom + verticalOffset,
      right: Math.max(0, window.innerWidth - rect.right),
    });
  }, []);

  useLayoutEffect(() => {
    if (!showAccountDropdown) {
      return;
    }
    updateAccountDropdownPosition();
  }, [showAccountDropdown, updateAccountDropdownPosition]);

  useEffect(() => {
    if (!showAccountDropdown) {
      return;
    }

    const handleReposition = () => updateAccountDropdownPosition();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [showAccountDropdown, updateAccountDropdownPosition]);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".account-dropdown")) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAccountDropdown]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchClick = () => {
    // Eğer dropdown zaten açıksa, kapatma
    if (isSearchFocused) {
      return;
    }
    // Dropdown kapalıysa, aç
    setIsSearchFocused(true);
  };

  useEffect(() => {
    if (!searchContainerRef) {
      return;
    }

    const updateActiveRef = () => {
      const targetRef = (() => {
        if (hideSearchAndProfile) {
          return null;
        }
        if (typeof window !== "undefined" && window.innerWidth >= 768) {
          return desktopSearchContainerRef.current;
        }
        return mobileSearchContainerRef.current;
      })();

      (searchContainerRef as MutableRefObject<HTMLDivElement | null>).current = targetRef;
    };

    updateActiveRef();

    window.addEventListener("resize", updateActiveRef);

    return () => {
      window.removeEventListener("resize", updateActiveRef);
      (searchContainerRef as MutableRefObject<HTMLDivElement | null>).current = null;
    };
  }, [searchContainerRef, hideSearchAndProfile]);

  // Homepage'de arama dropdown'ı açık kalmasın
  useEffect(() => {
    if (isHomepage && isSearchFocused) {
      setIsSearchFocused(false);
    }
  }, [isHomepage]);

  // Logout fonksiyonu
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Oturum bulunamadı");
        return;
      }

      const response = await axios.post(
        `${API_V1_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.meta?.status === "success") {
        // Local storage'ı temizle
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Context'leri temizle
        // AuthContext'te logout fonksiyonu varsa onu çağır

        toast.success("Başarıyla çıkış yapıldı");

        // Ana sayfaya yönlendir
        router.push("/");

        // Sayfayı yenile
        window.location.reload();
      } else {
        toast.error("Çıkış yapılırken bir hata oluştu");
      }
    } catch (error) {
      toast.error("Çıkış yapılırken bir hata oluştu");

      // Hata olsa bile local storage'ı temizle
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/");
      window.location.reload();
    }
  };

  // Basit arama submit fonksiyonu
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim();

      // Dropdown'ı hemen kapat - SmartSearchDropdown'ın gereksiz isteklerini önle
      setIsSearchFocused(false);

      // Query'yi olduğu gibi gönder (cinsiyet kelimesi çıkarılmadan)
      const searchUrl = `/q?q=${encodeURIComponent(searchTerm)}`;

      // q sayfasına yönlendir
      router.push(searchUrl);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <>
      <div className="bg-white relative z-[200] overflow-x-hidden">
        <div className="w-full mx-auto max-w-full sm:max-w-full md:max-w-full lg:max-w-full pl-2 pr-2 sm:pl-[39px] sm:pr-[35px] md:pl-[39px] md:pr-[44px] lg:pl-[47px] lg:pr-[52px] xl:pl-[55px] xl:pr-[60px] 2xl:pl-[63px] 2xl:pr-[68px]">
          {/* Üst Satır - Hamburger Menu, Logo, Arama ve İconlar */}
          <div className="flex items-center justify-between pt-0 pb-1 md:py-6 md:h-24 overflow-x-hidden">
            {/* Sol Taraf - Hamburger Menu ve Logo (Mobilde yan yana) */}
            <div className="flex items-center space-x-3 flex-shrink-0 md:flex md:items-center md:space-x-3">
              {/* Mobile Back Button veya Menü Butonu */}
              <div className="flex-shrink-0 md:hidden -ml-2">
              {isMobileBackLayout ? (
                <button
                  onClick={handleBackButtonClick}
                    className="p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  aria-label="Geri"
                >
                    <ArrowLeftIcon className="h-8 w-8" />
                </button>
              ) : (
              !isMobileBackLayout && isHomepage && onMobileMenuToggle && (
                <button
                  onClick={onMobileMenuToggle}
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                >
                  <svg
                      className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              ))}
              </div>

              {/* Logo - Hamburger menünün hemen sağında (Mobilde) */}
              <div className="flex-shrink-0">
                <Link href="/" prefetch={false} className="flex items-center" onClick={handleLogoClick}>
                  <svg
                    width="120"
                    height="42"
                    viewBox="0 0 184 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-auto"
                  >
                    <path
                      d="M108.645 47.4155V50.4336C107.367 50.3665 106.26 50.618 105.323 51.1881C104.386 51.7582 103.909 52.7139 103.909 54.0385V60.5274H100.57V47.6503H103.909V49.8132C104.744 48.2204 106.328 47.4155 108.645 47.4155Z"
                      fill="black"
                    />
                    <path
                      d="M147.473 47.6838V54.5583C147.473 55.799 147.166 56.738 146.535 57.3416C145.922 57.9452 145.104 58.247 144.099 58.247C143.094 58.247 142.447 57.9955 141.918 57.4757C141.39 56.956 141.118 56.235 141.118 55.2625V47.667H138.255V55.5308C138.255 57.1739 138.733 58.465 139.67 59.404C140.607 60.3429 141.833 60.8124 143.367 60.8124C144.9 60.8124 146.621 60.1585 147.49 58.8339V60.4771H150.352V47.667H147.49L147.473 47.6838Z"
                      fill="black"
                    />
                    <path
                      d="M125.699 47.6838V54.5583C125.699 55.799 125.393 56.738 124.762 57.3416C124.149 57.9452 123.331 58.247 122.326 58.247C121.321 58.247 120.673 57.9955 120.145 57.4757C119.617 56.956 119.344 56.235 119.344 55.2625V47.667H116.482V55.5308C116.482 57.1739 116.959 58.465 117.896 59.404C118.833 60.3429 120.06 60.8124 121.593 60.8124C123.127 60.8124 124.847 60.1585 125.716 58.8339V60.4771H128.578V47.667H125.716L125.699 47.6838Z"
                      fill="black"
                    />
                    <path
                      d="M179.553 48.6732C178.582 47.7175 177.287 47.248 175.686 47.248C174.084 47.248 172.313 47.9355 171.358 49.2936C170.49 47.9355 169.161 47.248 167.355 47.248C165.549 47.248 164.22 47.8852 163.317 49.1427V47.5834H160.267V60.5108H163.317V53.2674C163.317 52.144 163.607 51.3057 164.186 50.7188C164.765 50.1488 165.532 49.8469 166.452 49.8469C167.372 49.8469 167.951 50.0985 168.411 50.5847C168.871 51.0709 169.11 51.7752 169.11 52.6638V60.4941H172.159V53.2507C172.159 52.1105 172.432 51.2554 172.994 50.6853C173.556 50.1152 174.306 49.8302 175.243 49.8302C176.18 49.8302 176.759 50.0817 177.253 50.5679C177.747 51.0542 177.986 51.7584 177.986 52.6471V60.4773H181.035V52.4626C181.035 50.853 180.541 49.5787 179.57 48.6397L179.553 48.6732Z"
                      fill="black"
                    />
                    <path
                      d="M23.2385 49.8469V47.684H20.5978V60.5108H23.2385V53.7033C23.2385 52.2949 23.6985 51.2889 24.6356 50.6517C25.5726 50.0146 26.68 49.7295 27.9748 49.7798V47.4492C25.6919 47.4492 24.1244 48.2373 23.2556 49.8301L23.2385 49.8469Z"
                      fill="black"
                    />
                    <path
                      d="M67.5518 48.7737C66.5636 47.8347 65.2348 47.3652 63.5992 47.3652C61.9636 47.3652 60.0385 48.0862 59.0503 49.5282V47.7006H56.614V60.4268H59.0503V53.6864C59.0503 52.2612 59.4251 51.2049 60.1748 50.5174C60.9244 49.83 61.9125 49.4947 63.1222 49.4947C64.3318 49.4947 65.0644 49.7797 65.6777 50.3498C66.2911 50.9199 66.5977 51.7247 66.5977 52.7642V60.4603H69.034V52.6469C69.034 51.0372 68.5399 49.7629 67.5518 48.8072V48.7737Z"
                      fill="black"
                    />
                    <path
                      d="M88.5073 42.5197V49.8637C87.434 48.1702 85.8666 47.3151 83.8051 47.3151C81.7436 47.3151 80.5851 47.969 79.3584 49.2768C78.1318 50.5847 77.5184 52.1775 77.5184 54.0722C77.5184 55.9669 78.1318 57.5598 79.3584 58.8676C80.5851 60.1754 82.0673 60.8294 83.8051 60.8294C85.5429 60.8294 87.434 59.9742 88.5073 58.2808V60.494H90.671V42.5029H88.5073V42.5197ZM87.2466 57.3586C86.3947 58.2472 85.3555 58.6832 84.0947 58.6832C82.834 58.6832 81.8118 58.2472 80.9599 57.3586C80.1081 56.4867 79.6821 55.3801 79.6821 54.089C79.6821 52.7979 80.1081 51.6913 80.9599 50.8194C81.8118 49.9308 82.851 49.4948 84.0947 49.4948C85.3384 49.4948 86.4118 49.9308 87.2466 50.8194C88.0984 51.7081 88.5244 52.7979 88.5244 54.089C88.5244 55.3801 88.0984 56.4867 87.2466 57.3586Z"
                      fill="black"
                    />
                    <path
                      d="M45.7274 56.4867C45.5911 56.822 45.4208 57.1406 45.1993 57.4089C44.4496 58.3311 43.3422 58.8005 41.9111 58.8005C40.48 58.8005 39.7133 58.482 38.9126 57.8616C38.4356 57.4927 38.0437 57.0232 37.7711 56.4532C37.4815 55.8663 37.3622 55.1956 37.3622 54.5417V54.1896H47.9593C47.9593 52.3284 47.38 50.7523 46.2045 49.4277C45.0289 48.1031 43.5296 47.4492 41.6896 47.4492C39.8496 47.4492 38.163 48.0864 36.9363 49.3607C35.7096 50.635 35.0963 52.2446 35.0963 54.1561C35.0963 56.0675 35.7267 57.7107 36.9704 58.9682C38.2141 60.2425 39.8326 60.8797 41.8259 60.8797C43.8193 60.8797 46.1363 59.9239 47.363 57.9957C47.9082 57.258 47.9422 56.4028 47.9422 56.4028H45.7274C45.7274 56.4196 45.7104 56.4531 45.6934 56.4699L45.7274 56.4867ZM38.7933 50.5511C39.56 49.8804 40.5311 49.5451 41.7067 49.5451C42.8822 49.5451 43.5978 49.8637 44.3474 50.4841C44.9608 50.9871 45.3867 51.6913 45.6252 52.58H37.5156C37.7541 51.7584 38.18 51.0709 38.7933 50.5344V50.5511Z"
                      fill="black"
                    />
                    <path
                      d="M8.38219 49.4779V56.671C8.38219 57.3249 8.51848 57.7943 8.80811 58.0626C9.0807 58.3309 9.52367 58.4818 10.1029 58.4818C10.6822 58.4818 11.3977 58.4818 12.2496 58.4315V60.5106C10.0518 60.7789 8.4333 60.6112 7.39404 60.0244C6.37182 59.4375 5.8607 58.3141 5.8607 56.6542V49.4611H2.98145V47.2311H5.8607V43.5088H8.38219V47.2311H12.2496V49.4611H8.38219V49.4779Z"
                      fill="black"
                    />
                    <path
                      d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z"
                      fill="#EC6D04"
                    />
                    <path
                      d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z"
                      fill="#F9AF02"
                    />
                    <path
                      d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z"
                      fill="black"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Mobil Arama Kutusu - Ana Sayfada Gizlendi */}
            {/*
            {isHomepage && !hideSearchAndProfile && (
              <div className="flex-1 max-w-lg mx-4 md:hidden">
                <div className="relative" ref={searchContainerRef}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleSearchFocus}
                    onKeyDown={handleKeyPress}
                    placeholder="Marka, kategori, mağaza veya ürün ara..."
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-gray-900"
                  />
                  Search Icon - Ana Sayfa Mobil Görünümde Gizlendi
            <button 
              onClick={handleSearchSubmit}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    data-clarity-region="ignore"
            >
                    <MagnifyingGlassIcon className="h-5 w-5 text-orange-500 hover:text-orange-600" />
            </button>
            
                  Mobil Akıllı Arama Dropdown
                  <SmartSearchDropdown
                  isOpen={isSearchFocused}
                  onClose={() => setIsSearchFocused(false)}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
                </div>
              </div>
            )}
            */}

            {/* Desktop Arama Kutusu - Ortada */}
            {!hideSearchAndProfile && ((!isAccountPage || isAccountPageWithSearch) || isStorePage || isBrandPage || isCategoryPage || isSearchPage) && (
              <div className="flex-1 max-w-lg mx-8 hidden md:block">
                <div
                  className="relative z-[99999]"
                  ref={desktopSearchContainerRef}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={handleSearchFocus}
                    onClick={handleSearchClick}
                    onKeyDown={handleKeyPress}
                    placeholder="Marka, kategori, mağaza veya ürün ara..."
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-xs sm:text-sm text-gray-900 placeholder:text-[11px] sm:placeholder:text-sm"
                  />
                  {/* Search Icon */}
                  <button
                    onClick={handleSearchSubmit}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    data-clarity-region="ignore"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 text-orange-500 hover:text-orange-600" />
                  </button>

                  {/* Desktop Akıllı Arama Dropdown */}
                  <SmartSearchDropdown
                    isOpen={isSearchFocused}
                    onClose={() => setIsSearchFocused(false)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    anchorRef={desktopSearchContainerRef}
                  />
                </div>
              </div>
            )}

            {/* Sağ Menü - En Sağda (Mobilde padding ile en sağa) */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0 md:flex-shrink-0 -mr-2 md:mr-0">
              {/* Mobil Search Icon - Ana Sayfa Dışında - Gizlendi */}
              {/* {!isHomepage && !hideSearchAndProfile && (
                <button
                  onClick={() => setIsSearchFocused(true)}
                  className="md:hidden flex items-center space-x-2 text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  <MagnifyingGlassIcon className="h-6 w-6 text-black" />
                </button>
              )} */}

              {/* 1. Hesabım/Giriş Yap - En Solda */}
              {!hideSearchAndProfile && !isLoggedIn ? (
                <Link
                  href="/giris"
                  className={`${isMobileBackLayout ? 'hidden md:flex' : 'hidden md:flex'} items-center space-x-2 text-black px-3 py-2 rounded-md text-sm font-medium`}
                  data-clarity-region="ignore"
                >
                  <UserIcon className="h-6 w-6 text-black" />
                  <span className="hidden sm:block text-xs font-normal text-black">
                    Giriş Yap
                  </span>
                </Link>
              ) : !hideSearchAndProfile ? (
                <div
                  className={`relative account-dropdown ${isMobileBackLayout ? 'hidden md:block' : 'hidden md:block'}`}
                  ref={accountAnchorRef}
                >
                  <Link
                    href="/hesabim"
                    className="flex items-center space-x-2 p-2 rounded-md text-black"
                    onMouseEnter={() => setShowAccountDropdown(true)}
                    onMouseLeave={() => setShowAccountDropdown(false)}
                    data-clarity-region="ignore"
                  >
                    <UserIcon className="h-6 w-6 text-black" />
                    <span className="hidden sm:block text-xs font-normal text-black">
                      Hesabım
                    </span>
                  </Link>

                  {/* Invisible area below Hesabım button to prevent dropdown closing */}
                  {showAccountDropdown && (
                    <div
                      className="absolute top-full bg-transparent z-49"
                      style={{
                        marginTop: "0px",
                        right: "0px",
                        width: "224px",
                        height: "10px",
                      }}
                      onMouseEnter={() => setShowAccountDropdown(true)}
                      onMouseLeave={() => setShowAccountDropdown(false)}
                    />
                  )}

                  {/* Dropdown Menu */}
                  {showAccountDropdown && accountDropdownPosition && (
                    <div
                      className="fixed w-56 bg-white rounded-xl border border-gray-100 z-[1200] overflow-hidden"
                      style={{
                        top: accountDropdownPosition.top,
                        right: accountDropdownPosition.right,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                      onMouseEnter={() => setShowAccountDropdown(true)}
                      onMouseLeave={() => setShowAccountDropdown(false)}
                    >
                      {/* Header Section with Gradient */}
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-white">
                              {user?.name && user?.lastname
                                ? `${user.name} ${user.lastname}`
                                : user?.email || "Kullanıcı"}
                            </div>
                            <div className="text-xs text-orange-100">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href="/hesabim/siparislerim"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          Tüm Siparişlerim
                        </Link>

                        <Link
                          href="/hesabim/degerlendirmelerim"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                          Değerlendirmelerim
                        </Link>

                        <Link
                          href="/hesabim/mesajlarim"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                          Satıcı Mesajlarım
                        </Link>

                        <Link
                          href="/hesabim/kullanici-bilgilerim"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 group"
                          onClick={() => setShowAccountDropdown(false)}
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Kullanıcı Bilgilerim
                        </Link>

                        {/* Divider */}
                        <div className="mx-4 my-2 border-t border-gray-100"></div>

                        {/* Logout Button */}
                        <button
                          onClick={() => {
                            setShowAccountDropdown(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 group"
                        >
                          <svg
                            className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Mobil Arama İkonu - Geri butonlu sayfalarda, Hesabım, Favoriler, Koleksiyonlar, Mesajlar, Siparişler, Sipariş Detay, Değerlendirmeler, Tekrar Al, Önceden Gezdiklerim, Takip Ettiğim Mağazalar, Kullanıcı Bilgilerim, Adres Bilgilerim, Kayıtlı Kartlarım, Duyuru Tercihlerim, Mağaza, Markalar ve Category sayfalarında */}
              {!hideSearchAndProfile && ((isMobileBackLayout && !isAccountPage) || isAccountPageWithSearch || isStorePage || isBrandPage || isCategoryPage) && (
                <button
                  onClick={() => setIsSearchFocused(true)}
                  className="md:hidden flex items-center justify-center text-black px-2 py-2 rounded-md"
                  aria-label="Ara"
                >
                  <MagnifyingGlassIcon className="h-6 w-6" />
                </button>
              )}

              {/* Profil İkonu - Mobil Ana Sayfa */}
              {!hideSearchAndProfile && isHomepage && (
                <Link
                  href={isLoggedIn ? "/hesabim" : "/giris"}
                  className="md:hidden flex items-center justify-center p-2 rounded-md text-black relative mt-1 sm:mt-0"
                  aria-label={isLoggedIn ? "Hesabım" : "Giriş Yap"}
                >
                  <UserIcon className="h-6 w-6 text-black" />
                </Link>
              )}

              {/* 2. Favorilerim - Ortada */}
              {!hideSearchAndProfile && (
                <Link
                  href="/hesabim/favoriler"
                  className="flex items-center space-x-2 p-2 rounded-md text-black relative mt-1 sm:mt-0"
                >
                  <div className="relative" data-clarity-region="ignore">
                    <HeartIcon className="h-6 w-6 text-black" />
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-2.3 bg-orange-500 text-white text-[9px] sm:text-xs font-semibold rounded-full min-w-[16px] h-[16px] sm:min-w-[22px] sm:h-[22px] px-0.5 sm:px-1 flex items-center justify-center border border-white shadow-md leading-none">
                        {favoritesCount > 99 ? "99+" : favoritesCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-normal text-black">
                    Favorilerim
                  </span>
                </Link>
              )}

              {/* Hesabım sayfasında arama alanını gizle, sadece arama ikonu göster (sepetin solunda) - Favoriler hariç */}
              {!hideSearchAndProfile && isAccountPageExceptFavorites && (
                <button
                  type="button"
                  onClick={() => router.push('/q')}
                  className="flex items-center justify-center p-2 rounded-md text-black relative mt-1 sm:mt-0"
                  aria-label="Ara"
                >
                  <MagnifyingGlassIcon className="h-6 w-6 text-black" />
                </button>
              )}

              {/* 3. Sepetim */}
              {!hideSearchAndProfile && (
                <Link
                  href="/sepet"
                  className="flex items-center space-x-2 p-2 rounded-md text-black relative mt-1 sm:mt-0"
                >
                  <div className="relative" data-clarity-region="ignore">
                    <ShoppingCartIcon className="h-6 w-6 text-black" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-2.3 bg-orange-500 text-white text-[9px] sm:text-xs font-semibold rounded-full min-w-[16px] h-[16px] sm:min-w-[22px] sm:h-[22px] px-0.5 sm:px-1 flex items-center justify-center border border-white shadow-md leading-none">
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-xs font-normal text-black">
                    Sepet
                  </span>
                </Link>
              )}

            </div>
          </div>

          {/* Alt Satır - Sadece Mobil Arama Kutusu */}
          {/* Alt Satır - Mobil arama çubuğu: Hesabım sayfasında gizle */}
          {!hideSearchAndProfile && !isMobileBackLayout && !isAccountPage && isHomepage && (
            <div className="md:hidden pt-19 pb-1">
              {/* Mobil Arama Kutusu - Alt Satırda Her Zaman Görünür - SlidingBanner ile aynı hizada */}
              <div
                className="w-full mx-auto max-w-[95%] sm:max-w-[92%] md:max-w-[90%] lg:max-w-[88%] xl:max-w-[1600px] relative flex items-center gap-2 px-2.5 sm:px-3 md:px-4 lg:px-5 xl:px-6 2xl:px-8 overflow-hidden"
                ref={mobileSearchContainerRef}
              >
            
                {/* Back ewreButton - Mobilde search bar'ın solunda */}
                {showBackButton && onBackClick && (
                  <button
                    onClick={onBackClick}
                    className="p-3 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 flex-shrink-0"
                  >
                    <ArrowLeftIcon className="h-8 w-8" />
                  </button>
                )}
                <div className="flex-1 relative">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSearchSubmit();
                    }}
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        // onFocus={handleSearchFocus}
                        onClick={handleSearchClick}
                        placeholder="Marka, kategori, mağaza veya ürün ara..."
                        className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-[14px] sm:text-sm text-gray-900 input-no-underline placeholder:text-xs"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        inputMode="search"
                        enterKeyHint="search"
                        style={{
                          WebkitAppearance: "none",
                          appearance: "none",
                          color: "#111827",
                        }}
                      />
                      {/* Search Icon */}
                      <button
                        type="submit"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                        data-clarity-region="ignore"
                      >
                        <MagnifyingGlassIcon className="h-5 w-5 text-orange-500 hover:text-orange-600" />
                      </button>
                    </div>
                  </form>

                  {/* Mobile Akıllı Arama Dropdown - Q sayfasında desktop'ta gösterilmiyor */}
                  {isSearchFocused && !isSearchPage && (
                    <SmartSearchDropdown
                      isOpen={isSearchFocused}
                      onClose={() => setIsSearchFocused(false)}
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      anchorRef={mobileSearchContainerRef}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Q Sayfası için Mobil Arama Modal - Desktop'ta gösterilmiyor */}
          {isSearchPage && !hideSearchAndProfile && isSearchFocused && (
            <div className="hidden fixed inset-0 z-[9999] bg-white h-[100dvh]">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-center gap-3 flex-1">
                    <button
                      onClick={() => setIsSearchFocused(false)}
                      className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ArrowLeftIcon className="w-8 h-8 text-gray-600" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Marka, kategori, mağaza veya ürün ara..."
                        className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-gray-900"
                        autoFocus
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                        inputMode="search"
                        enterKeyHint="search"
                      />
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
                        data-clarity-region="ignore"
                      >
                        <MagnifyingGlassIcon className="h-5 w-5 text-orange-500 hover:text-orange-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Search Results */}
                <div className="flex-1 overflow-y-auto">
                  <SmartSearchDropdown
                    isOpen={isSearchFocused}
                    onClose={() => setIsSearchFocused(false)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    anchorRef={mobileSearchContainerRef}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Modal - Ana Sayfa Dışında - Q sayfasında gösterilmiyor */}
      {/* Mobil Search Icon'a tıklayınca SmartSearchDropdown'ın tam sayfa modal'ı açılsın */}
      {!isHomepage && !hideSearchAndProfile && !isSearchPage && isSearchFocused && (
        <SmartSearchDropdown
          isOpen={isSearchFocused}
          onClose={() => setIsSearchFocused(false)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {/* Logout Onay Modalı */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowLogoutConfirm(false)}
          ></div>
          <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Çıkış Yap
              </h2>
              <p className="text-gray-600 mb-6">
                Hesabınızdan çıkış yapmak istediğinizden emin misiniz?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default MiddleHeader;
