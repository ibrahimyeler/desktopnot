"use client";

import Link from 'next/link';
import React from 'react';
import type { MenuSection } from '@/app/context/MenuContext';
import { buildCategoryTree, type CategoryNode } from './menuUtils';

interface Category extends CategoryNode {}

interface KitapKirtasiyeHobiStaticCategoryDetailProps {
  categorySlug: string;
  categories: Category[];
  navigationLinks?: any[];
  menuSections?: Record<string, MenuSection>;
}

// Kitap & Kırtasiye & Hobi kategorisi için statik kategori verileri
const kitapKirtasiyeHobiStaticCategoryData: { [key: string]: Category } = {
  'kitap-kirtasiye-hobi': {
    id: 'kitap-kirtasiye-hobi',
    name: 'Kitap & Kırtasiye & Hobi',
    slug: 'kitap-kirtasiye-hobi',
    children: [
      {
        id: 'kirtasiye-malzemeleri',
        name: 'Kırtasiye Malzemeleri',
        slug: 'kirtasiye-malzemeleri',
        children: [
          { id: 'defter', name: 'Defter', slug: 'defter' },
          { id: 'ajanda', name: 'Ajanda', slug: 'ajanda' },
          { id: 'etiket', name: 'Etiket', slug: 'etiket' },
          { id: 'suluk-matara', name: 'Suluk & Matara', slug: 'suluk-matara' },
          { id: 'yazi-tahtasi', name: 'Yazı Tahtası', slug: 'yazi-tahtasi' },
          { id: 'pano', name: 'Pano', slug: 'pano' },
          { id: 'silgi', name: 'Silgi', slug: 'silgi' },
          { id: 'makas', name: 'Makas', slug: 'makas' },
          { id: 'yapistirici', name: 'Yapıştırıcı', slug: 'yapistirici' },
          { id: 'keceli-kalem', name: 'Keçeli Kalem', slug: 'keceli-kalem' },
          { id: 'fosforlu-kalem', name: 'Fosforlu Kalem', slug: 'fosforlu-kalem' },
          { id: 'uclu-kalem', name: 'Uçlu Kalem', slug: 'uclu-kalem' },
          { id: 'tukenmez-kalem', name: 'Tükenmez Kalem', slug: 'tukenmez-kalem' },
          { id: 'kursun-kalem', name: 'Kurşun Kalem', slug: 'kursun-kalem' },
          { id: 'kalem-kutusu', name: 'Kalem Kutusu', slug: 'kalem-kutusu' },
          { id: 'kalem-ucu', name: 'Kalem Ucu', slug: 'kalem-ucu' },
          { id: 'tahta-kalemi', name: 'Tahta Kalemi', slug: 'tahta-kalemi' },
          { id: 'teknik-cizim-kalemi', name: 'Teknik Çizim Kalemi', slug: 'teknik-cizim-kalemi' }
        ]
      },
      {
        id: 'ofis-malzemeleri',
        name: 'Ofis Malzemeleri',
        slug: 'ofis-malzemeleri',
        children: [
          { id: 'fotokopi-kagidi', name: 'Fotokopi Kağıdı', slug: 'fotokopi-kagidi' },
          { id: 'pil-sarc-cihazi', name: 'Pil & Şarj Cihazı', slug: 'pil-sarc-cihazi' },
          { id: 'yazarkasa-terazi', name: 'Yazarkasa ve Terazi', slug: 'yazarkasa-terazi' },
          { id: 'hesap-makinesi', name: 'Hesap Makinesi', slug: 'hesap-makinesi' },
          { id: 'dosya-klasor', name: 'Dosya & Klasör', slug: 'dosya-klasor' },
          { id: 'zimba-delgec', name: 'Zımba & Delgeç', slug: 'zimba-delgec' },
          { id: 'para-sayma-makinesi', name: 'Para Sayma Makinesi', slug: 'para-sayma-makinesi' },
          { id: 'ciltleme-makinesi', name: 'Ciltleme Makinesi', slug: 'ciltleme-makinesi' },
          { id: 'ofis-sarf-tuketim', name: 'Ofis Sarf Tüketim', slug: 'ofis-sarf-tuketim' }
        ]
      },
      {
        id: 'sanatsal-malzemeler',
        name: 'Sanatsal Malzemeler',
        slug: 'sanatsal-malzemeler',
        children: [
          { id: 'akrilik-boya', name: 'Akrilik Boya', slug: 'akrilik-boya' },
          { id: 'tuval-sovale', name: 'Tuval & Şövale', slug: 'tuval-sovale' },
          { id: 'sanatsal-kagit', name: 'Sanatsal Kağıt', slug: 'sanatsal-kagit' },
          { id: 'kuru-boya-kalemi', name: 'Kuru Boya Kalemi', slug: 'kuru-boya-kalemi' },
          { id: 'firca', name: 'Fırça', slug: 'firca' },
          { id: 'kumas-boyasi', name: 'Kumaş Boyası', slug: 'kumas-boyasi' },
          { id: 'pastel-boya', name: 'Pastel Boya', slug: 'pastel-boya' },
          { id: 'sulu-boya', name: 'Sulu Boya', slug: 'sulu-boya' },
          { id: 'ahsup-boyasi', name: 'Ahşap Boyası', slug: 'ahsup-boyasi' }
        ]
      },
      {
        id: 'egitim-kitaplari',
        name: 'Eğitim Kitapları',
        slug: 'egitim-kitaplari',
        children: [
          { id: 'sinav-hazirlik', name: 'Sınav Hazırlık', slug: 'sinav-hazirlik' },
          { id: 'tyt-ayt', name: 'TYT & AYT', slug: 'tyt-ayt' },
          { id: 'kpss', name: 'KPSS', slug: 'kpss' },
          { id: 'lgs', name: 'LGS', slug: 'lgs' },
          { id: 'ders-yardimci-kitaplar', name: 'Ders ve Yardımcı Kitaplar', slug: 'ders-yardimci-kitaplar' },
          { id: 'tarih', name: 'Tarih', slug: 'tarih' },
          { id: 'guncel-genel-konular', name: 'Güncel - Genel Konular', slug: 'guncel-genel-konular' },
          { id: 'sozluk-imla-kilavuzu', name: 'Sözlük & İmla Kılavuzu', slug: 'sozluk-imla-kilavuzu' },
          { id: 'tip-kitabi', name: 'Tıp Kitabı', slug: 'tip-kitabi' },
          { id: 'bilim-teknik-muhendislik', name: 'Bilim & Teknik & Mühendislik Kitapları', slug: 'bilim-teknik-muhendislik' },
          { id: 'hukuk-kitabi', name: 'Hukuk Kitabı', slug: 'hukuk-kitabi' },
          { id: 'e-kitap-okuyucu', name: 'E-Kitap Okuyucu', slug: 'e-kitap-okuyucu' },
          { id: 'yabanci-dil-egitimi', name: 'Yabancı Dil Eğitimi', slug: 'yabanci-dil-egitimi' }
        ]
      },
      {
        id: 'edebiyat-kurgu-kitaplari',
        name: 'Edebiyat ve Kurgu Kitapları',
        slug: 'edebiyat-kurgu-kitaplari',
        children: [
          { id: 'roman', name: 'Roman', slug: 'roman' },
          { id: 'dunya-edebiyati', name: 'Dünya Edebiyatı', slug: 'dunya-edebiyati' },
          { id: 'turk-edebiyati', name: 'Türk Edebiyatı', slug: 'turk-edebiyati' },
          { id: 'deneme-inceleme', name: 'Deneme & İnceleme', slug: 'deneme-inceleme' },
          { id: 'biyografi', name: 'Biyografi', slug: 'biyografi' },
          { id: 'siir', name: 'Şiir', slug: 'siir' },
          { id: 'ani-gunluk-seyahat', name: 'Anı & Günlük & Seyahat Kitapları', slug: 'ani-gunluk-seyahat' },
          { id: 'yabanci-dil-roman', name: 'Yabancı Dil Roman', slug: 'yabanci-dil-roman' },
          { id: 'cizgi-roman', name: 'Çizgi Roman', slug: 'cizgi-roman' }
        ]
      },
      {
        id: 'cocuk-gelisim-kitaplari',
        name: 'Çocuk ve Gelişim Kitapları',
        slug: 'cocuk-gelisim-kitaplari',
        children: [
          { id: 'bireysel-gelisim', name: 'Bireysel Gelişim', slug: 'bireysel-gelisim' },
          { id: 'yabanci-dil-cocuk-kitaplari', name: 'Yabancı Dil Çocuk Kitapları', slug: 'yabanci-dil-cocuk-kitaplari' },
          { id: 'aktivite-egitici-kitaplar', name: 'Aktivite & Eğitici Kitaplar', slug: 'aktivite-egitici-kitaplar' },
          { id: 'cocuk-masal-oyku', name: 'Çocuk Masal ve Öykü Kitapları', slug: 'cocuk-masal-oyku' },
          { id: 'cocuk-bakimi-ebeveyn', name: 'Çocuk Bakımı & Ebeveyn Kitapları', slug: 'cocuk-bakimi-ebeveyn' },
          { id: 'boyama-kitaplari', name: 'Boyama Kitapları', slug: 'boyama-kitaplari' },
          { id: 'sesli-cocuk-kitaplari', name: 'Sesli Çocuk Kitapları', slug: 'sesli-cocuk-kitaplari' }
        ]
      }
    ]
  }
};

const KitapKirtasiyeHobiStaticCategoryDetail = ({
  categorySlug,
  categories,
  navigationLinks = [],
  menuSections,
}: KitapKirtasiyeHobiStaticCategoryDetailProps) => {
  const fallbackCategory = kitapKirtasiyeHobiStaticCategoryData[categorySlug] || null;
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

export default KitapKirtasiyeHobiStaticCategoryDetail;

