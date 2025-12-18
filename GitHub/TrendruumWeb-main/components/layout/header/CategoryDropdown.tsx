"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useCategoryDropdown } from '../../../hooks/useCategoryDropdown';
import { Category } from '../../../data/categories';

interface CategoryDropdownProps {
  categorySlug: string;
  isVisible: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const CategoryDropdown = ({ categorySlug, isVisible, onMouseEnter, onMouseLeave }: CategoryDropdownProps) => {
  const { categoryData, loading, error } = useCategoryDropdown(categorySlug);
  const [hoveredSubCategory, setHoveredSubCategory] = useState<string>('');

  if (!isVisible) {
    return null;
  }

  if (loading) {
    return (
      <div 
        className="fixed top-[49px] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-6xl bg-white border border-gray-200 rounded-lg shadow-xl z-[200] flex items-center justify-center p-8"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error || !categoryData) {
    return (
      <div 
        className="fixed top-[49px] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-6xl bg-white border border-gray-200 rounded-lg shadow-xl z-[200] flex items-center justify-center p-8"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="text-center">
          <p className="text-sm text-gray-500">Kategori verisi yüklenemedi</p>
        </div>
      </div>
    );
  }


  // Elektronik kategorisi için özel iki seviyeli dropdown
  const renderElectronicsDropdown = () => {
    const mainCategories = categoryData.children || [];
    
    return (
      <div 
        className="flex gap-6"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Sol: Ana Kategoriler (%40) */}
        <div className="w-[40%]">
          <div className="space-y-0">
            {mainCategories.map((category, index) => (
              <div
                key={category.id}
                className="group relative"
                onMouseEnter={() => setHoveredSubCategory(category.id)}
                onMouseLeave={() => {
                  // Sadece başka bir kategoriye geçerken temizle, dropdown'dan çıkarken değil
                  setTimeout(() => {
                    if (!document.querySelector('.group:hover')) {
                      setHoveredSubCategory('');
                    }
                  }, 100);
                }}
              >
                <Link
                  href={`/${category.slug}`}
                  className={`flex items-center px-3 py-2 transition-colors duration-200 ${
                    hoveredSubCategory === category.id
                      ? 'text-orange-600'
                      : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  <span className="text-sm font-medium">{category.name}</span>
                  <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sağ: Alt Kategoriler (%60) */}
        <div 
          className="w-[60%]"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {hoveredSubCategory && (
            <div className="bg-white rounded-lg pt-4 pb-4 pr-4">
              {(() => {
                const selectedCategory = mainCategories.find(cat => cat.id === hoveredSubCategory);
                if (!selectedCategory || !selectedCategory.children) return null;
                
                return (
                  <div className="grid grid-cols-2 gap-0.5 items-start">
                    {selectedCategory.children.map(subCategory => (
                      <div key={subCategory.id} className="text-left">
                        {/* Ana alt kategori */}
                        <Link
                          href={`/${subCategory.slug}`}
                          className="block px-0 py-0.5 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded transition-colors font-medium"
                        >
                          {subCategory.name}
                        </Link>
                        
                        {/* Alt kategorinin alt kategorileri varsa onları da göster */}
                        {subCategory.children && subCategory.children.length > 0 && (
                          <div className="px-0 py-0">
                            <span className="text-xs text-gray-500">
                              {subCategory.children.map((grandChild, index) => (
                                <span key={grandChild.id}>
                                  <Link
                                    href={`/${grandChild.slug}`}
                                    className="hover:text-orange-600 transition-colors"
                                  >
                                    {grandChild.name}
                                  </Link>
                                  {index < (subCategory.children?.length || 0) - 1 && ', '}
                                </span>
                              ))}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Diğer kategoriler için normal dropdown
  const renderNormalDropdown = () => {
    // Kategori seviyesi ile birlikte düz array'e çevir
    interface CategoryWithLevel extends Category {
      level: number;
    }

    const flattenCategories = (categories: Category[]): CategoryWithLevel[] => {
      const flattened: CategoryWithLevel[] = [];
      
      categories.forEach(category => {
        // 1. derece kategori
        flattened.push({ ...category, level: 1 });
        
        // 2. derece kategoriler
        if (category.children) {
          category.children.forEach(subCategory => {
            flattened.push({ ...subCategory, level: 2 });
            
            // 3. derece kategoriler
            if (subCategory.children) {
              subCategory.children.forEach(thirdCategory => {
                flattened.push({ ...thirdCategory, level: 3 });
              });
            }
          });
        }
      });
      
      return flattened;
    };

    // Kategorileri gruplara ayır (3 sütun için)
    const groupCategories = (categories: CategoryWithLevel[]) => {
      const itemsPerColumn = Math.ceil(categories.length / 3);
      return {
        col1: categories.slice(0, itemsPerColumn),
        col2: categories.slice(itemsPerColumn, itemsPerColumn * 2),
        col3: categories.slice(itemsPerColumn * 2, itemsPerColumn * 3)
      };
    };

    const allCategories = flattenCategories(categoryData.children || []);
    const { col1, col2, col3 } = groupCategories(allCategories);

    return (
      <div className="grid grid-cols-3 gap-6 text-left">
        {/* Sütun 1 */}
        <div className="space-y-3">
          {col1.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className={`block text-sm ${
                category.level === 1 
                  ? 'font-semibold text-orange-500 hover:text-orange-600' 
                  : category.level === 2
                    ? 'font-medium text-gray-800 hover:text-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
              } transition-colors duration-150`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Sütun 2 */}
        <div className="space-y-3">
          {col2.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className={`block text-sm ${
                category.level === 1 
                  ? 'font-semibold text-orange-500 hover:text-orange-600' 
                  : category.level === 2
                    ? 'font-medium text-gray-800 hover:text-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
              } transition-colors duration-150`}
            >
              {category.name}
            </Link>
          ))}
        </div>

        {/* Sütun 3 */}
        <div className="space-y-3">
          {col3.map((category) => (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className={`block text-sm ${
                category.level === 1 
                  ? 'font-semibold text-orange-500 hover:text-orange-600' 
                  : category.level === 2
                    ? 'font-medium text-gray-800 hover:text-orange-500'
                    : 'text-gray-600 hover:text-orange-500'
              } transition-colors duration-150`}
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Kategoriye özel banner tasarımı
  const getCategoryBannerStyle = (categorySlug: string) => {
    const styles: Record<string, {
      gradient: string;
      titleColor: string;
      descriptionColor: string;
      buttonBg: string;
      buttonHover: string;
      borderColor: string;
    }> = {
      'mobilya': {
        gradient: 'from-amber-50 to-orange-100',
        titleColor: 'text-amber-700',
        descriptionColor: 'text-amber-600',
        buttonBg: 'bg-amber-500',
        buttonHover: 'hover:bg-amber-600',
        borderColor: 'border-amber-200'
      },
      'anne-bebek-cocuk': {
        gradient: 'from-pink-50 to-rose-100',
        titleColor: 'text-pink-700',
        descriptionColor: 'text-pink-600',
        buttonBg: 'bg-pink-500',
        buttonHover: 'hover:bg-pink-600',
        borderColor: 'border-pink-200'
      },
      'elektronik': {
        gradient: 'from-blue-50 to-indigo-100',
        titleColor: 'text-blue-700',
        descriptionColor: 'text-blue-600',
        buttonBg: 'bg-blue-500',
        buttonHover: 'hover:bg-blue-600',
        borderColor: 'border-blue-200'
      },
      'giyim-ayakkabi': {
        gradient: 'from-purple-50 to-violet-100',
        titleColor: 'text-purple-700',
        descriptionColor: 'text-purple-600',
        buttonBg: 'bg-purple-500',
        buttonHover: 'hover:bg-purple-600',
        borderColor: 'border-purple-200'
      },
      'kozmetik-kişisel-bakim': {
        gradient: 'from-rose-50 to-pink-100',
        titleColor: 'text-rose-700',
        descriptionColor: 'text-rose-600',
        buttonBg: 'bg-rose-500',
        buttonHover: 'hover:bg-rose-600',
        borderColor: 'border-rose-200'
      },
      'ev-yasam': {
        gradient: 'from-green-50 to-emerald-100',
        titleColor: 'text-green-700',
        descriptionColor: 'text-green-600',
        buttonBg: 'bg-green-500',
        buttonHover: 'hover:bg-green-600',
        borderColor: 'border-green-200'
      },
      'spor-outdoor': {
        gradient: 'from-cyan-50 to-teal-100',
        titleColor: 'text-cyan-700',
        descriptionColor: 'text-cyan-600',
        buttonBg: 'bg-cyan-500',
        buttonHover: 'hover:bg-cyan-600',
        borderColor: 'border-cyan-200'
      },
      'kitap-muzik-film': {
        gradient: 'from-violet-50 to-purple-100',
        titleColor: 'text-violet-700',
        descriptionColor: 'text-violet-600',
        buttonBg: 'bg-violet-500',
        buttonHover: 'hover:bg-violet-600',
        borderColor: 'border-violet-200'
      },
      'otomotiv-motorsiklet': {
        gradient: 'from-gray-50 to-slate-100',
        titleColor: 'text-gray-700',
        descriptionColor: 'text-gray-600',
        buttonBg: 'bg-gray-500',
        buttonHover: 'hover:bg-gray-600',
        borderColor: 'border-gray-200'
      },
      'hobi-sanat': {
        gradient: 'from-yellow-50 to-amber-100',
        titleColor: 'text-yellow-700',
        descriptionColor: 'text-yellow-600',
        buttonBg: 'bg-yellow-500',
        buttonHover: 'hover:bg-yellow-600',
        borderColor: 'border-yellow-200'
      }
    };

    // Default style (orange)
    const defaultStyle = {
      gradient: 'from-orange-50 to-orange-100',
      titleColor: 'text-orange-700',
      descriptionColor: 'text-orange-600',
      buttonBg: 'bg-orange-500',
      buttonHover: 'hover:bg-orange-600',
      borderColor: 'border-orange-200'
    };

    return styles[categorySlug] || defaultStyle;
  };

  const bannerStyle = getCategoryBannerStyle(categoryData.slug);

  return (
    <div 
      className="fixed top-[49px] left-1/2 transform -translate-x-1/2 w-[90vw] max-w-6xl bg-white border border-gray-200 rounded-lg shadow-xl z-[200] animate-in slide-in-from-top-2 duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-6">
        <div className="flex gap-6">
          {/* Sol: Kategoriler (%60) */}
          <div className="w-[60%]">
            {categorySlug === 'elektronik' ? renderElectronicsDropdown() : renderNormalDropdown()}
          </div>

          {/* Sağ: Banner Alanı (%40) */}
          <div className="w-[40%] flex flex-col gap-4">
            {/* Ana Banner - Kategoriye Özel Tasarım */}
            <div className={`bg-gradient-to-br ${bannerStyle.gradient} rounded-lg p-6 border ${bannerStyle.borderColor} shadow-sm`}>
              <h3 className={`text-lg font-bold ${bannerStyle.titleColor} mb-2`}>
                {categoryData.name}
              </h3>
              <p className={`text-sm ${bannerStyle.descriptionColor} mb-4`}>
                En popüler ürünleri keşfedin
              </p>
              <Link 
                href={`/${categoryData.slug}`}
                className={`inline-flex items-center px-4 py-2 ${bannerStyle.buttonBg} ${bannerStyle.buttonHover} text-white text-sm font-medium rounded-lg transition-colors`}
              >
                Tümünü Gör
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;