"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import {
  HeartIcon,
  UserIcon,
  UsersIcon,
  HomeIcon,
  ShoppingCartIcon,
  BeakerIcon,
  ShoppingBagIcon,
  ComputerDesktopIcon,
  SunIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import StaticCategoryDetail from './StaticCategoryDetail';
import ErkekStaticCategoryDetail from './ErkekStaticCategoryDetail';
import AnneCocukStaticCategoryDetail from './AnneCocukStaticCategoryDetail';
import EvMobilyaStaticCategoryDetail from './EvMobilyaStaticCategoryDetail';
import SupermarketStaticCategoryDetail from './SupermarketStaticCategoryDetail';
import KozmetikStaticCategoryDetail from './KozmetikStaticCategoryDetail';
import AyakkabiCantaStaticCategoryDetail from './AyakkabiCantaStaticCategoryDetail';
import ElektronikStaticCategoryDetail from './ElektronikStaticCategoryDetail';
import SporOutdoorStaticCategoryDetail from './SporOutdoorStaticCategoryDetail';
import KitapKirtasiyeHobiStaticCategoryDetail from './KitapKirtasiyeHobiStaticCategoryDetail';
import type { MenuSection } from '@/app/context/MenuContext';

interface Category {
  id: string;
  name: string;
  slug: string;
  href?: string;
  children?: Category[];
}

interface MegaMenuProps {
  isVisible: boolean;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

// Statik ana kategoriler (tıklanabilir değil)
const staticMainCategories = [
  { name: 'Kadın', slug: 'kadin', icon: <HeartIcon className="w-5 h-5" /> },
  { name: 'Erkek', slug: 'erkek', icon: <UserIcon className="w-5 h-5" /> },
  { name: 'Anne & Çocuk', slug: 'anne-cocuk', icon: <UsersIcon className="w-5 h-5" /> },
  { name: 'Ev & Mobilya', slug: 'ev-mobilya', icon: <HomeIcon className="w-5 h-5" /> },
  { name: 'Süpermarket & Petshop', slug: 'supermarket', icon: <ShoppingCartIcon className="w-5 h-5" /> },
  { name: 'Kozmetik', slug: 'kozmetik', icon: <BeakerIcon className="w-5 h-5" /> },
  { name: 'Ayakkabı & Çanta', slug: 'ayakkabi-canta', icon: <ShoppingBagIcon className="w-5 h-5" /> },
  { name: 'Elektronik', slug: 'elektronik', icon: <ComputerDesktopIcon className="w-5 h-5" /> },
  { name: 'Spor & Outdoor', slug: 'spor-outdoor', icon: <SunIcon className="w-5 h-5" /> },
  { name: 'Kitap & Kırtasiye & Hobi', slug: 'kitap-kirtasiye-hobi', icon: <BookOpenIcon className="w-5 h-5" /> },
];

const MegaMenu = ({
  isVisible,
  categories,
  navigationLinks = [],
  menuSections,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) => {
  const [hoveredStaticCategory, setHoveredStaticCategory] = useState<string>('kadin');

  if (!isVisible) {
    return null;
  }

  // Kategorileri normalize et - url field'ını href'e çevir
  const normalizedCategories = categories.map(cat => ({
    ...cat,
    href: cat.href || (cat as any).url || `/${cat.slug}`,
    children: cat.children?.map(child => ({
      ...child,
      href: child.href || (child as any).url || `/${child.slug}`
    }))
  }));

  // Kategorileri 6 sütuna böl
  const categoriesPerColumn = Math.ceil(normalizedCategories.length / 6);
  const column1 = normalizedCategories.slice(0, categoriesPerColumn);
  const column2 = normalizedCategories.slice(categoriesPerColumn, categoriesPerColumn * 2);
  const column3 = normalizedCategories.slice(categoriesPerColumn * 2, categoriesPerColumn * 3);
  const column4 = normalizedCategories.slice(categoriesPerColumn * 3, categoriesPerColumn * 4);
  const column5 = normalizedCategories.slice(categoriesPerColumn * 4, categoriesPerColumn * 5);
  const column6 = normalizedCategories.slice(categoriesPerColumn * 5);

  // Hover edilen statik kategoriye göre içerik göster
  const showStaticCategoryDetail = hoveredStaticCategory && hoveredStaticCategory !== '';

  return (
    <div 
      className="absolute top-full left-0 right-auto w-screen bg-white border-b border-gray-200 z-[200] animate-in slide-in-from-top-2 duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={() => {
        onMouseLeave?.();
        setHoveredStaticCategory('kadin');
      }}
    >
      <div className="max-w-screen-xl ml-0 mr-auto pl-0 pr-[35px] sm:pl-0 sm:pr-[35px] md:pl-0 md:pr-[44px] lg:pl-0 lg:pr-[52px] xl:pl-0 xl:pr-[60px] 2xl:pl-0 2xl:pr-[68px] max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-7 gap-6 py-3">
          {/* Sol Sütun - Statik Ana Kategoriler (Tıklanabilir Değil) */}
          <div className="space-y-1.5 bg-gray-50 p-3 rounded-r-lg -my-3">
            {staticMainCategories.map((category) => {
              const isHovered = hoveredStaticCategory === category.slug;
              return (
                <div 
                  key={category.slug}
                  className={`flex items-center text-sm font-medium cursor-default py-1 -mx-3 px-3 rounded transition-all duration-150 group ${
                    isHovered 
                      ? 'text-orange-500 bg-orange-50' 
                      : 'text-gray-900 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                  onMouseEnter={() => setHoveredStaticCategory(category.slug)}
                >
                  <span className={`mr-2 transition-colors duration-150 ${
                    isHovered 
                      ? 'text-orange-500' 
                      : 'text-gray-600 group-hover:text-orange-500'
                  }`}>
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </div>
              );
            })}
          </div>

          {/* Sağ Sütunlar - Dinamik Kategoriler veya Statik Kategori Detayı */}
          {showStaticCategoryDetail ? (
            hoveredStaticCategory === 'erkek' ? (
              <ErkekStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'anne-cocuk' ? (
              <AnneCocukStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'ev-mobilya' ? (
              <EvMobilyaStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'supermarket' ? (
              <SupermarketStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'kozmetik' ? (
              <KozmetikStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'ayakkabi-canta' ? (
              <AyakkabiCantaStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'elektronik' ? (
              <ElektronikStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'spor-outdoor' ? (
              <SporOutdoorStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : hoveredStaticCategory === 'kitap-kirtasiye-hobi' ? (
              <KitapKirtasiyeHobiStaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            ) : (
              <StaticCategoryDetail 
                categorySlug={hoveredStaticCategory} 
                categories={categories}
                navigationLinks={navigationLinks}
                menuSections={menuSections}
              />
            )
          ) : (
            <>
              {/* Sütun 1 - Dinamik Kategoriler */}
              <div className="space-y-1.5">
                {column1.map((category, index) => (
              <div key={`col1-${category.id || category.slug || index}`} className="group">
                <Link
                  href={category.href || `/${category.slug}`}
                  prefetch={false}
                  className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="space-y-0.5 ml-2">
                    {category.children.slice(0, 5).map((child, childIndex) => (
                      <Link
                        key={`col1-${category.id || category.slug || index}-child-${child.id || child.slug || childIndex}`}
                        href={child.href || `/${child.slug}`}
                        prefetch={false}
                        className="block text-xs text-gray-600 hover:text-orange-500 transition-colors duration-150"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sütun 2 */}
          <div className="space-y-1.5">
            {column2.map((category, index) => (
              <div key={`col2-${category.id || category.slug || index}`} className="group">
                <Link
                  href={category.href || `/${category.slug}`}
                  prefetch={false}
                  className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="space-y-0.5 ml-2">
                    {category.children.slice(0, 5).map((child, childIndex) => (
                      <Link
                        key={`col2-${category.id || category.slug || index}-child-${child.id || child.slug || childIndex}`}
                        href={child.href || `/${child.slug}`}
                        prefetch={false}
                        className="block text-xs text-gray-600 hover:text-orange-500 transition-colors duration-150"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sütun 3 */}
          <div className="space-y-1.5">
            {column3.map((category, index) => (
              <div key={`col3-${category.id || category.slug || index}`} className="group">
                <Link
                  href={category.href || `/${category.slug}`}
                  prefetch={false}
                  className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="space-y-0.5 ml-2">
                    {category.children.slice(0, 5).map((child, childIndex) => (
                      <Link
                        key={`col3-${category.id || category.slug || index}-child-${child.id || child.slug || childIndex}`}
                        href={child.href || `/${child.slug}`}
                        prefetch={false}
                        className="block text-xs text-gray-600 hover:text-orange-500 transition-colors duration-150"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sütun 4 */}
          <div className="space-y-1.5">
            {column4.map((category, index) => (
              <div key={`col4-${category.id || category.slug || index}`} className="group">
                <Link
                  href={category.href || `/${category.slug}`}
                  prefetch={false}
                  className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="space-y-0.5 ml-2">
                    {category.children.slice(0, 5).map((child, childIndex) => (
                      <Link
                        key={`col4-${category.id || category.slug || index}-child-${child.id || child.slug || childIndex}`}
                        href={child.href || `/${child.slug}`}
                        prefetch={false}
                        className="block text-xs text-gray-600 hover:text-orange-500 transition-colors duration-150"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sütun 5 */}
          <div className="space-y-1.5">
            {column5.map((category, index) => (
              <div key={`col5-${category.id || category.slug || index}`} className="group">
                <Link
                  href={category.href || `/${category.slug}`}
                  prefetch={false}
                  className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="space-y-0.5 ml-2">
                    {category.children.slice(0, 5).map((child, childIndex) => (
                      <Link
                        key={`col5-${category.id || category.slug || index}-child-${child.id || child.slug || childIndex}`}
                        href={child.href || `/${child.slug}`}
                        prefetch={false}
                        className="block text-xs text-gray-600 hover:text-orange-500 transition-colors duration-150"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sütun 6 */}
          <div className="space-y-1.5">
            {column6.map((category, index) => (
              <div key={`col6-${category.id || category.slug || index}`} className="group">
                <Link
                  href={category.href || `/${category.slug}`}
                  prefetch={false}
                  className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
                >
                  {category.name}
                </Link>
                {category.children && category.children.length > 0 && (
                  <div className="space-y-0.5 ml-2">
                    {category.children.slice(0, 5).map((child, childIndex) => (
                      <Link
                        key={`col6-${category.id || category.slug || index}-child-${child.id || child.slug || childIndex}`}
                        href={child.href || `/${child.slug}`}
                        prefetch={false}
                        className="block text-xs text-gray-600 hover:text-orange-500 transition-colors duration-150"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
