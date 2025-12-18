'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchMenus, type MenuItem } from '../../services/menuService';

export default function YardimMenu() {
  const pathname = usePathname();
  const [yardimMenu, setYardimMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const { yardimMenu } = await fetchMenus();
        setYardimMenu(yardimMenu);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  // Fallback static menu items if API fails
  const fallbackMenuItems = [
    {
      id: { $oid: '1' },
      name: 'Popüler Sorular',
      url: '/yardim-destek',
      type: 'custom',
      slug: 'populer-sorular'
    },
    {
      id: { $oid: '2' },
      name: 'İade',
      url: '/yardim-destek/iade',
      type: 'custom',
      slug: 'iade'
    },
    {
      id: { $oid: '3' },
      name: 'Kargo ve Teslimat',
      url: '/yardim-destek/kargo-teslimat',
      type: 'custom',
      slug: 'kargo-teslimat'
    },
    {
      id: { $oid: '4' },
      name: 'Siparişler',
      url: '/yardim-destek/siparisler',
      type: 'custom',
      slug: 'siparisler'
    },
    {
      id: { $oid: '5' },
      name: 'trendruum.com Hakkında',
      url: '/yardim-destek/hakkinda',
      type: 'custom',
      slug: 'hakkinda'
    },
    {
      id: { $oid: '6' },
      name: 'Hesabım',
      url: '/yardim-destek/hesabim',
      type: 'custom',
      slug: 'hesabim'
    },
    {
      id: { $oid: '7' },
      name: 'Ürün & Alışveriş',
      url: '/yardim-destek/urun-alisveris',
      type: 'custom',
      slug: 'urun-alisveris'
    },
    {
      id: { $oid: '8' },
      name: 'İşlem Rehberi',
      url: '/yardim-destek/islem-rehberi',
      type: 'custom',
      slug: 'islem-rehberi'
    },
    {
      id: { $oid: '9' },
      name: 'Hızlı Market',
      url: '/yardim-destek/hizli-market',
      type: 'custom',
      slug: 'hizli-market'
    },
    {
      id: { $oid: '10' },
      name: 'Trendruum Yemek',
      url: '/yardim-destek/yemek',
      type: 'custom',
      slug: 'yemek'
    },
    {
      id: { $oid: '11' },
      name: 'İletişim',
      url: '/yardim-destek/iletisim',
      type: 'custom',
      slug: 'iletisim'
    },
    {
      id: { $oid: '12' },
      name: "Trendruum'da Güvenlik",
      url: '/yardim-destek/guvenlik',
      type: 'custom',
      slug: 'guvenlik'
    },
    {
      id: { $oid: '13' },
      name: 'Dolap nedir? Nasıl Kullanılır?',
      url: '/yardim-destek/dolap',
      type: 'custom',
      slug: 'dolap'
    },
    {
      id: { $oid: '14' },
      name: 'Şanslı Çekiliş',
      url: '/yardim-destek/cekilis',
      type: 'custom',
      slug: 'cekilis'
    }
  ];

  const menuItems = yardimMenu.length > 0 ? yardimMenu : fallbackMenuItems;

  return (
    <div className="w-64 bg-white rounded-lg border p-4">
      <h2 className="text-xl font-medium mb-4 text-gray-900">Yardım</h2>
      <nav>
        <ul className="space-y-2">
          {loading ? (
            // Loading skeleton
            [...Array(8)].map((_, i) => (
              <li key={i}>
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              </li>
            ))
          ) : (
            menuItems.map((item) => (
              <li key={item.id.$oid}>
                <Link
                  href={item.url.startsWith('http') ? item.url : item.url}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    pathname === item.url
                      ? 'bg-orange-50 text-[#F27A1A]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  target={item.url.startsWith('http') ? '_blank' : '_self'}
                >
                  {item.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      </nav>
    </div>
  );
} 