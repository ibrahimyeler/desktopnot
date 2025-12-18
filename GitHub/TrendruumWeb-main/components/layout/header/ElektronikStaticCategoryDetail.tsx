"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface ElektronikStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Elektronik kategorisi için statik kategori verileri
const elektronikStaticCategoryData: { [key: string]: Category } = {
  'elektronik': {
    id: 'elektronik',
    name: 'Elektronik',
    slug: 'elektronik',
    children: [
      {
        id: 'kucuk-ev-aletleri',
        name: 'Küçük Ev Aletleri',
        slug: 'kucuk-ev-aletleri',
        children: [
          { id: 'supurge', name: 'Süpürge', slug: 'supurge' },
          { id: 'robot-supurge', name: 'Robot Süpürge', slug: 'robot-supurge' },
          { id: 'dikey-supurge', name: 'Dikey Süpürge', slug: 'dikey-supurge' },
          { id: 'utu', name: 'Ütü', slug: 'utu' },
          { id: 'kahve-makinesi', name: 'Kahve Makinesi', slug: 'kahve-makinesi' },
          { id: 'cay-makinesi', name: 'Çay Makinesi', slug: 'cay-makinesi' },
          { id: 'blender-seti', name: 'Blender Seti', slug: 'blender-seti' },
          { id: 'tost-makinesi', name: 'Tost Makinesi', slug: 'tost-makinesi' },
          { id: 'dograyici-rondo', name: 'Doğrayıcı & Rondo', slug: 'dograyici-rondo' },
          { id: 'su-isitic-kettle', name: 'Su Isıtıcı & Kettle', slug: 'su-isitic-kettle' },
          { id: 'mikser-mikser-seti', name: 'Mikser & Mikser Seti', slug: 'mikser-mikser-seti' },
          { id: 'airfryer-fritoz', name: 'Airfryer & Fritöz', slug: 'airfryer-fritoz' }
        ]
      },
  
      {
        id: 'telefon',
        name: 'Telefon',
        slug: 'telefon',
        children: [
          { id: 'cep-telefonu', name: 'Cep Telefonu', slug: 'cep-telefonu' },
          { id: 'android-cep-telefonlari', name: 'Android Cep Telefonları', slug: 'android-cep-telefonlari' },
          { id: 'iphone-cep-telefonu', name: 'iPhone Cep Telefonu', slug: 'iphone-cep-telefonu' },
          { id: 'telefon-kiliflari', name: 'Telefon Kılıfları', slug: 'telefon-kiliflari' },
          { id: 'sarc-cihazlari', name: 'Şarj Cihazları', slug: 'sarc-cihazlari' },
          { id: 'powerbank', name: 'Powerbank', slug: 'powerbank' },
          { id: 'arac-ici-telefon-tutucu', name: 'Araç İçi Telefon Tutucu', slug: 'arac-ici-telefon-tutucu' },
          { id: 'iphone-kiliflar', name: 'iPhone Kılıflar', slug: 'iphone-kiliflar' },
          { id: 'kulakliklar', name: 'Kulaklıklar', slug: 'kulakliklar' }
        ]
      },

      {
        id: 'tv-goruntu-ses',
        name: 'TV & Görüntü & Ses',
        slug: 'tv-goruntu-ses',
        children: [
          { id: 'televizyon', name: 'Televizyon', slug: 'televizyon' },
          { id: 'smart-tv', name: 'Smart TV', slug: 'smart-tv' },
          { id: 'qled-tv', name: 'QLED TV', slug: 'qled-tv' },
          { id: 'oled-tv', name: 'OLED TV', slug: 'oled-tv' },
          { id: 'tv-kumandalari', name: 'TV Kumandaları', slug: 'tv-kumandalari' },
          { id: 'soundbar', name: 'Soundbar', slug: 'soundbar' },
          { id: 'projeksiyon-cihazi', name: 'Projeksiyon Cihazı', slug: 'projeksiyon-cihazi' },
          { id: 'media-player', name: 'Media Player', slug: 'media-player' },
          { id: 'hoparlor', name: 'Hoparlör', slug: 'hoparlor' },
          { id: 'kulaklik', name: 'Kulaklık', slug: 'kulaklik' },
          { id: 'uydu-alicisi', name: 'Uydu Alıcısı', slug: 'uydu-alicisi' },
          { id: 'canak-anten', name: 'Çanak Anten', slug: 'canak-anten' },
          { id: 'hdmi-kablo', name: 'HDMI Kablo', slug: 'hdmi-kablo' },
          { id: 'akim-korumali-prizler', name: 'Akım Korumalı Prizler', slug: 'akim-korumali-prizler' },
          { id: 'kablo-adaptor', name: 'Kablo & Adaptör', slug: 'kablo-adaptor' },
          { id: 'lnb', name: 'LNB', slug: 'lnb' },
          { id: 'tv-ekran-koruyucu', name: 'TV Ekran Koruyucu', slug: 'tv-ekran-koruyucu' },
          { id: 'tv-aski-aparati', name: 'TV Askı Aparatı', slug: 'tv-aski-aparati' },
          { id: 'kablolu-hoparlor', name: 'Kablolu Hoparlör', slug: 'kablolu-hoparlor' }
        ]
      },
      {
        id: 'beyaz-esya',
        name: 'Beyaz Eşya',
        slug: 'beyaz-esya',
        children: [
          { id: 'buzdolabi', name: 'Buzdolabı', slug: 'buzdolabi' },
          { id: 'camasir-makinesi', name: 'Çamaşır Makinesi', slug: 'camasir-makinesi' },
          { id: 'bulasik-makinesi', name: 'Bulaşık Makinesi', slug: 'bulasik-makinesi' },
          { id: 'kurutma-makinesi', name: 'Kurutma Makinesi', slug: 'kurutma-makinesi' },
          { id: 'derin-dondurucu', name: 'Derin Dondurucu', slug: 'derin-dondurucu' },
          { id: 'ankastre-setler', name: 'Ankastre Setler', slug: 'ankastre-setler' },
          { id: 'kombi', name: 'Kombi', slug: 'kombi' },
          { id: 'mikrodalga-firin', name: 'Mikrodalga Fırın', slug: 'mikrodalga-firin' },
          { id: 'aspirator', name: 'Aspiratör', slug: 'aspirator' },
          { id: 'mini-midi-firin', name: 'Mini & Midi Fırın', slug: 'mini-midi-firin' },
          { id: 'ankastre-davlumbaz', name: 'Ankastre Davlumbaz', slug: 'ankastre-davlumbaz' },
          { id: 'ankastre-ocak', name: 'Ankastre Ocak', slug: 'ankastre-ocak' }
        ]
      },
      {
        id: 'bilgisayar-tablet',
        name: 'Bilgisayar & Tablet',
        slug: 'bilgisayar-tablet',
        children: [
          { id: 'bilgisayarlar', name: 'Bilgisayarlar', slug: 'bilgisayarlar' },
          { id: 'tablet', name: 'Tablet', slug: 'tablet' },
          { id: 'bilgisayar-bilesenleri', name: 'Bilgisayar Bileşenleri', slug: 'bilgisayar-bilesenleri' },
          { id: 'monitor', name: 'Monitör', slug: 'monitor' },
          { id: 'yazici-tarayici', name: 'Yazıcı & Tarayıcı', slug: 'yazici-tarayici' },
          { id: 'ag-modem', name: 'Ağ & Modem', slug: 'ag-modem' },
          { id: 'klavye', name: 'Klavye', slug: 'klavye' },
          { id: 'mouse', name: 'Mouse', slug: 'mouse' },
          { id: 'grafik-tablet', name: 'Grafik Tablet', slug: 'grafik-tablet' },
          { id: 'ssd', name: 'SSD', slug: 'ssd' },
          { id: 'ram', name: 'RAM', slug: 'ram' },
          { id: 'ekran-karti', name: 'Ekran Kartı', slug: 'ekran-karti' },
          { id: 'cocuk-cizim-tableti', name: 'Çocuk Çizim Tableti', slug: 'cocuk-cizim-tableti' }
        ]
      },
 
      {
        id: 'kisisel-bakim-aletleri',
        name: 'Kişisel Bakım Aletleri',
        slug: 'kisisel-bakim-aletleri',
        children: [
          { id: 'sac-duzlestirici', name: 'Saç Düzleştirici', slug: 'sac-duzlestirici' },
          { id: 'sac-masasi', name: 'Saç Maşası', slug: 'sac-masasi' },
          { id: 'sac-kurutma-makinesi', name: 'Saç Kurutma Makinesi', slug: 'sac-kurutma-makinesi' },
          { id: 'tiras-makinesi', name: 'Tıraş Makinesi', slug: 'tiras-makinesi' },
          { id: 'tarti', name: 'Tartı', slug: 'tarti' },
          { id: 'epilasyon-aletleri', name: 'Epilasyon Aletleri', slug: 'epilasyon-aletleri' },
          { id: 'ipl-lazer-epilasyon', name: 'IPL Lazer Epilasyon', slug: 'ipl-lazer-epilasyon' }
        ]
      }
    ]
  }
};

const ElektronikStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: ElektronikStaticCategoryDetailProps) => {
  const fallbackCategory = elektronikStaticCategoryData[categorySlug] || null;
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

export default ElektronikStaticCategoryDetail;

