"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface StaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Statik kategori verileri
const staticCategoryData: { [key: string]: Category } = {
  'kadin': {
    id: 'kadin',
    name: 'Kadın',
    slug: 'kadin',
    children: [
      {
        id: 'giyim',
        name: 'Giyim',
        slug: 'giyim?g=1',
        children: [
          { id: 'elbise', name: 'Elbise', slug: '/elbise?g=1' },
          { id: 'tisort', name: 'Tişört', slug: '/t-shirt?g=1' },
          { id: 'gomlek', name: 'Gömlek', slug: '/gomlek?g=1' },
          { id: 'kot-pantolon', name: 'Kot Pantolon', slug: '/q?q=kot+pantolon&a_cinsiyet=kadin-kiz' },
          { id: 'kot-ceket', name: 'Kot Ceket', slug: '/q?q=kot+ceket&a_cinsiyet=kadin-kiz' },
          { id: 'pantolon', name: 'Pantolon', slug: '/pantolon?g=1' },
          { id: 'mont', name: 'Mont', slug: 'mont' },
          { id: 'bluz', name: 'Bluz', slug: 'bluz' },
          { id: 'ceket', name: 'Ceket', slug: 'ceket' },
          { id: 'etek', name: 'Etek', slug: 'etek' },
          { id: 'kazak', name: 'Kazak', slug: 'kazak' },
          { id: 'tesettur', name: 'Tesettür', slug: 'tesettur' },
          { id: 'buyuk-beden', name: 'Büyük Beden', slug: 'buyuk-beden' },
          { id: 'trenckot', name: 'Trençkot', slug: 'trenckot' },
          { id: 'yagmurluk', name: 'Yağmurluk & Rüzgarlık', slug: 'yagmurluk-ruzgarlik' },
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'kaban', name: 'Kaban', slug: 'kaban' },
          { id: 'hirka', name: 'Hırka', slug: 'hirka' },
          { id: 'palto', name: 'Palto', slug: 'palto' }
        ]
      },
      {
        id: 'ayakkabi',
        name: 'Ayakkabı',
        slug: 'ayakkabi',
        children: [
          { id: 'topuklu-ayakkabi', name: 'Topuklu Ayakkabı', slug: 'topuklu-ayakkabi' },
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'babet', name: 'Babet', slug: 'babet' },
          { id: 'sandalet', name: 'Sandalet', slug: 'sandalet' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'cizme', name: 'Çizme', slug: 'cizme' },
          { id: 'kar-botu', name: 'Kar Botu', slug: 'kar-botu' },
          { id: 'loafer', name: 'Loafer', slug: 'loafer' }
        ]
      },
      {
        id: 'canta',
        name: 'Çanta',
        slug: 'canta',
        children: [
          { id: 'omuz-cantasi', name: 'Omuz Çantası', slug: 'omuz-cantasi' },
          { id: 'sirt-cantasi', name: 'Sırt Çantası', slug: 'sirt-cantasi' },
          { id: 'bel-cantasi', name: 'Bel Çantası', slug: 'bel-cantasi' },
          { id: 'okul-cantasi', name: 'Okul Çantası', slug: 'okul-cantasi' },
          { id: 'laptop-cantasi', name: 'Laptop Çantası', slug: 'laptop-cantasi' },
          { id: 'portfoy', name: 'Portföy', slug: 'portfoy' },
          { id: 'postaci-cantasi', name: 'Postacı Çantası', slug: 'postaci-cantasi' },
          { id: 'el-cantasi', name: 'El Çantası', slug: 'el-cantasi' },
          { id: 'kanvas-canta', name: 'Kanvas Çanta', slug: 'kanvas-canta' },
          { id: 'makyaj-cantasi', name: 'Makyaj Çantası', slug: 'makyaj-cantasi' },
          { id: 'abiye-canta', name: 'Abiye Çanta', slug: 'abiye-canta' },
          { id: 'capraz-canta', name: 'Çapraz Çanta', slug: 'capraz-canta' },
          { id: 'bez-canta', name: 'Bez Çanta', slug: 'bez-canta' },
          { id: 'anne-bebek-cantasi', name: 'Anne Bebek Çantası', slug: 'anne-bebek-cantasi' },
          { id: 'evrak-cantasi', name: 'Evrak Çantası', slug: 'evrak-cantasi' },
          { id: 'tote-canta', name: 'Tote Çanta', slug: 'tote-canta' },
          { id: 'beslenme-cantasi', name: 'Beslenme Çantası', slug: 'beslenme-cantasi' },
          { id: 'kartlik', name: 'Kartlık', slug: 'kartlik' },
          { id: 'cuzdan', name: 'Cüzdan', slug: 'cuzdan' },
          { id: 'kadin-spor-cantasi', name: 'Kadın Spor Çantası', slug: 'kadin-spor-cantasi' }
        ]
      },
      {
        id: 'ev-ic-giyim',
        name: 'Ev & İç Giyim',
        slug: 'ev-ic-giyim',
        children: [
          { id: 'pijama-takimi', name: 'Pijama Takımı', slug: 'pijama-takimi' },
          { id: 'gecelik', name: 'Gecelik', slug: 'gecelik' },
          { id: 'sutyen', name: 'Sütyen', slug: 'sutyen' },
          { id: 'ic-camasiri-takimlari', name: 'İç Çamaşırı Takımları', slug: 'ic-camasiri-takimlari' },
          { id: 'fantezi-giyim', name: 'Fantezi Giyim', slug: 'fantezi-giyim' },
          { id: 'corap', name: 'Çorap', slug: 'corap' },
          { id: 'korse', name: 'Korse', slug: 'korse' },
          { id: 'kulot', name: 'Külot', slug: 'kulot' },
          { id: 'bustiyer', name: 'Büstiyer', slug: 'bustiyer' },
          { id: 'bralet', name: 'Bralet', slug: 'bralet' },
          { id: 'atlet-body', name: 'Atlet & Body', slug: 'atlet-body' },
          { id: 'kombinezon', name: 'Kombinezon', slug: 'kombinezon' },
          { id: 'jartiyer', name: 'Jartiyer', slug: 'jartiyer' }
        ]
      },
      {
        id: 'kozmetik',
        name: 'Kozmetik',
        slug: 'kozmetik',
        children: [
          { id: 'parfum', name: 'Parfüm', slug: 'parfum' },
          { id: 'goz-makyaji', name: 'Göz Makyajı', slug: 'goz-makyaji' },
          { id: 'cilt-bakim', name: 'Cilt Bakım', slug: 'cilt-bakim' },
          { id: 'sac-bakimi', name: 'Saç Bakımı', slug: 'sac-bakimi' },
          { id: 'makyaj', name: 'Makyaj', slug: 'makyaj' },
          { id: 'agiz-bakim', name: 'Ağız Bakım', slug: 'agiz-bakim' },
          { id: 'cinsel-saglik', name: 'Cinsel Sağlık', slug: 'cinsel-saglik' },
          { id: 'vucut-bakim', name: 'Vücut Bakım', slug: 'vucut-bakim' },
          { id: 'hijyenik-ped', name: 'Hijyenik Ped', slug: 'hijyenik-ped' },
          { id: 'dus-jeli-kremleri', name: 'Duş Jeli & Kremleri', slug: 'dus-jeli-kremleri' },
          { id: 'epilasyon-urunleri', name: 'Epilasyon Ürünleri', slug: 'epilasyon-urunleri' },
          { id: 'ruj', name: 'Ruj', slug: 'ruj' },
          { id: 'dudak-nemlendirici', name: 'Dudak Nemlendirici', slug: 'dudak-nemlendirici' },
          { id: 'aydinlatici-highlighter', name: 'Aydınlatıcı & Highlighter', slug: 'aydinlatici-highlighter' },
          { id: 'eyeliner', name: 'Eyeliner', slug: 'eyeliner' },
          { id: 'ten-makyaji', name: 'Ten Makyajı', slug: 'ten-makyaji' },
          { id: 'manikur-pedikur', name: 'Manikür & Pedikür', slug: 'manikur-pedikur' },
          { id: 'bb-cc-krem', name: 'BB & CC Krem', slug: 'bb-cc-krem' },
          { id: 'el-kremi', name: 'El Kremi', slug: 'el-kremi' },
          { id: 'yuz-nemlendirici', name: 'Yüz Nemlendirici', slug: 'yuz-nemlendirici' }
        ]
      },
      {
        id: 'spor-outdoor',
        name: 'Spor & Outdoor',
        slug: 'spor-outdoor',
        children: [
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'tisort', name: 'Tişört', slug: 'tisort' },
          { id: 'spor-sutyeni', name: 'Spor Sütyeni', slug: 'spor-sutyeni' },
          { id: 'tayt', name: 'Tayt', slug: 'tayt' },
          { id: 'esofman', name: 'Eşofman', slug: 'esofman' },
          { id: 'kosu-ayakkabisi', name: 'Koşu Ayakkabısı', slug: 'kosu-ayakkabisi' },
          { id: 'spor-cantasi', name: 'Spor Çantası', slug: 'spor-cantasi' },
          { id: 'spor-ekipmanlari', name: 'Spor Ekipmanları', slug: 'spor-ekipmanlari' },
          { id: 'outdoor-ayakkabi', name: 'Outdoor Ayakkabı', slug: 'outdoor-ayakkabi' },
          { id: 'kar-botu', name: 'Kar Botu', slug: 'kar-botu' },
          { id: 'outdoor-ekipmanlari', name: 'Outdoor Ekipmanları', slug: 'outdoor-ekipmanlari' },
          { id: 'sporcu-besinleri', name: 'Sporcu Besinleri', slug: 'sporcu-besinleri' },
          { id: 'sporcu-aksesuarlari', name: 'Sporcu Aksesuarları', slug: 'sporcu-aksesuarlari' },
          { id: 'outdoor-canta', name: 'Outdoor Çanta', slug: 'outdoor-canta' },
          { id: 'kayak-malzemeleri', name: 'Kayak Malzemeleri', slug: 'kayak-malzemeleri' },
          { id: 'uyku-tulumu', name: 'Uyku Tulumu', slug: 'uyku-tulumu' },
          { id: 'mat', name: 'Mat', slug: 'mat' },
          { id: 'dagcilik', name: 'Dağcılık', slug: 'dagcilik' },
          { id: 'kadin-spor-ceket', name: 'Kadın Spor Ceket', slug: 'kadin-spor-ceket' },
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' }
        ]
      }
    ]
  }
};

const StaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: StaticCategoryDetailProps) => {
  const fallbackCategory = staticCategoryData[categorySlug] || null;
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

  // Alt kategorileri sütunlara böl (6 sütun)
  const childrenPerColumn = Math.ceil(category.children.length / 6);
  const columns = [];
  for (let i = 0; i < 6; i++) {
    columns.push(category.children.slice(i * childrenPerColumn, (i + 1) * childrenPerColumn));
  }

  return (
    <>
      {columns.map((column, colIndex) => (
        <div key={colIndex} className="space-y-1.5">
          {column.map((subCategory) => {
            // Slug'dan query parametresini ayır
            const slugParts = subCategory.slug.split('?');
            const cleanSlug = slugParts[0].replace(/^\//, ''); // Başındaki / karakterini kaldır
            const queryParams = slugParts[1] || '';
          const fallbackHref = queryParams ? `/${cleanSlug}?${queryParams}` : `/${cleanSlug}`;
          const href = subCategory.href || fallbackHref;
            
            return (
            <div key={subCategory.id} className="group">
              <Link
                href={href}
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
            );
          })}
        </div>
      ))}
    </>
  );
};

export default StaticCategoryDetail;

