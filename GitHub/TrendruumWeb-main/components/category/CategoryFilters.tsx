"use client";

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { 
  DynamicFilter,
  AttributeFilter,
  ColorFilter,
  GenderFilter,
  PriceFilter,
  StarFilter
} from '../filter';

interface FilterState {
  categories?: string[];
  brands?: string[];
  colors?: string[];
  genders?: string[];
  product_stars?: string[];
  sort_fields?: string;
  sort_types?: string;
  gender?: string;
  stars?: string;
  prices?: {
    min?: number;
    max?: number;
  };
  sizes?: string[];
  sellers?: string[];
  sellerTypes?: string[];
  selectedSubcategories?: string[];
}

interface CategoryFiltersProps {
  filters: FilterState;
  attributeFilters: Record<string, string[]>;
  filterVisibility: Record<string, boolean>;
  availableColors: any[];
  availableGenders: any[];
  categoryAttributes: any[];
  subCategories: any[];
  subCategoriesLoading: boolean;
  selectedSubcategories: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filterType: string, value: string, checked: boolean) => void;
  onAttributeFilterChange: (attributeSlug: string, value: string, checked: boolean) => void;
  onPriceChange: (priceRange: { min?: number; max?: number }) => void;
  onSubcategorySelection: (subcategorySlug: string, checked: boolean) => void;
  onSelectAllSubcategories: (selectAll: boolean) => void;
  onToggleFilterVisibility: (filterKey: string) => void;
  getSelectedValues: (filterType: string) => string[];
  getSelectedCount: (filterType: string) => number;
  category?: string;
  categoryData?: any;
  onApply?: () => void;
}

const VISIBLE_FILTER_COUNT = 8;
const FILTER_SECTION_ESTIMATED_HEIGHT = 62;

// Renk filtresi için arama özellikli bileşen
interface ColorFilterWithSearchProps {
  colors: Array<{ name: string; slug: string; count?: number; value?: string }>;
  selectedColors: string[];
  onColorChange: (color: string, checked: boolean) => void;
  isVisible: boolean;
  onToggle: () => void;
  selectedCount: number;
  getSelectedValues: (filterType: string) => string[];
  category?: string;
  categoryData?: any;
}

// Renk isimlerine göre renk değerlerini eşleştiren harita
const COLOR_MAP: Record<string, string> = {
  'Altın': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  'Bej': '#F5F5DC',
  'Beyaz': '#FFFFFF',
  'Bordo': '#800020',
  'Ekru': '#C19A6B',
  'Gri': '#808080',
  'Gümüş': 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
  'Haki': '#6B8E23',
  'Kahverengi': '#A52A2A',
  'Kırmızı': '#FF0000',
  'Lacivert': '#000080',
  'Mavi': '#0000FF',
  'Metalik': 'linear-gradient(135deg, #D4AF37 0%, #C9A961 50%, #B8860B 100%)',
  'Mor': '#800080',
  'Pembe': '#FFC0CB',
  'Sarı': '#FFFF00',
  'Siyah': '#000000',
  'Turkuaz': '#40E0D0',
  'Turuncu': '#FFA500',
  'Yeşil': '#008000',
  'Çok Renkli': 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
  'Krem': '#FFFDD0',
  // Küçük harf versiyonları
  'altın': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
  'bej': '#F5F5DC',
  'beyaz': '#FFFFFF',
  'bordo': '#800020',
  'ekru': '#C19A6B',
  'gri': '#808080',
  'gümüş': 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)',
  'haki': '#6B8E23',
  'kahverengi': '#A52A2A',
  'kırmızı': '#FF0000',
  'lacivert': '#000080',
  'mavi': '#0000FF',
  'metalik': 'linear-gradient(135deg, #D4AF37 0%, #C9A961 50%, #B8860B 100%)',
  'mor': '#800080',
  'pembe': '#FFC0CB',
  'sarı': '#FFFF00',
  'siyah': '#000000',
  'turkuaz': '#40E0D0',
  'turuncu': '#FFA500',
  'yeşil': '#008000',
  'çok renkli': 'linear-gradient(45deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #9400D3)',
  'krem': '#FFFDD0',
};

// Ayakkabı kategorisi için izin verilen renkler (whitelist)
const ALLOWED_SHOE_COLORS = [
  'Altın', 'altın',
  'Bej', 'bej',
  'Beyaz', 'beyaz',
  'Bordo', 'bordo',
  'Ekru', 'ekru',
  'Gri', 'gri',
  'Gümüş', 'gümüş',
  'Haki', 'haki',
  'Kahverengi', 'kahverengi',
  'Kırmızı', 'kırmızı',
  'Lacivert', 'lacivert',
  'Mavi', 'mavi',
  'Metalik', 'metalik',
  'Mor', 'mor',
  'Pembe', 'pembe',
  'Sarı', 'sarı',
  'Siyah', 'siyah',
  'Turkuaz', 'turkuaz',
  'Turuncu', 'turuncu',
  'Yeşil', 'yeşil',
  'Çok Renkli', 'çok renkli', 'Çok Renkli', 'ÇokRenkli', 'çokrenkli',
  'Krem', 'krem'
];

const getColorValue = (color: { name?: string; slug?: string; value?: string }): string => {
  // Önce API'den gelen value değerini kontrol et
  if (color.value) {
    return color.value;
  }
  // Sonra renk ismine göre haritadan bul
  const colorName = (color.name || color.slug || '').trim();
  return COLOR_MAP[colorName] || COLOR_MAP[colorName.toLowerCase()] || '#CCCCCC';
};

// Renk isminin izin verilen listede olup olmadığını kontrol et
const isAllowedShoeColor = (color: { name?: string; slug?: string }): boolean => {
  const colorName = (color.name || color.slug || '').trim();
  return ALLOWED_SHOE_COLORS.includes(colorName) || ALLOWED_SHOE_COLORS.includes(colorName.toLowerCase());
};

const ColorFilterWithSearch: React.FC<ColorFilterWithSearchProps> = ({
  colors,
  selectedColors,
  onColorChange,
  isVisible,
  onToggle,
  selectedCount,
  getSelectedValues,
  category,
  categoryData
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Ayakkabı kategorisi kontrolü (ana kategori ve tüm alt kategorileri dahil)
  const isAyakkabiCategory = useMemo(() => {
    if (!category) return false;
    const categorySlug = category.toLowerCase();
    
    // Direkt ayakkabı kategorisi kontrolü
    if (categorySlug === 'ayakkabi' || categorySlug === 'ayakkabı') return true;
    if (categorySlug.includes('ayakkabi') || categorySlug.includes('ayakkabı')) return true;
    
    // Breadcrumb'da "Ayakkabı" kontrolü
    if (categoryData?.breadcrumb && Array.isArray(categoryData.breadcrumb)) {
      const hasAyakkabiInBreadcrumb = categoryData.breadcrumb.some((item: any) => {
        const itemSlug = (item.slug || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        return itemSlug === 'ayakkabi' || itemSlug === 'ayakkabı' ||
               itemSlug.includes('ayakkabi') || itemSlug.includes('ayakkabı') ||
               itemName.includes('ayakkabı') || itemName.includes('ayakkabi');
      });
      if (hasAyakkabiInBreadcrumb) return true;
    }
    
    // Parent kontrolü (bir seviye yukarı)
    if (categoryData?.parent?.slug === 'ayakkabi' || categoryData?.parent?.slug === 'ayakkabı') return true;
    if (categoryData?.parent?.name?.toLowerCase().includes('ayakkabı') || 
        categoryData?.parent?.name?.toLowerCase().includes('ayakkabi')) return true;
    
    // Parent'ın parent'ı kontrolü (iki seviye yukarı - alt-alt kategoriler için)
    if (categoryData?.parent?.parent?.slug === 'ayakkabi' || categoryData?.parent?.parent?.slug === 'ayakkabı') return true;
    if (categoryData?.parent?.parent?.name?.toLowerCase().includes('ayakkabı') || 
        categoryData?.parent?.parent?.name?.toLowerCase().includes('ayakkabi')) return true;
    
    // Parent slug'ında ayakkabı kontrolü (alt kategoriler için)
    const parentSlug = categoryData?.parent?.slug?.toLowerCase() || '';
    if (parentSlug.includes('ayakkabi') || parentSlug.includes('ayakkabı')) return true;
    
    // Kategori verisinde parent hiyerarşisini kontrol et
    let currentParent = categoryData?.parent;
    while (currentParent) {
      const parentSlugLower = (currentParent.slug || '').toLowerCase();
      const parentNameLower = (currentParent.name || '').toLowerCase();
      if (parentSlugLower === 'ayakkabi' || parentSlugLower === 'ayakkabı' ||
          parentSlugLower.includes('ayakkabi') || parentSlugLower.includes('ayakkabı') ||
          parentNameLower.includes('ayakkabı') || parentNameLower.includes('ayakkabi')) {
        return true;
      }
      currentParent = currentParent.parent;
    }
    
    // Ayakkabı ile ilgili kategori slug'ları kontrolü (bot, cizme, sandalet, terlik, vs.)
    const shoeRelatedSlugs = ['bot', 'cizme', 'sandalet', 'terlik', 'sneaker', 'babet', 'loafer', 'topuklu', 'spor-ayakkabi'];
    if (shoeRelatedSlugs.some(slug => categorySlug.includes(slug))) {
      return true;
    }
    
    return false;
  }, [category, categoryData]);

  // Giyim kategorisi kontrolü (ana kategori ve tüm alt kategorileri dahil)
  const isGiyimCategory = useMemo(() => {
    if (!category) return false;
    const categorySlug = category.toLowerCase();
    
    // Direkt giyim kategorisi kontrolü
    if (categorySlug === 'giyim') return true;
    if (categorySlug.includes('giyim')) return true;
    
    // Breadcrumb'da "Giyim" kontrolü
    if (categoryData?.breadcrumb && Array.isArray(categoryData.breadcrumb)) {
      const hasGiyimInBreadcrumb = categoryData.breadcrumb.some((item: any) => {
        const itemSlug = (item.slug || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        return itemSlug === 'giyim' || itemSlug.includes('giyim') ||
               itemName.includes('giyim');
      });
      if (hasGiyimInBreadcrumb) return true;
    }
    
    // Parent kontrolü (bir seviye yukarı)
    if (categoryData?.parent?.slug === 'giyim') return true;
    if (categoryData?.parent?.name?.toLowerCase().includes('giyim')) return true;
    
    // Parent'ın parent'ı kontrolü (iki seviye yukarı - alt-alt kategoriler için)
    if (categoryData?.parent?.parent?.slug === 'giyim') return true;
    if (categoryData?.parent?.parent?.name?.toLowerCase().includes('giyim')) return true;
    
    // Parent slug'ında giyim kontrolü (alt kategoriler için)
    const parentSlug = categoryData?.parent?.slug?.toLowerCase() || '';
    if (parentSlug.includes('giyim')) return true;
    
    // Kategori verisinde parent hiyerarşisini kontrol et
    let currentParent = categoryData?.parent;
    while (currentParent) {
      const parentSlugLower = (currentParent.slug || '').toLowerCase();
      const parentNameLower = (currentParent.name || '').toLowerCase();
      if (parentSlugLower === 'giyim' || parentSlugLower.includes('giyim') ||
          parentNameLower.includes('giyim')) {
        return true;
      }
      currentParent = currentParent.parent;
    }
    
    return false;
  }, [category, categoryData]);

  // Arama sorgusuna göre filtrele
  const filteredColors = useMemo(() => {
    let filtered = colors;
    
    // Ayakkabı kategorisinde sadece izin verilen renkleri göster
    if (isAyakkabiCategory) {
      filtered = filtered.filter(isAllowedShoeColor);
    }
    
    // "Çok Renkli" rengini en sona taşı (Ayakkabı ve Giyim için)
    if (isAyakkabiCategory || isGiyimCategory) {
      filtered = filtered.sort((a, b) => {
        const aName = (a.name || a.slug || '').toLowerCase();
        const bName = (b.name || b.slug || '').toLowerCase();
        
        // "çok renkli" veya benzeri ise en sona
        const aIsMultiColor = aName.includes('çok') || aName.includes('renkli') || aName.includes('multi');
        const bIsMultiColor = bName.includes('çok') || bName.includes('renkli') || bName.includes('multi');
        
        if (aIsMultiColor && !bIsMultiColor) return 1;
        if (!aIsMultiColor && bIsMultiColor) return -1;
        
        // Diğer renkleri alfabetik sırala
        return aName.localeCompare(bName, 'tr');
      });
    }
    
    // Arama sorgusu varsa filtrele
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((color) => {
        const name = String(color.name || color.slug || '').toLowerCase();
        return name.includes(query);
      });
    }
    
    return filtered;
  }, [colors, searchQuery, isAyakkabiCategory]);

  const selectedValuesDisplay = getSelectedValues('colors');

  // Tüm kategoriler için beden filtresi gibi liste görünümü (renk daireleri olmadan)
  return (
    <DynamicFilter
      title="Renk"
      isVisible={isVisible}
      onToggle={onToggle}
      selectedValues={selectedValuesDisplay}
      selectedCount={selectedCount}
    >
      <div className="space-y-2">
        {/* Arama alanı */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Renk ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Filtrelenmiş renk listesi */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredColors.length > 0 ? (
            filteredColors.map((color, index) => (
              <label
                key={`color-${color.slug}-${index}`}
                className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color.slug)}
                  onChange={(e) => onColorChange(color.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{color.name || color.slug}</span>
                {color.count !== undefined && (
                  <span className="text-xs text-gray-500">({color.count})</span>
                )}
              </label>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              Arama sonucu bulunamadı
            </div>
          )}
        </div>
      </div>
    </DynamicFilter>
  );
};

// Beden filtresi için arama özellikli bileşen
interface BedenFilterWithSearchProps {
  bedenVariant: {
    name: string;
    slug: string;
    values: Array<{ name: string; slug: string; count?: number }>;
  };
  selectedValues: string[];
  onValueChange: (value: string, checked: boolean) => void;
  isVisible: boolean;
  onToggle: () => void;
  selectedCount: number;
}

const BedenFilterWithSearch: React.FC<BedenFilterWithSearchProps> = ({
  bedenVariant,
  selectedValues,
  onValueChange,
  isVisible,
  onToggle,
  selectedCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Arama sorgusuna göre filtrele
  const filteredValues = useMemo(() => {
    if (!searchQuery.trim()) {
      return bedenVariant.values;
    }
    const query = searchQuery.toLowerCase().trim();
    return bedenVariant.values.filter((value) => {
      const name = String(value.name || value.slug || '').toLowerCase();
      return name.includes(query);
    });
  }, [bedenVariant.values, searchQuery]);

  const selectedValuesDisplay = selectedValues.map((slug: string) => {
    const value = bedenVariant.values?.find((v: any) => v.slug === slug);
    return value?.name || slug;
  });

  return (
    <DynamicFilter
      title={bedenVariant.name || 'Beden'}
      isVisible={isVisible}
      onToggle={onToggle}
      selectedValues={selectedValuesDisplay}
      selectedCount={selectedCount}
    >
      <div className="space-y-2">
        {/* Arama alanı */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Beden ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        {/* Filtrelenmiş beden listesi */}
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {filteredValues.length > 0 ? (
            filteredValues.map((value, index) => (
              <label
                key={`${bedenVariant.slug}-${value.slug}-${index}`}
                className="flex items-center space-x-2 cursor-pointer p-1 hover:bg-gray-50 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value.slug)}
                  onChange={(e) => onValueChange(value.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{value.name || value.slug}</span>
                {value.count !== undefined && (
                  <span className="text-xs text-gray-500">({value.count})</span>
                )}
              </label>
            ))
          ) : (
            <div className="text-center py-4 text-sm text-gray-500">
              Arama sonucu bulunamadı
            </div>
          )}
        </div>
      </div>
    </DynamicFilter>
  );
};

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  filters,
  attributeFilters,
  filterVisibility,
  availableColors,
  availableGenders,
  categoryAttributes,
  subCategories,
  subCategoriesLoading,
  selectedSubcategories,
  priceRange,
  onFilterChange,
  onAttributeFilterChange,
  onPriceChange,
  onSubcategorySelection,
  onSelectAllSubcategories,
  onToggleFilterVisibility,
  getSelectedValues,
  getSelectedCount,
  category,
  categoryData,
  onApply
}) => {
  const filterSections: React.ReactNode[] = [];

  // Ayakkabı kategorisi kontrolü (her zaman çağrılmalı - hook sırası için)
  const isAyakkabiCategory = useMemo(() => {
    if (!category) return false;
    const categorySlug = category.toLowerCase();
    
    // Direkt ayakkabı kategorisi kontrolü
    if (categorySlug === 'ayakkabi' || categorySlug === 'ayakkabı') return true;
    if (categorySlug.includes('ayakkabi') || categorySlug.includes('ayakkabı')) return true;
    
    // Breadcrumb'da "Ayakkabı" kontrolü
    if (categoryData?.breadcrumb && Array.isArray(categoryData.breadcrumb)) {
      const hasAyakkabiInBreadcrumb = categoryData.breadcrumb.some((item: any) => {
        const itemSlug = (item.slug || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        return itemSlug === 'ayakkabi' || itemSlug === 'ayakkabı' ||
               itemSlug.includes('ayakkabi') || itemSlug.includes('ayakkabı') ||
               itemName.includes('ayakkabı') || itemName.includes('ayakkabi');
      });
      if (hasAyakkabiInBreadcrumb) return true;
    }
    
    // Parent kontrolü (bir seviye yukarı)
    if (categoryData?.parent?.slug === 'ayakkabi' || categoryData?.parent?.slug === 'ayakkabı') return true;
    if (categoryData?.parent?.name?.toLowerCase().includes('ayakkabı') || 
        categoryData?.parent?.name?.toLowerCase().includes('ayakkabi')) return true;
    
    // Parent'ın parent'ı kontrolü (iki seviye yukarı - alt-alt kategoriler için)
    if (categoryData?.parent?.parent?.slug === 'ayakkabi' || categoryData?.parent?.parent?.slug === 'ayakkabı') return true;
    if (categoryData?.parent?.parent?.name?.toLowerCase().includes('ayakkabı') || 
        categoryData?.parent?.parent?.name?.toLowerCase().includes('ayakkabi')) return true;
    
    // Parent slug'ında ayakkabı kontrolü (alt kategoriler için)
    const parentSlug = categoryData?.parent?.slug?.toLowerCase() || '';
    if (parentSlug.includes('ayakkabi') || parentSlug.includes('ayakkabı')) return true;
    
    // Kategori verisinde parent hiyerarşisini kontrol et
    let currentParent = categoryData?.parent;
    while (currentParent) {
      const parentSlugLower = (currentParent.slug || '').toLowerCase();
      const parentNameLower = (currentParent.name || '').toLowerCase();
      if (parentSlugLower === 'ayakkabi' || parentSlugLower === 'ayakkabı' ||
          parentSlugLower.includes('ayakkabi') || parentSlugLower.includes('ayakkabı') ||
          parentNameLower.includes('ayakkabı') || parentNameLower.includes('ayakkabi')) {
        return true;
      }
      currentParent = currentParent.parent;
    }
    
    // Ayakkabı ile ilgili kategori slug'ları kontrolü (bot, cizme, sandalet, terlik, vs.)
    const shoeRelatedSlugs = ['bot', 'cizme', 'sandalet', 'terlik', 'sneaker', 'babet', 'loafer', 'topuklu', 'spor-ayakkabi'];
    if (shoeRelatedSlugs.some(slug => categorySlug.includes(slug))) {
      return true;
    }
    
    return false;
  }, [category, categoryData]);

  // Giyim kategorisi kontrolü (her zaman çağrılmalı - hook sırası için)
  const isGiyimCategory = useMemo(() => {
    if (!category) return false;
    const categorySlug = category.toLowerCase();
    
    // Direkt giyim kategorisi kontrolü
    if (categorySlug === 'giyim') return true;
    if (categorySlug.includes('giyim')) return true;
    
    // Breadcrumb'da "Giyim" kontrolü
    if (categoryData?.breadcrumb && Array.isArray(categoryData.breadcrumb)) {
      const hasGiyimInBreadcrumb = categoryData.breadcrumb.some((item: any) => {
        const itemSlug = (item.slug || '').toLowerCase();
        const itemName = (item.name || '').toLowerCase();
        return itemSlug === 'giyim' || itemSlug.includes('giyim') ||
               itemName.includes('giyim');
      });
      if (hasGiyimInBreadcrumb) return true;
    }
    
    // Parent kontrolü (bir seviye yukarı)
    if (categoryData?.parent?.slug === 'giyim') return true;
    if (categoryData?.parent?.name?.toLowerCase().includes('giyim')) return true;
    
    // Parent'ın parent'ı kontrolü (iki seviye yukarı - alt-alt kategoriler için)
    if (categoryData?.parent?.parent?.slug === 'giyim') return true;
    if (categoryData?.parent?.parent?.name?.toLowerCase().includes('giyim')) return true;
    
    // Parent slug'ında giyim kontrolü (alt kategoriler için)
    const parentSlug = categoryData?.parent?.slug?.toLowerCase() || '';
    if (parentSlug.includes('giyim')) return true;
    
    // Kategori verisinde parent hiyerarşisini kontrol et
    let currentParent = categoryData?.parent;
    while (currentParent) {
      const parentSlugLower = (currentParent.slug || '').toLowerCase();
      const parentNameLower = (currentParent.name || '').toLowerCase();
      if (parentSlugLower === 'giyim' || parentSlugLower.includes('giyim') ||
          parentNameLower.includes('giyim')) {
        return true;
      }
      currentParent = currentParent.parent;
    }
    
    return false;
  }, [category, categoryData]);

  // Renk filtresini dinamik olarak categoryAttributes'tan bul (endpoint'e göre)
  const effectiveColors = useMemo(() => {
    // Önce variants içinde renk ara (öncelikli - endpoint'te variants içinde)
    const colorVariant = categoryAttributes.find((attr: any) => {
      if (attr.slug !== 'renk') return false;
      // Type variant ise veya usage_key v_renk veya v_ ile başlıyorsa variant'tır
      if (attr.type === 'variant' || attr.usage_key === 'v_renk' || attr.usage_key?.startsWith('v_')) {
        return attr.values && attr.values.length > 0;
      }
      return false;
    });
    
    // Variant bulunamadıysa attribute'lardan ara (web-color gibi)
    const colorAttribute = categoryAttributes.find((attr: any) => {
      if (attr.slug !== 'renk' && attr.slug !== 'web-color') return false;
      // Type attribute ise veya usage_key a_ ile başlıyorsa attribute'tur
      if (attr.type === 'attribute' || attr.usage_key?.startsWith('a_')) {
        return attr.values && attr.values.length > 0;
      }
      // Type yoksa ama slug renk veya web-color ise kabul et
      if (!attr.type && (attr.slug === 'renk' || attr.slug === 'web-color')) {
        return attr.values && attr.values.length > 0;
      }
      return false;
    });
    
    // Önce variant, sonra attribute kullan (variants öncelikli)
    const selectedColorFilter = colorVariant || colorAttribute;
    
    if (selectedColorFilter?.values) {
      return selectedColorFilter.values.filter((color: any) => color?.name && color?.slug);
    }
    
    // Eğer categoryAttributes'tan bulunamadıysa, availableColors prop'unu kullan (fallback)
    if (availableColors && availableColors.length > 0) {
      return availableColors;
    }
    
    return [];
  }, [categoryAttributes, availableColors]);

  // Beden varyantını bul (her zaman çağrılmalı - hook sırası için)
  // Hem variant hem de attribute olabilir, önce variant kontrolü yap
  const bedenVariant = categoryAttributes.find(attr => {
    // Slug kontrolü
    if (attr.slug !== 'beden') return false;
    // Değerler var mı kontrol et
    if (!attr.values || attr.values.length === 0) return false;
    
    // Type kontrolü - variant ise direkt kabul et
    if (attr.type === 'variant') return true;
    
    // Usage key kontrolü - v_beden veya v_ ile başlıyorsa variant'tır
    if (attr.usage_key === 'v_beden' || attr.usage_key?.startsWith('v_')) return true;
    
    // Type yoksa ama values varsa da kabul et (fallback - tüm beden slug'larını kabul et)
    return true;
  });

  // Değer listesine bakarak ayakkabı bedenine benziyor mu kontrolü (her zaman çağrılmalı - hook sırası için)
  const hasShoeLikeValues = useMemo(() => {
    if (!bedenVariant?.values || bedenVariant.values.length === 0) return false;
    const numericPattern = /^(\d{1,2}([.,]\d)?|\d{1,2}-\d{1,2}|\d{1,2}\s+\d\/\d|Tek\s+Ebat)/i;
    return bedenVariant.values.some((v: any) => numericPattern.test(String(v.name || v.slug || '').trim()));
  }, [bedenVariant]);

  // Aksesuar kategorisi kontrolü (her zaman çağrılmalı - hook sırası için)
  const isAksesuarCategory = useMemo(() => {
    if (!category) return false;
    const categorySlug = category.toLowerCase();
    // Direkt aksesuar kategorisi
    if (categorySlug === 'aksesuar' || categorySlug === 'aksesuarlar') return true;
    // Alt kategoriler: slug'da 'aksesuar' geçiyorsa
    if (categorySlug.includes('aksesuar')) return true;
    // Bilinen aksesuar alt kategorileri
    const aksesuarSubCategories = ['saat', 'takı', 'canta', 'çanta', 'gözlük', 'şapka', 'eldiven', 'atkı', 'kemer', 'kolye', 'küpe', 'yüzük', 'bilezik'];
    if (aksesuarSubCategories.includes(categorySlug)) return true;
    // categoryData'dan parent kontrolü
    if (categoryData?.parent?.slug === 'aksesuar' || categoryData?.parent?.slug === 'aksesuarlar') return true;
    if (categoryData?.parent?.name?.toLowerCase().includes('aksesuar')) return true;
    // categoryData'dan kategori adı kontrolü
    if (categoryData?.name?.toLowerCase().includes('aksesuar')) return true;
    return false;
  }, [category, categoryData]);

  filterSections.push(
    <DynamicFilter
      key="subcategories"
      title="Alt Kategoriler"
      isVisible={filterVisibility.altKategori ?? false}
      onToggle={() => onToggleFilterVisibility('altKategori')}
      selectedValues={getSelectedValues('subcategories')}
      selectedCount={getSelectedCount('subcategories')}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Alt Kategorileri Seçin</span>
          <button
            onClick={() => onSelectAllSubcategories(selectedSubcategories.length < subCategories.length)}
            className="text-xs text-orange-500 hover:underline"
          >
            {selectedSubcategories.length < subCategories.length ? 'Tümünü Seç' : 'Tümünü Kaldır'}
          </button>
        </div>
        
        {subCategoriesLoading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-gray-600 text-sm">Yükleniyor...</span>
          </div>
        ) : subCategories.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {subCategories.map((subCategory, index) => (
              <label key={`subcategory-${subCategory.slug}-${index}`} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors">
                <input
                  type="checkbox"
                  checked={selectedSubcategories.includes(subCategory.slug) || false}
                  onChange={(e) => onSubcategorySelection(subCategory.slug, e.target.checked)}
                  className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 checked:bg-orange-500 checked:border-orange-500 hover:border-orange-400 transition-colors [&:checked]:accent-orange-500"
                />
                <span className="text-sm text-gray-700 flex-1">{subCategory.name}</span>
                {subCategory.product_count > 0 && (
                  <span className="text-xs text-gray-500">({subCategory.product_count})</span>
                )}
              </label>
            ))}
          </div>
        ) : (
          <div className="p-3 text-center text-gray-500 text-sm">
            Bu kategoride alt kategori bulunamadı.
          </div>
        )}
        
        {selectedSubcategories.length > 0 && (
          <div className="mt-3 p-2 bg-orange-50 rounded-lg">
            <div className="text-xs text-orange-700">
              <strong>{selectedSubcategories.length}</strong> alt kategori seçildi
            </div>
          </div>
        )}
      </div>
    </DynamicFilter>
  );

  if (effectiveColors.length > 0) {
    filterSections.push(
      <ColorFilterWithSearch
        key="color"
        colors={effectiveColors}
        selectedColors={filters.colors || []}
        onColorChange={(color, checked) => onFilterChange('colors', color, checked)}
        isVisible={filterVisibility.renk ?? false}
        onToggle={() => onToggleFilterVisibility('renk')}
        selectedCount={getSelectedCount('colors')}
        getSelectedValues={getSelectedValues}
        category={category}
        categoryData={categoryData}
      />
    );
  }

  // Beden varyantını renk'in altında göster
  if (bedenVariant) {
    // Ayakkabı (ve alt kategorileri) için kontrol + değer bazlı kontrol
    let filteredBedenValues = bedenVariant.values;
    
    // isAyakkabiCategory, hasShoeLikeValues, isAksesuarCategory zaten yukarıda tanımlı (hook sırası için)

    // Aksesuar kategorisi için özel beden listesi
    if (isAksesuarCategory) {
      const aksesuarSizes = [
        // Harf bedenleri
        'XS', 'S', 'M', 'L', 'XL', '2XL',
        // Harf aralıkları
        'XS-S', 'S-M', 'M-L', 'L-XL', '3XL–4XL',
        // Harf kombinasyonları
        'S+M+L', 'S+M+L+XL',
        // Sayısal bedenler
        '0', '1', '2', '3', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '40', '42', '45', '50', '55', '58', '60', '65', '70', '85', '90', '95', '100', '105', '110', '115', '120', '125', '130',
        // Sayısal aralıklar
        '16–17', '17–18', '20–21', '40–45',
        // Özel formatlar
        '38/31', '0 Ay', '0–6 Ay', '6–18 Ay', '0–1 Yaş', '1–3 Yaş', '1–4 Yaş', '2 Yaş', '3–6 Yaş', '4–8 Yaş',
        // Yazılar
        'Tek Ebat', 'Standart', 'Büyük Boy', 'Orta Boy', 'Battal Standart', 'Kabin',
        // CM formatları
        '15 cm', '16 cm', '17 cm', '18 cm', '18–19 cm', '19 cm', '20 cm', '21 cm', '22 cm', '24 cm', '35 cm', '38 cm', '40 cm', '42 cm', '45 cm', '46 cm', '48 cm', '50 cm', '55 cm', '60 cm', '65 cm', '70 cm', '75 cm', '80 cm', '90 cm', '100 cm', '105 cm', '110 cm', '115 cm', '120 cm', '125 cm', '130 cm', '135 cm', '43 cm',
        // Boyut formatları
        '34 × 39', '35 × 40', '80 × 270',
        // MM formatları
        '6 mm', '7 mm', '8 mm', '10 mm',
        // Gr formatları
        '14 Gr',
        // Diğer
        '1 M', 'N', 'U', 'Yüksek Direnç', 'Set', 'Universal', '18–21 cm', '23 cm', 'AA', 'Ayarlanabilir', '57–58', '16–17', '18–19', '#1 120–100', '20–21'
      ];

      filteredBedenValues = bedenVariant.values.filter((value: any) => {
        const name = String(value.name || '').trim();
        return aksesuarSizes.some(allowedSize => 
          name.toLowerCase() === allowedSize.toLowerCase() ||
          name === allowedSize
        );
      });

      // Aksesuar bedenleri için özel sıralama
      filteredBedenValues.sort((a: any, b: any) => {
        const nameA = String(a.name || '').trim();
        const nameB = String(b.name || '').trim();

        const getAksesuarCategory = (name: string): number => {
          // Yazılar (en son)
          if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/i.test(name) && !name.includes('cm') && !name.includes('mm') && !name.includes('Gr') && !name.includes('M') && !name.includes('×')) return 6;
          // Özel formatlar (#1 120–100 gibi)
          if (/^#/.test(name)) return 5;
          // Boyut formatları (34 × 39 gibi)
          if (/\d+\s*×\s*\d+/.test(name)) return 4;
          // CM/MM/Gr formatları
          if (/\d+\s*(cm|mm|Gr)/i.test(name)) return 3;
          // Aralıklar (16–17, 0–6 Ay gibi)
          if (/\d+[–-]\d+/.test(name) || /\d+\s*[–-]\s*\d+\s*(cm|Ay|Yaş)/i.test(name)) return 2;
          // Harf bedenleri ve kombinasyonları
          if (/^[A-Z]/.test(name) || /^[A-Z]\+/.test(name)) return 1;
          // Sayısal bedenler (en önce)
          if (/^\d+$/.test(name)) return 0;
          return 7; // Diğerleri
        };

        const categoryA = getAksesuarCategory(nameA);
        const categoryB = getAksesuarCategory(nameB);

        if (categoryA !== categoryB) {
          return categoryA - categoryB;
        }

        // Aynı kategorideyse değere göre sırala
        if (categoryA === 0) {
          // Tek sayılar: sayısal sıralama
          return parseInt(nameA) - parseInt(nameB);
        } else if (categoryA === 1) {
          // Harf bedenleri: alfabetik sıralama
          return nameA.localeCompare(nameB, 'tr');
        } else if (categoryA === 2) {
          // Aralıklar: ilk sayıya göre sıralama
          const numA = parseInt(nameA.split(/[–-]/)[0]);
          const numB = parseInt(nameB.split(/[–-]/)[0]);
          return numA - numB;
        } else if (categoryA === 3) {
          // CM/MM/Gr: sayıya göre sıralama
          const numA = parseFloat(nameA.replace(/[^\d.,]/g, '').replace(',', '.'));
          const numB = parseFloat(nameB.replace(/[^\d.,]/g, '').replace(',', '.'));
          return numA - numB;
        } else {
          // Diğerleri: alfabetik sıralama
          return nameA.localeCompare(nameB, 'tr');
        }
      });
    }
    // Ayakkabı kategorisi için whitelist uygula (hasShoeLikeValues sadece ayakkabı kategorisi için kullanılmalı)
    // Ama giyim kategorilerinde hasShoeLikeValues kontrolünü kullanma (giyim bedenleri sayısal olabilir)
    else if (isAyakkabiCategory || (hasShoeLikeValues && !isGiyimCategory)) {
      // İzin verilen beden listesi (görsellerden çıkarılan - tam liste)
      const allowedSizes = [
        // Tek sayılar 17-48
        '17', '18', '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '32', '33', '34',
        '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48',
        // Yarım bedenler (Türkçe virgül ile)
        '31,5', '33,5', '35,5', '36,5', '37,5', '38,5', '39,5', '40,5', '41,5', '42,5', '43,5', '44,5', '45,5', '46,5', '47,5',
        // Aralıklar (22-23'ten başlayarak)
        '22-23', '23-24', '24-25', '25-26', '26-27', '27-28', '28-29', '29-30', '30-31', '32-33',
        '34-35', '35-36', '36-37', '37-38', '38-39', '39-40', '40-41', '41-42', '42-43',
        // Özel formatlar (1/3, 2/3, 1/2)
        '36 2/3', '37 1/3', '38 2/3', '39 1/3', '40 2/3', '41 1/2', '41 1/3', '42 2/3', '43 1/3', '44 2/3', '45 1/3',
        // Yazılar
        '5 Yaş', 'Tek Ebat'
      ];

      filteredBedenValues = bedenVariant.values.filter((value: any) => {
        const name = String(value.name || '').trim();
        // İzin verilen listede var mı kontrol et (büyük/küçük harf duyarsız)
        return allowedSizes.some(allowedSize => 
          name.toLowerCase() === allowedSize.toLowerCase() ||
          name === allowedSize
        );
      });

      // Sıralama: Önce tek sayılar, sonra yarım bedenler, sonra aralıklar, sonra özel formatlar, en son yazılar
      filteredBedenValues.sort((a: any, b: any) => {
        const nameA = String(a.name || '').trim();
        const nameB = String(b.name || '').trim();

        // Sıralama kategorileri belirle (görsellerdeki sıraya göre)
        const getCategory = (name: string): number => {
          // Yazılar (en son: Tek Ebat, 5 Yaş gibi)
          if (/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/i.test(name)) return 5;
          // Özel formatlar (36 2/3, 37 1/3 gibi) - aralıklardan sonra
          if (/\d+\s+\d\/\d/.test(name)) return 4;
          // Aralıklar (22-23, 35-36 gibi) - yarım bedenlerden sonra
          if (/\d+-\d+/.test(name)) return 3;
          // Yarım bedenler (31,5, 35,5 gibi) - tek sayılardan sonra
          if (/^\d+[,.]\d+$/.test(name)) return 2;
          // Tek sayılar (en önce: 17, 18, 19... 48)
          if (/^\d+$/.test(name)) return 1;
          return 6; // Diğerleri
        };

        const categoryA = getCategory(nameA);
        const categoryB = getCategory(nameB);

        // Önce kategoriye göre sırala
        if (categoryA !== categoryB) {
          return categoryA - categoryB;
        }

        // Aynı kategorideyse değere göre sırala
        if (categoryA === 1) {
          // Tek sayılar: sayısal sıralama (17, 18, 19... 48)
          return parseInt(nameA) - parseInt(nameB);
        } else if (categoryA === 2) {
          // Yarım bedenler: sayısal sıralama (31,5, 33,5, 35,5... 47,5)
          const numA = parseFloat(nameA.replace(',', '.'));
          const numB = parseFloat(nameB.replace(',', '.'));
          return numA - numB;
        } else if (categoryA === 3) {
          // Aralıklar: ilk sayıya göre sıralama (22-23, 23-24... 42-43)
          const numA = parseInt(nameA.split('-')[0]);
          const numB = parseInt(nameB.split('-')[0]);
          if (numA !== numB) return numA - numB;
          // İlk sayı aynıysa ikinci sayıya göre sırala
          const numA2 = parseInt(nameA.split('-')[1]);
          const numB2 = parseInt(nameB.split('-')[1]);
          return numA2 - numB2;
        } else if (categoryA === 4) {
          // Özel formatlar: sayıya göre sıralama (36 2/3, 37 1/3... 45 1/3)
          const numA = parseInt(nameA.split(' ')[0]);
          const numB = parseInt(nameB.split(' ')[0]);
          if (numA !== numB) return numA - numB;
          // Sayı aynıysa kesire göre sırala (1/3 < 2/3)
          const fractionA = nameA.split(' ')[1] || '';
          const fractionB = nameB.split(' ')[1] || '';
          return fractionA.localeCompare(fractionB);
        } else {
          // Yazılar: alfabetik sıralama (Tek Ebat, 5 Yaş gibi)
          return nameA.localeCompare(nameB, 'tr');
        }
      });
    }
    // Diğer kategoriler için (giyim gibi) - tüm bedenleri göster, sadece sırala
    else {
      // Giyim kategorisi için bedenleri sırala (XS, S, M, L, XL, 2XL, S/M, M/L vb.)
      filteredBedenValues.sort((a: any, b: any) => {
        const nameA = String(a.name || a.slug || '').trim();
        const nameB = String(b.name || b.slug || '').trim();
        
        // Sayısal bedenler (36, 38, 40 gibi)
        const isNumericA = /^\d+$/.test(nameA);
        const isNumericB = /^\d+$/.test(nameB);
        
        if (isNumericA && isNumericB) {
          return parseInt(nameA) - parseInt(nameB);
        }
        if (isNumericA) return -1;
        if (isNumericB) return 1;
        
        // Harf bedenleri için özel sıralama
        const sizeOrder: Record<string, number> = {
          'xxs': 0, 'xs': 1, 's': 2, 'm': 3, 'l': 4, 'xl': 5, '2xl': 6, 'xxl': 6, '3xl': 7, '4xl': 8
        };
        
        const sizeA = sizeOrder[nameA.toLowerCase()] ?? 999;
        const sizeB = sizeOrder[nameB.toLowerCase()] ?? 999;
        
        if (sizeA !== 999 || sizeB !== 999) {
          if (sizeA !== sizeB) return sizeA - sizeB;
        }
        
        // Aralıklar için (S/M, M/L, XL/2XL gibi)
        if (nameA.includes('/') && nameB.includes('/')) {
          return nameA.localeCompare(nameB, 'tr');
        }
        
        // Diğerleri alfabetik
        return nameA.localeCompare(nameB, 'tr');
      });
    }

    // Filtrelenmiş değerler varsa göster
    if (filteredBedenValues.length > 0) {
      const filteredBedenVariant = {
        ...bedenVariant,
        values: filteredBedenValues
      };

      filterSections.push(
        <BedenFilterWithSearch
          key="beden"
          bedenVariant={filteredBedenVariant}
          selectedValues={attributeFilters['beden'] || []}
          onValueChange={(value, checked) => onAttributeFilterChange('beden', value, checked)}
          isVisible={filterVisibility.beden ?? false}
          onToggle={() => onToggleFilterVisibility('beden')}
          selectedCount={attributeFilters['beden']?.length || 0}
        />
      );
    }
  }

  if (categoryAttributes.some(attr => attr.slug === 'cinsiyet')) {
    filterSections.push(
      <DynamicFilter
        key="gender"
        title="Cinsiyet"
        isVisible={filterVisibility.cinsiyet ?? false}
        onToggle={() => onToggleFilterVisibility('cinsiyet')}
        selectedValues={getSelectedValues('genders')}
        selectedCount={getSelectedCount('genders')}
      >
        <GenderFilter
          genders={availableGenders}
          selectedGenders={filters.genders || []}
          onGenderChange={(gender, checked) => onFilterChange('genders', gender, checked)}
        />
      </DynamicFilter>
    );
  }

  filterSections.push(
    <DynamicFilter
      key="price"
      title="Fiyat"
      isVisible={filterVisibility.fiyat ?? false}
      onToggle={() => onToggleFilterVisibility('fiyat')}
      selectedValues={
        typeof filters.prices?.min === 'number' || typeof filters.prices?.max === 'number'
          ? [
              filters.prices.min ? `${filters.prices.min} TL` : '',
              filters.prices.max ? `${filters.prices.max} TL` : ''
            ].filter(Boolean)
          : []
      }
      selectedCount={
        typeof filters.prices?.min === 'number' || typeof filters.prices?.max === 'number' ? 1 : 0
      }
    >
      <PriceFilter
        isVisible={filterVisibility.fiyat ?? false}
        onToggle={() => onToggleFilterVisibility('fiyat')}
        priceRange={priceRange}
        filters={filters}
        onFilterChange={onPriceChange}
        onApply={onApply}
      />
    </DynamicFilter>
  );

  filterSections.push(
    <DynamicFilter
      key="stars"
      title="Yıldız Puanı"
      isVisible={filterVisibility.yildiz ?? false}
      onToggle={() => onToggleFilterVisibility('yildiz')}
      selectedValues={getSelectedValues('stars')}
      selectedCount={getSelectedCount('stars')}
    >
      <StarFilter
        isVisible={filterVisibility.yildiz ?? false}
        onToggle={() => onToggleFilterVisibility('yildiz')}
        selectedStars={filters.product_stars || []}
        onStarChange={(star, checked) => onFilterChange('product_stars', star, checked)}
      />
    </DynamicFilter>
  );

  categoryAttributes
    .filter(attr => 
      attr.slug !== 'product_stars' &&
      attr.slug !== 'uretici-bilgisi' &&
      attr.slug !== 'yikama-talimati' &&
      attr.slug !== 'materyal-bileseni' &&
      attr.slug !== 'kutu-durumu' &&
      attr.slug !== 'desen' &&
      attr.slug !== 'surdurulebilirlik-detayi' &&
      attr.slug !== 'urun-guvenligi-bilgisi' &&
      attr.slug !== 'paket-gorseli-on' &&
      attr.slug !== 'paket-gorseli-arka' &&
      attr.slug !== 'kullanim-talimatiuyarilari' &&
      attr.slug !== 'cesit' &&
      attr.slug !== 'persona' &&
      // Renk filtresi için ayrı ColorFilter kullandığımızdan attribute/variant renk alanlarını gizle
      attr.slug !== 'renk' &&
      attr.slug !== 'web-color' &&
      // Beden filtresi için ayrı özel filtre kullandığımızdan attribute/variant beden alanlarını gizle
      attr.slug !== 'beden' &&
      attr.slug !== 'cinsiyet' &&
      attr.values && attr.values.length > 0
    )
    .forEach((attribute, index) => {
      filterSections.push(
        <DynamicFilter
          key={`attribute-${attribute.slug}-${index}`}
          title={attribute.name}
          isVisible={filterVisibility[attribute.slug] ?? false}
          onToggle={() => onToggleFilterVisibility(attribute.slug)}
          selectedValues={attribute.values
            ?.filter((value: any) => attributeFilters[attribute.slug]?.includes(value.slug))
            .map((value: any) => value.name || value.slug) || []}
          selectedCount={attributeFilters[attribute.slug]?.length || 0}
        >
          <AttributeFilter
            attribute={attribute}
            selectedValues={attributeFilters[attribute.slug] || []}
            onValueChange={(value, checked) => onAttributeFilterChange(attribute.slug, value, checked)}
          />
        </DynamicFilter>
      );
    });

  categoryAttributes
    .filter(attr => attr.type === 'variant')
    .filter(variant => 
      variant.slug !== 'renk' &&
      variant.slug !== 'beden' &&
      variant.values && variant.values.length > 0
    )
    .forEach((variant) => {
      filterSections.push(
        <DynamicFilter
          key={variant.slug}
          title={variant.name}
          isVisible={filterVisibility[variant.slug] ?? false}
          onToggle={() => onToggleFilterVisibility(variant.slug)}
          selectedValues={getSelectedValues(variant.slug)}
          selectedCount={getSelectedCount(variant.slug)}
        >
          <AttributeFilter
            attribute={variant}
            selectedValues={attributeFilters[variant.slug] || []}
            onValueChange={(value, checked) => 
              onAttributeFilterChange(variant.slug, value, checked)
            }
          />
        </DynamicFilter>
      );
    });

  const visibleFilterSlots = Math.min(filterSections.length, VISIBLE_FILTER_COUNT);
  const scrollAreaHeight = Math.max(visibleFilterSlots, 1) * FILTER_SECTION_ESTIMATED_HEIGHT;

  return (
    <div className="bg-white rounded-lg flex flex-col">
      <div className="px-4 py-2 flex flex-col gap-3">
        <div
          className="space-y-2 overflow-y-auto pr-1"
          style={{ maxHeight: scrollAreaHeight }}
        >
          {filterSections}
        </div>

        {onApply && (
          <div className="border-t border-gray-200 pt-3">
            <button 
              onClick={onApply}
              className="w-full bg-orange-500 text-white py-2 px-3 rounded text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              Uygula
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilters;
