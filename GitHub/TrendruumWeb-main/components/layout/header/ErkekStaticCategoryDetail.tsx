"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface ErkekStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Erkek kategorisi için statik kategori verileri
const erkekStaticCategoryData: { [key: string]: Category } = {
  'erkek': {
    id: 'erkek',
    name: 'Erkek',
    slug: 'erkek',
    children: [
      {
        id: 'giyim',
        name: 'Giyim',
        slug: 'giyim',
        children: [
          { id: 'tisort', name: 'Tişört', slug: 'tisort' },
          { id: 'sort', name: 'Şort', slug: 'sort' },
          { id: 'gomlek', name: 'Gömlek', slug: 'gomlek' },
          { id: 'esofman', name: 'Eşofman', slug: 'esofman' },
          { id: 'pantolon', name: 'Pantolon', slug: 'pantolon' },
          { id: 'ceket', name: 'Ceket', slug: 'ceket' },
          { id: 'kot-pantolon', name: 'Kot Pantolon', slug: 'kot-pantolon' },
          { id: 'yelek', name: 'Yelek', slug: 'yelek' },
          { id: 'kazak', name: 'Kazak', slug: 'kazak' },
          { id: 'mont', name: 'Mont', slug: 'mont' },
          { id: 'takim-elbise', name: 'Takım Elbise', slug: 'takim-elbise' },
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'deri-mont', name: 'Deri Mont', slug: 'deri-mont' },
          { id: 'kaban', name: 'Kaban', slug: 'kaban' },
          { id: 'hirka', name: 'Hırka', slug: 'hirka' },
          { id: 'trenckot', name: 'Trençkot', slug: 'trenckot' },
          { id: 'palto', name: 'Palto', slug: 'palto' },
          { id: 'yagmurluk', name: 'Yağmurluk', slug: 'yagmurluk' },
          { id: 'blazer', name: 'Blazer', slug: 'blazer' },
          { id: 'polar', name: 'Polar', slug: 'polar' }
        ]
      },
      {
        id: 'ayakkabi',
        name: 'Ayakkabı',
        slug: 'ayakkabi',
        children: [
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'yuruyus-ayakkabisi', name: 'Yürüyüş Ayakkabısı', slug: 'yuruyus-ayakkabisi' },
          { id: 'krampon', name: 'Krampon', slug: 'krampon' },
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'kar-botu', name: 'Kar Botu', slug: 'kar-botu' },
          { id: 'deri-ayakkabi', name: 'Deri ayakkabı', slug: 'deri-ayakkabi' },
          { id: 'loafer', name: 'Loafer', slug: 'loafer' },
          { id: 'ev-terligi', name: 'Ev Terliği', slug: 'ev-terligi' },
          { id: 'kosu-ayakkabisi', name: 'Koşu Ayakkabısı', slug: 'kosu-ayakkabisi' },
          { id: 'cizme', name: 'Çizme', slug: 'cizme' }
        ]
      },
      {
        id: 'saat-aksesuar',
        name: 'Saat & Aksesuar',
        slug: 'saat-aksesuar',
        children: [
          { id: 'saat', name: 'Saat', slug: 'saat' },
          { id: 'gunes-gozlugu', name: 'Güneş Gözlüğü', slug: 'gunes-gozlugu' },
          { id: 'cuzdan', name: 'Cüzdan', slug: 'cuzdan' },
          { id: 'kemer', name: 'Kemer', slug: 'kemer' },
          { id: 'canta', name: 'Çanta', slug: 'canta' },
          { id: 'sapka', name: 'Şapka', slug: 'sapka' },
          { id: 'kartlik', name: 'Kartlık', slug: 'kartlik' },
          { id: 'valiz', name: 'Valiz', slug: 'valiz' },
          { id: 'kravat', name: 'Kravat', slug: 'kravat' },
          { id: 'boyunluk', name: 'Boyunluk', slug: 'boyunluk' },
          { id: 'atki', name: 'Atkı', slug: 'atki' },
          { id: 'bere', name: 'Bere', slug: 'bere' },
          { id: 'eldiven', name: 'Eldiven', slug: 'eldiven' }
        ]
      },
      {
        id: 'spor-outdoor',
        name: 'Spor & Outdoor',
        slug: 'spor-outdoor',
        children: [
          { id: 'esofman', name: 'Eşofman', slug: 'esofman' },
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 't-shirt', name: 'T-shirt', slug: 't-shirt' },
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'forma', name: 'Forma', slug: 'forma' },
          { id: 'spor-corap', name: 'Spor Çorap', slug: 'spor-corap' },
          { id: 'spor-giyim', name: 'Spor Giyim', slug: 'spor-giyim' },
          { id: 'outdoor-ayakkabi', name: 'Outdoor Ayakkabı', slug: 'outdoor-ayakkabi' },
          { id: 'outdoor-bot', name: 'Outdoor Bot', slug: 'outdoor-bot' },
          { id: 'spor-ekipmanlari', name: 'Spor Ekipmanları', slug: 'spor-ekipmanlari' },
          { id: 'outdoor-ekipmanlari', name: 'Outdoor Ekipmanları', slug: 'outdoor-ekipmanlari' },
          { id: 'sporcu-besinleri', name: 'Sporcu Besinleri', slug: 'sporcu-besinleri' },
          { id: 'sporcu-aksesuarlari', name: 'Sporcu Aksesuarları', slug: 'sporcu-aksesuarlari' },
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'scooter', name: 'Scooter', slug: 'scooter' },
          { id: 'bisiklet', name: 'Bisiklet', slug: 'bisiklet' },
          { id: 'dalis-malzemeleri', name: 'Dalış Malzemeleri', slug: 'dalis-malzemeleri' },
          { id: 'ruzgarlik', name: 'Rüzgarlık', slug: 'ruzgarlik' },
          { id: 'aksiyon-kamerasi', name: 'Aksiyon Kamerası', slug: 'aksiyon-kamerasi' },
          { id: 'kamp-malzemeleri', name: 'Kamp Malzemeleri', slug: 'kamp-malzemeleri' }
        ]
      },
      {
        id: 'elektronik',
        name: 'Elektronik',
        slug: 'elektronik',
        children: [
          { id: 'tiras-makinesi', name: 'Tıraş Makinesi', slug: 'tiras-makinesi' },
          { id: 'cep-telefonu', name: 'Cep Telefonu', slug: 'cep-telefonu' },
          { id: 'akilli-saat', name: 'Akıllı Saat', slug: 'akilli-saat' },
          { id: 'akilli-bileklik', name: 'Akıllı Bileklik', slug: 'akilli-bileklik' },
          { id: 'laptop', name: 'Laptop', slug: 'laptop' },
          { id: 'oyun-konsollar', name: 'Oyun & Konsollar', slug: 'oyun-konsollar' },
          { id: 'elektrikli-bisiklet', name: 'Elektrikli Bisiklet', slug: 'elektrikli-bisiklet' },
          { id: 'e-pin-cuzdan-kodu', name: 'E-pin ve Cüzdan Kodu', slug: 'e-pin-cuzdan-kodu' },
          { id: 'playstation-5', name: 'Playstation 5', slug: 'playstation-5' },
          { id: 'hediye-kartlari', name: 'Hediye Kartları', slug: 'hediye-kartlari' },
          { id: 'bluetooth-kulaklik', name: 'Bluetooth Kulaklık', slug: 'bluetooth-kulaklik' },
          { id: 'gaming-pc', name: 'Gaming PC', slug: 'gaming-pc' },
          { id: 'oyuncu-koltugu', name: 'Oyuncu Koltuğu', slug: 'oyuncu-koltugu' },
          { id: 'drone', name: 'Drone', slug: 'drone' }
        ]
      },
      {
        id: 'buyuk-beden',
        name: 'Büyük Beden',
        slug: 'buyuk-beden',
        children: [
          { id: 'buyuk-beden-sweatshirt', name: 'Büyük Beden Sweatshirt', slug: 'buyuk-beden-sweatshirt' },
          { id: 'buyuk-beden-t-shirt', name: 'Büyük Beden T-shirt', slug: 'buyuk-beden-t-shirt' },
          { id: 'buyuk-beden-gomlek', name: 'Büyük Beden Gömlek', slug: 'buyuk-beden-gomlek' },
          { id: 'buyuk-beden-pantolon', name: 'Büyük Beden Pantolon', slug: 'buyuk-beden-pantolon' },
          { id: 'buyuk-beden-mont', name: 'Büyük Beden Mont', slug: 'buyuk-beden-mont' },
          { id: 'buyuk-beden-kazak', name: 'Büyük Beden Kazak', slug: 'buyuk-beden-kazak' },
          { id: 'buyuk-beden-hirka', name: 'Büyük Beden Hırka', slug: 'buyuk-beden-hirka' },
          { id: 'buyuk-beden-kaban', name: 'Büyük Beden Kaban', slug: 'buyuk-beden-kaban' },
          { id: 'buyuk-beden-esofman', name: 'Büyük Beden Eşofman', slug: 'buyuk-beden-esofman' }
        ]
      }
    ]
  }
};

const ErkekStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: ErkekStaticCategoryDetailProps) => {
  const fallbackCategory = erkekStaticCategoryData[categorySlug] || null;
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
          {column.map((subCategory) => (
            <div key={subCategory.id} className="group">
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
          ))}
        </div>
      ))}
    </>
  );
};

export default ErkekStaticCategoryDetail;

