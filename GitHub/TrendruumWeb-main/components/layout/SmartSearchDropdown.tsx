"use client";

import type React from "react";
import {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import {
  smartSearchService,
  SearchResult,
} from "@/app/services/smartSearchService";
import { createProductUrl } from "@/utils/productUrl";
import { processSearchTerm, detectGenderFromSearchTerm } from "../../utils/searchUtils";

interface SmartSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

export default function SmartSearchDropdown({
  isOpen,
  onClose,
  searchQuery,
  setSearchQuery,
  anchorRef,
}: SmartSearchDropdownProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileModalRef = useRef<HTMLDivElement>(null);
  const [desktopPosition, setDesktopPosition] = useState<{
    left: number;
    top: number;
    width: number;
    maxHeight: number;
  } | null>(null);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    if (typeof window === "undefined") {
      return;
    }

    let container = document.getElementById("smart-search-portal-root") as HTMLElement | null;
    if (!container) {
      container = document.createElement("div");
      container.id = "smart-search-portal-root";
      container.style.position = "relative";
      container.style.zIndex = "2147483000";
      document.body.appendChild(container);
    }
    setPortalContainer(container);

    return () => {
      // Keep the portal container for reuse; do not remove to avoid flicker
    };
  }, []);

  const updateDesktopPosition = useCallback(() => {
    if (!anchorRef?.current) {
      return;
    }

    const triggerRect = anchorRef.current.getBoundingClientRect();
    const verticalOffset = 8;
    const top = triggerRect.bottom + verticalOffset;
    const left = triggerRect.left;
    const width = triggerRect.width;
    const availableHeight = window.innerHeight - top - 24;
    const fallbackHeight = 384;
    const maxHeight =
      availableHeight > 0
        ? Math.min(availableHeight, fallbackHeight)
        : fallbackHeight;

    setDesktopPosition({
      left,
      top,
      width,
      maxHeight,
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setDesktopPosition(null);
      return;
    }

    // Desktop görünümünde anchorRef yoksa dropdown gösterme
    if (!anchorRef) {
      return;
    }

    // anchorRef hazır olana kadar bekle - requestAnimationFrame ile
    const tryUpdatePosition = () => {
      if (anchorRef?.current) {
        updateDesktopPosition();
        return true;
      }
      return false;
    };

    // requestAnimationFrame ile bir sonraki frame'de dene
    let intervalId: NodeJS.Timeout | null = null;
    const rafId = requestAnimationFrame(() => {
      if (!tryUpdatePosition()) {
        // Hala hazır değilse, birkaç kez tekrar dene
        let attempts = 0;
        const maxAttempts = 30;
        intervalId = setInterval(() => {
          attempts++;
          if (tryUpdatePosition() || attempts >= maxAttempts) {
            if (intervalId) {
              clearInterval(intervalId);
              intervalId = null;
            }
          }
        }, 16); // ~60fps
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isOpen, updateDesktopPosition, anchorRef]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleReposition = () => updateDesktopPosition();

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen, updateDesktopPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    // anchorRef hazır olana kadar bekle ve tekrar dene
    if (anchorRef?.current) {
      updateDesktopPosition();
    } else {
      // Ref henüz hazır değilse, kısa bir gecikme ile tekrar dene
      const timeoutId = setTimeout(() => {
        if (anchorRef?.current) {
          updateDesktopPosition();
        }
      }, 10);
      return () => clearTimeout(timeoutId);
    }
  }, [searchResults, isOpen, updateDesktopPosition, anchorRef]);

  // LocalStorage'dan geçmiş aramaları yükle
  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      try {
        const searches = JSON.parse(savedSearches);
        setRecentSearches(searches.slice(0, 5)); // Sadece son 5 arama
      } catch (error) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Debounce için timeout ref
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_SEARCH_LENGTH = 2;
  const SEARCH_DEBOUNCE = 500; // 500ms debounce

  // Akıllı arama - debounce ile, minimum 2 karakter, 500ms bekleme
  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    // Önceki timeout'u temizle
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    if (!isOpen || trimmedQuery.length < MIN_SEARCH_LENGTH) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    // Debounce: 500ms bekle, sonra arama yap
    searchTimeoutRef.current = setTimeout(() => {
      let isCancelled = false;

      const performSearch = async () => {
        if (isCancelled) return;
        
        setIsLoading(true);
        try {
          // İstisna kelimeleri çıkar (kadın, erkek vb.) ve temizlenmiş sorguyu al
          const { cleanedQuery, detectedGender } = detectGenderFromSearchTerm(trimmedQuery);
          const finalQuery = cleanedQuery || trimmedQuery;
          
          // Debug: Query işleme bilgisi
          
          const results = await smartSearchService.searchAll(finalQuery, 1000);
          if (!isCancelled) {
            setSearchResults(results.results);
          }
        } catch (error) {
          if (!isCancelled) {
            setSearchResults([]);
          }
        } finally {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      };

      performSearch();
    }, SEARCH_DEBOUNCE);

    // Cleanup: Her yeni yazımda önceki timeout'u iptal et
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [searchQuery, isOpen]);

  // Click outside to close (desktop only). On mobile, clicks inside the modal should not close it.
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Dropdown (desktop) içindeki tıklamaları ignore et
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return;
      }

      // Mobile modal içindeki tıklamaları ignore et
      if (mobileModalRef.current && mobileModalRef.current.contains(target)) {
        return;
      }

      // Button, link gibi interactive elementleri ignore et
      if (
        target.closest("button") ||
        target.closest("a") ||
        target.closest('[role="button"]')
      ) {
        return;
      }

      // Scroll bar'ları ve scroll container'ları ignore et
      if (
        target.classList.contains("scrollbar-hide") ||
        target.classList.contains("scroll-container") ||
        target.classList.contains("dropdown-container") ||
        target.classList.contains("desktop-dropdown") ||
        target.classList.contains("desktop-scroll") ||
        target.closest(".scrollbar-hide") ||
        target.closest(".scroll-container") ||
        target.closest(".dropdown-container") ||
        target.closest(".desktop-dropdown") ||
        target.closest(".desktop-scroll") ||
        target.closest(".overflow-y-auto") ||
        target.closest(".overflow-auto") ||
        target.closest(".max-h-80") ||
        target.closest(".max-h-96") ||
        target.closest(".max-h-64") ||
        target.style.overflow === "auto" ||
        target.style.overflow === "scroll" ||
        target.style.overflowY === "auto" ||
        target.style.overflowY === "scroll"
      ) {
        return;
      }

      // Sadece desktop görünümde kapat (md ve üstü). Mobile modal kendi kapama kontrolüne sahip olmalı.
      if (window.innerWidth >= 768) {
        onClose();
      }
    };

    const handleScroll = (event: Event) => {
      // Scroll event'lerini ignore et - dropdown kapanmasın
      event.stopPropagation();
    };

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Desktop dropdown içindeki tüm tıklamaları ignore et
      if (
        target.closest(".desktop-dropdown") ||
        target.closest(".desktop-scroll")
      ) {
        event.stopPropagation();
        return;
      }
    };

    if (isOpen) {
      // Pointer event'leri iOS ile daha uyumlu
      document.addEventListener("pointerdown", handleClickOutside);
      document.addEventListener("pointerdown", handleMouseDown, true);
      // Scroll event'lerini dinle ama dropdown'ı kapatma
      document.addEventListener("scroll", handleScroll, true);
    }

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("pointerdown", handleMouseDown, true);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen, onClose]);

  const handleResultClick = (result: SearchResult) => {
    // Geçmiş aramalara ekle
    const newRecentSearches = [
      result.name,
      ...recentSearches.filter((s) => s !== result.name),
    ].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

    // Sonuç türüne göre yönlendir
    switch (result.type) {
      case "keyword":
        // Keyword için arama sayfasına yönlendir
        const keywordSearchUrl = processSearchTerm(result.name);
        router.push(keywordSearchUrl);
        break;
      case "product":
        router.push(createProductUrl(result.slug));
        break;
      case "brand":
        router.push(`/markalar/${result.slug}`);
        break;
      case "category":
        router.push(`/${result.slug}`);
        break;
      case "store":
        router.push(`/magaza/${result.slug}`);
        break;
    }

    setTimeout(() => {
      onClose();
    }, 100);
  };

  const handleRecentSearchClick = async (
    search: string,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Arama yap
    setSearchQuery(search);

    try {
      // İstisna kelimeleri çıkar (kadın, erkek vb.) ve temizlenmiş sorguyu al
      const { cleanedQuery } = detectGenderFromSearchTerm(search);
      const finalQuery = cleanedQuery || search;
      
      const results = await smartSearchService.searchAll(finalQuery, 1);
      if (results.results.length > 0) {
        const firstResult = results.results[0];
        handleResultClick(firstResult);
      }
    } catch (error) {
    }
  };

  const removeRecentSearch = (search: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const newRecentSearches = recentSearches.filter((s) => s !== search);
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
  };

  const clearRecentSearches = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "product":
        return "Ürün";
      case "brand":
        return "Marka";
      case "category":
        return "Kategori";
      case "store":
        return "Mağaza";
      default:
        return "";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "product":
        return "bg-blue-100 text-blue-800";
      case "brand":
        return "bg-purple-100 text-purple-800";
      case "category":
        return "bg-green-100 text-green-800";
      case "store":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("tr-TR")} TL`;
  };

  if (!isOpen || !isClient || !portalContainer) {
    return null;
  }

  const content = (
    <>
      {/* Mobile Full Screen Modal - Desktop'ta md:hidden ile gizli */}
      <div
        ref={mobileModalRef}
        className="md:hidden fixed inset-0 z-[9999] bg-white h-[100dvh]"
      >
        <div className="flex flex-col h-full overscroll-contain">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <button
              aria-label="Kapat"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
                router.push("/");
              }}
              className="p-2 -m-2 text-gray-500 hover:text-gray-700"
              data-clarity-region="ignore"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Arama</h2>
            {/* Right spacer to keep title centered */}
            <span className="w-6 h-6"></span>
          </div>

          {/* Mobile Search Input */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  const searchUrl = processSearchTerm(searchQuery);
                  router.push(searchUrl);
                  onClose();
                }
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (searchQuery.trim()) {
                        const searchUrl = processSearchTerm(searchQuery);
                        router.push(searchUrl);
                        onClose();
                      }
                    }
                  }}
                  placeholder="Marka, kategori, mağaza veya ürün ara..."
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base text-gray-900"
                  autoFocus
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
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 hover:text-orange-500" />
                </button>
              </div>
            </form>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto">
            <div
              className="max-h-full overflow-y-auto scroll-container"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {searchQuery.trim() ? (
                <>
                  {/* İlgili Aramalar Başlığı */}
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">
                        İlgili Aramalar
                      </span>
                    </div>
                  </div>

                  {/* Arama Sonuçları */}
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Aranıyor...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {/* Tüm sonuçları sıralı göster: Keywords → Ürünler → Markalar → Mağazalar → Kategoriler */}
                      {searchResults
                        .sort((a, b) => {
                          const typeOrder = {
                            keyword: 0,
                            product: 1,
                            brand: 2,
                            store: 3,
                            category: 4,
                          };
                          return (
                            (typeOrder[a.type] ?? 5) - (typeOrder[b.type] ?? 5)
                          );
                        })
                        .map((result) => (
                          <button
                            key={`${result.type}-${result.id}`}
                            onClick={() => handleResultClick(result)}
                            className="w-full px-4 py-1 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <div className="flex items-center gap-3">
                              {/* Resim - sadece ürünlerde göster */}
                              {result.type === "product" && (
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  {result.image ? (
                                    <Image
                                      src={result.image}
                                      alt={result.name}
                                      width={32}
                                      height={32}
                                      className="w-full h-full object-contain rounded-lg"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                  )}
                                </div>
                              )}

                              {/* Keyword için icon */}
                              {result.type === "keyword" && (
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                                </div>
                              )}

                              {/* İçerik */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-sm font-medium text-gray-900 truncate">
                                    {result.name}
                                  </h3>
                                  {result.type !== "product" &&
                                    result.type !== "keyword" && (
                                      <span className="text-xs text-gray-500 ml-2">
                                        {getTypeLabel(result.type)}
                                      </span>
                                    )}
                                </div>

                                {/* Ek bilgiler - sadece ürünlerde göster */}
                                {result.type === "product" && (
                                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                    {result.price && (
                                      <span className="font-medium text-orange-600">
                                        {formatPrice(result.price)}
                                      </span>
                                    )}
                                    {result.brand && (
                                      <span>• {result.brand}</span>
                                    )}
                                    {result.rating && (
                                      <div className="flex items-center gap-1">
                                        <StarIconSolid className="w-3 h-3 text-yellow-400" />
                                        <span>{result.rating}</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Arama sonucu bulunamadı</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Geçmiş Aramalar */}
                  {recentSearches.length > 0 && (
                    <div className="py-2">
                      <div className="px-4 py-2 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-700">
                          Son Aramalar
                        </h3>
                        <button
                          onClick={(e) => clearRecentSearches(e)}
                          className="text-xs text-orange-600 hover:text-orange-700"
                        >
                          Temizle
                        </button>
                      </div>
                      {recentSearches.map((search, index) => (
                        <div
                          key={index}
                          className="w-full px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                        >
                          <button
                            onClick={(e) => handleRecentSearchClick(search, e)}
                            className="flex-1 text-left"
                          >
                            <span className="text-sm text-gray-700">
                              {search}
                            </span>
                          </button>
                          <button
                            onClick={(e) => removeRecentSearch(search, e)}
                            className="p-1 hover:bg-gray-200 rounded ml-2"
                          >
                            <XMarkIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Dropdown - Tüm sayfalarda anchorRef varsa göster */}
      {isOpen && anchorRef && anchorRef.current && (
        <div
          ref={dropdownRef}
          className="hidden md:block fixed z-[99999] bg-white rounded-b-lg border border-gray-200 overflow-y-auto scrollbar-hide dropdown-container desktop-dropdown min-h-[180px]"
          style={{
            top:
              desktopPosition?.top ??
              (() => {
                const r = anchorRef?.current?.getBoundingClientRect();
                return r ? r.bottom + 8 : 0;
              })(),
            left:
              desktopPosition?.left ??
              (() => {
                const r = anchorRef?.current?.getBoundingClientRect();
                return r ? r.left : 0;
              })(),
            width:
              desktopPosition?.width ??
              (anchorRef?.current?.getBoundingClientRect().width || 480),
            maxHeight: desktopPosition?.maxHeight ?? 384,
          }}
        >
          <div className="max-h-full overflow-y-auto scroll-container desktop-scroll">
            {searchQuery.trim() ? (
              <>
                {/* İlgili Aramalar Başlığı */}
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      İlgili Aramalar
                    </span>
                  </div>
                </div>

                {/* Arama Sonuçları */}
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-3">Aranıyor...</p>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {/* Tüm sonuçları sıralı göster: Keywords → Ürünler → Markalar → Mağazalar → Kategoriler */}
                    {searchResults
                      .sort((a, b) => {
                        const typeOrder = {
                          keyword: 0,
                          product: 1,
                          brand: 2,
                          store: 3,
                          category: 4,
                        };
                        return (
                          (typeOrder[a.type] ?? 5) - (typeOrder[b.type] ?? 5)
                        );
                      })
                      .map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-6 py-1.5 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-4">
                            {/* Resim - sadece ürünlerde göster */}
                            {result.type === "product" && (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {result.image ? (
                                  <Image
                                    src={result.image}
                                    alt={result.name}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                )}
                              </div>
                            )}

                            {/* Keyword için icon */}
                            {result.type === "keyword" && (
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                              </div>
                            )}

                            {/* İçerik */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-900 truncate">
                                  {result.name}
                                </h3>
                                {result.type !== "product" &&
                                  result.type !== "keyword" && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      {getTypeLabel(result.type)}
                                    </span>
                                  )}
                              </div>

                              {/* Ek bilgiler - sadece ürünlerde göster */}
                              {result.type === "product" && (
                                <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                  {result.price && (
                                    <span className="font-medium text-orange-600">
                                      {formatPrice(result.price)}
                                    </span>
                                  )}
                                  {result.brand && (
                                    <span>• {result.brand}</span>
                                  )}
                                  {result.rating && (
                                    <div className="flex items-center gap-1">
                                      <StarIconSolid className="w-3 h-3 text-yellow-400" />
                                      <span>{result.rating}</span>
                                      {result.review_count && (
                                        <span>({result.review_count})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <p className="text-sm">Arama sonucu bulunamadı</p>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Geçmiş Aramalar veya Öneriler */}
                {recentSearches.length > 0 ? (
                  <div className="py-2">
                    <div className="px-6 py-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">
                        Geçmiş Aramalar
                      </h3>
                      <button
                        onClick={(e) => clearRecentSearches(e)}
                        className="text-xs text-orange-600 hover:text-orange-700"
                      >
                        Temizle
                      </button>
                    </div>
                    {recentSearches.map((search, index) => (
                      <div
                        key={index}
                        className="w-full px-6 py-3 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <button
                          onClick={(e) => handleRecentSearchClick(search, e)}
                          className="flex-1 text-left"
                        >
                          <span className="text-sm text-gray-700">
                            {search}
                          </span>
                        </button>
                        <button
                          onClick={(e) => removeRecentSearch(search, e)}
                          className="p-1 hover:bg-gray-200 rounded ml-2"
                        >
                          <XMarkIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-600">
                    <p className="text-sm">
                      Aramaya başlamak için yazmaya başlayın
                    </p>
                  
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );

  return createPortal(content, portalContainer);
}
