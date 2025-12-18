"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface AnneCocukStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Anne & Çocuk kategorisi için statik kategori verileri
const anneCocukStaticCategoryData: { [key: string]: Category } = {
  'anne-cocuk': {
    id: 'anne-cocuk',
    name: 'Anne & Çocuk',
    slug: 'anne-cocuk',
    children: [
      {
        id: 'bebek',
        name: 'Bebek',
        slug: 'bebek',
        children: [
          { id: 'bebek-takimlari', name: 'Bebek Takımları', slug: 'bebek-takimlari' },
          { id: 'ayakkabi', name: 'Ayakkabı', slug: 'ayakkabi' },
          { id: 'hastane-cikisi', name: 'Hastane Çıkışı', slug: 'hastane-cikisi' },
          { id: 'yenidogan-kiyafetleri', name: 'Yenidoğan Kıyafetleri', slug: 'yenidogan-kiyafetleri' },
          { id: 'tulum', name: 'Tulum', slug: 'tulum' },
          { id: 'body-zibin', name: 'Body & Zıbın', slug: 'body-zibin' },
          { id: 'tisort-atlet', name: 'Tişört & Atlet', slug: 'tisort-atlet' },
          { id: 'elbise', name: 'Elbise', slug: 'elbise' },
          { id: 'sort', name: 'Şort', slug: 'sort' },
          { id: 'bebek-patigi', name: 'Bebek Patiği', slug: 'bebek-patigi' },
          { id: 'hirka', name: 'Hırka', slug: 'hirka' },
          { id: 'battaniye', name: 'Battaniye', slug: 'battaniye' },
          { id: 'alt-ust-takim', name: 'Alt Üst Takım', slug: 'alt-ust-takim' },
          { id: 'tisort', name: 'Tişört', slug: 'tisort' },
          { id: 'etek', name: 'Etek', slug: 'etek' },
          { id: 'corap', name: 'Çorap', slug: 'corap' },
          { id: 'sapka', name: 'Şapka', slug: 'sapka' },
          { id: 'eldiven', name: 'Eldiven', slug: 'eldiven' },
          { id: 'esofman', name: 'Eşofman', slug: 'esofman' },
          { id: 'bere', name: 'Bere', slug: 'bere' }
        ]
      },
      {
        id: 'kiz-cocuk',
        name: 'Kız Çocuk',
        slug: 'kiz-cocuk',
        children: [
          { id: 'elbise', name: 'Elbise', slug: 'elbise' },
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 'esofman', name: 'Eşofman', slug: 'esofman' },
          { id: 'ic-giyim-pijama', name: 'İç Giyim & Pijama', slug: 'ic-giyim-pijama' },
          { id: 'tisort-atlet', name: 'Tişört & Atlet', slug: 'tisort-atlet' },
          { id: 'tayt', name: 'Tayt', slug: 'tayt' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'sort', name: 'Şort', slug: 'sort' },
          { id: 'mont', name: 'Mont', slug: 'mont' },
          { id: 'cocuk-oyun-evi', name: 'Çocuk Oyun Evi', slug: 'cocuk-oyun-evi' },
          { id: 'oyuncak-bebek', name: 'Oyuncak Bebek', slug: 'oyuncak-bebek' },
          { id: 'oyuncak-mutfak', name: 'Oyuncak Mutfak', slug: 'oyuncak-mutfak' },
          { id: 'kaban', name: 'Kaban', slug: 'kaban' },
          { id: 'abiye-elbise', name: 'Abiye & Elbise', slug: 'abiye-elbise' },
          { id: 'ceket', name: 'Ceket', slug: 'ceket' },
          { id: 'pantolon', name: 'Pantolon', slug: 'pantolon' },
          { id: 'kazak', name: 'Kazak', slug: 'kazak' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'sapka-bere-eldiven', name: 'Şapka & Bere & Eldiven', slug: 'sapka-bere-eldiven' }
        ]
      },
      {
        id: 'erkek-cocuk',
        name: 'Erkek Çocuk',
        slug: 'erkek-cocuk',
        children: [
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'spor-ayakkabi', name: 'Spor Ayakkabı', slug: 'spor-ayakkabi' },
          { id: 'esofman', name: 'Eşofman', slug: 'esofman' },
          { id: 'ic-giyim-pijama', name: 'İç Giyim & Pijama', slug: 'ic-giyim-pijama' },
          { id: 'tisort-atlet', name: 'Tişört & Atlet', slug: 'tisort-atlet' },
          { id: 'gunluk-ayakkabi', name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
          { id: 'okul-cantasi', name: 'Okul Çantası', slug: 'okul-cantasi' },
          { id: 'sort', name: 'Şort', slug: 'sort' },
          { id: 'gomlek', name: 'Gömlek', slug: 'gomlek' },
          { id: 'mont', name: 'Mont', slug: 'mont' },
          { id: 'oyuncak-traktor', name: 'Oyuncak Traktör', slug: 'oyuncak-traktor' },
          { id: 'akulu-araba', name: 'Akülü Araba', slug: 'akulu-araba' },
          { id: 'kumandali-araba', name: 'Kumandalı Araba', slug: 'kumandali-araba' },
          { id: 'bisiklet', name: 'Bisiklet', slug: 'bisiklet' },
          { id: 'boxer', name: 'Boxer', slug: 'boxer' },
          { id: 'iclik', name: 'İçlik', slug: 'iclik' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'krampon', name: 'Krampon', slug: 'krampon' },
          { id: 'sapka-bere-eldiven', name: 'Şapka & Bere & Eldiven', slug: 'sapka-bere-eldiven' },
          { id: 'takim-elbise', name: 'Takım Elbise', slug: 'takim-elbise' }
        ]
      },
      {
        id: 'bebek-bakim',
        name: 'Bebek Bakım',
        slug: 'bebek-bakim',
        children: [
          { id: 'bebek-bezi', name: 'Bebek Bezi', slug: 'bebek-bezi' },
          { id: 'bebek-sampuan', name: 'Bebek Şampuanı', slug: 'bebek-sampuan' },
          { id: 'krem-yaglar', name: 'Krem & Yağlar', slug: 'krem-yaglar' },
          { id: 'bebek-cantasi', name: 'Bebek Çantası', slug: 'bebek-cantasi' },
          { id: 'bebek-sabunlari', name: 'Bebek Sabunları', slug: 'bebek-sabunlari' },
          { id: 'bebek-deterjanlari', name: 'Bebek Deterjanları', slug: 'bebek-deterjanlari' },
          { id: 'bebek-vucut-kremi', name: 'Bebek Vücut Kremi', slug: 'bebek-vucut-kremi' },
          { id: 'islak-mendil', name: 'Islak Mendil', slug: 'islak-mendil' },
          { id: 'bebek-taragi', name: 'Bebek Tarağı', slug: 'bebek-taragi' },
          { id: 'bebek-yagi', name: 'Bebek Yağı', slug: 'bebek-yagi' },
          { id: 'bebek-buhar-makinesi', name: 'Bebek Buhar Makinesi', slug: 'bebek-buhar-makinesi' },
          { id: 'bebek-ates-olcer', name: 'Bebek Ateş Ölçer', slug: 'bebek-ates-olcer' }
        ]
      },
      {
        id: 'oyuncak',
        name: 'Oyuncak',
        slug: 'oyuncak',
        children: [
          { id: 'egitici-oyuncaklar', name: 'Eğitici Oyuncaklar', slug: 'egitici-oyuncaklar' },
          { id: 'oyuncak-araba', name: 'Oyuncak Araba', slug: 'oyuncak-araba' },
          { id: 'oyuncak-bebek', name: 'Oyuncak Bebek', slug: 'oyuncak-bebek' },
          { id: 'bebek-okul-oncesi', name: 'Bebek & Okul Öncesi', slug: 'bebek-okul-oncesi' },
          { id: 'kumandali-oyuncak', name: 'Kumandalı Oyuncak', slug: 'kumandali-oyuncak' },
          { id: 'robot-oyuncak', name: 'Robot Oyuncak', slug: 'robot-oyuncak' },
          { id: 'cocuk-cizim-tableti', name: 'Çocuk Çizim Tableti', slug: 'cocuk-cizim-tableti' }
        ]
      },
      {
        id: 'beslenme-emzirme',
        name: 'Beslenme Emzirme',
        slug: 'beslenme-emzirme',
        children: [
          { id: 'biberon-emzik', name: 'Biberon & Emzik', slug: 'biberon-emzik' },
          { id: 'gogus-pompasi', name: 'Göğüs Pompası', slug: 'gogus-pompasi' },
          { id: 'mama-sandalyesi', name: 'Mama Sandalyesi', slug: 'mama-sandalyesi' },
          { id: 'mama-onlugu', name: 'Mama Önlüğü', slug: 'mama-onlugu' },
          { id: 'alistirma-bardagi', name: 'Alıştırma Bardağı', slug: 'alistirma-bardagi' },
          { id: 'biberon-temizleyici', name: 'Biberon Temizleyici', slug: 'biberon-temizleyici' },
          { id: 'biberon-seti', name: 'Biberon Seti', slug: 'biberon-seti' },
          { id: 'bebek-mamasi', name: 'Bebek Maması', slug: 'bebek-mamasi' },
          { id: 'kavanoz-mama', name: 'Kavanoz Mama', slug: 'kavanoz-mama' },
          { id: 'sterilizator', name: 'Sterilizatör', slug: 'sterilizator' },
          { id: 'bebek-bakim-cantasi', name: 'Bebek Bakım Çantası', slug: 'bebek-bakim-cantasi' },
          { id: 'yemek-setleri', name: 'Yemek Setleri', slug: 'yemek-setleri' },
          { id: 'kasik-mamasi', name: 'Kaşık Maması', slug: 'kasik-mamasi' },
          { id: 'buharli-pisirici', name: 'Buharlı Pişirici', slug: 'buharli-pisirici' },
          { id: 'termal-canta', name: 'Termal Çanta', slug: 'termal-canta' },
          { id: 'sut-pompasi', name: 'Süt Pompası', slug: 'sut-pompasi' },
          { id: 'emzirme-onlugu', name: 'Emzirme Önlüğü', slug: 'emzirme-onlugu' },
          { id: 'emzirme-minderi', name: 'Emzirme Minderi', slug: 'emzirme-minderi' },
          { id: 'gogus-pedi', name: 'Göğüs Pedi', slug: 'gogus-pedi' },
          { id: 'gogus-kremi', name: 'Göğüs Kremi', slug: 'gogus-kremi' }
        ]
      }
    ]
  }
};

const AnneCocukStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: AnneCocukStaticCategoryDetailProps) => {
  const fallbackCategory = anneCocukStaticCategoryData[categorySlug] || null;
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

export default AnneCocukStaticCategoryDetail;

