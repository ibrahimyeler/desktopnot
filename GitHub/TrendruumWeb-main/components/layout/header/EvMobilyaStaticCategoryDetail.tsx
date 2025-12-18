"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface EvMobilyaStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Ev & Mobilya kategorisi için statik kategori verileri
const evMobilyaStaticCategoryData: { [key: string]: Category } = {
  'ev-mobilya': {
    id: 'ev-mobilya',
    name: 'Ev & Mobilya',
    slug: 'ev-mobilya',
    children: [
      {
        id: 'sofra-mutfak',
        name: 'Sofra & Mutfak',
        slug: 'sofra-mutfak',
        children: [
          { id: 'tencere-tencere-seti', name: 'Tencere & Tencere Seti', slug: 'tencere-tencere-seti' },
          { id: 'tava', name: 'Tava', slug: 'tava' },
          { id: 'duduklu-tencere', name: 'Düdüklü Tencere', slug: 'duduklu-tencere' },
          { id: 'yemek-takimi', name: 'Yemek Takımı', slug: 'yemek-takimi' },
          { id: 'kahvalti-takimi', name: 'Kahvaltı Takımı', slug: 'kahvalti-takimi' },
          { id: 'tabak', name: 'Tabak', slug: 'tabak' },
          { id: 'catal-kasik-bicak-seti', name: 'Çatal Kaşık Bıçak Seti', slug: 'catal-kasik-bicak-seti' },
          { id: 'saklama-kabi', name: 'Saklama Kabı', slug: 'saklama-kabi' },
          { id: 'bardak', name: 'Bardak', slug: 'bardak' },
          { id: 'kahve-fincani', name: 'Kahve Fincanı', slug: 'kahve-fincani' }
        ]
      },
      {
        id: 'ev-gerecleri',
        name: 'Ev Gereçleri',
        slug: 'ev-gerecleri',
        children: [
          { id: 'hurc', name: 'Hurç', slug: 'hurc' },
          { id: 'duzenleyiciler', name: 'Düzenleyiciler', slug: 'duzenleyiciler' },
          { id: 'aski', name: 'Askı', slug: 'aski' },
          { id: 'camasir-sepeti', name: 'Çamaşır Sepeti', slug: 'camasir-sepeti' },
          { id: 'banyo-duzenleyici', name: 'Banyo Düzenleyici', slug: 'banyo-duzenleyici' },
          { id: 'banyo-setleri', name: 'Banyo Setleri', slug: 'banyo-setleri' },
          { id: 'utu-masasi-aksesuarlari', name: 'Ütü Masası ve Aksesuarları', slug: 'utu-masasi-aksesuarlari' },
          { id: 'makyaj-taki-organizeri', name: 'Makyaj & Takı Organizeri', slug: 'makyaj-taki-organizeri' }
        ]
      },
      {
        id: 'ev-tekstili',
        name: 'Ev Tekstili',
        slug: 'ev-tekstili',
        children: [
          { id: 'nevresim-pike-takimi', name: 'Nevresim & Pike Takımı', slug: 'nevresim-pike-takimi' },
          { id: 'yastik-yorgan', name: 'Yastık & Yorgan', slug: 'yastik-yorgan' },
          { id: 'carsaf-alez', name: 'Çarşaf & Alez', slug: 'carsaf-alez' },
          { id: 'yatak-ortusu-battaniye', name: 'Yatak Örtüsü & Battaniye', slug: 'yatak-ortusu-battaniye' },
          { id: 'uyku-seti', name: 'Uyku Seti', slug: 'uyku-seti' },
          { id: 'koltuk-ortusu', name: 'Koltuk Örtüsü', slug: 'koltuk-ortusu' },
          { id: 'havlu-bornoz', name: 'Havlu & Bornoz', slug: 'havlu-bornoz' },
          { id: 'banyo-paspasi', name: 'Banyo Paspası', slug: 'banyo-paspasi' },
          { id: 'hali-kilim', name: 'Halı & Kilim', slug: 'hali-kilim' },
          { id: 'perde', name: 'Perde', slug: 'perde' },
          { id: 'seccade', name: 'Seccade', slug: 'seccade' },
          {
            id: 'ev-dekorasyon',
            name: 'Ev Dekorasyon',
            slug: 'ev-dekorasyon',
            children: [
              { id: 'ayna', name: 'Ayna', slug: 'ayna' },
              { id: 'tablo', name: 'Tablo', slug: 'tablo' },
              { id: 'dekoratif-cicek-vazo', name: 'Dekoratif Çiçek & Vazo', slug: 'dekoratif-cicek-vazo' },
              { id: 'kirlent-kirlent-kilifi', name: 'Kırlent & Kırlent Kılıfı', slug: 'kirlent-kirlent-kilifi' },
              { id: 'duvar-saati', name: 'Duvar Saati', slug: 'duvar-saati' },
              { id: 'oda-kokusu-mum', name: 'Oda Kokusu & Mum', slug: 'oda-kokusu-mum' },
              { id: 'Trendruum-sanat', name: 'Trendruum Sanat', slug: 'trendruum-sanat' }
            ]
          }
        ]
      },
      {
        id: 'aydinlatma',
        name: 'Aydınlatma',
        slug: 'aydinlatma',
        children: [
          { id: 'avize', name: 'Avize', slug: 'avize' },
          { id: 'lambader', name: 'Lambader', slug: 'lambader' },
          { id: 'masa-gece-lambasi', name: 'Masa ve Gece Lambası', slug: 'masa-gece-lambasi' }
        ]
      },
      {
        id: 'mobilya',
        name: 'Mobilya',
        slug: 'mobilya',
        children: [
          { id: 'salon-oturma-odasi', name: 'Salon & Oturma Odası', slug: 'salon-oturma-odasi' },
          { id: 'yatak-odasi', name: 'Yatak Odası', slug: 'yatak-odasi' },
          { id: 'bahce-mobilyasi', name: 'Bahçe Mobilyası', slug: 'bahce-mobilyasi' },
          { id: 'calisma-odasi', name: 'Çalışma Odası', slug: 'calisma-odasi' },
          { id: 'yemek-odasi', name: 'Yemek Odası', slug: 'yemek-odasi' },
          { id: 'oturma-gruplari', name: 'Oturma Grupları', slug: 'oturma-gruplari' },
          { id: 'genc-odasi', name: 'Genç Odası', slug: 'genc-odasi' },
          { id: 'koltuk-takimi', name: 'Koltuk Takımı', slug: 'koltuk-takimi' },
          { id: 'mutfak-dolabi', name: 'Mutfak Dolabı', slug: 'mutfak-dolabi' },
          { id: 'sifonyer', name: 'Şifonyer', slug: 'sifonyer' },
          { id: 'mutfak-tezgahi', name: 'Mutfak Tezgahı', slug: 'mutfak-tezgahi' },
          { id: 'dolap', name: 'Dolap', slug: 'dolap' },
          { id: 'gardrop', name: 'Gardırop', slug: 'gardrop' },
          { id: 'sandalye', name: 'Sandalye', slug: 'sandalye' },
          { id: 'zigon', name: 'Zigon', slug: 'zigon' }
        ]
      }
    ]
  }
};

const EvMobilyaStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: EvMobilyaStaticCategoryDetailProps) => {
  const fallbackCategory = evMobilyaStaticCategoryData[categorySlug] || null;
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

export default EvMobilyaStaticCategoryDetail;

