"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface AyakkabiCantaStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Ayakkabı & Çanta kategorisi için statik kategori verileri
const ayakkabiCantaStaticCategoryData: { [key: string]: Category } = {
  'ayakkabi-canta': {
    id: 'ayakkabi-canta',
    name: 'Ayakkabı & Çanta',
    slug: 'ayakkabi-canta',
    children: [
      {
        id: 'kadin-ayakkabi',
        name: 'Kadın Ayakkabı',
        slug: 'kadin-ayakkabi',
        children: [
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 'topuklu-ayakkabi', name: 'Topuklu Ayakkabı', slug: 'topuklu-ayakkabi' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'bot-bootie', name: 'Bot & Bootie', slug: 'bot-bootie' },
          { id: 'sandalet', name: 'Sandalet', slug: 'sandalet' },
          { id: 'terlik', name: 'Terlik', slug: 'terlik' },
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'babet', name: 'Babet', slug: 'babet' },
          { id: 'loafer', name: 'Loafer', slug: 'loafer' },
          { id: 'anne-ayakkabisi', name: 'Anne Ayakkabısı', slug: 'anne-ayakkabisi' },
          { id: 'tasli-sandalet', name: 'Taşlı Sandalet', slug: 'tasli-sandalet' },
          { id: 'hastane-terlikleri', name: 'Hastane Terlikleri', slug: 'hastane-terlikleri' },
          { id: 'topuklu-terlik', name: 'Topuklu Terlik', slug: 'topuklu-terlik' },
          { id: 'topuklu-bot', name: 'Topuklu Bot', slug: 'topuklu-bot' },
          { id: 'cizme', name: 'Çizme', slug: 'cizme' },
          { id: 'kovboy-cizmesi', name: 'Kovboy Çizmesi', slug: 'kovboy-cizmesi' },
          { id: 'dolgu-topuk-ayakkabi', name: 'Dolgu Topuk Ayakkabı', slug: 'dolgu-topuk-ayakkabi' },
          { id: 'kar-botu', name: 'Kar Botu', slug: 'kar-botu' },
          { id: 'yagmur-botu', name: 'Yağmur Botu', slug: 'yagmur-botu' },
          { id: 'panduf', name: 'Panduf', slug: 'panduf' }
        ]
      },
      {
        id: 'erkek-ayakkabi',
        name: 'Erkek Ayakkabı',
        slug: 'erkek-ayakkabi',
        children: [
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'klasik-ayakkabi', name: 'Klasik Ayakkabı', slug: 'klasik-ayakkabi' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'kosu-ayakkabisi', name: 'Koşu Ayakkabısı', slug: 'kosu-ayakkabisi' },
          { id: 'krampon', name: 'Krampon', slug: 'krampon' },
          { id: 'loafer', name: 'Loafer', slug: 'loafer' },
          { id: 'hali-saha-ayakkabisi', name: 'Halı Saha Ayakkabısı', slug: 'hali-saha-ayakkabisi' },
          { id: 'sandalet', name: 'Sandalet', slug: 'sandalet' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'cizme', name: 'Çizme', slug: 'cizme' },
          { id: 'postal', name: 'Postal', slug: 'postal' },
          { id: 'basketbol-ayakkabisi', name: 'Basketbol Ayakkabısı', slug: 'basketbol-ayakkabisi' },
          { id: 'terlik', name: 'Terlik', slug: 'terlik' },
          { id: 'ev-terligi', name: 'Ev Terliği', slug: 'ev-terligi' },
          { id: 'panduf', name: 'Panduf', slug: 'panduf' },
          { id: 'deniz-ayakkabisi', name: 'Deniz Ayakkabısı', slug: 'deniz-ayakkabisi' },
          { id: 'suet-ayakkabi', name: 'Süet Ayakkabı', slug: 'suet-ayakkabi' },
          { id: 'yuruyus-ayakkabisi', name: 'Yürüyüş Ayakkabısı', slug: 'yuruyus-ayakkabisi' }
        ]
      },
      {
        id: 'cocuk-ayakkabi',
        name: 'Çocuk Ayakkabı',
        slug: 'cocuk-ayakkabi',
        children: [
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'babet', name: 'Babet', slug: 'babet' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'sandalet', name: 'Sandalet', slug: 'sandalet' },
          { id: 'terlik', name: 'Terlik', slug: 'terlik' },
          { id: 'panduf', name: 'Panduf', slug: 'panduf' },
          { id: 'cizme', name: 'Çizme', slug: 'cizme' },
          { id: 'basketbol-ayakkabisi', name: 'Basketbol Ayakkabısı', slug: 'basketbol-ayakkabisi' },
          { id: 'krampon', name: 'Krampon', slug: 'krampon' }
        ]
      },
      {
        id: 'erkek-aksesuar',
        name: 'Erkek Aksesuar',
        slug: 'erkek-aksesuar',
        children: [
          { id: 'saat', name: 'Saat', slug: 'saat' },
          { id: 'gunes-gozlugu', name: 'Güneş Gözlüğü', slug: 'gunes-gozlugu' },
          { id: 'cuzdan', name: 'Cüzdan', slug: 'cuzdan' },
          { id: 'kemer', name: 'Kemer', slug: 'kemer' },
          { id: 'sapka', name: 'Şapka', slug: 'sapka' },
          { id: 'bileklik', name: 'Bileklik', slug: 'bileklik' },
          { id: 'kravat', name: 'Kravat', slug: 'kravat' },
          { id: 'kolye', name: 'Kolye', slug: 'kolye' },
          { id: 'rozet', name: 'Rozet', slug: 'rozet' },
          { id: 'papyon', name: 'Papyon', slug: 'papyon' }
        ]
      },
      {
        id: 'kadin-canta',
        name: 'Kadın Çanta',
        slug: 'kadin-canta',
        children: [
          { id: 'omuz-cantasi', name: 'Omuz Çantası', slug: 'omuz-cantasi' },
          { id: 'sirt-cantasi', name: 'Sırt Çantası', slug: 'sirt-cantasi' },
          { id: 'cuzdan', name: 'Cüzdan', slug: 'cuzdan' },
          { id: 'spor-cantasi', name: 'Spor Çantası', slug: 'spor-cantasi' },
          { id: 'bel-cantasi', name: 'Bel Çantası', slug: 'bel-cantasi' },
          { id: 'el-cantasi', name: 'El Çantası', slug: 'el-cantasi' },
          { id: 'portfoy', name: 'Portföy', slug: 'portfoy' },
          { id: 'bez-canta', name: 'Bez Çanta', slug: 'bez-canta' },
          { id: 'kartlik', name: 'Kartlık', slug: 'kartlik' },
          { id: 'abiye-canta', name: 'Abiye Çanta', slug: 'abiye-canta' },
          { id: 'postaci-cantasi', name: 'Postacı Çantası', slug: 'postaci-cantasi' },
          { id: 'plaj-cantasi', name: 'Plaj Çantası', slug: 'plaj-cantasi' },
          { id: 'laptop-cantasi', name: 'Laptop Çantası', slug: 'laptop-cantasi' },
          { id: 'kapitone-canta', name: 'Kapitone Çanta', slug: 'kapitone-canta' },
          { id: 'evrak-cantasi', name: 'Evrak Çantası', slug: 'evrak-cantasi' },
          { id: 'kutu-canta', name: 'Kutu Çanta', slug: 'kutu-canta' },
          { id: 'makyaj-cantasi', name: 'Makyaj Çantası', slug: 'makyaj-cantasi' },
          { id: 'pelus-canta', name: 'Peluş Çanta', slug: 'pelus-canta' },
          { id: 'hasir-canta', name: 'Hasır Çanta', slug: 'hasir-canta' },
          { id: 'valiz-bavul', name: 'Valiz & Bavul', slug: 'valiz-bavul' }
        ]
      },
      {
        id: 'erkek-canta',
        name: 'Erkek Çanta',
        slug: 'erkek-canta',
        children: [
          { id: 'sirt-cantasi', name: 'Sırt Çantası', slug: 'sirt-cantasi' },
          { id: 'postaci-cantasi', name: 'Postacı Çantası', slug: 'postaci-cantasi' },
          { id: 'cuzdan-kartlik', name: 'Cüzdan & Kartlık', slug: 'cuzdan-kartlik' },
          { id: 'spor-cantasi', name: 'Spor Çantası', slug: 'spor-cantasi' },
          { id: 'laptop-cantasi', name: 'Laptop Çantası', slug: 'laptop-cantasi' },
          { id: 'bel-cantasi', name: 'Bel Çantası', slug: 'bel-cantasi' },
          { id: 'omuz-cantasi', name: 'Omuz Çantası', slug: 'omuz-cantasi' },
          { id: 'portfoy-canta', name: 'Portföy Çanta', slug: 'portfoy-canta' },
          { id: 'tiras-cantasi', name: 'Tıraş Çantası', slug: 'tiras-cantasi' },
          { id: 'olta-cantasi', name: 'Olta Çantası', slug: 'olta-cantasi' },
          { id: 'okul-cantasi', name: 'Okul Çantası', slug: 'okul-cantasi' },
          { id: 'valiz', name: 'Valiz', slug: 'valiz' },
          { id: 'outdoor-canta', name: 'Outdoor Çanta', slug: 'outdoor-canta' },
          { id: 'el-cantasi', name: 'El Çantası', slug: 'el-cantasi' }
        ]
      }
    ]
  }
};

const AyakkabiCantaStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: AyakkabiCantaStaticCategoryDetailProps) => {
  const fallbackCategory = ayakkabiCantaStaticCategoryData[categorySlug] || null;
  const category = buildCategoryTree({
    categorySlug,
    menuSections,
    fallbackCategory,
    navigationLinks,
    categories,
  });

  if (!category || !category.children || category.children.length === 0) {
    return null;
  }

  // 6 sütun olarak göster (1 sol sütun + 6 kategori sütunu = 7 toplam grid)
  // MegaMenu grid-cols-7 yapısına uygun
  return (
    <div className="col-span-6 grid grid-cols-6 gap-6">
      {category.children.map((subCategory) => (
        <div key={subCategory.id} className="space-y-1.5">
          <div className="group">
            <Link
              href={subCategory.href || `/${subCategory.slug}`}
              prefetch={false}
              className="block text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-150 mb-1"
            >
              {subCategory.name}
            </Link>
            {subCategory.children && subCategory.children.length > 0 && (
              <div className="space-y-0.5 ml-2">
                {subCategory.children.map((child) => (
                  <Link
                    key={child.id}
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
        </div>
      ))}
    </div>
  );
};

export default AyakkabiCantaStaticCategoryDetail;

