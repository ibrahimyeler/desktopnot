"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  ShoppingBagIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  TagIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  GiftIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { API_V1_URL } from '@/lib/config';

interface MenuItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface FollowedStore {
  id: string;
  name: string;
  follow_count: number;
  updated_at: string;
  created_at: string;
}

const AccountMenu = () => {
  const pathname = usePathname();
  const [followedStores, setFollowedStores] = useState<FollowedStore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedStores = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_V1_URL}/customer/follows`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();
        if (data.meta?.status === 'success') {
          setFollowedStores(data.data || []);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedStores();
  }, []);

  const menuItems: MenuSection[] = [
    {
      title: 'Siparişlerim',
      items: [
        { name: 'Tüm Siparişlerim', href: '/hesabim/siparislerim', icon: ShoppingBagIcon },
        { name: 'Değerlendirmelerim', href: '/hesabim/degerlendirmelerim', icon: ChatBubbleLeftIcon },
        { name: 'Satıcı Mesajlarım', href: '/hesabim/mesajlarim', icon: ChatBubbleLeftIcon },
        { name: 'Tekrar Satın Al', href: '/hesabim/tekrar-al', icon: ArrowPathIcon },
      ]
    },
    {
      title: 'Sana Özel',
      items: [
        { name: 'İndirim Kuponlarım', href: '/account/coupons', icon: TagIcon },
        { name: 'Önceden Gezdiklerim', href: '/account/recently-viewed', icon: ClockIcon },
        { 
          name: 'Takip Ettiğim Mağazalar', 
          href: '/account/followed-stores', 
          icon: BuildingStorefrontIcon,
          badge: followedStores.length > 0 ? `${followedStores.length}` : undefined
        },
        { name: 'Trendruum Elite', href: '/account/elite', icon: IdentificationIcon },
      ]
    },
    {
      title: 'Hizmetlerim',
      items: [
        { 
          name: 'Krediler', 
          href: '/account/credits', 
          icon: CreditCardIcon,
          badge: '% Faiz Fırsatı'
        },
        { 
          name: 'Şanslı Çekiliş', 
          href: '/account/lottery', 
          icon: GiftIcon,
          badge: 'YENİ'
        },
        { 
          name: 'QNB Trendruum', 
          href: '/account/qnb', 
          icon: CreditCardIcon,
          badge: 'YENİ'
        },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {localStorage.getItem('userName') || 'Hesabım'}
        </h2>
      </div>

      {menuItems.map((section, idx) => (
        <div key={section.title} className={`mb-6 ${idx !== 0 ? 'mt-8' : ''}`}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">{section.title}</h3>
          <nav className="space-y-2">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors
                    ${isActive 
                      ? 'text-orange-500 bg-orange-50' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                  {item.badge ? (
                    <span
                      className={`ml-auto text-xs px-2 py-1 rounded-full ${
                        item.badge === "YENİ"
                          ? "bg-red-500 text-white"
                          : item.badge === "% Faiz Fırsatı"
                          ? "bg-orange-100 text-orange-500"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}

      {/* Takip Edilen Mağazalar Önizleme */}
      {followedStores.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Takip Ettiğin Mağazalar</h3>
          <div className="space-y-2">
            {followedStores.slice(0, 3).map((store) => (
              <div key={store.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <span className="text-sm text-gray-700 truncate">{store.name}</span>
                <span className="text-xs text-gray-500">{store.follow_count} takipçi</span>
              </div>
            ))}
            {followedStores.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{followedStores.length - 3} mağaza daha
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
