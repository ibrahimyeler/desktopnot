"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBagIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  CreditCardIcon,
  UserIcon,
  MapPinIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  ChatBubbleOvalLeftIcon,
  ClockIcon,
  BuildingStorefrontIcon,
  TrashIcon,
  TagIcon
} from '@heroicons/react/24/outline';

import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import DeleteAccountModal from './DeleteAccountModal';
import TrendruumAsistanModal from '@/components/common/TrendruumAsistanModal';
import MinimizedAsistanButton from '@/components/common/MinimizedAsistanButton';

interface AccountSidebarProps {
  onItemClick?: () => void;
}

const AccountSidebar = ({ onItemClick }: AccountSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAsistanModal, setShowAsistanModal] = useState(false);
  const [isAsistanMinimized, setIsAsistanMinimized] = useState(false);
  
  // Kullanıcı adı ve soyadını al
  const getUserDisplayName = () => {
    if (user && user.name && user.lastname) {
      return `${user.name} ${user.lastname}`;
    } else if (user && user.name) {
      return user.name;
    } else {
      return 'Giriş yapılmamış';
    }
  };

  // Kullanıcı baş harflerini al
  const getUserInitials = () => {
    if (user && user.name && user.lastname) {
      return `${user.name.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();
    } else if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    } else {
      return '?';
    }
  };



  // Default active state for "Tüm Siparişlerim"
  const isActive = (href: string) => {
    if (href === '/hesabim/siparislerim' && pathname === '/hesabim') {
      return true;
    }
    return pathname === href;
  };

  const menuSections = [
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
        { name: 'İndirim Kuponlarım', href: '/hesabim/kuponlarim', icon: TagIcon },
        { name: 'Önceden Gezdiklerim', href: '/hesabim/onceden-gezdiklerim', icon: ClockIcon },
        { name: 'Takip Ettiğim Mağazalar', href: '/hesabim/takip-ettigim-magazalar', icon: BuildingStorefrontIcon },
      ]
    },
    {
      title: 'Hesabım & Yardım',
      items: [
        { name: 'Kullanıcı Bilgilerim', href: '/hesabim/kullanici-bilgilerim', icon: UserIcon },
        { name: 'Adres Bilgilerim', href: '/hesabim/adres-bilgilerim', icon: MapPinIcon },
        { name: 'Duyuru Tercihlerim', href: '/hesabim/duyuru-tercihlerim', icon: BellIcon },
      ]
    }
  ];

  // Mobile için ayrı render
  if (onItemClick) {
    return (
      <>
        <div className="w-full space-y-2">
          {/* Kullanıcı Bilgisi */}
          <div className="bg-white rounded-lg p-3 border-b border-gray-200 -mx-4 -mt-4 mb-2">
            <div className="flex items-center space-x-3">
              {/* Kullanıcı Avatar */}
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 text-sm font-semibold">{getUserInitials()}</span>
              </div>
              {/* Kullanıcı Ad Soyad */}
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-900 truncate">{getUserDisplayName()}</h2>
              </div>
            </div>
          </div>

          {/* Menü Bölümleri */}
          {menuSections.map((section) => (
            <div key={section.title} className="bg-white rounded-lg p-3">
              <h3 className="text-[11px] font-semibold text-gray-900 mb-2">{section.title}</h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onItemClick}
                      className={`flex items-center px-1.5 py-1 text-[11px] rounded-md transition-colors
                        ${active 
                          ? 'text-orange-500 bg-orange-50' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5 mr-1.5" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}

          {/* Hesap İşlemleri */}
          <div className="bg-white rounded-lg p-3 space-y-1">
            <button
              onClick={() => {
                setShowAsistanModal(true);
                setIsAsistanMinimized(false);
              }}
              className="flex items-center w-full px-1.5 py-1 text-[11px] rounded-md transition-colors text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            >
              <ChatBubbleOvalLeftIcon className="w-3.5 h-3.5 mr-1.5" />
              <span className="truncate">Trendruum Asistan</span>
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center w-full px-1.5 py-1 text-[11px] rounded-md transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <TrashIcon className="w-3.5 h-3.5 mr-1.5" />
              <span className="truncate">Hesabı Sil</span>
            </button>
          </div>
        </div>
        
              {/* Trendruum Asistan Modal */}
      <TrendruumAsistanModal 
        isOpen={showAsistanModal} 
        onClose={() => setShowAsistanModal(false)}
        onMinimize={() => {
          setShowAsistanModal(false);
          setIsAsistanMinimized(true);
        }}
      />
      
      
        
        {/* Delete Account Modal */}
        <DeleteAccountModal 
          isOpen={showDeleteModal} 
          onClose={() => setShowDeleteModal(false)} 
        />
      </>
    );
  }

  // Desktop için sticky positioned sidebar - scroll ile yukarı çıkar - Genişletilmiş
  return (
    <>
      <div className="w-64 xl:w-72 space-y-2 sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto z-10" style={{ marginTop: '0px' }}>
        {/* Kullanıcı Bilgisi */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center space-x-3">
            {/* Kullanıcı Avatar */}
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
            </div>
            {/* Kullanıcı Ad Soyad */}
            <div className="flex-1">
              <h2 className="text-base font-semibold text-gray-900 truncate">{getUserDisplayName()}</h2>
            </div>
          </div>
        </div>

        {/* Menü Bölümleri */}
        {menuSections.map((section) => (
          <div key={section.title} className="bg-white rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{section.title}</h3>
            <nav className="space-y-1.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onItemClick}
                    className={`flex items-center px-2 py-1.5 text-xs rounded-md transition-colors
                      ${active 
                        ? 'text-orange-500 bg-orange-50' 
                        : 'text-gray-700 hover:bg-gray-50 hover:text-orange-500'
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-2.5" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Hesap İşlemleri */}
        <div className="bg-white rounded-lg p-4 space-y-1.5">
          <button
            onClick={() => {
              setShowAsistanModal(true);
              setIsAsistanMinimized(false);
            }}
            className="flex items-center w-full px-2 py-1.5 text-xs rounded-md transition-colors text-orange-600 hover:bg-orange-50 hover:text-orange-700"
          >
            <ChatBubbleOvalLeftIcon className="w-4 h-4 mr-2.5" />
            <span className="truncate">Trendruum Asistan</span>
          </button>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center w-full px-2 py-1.5 text-xs rounded-md transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <TrashIcon className="w-4 h-4 mr-2.5" />
            <span className="truncate">Hesabı Sil</span>
          </button>
        </div>
      </div>
      
      {/* Trendruum Asistan Modal */}
      <TrendruumAsistanModal 
        isOpen={showAsistanModal} 
        onClose={() => setShowAsistanModal(false)}
        onMinimize={() => {
          setShowAsistanModal(false);
          setIsAsistanMinimized(true);
        }}
      />
      
      {/* Minimized Asistan Button */}
      {isAsistanMinimized && (
        <MinimizedAsistanButton 
          onMaximize={() => {
            setShowAsistanModal(true);
            setIsAsistanMinimized(false);
          }}
        />
      )}
      
      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)} 
      />
    </>
  );
};

export default AccountSidebar;
