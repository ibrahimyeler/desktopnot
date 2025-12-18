"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HiHome, 
  HiHeart, 
  HiShoppingCart, 
  HiBell, 
  HiUser 
} from 'react-icons/hi2';
import { useBasket } from '@/app/context/BasketContext';
import { useFavorites } from '@/app/context/FavoriteContext';

const MobileTabNavigator = () => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { totalQuantity = 0 } = useBasket();
  const { favoritesCount = 0 } = useFavorites();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Login, register ve şifremi unuttum sayfalarında tab navigator'ı gizle
  const hiddenPaths = ['/giris', '/kayit-ol', '/sifremi-unuttum'];
  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const tabs = [
    {
      name: 'Sayfam',
      href: '/',
      icon: HiHome,
    },
    {
      name: 'Favoriler',
      href: '/hesabim/favoriler',
      icon: HiHeart,
      badgeCount: favoritesCount,
    },
    {
      name: 'Sepetim',
      href: '/sepet',
      icon: HiShoppingCart,
      badgeCount: totalQuantity,
    },
    {
      name: 'Bildirimlerim',
      href: '/hesabim/mesajlarim',
      icon: HiBell,
    },
    {
      name: 'Hesabım',
      href: '/hesabim',
      icon: HiUser,
    },
  ];

  // Hydration sırasında server ve client arasında farklılık olmaması için
  if (!mounted) {
    return (
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-[99998]"
        data-component="mobile-tab-navigator"
        style={{
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          isolation: 'isolate',
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="flex justify-around items-center py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const badgeCount = tab.badgeCount ?? 0;
            return (
            <div key={tab.name} className="flex flex-col items-center py-1 px-2">
                <div className="text-gray-400 relative">
                  <Icon className="w-6 h-6" />
                  {badgeCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border border-white shadow leading-none">
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  )}
              </div>
              <span className="text-xs font-medium mt-1 text-gray-400">
                {tab.name}
              </span>
            </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-[99998]"
      data-component="mobile-tab-navigator"
      style={{
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        isolation: 'isolate',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden'
      }}
    >
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          const badgeCount = tab.badgeCount ?? 0;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center py-1 px-2"
              data-clarity-region="ignore"
            >
              <div className={`${isActive ? 'text-orange-500' : 'text-gray-400'} relative`}>
                <Icon className="w-6 h-6" />
                {badgeCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border border-white shadow leading-none">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium mt-1 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileTabNavigator;
