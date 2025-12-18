"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface SupermarketStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Süpermarket kategorisi için statik kategori verileri
const supermarketStaticCategoryData: { [key: string]: Category } = {
  'supermarket': {
    id: 'supermarket',
    name: 'Süpermarket & Petshop',
    slug: 'supermarket',
    children: [
      {
        id: 'ev-temizlik',
        name: 'Ev & Temizlik',
        slug: 'ev-temizlik',
        children: [
          { id: 'camasir-yikama', name: 'Çamaşır Yıkama', slug: 'camasir-yikama' },
          { id: 'bulasik-yikama', name: 'Bulaşık Yıkama', slug: 'bulasik-yikama' },
          { id: 'paspas-mop', name: 'Paspas & Mop', slug: 'paspas-mop' },
          { id: 'camasir-deterjani', name: 'Çamaşır Deterjanı', slug: 'camasir-deterjani' },
          { id: 'bulasik-deterjani', name: 'Bulaşık Deterjanı', slug: 'bulasik-deterjani' },
          { id: 'oda-kokusu', name: 'Oda Kokusu', slug: 'oda-kokusu' },
          { id: 'banyo-temizleyiciler', name: 'Banyo Temizleyiciler', slug: 'banyo-temizleyiciler' },
          { id: 'yumusatici', name: 'Yumuşatıcı', slug: 'yumusatici' },
          { id: 'islak-mendil', name: 'Islak Mendil', slug: 'islak-mendil' },
          { id: 'tuvalet-kagidi', name: 'Tuvalet Kağıdı', slug: 'tuvalet-kagidi' },
          { id: 'kagit-havlu', name: 'Kağıt Havlu', slug: 'kagit-havlu' },
          { id: 'temizlik-bezi', name: 'Temizlik Bezi', slug: 'temizlik-bezi' }
        ]
      },
      {
        id: 'kisisel-bakim',
        name: 'Kişisel Bakım',
        slug: 'kisisel-bakim',
        children: [
          { id: 'sac-bakim', name: 'Saç Bakım', slug: 'sac-bakim' },
          { id: 'agda-epilasyon', name: 'Ağda & Epilasyon', slug: 'agda-epilasyon' },
          { id: 'banyo-dus', name: 'Banyo & Duş', slug: 'banyo-dus' },
          { id: 'agiz-bakim', name: 'Ağız Bakım', slug: 'agiz-bakim' },
          { id: 'cilt-bakim', name: 'Cilt Bakım', slug: 'cilt-bakim' },
          { id: 'vucut-bakim', name: 'Vücut Bakım', slug: 'vucut-bakim' },
          { id: 'deodorant-roll-on', name: 'Deodorant ve Roll on', slug: 'deodorant-roll-on' },
          { id: 'sarjli-dis-fircalari', name: 'Şarjlı Diş Fırçaları', slug: 'sarjli-dis-fircalari' },
          { id: 'kadin-hijyen', name: 'Kadın Hijyen', slug: 'kadin-hijyen' },
          { id: 'kolonya', name: 'Kolonya', slug: 'kolonya' },
          { id: 'tiras-urunleri', name: 'Tıraş Ürünleri', slug: 'tiras-urunleri' },
          { id: 'gunes-urunleri', name: 'Güneş Ürünleri', slug: 'gunes-urunleri' }
        ]
      },
      {
        id: 'bebek-bakim',
        name: 'Bebek Bakım',
        slug: 'bebek-bakim',
        children: [
          { id: 'sut-artirici-icecekler', name: 'Süt Arttırıcı İçecekler', slug: 'sut-artirici-icecekler' },
          { id: 'bebek-ek-besin', name: 'Bebek Ek Besin', slug: 'bebek-ek-besin' },
          { id: 'bebek-bezi', name: 'Bebek Bezi', slug: 'bebek-bezi' },
          { id: 'islak-mendil-havlu', name: 'Islak Mendil & Havlu', slug: 'islak-mendil-havlu' },
          { id: 'bebek-kozmetik', name: 'Bebek Kozmetik', slug: 'bebek-kozmetik' },
          { id: 'bebek-burun-aspiratoru', name: 'Bebek Burun Aspiratörü', slug: 'bebek-burun-aspiratoru' },
          { id: 'bebek-dis-fircasi', name: 'Bebek Diş Fırçası', slug: 'bebek-dis-fircasi' },
          { id: 'bebek-mamalari', name: 'Bebek Mamaları', slug: 'bebek-mamalari' },
          { id: 'bebek-dis-macunu', name: 'Bebek Diş Macunu', slug: 'bebek-dis-macunu' },
          { id: 'bebek-temizleme-pamuğu', name: 'Bebek Temizleme Pamuğu', slug: 'bebek-temizleme-pamuğu' },
          { id: 'bebek-gunes-kremi', name: 'Bebek Güneş Kremi', slug: 'bebek-gunes-kremi' },
          { id: 'bebek-pudrasi', name: 'Bebek Pudrası', slug: 'bebek-pudrasi' },
          { id: 'bebek-tirnak-makasi', name: 'Bebek Tırnak Makası', slug: 'bebek-tirnak-makasi' },
          { id: 'bebek-yagi', name: 'Bebek Yağı', slug: 'bebek-yagi' },
          { id: 'bebek-bakim-seti', name: 'Bebek Bakım Seti', slug: 'bebek-bakim-seti' },
          { id: 'bebek-sampuan', name: 'Bebek Şampuanı', slug: 'bebek-sampuan' },
          { id: 'bebek-kolonyasi', name: 'Bebek Kolonyası', slug: 'bebek-kolonyasi' },
          { id: 'bebek-bakim-ortusu', name: 'Bebek Bakım Örtüsü', slug: 'bebek-bakim-ortusu' },
          { id: 'bebek-ates-olcer', name: 'Bebek Ateş Ölçer', slug: 'bebek-ates-olcer' }
        ]
      },
      {
        id: 'gida-icecek',
        name: 'Gıda ve İçecek',
        slug: 'gida-icecek',
        children: [
          { id: 'cay', name: 'Çay', slug: 'cay' },
          { id: 'ozel-gida', name: 'Özel Gıda', slug: 'ozel-gida' },
          { id: 'atistirmalik', name: 'Atıştırmalık', slug: 'atistirmalik' },
          { id: 'kahvaltilik', name: 'Kahvaltılık', slug: 'kahvaltilik' },
          { id: 'kuru-gida', name: 'Kuru Gıda', slug: 'kuru-gida' },
          { id: 'kahve', name: 'Kahve', slug: 'kahve' },
          { id: 'makarna', name: 'Makarna', slug: 'makarna' },
          { id: 'salca', name: 'Salça', slug: 'salca' },
          { id: 'sivi-yag', name: 'Sıvı Yağ', slug: 'sivi-yag' },
          { id: 'un', name: 'Un', slug: 'un' },
          { id: 'tuz-baharat', name: 'Tuz & Baharat', slug: 'tuz-baharat' },
          { id: 'corba', name: 'Çorba', slug: 'corba' },
          { id: 'gevrek', name: 'Gevrek', slug: 'gevrek' },
          { id: 'yulaf', name: 'Yulaf', slug: 'yulaf' },
          { id: 'konserve', name: 'Konserve', slug: 'konserve' },
          { id: 'seker', name: 'Şeker', slug: 'seker' },
          { id: 'sut', name: 'Süt', slug: 'sut' },
          { id: 'pasta-suslemeleri', name: 'Pasta Süslemeleri', slug: 'pasta-suslemeleri' },
          { id: 'bitki-caylari', name: 'Bitki Çayları', slug: 'bitki-caylari' },
          { id: 'gazsiz-icecekler', name: 'Gazsız İçecekler', slug: 'gazsiz-icecekler' }
        ]
      },
      {
        id: 'atistirmalik',
        name: 'Atıştırmalık',
        slug: 'atistirmalik',
        children: [
          { id: 'kuru-meyve', name: 'Kuru Meyve', slug: 'kuru-meyve' },
          { id: 'kuruyemis', name: 'Kuruyemiş', slug: 'kuruyemis' },
          { id: 'cips', name: 'Cips', slug: 'cips' },
          { id: 'cikolata', name: 'Çikolata', slug: 'cikolata' },
          { id: 'gofret', name: 'Gofret', slug: 'gofret' },
          { id: 'biskuvi', name: 'Bisküvi', slug: 'biskuvi' },
          { id: 'kraker', name: 'Kraker', slug: 'kraker' },
          { id: 'sekerleme', name: 'Şekerleme', slug: 'sekerleme' },
          { id: 'sakiz', name: 'Sakız', slug: 'sakiz' },
          { id: 'protein-bar', name: 'Protein Bar', slug: 'protein-bar' },
          { id: 'saglikli-atistirmaliklar', name: 'Sağlıklı Atıştırmalıklar', slug: 'saglikli-atistirmaliklar' },
          { id: 'unlu-mamuller', name: 'Unlu Mamüller', slug: 'unlu-mamuller' },
          { id: 'kek', name: 'Kek', slug: 'kek' }
        ]
      },
      {
        id: 'petshop',
        name: 'Petshop',
        slug: 'petshop',
        children: [
          { id: 'kedi-mamasi', name: 'Kedi Maması', slug: 'kedi-mamasi' },
          { id: 'kedi-kumu', name: 'Kedi Kumu', slug: 'kedi-kumu' },
          { id: 'kopek-mamasi', name: 'Köpek Maması', slug: 'kopek-mamasi' },
          { id: 'kedi-vitamini', name: 'Kedi Vitamini', slug: 'kedi-vitamini' },
          { id: 'kopek-tasmasi', name: 'Köpek Tasması', slug: 'kopek-tasmasi' },
          { id: 'kus-urunleri', name: 'Kuş Ürünleri', slug: 'kus-urunleri' },
          { id: 'akvaryum-urunleri', name: 'Akvaryum Ürünleri', slug: 'akvaryum-urunleri' },
          { id: 'kedi-box-tasima-cantasi', name: 'Kedi Box & Taşıma Çantası', slug: 'kedi-box-tasima-cantasi' },
          { id: 'kedi-kopek-oyuncaklari', name: 'Kedi ve Köpek Oyuncakları', slug: 'kedi-kopek-oyuncaklari' },
          { id: 'kedi-yas-mamalari', name: 'Kedi Yaş Mamaları', slug: 'kedi-yas-mamalari' },
          { id: 'kedi-odul-mamalari', name: 'Kedi Ödül Mamaları', slug: 'kedi-odul-mamalari' },
          { id: 'kopek-odul-mamalari', name: 'Köpek Ödül Mamaları', slug: 'kopek-odul-mamalari' },
          { id: 'kisir-kedi-mamalari', name: 'Kısır Kedi Mamaları', slug: 'kisir-kedi-mamalari' },
          { id: 'kedi-sampuan', name: 'Kedi Şampuanı', slug: 'kedi-sampuan' },
          { id: 'su-mama-kaplari', name: 'Su ve Mama Kapları', slug: 'su-mama-kaplari' },
          { id: 'kus-yemleri', name: 'Kuş Yemleri', slug: 'kus-yemleri' },
          { id: 'kedi-kopek-yataklari', name: 'Kedi ve Köpek Yatakları', slug: 'kedi-kopek-yataklari' },
          { id: 'yavru-kedi-mamalari', name: 'Yavru Kedi Mamaları', slug: 'yavru-kedi-mamalari' },
          { id: 'akvaryum-balik-yemi', name: 'Akvaryum Balık Yemi', slug: 'akvaryum-balik-yemi' },
          { id: 'kedi-tuvaleti', name: 'Kedi Tuvaleti', slug: 'kedi-tuvaleti' },
          { id: 'kedi-firca-taragi', name: 'Kedi Fırça ve Tarağı', slug: 'kedi-firca-taragi' }
        ]
      }
    ]
  }
};

const SupermarketStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: SupermarketStaticCategoryDetailProps) => {
  const fallbackCategory = supermarketStaticCategoryData[categorySlug] || null;
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

export default SupermarketStaticCategoryDetail;

