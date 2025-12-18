"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface SporOutdoorStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Spor & Outdoor kategorisi için statik kategori verileri
const sporOutdoorStaticCategoryData: { [key: string]: Category } = {
  'spor-outdoor': {
    id: 'spor-outdoor',
    name: 'Spor & Outdoor',
    slug: 'spor-outdoor',
    children: [
      {
        id: 'spor-ust-giyim',
        name: 'Spor Üst Giyim',
        slug: 'spor-ust-giyim',
        children: [
          { id: 'spor-tisort', name: 'Spor Tişört', slug: 'spor-tisort' },
          { id: 'ceket-yelek', name: 'Ceket & Yelek', slug: 'ceket-yelek' },
          { id: 'yagmurluk', name: 'Yağmurluk', slug: 'yagmurluk' },
          { id: 'spor-sutyeni', name: 'Spor Sütyeni', slug: 'spor-sutyeni' },
          { id: 'sweatshirt', name: 'Sweatshirt', slug: 'sweatshirt' },
          { id: 'atlet', name: 'Atlet', slug: 'atlet' },
          { id: 'forma', name: 'Forma', slug: 'forma' },
          { id: 'spor-ceket', name: 'Spor Ceket', slug: 'spor-ceket' },
          { id: 'spor-sapka', name: 'Spor Şapka', slug: 'spor-sapka' },
          {
            id: 'spor-alt-giyim',
            name: 'Spor Alt Giyim',
            slug: 'spor-alt-giyim',
            children: [
              { id: 'esofman-takimi', name: 'Eşofman Takımı', slug: 'esofman-takimi' },
              { id: 'tayt', name: 'Tayt', slug: 'tayt' },
              { id: 'sort', name: 'Şort', slug: 'sort' },
              { id: 'iclik', name: 'İçlik', slug: 'iclik' },
              { id: 'corap', name: 'Çorap', slug: 'corap' },
              { id: 'spor-pantolon', name: 'Spor Pantolon', slug: 'spor-pantolon' },
              { id: 'terlik', name: 'Terlik', slug: 'terlik' },
              { id: 'esofman-alti', name: 'Eşofman Altı', slug: 'esofman-alti' }
            ]
          }
        ]
      },
      {
        id: 'spor-ayakkabi',
        name: 'Spor Ayakkabı',
        slug: 'spor-ayakkabi',
        children: [
          { id: 'sneaker', name: 'Sneaker', slug: 'sneaker' },
          { id: 'kosu-ayakkabisi', name: 'Koşu Ayakkabısı', slug: 'kosu-ayakkabisi' },
          { id: 'hali-saha-ayakkabisi', name: 'Halı Saha Ayakkabısı', slug: 'hali-saha-ayakkabisi' },
          { id: 'basketbol-ayakkabisi', name: 'Basketbol Ayakkabısı', slug: 'basketbol-ayakkabisi' },
          { id: 'yuruyus-ayakkabisi', name: 'Yürüyüş Ayakkabısı', slug: 'yuruyus-ayakkabisi' },
          {
            id: 'outdoor-ayakkabi',
            name: 'Outdoor Ayakkabı',
            slug: 'outdoor-ayakkabi',
            children: [
              { id: 'outdoor-sneaker', name: 'Outdoor Sneaker', slug: 'outdoor-sneaker' }
            ]
          },
          { id: 'tenis-ayakkabisi', name: 'Tenis Ayakkabısı', slug: 'tenis-ayakkabisi' },
          { id: 'voleybol-ayakkabisi', name: 'Voleybol Ayakkabısı', slug: 'voleybol-ayakkabisi' },
          { id: 'fitness-ayakkabisi', name: 'Fitness Ayakkabısı', slug: 'fitness-ayakkabisi' },
          { id: 'deniz-ayakkabisi', name: 'Deniz Ayakkabısı', slug: 'deniz-ayakkabisi' },
          {
            id: 'outdoor-bot',
            name: 'Outdoor Bot',
            slug: 'outdoor-bot',
            children: [
              { id: 'outdoor-bot-ayakkabi', name: 'Outdoor Bot Ayakkabı', slug: 'outdoor-bot-ayakkabi' }
            ]
          },
          { id: 'terlik', name: 'Terlik', slug: 'terlik' },
          { id: 'sandalet', name: 'Sandalet', slug: 'sandalet' },
          { id: 'bot', name: 'Bot', slug: 'bot' },
          { id: 'bot-ayakkabi', name: 'Bot Ayakkabı', slug: 'bot-ayakkabi' },
          { id: 'kar-botu', name: 'Kar Botu', slug: 'kar-botu' },
          { id: 'kayak-botu', name: 'Kayak Botu', slug: 'kayak-botu' },
          { id: 'snowboard-botu', name: 'Snowboard Botu', slug: 'snowboard-botu' },
          { id: 'havuz-terligi', name: 'Havuz Terliği', slug: 'havuz-terligi' }
        ]
      },
      {
        id: 'evde-spor-aletleri',
        name: 'Evde Spor Aletleri',
        slug: 'evde-spor-aletleri',
        children: [
          { id: 'direnc-bandi', name: 'Direnç Bandı', slug: 'direnc-bandi' },
          { id: 'el-sikistirici', name: 'El Sıkıştırıcı', slug: 'el-sikistirici' },
          { id: 'mat', name: 'Mat', slug: 'mat' },
          { id: 'antrenman-istasyonlari', name: 'Antrenman İstasyonları', slug: 'antrenman-istasyonlari' },
          { id: 'ip-atlama', name: 'İp Atlama', slug: 'ip-atlama' },
          { id: 'boks-eldiveni', name: 'Boks Eldiveni', slug: 'boks-eldiveni' },
          { id: 'dambıl-seti', name: 'Dambıl Seti', slug: 'dambıl-seti' },
          { id: 'elips-bisiklet', name: 'Elips Bisiklet', slug: 'elips-bisiklet' },
          { id: 'barfiks-bar', name: 'Barfiks Bar', slug: 'barfiks-bar' },
          { id: 'eldiven', name: 'Eldiven', slug: 'eldiven' },
          { id: 'kettlebell', name: 'Kettlebell', slug: 'kettlebell' },
          { id: 'bisiklet', name: 'Bisiklet', slug: 'bisiklet' },
          { id: 'kosu-bandi', name: 'Koşu Bandı', slug: 'kosu-bandi' },
          { id: 'pilates-topu', name: 'Pilates Topu', slug: 'pilates-topu' },
          { id: 'kurek-makinesi', name: 'Kürek Makinesi', slug: 'kurek-makinesi' },
          { id: 'boks-sargisi', name: 'Boks Sargısı', slug: 'boks-sargisi' },
          { id: 'crossfit', name: 'Crossfit', slug: 'crossfit' },
          { id: 'pilates-toplari', name: 'Pilates Topları', slug: 'pilates-toplari' }
        ]
      },
      {
        id: 'spor-malzemeleri',
        name: 'Spor Malzemeleri',
        slug: 'spor-malzemeleri',
        children: [
          {
            id: 'deniz-plaj',
            name: 'Deniz & Plaj',
            slug: 'deniz-plaj',
            children: [
              { id: 'plaj-havlu', name: 'Plaj Havlu', slug: 'plaj-havlu' },
              { id: 'plaj-semsiyesi', name: 'Plaj Şemsiyesi', slug: 'plaj-semsiyesi' }
            ]
          },
          { id: 'kaykay', name: 'Kaykay', slug: 'kaykay' },
          { id: 'paten', name: 'Paten', slug: 'paten' },
          {
            id: 'kamp-malzemeleri',
            name: 'Kamp Malzemeleri',
            slug: 'kamp-malzemeleri',
            children: [
              { id: 'kamp-cadiri', name: 'Kamp Çadırı', slug: 'kamp-cadiri' },
              { id: 'kamp-ocagi', name: 'Kamp Ocağı', slug: 'kamp-ocagi' },
              { id: 'kamp-lambasi', name: 'Kamp Lambası', slug: 'kamp-lambasi' }
            ]
          },
          {
            id: 'dagcilik-tirmanis',
            name: 'Dağcılık & Tırmanış',
            slug: 'dagcilik-tirmanis',
            children: [
              { id: 'tirmanis-ip', name: 'Tırmanış İpi', slug: 'tirmanis-ip' },
              { id: 'kaya-tirmanis', name: 'Kaya Tırmanış', slug: 'kaya-tirmanis' }
            ]
          },
          { id: 'aksiyon-kamerasi', name: 'Aksiyon Kamerası', slug: 'aksiyon-kamerasi' },
          {
            id: 'cadir-uyku-tulumu',
            name: 'Çadır Uyku Tulumu',
            slug: 'cadir-uyku-tulumu',
            children: [
              { id: 'uyku-tulumu', name: 'Uyku Tulumu', slug: 'uyku-tulumu' },
              { id: 'kamp-mat', name: 'Kamp Mat', slug: 'kamp-mat' }
            ]
          },
          {
            id: 'su-sporu-malzemeleri',
            name: 'Su Sporu Malzemeleri',
            slug: 'su-sporu-malzemeleri',
            children: [
              { id: 'su-kayagi', name: 'Su Kayığı', slug: 'su-kayagi' },
              { id: 'kucuk-tekne', name: 'Küçük Tekne', slug: 'kucuk-tekne' }
            ]
          },
          {
            id: 'dalis-malzemeleri',
            name: 'Dalış Malzemeleri',
            slug: 'dalis-malzemeleri',
            children: [
              { id: 'dalgiç-maskesi', name: 'Dalgıç Maskesi', slug: 'dalgiç-maskesi' },
              { id: 'palet', name: 'Palet', slug: 'palet' }
            ]
          },
          {
            id: 'balikcilik-malzemeleri',
            name: 'Balıkçılık Malzemeleri',
            slug: 'balikcilik-malzemeleri',
            children: [
              { id: 'olga-takimi', name: 'Olta Takımı', slug: 'olga-takimi' },
              { id: 'balikci-ekipmanlari', name: 'Balıkçı Ekipmanları', slug: 'balikci-ekipmanlari' }
            ]
          },
          { id: 'tenis-malzemeleri', name: 'Tenis Malzemeleri', slug: 'tenis-malzemeleri' },
          {
            id: 'kayak-snowboard',
            name: 'Kayak ve Snowboard',
            slug: 'kayak-snowboard',
            children: [
              { id: 'kayak-takimi', name: 'Kayak Takımı', slug: 'kayak-takimi' },
              { id: 'snowboard-takimi', name: 'Snowboard Takımı', slug: 'snowboard-takimi' }
            ]
          },
          { id: 'okculuk', name: 'Okçuluk', slug: 'okculuk' },
          {
            id: 'cadir',
            name: 'Çadır',
            slug: 'cadir',
            children: [
              { id: 'kamp-cadiri', name: 'Kamp Çadırı', slug: 'kamp-cadiri' },
              { id: 'karavan-cadiri', name: 'Karavan Çadırı', slug: 'karavan-cadiri' }
            ]
          },
          { id: 'havlu', name: 'Havlu', slug: 'havlu' },
          { id: 'sise', name: 'Şişe', slug: 'sise' },
          { id: 'matlar', name: 'Matlar', slug: 'matlar' },
          { id: 'bisiklet', name: 'Bisiklet', slug: 'bisiklet' },
          { id: 'termos', name: 'Termos', slug: 'termos' },
          { id: 'pilates-toplari', name: 'Pilates Topları', slug: 'pilates-toplari' }
        ]
      },
      {
        id: 'bisiklet',
        name: 'Bisiklet',
        slug: 'bisiklet',
        children: [
          { id: 'cocuk-bisikleti', name: 'Çocuk Bisikleti', slug: 'cocuk-bisikleti' },
          { id: 'elektrikli-bisiklet', name: 'Elektrikli Bisiklet', slug: 'elektrikli-bisiklet' },
          { id: 'bisikletci-ekipmanlari', name: 'Bisikletçi Ekipmanları', slug: 'bisikletci-ekipmanlari' },
          { id: 'bisiklet-gozlugu', name: 'Bisiklet Gözlüğü', slug: 'bisiklet-gozlugu' },
          { id: 'bisiklet-kask', name: 'Bisiklet Kask', slug: 'bisiklet-kask' },
          {
            id: 'fitness-kondisyon',
            name: 'Fitness Kondisyon',
            slug: 'fitness-kondisyon',
            children: [
              { id: 'pilates-ekipmanlari', name: 'Pilates Ekipmanları', slug: 'pilates-ekipmanlari' },
              { id: 'fitness-aletleri', name: 'Fitness Aletleri', slug: 'fitness-aletleri' },
              { id: 'antrenman-bisikleti', name: 'Antrenman Bisikleti', slug: 'antrenman-bisikleti' },
              { id: 'kosu-bandi', name: 'Koşu Bandı', slug: 'kosu-bandi' },
              { id: 'yoga-ekipmanlari', name: 'Yoga Ekipmanları', slug: 'yoga-ekipmanlari' },
              { id: 'dambıl-seti', name: 'Dambıl Seti', slug: 'dambıl-seti' },
              { id: 'agirlik-plakalari', name: 'Ağırlık Plakaları', slug: 'agirlik-plakalari' },
              { id: 'barfiks', name: 'Barfiks', slug: 'barfiks' }
            ]
          }
        ]
      },
      {
        id: 'sporcu-besinleri',
        name: 'Sporcu Besinleri',
        slug: 'sporcu-besinleri',
        children: [
          { id: 'protein-tozu', name: 'Protein Tozu', slug: 'protein-tozu' },
          { id: 'amino-asit', name: 'Amino Asit', slug: 'amino-asit' },
          { id: 'karbonhidrat', name: 'Karbonhidrat', slug: 'karbonhidrat' },
          { id: 'l-karnitin-cla', name: 'L-Carnitine (CLA)', slug: 'l-karnitin-cla' },
          { id: 'guc-performans', name: 'Güç ve Performans', slug: 'guc-performans' },
          { id: 'besin-takviyeleri-vitaminler', name: 'Besin Takviyeleri & Vitaminler', slug: 'besin-takviyeleri-vitaminler' },
          { id: 'kreatin', name: 'Kreatin', slug: 'kreatin' },
          { id: 'protein-bar', name: 'Protein Bar', slug: 'protein-bar' },
          { id: 'shaker', name: 'Shaker', slug: 'shaker' },
          {
            id: 'top',
            name: 'Top',
            slug: 'top',
            children: [
              { id: 'basketbol-topu', name: 'Basketbol Topu', slug: 'basketbol-topu' },
              { id: 'futbol-topu', name: 'Futbol Topu', slug: 'futbol-topu' }
            ]
          }
        ]
      }
    ]
  }
};

const SporOutdoorStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: SporOutdoorStaticCategoryDetailProps) => {
  const fallbackCategory = sporOutdoorStaticCategoryData[categorySlug] || null;
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

  // Alt kategorileri sütunlara böl (6 sütun - MegaMenu grid-cols-7 yapısına uygun)
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

export default SporOutdoorStaticCategoryDetail;

