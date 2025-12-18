"use client";

import Link from 'next/link';
import { 
  UserIcon,
  MapPinIcon,
  BellIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

const AccountHelp = () => {
  const menuItems = [
    { name: 'Kullanıcı Bilgilerim', href: '/hesabim/kullanici-bilgilerim', icon: UserIcon },
    { name: 'Adres Bilgilerim', href: '/hesabim/adres-bilgilerim', icon: MapPinIcon },
    { name: 'Duyuru Tercihlerim', href: '/hesabiö/bildirimler', icon: BellIcon },
    { name: 'Yardım', href: '/hesabim/yardim', icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Hesabım & Yardım</h3>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-50 hover:text-orange-500 transition-colors"
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default AccountHelp; 