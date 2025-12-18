"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface KozmetikStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Kozmetik kategorisi için statik kategori verileri
const kozmetikStaticCategoryData: { [key: string]: Category } = {
  'kozmetik': {
    id: 'kozmetik',
    name: 'Kozmetik',
    slug: 'kozmetik',
    children: [
      {
        id: 'makyaj',
        name: 'Makyaj',
        slug: 'makyaj',
        children: [
          { id: 'goz-makyaji', name: 'Göz Makyajı', slug: 'goz-makyaji' },
          { id: 'ten-makyaji', name: 'Ten Makyajı', slug: 'ten-makyaji' },
          { id: 'dudak-makyaji', name: 'Dudak Makyajı', slug: 'dudak-makyaji' },
          { id: 'makyaj-seti', name: 'Makyaj Seti', slug: 'makyaj-seti' },
          { id: 'oje-aseton', name: 'Oje & Aseton', slug: 'oje-aseton' },
          { id: 'fondoten', name: 'Fondöten', slug: 'fondoten' },
          { id: 'ruj', name: 'Ruj', slug: 'ruj' },
          { id: 'dudak-kalemi', name: 'Dudak Kalemi', slug: 'dudak-kalemi' },
          { id: 'maskara', name: 'Maskara', slug: 'maskara' },
          { id: 'eyeliner', name: 'Eyeliner', slug: 'eyeliner' },
          { id: 'goz-kalemi', name: 'Göz Kalemi', slug: 'goz-kalemi' },
          { id: 'kapatıcılar', name: 'Kapatıcılar', slug: 'kapatıcılar' },
          { id: 'allik', name: 'Allık', slug: 'allik' },
          { id: 'highlighter', name: 'Highlighter', slug: 'highlighter' },
          { id: 'bb-cc-krem', name: 'BB & CC Krem', slug: 'bb-cc-krem' },
          { id: 'kontur-paletler', name: 'Kontür ve Paletler', slug: 'kontur-paletler' },
          { id: 'bronzer', name: 'Bronzer', slug: 'bronzer' },
          { id: 'pudra', name: 'Pudra', slug: 'pudra' },
          { id: 'takma-tirnak', name: 'Takma Tırnak', slug: 'takma-tirnak' },
          { id: 'far-paleti', name: 'Far Paleti', slug: 'far-paleti' }
        ]
      },
      {
        id: 'cilt-bakimi',
        name: 'Cilt Bakımı',
        slug: 'cilt-bakimi',
        children: [
          { id: 'yuz-kremi', name: 'Yüz Kremi', slug: 'yuz-kremi' },
          { id: 'yuz-temizleme', name: 'Yüz Temizleme', slug: 'yuz-temizleme' },
          { id: 'yuz-maskesi', name: 'Yüz Maskesi', slug: 'yuz-maskesi' },
          { id: 'goz-bakimi', name: 'Göz Bakımı', slug: 'goz-bakimi' },
          { id: 'gunes-koruyucu', name: 'Güneş Koruyucu', slug: 'gunes-koruyucu' },
          { id: 'cilt-serumu', name: 'Cilt Serumu', slug: 'cilt-serumu' },
          { id: 'el-ayak-bakimi', name: 'El & Ayak Bakımı', slug: 'el-ayak-bakimi' },
          { id: 'tonikler', name: 'Tonikler', slug: 'tonikler' },
          { id: 'nemlendiriciler', name: 'Nemlendiriciler', slug: 'nemlendiriciler' },
          { id: 'yuz-maskeleri', name: 'Yüz Maskeleri', slug: 'yuz-maskeleri' },
          { id: 'peeling', name: 'Peeling', slug: 'peeling' },
          { id: 'el-kremleri', name: 'El Kremleri', slug: 'el-kremleri' },
          { id: 'vucut-losyonlari', name: 'Vücut Losyonları', slug: 'vucut-losyonlari' },
          { id: 'selulit-kremleri', name: 'Selülit Kremleri', slug: 'selulit-kremleri' },
          { id: 'makyaj-temizleyici', name: 'Makyaj Temizleyici', slug: 'makyaj-temizleyici' },
          { id: 'gunes-kremleri', name: 'Güneş Kremleri', slug: 'gunes-kremleri' },
          { id: 'at-kili-fircalari', name: 'At Kılı Fırçaları', slug: 'at-kili-fircalari' },
          { id: 'bronzlastiricilar', name: 'Bronzlaştırıcılar', slug: 'bronzlastiricilar' },
          { id: 'cilt-sikilastiricilar', name: 'Cilt Sıkılaştırıcılar', slug: 'cilt-sikilastiricilar' },
          { id: 'vucut-spreyleri', name: 'Vücut Spreyleri', slug: 'vucut-spreyleri' }
        ]
      },
      {
        id: 'sac-bakimi',
        name: 'Saç Bakımı',
        slug: 'sac-bakimi',
        children: [
          { id: 'sampuan', name: 'Şampuan', slug: 'sampuan' },
          { id: 'sac-sekillendirici', name: 'Saç Şekillendirici', slug: 'sac-sekillendirici' },
          { id: 'sac-serumu-maskesi', name: 'Saç Serumu & Maskesi', slug: 'sac-serumu-maskesi' },
          { id: 'sac-boyasi', name: 'Saç Boyası', slug: 'sac-boyasi' },
          { id: 'mor-sampuan', name: 'Mor Şampuan', slug: 'mor-sampuan' },
          { id: 'kuru-sampuan', name: 'Kuru Şampuan', slug: 'kuru-sampuan' },
          { id: 'sac-kopugu', name: 'Saç Köpüğü', slug: 'sac-kopugu' },
          { id: 'sac-kremi', name: 'Saç Kremi', slug: 'sac-kremi' },
          { id: 'sac-bakim-yagi', name: 'Saç Bakım Yağı', slug: 'sac-bakim-yagi' },
          { id: 'fon-suyu', name: 'Fön Suyu', slug: 'fon-suyu' },
          { id: 'sac-bakim-spreyi', name: 'Saç Bakım Spreyi', slug: 'sac-bakim-spreyi' },
          { id: 'renk-acici', name: 'Renk Açıcı', slug: 'renk-acici' },
          { id: 'gecici-sac-boyalari', name: 'Geçici Saç Boyaları', slug: 'gecici-sac-boyalari' },
          { id: 'sac-makasi', name: 'Saç Makası', slug: 'sac-makasi' },
          { id: 'tarak', name: 'Tarak', slug: 'tarak' },
          { id: 'sac-bantlari', name: 'Saç Bantları', slug: 'sac-bantlari' },
          { id: 'toka', name: 'Toka', slug: 'toka' },
          { id: 'sac-vitamini', name: 'Saç Vitamini', slug: 'sac-vitamini' },
          { id: 'sac-tonigi', name: 'Saç Toniği', slug: 'sac-tonigi' },
          { id: 'wax', name: 'Wax', slug: 'wax' }
        ]
      },
      {
        id: 'kisisel-bakim',
        name: 'Kişisel Bakım',
        slug: 'kisisel-bakim',
        children: [
          { id: 'dus-jelleri', name: 'Duş Jelleri', slug: 'dus-jelleri' },
          { id: 'banyo-sabunlari', name: 'Banyo Sabunları', slug: 'banyo-sabunlari' },
          { id: 'sampuan', name: 'Şampuan', slug: 'sampuan' },
          { id: 'pamuk', name: 'Pamuk', slug: 'pamuk' },
          { id: 'vucut-spreyleri', name: 'Vücut Spreyleri', slug: 'vucut-spreyleri' },
          { id: 'parfum', name: 'Parfüm', slug: 'parfum' },
          { id: 'deodorant', name: 'Deodorant', slug: 'deodorant' },
          { id: 'agiz-bakim-suyu', name: 'Ağız Bakım Suyu', slug: 'agiz-bakim-suyu' },
          { id: 'dis-fircasi', name: 'Diş Fırçası', slug: 'dis-fircasi' },
          { id: 'dis-macunu', name: 'Diş Macunu', slug: 'dis-macunu' },
          { id: 'dis-ipi', name: 'Diş İpi', slug: 'dis-ipi' },
          { id: 'sarjli-dis-fircalari', name: 'Şarjlı Diş Fırçaları', slug: 'sarjli-dis-fircalari' },
          { id: 'torpuler', name: 'Törpüler', slug: 'torpuler' },
          { id: 'kas-makasi', name: 'Kaş Makası', slug: 'kas-makasi' },
          { id: 'gunluk-ped', name: 'Günlük Ped', slug: 'gunluk-ped' },
          { id: 'mesane-pedi', name: 'Mesane Pedi', slug: 'mesane-pedi' },
          { id: 'kese', name: 'Kese', slug: 'kese' },
          { id: 'banyo-lifi', name: 'Banyo Lifi', slug: 'banyo-lifi' },
          { id: 'dis-beyazlatici', name: 'Diş Beyazlatıcı', slug: 'dis-beyazlatici' },
          { id: 'gida-takviyeleri', name: 'Gıda Takviyeleri', slug: 'gida-takviyeleri' }
        ]
      },
      {
        id: 'epilasyon-tiras',
        name: 'Epilasyon & Tıraş',
        slug: 'epilasyon-tiras',
        children: [
          { id: 'tuy-dokucu', name: 'Tüy Dökücü', slug: 'tuy-dokucu' },
          { id: 'agda', name: 'Ağda', slug: 'agda' },
          { id: 'tiras-bicagi', name: 'Tıraş Bıçağı', slug: 'tiras-bicagi' },
          { id: 'epilator', name: 'Epilatör', slug: 'epilator' },
          { id: 'tiras-kopugu', name: 'Tıraş Köpüğü', slug: 'tiras-kopugu' },
          { id: 'agda-bantlari', name: 'Ağda Bantları', slug: 'agda-bantlari' },
          { id: 'tuy-dokucu-krem', name: 'Tüy Dökücü Krem', slug: 'tuy-dokucu-krem' }
        ]
      },
      {
        id: 'genel-bakim',
        name: 'Genel Bakım',
        slug: 'genel-bakim',
        children: [
          { id: 'cinsel-saglik', name: 'Cinsel Sağlık', slug: 'cinsel-saglik' },
          { id: 'hijyenik-ped', name: 'Hijyenik Ped', slug: 'hijyenik-ped' },
          { id: 'vucut-bakimi', name: 'Vücut Bakımı', slug: 'vucut-bakimi' },
          { id: 'el-ayak-bakimi', name: 'El ve Ayak Bakımı', slug: 'el-ayak-bakimi' },
          { id: 'dus-jeli-kremi', name: 'Duş Jeli ve Kremi', slug: 'dus-jeli-kremi' },
          { id: 'bakim-yaglari', name: 'Bakım Yağları', slug: 'bakim-yaglari' },
          { id: 'ayak-torpuleri', name: 'Ayak Törpüleri', slug: 'ayak-torpuleri' },
          { id: 'kati-sabun', name: 'Katı Sabun', slug: 'kati-sabun' },
          { id: 'sivi-sabun', name: 'Sıvı Sabun', slug: 'sivi-sabun' },
          { id: 'pamuk', name: 'Pamuk', slug: 'pamuk' },
          { id: 'el-dezenfektani', name: 'El Dezenfektanı', slug: 'el-dezenfektani' }
        ]
      }
    ]
  }
};

const KozmetikStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: KozmetikStaticCategoryDetailProps) => {
  const fallbackCategory = kozmetikStaticCategoryData[categorySlug] || null;
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

export default KozmetikStaticCategoryDetail;

