"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';
import { API_V1_URL } from '@/lib/config';
import { createProductUrl } from '@/utils/productUrl';
import { processSearchTerm } from '../../utils/searchUtils';

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price?: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  medias?: {
    url: string;
    type: string;
  }[];
  images?: {
    url: string;
    type: string;
  }[];
  brand?: {
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
  children?: Category[];
  isDirectMatch?: boolean;
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
}

interface SearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  results: SearchResult[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categories: Category[];
  activeTab: 'general' | 'brands' | 'categories';
  onActiveTabChange?: (tab: 'general' | 'brands' | 'categories') => void;
}

export default function SearchDropdown({ 
  isOpen, 
  onClose, 
  results, 
  isLoading, 
  searchQuery, 
  setSearchQuery,
  categories,
  activeTab,
  onActiveTabChange
}: SearchDropdownProps) {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const router = useRouter();
  const brandSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categorySearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const MIN_SEARCH_LENGTH = 2;
  const SEARCH_DEBOUNCE = 400;
  const latestSearchQueryRef = useRef(searchQuery.trim());
  const activeTabRef = useRef(activeTab);

  useEffect(() => {
    latestSearchQueryRef.current = searchQuery.trim();
  }, [searchQuery]);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // Active tab değiştiğinde parent component'e bildir
  useEffect(() => {
    if (onActiveTabChange) {
      onActiveTabChange(activeTab);
    }
  }, [activeTab, onActiveTabChange]);

  // LocalStorage'dan geçmiş aramaları yükle
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) {
      try {
        const searches = JSON.parse(savedSearches);
        setRecentSearches(searches.slice(0, 5)); // Sadece son 5 arama
      } catch (error) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Markaları API'den çek
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const response = await axios.get(`${API_V1_URL}/brands`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.meta?.status === 'success') {
          setBrands(response.data.data || []);
        }
      } catch (error) {
        setBrands([]);
      } finally {
        setBrandsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Marka arama fonksiyonu (API endpoint kullanarak)
  const searchBrands = useCallback(async (searchTerm: string) => {
    try {
      const response = await axios.get(`${API_V1_URL}/brands/list?name=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (activeTabRef.current !== 'brands' || latestSearchQueryRef.current !== searchTerm.trim()) {
        return;
      }

      if (response.data.meta?.status === 'success') {
        setFilteredBrands(response.data.data || []);
      } else {
        setFilteredBrands([]);
      }
    } catch (error) {
      setFilteredBrands([]);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'brands') {
      return;
    }

    const trimmedQuery = searchQuery.trim();

    if (brandSearchTimeoutRef.current) {
      clearTimeout(brandSearchTimeoutRef.current);
      brandSearchTimeoutRef.current = null;
    }

    if (!trimmedQuery) {
      setFilteredBrands(brands);
      setBrandsLoading(false);
      return;
    }

    if (trimmedQuery.length < MIN_SEARCH_LENGTH) {
      setFilteredBrands([]);
      setBrandsLoading(false);
      return;
    }

    setBrandsLoading(true);
    brandSearchTimeoutRef.current = setTimeout(() => {
      searchBrands(trimmedQuery).finally(() => {
        setBrandsLoading(false);
      });
    }, SEARCH_DEBOUNCE);

    return () => {
      if (brandSearchTimeoutRef.current) {
        clearTimeout(brandSearchTimeoutRef.current);
        brandSearchTimeoutRef.current = null;
      }
    };
  }, [searchQuery, activeTab, brands, searchBrands]);

  useEffect(() => {
    if (activeTab === 'brands' && !searchQuery.trim()) {
      setFilteredBrands(brands);
    }
  }, [activeTab, brands, searchQuery]);

  // Kategori arama fonksiyonu (API endpoint kullanarak)
  const searchCategories = useCallback(async (searchTerm: string) => {
    try {
      const response = await axios.get(`${API_V1_URL}/categories/list?name=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (activeTabRef.current !== 'categories' || latestSearchQueryRef.current !== searchTerm.trim()) {
        return;
      }

      if (response.data.meta?.status === 'success') {
        setFilteredCategories(response.data.data || []);
      } else {
        setFilteredCategories([]);
      }
    } catch (error) {
      setFilteredCategories([]);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'categories') {
      return;
    }

    const trimmedQuery = searchQuery.trim();

    if (categorySearchTimeoutRef.current) {
      clearTimeout(categorySearchTimeoutRef.current);
      categorySearchTimeoutRef.current = null;
    }

    if (!trimmedQuery) {
      setFilteredCategories(categories);
      setCategoriesLoading(false);
      return;
    }

    if (trimmedQuery.length < MIN_SEARCH_LENGTH) {
      setFilteredCategories([]);
      setCategoriesLoading(false);
      return;
    }

    setCategoriesLoading(true);
    categorySearchTimeoutRef.current = setTimeout(() => {
      searchCategories(trimmedQuery).finally(() => {
        setCategoriesLoading(false);
      });
    }, SEARCH_DEBOUNCE);

    return () => {
      if (categorySearchTimeoutRef.current) {
        clearTimeout(categorySearchTimeoutRef.current);
        categorySearchTimeoutRef.current = null;
      }
    };
  }, [searchQuery, activeTab, categories, searchCategories]);

  useEffect(() => {
    if (activeTab === 'categories' && !searchQuery.trim()) {
      setFilteredCategories(categories);
    }
  }, [activeTab, categories, searchQuery]);


  if (!isOpen) return null;

  const removeRecentSearch = (search: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const updatedSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearAllRecentSearches = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const addRecentSearch = (search: string) => {
    if (search.trim() && !recentSearches.includes(search.trim())) {
      const updatedSearches = [search.trim(), ...recentSearches.filter(s => s !== search.trim())].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    }
  };

  // Arama sonucuna tıklandığında recent search'e ekle
  const handleResultClick = (result: SearchResult) => {
    addRecentSearch(result.name);
    // Kısa bir gecikme ile menüyü kapat, böylece tıklama tamamlanabilir
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // Ürün arama fonksiyonu (büyük/küçük harf duyarlı)
  const searchProducts = async (searchTerm: string) => {
    try {
      const response = await axios.get(
        `${API_V1_URL}/products/search-custom?name=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.meta?.status === 'success') {
        const data = response.data.data;
        const allProducts = data.childrenProducts || [];
        const searchTermLower = searchTerm.toLowerCase();
        
        const filtered = allProducts.filter((product: any) => {
          if (!product.name) return false;
          
          const productNameLower = product.name.toLowerCase();
          
          // Tam eşleşme öncelikli
          if (productNameLower === searchTermLower) return true;
          
          // Kelime başlangıcı
          if (productNameLower.startsWith(searchTermLower)) return true;
          
          // Ayrı kelime olarak geçme
          const words = productNameLower.split(/[\s\-_]+/);
          if (words.includes(searchTermLower)) return true;
          
          return false;
        }).map((product: any) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          image: product.medias?.[0]?.url,
          price: product.price
        }));
        
        return filtered;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  // Search icon'una tıklandığında veya Enter'a basıldığında
  const handleSearchSubmit = async (searchTerm: string) => {
    if (searchTerm.trim()) {
      addRecentSearch(searchTerm.trim());
      
      const searchTermTrimmed = searchTerm.trim();
      
      // Aktif tab'a göre farklı davran
      if (activeTab === 'brands') {
        // Marka araması yap
        const matchingBrand = filteredBrands.find(brand => 
          brand.name && brand.name.toLowerCase().includes(searchTermTrimmed.toLowerCase())
        );
        
        if (matchingBrand) {
          router.push(`/markalar/${matchingBrand.slug}`);
          setTimeout(() => onClose(), 100);
          return;
        }
      } else if (activeTab === 'categories') {
        // Kategori araması yap (Genel Arama ile aynı mantık)
        const findMatchingCategory = (categories: Category[], searchTerm: string): Category | null => {
          const searchTermLower = searchTerm.toLowerCase().trim();
          
          // Önce tam eşleşme ara
          for (const category of categories) {
            if (category.name) {
              const categoryNameLower = category.name.toLowerCase();
              
              // Tam eşleşme
              if (categoryNameLower === searchTermLower) {
                return category;
              }
            }
            
            if (category.children && category.children.length > 0) {
              const found = findMatchingCategory(category.children, searchTerm);
              if (found) return found;
            }
          }
          
          // Tam eşleşme bulunamadıysa, kelime başlangıcı ara
          for (const category of categories) {
            if (category.name) {
              const categoryNameLower = category.name.toLowerCase();
              
              // Kelime başlangıcı eşleşmesi
              if (categoryNameLower.startsWith(searchTermLower)) {
                return category;
              }
            }
            
            if (category.children && category.children.length > 0) {
              const found = findMatchingCategory(category.children, searchTerm);
              if (found) return found;
            }
          }
          
          return null;
        };

        const matchingCategory = findMatchingCategory(categories, searchTerm.trim());
        
        if (matchingCategory) {
          // Kategori eşleşmesi bulundu, kategori sayfasına git
          router.push(`/${matchingCategory.slug}`);
          setTimeout(() => onClose(), 100);
          return;
        }
        
        // Kategori eşleşmesi bulunamadı, direkt kategori sayfasına git
        router.push(`/${searchTerm.trim()}`);
        setTimeout(() => onClose(), 100);
      } else {
        // General arama (ürünler)
        // Önce kategori eşleşmesi kontrol et
        const findMatchingCategory = (categories: Category[], searchTerm: string): Category | null => {
          const searchTermLower = searchTerm.toLowerCase().trim();
          
          // Önce tam eşleşme ara
          for (const category of categories) {
            if (category.name) {
              const categoryNameLower = category.name.toLowerCase();
              
              // Tam eşleşme
              if (categoryNameLower === searchTermLower) {
                return category;
              }
            }
            
            if (category.children && category.children.length > 0) {
              const found = findMatchingCategory(category.children, searchTerm);
              if (found) return found;
            }
          }
          
          // Tam eşleşme bulunamadıysa, kelime başlangıcı ara
          for (const category of categories) {
            if (category.name) {
              const categoryNameLower = category.name.toLowerCase();
              
              // Kelime başlangıcı eşleşmesi
              if (categoryNameLower.startsWith(searchTermLower)) {
                return category;
              }
            }
            
            if (category.children && category.children.length > 0) {
              const found = findMatchingCategory(category.children, searchTerm);
              if (found) return found;
            }
          }
          
          return null;
        };

        const matchingCategory = findMatchingCategory(categories, searchTerm.trim());
        
        if (matchingCategory) {
          // Kategori eşleşmesi bulundu, kategori sayfasına git
          router.push(`/${matchingCategory.slug}`);
          setTimeout(() => onClose(), 100);
          return;
        }
        
        // Kategori eşleşmesi bulunamadı, direkt kategori sayfasına git
        router.push(`/${searchTerm.trim()}`);
        setTimeout(() => onClose(), 100);
      }
    }
  };

  // Geçmiş aramada tıklandığında
  const handleRecentSearchClick = (searchTerm: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSearchQuery(searchTerm);
    // Cinsiyet tespiti yapıp doğru URL oluştur
    const searchUrl = processSearchTerm(searchTerm);
    router.push(searchUrl);
    setTimeout(() => onClose(), 100);
  };

  // Kategorileri filtreleme fonksiyonu (client-side fallback)
  const getFilteredCategories = (categories: Category[], searchTerm: string): Category[] => {
    const filteredCategories: Category[] = [];
    
    const searchInCategory = (category: Category): boolean => {
      // Ana kategori adında arama terimi var mı kontrol et (büyük/küçük harf duyarlı)
      if (category.name && category.name.includes(searchTerm)) {
        return true;
      }
      
      // Alt kategorilerde arama terimi var mı kontrol et
      if (category.children && category.children.length > 0) {
        for (const child of category.children) {
          if (searchInCategory(child)) {
            return true;
          }
        }
      }
      
      return false;
    };
    
    const addMatchingCategories = (categories: Category[], level: number = 0) => {
      for (const category of categories) {
        // Ana kategori adında arama terimi var mı kontrol et (büyük/küçük harf duyarlı)
        if (category.name && category.name.includes(searchTerm)) {
          filteredCategories.push({
            ...category,
            name: `${'  '.repeat(level)}${category.name}`,
            isDirectMatch: true
          });
        }
        
        // Alt kategorileri de kontrol et
        if (category.children && category.children.length > 0) {
          addMatchingCategories(category.children, level + 1);
        }
      }
    };
    
    addMatchingCategories(categories);
    return filteredCategories;
  };

  // Arama terimini vurgulama fonksiyonu (büyük/küçük harf duyarlı)
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm || !text) return text || '';
    
    const regex = new RegExp(`(${searchTerm})`, 'g');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />);
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <>
      {/* Mobile Full Screen Modal */}
      <div className="md:hidden fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <svg width="80" height="28" viewBox="0 0 184 65" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto">
              <path d="M130.861 17.2687C130.861 24.8307 124.643 30.9506 116.959 30.9506C109.276 30.9506 103.057 24.8307 103.057 17.2687C103.057 9.70674 109.276 3.60352 116.959 3.60352C124.643 3.60352 130.861 9.72351 130.861 17.2687Z" fill="#EC6D04"/>
              <path d="M84.3844 17.2687C84.3844 24.8307 78.1659 30.9506 70.4822 30.9506C62.7985 30.9506 56.58 24.8307 56.58 17.2687C56.58 9.70674 62.7985 3.60352 70.4822 3.60352C78.1659 3.60352 84.3844 9.72351 84.3844 17.2687Z" fill="#F9AF02"/>
              <path d="M108.219 17.2687C108.219 24.8307 102.001 30.9506 94.317 30.9506C86.6333 30.9506 80.4148 24.8307 80.4148 17.2687C80.4148 9.70674 86.6333 3.60352 94.317 3.60352C102.001 3.60352 108.219 9.72351 108.219 17.2687Z" fill="black"/>
            </svg>
            <h2 className="text-lg font-semibold text-gray-900">Arama</h2>
          </div>
                              <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Search Input */}
        <div className="p-4 bg-gray-50 flex-shrink-0">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Ürün, kategori veya marka ara..."
              className="w-full h-14 px-4 pr-14 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base placeholder-gray-500 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(searchQuery);
                }
              }}
              autoFocus
            />
            <button
              onClick={() => handleSearchSubmit(searchQuery)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <div className="bg-orange-500 p-2.5 rounded-lg hover:bg-orange-600 transition-colors">
                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              </div>
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <XMarkIcon className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="px-4 py-2 bg-white flex-shrink-0">
          <div className="flex bg-gray-100 rounded-lg p-1 w-full">
            <button
              onClick={() => onActiveTabChange && onActiveTabChange('general')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'general' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <MagnifyingGlassIcon className="w-4 h-4" />
                Ürünler
              </div>
            </button>
            <button
              onClick={() => onActiveTabChange && onActiveTabChange('brands')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'brands' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Markalar
              </div>
            </button>
            <button
              onClick={() => onActiveTabChange && onActiveTabChange('categories')}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-200 ${
                activeTab === 'categories' 
                  ? 'bg-white text-orange-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                </svg>
                Kategoriler
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {/* Mobile content will go here */}
          {activeTab === 'general' && (
            <div className="p-4 space-y-6 bg-gray-50">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-base font-semibold text-gray-900">Geçmiş Aramalar</h3>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRecentSearchClick(search, e);
                          }}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                            <MagnifyingGlassIcon className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">{search}</span>
                        </button>
                        <button
                          data-search-action="remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeRecentSearch(search, e);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {/* Geçmişi Temizle Butonu */}
                  {recentSearches.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          clearAllRecentSearches(e);
                        }}
                        className="w-full text-center text-sm text-gray-500 hover:text-red-500 py-2 transition-colors"
                      >
                        Geçmişi Temizle
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Matching Categories */}
              {searchQuery.length > 0 && (
                (() => {
                  const matchingCategories = getFilteredCategories(categories, searchQuery);
                  return matchingCategories.length > 0 ? (
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                        </svg>
                        <h3 className="text-base font-semibold text-gray-900">Eşleşen Kategoriler</h3>
                        <span className="text-sm text-gray-500">({matchingCategories.length})</span>
                      </div>
                      <div className="space-y-2">
                        {matchingCategories.slice(0, 5).map((category) => (
                          <Link
                            key={category.id}
                            href={`/${category.slug}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                            onClick={() => {
                              addRecentSearch(category.name);
                              setTimeout(() => {
                                onClose();
                              }, 100);
                            }}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                              {highlightSearchTerm(category.name || '', searchQuery)}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()
              )}

              {/* Search Results */}
              {results.length > 0 && (
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-base font-semibold text-gray-900">Bulunan Ürünler</h3>
                    <span className="text-sm text-gray-500">({results.length})</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {results.slice(0, 6).map((result) => (
                      <Link 
                        key={result.id}
                        href={createProductUrl(result.slug)} 
                        className="border border-gray-200 rounded-xl p-3 bg-white hover:border-orange-500 hover:shadow-md transition-all duration-200 block group"
                        onClick={() => {
                          handleResultClick(result);
                          onClose();
                        }}
                      >
                        <div className="relative mb-3">
                          {result.images && result.images[0] ? (
                            <Image
                              src={result.images[0].url}
                              alt={result.name}
                              width={100}
                              height={100}
                              className="w-full h-20 object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : result.medias && result.medias[0] ? (
                            <Image
                              src={result.medias[0].url}
                              alt={result.name}
                              width={100}
                              height={100}
                              className="w-full h-20 object-contain rounded-lg group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          {result.discount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                              %{result.discount}
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                          {result.name}
                        </h4>
                        {result.brand && (
                          <p className="text-xs text-gray-500 mb-2 font-medium">{result.brand.name}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-base font-bold text-gray-900">
                            {result.price?.toLocaleString('tr-TR')} TL
                          </span>
                          {result.oldPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              {result.oldPrice.toLocaleString('tr-TR')} TL
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-1">Aranıyor...</p>
                  <p className="text-sm text-gray-500">En iyi sonuçları buluyoruz</p>
                </div>
              )}

              {/* No Results */}
              {!isLoading && results.length === 0 && searchQuery.length > 0 && (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-1">Sonuç bulunamadı</p>
                  <p className="text-sm text-gray-500 mb-4">"{searchQuery}" için herhangi bir ürün bulamadık</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-gray-400">Öneriler:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Farklı kelimeler deneyin</span>
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Yazım hatası kontrol edin</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty State - No search query */}
              {!isLoading && results.length === 0 && searchQuery.length === 0 && recentSearches.length === 0 && (
                <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                    <MagnifyingGlassIcon className="w-8 h-8 text-orange-500" />
                  </div>
                  <p className="text-base font-medium text-gray-900 mb-1">Aramaya başlayın</p>
                  <p className="text-sm text-gray-500">İstediğiniz ürünü bulmanız için size yardımcı olalım</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'brands' && (
            <div className="p-4 space-y-6 bg-gray-50">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="text-base font-semibold text-gray-900">Markalar</h3>
                  <span className="text-sm text-gray-500">({brands.length})</span>
                </div>
                
                {brandsLoading ? (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
                    </div>
                    <p className="text-base font-medium text-gray-900 mb-1">Markalar yükleniyor...</p>
                    <p className="text-sm text-gray-500">Tüm markaları getiriyoruz</p>
                  </div>
                ) : filteredBrands.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/markalar/${brand.slug}`}
                        className="border border-gray-200 rounded-xl p-3 bg-white hover:border-orange-500 hover:shadow-md transition-all duration-200 block group"
                        onClick={() => {
                          addRecentSearch(brand.name);
                          setTimeout(() => onClose(), 100);
                        }}
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 group-hover:bg-orange-100 transition-colors mx-auto mb-3">
                          {brand.image ? (
                            <Image
                              src={brand.image.url}
                              alt={brand.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 text-center group-hover:text-orange-600 transition-colors line-clamp-2">
                          {highlightSearchTerm(brand.name || '', searchQuery)}
                        </h4>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-base font-medium text-gray-900 mb-1">Marka bulunamadı</p>
                    <p className="text-sm text-gray-500">"{searchQuery}" ile eşleşen marka bulunamadı</p>
                  </div>
                )}
              </div>
            </div>
          )}

        {activeTab === 'categories' && (
          <div className="p-4 bg-gray-50">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4 pl-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                </svg>
                <h3 className="text-base font-semibold text-gray-900">Kategoriler</h3>
                <span className="text-sm text-gray-500">({categories.length})</span>
              </div>
                
                <div className="space-y-1">
                  {searchQuery.length > 0 ? (
                    // Arama yapıldığında filtrelenmiş kategorileri göster
                    getFilteredCategories(categories, searchQuery).map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-orange-200 pl-4"
                        onClick={() => {
                          // Delay closing to allow navigation to complete
                          setTimeout(() => onClose(), 100);
                        }}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 group-hover:bg-orange-100 transition-colors">
                          {category.image ? (
                            <Image
                              src={category.image.url}
                              alt={category.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className={`text-base font-medium group-hover:text-orange-600 transition-colors ${category.isDirectMatch ? 'text-orange-600' : 'text-gray-900'}`}>
                            {highlightSearchTerm((category.name || '').trim(), searchQuery)}
                          </h4>
                          {category.children && category.children.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">{category.children.length} alt kategori</p>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))
                  ) : (
                    // Arama yapılmadığında tüm kategorileri göster
                    categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group border border-transparent hover:border-orange-200"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 group-hover:bg-orange-100 transition-colors">
                          {category.image ? (
                            <Image
                              src={category.image.url}
                              alt={category.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-base font-medium text-gray-900 group-hover:text-orange-600 transition-colors">{category.name || 'İsimsiz Kategori'}</h4>
                          {category.children && category.children.length > 0 && (
                            <p className="text-sm text-gray-500 mt-1">{category.children.length} alt kategori</p>
                          )}
                        </div>
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ))
                  )}
                </div>
                
                {/* Arama sonucu yoksa mesaj göster */}
                {searchQuery.length > 0 && (activeTab === 'categories' ? filteredCategories : getFilteredCategories(categories, searchQuery)).length === 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-base font-medium text-gray-900 mb-1">Kategori bulunamadı</p>
                    <p className="text-sm text-gray-500">"{searchQuery}" ile başlayan kategori bulunamadı</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Dropdown */}
      <div className="hidden md:block w-full bg-white shadow-lg rounded-b-lg overflow-hidden ring-2 ring-orange-500">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActiveTabChange && onActiveTabChange('general');
          }}
          data-search-tab="general"
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'general' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Genel Arama
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActiveTabChange && onActiveTabChange('brands');
          }}
          data-search-tab="brands"
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'brands' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Markalar
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onActiveTabChange && onActiveTabChange('categories');
          }}
          data-search-tab="categories"
          className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'categories' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Kategoriler
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
                    {activeTab === 'general' && (
              <div className="py-4 space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3 pl-4">Geçmiş Aramalar</h3>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded pl-4">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRecentSearchClick(search, e);
                        }}
                        className="flex items-center gap-2 flex-1 text-left hover:text-orange-500 transition-colors"
                      >
                        <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-700">{search}</span>
                      </button>
                      <button
                        data-search-action="remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          removeRecentSearch(search, e);
                        }}
                        className="text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Geçmişi Temizle Butonu - Desktop */}
                <div className="mt-3 pt-3 border-t border-gray-200 pl-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      clearAllRecentSearches(e);
                    }}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Geçmişi Temizle
                  </button>
                </div>
              </div>
            )}

            {/* Aranan Ürünler Grid */}
            {results.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Aranan Ürünler</h3>
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                  {results.slice(0, 8).map((result) => (
                    <Link 
                      key={result.id}
                      href={createProductUrl(result.slug)} 
                      className="border border-gray-200 rounded-lg p-3 bg-white hover:border-orange-500 transition-colors block"
                      onClick={() => {
                        addRecentSearch(result.name);
                      }}
                    >
                      <div className="relative mb-2">
                        {result.images && result.images[0] ? (
                          <Image
                            src={result.images[0].url}
                            alt={result.name}
                            width={80}
                            height={80}
                            className="w-full h-16 object-contain rounded"
                          />
                        ) : result.medias && result.medias[0] ? (
                          <Image
                            src={result.medias[0].url}
                            alt={result.name}
                            width={80}
                            height={80}
                            className="w-full h-16 object-contain rounded"
                          />
                        ) : (
                          <div className="w-full h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Resim Yok</span>
                          </div>
                        )}
                        {result.discount && (
                          <div className="absolute top-0 left-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                            %{result.discount}
                          </div>
                        )}
                      </div>
                      <h4 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        {result.name}
                      </h4>
                      {result.brand && (
                        <p className="text-xs text-gray-500 mb-1">{result.brand.name}</p>
                      )}
                      {result.rating && (
                        <div className="flex items-center gap-1 mb-1">
                          {renderStars(result.rating)}
                          <span className="text-xs text-gray-500">
                            ({result.reviewCount || 0})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900">
                          {result.price?.toLocaleString('tr-TR')} TL
                        </span>
                        {result.oldPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            {result.oldPrice.toLocaleString('tr-TR')} TL
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}



            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <p className="text-sm text-gray-500 mt-2">Aranıyor...</p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && results.length === 0 && searchQuery.length > 0 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">"{searchQuery}" için sonuç bulunamadı</p>
              </div>
            )}


          </div>
        )}

        {activeTab === 'brands' && (
          <div className="py-4">
            <div className="space-y-3">
              {brandsLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <p className="text-sm text-gray-500 mt-2">Markalar yükleniyor...</p>
                </div>
              ) : filteredBrands.length > 0 ? (
                filteredBrands.map((brand) => (
                  <Link
                    key={brand.id}
                    href={`/markalar/${brand.slug}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => {
                      addRecentSearch(brand.name);
                    }}
                  >
                    {brand.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={brand.image.url}
                          alt={brand.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {highlightSearchTerm(brand.name || '', searchQuery)}
                      </h4>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-gray-500">"{searchQuery}" ile eşleşen marka bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="py-4">
            <div className="space-y-3">
              {categoriesLoading ? (
                <div className="p-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                  <p className="text-sm text-gray-500 mt-2">Kategoriler yükleniyor...</p>
                </div>
              ) : searchQuery.length > 0 ? (
                // Arama yapıldığında filtrelenmiş kategorileri göster
                (activeTab === 'categories' ? filteredCategories : getFilteredCategories(categories, searchQuery)).map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => {
                      addRecentSearch(category.name);
                    }}
                  >
                    {category.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={category.image.url}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className={`text-sm font-medium ${category.isDirectMatch ? 'text-orange-600' : 'text-gray-900'}`}>
                        {highlightSearchTerm((category.name || '').trim(), searchQuery)}
                      </h4>
                      {category.children && category.children.length > 0 && (
                        <p className="text-xs text-gray-500">{category.children.length} alt kategori</p>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                // Arama yapılmadığında tüm kategorileri göster
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/${category.slug}`}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    {category.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={category.image.url}
                          alt={category.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{category.name || 'İsimsiz Kategori'}</h4>
                      {category.children && category.children.length > 0 && (
                        <p className="text-xs text-gray-500">{category.children.length} alt kategori</p>
                      )}
                    </div>
                  </Link>
                ))
              )}
              
              {/* Arama sonucu yoksa mesaj göster */}
              {searchQuery.length > 0 && getFilteredCategories(categories, searchQuery).length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500">"{searchQuery}" ile başlayan kategori bulunamadı</p>
                </div>
              )}
            </div>
          </div>
        )}

        </div>
      </div>
    </>
  );
}
