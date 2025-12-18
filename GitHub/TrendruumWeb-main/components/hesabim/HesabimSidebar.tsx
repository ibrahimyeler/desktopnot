"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HesabimSidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Siparişlerim', path: '/hesabim/siparislerim' },
    { name: 'Değerlendirmelerim', path: '/hesabim/degerlendirmelerim' },
    { name: 'Mesajlarım', path: '/hesabim/mesajlarim' },
    { name: 'Kullanıcı Bilgilerim', path: '/hesabim/kullanici-bilgilerim' },
    { name: 'Adreslerim', path: '/hesabim/adreslerim' },
    { name: 'Favorilerim', path: '/hesabim/favoriler' },
    { name: 'Kuponlarım', path: '/hesabim/kuponlarim' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Hesabım</h2>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-4 py-2 rounded-md text-sm transition-colors ${
                  pathname === item.path
                    ? 'bg-orange-50 text-orange-500'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default HesabimSidebar; 