"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { Product } from '@/types/product';

interface SortOption {
  id: string;
  name: string;
  value: string;
}

interface SortOption {
  id: string;
  name: string;
  value: string;
}

interface SortingButtonProps {
  products?: Product[];
  onSortedProducts: (sortedProducts: Product[]) => void;
  sortOptions?: SortOption[]; // Yeni: Dinamik sıralama seçenekleri
  onSortChange?: (sortType: string) => void; // Yeni: Server-side sıralama için
  useServerSorting?: boolean; // Yeni: Server-side sıralama kullanılsın mı
  currentSortType?: string; // Yeni: Mevcut sıralama tipi
}

export default function SortingButton({ products = [], onSortedProducts, sortOptions, onSortChange, useServerSorting = false, currentSortType }: SortingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SortOption>({
    id: 'recommended',
    name: 'Önerilen',
    value: 'recommended'
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Backend'in desteklediği sıralama seçenekleri
  const defaultOptions: SortOption[] = [
    { id: 'recommended', name: 'Önerilen', value: 'recommended' },
    { id: 'price_asc', name: 'En düşük fiyat', value: 'price_asc' },
    { id: 'price_desc', name: 'En yüksek fiyat', value: 'price_desc' },
    { id: 'name_asc', name: 'A-Z', value: 'name_asc' },
    { id: 'name_desc', name: 'Z-A', value: 'name_desc' }
  ];

  const options = sortOptions && sortOptions.length > 0 ? sortOptions : defaultOptions;

  // currentSortType'a göre selected state'ini güncelle
  useEffect(() => {
    if (currentSortType) {
      const foundOption = options.find(opt => opt.value === currentSortType || opt.id === currentSortType);
      if (foundOption) {
        setSelected(foundOption);
      }
    }
  }, [currentSortType, options]);

  // Sıralama fonksiyonu
  const sortProducts = (productsToSort: Product[], sortType: string): Product[] => {
    if (!productsToSort || productsToSort.length === 0) {
      return [];
    }

    const sortedProducts = [...productsToSort];

    // Önce stok durumuna göre sırala (stokta olmayanlar üstte)
    const sortByStock = (a: Product, b: Product) => {
      const stockA = a.stock || 0;
      const stockB = b.stock || 0;
      
      // Stokta olmayan ürünler üstte
      if (stockA === 0 && stockB > 0) return -1;
      if (stockA > 0 && stockB === 0) return 1;
      
      // Her ikisi de stokta varsa veya her ikisi de stokta yoksa, normal sıralama yap
      return 0;
    };

    switch (sortType) {
      case 'price_asc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return a.price - b.price;
        });
      
      case 'price_desc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return b.price - a.price;
        });
      
      case 'name_asc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return (a.name || '').localeCompare(b.name || '');
        });
      
      case 'name_desc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          return (b.name || '').localeCompare(a.name || '');
        });
      
      case 'view_count_desc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          // view_count bilgisi olmadığı için rating'e göre sırala
          return (b.rating || 0) - (a.rating || 0);
        });
      
      case 'view_count_asc':
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          // view_count bilgisi olmadığı için rating'e göre sırala
          return (a.rating || 0) - (b.rating || 0);
        });
      
      case 'recommended':
      default:
        // Önerilen sıralama: Önce stok durumu, sonra fiyat ve kargo ücreti kombinasyonu
        return sortedProducts.sort((a, b) => {
          const stockComparison = sortByStock(a, b);
          if (stockComparison !== 0) return stockComparison;
          
          const shippingFeeA = a.seller?.shipping_policy?.general?.shipping_fee || 0;
          const shippingFeeB = b.seller?.shipping_policy?.general?.shipping_fee || 0;
          const scoreA = a.price + shippingFeeA;
          const scoreB = b.price + shippingFeeB;
          return scoreA - scoreB;
        });
    }
  };

  const handleSort = (option: SortOption) => {
    setSelected(option);
    setIsOpen(false);
    
    if (useServerSorting && onSortChange) {
      // Server-side sıralama kullan
      onSortChange(option.value);
    } else {
      // Client-side sıralama kullan (fallback)
      const sortedProducts = sortProducts(products, option.value);
      onSortedProducts(sortedProducts);
    }
  };

  // İlk yüklenmede ve products değiştiğinde sıralama yap (sadece client-side için)
  useEffect(() => {
    if (!useServerSorting && products && products.length > 0) {
      const initialSortedProducts = sortProducts(products, selected.value);
      onSortedProducts(initialSortedProducts);
    }
  }, [products, selected.value, onSortedProducts, useServerSorting]);

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-orange-200 transition-all min-w-[140px]"
      >
        <span className="text-black text-xs">{selected.name}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-500 group-hover:text-orange-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-1 w-full sm:w-64 bg-white border border-gray-100 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSort(option)}
                className={`
                  w-full px-4 py-2 text-left text-xs transition-colors
                  ${selected.id === option.id 
                    ? 'bg-orange-50 text-black' 
                    : 'text-black hover:bg-gray-50'}
                `}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}